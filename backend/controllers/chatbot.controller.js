const aiService = require('../services/aiServiceOffline');
const db = require('../config/database');

class ChatbotController {

  /**
   * Envía mensaje al chatbot
   */
  async sendMessage(req, res) {
    try {
      const { message, userId } = req.body;

      if (!message || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Mensaje y userId son requeridos'
        });
      }

      // Obtener contexto del usuario desde la BD
      const userContext = await this.getUserContext(userId);

      // Procesar mensaje con IA
      const aiResponse = await aiService.generateEmpatheticResponse(
        message,
        userId,
        userContext
      );

      // Guardar conversación en BD
      await this.saveConversation(userId, message, aiResponse.response);

      // Si hay crisis, crear notificación urgente
      if (aiResponse.crisis.isCrisis) {
        await this.createCrisisNotification(userId, aiResponse.crisis);
      }

      res.json({
        success: true,
        data: {
          response: aiResponse.response,
          sentiment: aiResponse.sentiment,
          crisis: aiResponse.crisis,
          recommendations: aiResponse.recommendations,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Error en sendMessage:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  /**
   * Obtiene historial de conversación
   */
  async getConversationHistory(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 20 } = req.query;

      const [conversations] = await db.execute(`
        SELECT
          id,
          user_message,
          ai_response,
          sentiment_score,
          crisis_detected,
          created_at
        FROM chatbot_conversations
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?
      `, [userId, parseInt(limit)]);

      res.json({
        success: true,
        data: conversations.reverse() // Más recientes al final
      });

    } catch (error) {
      console.error('Error en getConversationHistory:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener historial'
      });
    }
  }

  /**
   * Obtiene estadísticas del chatbot
   */
  async getChatbotStats(req, res) {
    try {
      const { userId } = req.params;

      const [stats] = await db.execute(`
        SELECT
          COUNT(*) as total_messages,
          AVG(sentiment_score) as avg_sentiment,
          COUNT(CASE WHEN crisis_detected = 1 THEN 1 END) as crisis_count,
          MAX(created_at) as last_conversation
        FROM chatbot_conversations
        WHERE user_id = ?
      `, [userId]);

      const aiStats = aiService.getConversationStats(userId);

      res.json({
        success: true,
        data: {
          ...stats[0],
          aiStats
        }
      });

    } catch (error) {
      console.error('Error en getChatbotStats:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas'
      });
    }
  }

  /**
   * Limpia historial de conversación
   */
  async clearHistory(req, res) {
    try {
      const { userId } = req.params;

      await db.execute(
        'DELETE FROM chatbot_conversations WHERE user_id = ?',
        [userId]
      );

      // Limpiar también del servicio de IA
      aiService.clearUserHistory(userId);

      res.json({
        success: true,
        message: 'Historial limpiado exitosamente'
      });

    } catch (error) {
      console.error('Error en clearHistory:', error);
      res.status(500).json({
        success: false,
        message: 'Error al limpiar historial'
      });
    }
  }

  /**
   * Obtiene contexto del usuario
   */
  async getUserContext(userId) {
    try {
      const [userData] = await db.execute(`
        SELECT
          u.nombre,
          u.ultimo_acceso,
          up.nivel_animo,
          up.nivel_estres,
          up.nivel_ansiedad,
          up.fecha as last_progress_date
        FROM users u
        LEFT JOIN user_progress up ON u.id = up.user_id
        WHERE u.id = ?
        ORDER BY up.fecha DESC
        LIMIT 1
      `, [userId]);

      const [recentSessions] = await db.execute(`
        SELECT
          emotional_state_inicio_id,
          emotional_state_fin_id,
          fecha_inicio,
          duracion_minutos
        FROM user_sessions
        WHERE user_id = ?
        ORDER BY fecha_inicio DESC
        LIMIT 5
      `, [userId]);

      return {
        user: userData[0] || {},
        recentSessions: recentSessions || [],
        lastActivity: userData[0]?.ultimo_acceso || null
      };

    } catch (error) {
      console.error('Error obteniendo contexto del usuario:', error);
      return {};
    }
  }

  /**
   * Guarda conversación en BD
   */
  async saveConversation(userId, userMessage, aiResponse) {
    try {
      const sentiment = aiService.analyzeSentiment(userMessage);
      const crisis = aiService.detectCrisis(userMessage, sentiment);

      await db.execute(`
        INSERT INTO chatbot_conversations (
          user_id,
          user_message,
          ai_response,
          sentiment_score,
          crisis_detected,
          created_at
        ) VALUES (?, ?, ?, ?, ?, NOW())
      `, [
        userId,
        userMessage,
        aiResponse,
        sentiment.comparative,
        crisis.isCrisis ? 1 : 0
      ]);

    } catch (error) {
      console.error('Error guardando conversación:', error);
    }
  }

  /**
   * Crea notificación de crisis
   */
  async createCrisisNotification(userId, crisisData) {
    try {
      const crisisMessages = {
        high: 'Se ha detectado una posible crisis emocional. Por favor, contacta líneas de ayuda inmediatamente.',
        medium: 'Se ha detectado un estado emocional muy bajo. Te recomendamos buscar apoyo profesional.',
        low: 'Notamos que estás pasando por un momento difícil. Estamos aquí para apoyarte.'
      };

      await db.execute(`
        INSERT INTO notifications (
          user_id,
          titulo,
          mensaje,
          tipo,
          fecha_creacion
        ) VALUES (?, ?, ?, 'sistema', NOW())
      `, [
        userId,
        '🚨 Apoyo Emocional',
        crisisMessages[crisisData.severity] || crisisMessages.medium
      ]);

    } catch (error) {
      console.error('Error creando notificación de crisis:', error);
    }
  }

  /**
   * Obtiene recursos de crisis
   */
  async getCrisisResources(req, res) {
    try {
      const crisisResources = {
        peru: {
          line: 'Línea 113 - Salud Mental',
          phone: '113',
          whatsapp: '+51 999 999 999',
          hours: '24/7'
        },
        mexico: {
          line: 'Línea de la Vida',
          phone: '800 911 2000',
          whatsapp: '+52 55 1234 5678',
          hours: '24/7'
        },
        usa: {
          line: 'National Suicide Prevention Lifeline',
          phone: '988',
          whatsapp: '+1 800 273 8255',
          hours: '24/7'
        },
        españa: {
          line: 'Teléfono de la Esperanza',
          phone: '717 003 717',
          whatsapp: '+34 717 003 717',
          hours: '24/7'
        }
      };

      res.json({
        success: true,
        data: {
          resources: crisisResources,
          message: 'Recuerda: No estás solo. Hay personas que pueden ayudarte.',
          emergency: 'Si estás en peligro inmediato, llama al 911 o acude a emergencias.'
        }
      });

    } catch (error) {
      console.error('Error obteniendo recursos de crisis:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener recursos'
      });
    }
  }
}

module.exports = new ChatbotController();
