// Script para probar la IA directamente
const aiService = require('./services/aiService');

async function testAI() {
  console.log('🤖 Probando IA Chatbot...\n');

  try {
    // Simular mensajes de prueba
    const testMessages = [
      'Hola, me siento muy triste hoy',
      'Estoy muy ansioso por el trabajo',
      'No puedo más, quiero desaparecer',
      'Me siento feliz y motivado',
      'Tengo mucho estrés'
    ];

    for (const message of testMessages) {
      console.log(`👤 Usuario: ${message}`);

      const response = await aiService.generateEmpatheticResponse(
        message,
        'test-user-123',
        { lastActivity: new Date() }
      );

      console.log(`🤖 IA: ${response.response}`);
      console.log(`📊 Sentimiento: ${response.sentiment.emotion} (${response.sentiment.comparative})`);
      console.log(`🚨 Crisis: ${response.crisis.isCrisis ? 'SÍ' : 'NO'}`);

      if (response.recommendations.length > 0) {
        console.log(`💡 Recomendaciones: ${response.recommendations.map(r => r.title).join(', ')}`);
      }

      console.log('─'.repeat(50));
    }

    console.log('\n✅ Prueba de IA completada exitosamente!');

  } catch (error) {
    console.error('❌ Error probando IA:', error.message);
    console.log('\n💡 Asegúrate de:');
    console.log('1. Tener tu OpenAI API Key configurada');
    console.log('2. Estar conectado a internet');
    console.log('3. Tener las dependencias instaladas');
  }
}

// Ejecutar prueba
testAI();
