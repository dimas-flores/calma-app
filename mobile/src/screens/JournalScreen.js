import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Chip, FAB, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function JournalScreen({ navigation }) {
  const [entries, setEntries] = useState([]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const saved = localStorage.getItem('journalEntries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  };

  const saveEntry = () => {
    if (!newEntry.trim() || !selectedMood) {
      alert('Por favor escribe algo y selecciona tu estado de ánimo');
      return;
    }

    const entry = {
      id: Date.now(),
      text: newEntry,
      mood: selectedMood,
      date: new Date().toISOString(),
    };

    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem('journalEntries', JSON.stringify(updated));

    setNewEntry('');
    setSelectedMood('');
    setShowNewEntry(false);

    alert('✅ Entrada guardada!\n\nTus pensamientos están a salvo. Escribir ayuda a procesar emociones. 💙');
  };

  const moods = [
    { value: 'feliz', emoji: '😊', label: 'Feliz', color: '#FFD700' },
    { value: 'tranquilo', emoji: '😌', label: 'Tranquilo', color: '#87CEEB' },
    { value: 'ansioso', emoji: '😰', label: 'Ansioso', color: '#FFA500' },
    { value: 'triste', emoji: '😢', label: 'Triste', color: '#4682B4' },
    { value: 'enojado', emoji: '😠', label: 'Enojado', color: '#DC143C' },
    { value: 'agradecido', emoji: '🙏', label: 'Agradecido', color: '#32CD32' },
  ];

  const getMoodData = (mood) => moods.find(m => m.value === mood) || moods[0];

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Diario Emocional</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView>
        <View style={styles.header}>
          <Icon name="book-open-variant" size={48} color="#6B9BD1" />
          <Title style={styles.title}>Tus Pensamientos</Title>
          <Paragraph style={styles.subtitle}>
            Escribe libremente, sin juicios
          </Paragraph>
        </View>

        {showNewEntry && (
          <Card style={styles.newEntryCard}>
            <Card.Content>
              <Title>Nueva Entrada</Title>

              <Text style={styles.label}>¿Cómo te sientes?</Text>
              <View style={styles.moodSelector}>
                {moods.map((mood) => (
                  <Chip
                    key={mood.value}
                    selected={selectedMood === mood.value}
                    onPress={() => setSelectedMood(mood.value)}
                    style={[
                      styles.moodChip,
                      selectedMood === mood.value && { backgroundColor: mood.color }
                    ]}
                  >
                    {mood.emoji} {mood.label}
                  </Chip>
                ))}
              </View>

              <Text style={styles.label}>¿Qué está en tu mente?</Text>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={6}
                placeholder="Escribe libremente... No hay juicios aquí."
                value={newEntry}
                onChangeText={setNewEntry}
              />

              <View style={styles.buttonRow}>
                <Button mode="outlined" onPress={() => setShowNewEntry(false)}>
                  Cancelar
                </Button>
                <Button mode="contained" onPress={saveEntry}>
                  Guardar
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        {entries.length === 0 && !showNewEntry ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="notebook-outline" size={64} color="#B0C4DE" />
              <Title style={styles.emptyTitle}>Tu diario está vacío</Title>
              <Paragraph style={styles.emptyText}>
                Comienza a escribir tus pensamientos y emociones.
                La escritura terapéutica ayuda a:
              </Paragraph>
              <View style={styles.benefitsList}>
                <Text style={styles.benefit}>✓ Procesar emociones</Text>
                <Text style={styles.benefit}>✓ Reducir el estrés</Text>
                <Text style={styles.benefit}>✓ Ganar claridad mental</Text>
                <Text style={styles.benefit}>✓ Identificar patrones</Text>
              </View>
            </Card.Content>
          </Card>
        ) : (
          entries.map((entry) => {
            const mood = getMoodData(entry.mood);
            const date = new Date(entry.date);
            return (
              <Card key={entry.id} style={styles.entryCard}>
                <Card.Content>
                  <View style={styles.entryHeader}>
                    <Chip icon={() => <Text style={styles.moodEmoji}>{mood.emoji}</Text>} style={{ backgroundColor: mood.color }}>
                      {mood.label}
                    </Chip>
                    <Text style={styles.entryDate}>
                      {date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                  </View>
                  <Paragraph style={styles.entryText}>{entry.text}</Paragraph>
                </Card.Content>
              </Card>
            );
          })
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        label="Nueva Entrada"
        onPress={() => setShowNewEntry(true)}
      />
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
  newEntryCard: {
    margin: 20,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#2C3E50',
  },
  moodSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  moodChip: {
    marginBottom: 8,
  },
  moodEmoji: {
    fontSize: 18,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF',
    minHeight: 120,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  emptyCard: {
    margin: 20,
    elevation: 2,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 8,
    color: '#7F8C8D',
  },
  benefitsList: {
    marginTop: 16,
    alignSelf: 'stretch',
  },
  benefit: {
    fontSize: 14,
    color: '#2C3E50',
    marginVertical: 4,
    paddingLeft: 20,
  },
  entryCard: {
    margin: 20,
    marginBottom: 12,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  entryText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#2C3E50',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6B9BD1',
  },
});
