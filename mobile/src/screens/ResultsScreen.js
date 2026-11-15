import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const estadoEmocionalInfo = {
  estres: { icon: 'head-flash', color: '#E67E22', label: 'Estrés' },
  ansiedad: { icon: 'emoticon-sad', color: '#E74C3C', label: 'Ansiedad' },
  tristeza: { icon: 'emoticon-cry', color: '#3498DB', label: 'Tristeza' },
  insomnio: { icon: 'sleep-off', color: '#9B59B6', label: 'Insomnio' },
  faltaAtencion: { icon: 'head-question', color: '#F39C12', label: 'Falta de Atención' },
  dolorCabeza: { icon: 'head-alert', color: '#E74C3C', label: 'Dolor de Cabeza' },
};

export default function ResultsScreen({ route, navigation }) {
  const { data } = route.params;
  const { resultado, recomendaciones } = data;

  const estadoInfo = estadoEmocionalInfo[resultado.estado];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name={estadoInfo.icon} size={64} color={estadoInfo.color} />
        <Title style={styles.title}>Tus Resultados</Title>
      </View>

      <Card style={styles.resultCard}>
        <Card.Content>
          <View style={styles.estadoContainer}>
            <Title style={[styles.estadoTitle, { color: estadoInfo.color }]}>
              {estadoInfo.label}
            </Title>
            <Chip mode="outlined" style={styles.nivelChip}>
              Nivel: {resultado.nivel}
            </Chip>
          </View>
          <Paragraph style={styles.description}>
            Basado en tus respuestas, hemos identificado este estado emocional predominante.
          </Paragraph>
        </Card.Content>
      </Card>

      <Title style={styles.sectionTitle}>Recomendaciones</Title>

      {recomendaciones.playlists && recomendaciones.playlists.length > 0 && (
        <Card style={styles.recommendationCard}>
          <Card.Content>
            <View style={styles.recommendationHeader}>
              <Icon name="music" size={24} color="#6B9BD1" />
              <Title style={styles.recommendationTitle}>Playlists Sugeridas</Title>
            </View>
            {recomendaciones.playlists.map((playlist, index) => (
              <Card key={index} style={styles.playlistCard} mode="outlined">
                <Card.Content>
                  <Title style={styles.playlistTitle}>{playlist.nombre}</Title>
                  <Paragraph>{playlist.descripcion}</Paragraph>
                  <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Music', { playlistId: playlist.id })}
                    style={styles.playButton}
                    icon="play"
                  >
                    Reproducir
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </Card.Content>
        </Card>
      )}

      {recomendaciones.ejercicios && recomendaciones.ejercicios.length > 0 && (
        <Card style={styles.recommendationCard}>
          <Card.Content>
            <View style={styles.recommendationHeader}>
              <Icon name="brain" size={24} color="#6B9BD1" />
              <Title style={styles.recommendationTitle}>Ejercicios TCC</Title>
            </View>
            {recomendaciones.ejercicios.slice(0, 2).map((ejercicio, index) => (
              <Card key={index} style={styles.exerciseCard} mode="outlined">
                <Card.Content>
                  <Title style={styles.exerciseTitle}>{ejercicio.titulo}</Title>
                  <Paragraph>{ejercicio.descripcion}</Paragraph>
                  <View style={styles.exerciseInfo}>
                    <Icon name="clock-outline" size={16} color="#7F8C8D" />
                    <Paragraph style={styles.duration}>
                      {ejercicio.duracion_minutos} minutos
                    </Paragraph>
                  </View>
                </Card.Content>
              </Card>
            ))}
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('TCC')}
              style={styles.viewAllButton}
            >
              Ver todos los ejercicios
            </Button>
          </Card.Content>
        </Card>
      )}

      <Button
        mode="contained"
        onPress={() => navigation.navigate('MainTabs')}
        style={styles.homeButton}
        icon="home"
      >
        Volver al Inicio
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FC',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    marginTop: 12,
  },
  resultCard: {
    margin: 20,
    marginTop: 10,
    elevation: 4,
  },
  estadoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  estadoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  nivelChip: {
    backgroundColor: '#E8F4F8',
  },
  description: {
    color: '#7F8C8D',
  },
  sectionTitle: {
    fontSize: 20,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  recommendationCard: {
    margin: 20,
    marginTop: 10,
    elevation: 2,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  recommendationTitle: {
    fontSize: 18,
    marginLeft: 8,
  },
  playlistCard: {
    marginBottom: 12,
  },
  playlistTitle: {
    fontSize: 16,
  },
  playButton: {
    marginTop: 12,
  },
  exerciseCard: {
    marginBottom: 12,
  },
  exerciseTitle: {
    fontSize: 16,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  duration: {
    marginLeft: 4,
    fontSize: 12,
    color: '#7F8C8D',
  },
  viewAllButton: {
    marginTop: 8,
  },
  homeButton: {
    margin: 20,
    paddingVertical: 6,
  },
});
