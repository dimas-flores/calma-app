import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { Card, Title, Paragraph, Button, Text, ProgressBar, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function MeditationScreen({ navigation }) {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [pulseAnimation] = useState(new Animated.Value(1));

  const durations = [
    { value: 3, label: '3 min', desc: 'Rápido' },
    { value: 5, label: '5 min', desc: 'Ideal' },
    { value: 10, label: '10 min', desc: 'Profundo' },
    { value: 15, label: '15 min', desc: 'Completo' },
  ];

  useEffect(() => {
    let interval = null;
    if (isActive && seconds < selectedDuration * 60) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);

        // Cambiar fase de respiración cada 4 segundos
        const cycle = seconds % 16;
        if (cycle < 4) setBreathingPhase('inhale');
        else if (cycle < 11) setBreathingPhase('hold');
        else setBreathingPhase('exhale');
      }, 1000);
    } else if (seconds >= selectedDuration * 60) {
      setIsActive(false);
      alert('🎉 ¡Meditación completada!\n\nFelicidades por dedicar tiempo a tu bienestar mental. Has completado ' + selectedDuration + ' minutos de meditación. 🧘‍♀️');

      // Registrar sesión
      const current = parseInt(localStorage.getItem('ejerciciosSesiones') || '0');
      localStorage.setItem('ejerciciosSesiones', (current + 1).toString());

      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, selectedDuration]);

  useEffect(() => {
    // Animación de pulso
    const pulse = () => {
      const duration = breathingPhase === 'inhale' ? 4000 : breathingPhase === 'hold' ? 7000 : 8000;
      const toValue = breathingPhase === 'inhale' ? 1.3 : breathingPhase === 'hold' ? 1.3 : 1;

      Animated.timing(pulseAnimation, {
        toValue,
        duration,
        useNativeDriver: true,
      }).start();
    };
    pulse();
  }, [breathingPhase]);

  const startMeditation = () => {
    setIsActive(true);
    setSeconds(0);
  };

  const pauseMeditation = () => {
    setIsActive(false);
  };

  const resetMeditation = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = seconds / (selectedDuration * 60);

  const getBreathingInstruction = () => {
    switch(breathingPhase) {
      case 'inhale': return { text: 'Inhala profundamente', icon: 'arrow-up-circle', color: '#4CAF50' };
      case 'hold': return { text: 'Mantén el aire', icon: 'pause-circle', color: '#FFA500' };
      case 'exhale': return { text: 'Exhala lentamente', icon: 'arrow-down-circle', color: '#2196F3' };
      default: return { text: 'Respira', icon: 'circle', color: '#6B9BD1' };
    }
  };

  const instruction = getBreathingInstruction();

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Meditación Guiada</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView>
        <View style={styles.header}>
          <Icon name="meditation" size={48} color="#6B9BD1" />
          <Title style={styles.title}>Encuentra tu paz interior</Title>
          <Paragraph style={styles.subtitle}>
            Meditación con guía de respiración
          </Paragraph>
        </View>

      {!isActive && seconds === 0 ? (
        <>
          <Card style={styles.durationCard}>
            <Card.Content>
              <Title>Selecciona la duración</Title>
              <View style={styles.durationGrid}>
                {durations.map((duration) => (
                  <Card
                    key={duration.value}
                    style={[
                      styles.durationOption,
                      selectedDuration === duration.value && styles.selectedDuration
                    ]}
                    onPress={() => setSelectedDuration(duration.value)}
                  >
                    <Card.Content style={styles.durationContent}>
                      <Text style={styles.durationLabel}>{duration.label}</Text>
                      <Text style={styles.durationDesc}>{duration.desc}</Text>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.benefitsCard}>
            <Card.Content>
              <Title>Beneficios de la Meditación</Title>
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Icon name="brain" size={24} color="#6B9BD1" />
                  <Text style={styles.benefitText}>Reduce el estrés y la ansiedad</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Icon name="heart-pulse" size={24} color="#6B9BD1" />
                  <Text style={styles.benefitText}>Mejora la salud cardiovascular</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Icon name="sleep" size={24} color="#6B9BD1" />
                  <Text style={styles.benefitText}>Mejora la calidad del sueño</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Icon name="lightbulb-on" size={24} color="#6B9BD1" />
                  <Text style={styles.benefitText}>Aumenta la concentración</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Icon name="emoticon-happy" size={24} color="#6B9BD1" />
                  <Text style={styles.benefitText}>Mejora el estado de ánimo</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            onPress={startMeditation}
            style={styles.startButton}
            icon="play"
          >
            Comenzar Meditación ({selectedDuration} min)
          </Button>
        </>
      ) : (
        <Card style={styles.meditationCard}>
          <Card.Content>
            <View style={styles.timerContainer}>
              <Animated.View style={[styles.breathingCircle, { transform: [{ scale: pulseAnimation }] }]}>
                <Icon name={instruction.icon} size={48} color="#FFFFFF" />
              </Animated.View>

              <Text style={styles.timerText}>{formatTime(seconds)}</Text>
              <Text style={styles.totalTime}>de {formatTime(selectedDuration * 60)}</Text>

              <ProgressBar progress={progress} color="#6B9BD1" style={styles.progressBar} />

              <View style={styles.instructionContainer}>
                <Icon name={instruction.icon} size={32} color={instruction.color} />
                <Text style={[styles.instructionText, { color: instruction.color }]}>
                  {instruction.text}
                </Text>
              </View>
            </View>

            <View style={styles.controlButtons}>
              {isActive ? (
                <Button mode="outlined" onPress={pauseMeditation} icon="pause">
                  Pausar
                </Button>
              ) : (
                <Button mode="contained" onPress={startMeditation} icon="play">
                  Continuar
                </Button>
              )}
              <Button mode="text" onPress={resetMeditation} icon="stop">
                Detener
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.tipsCard}>
        <Card.Content>
          <Title>Consejos para meditar</Title>
          <View style={styles.tipsList}>
            <Text style={styles.tip}>🪷 Encuentra un lugar tranquilo</Text>
            <Text style={styles.tip}>🧘 Siéntate cómodamente</Text>
            <Text style={styles.tip}>👁️ Cierra los ojos suavemente</Text>
            <Text style={styles.tip}>🫁 Enfócate en tu respiración</Text>
            <Text style={styles.tip}>💭 Deja pasar los pensamientos sin juzgar</Text>
            <Text style={styles.tip}>⏰ Practica diariamente</Text>
          </View>
        </Card.Content>
      </Card>
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
    fontSize: 28,
    marginTop: 12,
  },
  subtitle: {
    textAlign: 'center',
    color: '#7F8C8D',
    marginTop: 8,
  },
  durationCard: {
    margin: 20,
    elevation: 3,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  durationOption: {
    flex: 1,
    minWidth: '45%',
    elevation: 2,
  },
  selectedDuration: {
    backgroundColor: '#E8F4F8',
    borderWidth: 2,
    borderColor: '#6B9BD1',
  },
  durationContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  durationLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  durationDesc: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  benefitsCard: {
    margin: 20,
    marginTop: 12,
    elevation: 2,
  },
  benefitsList: {
    marginTop: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: '#2C3E50',
  },
  startButton: {
    margin: 20,
    marginTop: 12,
    paddingVertical: 8,
  },
  meditationCard: {
    margin: 20,
    elevation: 4,
    backgroundColor: '#FFFFFF',
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  breathingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#6B9BD1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  totalTime: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginVertical: 20,
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  tipsCard: {
    margin: 20,
    marginTop: 12,
    marginBottom: 30,
    backgroundColor: '#FFF9E6',
    elevation: 2,
  },
  tipsList: {
    marginTop: 12,
  },
  tip: {
    fontSize: 14,
    color: '#2C3E50',
    marginVertical: 6,
    lineHeight: 20,
  },
});
