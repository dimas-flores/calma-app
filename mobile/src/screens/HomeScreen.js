import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Chip, ProgressBar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeScreen({ navigation }) {
  const { user } = useSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [emotionalWeather, setEmotionalWeather] = useState('soleado');
  const [breathingAnimation] = useState(new Animated.Value(1));

  const quotes = [
    "Tu salud mental es una prioridad, no un lujo. 💙",
    "Cada pequeño paso cuenta. Estás progresando. 🌟",
    "Respira. Estás haciendo lo mejor que puedes. 🌸",
    "La calma es un superpoder. Cultívala. 🧘",
    "Eres más fuerte de lo que crees. 💪",
    "Hoy es un buen día para cuidar de ti. 🌺",
    "Tu bienestar emocional importa. 💚",
    "Está bien no estar bien. Estás aquí, y eso es valiente. 🦋"
  ];

  useEffect(() => {
    // Actualizar hora cada minuto
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);

    // Seleccionar frase motivacional aleatoria
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    // Determinar clima emocional basado en estadísticas
    const musicaSesiones = parseInt(localStorage.getItem('musicaSesiones') || '0');
    const ejerciciosSesiones = parseInt(localStorage.getItem('ejerciciosSesiones') || '0');
    const total = musicaSesiones + ejerciciosSesiones;

    if (total === 0) setEmotionalWeather('nublado');
    else if (total < 5) setEmotionalWeather('parcialmente-nublado');
    else if (total < 10) setEmotionalWeather('soleado');
    else setEmotionalWeather('radiante');

    // Animación de respiración
    const breathe = () => {
      Animated.sequence([
        Animated.timing(breathingAnimation, {
          toValue: 1.2,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(breathingAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]).start(() => breathe());
    };
    breathe();

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '¡Buenos días';
    if (hour < 18) return '¡Buenas tardes';
    return '¡Buenas noches';
  };

  const getEmotionalWeatherIcon = () => {
    switch(emotionalWeather) {
      case 'radiante': return { icon: 'white-balance-sunny', color: '#FFD700', text: 'Radiante' };
      case 'soleado': return { icon: 'weather-sunny', color: '#FFA500', text: 'Soleado' };
      case 'parcialmente-nublado': return { icon: 'weather-partly-cloudy', color: '#87CEEB', text: 'Mejorando' };
      default: return { icon: 'weather-cloudy', color: '#B0C4DE', text: 'Nublado' };
    }
  };

  const weather = getEmotionalWeatherIcon();

  // Calcular estadísticas
  const musicaSesiones = parseInt(localStorage.getItem('musicaSesiones') || '0');
  const ejerciciosSesiones = parseInt(localStorage.getItem('ejerciciosSesiones') || '0');
  const cuestionariosCompletados = parseInt(localStorage.getItem('cuestionariosCompletados') || '0');
  const totalActividades = musicaSesiones + ejerciciosSesiones + cuestionariosCompletados;
  const progresoSemanal = Math.min((totalActividades / 21) * 100, 100); // Meta: 21 actividades por semana

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}, {user?.nombre || 'Usuario'}! 👋</Text>
            <Text style={styles.subGreeting}>{currentTime.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
          </View>
          <View style={styles.weatherContainer}>
            <Icon name={weather.icon} size={40} color={weather.color} />
            <Text style={styles.weatherText}>{weather.text}</Text>
          </View>
        </View>
      </View>

      {/* Frase Motivacional del Día */}
      <Card style={styles.quoteCard}>
        <Card.Content>
          <View style={styles.quoteContent}>
            <Icon name="format-quote-open" size={24} color="#6B9BD1" />
            <Text style={styles.quoteText}>{motivationalQuote}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Progreso Semanal */}
      <Card style={styles.weeklyProgressCard}>
        <Card.Content>
          <View style={styles.progressHeader}>
            <Icon name="trophy-outline" size={24} color="#FFD700" />
            <Title style={styles.progressTitle}>Meta Semanal</Title>
          </View>
          <View style={styles.progressStats}>
            <Text style={styles.progressNumber}>{totalActividades}/21</Text>
            <Text style={styles.progressLabel}>actividades completadas</Text>
          </View>
          <ProgressBar progress={progresoSemanal / 100} color="#6B9BD1" style={styles.progressBar} />
          <Text style={styles.progressPercentage}>{Math.round(progresoSemanal)}% completado</Text>
        </Card.Content>
      </Card>

      {/* Ejercicio de Respiración Rápido */}
      <Card style={styles.breathingCard}>
        <Card.Content>
          <View style={styles.breathingContent}>
            <Animated.View style={[styles.breathingCircle, { transform: [{ scale: breathingAnimation }] }]}>
              <Icon name="lungs" size={32} color="#FFFFFF" />
            </Animated.View>
            <View style={styles.breathingText}>
              <Title style={styles.breathingTitle}>Respira Profundo</Title>
              <Paragraph>Inhala 4 seg • Mantén 7 seg • Exhala 8 seg</Paragraph>
              <Button
                mode="contained"
                onPress={() => {
                  alert('🧘 Ejercicio de Respiración 4-7-8\n\n1. Inhala por la nariz (4 segundos)\n2. Mantén el aire (7 segundos)\n3. Exhala por la boca (8 segundos)\n4. Repite 4 veces\n\n¡Relájate y disfruta! 🌸');
                  const current = parseInt(localStorage.getItem('ejerciciosSesiones') || '0');
                  localStorage.setItem('ejerciciosSesiones', (current + 1).toString());
                }}
                style={styles.breathingButton}
              >
                Comenzar Ahora
              </Button>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Terapia Profesional */}
      <Text style={styles.sectionTitle}>🩺 Terapia Profesional</Text>

      <Card style={styles.therapyCard} onPress={() => navigation.navigate('TreatmentPlan')}>
        <Card.Content style={styles.therapyCardContent}>
          <Icon name="clipboard-text" size={56} color="#6B9BD1" />
          <View style={styles.therapyCardText}>
            <Title style={styles.therapyCardTitle}>Plan de Tratamiento</Title>
            <Paragraph>Plan personalizado de 4 semanas como un psicólogo real</Paragraph>
          </View>
          <Icon name="chevron-right" size={24} color="#6B9BD1" />
        </Card.Content>
      </Card>

      <Card style={styles.therapyCard} onPress={() => navigation.navigate('TherapySession')}>
        <Card.Content style={styles.therapyCardContent}>
          <Icon name="account-heart" size={56} color="#E91E63" />
          <View style={styles.therapyCardText}>
            <Title style={styles.therapyCardTitle}>Sesiones Terapéuticas</Title>
            <Paragraph>Sesiones guiadas paso a paso basadas en TCC</Paragraph>
          </View>
          <Icon name="chevron-right" size={24} color="#E91E63" />
        </Card.Content>
      </Card>

      {/* Evaluación Emocional */}
      <Card style={styles.mainCard} onPress={() => navigation.navigate('Questionnaire')}>
        <Card.Content style={styles.mainCardContent}>
          <Icon name="emoticon-happy-outline" size={48} color="#6B9BD1" />
          <Title style={styles.mainCardTitle}>Evaluación Emocional</Title>
          <Paragraph style={styles.mainCardText}>
            Descubre tu estado emocional y recibe recomendaciones personalizadas
          </Paragraph>
          {cuestionariosCompletados > 0 && (
            <Chip icon="check-circle" style={styles.completedChip}>
              {cuestionariosCompletados} evaluaciones completadas
            </Chip>
          )}
        </Card.Content>
      </Card>

      <Text style={styles.sectionTitle}>🎯 Herramientas de Bienestar</Text>

      <View style={styles.quickAccess}>
        <Card style={styles.quickCard} onPress={() => navigation.navigate('Music')}>
          <Card.Content style={styles.quickCardContent}>
            <Icon name="music" size={36} color="#6B9BD1" />
            <Text style={styles.quickCardText}>Musicoterapia</Text>
            <Text style={styles.quickCardSubtext}>{musicaSesiones} sesiones</Text>
          </Card.Content>
        </Card>

        <Card style={styles.quickCard} onPress={() => navigation.navigate('TCC')}>
          <Card.Content style={styles.quickCardContent}>
            <Icon name="brain" size={36} color="#6B9BD1" />
            <Text style={styles.quickCardText}>Ejercicios TCC</Text>
            <Text style={styles.quickCardSubtext}>{ejerciciosSesiones} completados</Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.quickAccess}>
        <Card style={styles.quickCard} onPress={() => navigation.navigate('Meditation')}>
          <Card.Content style={styles.quickCardContent}>
            <Icon name="meditation" size={36} color="#9C27B0" />
            <Text style={styles.quickCardText}>Meditación</Text>
            <Text style={styles.quickCardSubtext}>Con temporizador</Text>
          </Card.Content>
        </Card>

        <Card style={styles.quickCard} onPress={() => navigation.navigate('Journal')}>
          <Card.Content style={styles.quickCardContent}>
            <Icon name="book-open-variant" size={36} color="#FF9800" />
            <Text style={styles.quickCardText}>Diario</Text>
            <Text style={styles.quickCardSubtext}>Escribe libremente</Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.chatCard} onPress={() => navigation.navigate('SupportChat')}>
        <Card.Content style={styles.chatCardContent}>
          <Icon name="robot" size={40} color="#6B9BD1" />
          <View style={styles.chatCardText}>
            <Title style={styles.chatCardTitle}>Chat de Apoyo 24/7</Title>
            <Paragraph>Habla con nuestro asistente de bienestar</Paragraph>
          </View>
          <Icon name="chevron-right" size={24} color="#6B9BD1" />
        </Card.Content>
      </Card>

      {/* Recomendación Inteligente */}
      <Card style={styles.recommendationCard}>
        <Card.Content>
          <View style={styles.recommendationHeader}>
            <Icon name="lightbulb-on" size={24} color="#FFD700" />
            <Title style={styles.recommendationTitle}>Recomendación para ti</Title>
          </View>
          <Paragraph style={styles.recommendationText}>
            {totalActividades === 0
              ? "¡Comienza tu viaje de bienestar! Te recomendamos empezar con una sesión de música relajante de 10 minutos."
              : totalActividades < 5
              ? "¡Excelente inicio! Prueba combinar música con ejercicios de respiración para mejores resultados."
              : totalActividades < 10
              ? "¡Vas muy bien! Considera agregar ejercicios de mindfulness a tu rutina diaria."
              : "¡Increíble progreso! Estás construyendo hábitos saludables. Sigue así y verás grandes cambios. 🌟"}
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Sección Avanzada */}
      <Text style={styles.sectionTitle}>🚀 Funciones Avanzadas</Text>

      <View style={styles.advancedGrid}>
        <Card style={styles.advancedCard} onPress={() => navigation.navigate('AdvancedStats')}>
          <Card.Content style={styles.advancedCardContent}>
            <Icon name="chart-box" size={40} color="#2196F3" />
            <Text style={styles.advancedCardTitle}>Estadísticas</Text>
            <Text style={styles.advancedCardDesc}>Gráficos y análisis</Text>
          </Card.Content>
        </Card>

        <Card style={styles.advancedCard} onPress={() => navigation.navigate('Community')}>
          <Card.Content style={styles.advancedCardContent}>
            <Icon name="account-group" size={40} color="#4CAF50" />
            <Text style={styles.advancedCardTitle}>Comunidad</Text>
            <Text style={styles.advancedCardDesc}>Comparte y conecta</Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.advancedGrid}>
        <Card style={styles.advancedCard} onPress={() => navigation.navigate('Challenges')}>
          <Card.Content style={styles.advancedCardContent}>
            <Icon name="trophy" size={40} color="#FFD700" />
            <Text style={styles.advancedCardTitle}>Retos</Text>
            <Text style={styles.advancedCardDesc}>Desafíos y logros</Text>
          </Card.Content>
        </Card>

        <Card style={[styles.advancedCard, styles.emergencyCard]} onPress={() => navigation.navigate('Emergency')}>
          <Card.Content style={styles.advancedCardContent}>
            <Icon name="alert-circle" size={40} color="#FF6B6B" />
            <Text style={styles.advancedCardTitle}>Emergencia</Text>
            <Text style={styles.advancedCardDesc}>Ayuda inmediata</Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.progressCard}>
        <Card.Content>
          <Title>Tu Progreso</Title>
          <Paragraph>Visualiza tu evolución emocional</Paragraph>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Progress')}
            style={styles.progressButton}
          >
            Ver Detalles
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
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
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  subGreeting: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  weatherContainer: {
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  quoteCard: {
    margin: 20,
    marginTop: 16,
    backgroundColor: '#E8F4F8',
    elevation: 2,
  },
  quoteContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  quoteText: {
    flex: 1,
    fontSize: 15,
    fontStyle: 'italic',
    color: '#2C3E50',
    lineHeight: 22,
  },
  weeklyProgressCard: {
    margin: 20,
    marginTop: 12,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    margin: 0,
  },
  progressStats: {
    alignItems: 'center',
    marginVertical: 12,
  },
  progressNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6B9BD1',
  },
  progressLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 12,
  },
  progressPercentage: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6B9BD1',
    fontWeight: '600',
  },
  breathingCard: {
    margin: 20,
    marginTop: 12,
    backgroundColor: '#6B9BD1',
    elevation: 3,
  },
  breathingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  breathingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5A8BC0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingText: {
    flex: 1,
  },
  breathingTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    margin: 0,
  },
  breathingButton: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
  },
  mainCard: {
    margin: 20,
    marginTop: 12,
    elevation: 4,
  },
  mainCardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  mainCardTitle: {
    marginTop: 12,
    fontSize: 20,
  },
  mainCardText: {
    textAlign: 'center',
    marginTop: 8,
    color: '#7F8C8D',
  },
  completedChip: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 16,
    marginBottom: 12,
    color: '#2C3E50',
  },
  quickAccess: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickCard: {
    flex: 1,
    elevation: 2,
  },
  quickCardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  quickCardText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  quickCardSubtext: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  recommendationCard: {
    margin: 20,
    marginTop: 16,
    backgroundColor: '#FFF9E6',
    elevation: 2,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    margin: 0,
  },
  recommendationText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  progressCard: {
    margin: 20,
    marginTop: 12,
    marginBottom: 30,
    elevation: 2,
  },
  progressButton: {
    marginTop: 12,
  },
  chatCard: {
    margin: 20,
    marginTop: 12,
    elevation: 3,
    backgroundColor: '#E8F4F8',
  },
  chatCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chatCardText: {
    flex: 1,
  },
  chatCardTitle: {
    fontSize: 16,
    margin: 0,
  },
  advancedGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 12,
  },
  advancedCard: {
    flex: 1,
    elevation: 3,
  },
  advancedCardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  advancedCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 8,
  },
  advancedCardDesc: {
    fontSize: 11,
    color: '#7F8C8D',
    marginTop: 4,
  },
  emergencyCard: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  therapyCard: {
    margin: 20,
    marginTop: 12,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#6B9BD1',
  },
  therapyCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  therapyCardText: {
    flex: 1,
  },
  therapyCardTitle: {
    fontSize: 18,
    margin: 0,
    marginBottom: 4,
  },
});
