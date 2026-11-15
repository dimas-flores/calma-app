import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Chip, IconButton, SegmentedButtons } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const screenWidth = Dimensions.get('window').width;

export default function AdvancedStatsScreen({ navigation }) {
  const [period, setPeriod] = useState('week');
  const [stats, setStats] = useState({
    musicaSesiones: 0,
    ejerciciosSesiones: 0,
    cuestionariosCompletados: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const musicaSesiones = parseInt(localStorage.getItem('musicaSesiones') || '0');
    const ejerciciosSesiones = parseInt(localStorage.getItem('ejerciciosSesiones') || '0');
    const cuestionariosCompletados = parseInt(localStorage.getItem('cuestionariosCompletados') || '0');

    setStats({
      musicaSesiones,
      ejerciciosSesiones,
      cuestionariosCompletados,
    });
  };

  // Simular datos históricos
  const getWeeklyData = () => {
    return [
      { day: 'Lun', music: 2, exercise: 1, mood: 7 },
      { day: 'Mar', music: 1, exercise: 2, mood: 8 },
      { day: 'Mié', music: 3, exercise: 1, mood: 7 },
      { day: 'Jue', music: 2, exercise: 3, mood: 9 },
      { day: 'Vie', music: 1, exercise: 2, mood: 8 },
      { day: 'Sáb', music: 2, exercise: 1, mood: 9 },
      { day: 'Dom', music: 1, exercise: 2, mood: 8 },
    ];
  };

  const weeklyData = getWeeklyData();
  const maxValue = Math.max(...weeklyData.map(d => Math.max(d.music, d.exercise)));

  const totalActivities = stats.musicaSesiones + stats.ejerciciosSesiones;
  const avgMood = 8.2;
  const streak = Math.floor(totalActivities / 3);
  const improvement = totalActivities > 0 ? Math.min((totalActivities / 21) * 100, 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Estadísticas Avanzadas</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView>
        <View style={styles.header}>
          <Icon name="chart-box" size={48} color="#6B9BD1" />
          <Title style={styles.title}>Análisis Detallado</Title>
          <Paragraph style={styles.subtitle}>
            Tu progreso en números
          </Paragraph>
        </View>

        {/* Resumen Rápido */}
        <View style={styles.quickStats}>
          <Card style={styles.quickStatCard}>
            <Card.Content style={styles.quickStatContent}>
              <Icon name="fire" size={32} color="#FF6B6B" />
              <Text style={styles.quickStatNumber}>{streak}</Text>
              <Text style={styles.quickStatLabel}>Días racha</Text>
            </Card.Content>
          </Card>

          <Card style={styles.quickStatCard}>
            <Card.Content style={styles.quickStatContent}>
              <Icon name="emoticon-happy" size={32} color="#4CAF50" />
              <Text style={styles.quickStatNumber}>{avgMood.toFixed(1)}</Text>
              <Text style={styles.quickStatLabel}>Ánimo promedio</Text>
            </Card.Content>
          </Card>

          <Card style={styles.quickStatCard}>
            <Card.Content style={styles.quickStatContent}>
              <Icon name="trending-up" size={32} color="#2196F3" />
              <Text style={styles.quickStatNumber}>{improvement.toFixed(0)}%</Text>
              <Text style={styles.quickStatLabel}>Mejora</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Selector de Período */}
        <Card style={styles.periodCard}>
          <Card.Content>
            <SegmentedButtons
              value={period}
              onValueChange={setPeriod}
              buttons={[
                { value: 'week', label: 'Semana' },
                { value: 'month', label: 'Mes' },
                { value: 'year', label: 'Año' },
              ]}
            />
          </Card.Content>
        </Card>

        {/* Gráfico de Barras Simulado */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>Actividad Semanal</Title>
            <View style={styles.chart}>
              {weeklyData.map((data, index) => (
                <View key={index} style={styles.barGroup}>
                  <View style={styles.barsContainer}>
                    <View
                      style={[
                        styles.bar,
                        styles.musicBar,
                        { height: (data.music / maxValue) * 100 }
                      ]}
                    />
                    <View
                      style={[
                        styles.bar,
                        styles.exerciseBar,
                        { height: (data.exercise / maxValue) * 100 }
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{data.day}</Text>
                </View>
              ))}
            </View>
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#6B9BD1' }]} />
                <Text style={styles.legendText}>Música</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.legendText}>Ejercicios</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Gráfico de Estado de Ánimo */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>Estado de Ánimo</Title>
            <View style={styles.moodChart}>
              {weeklyData.map((data, index) => (
                <View key={index} style={styles.moodPoint}>
                  <View style={styles.moodLine}>
                    {index < weeklyData.length - 1 && (
                      <View style={styles.moodConnector} />
                    )}
                  </View>
                  <View
                    style={[
                      styles.moodDot,
                      { bottom: (data.mood / 10) * 120 }
                    ]}
                  />
                  <Text style={styles.moodLabel}>{data.day}</Text>
                </View>
              ))}
            </View>
            <View style={styles.moodScale}>
              <Text style={styles.scaleLabel}>10</Text>
              <Text style={styles.scaleLabel}>5</Text>
              <Text style={styles.scaleLabel}>0</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Distribución de Actividades */}
        <Card style={styles.distributionCard}>
          <Card.Content>
            <Title>Distribución de Actividades</Title>
            <View style={styles.pieChart}>
              <View style={styles.pieSegment}>
                <View style={[styles.pieSlice, {
                  backgroundColor: '#6B9BD1',
                  width: `${(stats.musicaSesiones / totalActivities) * 100 || 33}%`
                }]} />
                <Text style={styles.pieLabel}>
                  Música {stats.musicaSesiones} ({((stats.musicaSesiones / totalActivities) * 100 || 33).toFixed(0)}%)
                </Text>
              </View>
              <View style={styles.pieSegment}>
                <View style={[styles.pieSlice, {
                  backgroundColor: '#4CAF50',
                  width: `${(stats.ejerciciosSesiones / totalActivities) * 100 || 33}%`
                }]} />
                <Text style={styles.pieLabel}>
                  Ejercicios {stats.ejerciciosSesiones} ({((stats.ejerciciosSesiones / totalActivities) * 100 || 33).toFixed(0)}%)
                </Text>
              </View>
              <View style={styles.pieSegment}>
                <View style={[styles.pieSlice, {
                  backgroundColor: '#FF9800',
                  width: `${(stats.cuestionariosCompletados / totalActivities) * 100 || 33}%`
                }]} />
                <Text style={styles.pieLabel}>
                  Cuestionarios {stats.cuestionariosCompletados} ({((stats.cuestionariosCompletados / totalActivities) * 100 || 33).toFixed(0)}%)
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Logros */}
        <Card style={styles.achievementsCard}>
          <Card.Content>
            <Title>Logros Desbloqueados</Title>
            <View style={styles.achievementsList}>
              <View style={[styles.achievement, totalActivities >= 1 && styles.achievementUnlocked]}>
                <Icon name="star" size={32} color={totalActivities >= 1 ? "#FFD700" : "#D0D0D0"} />
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>Primer Paso</Text>
                  <Text style={styles.achievementDesc}>Completa tu primera actividad</Text>
                </View>
                {totalActivities >= 1 && <Icon name="check-circle" size={24} color="#4CAF50" />}
              </View>

              <View style={[styles.achievement, totalActivities >= 5 && styles.achievementUnlocked]}>
                <Icon name="fire" size={32} color={totalActivities >= 5 ? "#FF6B6B" : "#D0D0D0"} />
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>En Racha</Text>
                  <Text style={styles.achievementDesc}>5 actividades completadas</Text>
                </View>
                {totalActivities >= 5 && <Icon name="check-circle" size={24} color="#4CAF50" />}
              </View>

              <View style={[styles.achievement, totalActivities >= 10 && styles.achievementUnlocked]}>
                <Icon name="trophy" size={32} color={totalActivities >= 10 ? "#FFD700" : "#D0D0D0"} />
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>Dedicado</Text>
                  <Text style={styles.achievementDesc}>10 actividades completadas</Text>
                </View>
                {totalActivities >= 10 && <Icon name="check-circle" size={24} color="#4CAF50" />}
              </View>

              <View style={[styles.achievement, totalActivities >= 21 && styles.achievementUnlocked]}>
                <Icon name="crown" size={32} color={totalActivities >= 21 ? "#FFD700" : "#D0D0D0"} />
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>Maestro del Bienestar</Text>
                  <Text style={styles.achievementDesc}>Meta semanal completada</Text>
                </View>
                {totalActivities >= 21 && <Icon name="check-circle" size={24} color="#4CAF50" />}
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Insights */}
        <Card style={styles.insightsCard}>
          <Card.Content>
            <Title>Insights Personalizados</Title>
            <View style={styles.insightsList}>
              <View style={styles.insight}>
                <Icon name="lightbulb-on" size={24} color="#FFD700" />
                <Text style={styles.insightText}>
                  {totalActivities === 0
                    ? "¡Comienza hoy! Los usuarios que completan al menos 3 actividades por semana reportan 40% más bienestar."
                    : totalActivities < 10
                    ? "¡Excelente inicio! Mantén la constancia. Los usuarios regulares ven resultados en 2 semanas."
                    : "¡Increíble progreso! Estás en el top 10% de usuarios más activos. Sigue así."}
                </Text>
              </View>
              <View style={styles.insight}>
                <Icon name="chart-line" size={24} color="#2196F3" />
                <Text style={styles.insightText}>
                  Tu mejor día es el {weeklyData.reduce((max, d) => d.music + d.exercise > max.music + max.exercise ? d : max).day}.
                  Intenta mantener esa energía toda la semana.
                </Text>
              </View>
              <View style={styles.insight}>
                <Icon name="target" size={24} color="#4CAF50" />
                <Text style={styles.insightText}>
                  Estás a {Math.max(0, 21 - totalActivities)} actividades de completar tu meta semanal. ¡Tú puedes!
                </Text>
              </View>
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
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 12,
  },
  quickStatCard: {
    flex: 1,
    elevation: 2,
  },
  quickStatContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  quickStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
  },
  quickStatLabel: {
    fontSize: 11,
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
  },
  periodCard: {
    margin: 20,
    marginTop: 12,
    elevation: 2,
  },
  chartCard: {
    margin: 20,
    marginTop: 12,
    elevation: 3,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
    marginTop: 20,
    marginBottom: 10,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: 2,
  },
  bar: {
    width: 12,
    borderRadius: 4,
    minHeight: 10,
  },
  musicBar: {
    backgroundColor: '#6B9BD1',
  },
  exerciseBar: {
    backgroundColor: '#4CAF50',
  },
  barLabel: {
    fontSize: 10,
    color: '#7F8C8D',
    marginTop: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  moodChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 150,
    marginTop: 20,
    position: 'relative',
  },
  moodPoint: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  moodLine: {
    height: 120,
    width: '100%',
    position: 'relative',
  },
  moodConnector: {
    position: 'absolute',
    right: 0,
    width: '100%',
    height: 2,
    backgroundColor: '#6B9BD1',
    top: '50%',
  },
  moodDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6B9BD1',
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  moodLabel: {
    fontSize: 10,
    color: '#7F8C8D',
    marginTop: 130,
  },
  moodScale: {
    position: 'absolute',
    left: 0,
    top: 40,
    height: 120,
    justifyContent: 'space-between',
  },
  scaleLabel: {
    fontSize: 10,
    color: '#7F8C8D',
  },
  distributionCard: {
    margin: 20,
    marginTop: 12,
    elevation: 3,
  },
  pieChart: {
    marginTop: 20,
  },
  pieSegment: {
    marginBottom: 16,
  },
  pieSlice: {
    height: 24,
    borderRadius: 4,
    marginBottom: 4,
  },
  pieLabel: {
    fontSize: 14,
    color: '#2C3E50',
  },
  achievementsCard: {
    margin: 20,
    marginTop: 12,
    elevation: 3,
    backgroundColor: '#FFF9E6',
  },
  achievementsList: {
    marginTop: 12,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,
    opacity: 0.5,
  },
  achievementUnlocked: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  insightsCard: {
    margin: 20,
    marginTop: 12,
    elevation: 3,
    backgroundColor: '#E8F4F8',
  },
  insightsList: {
    marginTop: 12,
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
});
