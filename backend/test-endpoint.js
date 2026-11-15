// Script de prueba para verificar que el endpoint funciona
const axios = require('axios');

async function testQuestionnaire() {
  try {
    const respuestas = {
      energia: 2,
      concentracion: 2,
      estadoEmocional: 2,
      sintomas: 'dolor_cabeza',
      sueno: 'mal',
      pensamientos: 'preocupaciones'
    };

    console.log('Enviando cuestionario...');
    const response = await axios.post('http://localhost:3000/api/questionnaire/submit', respuestas);
    console.log('✅ Respuesta exitosa:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Error:');
    console.error(error.response?.data || error.message);
  }
}

testQuestionnaire();
