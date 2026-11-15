import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../services/api';

export default function ProgressScreen() {
  const [stats, setStats] = useState({
    musicaSesiones: 0,
    ejerciciosSesiones: 0,
    cuestionariosCompletados: 0,
    diasConsecutivos: 0,
    tiempoTotal: 0,
    estadoEmocionalActual: 'Neutral',
    mejoria: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    // Cargar estadísticas del localStorage
    const musicaSesiones = parseInt(localStorage.getItem('musicaSesiones') || '0');
    const ejerciciosSesiones = parseInt(localStorage.getItem('ejerciciosSesiones') || '0');
    const cuestionariosCompletados = parseInt(localStorage.getItem('cuestionariosCompletados') || '0');

    setStats({
      musicaSesiones,
      ejerciciosSesiones,
      cuestionariosCompletados,
      diasConsecutivos: Math.floor((musicaSesiones + ejerciciosSesiones) / 3),
      tiempoTotal: (musicaSesiones * 45) + (ejerciciosSesiones * 15),
      estadoEmocionalActual: cuestionariosCompletados > 0 ? 'Mejorando' : 'Sin evaluar',
      mejoria: Math.min((musicaSesiones + ejerciciosSesiones) * 5, 100)
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="chart-line" size={48} color="#6B9BD1" />
        <Title style={styles.title}>Mi Progreso</Title>
        <Paragraph style={styles.subtitle}>Seguimiento de tu bienestar emocional</Paragraph>
      </View>

      <Card style={styles.statsCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>📊 Resumen de Actividad</Title>

          <View style={styles.statRow}>
            <Icon name="music" size={28} color="#6B9BD1" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{stats.musicaSesiones}</Text>
              <Text style={styles.statLabel}>Sesiones de música</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <Icon name="brain" size={28} color="#6B9BD1" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{stats.ejerciciosSesiones}</Text>
              <Text style={styles.statLabel}>Ejercicios completados</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <Icon name="clipboard-check" size={28} color="#6B9BD1" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{stats.cuestionariosCompletados}</Text>
              <Text style={styles.statLabel}>Cuestionarios realizados</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statsCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>⏱️ Tiempo Invertido</Title>

          <View style={styles.statRow}>
            <Icon name="clock-outline" size={28} color="#6B9BD1" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{stats.tiempoTotal} min</Text>
              <Text style={styles.statLabel}>Tiempo total de práctica</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <Icon name="calendar-check" size={28} color="#6B9BD1" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{stats.diasConsecutivos}</Text>
              <Text style={styles.statLabel}>Días de práctica</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statsCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>💚 Estado Emocional</Title>

          <View style={styles.statRow}>
            <Icon name="heart-pulse" size={28} color="#6B9BD1" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{stats.estadoEmocionalActual}</Text>
              <Text style={styles.statLabel}>Estado actual</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <Icon name="trending-up" size={28} color="#4CAF50" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{stats.mejoria}%</Text>
              <Text style={styles.statLabel}>Progreso de bienestar</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.motivationCard}>
        <Card.Content>
          <Title style={styles.motivationTitle}>💡 Consejo del día</Title>
          <Paragraph style={styles.motivationText}>
            {stats.musicaSesiones + stats.ejerciciosSesiones === 0
              ? "¡Comienza hoy! Prueba una sesión de música relajante o un ejercicio de respiración."
              : stats.musicaSesiones + stats.ejerciciosSesiones < 5
              ? "¡Vas muy bien! La constancia es clave. Intenta practicar al menos 10 minutos al día."
              : "¡Excelente progreso! Estás construyendo hábitos saludables. Sigue así 🌟"}
          </Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9FC' },
  header: { alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#FFFFFF' },
  title: { fontSize: 28, marginTop: 12 },
  subtitle: { textAlign: 'center', color: '#7F8C8D', marginTop: 8 },
  statsCard: { margin: 20, marginBottom: 12, elevation: 2 },
  cardTitle: { fontSize: 18, marginBottom: 16, color: '#2C3E50' },
  statRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12, paddingVertical: 8 },
  statInfo: { marginLeft: 16, flex: 1 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50' },
  statLabel: { fontSize: 14, color: '#7F8C8D', marginTop: 4 },
  motivationCard: { margin: 20, marginTop: 12, backgroundColor: '#E8F4F8', elevation: 2 },
  motivationTitle: { fontSize: 18, color: '#2C3E50', marginBottom: 8 },
  motivationText: { fontSize: 15, color: '#34495E', lineHeight: 22 },
});
