import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, RadioButton, Button, ProgressBar, Card } from 'react-native-paper';
import api from '../services/api';

const questions = [
  {
    id: 'energia',
    question: '¿Cómo ha sido tu nivel de energía en las últimas horas?',
    options: [
      { label: 'Muy bajo', value: 1 },
      { label: 'Bajo', value: 2 },
      { label: 'Normal', value: 3 },
      { label: 'Alto', value: 4 },
      { label: 'Muy alto', value: 5 },
    ],
  },
  {
    id: 'concentracion',
    question: '¿Cómo describirías tu capacidad de concentración hoy?',
    options: [
      { label: 'Muy difícil concentrarme', value: 1 },
      { label: 'Algo difícil', value: 2 },
      { label: 'Normal', value: 3 },
      { label: 'Buena concentración', value: 4 },
      { label: 'Excelente concentración', value: 5 },
    ],
  },
  {
    id: 'estadoEmocional',
    question: '¿Cómo te sientes emocionalmente en este momento?',
    options: [
      { label: 'Muy mal', value: 1 },
      { label: 'Mal', value: 2 },
      { label: 'Neutral', value: 3 },
      { label: 'Bien', value: 4 },
      { label: 'Muy bien', value: 5 },
    ],
  },
  {
    id: 'sintomas',
    question: '¿Has experimentado alguno de estos síntomas?',
    options: [
      { label: 'Dolor de cabeza intenso', value: 'dolor_cabeza' },
      { label: 'Tensión muscular', value: 'tension_muscular' },
      { label: 'Palpitaciones', value: 'palpitaciones' },
      { label: 'Fatiga extrema', value: 'fatiga' },
      { label: 'Ninguno', value: 'ninguno' },
    ],
  },
  {
    id: 'sueno',
    question: '¿Cómo has dormido últimamente?',
    options: [
      { label: 'Muy mal, insomnio', value: 'muy_mal' },
      { label: 'Mal, despertares frecuentes', value: 'mal' },
      { label: 'Regular', value: 'regular' },
      { label: 'Bien', value: 'bien' },
      { label: 'Muy bien', value: 'muy_bien' },
    ],
  },
  {
    id: 'pensamientos',
    question: '¿Qué tipo de pensamientos has tenido hoy?',
    options: [
      { label: 'Preocupaciones constantes', value: 'preocupaciones' },
      { label: 'Pensamientos negativos sobre mí', value: 'negativos' },
      { label: 'Agobio por responsabilidades', value: 'agobio' },
      { label: 'Dificultad para mantener el foco', value: 'falta_foco' },
      { label: 'Pensamientos positivos/neutrales', value: 'positivos' },
    ],
  },
];

export default function QuestionnaireScreen({ navigation }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const handleAnswer = (value) => {
    const questionId = questions[currentQuestion].id;
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setLoading(true);

    // Calcular resultado localmente (sin backend)
    let puntuacion = 0;
    let estado = 'neutral';

    // Analizar respuestas
    if (answers.energia <= 2) puntuacion += 2;
    if (answers.concentracion <= 2) puntuacion += 2;
    if (answers.estadoEmocional <= 2) puntuacion += 3;
    if (answers.sintomas !== 'ninguno') puntuacion += 2;
    if (answers.sueno === 'muy_mal' || answers.sueno === 'mal') puntuacion += 2;
    if (answers.pensamientos === 'preocupaciones' || answers.pensamientos === 'negativos') puntuacion += 3;

    // Determinar estado
    if (puntuacion >= 10) {
      estado = 'Necesitas apoyo - Nivel alto de estrés/ansiedad';
    } else if (puntuacion >= 6) {
      estado = 'Nivel moderado - Considera practicar ejercicios de relajación';
    } else {
      estado = 'Nivel bajo - Estás bien, sigue así';
    }

    // Mostrar resultado
    setTimeout(() => {
      // Guardar estadística
      const currentQuizzes = parseInt(localStorage.getItem('cuestionariosCompletados') || '0');
      localStorage.setItem('cuestionariosCompletados', (currentQuizzes + 1).toString());

      alert(
        `✅ Cuestionario completado!\n\n` +
        `Resultado: ${estado}\n` +
        `Puntuación: ${puntuacion}/14\n\n` +
        `Recomendaciones:\n` +
        `• Ve a la sección "Música" para playlists relajantes\n` +
        `• Ve a "Ejercicios" para técnicas de TCC\n` +
        `• Practica meditación diariamente\n\n` +
        `📊 ¡Cuestionario registrado en tu progreso!\n\n` +
        `¡Cuida tu salud mental! 💙`
      );

      // Resetear cuestionario
      setCurrentQuestion(0);
      setAnswers({});
      setLoading(false);

      // Redirigir al Home
      navigation.navigate('Home');
    }, 500);
  };

  const progress = (currentQuestion + 1) / questions.length;
  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQ.id];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ayúdame a escoger</Text>
        <Text style={styles.questionNumber}>
          Pregunta {currentQuestion + 1} de {questions.length}
        </Text>
        <ProgressBar progress={progress} color="#6B9BD1" style={styles.progressBar} />
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.questionCard}>
          <Card.Content>
            <Text style={styles.question}>{currentQ.question}</Text>

            <RadioButton.Group onValueChange={handleAnswer} value={currentAnswer}>
              {currentQ.options.map((option) => (
                <View key={option.value} style={styles.option}>
                  <RadioButton.Item
                    label={option.label}
                    value={option.value}
                    color="#6B9BD1"
                  />
                </View>
              ))}
            </RadioButton.Group>
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        {currentQuestion > 0 && (
          <Button mode="outlined" onPress={handleBack} style={styles.backButton}>
            Anterior
          </Button>
        )}

        <Button
          mode="contained"
          onPress={handleNext}
          disabled={!currentAnswer || loading}
          loading={loading}
          style={styles.nextButton}
        >
          {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Siguiente'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FC',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  questionNumber: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  progressBar: {
    marginTop: 12,
    height: 6,
    borderRadius: 3,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionCard: {
    elevation: 2,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },
  option: {
    marginVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});
