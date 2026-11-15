import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Text, IconButton, ProgressBar, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ChallengesScreen({ navigation }) {
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = () => {
    const saved = localStorage.getItem('activeChallenges');
    if (saved) {
      setActiveChallenges(JSON.parse(saved));
    }

    const completed = localStorage.getItem('completedChallenges');
    if (completed) {
      setCompletedChallenges(JSON.parse(completed));
    }
  };

  const challenges = [
    {
      id: 1,
      title: 'Semana de Meditación',
      description: 'Medita 10 minutos diarios durante 7 días consecutivos',
      duration: '7 días',
      reward: '100 puntos + Badge "Zen Master"',
      icon: 'meditation',
      color: '#9C27B0',
      difficulty: 'Intermedio',
      type: 'meditation'
    },
    {
      id: 2,
      title: 'Diario de Gratitud',
      description: 'Escribe 3 cosas por las que estés agradecido durante 21 días',
      duration: '21 días',
      reward: '200 puntos + Badge "Corazón Agradecido"',
      icon: 'notebook-heart',
      color: '#FF9800',
      difficulty: 'Fácil',
      type: 'journal'
    },
    {
      id: 3,
      title: 'Maestro de la Respiración',
      description: 'Completa 30 ejercicios de respiración',
      duration: '30 días',
      reward: '150 puntos + Badge "Respiración Zen"',
      icon: 'lungs',
      color: '#4CAF50',
      difficulty: 'Fácil',
      type: 'breathing'
    },
    {
      id: 4,
      title: 'Explorador Musical',
      description: 'Escucha las 6 playlists de musicoterapia',
      duration: '1 semana',
      reward: '80 puntos + Badge "Melómano"',
      icon: 'music',
      color: '#2196F3',
      difficulty: 'Fácil',
      type: 'music'
    },
    {
      id: 5,
      title: 'Guerrero del Bienestar',
      description: 'Completa 50 actividades en total (música + ejercicios)',
      duration: 'Sin límite',
      reward: '300 puntos + Badge "Guerrero"',
      icon: 'shield-star',
      color: '#FFD700',
      difficulty: 'Difícil',
      type: 'mixed'
    },
    {
      id: 6,
      title: 'Racha de Fuego',
      description: 'Mantén una racha de 14 días consecutivos',
      duration: '14 días',
      reward: '250 puntos + Badge "En Llamas"',
      icon: 'fire',
      color: '#FF6B6B',
      difficulty: 'Intermedio',
      type: 'streak'
    },
  ];

  const startChallenge = (challenge) => {
    const newChallenge = {
      ...challenge,
      startDate: new Date().toISOString(),
      progress: 0,
      status: 'active'
    };

    const updated = [...activeChallenges, newChallenge];
    setActiveChallenges(updated);
    localStorage.setItem('activeChallenges', JSON.stringify(updated));

    alert(`🎯 Reto Aceptado!\n\n"${challenge.title}"\n\n${challenge.description}\n\n🏆 Recompensa: ${challenge.reward}\n\n¡Buena suerte!`);
  };

  const completeChallenge = (challenge) => {
    const updated = activeChallenges.filter(c => c.id !== challenge.id);
    setActiveChallenges(updated);
    localStorage.setItem('activeChallenges', JSON.stringify(updated));

    const completed = [...completedChallenges, { ...challenge, completedDate: new Date().toISOString() }];
    setCompletedChallenges(completed);
    localStorage.setItem('completedChallenges', JSON.stringify(completed));

    alert(`🎉 ¡Reto Completado!\n\n"${challenge.title}"\n\n🏆 Has ganado: ${challenge.reward}\n\n¡Felicidades por tu dedicación!`);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Fácil': return '#4CAF50';
      case 'Intermedio': return '#FF9800';
      case 'Difícil': return '#FF6B6B';
      default: return '#6B9BD1';
    }
  };

  const totalPoints = completedChallenges.reduce((sum, c) => {
    const points = parseInt(c.reward.match(/\d+/)[0]);
    return sum + points;
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Retos y Desafíos</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView>
        <View style={styles.header}>
          <Icon name="trophy" size={48} color="#FFD700" />
          <Title style={styles.title}>Desafía tu Bienestar</Title>
          <Paragraph style={styles.subtitle}>
            Completa retos y gana recompensas
          </Paragraph>
        </View>

        {/* Puntos Totales */}
        <Card style={styles.pointsCard}>
          <Card.Content>
            <View style={styles.pointsContent}>
              <Icon name="star-circle" size={48} color="#FFD700" />
              <View style={styles.pointsInfo}>
                <Text style={styles.pointsNumber}>{totalPoints}</Text>
                <Text style={styles.pointsLabel}>Puntos Totales</Text>
              </View>
              <View style={styles.statsInfo}>
                <Text style={styles.statText}>{activeChallenges.length} Activos</Text>
                <Text style={styles.statText}>{completedChallenges.length} Completados</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Retos Activos */}
        {activeChallenges.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🔥 Retos Activos</Text>
            {activeChallenges.map((challenge) => (
              <Card key={challenge.id} style={styles.challengeCard}>
                <Card.Content>
                  <View style={styles.challengeHeader}>
                    <Icon name={challenge.icon} size={40} color={challenge.color} />
                    <View style={styles.challengeInfo}>
                      <Title style={styles.challengeTitle}>{challenge.title}</Title>
                      <Chip
                        style={[styles.difficultyChip, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}
                        textStyle={{ color: '#FFFFFF', fontSize: 11 }}
                      >
                        {challenge.difficulty}
                      </Chip>
                    </View>
                  </View>

                  <Paragraph style={styles.challengeDesc}>{challenge.description}</Paragraph>

                  <View style={styles.challengeMeta}>
                    <Text style={styles.metaText}>⏱️ {challenge.duration}</Text>
                    <Text style={styles.metaText}>🏆 {challenge.reward}</Text>
                  </View>

                  <ProgressBar progress={challenge.progress / 100} color={challenge.color} style={styles.progressBar} />
                  <Text style={styles.progressText}>{challenge.progress}% completado</Text>

                  <View style={styles.challengeActions}>
                    <Button
                      mode="outlined"
                      onPress={() => {
                        const updated = activeChallenges.map(c =>
                          c.id === challenge.id ? { ...c, progress: Math.min(c.progress + 10, 100) } : c
                        );
                        setActiveChallenges(updated);
                        localStorage.setItem('activeChallenges', JSON.stringify(updated));
                      }}
                    >
                      Actualizar Progreso
                    </Button>
                    {challenge.progress >= 100 && (
                      <Button
                        mode="contained"
                        onPress={() => completeChallenge(challenge)}
                      >
                        Completar
                      </Button>
                    )}
                  </View>
                </Card.Content>
              </Card>
            ))}
          </>
        )}

        {/* Retos Disponibles */}
        <Text style={styles.sectionTitle}>🎯 Retos Disponibles</Text>
        {challenges
          .filter(c => !activeChallenges.find(ac => ac.id === c.id) && !completedChallenges.find(cc => cc.id === c.id))
          .map((challenge) => (
            <Card key={challenge.id} style={styles.challengeCard}>
              <Card.Content>
                <View style={styles.challengeHeader}>
                  <Icon name={challenge.icon} size={40} color={challenge.color} />
                  <View style={styles.challengeInfo}>
                    <Title style={styles.challengeTitle}>{challenge.title}</Title>
                    <Chip
                      style={[styles.difficultyChip, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}
                      textStyle={{ color: '#FFFFFF', fontSize: 11 }}
                    >
                      {challenge.difficulty}
                    </Chip>
                  </View>
                </View>

                <Paragraph style={styles.challengeDesc}>{challenge.description}</Paragraph>

                <View style={styles.challengeMeta}>
                  <Text style={styles.metaText}>⏱️ {challenge.duration}</Text>
                  <Text style={styles.metaText}>🏆 {challenge.reward}</Text>
                </View>

                <Button
                  mode="contained"
                  icon="flag"
                  onPress={() => startChallenge(challenge)}
                  style={styles.startButton}
                >
                  Aceptar Reto
                </Button>
              </Card.Content>
            </Card>
          ))}

        {/* Retos Completados */}
        {completedChallenges.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>✅ Retos Completados</Text>
            {completedChallenges.map((challenge) => (
              <Card key={challenge.id} style={[styles.challengeCard, styles.completedCard]}>
                <Card.Content>
                  <View style={styles.challengeHeader}>
                    <Icon name={challenge.icon} size={40} color={challenge.color} />
                    <View style={styles.challengeInfo}>
                      <Title style={styles.challengeTitle}>{challenge.title}</Title>
                      <Chip
                        icon="check-circle"
                        style={styles.completedChip}
                        textStyle={{ color: '#FFFFFF', fontSize: 11 }}
                      >
                        Completado
                      </Chip>
                    </View>
                  </View>

                  <Paragraph style={styles.challengeDesc}>{challenge.description}</Paragraph>

                  <View style={styles.rewardBadge}>
                    <Icon name="trophy" size={24} color="#FFD700" />
                    <Text style={styles.rewardText}>{challenge.reward}</Text>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </>
        )}

        {/* Beneficios */}
        <Card style={styles.benefitsCard}>
          <Card.Content>
            <Title>💡 Beneficios de los Retos</Title>
            <View style={styles.benefitsList}>
              <Text style={styles.benefit}>✓ Mantén la motivación alta</Text>
              <Text style={styles.benefit}>✓ Crea hábitos saludables</Text>
              <Text style={styles.benefit}>✓ Gana recompensas y badges</Text>
              <Text style={styles.benefit}>✓ Mide tu progreso</Text>
              <Text style={styles.benefit}>✓ Supérate a ti mismo</Text>
            </View>
          </Card.Content>
        </Card>

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
  pointsCard: {
    margin: 20,
    marginTop: 12,
    elevation: 3,
    backgroundColor: '#FFF9E6',
  },
  pointsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  pointsLabel: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  statsInfo: {
    alignItems: 'flex-end',
  },
  statText: {
    fontSize: 12,
    color: '#2C3E50',
    marginVertical: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 16,
    marginBottom: 12,
    color: '#2C3E50',
  },
  challengeCard: {
    margin: 20,
    marginTop: 12,
    elevation: 2,
  },
  completedCard: {
    backgroundColor: '#E8F5E9',
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 18,
    margin: 0,
    marginBottom: 8,
  },
  difficultyChip: {
    alignSelf: 'flex-start',
  },
  completedChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#4CAF50',
  },
  challengeDesc: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 12,
  },
  challengeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaText: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 12,
  },
  challengeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  startButton: {
    marginTop: 8,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
  },
  rewardText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
  },
  benefitsCard: {
    margin: 20,
    marginTop: 12,
    elevation: 2,
    backgroundColor: '#E8F4F8',
  },
  benefitsList: {
    marginTop: 12,
  },
  benefit: {
    fontSize: 14,
    color: '#2C3E50',
    marginVertical: 4,
  },
});
