const OpenAI = require('openai');
const Sentiment = require('sentiment');
const natural = require('natural');

// Configurar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'tu-api-key-aqui'
});

// Configurar análisis de sentimientos
const sentiment = new Sentiment();

class AIService {
  constructor() {
    this.conversationHistory = new Map(); // Almacenar historial por usuario
  }

  /**
   * Analiza el sentimiento del texto del usuario
   */
  analyzeSentiment(text) {
    const result = sentiment.analyze(text);

    return {
      score: result.score,
      comparative: result.comparative,
      positive: result.positive,
      negative: result.negative,
      emotion: this.getEmotionFromScore(result.comparative)
    };
  }

  /**
   * Determina la emoción basada en el score de sentimiento
   */
  getEmotionFromScore(score) {
    if (score >= 0.5) return 'muy_positivo';
    if (score >= 0.1) return 'positivo';
    if (score >= -0.1) return 'neutral';
    if (score >= -0.5) return 'negativo';
    return 'muy_negativo';
  }

  /**
   * Detecta si el usuario está en crisis
   */
  detectCrisis(text, sentiment) {
    const crisisKeywords = [
      'suicidio', 'suicidar', 'matar', 'morir', 'acabar', 'terminar',
      'no puedo más', 'no aguanto', 'quiero desaparecer', 'no valgo',
      'soy una carga', 'nadie me quiere', 'estoy solo', 'no tengo salida'
    ];

    const lowerText = text.toLowerCase();
    const hasCrisisKeywords = crisisKeywords.some(keyword =>
      lowerText.includes(keyword)
    );

    return {
      isCrisis: hasCrisisKeywords || sentiment.score < -3,
      severity: hasCrisisKeywords ? 'high' : sentiment.score < -2 ? 'medium' : 'low',
      keywords: crisisKeywords.filter(keyword => lowerText.includes(keyword))
    };
  }

  /**
   * Genera respuesta empática usando OpenAI
   */
  async generateEmpatheticResponse(userMessage, userId, userContext = {}) {
    try {
      // Obtener historial de conversación
      const history = this.conversationHistory.get(userId) || [];

      // Analizar sentimiento
      const sentiment = this.analyzeSentiment(userMessage);

      // Detectar crisis
      const crisis = this.detectCrisis(userMessage, sentiment);

      // Crear prompt contextual
      const systemPrompt = this.createSystemPrompt(userContext, sentiment, crisis);

      // Preparar mensajes para OpenAI
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-6), // Últimos 6 mensajes para contexto
        { role: 'user', content: userMessage }
      ];

      // Llamar a OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const response = completion.choices[0].message.content;

      // Guardar en historial
      this.updateConversationHistory(userId, userMessage, response);

      return {
        response,
        sentiment,
        crisis,
        recommendations: this.generateRecommendations(sentiment, crisis, userContext)
      };

    } catch (error) {
      console.error('Error en AI Service:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  /**
   * Crea prompt del sistema para el chatbot
   */
  createSystemPrompt(userContext, sentiment, crisis) {
    let prompt = `Eres un asistente virtual especializado en salud mental. Tu personalidad es:
- Empático y comprensivo
- Profesional pero cálido
- No juzgas, solo escuchas y apoyas
- Usas técnicas de TCC (Terapia Cognitivo-Conductual)
- Siempre priorizas la seguridad del usuario

CONTEXTO DEL USUARIO:
- Estado emocional actual: ${sentiment.emotion}
- Nivel de crisis: ${crisis.severity}
- Última actividad: ${userContext.lastActivity || 'No disponible'}

REGLAS IMPORTANTES:
1. Si detectas crisis (palabras de suicidio, autolesión), responde con URGENCIA y ofrece recursos de crisis
2. Si el usuario está muy triste/ansioso, usa técnicas de grounding y respiración
3. Si está motivado, refuerza positivamente y sugiere actividades
4. Mantén respuestas entre 50-150 palabras
5. Termina con una pregunta empática para continuar la conversación

RESPUESTA:`;

    if (crisis.isCrisis) {
      prompt += `

🚨 CRISIS DETECTADA - RESPUESTA URGENTE:
- Valida sus sentimientos
- Ofrece recursos de crisis inmediatos
- Sugiere contactar líneas de ayuda
- Mantén un tono calmante pero urgente`;
    }

    return prompt;
  }

  /**
   * Genera recomendaciones basadas en el análisis
   */
  generateRecommendations(sentiment, crisis, userContext) {
    const recommendations = [];

    if (crisis.isCrisis) {
      recommendations.push({
        type: 'crisis',
        title: 'Recursos de Crisis',
        description: 'Contacta líneas de ayuda inmediatamente',
        action: 'emergency_contact',
        priority: 'high'
      });
    }

    if (sentiment.emotion === 'muy_negativo' || sentiment.emotion === 'negativo') {
      recommendations.push({
        type: 'exercise',
        title: 'Ejercicio de Grounding 5-4-3-2-1',
        description: 'Técnica para calmar la ansiedad',
        action: 'grounding_exercise',
        priority: 'high'
      });
    }

    if (sentiment.emotion === 'ansioso' || sentiment.emotion === 'estresado') {
      recommendations.push({
        type: 'breathing',
        title: 'Respiración 4-7-8',
        description: 'Técnica de respiración para calmar',
        action: 'breathing_exercise',
        priority: 'medium'
      });
    }

    if (sentiment.emotion === 'triste' || sentiment.emotion === 'deprimido') {
      recommendations.push({
        type: 'activity',
        title: 'Actividad de Activación Conductual',
        description: 'Planifica una actividad que disfrutes',
        action: 'behavioral_activation',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  /**
   * Actualiza el historial de conversación
   */
  updateConversationHistory(userId, userMessage, aiResponse) {
    const history = this.conversationHistory.get(userId) || [];

    history.push(
      { role: 'user', content: userMessage },
      { role: 'assistant', content: aiResponse }
    );

    // Mantener solo los últimos 10 intercambios
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    this.conversationHistory.set(userId, history);
  }

  /**
   * Respuesta de respaldo si falla la IA
   */
  getFallbackResponse(userMessage) {
    const fallbackResponses = [
      "Entiendo que estás pasando por un momento difícil. Estoy aquí para escucharte. ¿Podrías contarme más sobre cómo te sientes?",
      "Me importa cómo te sientes. Aunque no puedo resolver todos los problemas, puedo escucharte y apoyarte. ¿Qué te gustaría compartir?",
      "Es valiente de tu parte expresar lo que sientes. Estoy aquí para acompañarte. ¿Cómo puedo ayudarte en este momento?",
      "Reconozco que estás pasando por algo difícil. No estás solo en esto. ¿Te gustaría hablar sobre lo que te preocupa?",
      "Aprecio que confíes en mí para compartir tus sentimientos. Estoy aquí para escucharte sin juzgar. ¿Qué necesitas en este momento?"
    ];

    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    return {
      response: randomResponse,
      sentiment: this.analyzeSentiment(userMessage),
      crisis: this.detectCrisis(userMessage, this.analyzeSentiment(userMessage)),
      recommendations: []
    };
  }

  /**
   * Limpia el historial de un usuario
   */
  clearUserHistory(userId) {
    this.conversationHistory.delete(userId);
  }

  /**
   * Obtiene estadísticas de conversación
   */
  getConversationStats(userId) {
    const history = this.conversationHistory.get(userId) || [];
    const userMessages = history.filter(msg => msg.role === 'user');

    if (userMessages.length === 0) {
      return { messageCount: 0, averageSentiment: 0 };
    }

    const sentiments = userMessages.map(msg => this.analyzeSentiment(msg.content));
    const averageSentiment = sentiments.reduce((sum, s) => sum + s.comparative, 0) / sentiments.length;

    return {
      messageCount: userMessages.length,
      averageSentiment: averageSentiment,
      lastMessage: userMessages[userMessages.length - 1]?.content || null
    };
  }
}

module.exports = new AIService();
