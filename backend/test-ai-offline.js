// Script para probar la IA OFFLINE (sin OpenAI)
const aiService = require('./services/aiServiceOffline');

async function testAIOffline() {
  console.log('🤖 Probando IA Chatbot OFFLINE...\n');

  try {
    // Simular mensajes de prueba
    const testMessages = [
      'Hola, me siento muy triste hoy',
      'Estoy muy ansioso por el trabajo',
      'No puedo más, quiero desaparecer',
      'Me siento feliz y motivado',
      'Tengo mucho estrés en la universidad'
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
        console.log(`💡 Recomendaciones:`);
        response.recommendations.forEach(rec => {
          console.log(`   - ${rec.title}: ${rec.description}`);
        });
      }

      console.log('─'.repeat(50));
    }

    console.log('\n✅ Prueba de IA OFFLINE completada exitosamente!');
    console.log('🎉 El chatbot funciona SIN necesidad de OpenAI API Key!');

  } catch (error) {
    console.error('❌ Error probando IA:', error.message);
  }
}

// Ejecutar prueba
testAIOffline();
