const Sentiment = require('sentiment');
const natural = require('natural');

// Configurar análisis de sentimientos
const sentiment = new Sentiment();

class AIServiceOffline {
  constructor() {
    this.conversationHistory = new Map();
    this.responses = {
      // Respuestas para diferentes emociones
      triste: [
        "Entiendo que estás pasando por un momento difícil. No estás solo en esto. ¿Te gustaría hablar sobre lo que te preocupa?",
        "Reconozco que estás sintiendo tristeza. Es valiente de tu parte expresar lo que sientes. Estoy aquí para escucharte.",
        "La tristeza es una emoción válida y temporal. ¿Hay algo específico que te gustaría compartir conmigo?",
        "Me importa cómo te sientes. Aunque no puedo resolver todos los problemas, puedo escucharte y apoyarte."
      ],
      ansioso: [
        "Entiendo que te sientes ansioso. La ansiedad puede ser abrumadora, pero hay técnicas que pueden ayudarte. ¿Te gustaría que te guíe en un ejercicio de respiración?",
        "La ansiedad es una respuesta natural del cuerpo. Vamos a trabajar juntos para calmarte. ¿Puedes contarme qué te está causando más ansiedad?",
        "Respira conmigo. Inhala lentamente por 4 segundos, mantén por 4, exhala por 4. Repite esto conmigo mientras hablamos.",
        "Es normal sentirse ansioso. Estoy aquí para ayudarte a encontrar calma. ¿Qué te está preocupando más en este momento?"
      ],
      estresado: [
        "El estrés puede ser muy agotador. Vamos a encontrar formas de manejarlo juntos. ¿Qué situaciones te están causando más estrés?",
        "Entiendo que te sientes abrumado por el estrés. Es importante que te tomes tiempo para cuidarte. ¿Hay algo que te ayude a relajarte?",
        "El estrés es una respuesta natural, pero podemos aprender a manejarlo mejor. ¿Te gustaría que te enseñe algunas técnicas de relajación?",
        "Reconozco que estás bajo mucha presión. Vamos a trabajar en estrategias para reducir tu estrés paso a paso."
      ],
      feliz: [
        "¡Qué maravilloso que te sientas feliz! Es genial celebrar estos momentos positivos. ¿Qué te está haciendo sentir tan bien?",
        "Me alegra saber que estás teniendo un buen momento. Los momentos de felicidad son importantes para nuestro bienestar. ¿Te gustaría compartir qué te está haciendo feliz?",
        "Es hermoso ver que tienes energía positiva. ¿Hay algo específico que te gustaría hacer para aprovechar este buen estado de ánimo?",
        "La felicidad es contagiosa y valiosa. ¿Te gustaría que te ayude a mantener este estado positivo?"
      ],
      crisis: [
        "Entiendo que estás pasando por un momento muy difícil. No estás solo. Hay personas que pueden ayudarte inmediatamente. Por favor, contacta: Línea de Crisis 113 o acude a emergencias. Estoy aquí para apoyarte.",
        "Reconozco que estás en una situación muy dolorosa. Es importante que busques ayuda profesional ahora mismo. Llama al 113 o acude a emergencias. No tienes que enfrentar esto solo.",
        "Me preocupa mucho cómo te sientes. Por favor, contacta líneas de ayuda inmediatamente: 113, 911, o acude a emergencias. Hay personas que pueden ayudarte mejor que yo en este momento.",
        "Entiendo tu dolor. Es crucial que busques apoyo profesional ahora. Contacta líneas de crisis: 113, 911, o acude a emergencias. No estás solo en esto."
      ],
      default: [
        "Entiendo lo que me dices. Estoy aquí para escucharte y apoyarte. ¿Podrías contarme más sobre cómo te sientes?",
        "Aprecio que confíes en mí para compartir tus sentimientos. Estoy aquí para acompañarte. ¿Qué necesitas en este momento?",
        "Reconozco que estás pasando por algo importante. Estoy aquí para escucharte sin juzgar. ¿Cómo puedo ayudarte mejor?",
        "Valoro que me compartas lo que sientes. Estoy aquí para apoyarte. ¿Hay algo específico en lo que pueda ayudarte?"
      ]
    };
  }

  /**
   * Analiza el sentimiento del texto
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
   * Determina la emoción basada en el score
   */
  getEmotionFromScore(score) {
    if (score >= 0.5) return 'feliz';
    if (score >= 0.1) return 'positivo';
    if (score >= -0.1) return 'neutral';
    if (score >= -0.5) return 'triste';
    return 'muy_triste';
  }

  /**
   * Detecta si hay crisis
   */
  detectCrisis(text, sentiment) {
    const crisisKeywords = [
      'suicidio', 'suicidar', 'matar', 'morir', 'acabar', 'terminar',
      'no puedo más', 'no aguanto', 'quiero desaparecer', 'no valgo',
      'soy una carga', 'nadie me quiere', 'estoy solo', 'no tengo salida',
      'quiero morir', 'mejor muerto', 'no sirvo', 'soy inútil'
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
   * Genera respuesta empática
   */
  async generateEmpatheticResponse(userMessage, userId, userContext = {}) {
    try {
      // Analizar sentimiento
      const sentiment = this.analyzeSentiment(userMessage);

      // Detectar crisis
      const crisis = this.detectCrisis(userMessage, sentiment);

      // Obtener historial
      const history = this.conversationHistory.get(userId) || [];

      // Determinar tipo de respuesta
      let responseType = 'default';

      if (crisis.isCrisis) {
        responseType = 'crisis';
      } else if (sentiment.emotion === 'feliz' || sentiment.emotion === 'positivo') {
        responseType = 'feliz';
      } else if (userMessage.toLowerCase().includes('ansioso') || userMessage.toLowerCase().includes('ansiedad')) {
        responseType = 'ansioso';
      } else if (userMessage.toLowerCase().includes('estrés') || userMessage.toLowerCase().includes('estresado')) {
        responseType = 'estresado';
      } else if (sentiment.emotion === 'triste' || sentiment.emotion === 'muy_triste') {
        responseType = 'triste';
      }

      // Seleccionar respuesta
      const possibleResponses = this.responses[responseType];
      const response = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];

      // Actualizar historial
      this.updateConversationHistory(userId, userMessage, response);

      return {
        response,
        sentiment,
        crisis,
        recommendations: this.generateRecommendations(sentiment, crisis, userContext, userMessage)
      };

    } catch (error) {
      console.error('Error en AI Service:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  /**
   * Genera recomendaciones
   */
  generateRecommendations(sentiment, crisis, userContext, userMessage = '') {
    const recommendations = [];

    if (crisis.isCrisis) {
      recommendations.push({
        type: 'crisis',
        title: '🚨 Recursos de Crisis',
        description: 'Contacta líneas de ayuda inmediatamente',
        action: 'emergency_contact',
        priority: 'high'
      });
    }

    if (sentiment.emotion === 'triste' || sentiment.emotion === 'muy_triste') {
      recommendations.push({
        type: 'exercise',
        title: '💙 Ejercicio de Gratitud',
        description: 'Escribe 3 cosas por las que estés agradecido',
        action: 'gratitude_exercise',
        priority: 'medium'
      });
    }

    if (sentiment.emotion === 'ansioso' || userMessage.toLowerCase().includes('ansiedad')) {
      recommendations.push({
        type: 'breathing',
        title: '🫁 Respiración 4-7-8',
        description: 'Técnica de respiración para calmar la ansiedad',
        action: 'breathing_exercise',
        priority: 'high'
      });
    }

    if (sentiment.emotion === 'estresado' || userMessage.toLowerCase().includes('estrés')) {
      recommendations.push({
        type: 'relaxation',
        title: '🧘 Relajación Muscular',
        description: 'Técnica de relajación progresiva',
        action: 'muscle_relaxation',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  /**
   * Actualiza historial de conversación
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
   * Respuesta de respaldo
   */
  getFallbackResponse(userMessage) {
    const fallbackResponses = [
      "Entiendo que estás pasando por un momento difícil. Estoy aquí para escucharte. ¿Podrías contarme más sobre cómo te sientes?",
      "Me importa cómo te sientes. Aunque no puedo resolver todos los problemas, puedo escucharte y apoyarte. ¿Qué te gustaría compartir?",
      "Es valiente de tu parte expresar lo que sientes. Estoy aquí para acompañarte. ¿Cómo puedo ayudarte en este momento?",
      "Reconozco que estás pasando por algo importante. Estoy aquí para escucharte sin juzgar. ¿Qué necesitas en este momento?",
      "Aprecio que confíes en mí para compartir tus sentimientos. Estoy aquí para apoyarte. ¿Hay algo específico en lo que pueda ayudarte?"
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
   * Limpia historial de usuario
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

module.exports = new AIServiceOffline();
