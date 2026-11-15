import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Text, IconButton, RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TherapySessionScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sessionType, setSessionType] = useState('');

  const sessionTypes = [
    {
      id: 'anxiety',
      title: 'Manejo de Ansiedad',
      description: 'Sesión guiada para reducir la ansiedad',
      icon: 'emoticon-sad',
      color: '#FF9800',
      duration: '15 min'
    },
    {
      id: 'stress',
      title: 'Reducción de Estrés',
      description: 'Técnicas para manejar el estrés diario',
      icon: 'head-flash',
      color: '#FF6B6B',
      duration: '20 min'
    },
    {
      id: 'mood',
      title: 'Mejora del Estado de Ánimo',
      description: 'Ejercicios para levantar el ánimo',
      icon: 'emoticon-happy',
      color: '#4CAF50',
      duration: '15 min'
    },
    {
      id: 'sleep',
      title: 'Mejora del Sueño',
      description: 'Rutina para dormir mejor',
      icon: 'sleep',
      color: '#2196F3',
      duration: '25 min'
    },
    {
      id: 'selfesteem',
      title: 'Autoestima',
      description: 'Fortalece tu amor propio',
      icon: 'heart',
      color: '#E91E63',
      duration: '20 min'
    },
    {
      id: 'relationships',
      title: 'Relaciones Saludables',
      description: 'Mejora tus vínculos interpersonales',
      icon: 'account-group',
      color: '#9C27B0',
      duration: '25 min'
    },
  ];

  const anxietySession = [
    {
      type: 'intro',
      title: 'Bienvenido a tu Sesión de Manejo de Ansiedad',
      content: 'En los próximos 15 minutos, trabajaremos juntos para reducir tu ansiedad. Esta sesión está basada en técnicas de TCC (Terapia Cognitivo-Conductual) comprobadas científicamente.',
      icon: 'hand-wave'
    },
    {
      type: 'question',
      title: 'Paso 1: Identificación',
      question: '¿Qué nivel de ansiedad sientes ahora mismo?',
      options: [
        { value: '1', label: '1 - Muy baja' },
        { value: '3', label: '3 - Baja' },
        { value: '5', label: '5 - Moderada' },
        { value: '7', label: '7 - Alta' },
        { value: '10', label: '10 - Muy alta' }
      ]
    },
    {
      type: 'exercise',
      title: 'Paso 2: Respiración Profunda',
      content: 'Vamos a practicar la técnica de respiración 4-7-8:\n\n1. Inhala por la nariz contando hasta 4\n2. Mantén el aire contando hasta 7\n3. Exhala por la boca contando hasta 8\n4. Repite 4 veces\n\n💡 Esta técnica activa tu sistema nervioso parasimpático, reduciendo la ansiedad.',
      action: 'Practicar Ahora'
    },
    {
      type: 'question',
      title: 'Paso 3: Identificación de Pensamientos',
      question: '¿Qué pensamiento está causando tu ansiedad?',
      options: [
        { value: 'future', label: 'Preocupación por el futuro' },
        { value: 'past', label: 'Remordimiento del pasado' },
        { value: 'judgment', label: 'Miedo al juicio de otros' },
        { value: 'failure', label: 'Miedo al fracaso' },
        { value: 'other', label: 'Otro' }
      ]
    },
    {
      type: 'technique',
      title: 'Paso 4: Reestructuración Cognitiva',
      content: 'Vamos a cuestionar ese pensamiento ansioso:\n\n❓ ¿Es este pensamiento 100% verdadero?\n❓ ¿Qué evidencia tengo a favor y en contra?\n❓ ¿Qué le diría a un amigo en esta situación?\n❓ ¿Cuál es el peor escenario realista?\n❓ ¿Puedo hacer algo al respecto ahora?\n\n💡 Recuerda: Los pensamientos no son hechos.',
    },
    {
      type: 'grounding',
      title: 'Paso 5: Técnica de Anclaje 5-4-3-2-1',
      content: 'Conecta con el presente:\n\n👁️ Nombra 5 cosas que VES\n✋ Nombra 4 cosas que TOCAS\n👂 Nombra 3 cosas que ESCUCHAS\n👃 Nombra 2 cosas que HUELES\n👅 Nombra 1 cosa que SABOREAS\n\n💡 Esta técnica te trae al momento presente, donde la ansiedad no existe.',
      action: 'Practicar'
    },
    {
      type: 'question',
      title: 'Paso 6: Evaluación',
      question: '¿Cómo te sientes ahora?',
      options: [
        { value: '1', label: '1 - Mucho mejor' },
        { value: '3', label: '3 - Mejor' },
        { value: '5', label: '5 - Igual' },
        { value: '7', label: '7 - Un poco peor' },
        { value: '10', label: '10 - Peor' }
      ]
    },
    {
      type: 'summary',
      title: '¡Sesión Completada! 🎉',
      content: 'Has completado tu sesión de manejo de ansiedad.\n\n📊 Técnicas practicadas:\n✓ Respiración 4-7-8\n✓ Reestructuración cognitiva\n✓ Técnica de anclaje 5-4-3-2-1\n\n💡 Recomendaciones:\n• Practica estas técnicas diariamente\n• Escribe tus pensamientos ansiosos\n• Usa la app cuando sientas ansiedad\n\n🏆 ¡Excelente trabajo!',
    }
  ];

  const startSession = (type) => {
    setSessionType(type);
    setCurrentStep(0);
    setAnswers({});
  };

  const nextStep = () => {
    if (currentStep < anxietySession.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Registrar sesión completada
      const current = parseInt(localStorage.getItem('ejerciciosSesiones') || '0');
      localStorage.setItem('ejerciciosSesiones', (current + 1).toString());

      alert('✅ ¡Sesión Completada!\n\nHas completado una sesión terapéutica completa.\n\n📊 Registrada en tu progreso.\n\n💙 ¡Sigue cuidando tu salud mental!');
      setSessionType('');
      setCurrentStep(0);
    }
  };

  const renderStep = () => {
    const step = anxietySession[currentStep];

    switch(step.type) {
      case 'intro':
        return (
          <Card style={styles.stepCard}>
            <Card.Content>
              <Icon name={step.icon} size={64} color="#6B9BD1" style={{ alignSelf: 'center' }} />
              <Title style={styles.stepTitle}>{step.title}</Title>
              <Paragraph style={styles.stepContent}>{step.content}</Paragraph>
              <Button mode="contained" onPress={nextStep} style={styles.nextButton}>
                Comenzar Sesión
              </Button>
            </Card.Content>
          </Card>
        );

      case 'question':
        return (
          <Card style={styles.stepCard}>
            <Card.Content>
              <Title style={styles.stepTitle}>{step.title}</Title>
              <Paragraph style={styles.questionText}>{step.question}</Paragraph>
              <RadioButton.Group
                onValueChange={value => setAnswers({ ...answers, [currentStep]: value })}
                value={answers[currentStep]}
              >
                {step.options.map((option, index) => (
                  <View key={index} style={styles.radioOption}>
                    <RadioButton value={option.value} />
                    <Text style={styles.radioLabel}>{option.label}</Text>
                  </View>
                ))}
              </RadioButton.Group>
              <Button
                mode="contained"
                onPress={nextStep}
                style={styles.nextButton}
                disabled={!answers[currentStep]}
              >
                Continuar
              </Button>
            </Card.Content>
          </Card>
        );

      case 'exercise':
      case 'technique':
      case 'grounding':
        return (
          <Card style={styles.stepCard}>
            <Card.Content>
              <Title style={styles.stepTitle}>{step.title}</Title>
              <Paragraph style={styles.stepContent}>{step.content}</Paragraph>
              {step.action && (
                <Button
                  mode="outlined"
                  icon="play"
                  onPress={() => alert(`🧘 ${step.title}\n\n${step.content}\n\nTómate tu tiempo para practicar.`)}
                  style={styles.actionButton}
                >
                  {step.action}
                </Button>
              )}
              <Button mode="contained" onPress={nextStep} style={styles.nextButton}>
                Siguiente
              </Button>
            </Card.Content>
          </Card>
        );

      case 'summary':
        return (
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Icon name="check-circle" size={64} color="#4CAF50" style={{ alignSelf: 'center' }} />
              <Title style={styles.stepTitle}>{step.title}</Title>
              <Paragraph style={styles.stepContent}>{step.content}</Paragraph>
              <Button mode="contained" onPress={nextStep} style={styles.nextButton}>
                Finalizar Sesión
              </Button>
            </Card.Content>
          </Card>
        );

      default:
        return null;
    }
  };

  if (sessionType) {
    return (
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => {
              setSessionType('');
              setCurrentStep(0);
            }}
          />
          <Text style={styles.headerTitle}>Sesión Terapéutica</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Paso {currentStep + 1} de {anxietySession.length}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${((currentStep + 1) / anxietySession.length) * 100}%` }
                ]}
              />
            </View>
          </View>

          {renderStep()}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Sesiones Terapéuticas</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView>
        <View style={styles.header}>
          <Icon name="account-heart" size={48} color="#6B9BD1" />
          <Title style={styles.title}>Sesiones Guiadas</Title>
          <Paragraph style={styles.subtitle}>
            Sesiones terapéuticas profesionales paso a paso
          </Paragraph>
        </View>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Title>¿Qué son las Sesiones Terapéuticas?</Title>
            <Paragraph style={styles.infoText}>
              Son sesiones guiadas basadas en técnicas de psicología clínica (TCC, Mindfulness, etc.) que te ayudan a trabajar problemas específicos de forma estructurada, como lo haría un psicólogo profesional.
            </Paragraph>
            <View style={styles.benefitsList}>
              <Text style={styles.benefit}>✓ Basadas en evidencia científica</Text>
              <Text style={styles.benefit}>✓ Paso a paso guiado</Text>
              <Text style={styles.benefit}>✓ 15-25 minutos por sesión</Text>
              <Text style={styles.benefit}>✓ Puedes repetirlas cuando quieras</Text>
            </View>
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>Selecciona tu Sesión</Text>

        {sessionTypes.map((session) => (
          <Card key={session.id} style={styles.sessionCard}>
            <Card.Content>
              <View style={styles.sessionHeader}>
                <Icon name={session.icon} size={48} color={session.color} />
                <View style={styles.sessionInfo}>
                  <Title style={styles.sessionTitle}>{session.title}</Title>
                  <Paragraph style={styles.sessionDesc}>{session.description}</Paragraph>
                  <Text style={styles.sessionDuration}>⏱️ {session.duration}</Text>
                </View>
              </View>
              <Button
                mode="contained"
                icon="play"
                onPress={() => startSession(session.id)}
                style={[styles.startButton, { backgroundColor: session.color }]}
              >
                Iniciar Sesión
              </Button>
            </Card.Content>
          </Card>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FC',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    marginTop: 12,
  },
  subtitle: {
    textAlign: 'center',
    color: '#7F8C8D',
    marginTop: 8,
  },
  infoCard: {
    margin: 20,
    marginTop: 12,
    elevation: 2,
    backgroundColor: '#E8F4F8',
  },
  infoText: {
    marginTop: 8,
    lineHeight: 20,
  },
  benefitsList: {
    marginTop: 12,
  },
  benefit: {
    fontSize: 14,
    color: '#2C3E50',
    marginVertical: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 16,
    marginBottom: 12,
    color: '#2C3E50',
  },
  sessionCard: {
    margin: 20,
    marginTop: 12,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 18,
    margin: 0,
    marginBottom: 4,
  },
  sessionDesc: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  sessionDuration: {
    fontSize: 13,
    color: '#6B9BD1',
    marginTop: 4,
  },
  startButton: {
    marginTop: 8,
  },
  progressContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  progressText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6B9BD1',
  },
  stepCard: {
    margin: 20,
    elevation: 3,
  },
  summaryCard: {
    margin: 20,
    elevation: 3,
    backgroundColor: '#E8F5E9',
  },
  stepTitle: {
    fontSize: 20,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  stepContent: {
    fontSize: 15,
    lineHeight: 24,
    color: '#2C3E50',
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioLabel: {
    fontSize: 15,
    color: '#2C3E50',
    marginLeft: 8,
  },
  actionButton: {
    marginBottom: 12,
  },
  nextButton: {
    marginTop: 16,
  },
});
