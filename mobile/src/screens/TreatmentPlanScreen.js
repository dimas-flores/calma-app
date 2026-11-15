import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Text, IconButton, Chip, Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TreatmentPlanScreen({ navigation }) {
  const [plan, setPlan] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = () => {
    const saved = localStorage.getItem('treatmentPlan');
    if (saved) {
      setPlan(JSON.parse(saved));
    }

    const completed = localStorage.getItem('completedTasks');
    if (completed) {
      setCompletedTasks(JSON.parse(completed));
    }
  };

  const generatePlan = () => {
    // Obtener estadísticas del usuario
    const musicaSesiones = parseInt(localStorage.getItem('musicaSesiones') || '0');
    const ejerciciosSesiones = parseInt(localStorage.getItem('ejerciciosSesiones') || '0');
    const cuestionariosCompletados = parseInt(localStorage.getItem('cuestionariosCompletados') || '0');

    const totalActividades = musicaSesiones + ejerciciosSesiones;

    // Generar plan personalizado
    const newPlan = {
      createdDate: new Date().toISOString(),
      level: totalActividades < 5 ? 'principiante' : totalActividades < 15 ? 'intermedio' : 'avanzado',
      mainGoal: 'Mejorar bienestar emocional general',
      duration: '4 semanas',
      tasks: [
        {
          id: 1,
          week: 1,
          category: 'Evaluación',
          title: 'Completa el cuestionario de estado emocional',
          description: 'Evalúa tu estado actual para personalizar tu tratamiento',
          frequency: '1 vez',
          points: 20,
          icon: 'clipboard-check',
          color: '#2196F3'
        },
        {
          id: 2,
          week: 1,
          category: 'Respiración',
          title: 'Practica respiración 4-7-8',
          description: 'Reduce ansiedad con esta técnica comprobada',
          frequency: '2 veces al día',
          points: 10,
          icon: 'lungs',
          color: '#4CAF50'
        },
        {
          id: 3,
          week: 1,
          category: 'Diario',
          title: 'Escribe en tu diario emocional',
          description: 'Registra tus emociones y pensamientos diarios',
          frequency: 'Diario',
          points: 15,
          icon: 'notebook',
          color: '#FF9800'
        },
        {
          id: 4,
          week: 1,
          category: 'Música',
          title: 'Escucha playlist de relajación',
          description: 'Dedica 20 minutos a música terapéutica',
          frequency: '3 veces por semana',
          points: 10,
          icon: 'music',
          color: '#9C27B0'
        },
        {
          id: 5,
          week: 2,
          category: 'Meditación',
          title: 'Meditación guiada de 10 minutos',
          description: 'Desarrolla el hábito de mindfulness',
          frequency: 'Diario',
          points: 20,
          icon: 'meditation',
          color: '#673AB7'
        },
        {
          id: 6,
          week: 2,
          category: 'TCC',
          title: 'Ejercicio de reestructuración cognitiva',
          description: 'Identifica y cuestiona pensamientos negativos',
          frequency: '2 veces por semana',
          points: 25,
          icon: 'brain',
          color: '#E91E63'
        },
        {
          id: 7,
          week: 2,
          category: 'Gratitud',
          title: 'Lista 3 cosas por las que estás agradecido',
          description: 'Cultiva una mentalidad positiva',
          frequency: 'Diario',
          points: 10,
          icon: 'heart',
          color: '#FF6B6B'
        },
        {
          id: 8,
          week: 3,
          category: 'Sesión Terapéutica',
          title: 'Completa sesión de manejo de ansiedad',
          description: 'Sesión guiada paso a paso',
          frequency: '1 vez',
          points: 30,
          icon: 'account-heart',
          color: '#00BCD4'
        },
        {
          id: 9,
          week: 3,
          category: 'Comunidad',
          title: 'Comparte tu experiencia en la comunidad',
          description: 'Conecta con otros y apoya',
          frequency: '1 vez por semana',
          points: 15,
          icon: 'account-group',
          color: '#4CAF50'
        },
        {
          id: 10,
          week: 3,
          category: 'Reto',
          title: 'Acepta y completa un reto',
          description: 'Desafíate a ti mismo',
          frequency: '1 vez',
          points: 50,
          icon: 'trophy',
          color: '#FFD700'
        },
        {
          id: 11,
          week: 4,
          category: 'Evaluación Final',
          title: 'Completa cuestionario de progreso',
          description: 'Mide tu mejora',
          frequency: '1 vez',
          points: 20,
          icon: 'chart-line',
          color: '#2196F3'
        },
        {
          id: 12,
          week: 4,
          category: 'Reflexión',
          title: 'Revisa tu diario del mes',
          description: 'Identifica patrones y crecimiento',
          frequency: '1 vez',
          points: 25,
          icon: 'book-open',
          color: '#9C27B0'
        },
      ]
    };

    setPlan(newPlan);
    localStorage.setItem('treatmentPlan', JSON.stringify(newPlan));

    alert('✅ Plan de Tratamiento Generado!\n\nTu plan personalizado de 4 semanas está listo.\n\nSigue las tareas semana a semana para mejorar tu bienestar emocional.\n\n💙 ¡Tú puedes!');
  };

  const toggleTask = (taskId) => {
    let updated;
    if (completedTasks.includes(taskId)) {
      updated = completedTasks.filter(id => id !== taskId);
    } else {
      updated = [...completedTasks, taskId];
      const task = plan.tasks.find(t => t.id === taskId);
      alert(`✅ ¡Tarea Completada!\n\n"${task.title}"\n\n🏆 +${task.points} puntos\n\n¡Excelente trabajo!`);
    }
    setCompletedTasks(updated);
    localStorage.setItem('completedTasks', JSON.stringify(updated));
  };

  const totalPoints = plan ? plan.tasks.reduce((sum, task) => {
    return completedTasks.includes(task.id) ? sum + task.points : sum;
  }, 0) : 0;

  const totalPossiblePoints = plan ? plan.tasks.reduce((sum, task) => sum + task.points, 0) : 0;
  const progress = totalPossiblePoints > 0 ? (totalPoints / totalPossiblePoints) * 100 : 0;

  if (!plan) {
    return (
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Plan de Tratamiento</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.emptyContainer}>
          <Icon name="clipboard-text" size={80} color="#B0C4DE" />
          <Title style={styles.emptyTitle}>No tienes un Plan de Tratamiento</Title>
          <Paragraph style={styles.emptyText}>
            Un plan de tratamiento es como tener un psicólogo que te guía paso a paso hacia tu bienestar emocional.
          </Paragraph>

          <Card style={styles.benefitsCard}>
            <Card.Content>
              <Title>¿Qué incluye tu plan?</Title>
              <View style={styles.benefitsList}>
                <Text style={styles.benefit}>✓ Plan personalizado de 4 semanas</Text>
                <Text style={styles.benefit}>✓ 12 tareas terapéuticas estructuradas</Text>
                <Text style={styles.benefit}>✓ Seguimiento de progreso</Text>
                <Text style={styles.benefit}>✓ Sistema de puntos y recompensas</Text>
                <Text style={styles.benefit}>✓ Basado en técnicas profesionales</Text>
              </View>
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            icon="plus"
            onPress={generatePlan}
            style={styles.generateButton}
          >
            Generar Mi Plan Personalizado
          </Button>
        </ScrollView>
      </View>
    );
  }

  const tasksByWeek = plan.tasks.reduce((acc, task) => {
    if (!acc[task.week]) acc[task.week] = [];
    acc[task.week].push(task);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Plan de Tratamiento</Text>
        <IconButton
          icon="refresh"
          size={24}
          onPress={() => {
            if (confirm('¿Generar nuevo plan? Se perderá el progreso actual.')) {
              setCompletedTasks([]);
              localStorage.removeItem('completedTasks');
              generatePlan();
            }
          }}
        />
      </View>

      <ScrollView>
        <View style={styles.header}>
          <Icon name="clipboard-check" size={48} color="#6B9BD1" />
          <Title style={styles.title}>Tu Plan Personalizado</Title>
          <Paragraph style={styles.subtitle}>
            {plan.duration} • Nivel {plan.level}
          </Paragraph>
        </View>

        {/* Progreso General */}
        <Card style={styles.progressCard}>
          <Card.Content>
            <View style={styles.progressHeader}>
              <Icon name="trophy" size={32} color="#FFD700" />
              <View style={styles.progressInfo}>
                <Text style={styles.progressPoints}>{totalPoints} / {totalPossiblePoints} pts</Text>
                <Text style={styles.progressLabel}>Puntos ganados</Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressPercentage}>{Math.round(progress)}% completado</Text>
            <Text style={styles.tasksCompleted}>
              {completedTasks.length} de {plan.tasks.length} tareas completadas
            </Text>
          </Card.Content>
        </Card>

        {/* Objetivo Principal */}
        <Card style={styles.goalCard}>
          <Card.Content>
            <View style={styles.goalHeader}>
              <Icon name="target" size={24} color="#6B9BD1" />
              <Title style={styles.goalTitle}>Objetivo Principal</Title>
            </View>
            <Paragraph style={styles.goalText}>{plan.mainGoal}</Paragraph>
          </Card.Content>
        </Card>

        {/* Tareas por Semana */}
        {Object.keys(tasksByWeek).sort().map((week) => (
          <View key={week}>
            <Text style={styles.weekTitle}>📅 Semana {week}</Text>
            {tasksByWeek[week].map((task) => {
              const isCompleted = completedTasks.includes(task.id);
              return (
                <Card key={task.id} style={[styles.taskCard, isCompleted && styles.completedTaskCard]}>
                  <Card.Content>
                    <View style={styles.taskHeader}>
                      <Checkbox
                        status={isCompleted ? 'checked' : 'unchecked'}
                        onPress={() => toggleTask(task.id)}
                      />
                      <Icon name={task.icon} size={32} color={task.color} />
                      <View style={styles.taskInfo}>
                        <Title style={[styles.taskTitle, isCompleted && styles.completedText]}>
                          {task.title}
                        </Title>
                        <Chip style={[styles.categoryChip, { backgroundColor: task.color }]} textStyle={{ color: '#FFFFFF', fontSize: 11 }}>
                          {task.category}
                        </Chip>
                      </View>
                    </View>

                    <Paragraph style={styles.taskDesc}>{task.description}</Paragraph>

                    <View style={styles.taskMeta}>
                      <Text style={styles.metaText}>🔄 {task.frequency}</Text>
                      <Text style={styles.metaText}>🏆 {task.points} puntos</Text>
                    </View>
                  </Card.Content>
                </Card>
              );
            })}
          </View>
        ))}

        {/* Consejos */}
        <Card style={styles.tipsCard}>
          <Card.Content>
            <Title>💡 Consejos para tu Plan</Title>
            <View style={styles.tipsList}>
              <Text style={styles.tip}>• Completa las tareas en orden</Text>
              <Text style={styles.tip}>• Sé constante, no perfecto</Text>
              <Text style={styles.tip}>• Celebra cada pequeño logro</Text>
              <Text style={styles.tip}>• Ajusta según tus necesidades</Text>
              <Text style={styles.tip}>• Pide ayuda si la necesitas</Text>
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
    textTransform: 'capitalize',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 22,
    marginTop: 20,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#7F8C8D',
    marginTop: 12,
    fontSize: 15,
  },
  benefitsCard: {
    marginTop: 20,
    width: '100%',
    elevation: 2,
  },
  benefitsList: {
    marginTop: 12,
  },
  benefit: {
    fontSize: 14,
    color: '#2C3E50',
    marginVertical: 4,
  },
  generateButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
  progressCard: {
    margin: 20,
    marginTop: 12,
    elevation: 3,
    backgroundColor: '#FFF9E6',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  progressInfo: {
    flex: 1,
  },
  progressPoints: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  progressLabel: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6B9BD1',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B9BD1',
    textAlign: 'center',
    marginBottom: 4,
  },
  tasksCompleted: {
    fontSize: 13,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  goalCard: {
    margin: 20,
    marginTop: 12,
    elevation: 2,
    backgroundColor: '#E8F4F8',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 18,
    margin: 0,
  },
  goalText: {
    fontSize: 15,
    color: '#2C3E50',
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 16,
    marginBottom: 12,
    color: '#2C3E50',
  },
  taskCard: {
    margin: 20,
    marginTop: 12,
    elevation: 2,
  },
  completedTaskCard: {
    backgroundColor: '#E8F5E9',
    opacity: 0.8,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    margin: 0,
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#7F8C8D',
  },
  categoryChip: {
    alignSelf: 'flex-start',
  },
  taskDesc: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 12,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  tipsCard: {
    margin: 20,
    marginTop: 12,
    elevation: 2,
    backgroundColor: '#E8F4F8',
  },
  tipsList: {
    marginTop: 12,
  },
  tip: {
    fontSize: 14,
    color: '#2C3E50',
    marginVertical: 4,
  },
});
