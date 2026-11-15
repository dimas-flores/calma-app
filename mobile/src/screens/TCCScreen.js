import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Chip, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../services/api';

const tipoIcons = {
  respiracion: 'lungs',
  relajacion: 'meditation',
  mindfulness: 'brain',
  reestructuracion: 'head-lightbulb',
  meditacion: 'yoga',
};

export default function TCCScreen() {
  const [exercises, setExercises] = useState([
    {
      id: 1,
      titulo: 'Respiración 4-7-8',
      descripcion: 'Técnica de respiración profunda para reducir ansiedad instantáneamente',
      tipo: 'respiracion',
      duracion_minutos: 5,
      dificultad: 'principiante'
    },
    {
      id: 2,
      titulo: 'Escaneo Corporal',
      descripcion: 'Técnica de relajación progresiva para liberar tensión muscular',
      tipo: 'relajacion',
      duracion_minutos: 15,
      dificultad: 'principiante'
    },
    {
      id: 3,
      titulo: 'Meditación Mindfulness',
      descripcion: 'Práctica de atención plena al momento presente',
      tipo: 'mindfulness',
      duracion_minutos: 10,
      dificultad: 'intermedio'
    },
    {
      id: 4,
      titulo: 'Registro de Pensamientos',
      descripcion: 'Identifica y cuestiona pensamientos automáticos negativos',
      tipo: 'reestructuracion',
      duracion_minutos: 15,
      dificultad: 'intermedio'
    },
    {
      id: 5,
      titulo: 'Gratitud Diaria',
      descripcion: 'Práctica de mindfulness enfocada en lo positivo de tu vida',
      tipo: 'mindfulness',
      duracion_minutos: 5,
      dificultad: 'principiante'
    },
    {
      id: 6,
      titulo: 'Relajación Muscular Progresiva',
      descripcion: 'Técnica para liberar tensión física y mental',
      tipo: 'relajacion',
      duracion_minutos: 20,
      dificultad: 'principiante'
    },
    {
      id: 7,
      titulo: 'Reestructuración Cognitiva',
      descripcion: 'Técnica avanzada para cambiar patrones de pensamiento',
      tipo: 'reestructuracion',
      duracion_minutos: 20,
      dificultad: 'avanzado'
    },
    {
      id: 8,
      titulo: 'Meditación de Compasión',
      descripcion: 'Cultiva la autocompasión y el amor propio',
      tipo: 'meditacion',
      duracion_minutos: 15,
      dificultad: 'intermedio'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const exercisesByTipo = exercises.reduce((acc, exercise) => {
    const tipo = exercise.tipo;
    if (!acc[tipo]) acc[tipo] = [];
    acc[tipo].push(exercise);
    return acc;
  }, {});

  const tipoLabels = {
    respiracion: 'Respiración',
    relajacion: 'Relajación',
    mindfulness: 'Mindfulness',
    reestructuracion: 'Reestructuración Cognitiva',
    meditacion: 'Meditación',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="brain" size={48} color="#6B9BD1" />
        <Title style={styles.title}>Ejercicios TCC</Title>
        <Paragraph style={styles.subtitle}>
          Técnicas de Terapia Cognitivo-Conductual
        </Paragraph>
      </View>

      {Object.keys(exercisesByTipo).map((tipo) => (
        <View key={tipo} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name={tipoIcons[tipo]} size={24} color="#6B9BD1" />
            <Text style={styles.sectionTitle}>{tipoLabels[tipo]}</Text>
          </View>

          {exercisesByTipo[tipo].map((exercise) => (
            <Card key={exercise.id} style={styles.exerciseCard}>
              <Card.Content>
                <Title style={styles.exerciseTitle}>{exercise.titulo}</Title>
                <Paragraph style={styles.exerciseDescription}>
                  {exercise.descripcion}
                </Paragraph>
                <View style={styles.exerciseFooter}>
                  <Chip icon="clock-outline" style={styles.durationChip}>
                    {exercise.duracion_minutos} min
                  </Chip>
                  <Chip
                    icon="play"
                    style={styles.startChip}
                    onPress={() => {
                      // Guardar estadística
                      const currentSessions = parseInt(localStorage.getItem('ejerciciosSesiones') || '0');
                      localStorage.setItem('ejerciciosSesiones', (currentSessions + 1).toString());

                      alert(`🧠 ${exercise.titulo}\n\n📝 Descripción:\n${exercise.descripcion}\n\n⏱️ Duración: ${exercise.duracion_minutos} minutos\n📊 Dificultad: ${exercise.dificultad}\n\n✅ Iniciando ejercicio...\n\n💡 Instrucciones:\n1. Busca un lugar tranquilo\n2. Ponte cómodo\n3. Respira profundamente\n4. Sigue las indicaciones\n\n🌟 Se abrirá un video guiado en YouTube\n\n📊 ¡Ejercicio registrado en tu progreso!`);

                      // Abrir video guiado en YouTube
                      const searchQuery = encodeURIComponent(`${exercise.titulo} guiado español meditación`);
                      const youtubeUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

                      // Abrir en nueva pestaña
                      if (typeof window !== 'undefined') {
                        window.open(youtubeUrl, '_blank');
                      }
                    }}
                  >
                    Comenzar
                  </Chip>
                </View>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#2C3E50',
  },
  exerciseCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    elevation: 2,
  },
  exerciseTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 12,
  },
  exerciseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationChip: {
    backgroundColor: '#E8F4F8',
  },
  startChip: {
    backgroundColor: '#6B9BD1',
  },
});
