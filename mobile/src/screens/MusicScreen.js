import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../services/api';

export default function MusicScreen() {
  const [playlists, setPlaylists] = useState([
    {
      id: 1,
      nombre: 'Calma Profunda',
      descripcion: 'Música relajante para reducir el estrés y la ansiedad',
      duracion_minutos: 45,
      categoria: 'Relajación'
    },
    {
      id: 2,
      nombre: 'Energía Positiva',
      descripcion: 'Música motivadora para levantar el ánimo',
      duracion_minutos: 35,
      categoria: 'Motivación'
    },
    {
      id: 3,
      nombre: 'Concentración',
      descripcion: 'Música para mejorar el enfoque y la productividad',
      duracion_minutos: 60,
      categoria: 'Enfoque'
    },
    {
      id: 4,
      nombre: 'Sueño Profundo',
      descripcion: 'Sonidos relajantes para dormir mejor',
      duracion_minutos: 90,
      categoria: 'Descanso'
    },
    {
      id: 5,
      nombre: 'Alivio del Estrés',
      descripcion: 'Frecuencias suaves para calmar la mente',
      duracion_minutos: 40,
      categoria: 'Relajación'
    },
    {
      id: 6,
      nombre: 'Meditación Guiada',
      descripcion: 'Música ambiental para prácticas de mindfulness',
      duracion_minutos: 30,
      categoria: 'Meditación'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const playlistsByCategoria = playlists.reduce((acc, playlist) => {
    const categoria = playlist.categoria;
    if (!acc[categoria]) acc[categoria] = [];
    acc[categoria].push(playlist);
    return acc;
  }, {});

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="music" size={48} color="#6B9BD1" />
        <Title style={styles.title}>Musicoterapia</Title>
        <Paragraph style={styles.subtitle}>
          Playlists diseñadas para tu bienestar emocional
        </Paragraph>
      </View>

      {Object.keys(playlistsByCategoria).map((categoria) => (
        <View key={categoria} style={styles.section}>
          <Text style={styles.sectionTitle}>{categoria}</Text>
          {playlistsByCategoria[categoria].map((playlist) => (
            <Card key={playlist.id} style={styles.playlistCard}>
              <Card.Content>
                <View style={styles.playlistHeader}>
                  <Icon name="playlist-music" size={32} color="#6B9BD1" />
                  <View style={styles.playlistInfo}>
                    <Title style={styles.playlistTitle}>{playlist.nombre}</Title>
                    <Paragraph style={styles.playlistDescription}>
                      {playlist.descripcion}
                    </Paragraph>
                    <Text style={styles.duration}>⏱️ {playlist.duracion_minutos} minutos</Text>
                  </View>
                </View>
                <Button
                  mode="contained"
                  icon="play"
                  onPress={() => {
                    // Guardar estadística
                    const currentSessions = parseInt(localStorage.getItem('musicaSesiones') || '0');
                    localStorage.setItem('musicaSesiones', (currentSessions + 1).toString());

                    alert(`🎵 ${playlist.nombre}\n\n${playlist.descripcion}\n\n⏱️ Duración: ${playlist.duracion_minutos} minutos\n\n✅ Playlist lista para reproducir\n\n💡 Beneficios:\n• Reduce el estrés\n• Mejora el estado de ánimo\n• Ayuda a la concentración\n\n🎧 Reproduciendo ahora...\n\n💡 Tip: Cierra los ojos y respira profundamente mientras escuchas.\n\n📊 ¡Sesión registrada en tu progreso!`);

                    // Abrir playlist en YouTube Music (búsqueda)
                    const searchQuery = encodeURIComponent(`${playlist.nombre} música relajante`);
                    const youtubeUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

                    // Abrir en nueva pestaña
                    if (typeof window !== 'undefined') {
                      window.open(youtubeUrl, '_blank');
                    }
                  }}
                  style={styles.playButton}
                >
                  Reproducir
                </Button>
              </Card.Content>
            </Card>
          ))}
        </View>
      ))}
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
    padding: 20,
    paddingTop: 60,
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
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#7F8C8D',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 12,
    color: '#2C3E50',
  },
  playlistCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    elevation: 2,
  },
  playlistHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  playlistInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playlistTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  playlistDescription: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  playButton: {
    marginTop: 8,
  },
  duration: {
    fontSize: 12,
    color: '#6B9BD1',
    marginTop: 4,
  },
});
