import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Card, Title, Paragraph, Button, Text, IconButton, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function EmergencyScreen({ navigation }) {
  const [selectedCountry, setSelectedCountry] = useState('peru');

  const emergencyContacts = {
    mexico: [
      { name: 'Línea de la Vida', phone: '800-911-2000', description: 'Atención psicológica 24/7', icon: 'phone' },
      { name: 'SAPTEL', phone: '55-5259-8121', description: 'Sistema Nacional de Apoyo', icon: 'headset' },
      { name: 'Emergencias', phone: '911', description: 'Emergencias generales', icon: 'alert' },
      { name: 'Cruz Roja', phone: '065', description: 'Atención médica de emergencia', icon: 'medical-bag' },
    ],
    peru: [
      { name: 'Línea de la Vida', phone: '800-911-2000', description: 'Atención psicológica 24/7', icon: 'phone' },
      { name: 'SAPTEL', phone: '55-5259-8121', description: 'Sistema Nacional de Apoyo', icon: 'headset' },
      { name: 'Emergencias', phone: '911', description: 'Emergencias generales', icon: 'alert' },
      { name: 'Bomberos', phone: '116', description: 'Bomberos del Perú', icon: 'fire-truck' },
    ],
    usa: [
      { name: 'National Suicide Prevention', phone: '988', description: '24/7 Crisis support', icon: 'phone' },
      { name: 'Crisis Text Line', phone: '741741', description: 'Text HOME for help', icon: 'message' },
      { name: 'SAMHSA Helpline', phone: '1-800-662-4357', description: 'Mental health services', icon: 'headset' },
      { name: 'Emergency', phone: '911', description: 'General emergencies', icon: 'alert' },
    ],
    spain: [
      { name: 'Teléfono de la Esperanza', phone: '717-003-717', description: 'Atención 24 horas', icon: 'phone' },
      { name: 'Emergencias', phone: '112', description: 'Emergencias generales', icon: 'alert' },
      { name: 'Salud Responde', phone: '902-505-060', description: 'Atención sanitaria', icon: 'medical-bag' },
    ],
  };

  const breathingExercises = [
    {
      title: 'Respiración 4-7-8',
      steps: ['Inhala por 4 segundos', 'Mantén por 7 segundos', 'Exhala por 8 segundos', 'Repite 4 veces'],
      icon: 'lungs',
      color: '#4CAF50'
    },
    {
      title: 'Respiración Cuadrada',
      steps: ['Inhala por 4 segundos', 'Mantén por 4 segundos', 'Exhala por 4 segundos', 'Mantén por 4 segundos'],
      icon: 'square',
      color: '#2196F3'
    },
    {
      title: 'Respiración 5-5',
      steps: ['Inhala profundamente por 5 segundos', 'Exhala lentamente por 5 segundos', 'Repite 10 veces'],
      icon: 'heart-pulse',
      color: '#FF6B6B'
    },
  ];

  const groundingTechniques = [
    {
      title: 'Técnica 5-4-3-2-1',
      description: 'Identifica: 5 cosas que VES, 4 que TOCAS, 3 que ESCUCHAS, 2 que HUELES, 1 que SABOREAS',
      icon: 'eye',
      color: '#9C27B0'
    },
    {
      title: 'Ancla al Presente',
      description: 'Siente tus pies en el suelo. Presiona firmemente. Di en voz alta: "Estoy aquí, estoy a salvo"',
      icon: 'anchor',
      color: '#FF9800'
    },
    {
      title: 'Agua Fría',
      description: 'Lava tu cara con agua fría o sostén un cubo de hielo. Esto activa tu sistema nervioso parasimpático',
      icon: 'water',
      color: '#00BCD4'
    },
  ];

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/5215512345678?text=Necesito%20ayuda');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Ayuda de Emergencia</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView>
        <View style={styles.alertHeader}>
          <Icon name="alert-circle" size={64} color="#FF6B6B" />
          <Title style={styles.alertTitle}>¿Necesitas Ayuda Inmediata?</Title>
          <Paragraph style={styles.alertText}>
            No estás solo. Hay personas capacitadas listas para ayudarte ahora mismo.
          </Paragraph>
        </View>

        {/* Selector de País */}
        <Card style={styles.countryCard}>
          <Card.Content>
            <Title>Selecciona tu ubicación</Title>
            <View style={styles.countryButtons}>
              <Chip
                selected={selectedCountry === 'peru'}
                onPress={() => setSelectedCountry('peru')}
                style={styles.countryChip}
              >
                🇵🇪 Perú
              </Chip>
              <Chip
                selected={selectedCountry === 'mexico'}
                onPress={() => setSelectedCountry('mexico')}
                style={styles.countryChip}
              >
                🇲🇽 México
              </Chip>
              <Chip
                selected={selectedCountry === 'usa'}
                onPress={() => setSelectedCountry('usa')}
                style={styles.countryChip}
              >
                🇺🇸 USA
              </Chip>
              <Chip
                selected={selectedCountry === 'spain'}
                onPress={() => setSelectedCountry('spain')}
                style={styles.countryChip}
              >
                🇪🇸 España
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* Líneas de Crisis */}
        <Text style={styles.sectionTitle}>📞 Líneas de Crisis</Text>
        {emergencyContacts[selectedCountry].map((contact, index) => (
          <Card key={index} style={styles.contactCard}>
            <Card.Content>
              <View style={styles.contactHeader}>
                <Icon name={contact.icon} size={32} color="#6B9BD1" />
                <View style={styles.contactInfo}>
                  <Title style={styles.contactName}>{contact.name}</Title>
                  <Paragraph style={styles.contactDesc}>{contact.description}</Paragraph>
                </View>
              </View>
              <Button
                mode="contained"
                icon="phone"
                onPress={() => handleCall(contact.phone)}
                style={styles.callButton}
              >
                Llamar: {contact.phone}
              </Button>
            </Card.Content>
          </Card>
        ))}

        {/* WhatsApp de Apoyo */}
        <Card style={styles.whatsappCard}>
          <Card.Content>
            <View style={styles.whatsappHeader}>
              <Icon name="whatsapp" size={40} color="#25D366" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Title>Chat de Apoyo por WhatsApp</Title>
                <Paragraph>Habla con un voluntario capacitado</Paragraph>
              </View>
            </View>
            <Button
              mode="contained"
              icon="whatsapp"
              onPress={handleWhatsApp}
              style={[styles.callButton, { backgroundColor: '#25D366' }]}
            >
              Abrir WhatsApp
            </Button>
          </Card.Content>
        </Card>

        {/* Ejercicios de Respiración */}
        <Text style={styles.sectionTitle}>🫁 Ejercicios de Respiración Rápidos</Text>
        {breathingExercises.map((exercise, index) => (
          <Card key={index} style={styles.exerciseCard}>
            <Card.Content>
              <View style={styles.exerciseHeader}>
                <Icon name={exercise.icon} size={32} color={exercise.color} />
                <Title style={styles.exerciseTitle}>{exercise.title}</Title>
              </View>
              {exercise.steps.map((step, i) => (
                <Text key={i} style={styles.exerciseStep}>
                  {i + 1}. {step}
                </Text>
              ))}
              <Button
                mode="outlined"
                icon="play"
                onPress={() => {
                  alert(`🫁 ${exercise.title}\n\n${exercise.steps.join('\n\n')}\n\n✨ Repite este ejercicio hasta que te sientas más calmado.`);
                  const current = parseInt(localStorage.getItem('ejerciciosSesiones') || '0');
                  localStorage.setItem('ejerciciosSesiones', (current + 1).toString());
                }}
                style={styles.startButton}
              >
                Comenzar Ahora
              </Button>
            </Card.Content>
          </Card>
        ))}

        {/* Técnicas de Grounding */}
        <Text style={styles.sectionTitle}>⚓ Técnicas de Anclaje (Grounding)</Text>
        {groundingTechniques.map((technique, index) => (
          <Card key={index} style={styles.groundingCard}>
            <Card.Content>
              <View style={styles.groundingHeader}>
                <Icon name={technique.icon} size={32} color={technique.color} />
                <Title style={styles.groundingTitle}>{technique.title}</Title>
              </View>
              <Paragraph style={styles.groundingDesc}>{technique.description}</Paragraph>
              <Button
                mode="outlined"
                icon="check"
                onPress={() => alert(`✅ ${technique.title}\n\n${technique.description}\n\n💡 Tómate tu tiempo. Respira profundo.`)}
                style={styles.startButton}
              >
                Practicar
              </Button>
            </Card.Content>
          </Card>
        ))}

        {/* Recursos Adicionales */}
        <Card style={styles.resourcesCard}>
          <Card.Content>
            <Title>📚 Recursos Adicionales</Title>
            <View style={styles.resourcesList}>
              <Button
                mode="text"
                icon="web"
                onPress={() => Linking.openURL('https://www.who.int/es/news-room/fact-sheets/detail/mental-health-strengthening-our-response')}
              >
                OMS - Salud Mental
              </Button>
              <Button
                mode="text"
                icon="web"
                onPress={() => Linking.openURL('https://www.nimh.nih.gov/health/topics/suicide-prevention')}
              >
                NIMH - Prevención
              </Button>
              <Button
                mode="text"
                icon="web"
                onPress={() => Linking.openURL('https://www.crisistextline.org/')}
              >
                Crisis Text Line
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Mensaje de Esperanza */}
        <Card style={styles.hopeCard}>
          <Card.Content>
            <Icon name="heart" size={48} color="#FF6B6B" style={{ alignSelf: 'center' }} />
            <Title style={styles.hopeTitle}>Recuerda</Title>
            <Paragraph style={styles.hopeText}>
              • Esta crisis es temporal{'\n'}
              • Tus sentimientos son válidos{'\n'}
              • Pedir ayuda es un acto de valentía{'\n'}
              • No estás solo en esto{'\n'}
              • Hay personas que se preocupan por ti{'\n'}
              • Mañana puede ser diferente{'\n'}
              • Tu vida tiene valor
            </Paragraph>
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
  alertHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF5F5',
  },
  alertTitle: {
    fontSize: 24,
    marginTop: 12,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  alertText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 16,
    color: '#2C3E50',
  },
  countryCard: {
    margin: 20,
    marginTop: 12,
    elevation: 2,
  },
  countryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  countryChip: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 16,
    marginBottom: 12,
    color: '#2C3E50',
  },
  contactCard: {
    margin: 20,
    marginTop: 12,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 18,
    margin: 0,
  },
  contactDesc: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  callButton: {
    marginTop: 8,
  },
  whatsappCard: {
    margin: 20,
    marginTop: 12,
    elevation: 3,
    backgroundColor: '#E8F5E9',
  },
  whatsappHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseCard: {
    margin: 20,
    marginTop: 12,
    elevation: 2,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  exerciseTitle: {
    fontSize: 18,
    margin: 0,
  },
  exerciseStep: {
    fontSize: 14,
    color: '#2C3E50',
    marginVertical: 4,
    paddingLeft: 8,
  },
  startButton: {
    marginTop: 12,
  },
  groundingCard: {
    margin: 20,
    marginTop: 12,
    elevation: 2,
  },
  groundingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  groundingTitle: {
    fontSize: 18,
    margin: 0,
  },
  groundingDesc: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  resourcesCard: {
    margin: 20,
    marginTop: 12,
    elevation: 2,
  },
  resourcesList: {
    marginTop: 8,
  },
  hopeCard: {
    margin: 20,
    marginTop: 12,
    elevation: 3,
    backgroundColor: '#FFF9E6',
  },
  hopeTitle: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 22,
  },
  hopeText: {
    fontSize: 15,
    color: '#2C3E50',
    lineHeight: 24,
    marginTop: 12,
  },
});
