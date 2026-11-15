import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Avatar, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SupportChatScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();

  const responses = {
    ansiedad: [
      "Entiendo que te sientas ansioso/a. La ansiedad es una respuesta natural del cuerpo. ¿Has probado técnicas de respiración profunda?",
      "La ansiedad puede ser abrumadora. Recuerda que es temporal. ¿Qué te ayuda a calmarte normalmente?",
      "Es valiente reconocer la ansiedad. Te recomiendo el ejercicio de respiración 4-7-8 en nuestra sección de Ejercicios."
    ],
    estres: [
      "El estrés es común en estos tiempos. ¿Has identificado qué lo está causando?",
      "Tomar descansos regulares puede ayudar mucho con el estrés. ¿Cuándo fue la última vez que te tomaste un momento para ti?",
      "Te sugiero escuchar música relajante de nuestra sección de Musicoterapia. Puede reducir significativamente el estrés."
    ],
    triste: [
      "Lamento que te sientas triste. Tus sentimientos son válidos. ¿Hay algo específico que te esté afectando?",
      "La tristeza es parte de la experiencia humana. No estás solo/a. ¿Te gustaría hablar sobre ello?",
      "Está bien sentirse triste. Escribir en un diario puede ayudar a procesar estos sentimientos."
    ],
    dormir: [
      "Los problemas de sueño afectan mucho el bienestar. ¿Has probado nuestra playlist de Sueño Profundo?",
      "Una rutina de sueño consistente puede ayudar. Te recomiendo evitar pantallas 1 hora antes de dormir.",
      "La meditación antes de dormir puede ser muy efectiva. Tenemos ejercicios específicos para eso."
    ],
    ayuda: [
      "Estoy aquí para apoyarte. Puedo ayudarte con:\n• Técnicas de relajación\n• Recomendaciones de música\n• Ejercicios de TCC\n• Consejos de bienestar",
      "¿En qué puedo ayudarte hoy? Puedes preguntarme sobre ansiedad, estrés, sueño, o cualquier tema de salud mental.",
      "Estoy aquí para escucharte. ¿Qué te gustaría explorar hoy?"
    ],
    gracias: [
      "¡De nada! Estoy aquí siempre que me necesites. 💙",
      "Es un placer ayudarte. Recuerda que cuidar tu salud mental es importante. 🌟",
      "¡Para eso estoy! No dudes en volver cuando necesites apoyo. 🤗"
    ],
    default: [
      "Entiendo. ¿Podrías contarme más sobre cómo te sientes?",
      "Gracias por compartir. ¿Hay algo específico con lo que pueda ayudarte hoy?",
      "Estoy aquí para escucharte. ¿Qué más está en tu mente?"
    ]
  };

  useEffect(() => {
    // Mensaje de bienvenida
    setMessages([{
      id: 1,
      text: "¡Hola! 👋 Soy tu asistente de bienestar emocional. Estoy aquí para escucharte y apoyarte.\n\n¿Cómo te sientes hoy?",
      isBot: true,
      timestamp: new Date().toISOString()
    }]);
  }, []);

  const getResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    if (msg.includes('ansiedad') || msg.includes('ansioso') || msg.includes('nervioso')) {
      return responses.ansiedad[Math.floor(Math.random() * responses.ansiedad.length)];
    }
    if (msg.includes('estrés') || msg.includes('estres') || msg.includes('estresado')) {
      return responses.estres[Math.floor(Math.random() * responses.estres.length)];
    }
    if (msg.includes('triste') || msg.includes('tristeza') || msg.includes('deprimido')) {
      return responses.triste[Math.floor(Math.random() * responses.triste.length)];
    }
    if (msg.includes('dormir') || msg.includes('sueño') || msg.includes('insomnio')) {
      return responses.dormir[Math.floor(Math.random() * responses.dormir.length)];
    }
    if (msg.includes('ayuda') || msg.includes('ayudar') || msg.includes('qué puedes')) {
      return responses.ayuda[Math.floor(Math.random() * responses.ayuda.length)];
    }
    if (msg.includes('gracias') || msg.includes('thank')) {
      return responses.gracias[Math.floor(Math.random() * responses.gracias.length)];
    }

    return responses.default[Math.floor(Math.random() * responses.default.length)];
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simular "escribiendo..."
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getResponse(inputText),
        isBot: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const quickReplies = [
    { text: 'Me siento ansioso', icon: 'emoticon-sad' },
    { text: 'Estoy estresado', icon: 'head-flash' },
    { text: 'No puedo dormir', icon: 'sleep-off' },
    { text: 'Necesito ayuda', icon: 'hand-heart' },
  ];

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Avatar.Icon size={40} icon="robot" style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Title style={styles.headerTitle}>Asistente de Bienestar</Title>
          <Text style={styles.headerSubtitle}>Siempre aquí para ti</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              message.isBot ? styles.botMessageWrapper : styles.userMessageWrapper
            ]}
          >
            {message.isBot && (
              <Avatar.Icon size={32} icon="robot" style={styles.messageAvatar} />
            )}
            <View
              style={[
                styles.messageBubble,
                message.isBot ? styles.botMessage : styles.userMessage
              ]}
            >
              <Text style={[
                styles.messageText,
                message.isBot ? styles.botMessageText : styles.userMessageText
              ]}>
                {message.text}
              </Text>
            </View>
          </View>
        ))}

        {messages.length <= 1 && (
          <View style={styles.quickRepliesContainer}>
            <Text style={styles.quickRepliesTitle}>Respuestas rápidas:</Text>
            <View style={styles.quickRepliesGrid}>
              {quickReplies.map((reply, index) => (
                <Card
                  key={index}
                  style={styles.quickReplyCard}
                  onPress={() => {
                    setInputText(reply.text);
                    setTimeout(() => sendMessage(), 100);
                  }}
                >
                  <Card.Content style={styles.quickReplyContent}>
                    <Icon name={reply.icon} size={24} color="#6B9BD1" />
                    <Text style={styles.quickReplyText}>{reply.text}</Text>
                  </Card.Content>
                </Card>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu mensaje..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <IconButton
          icon="send"
          size={24}
          iconColor="#6B9BD1"
          onPress={sendMessage}
          disabled={!inputText.trim()}
        />
      </View>

      <Card style={styles.disclaimerCard}>
        <Card.Content>
          <Text style={styles.disclaimer}>
            💡 Este es un asistente de apoyo emocional. Para emergencias o crisis, contacta a un profesional de salud mental o llama a una línea de crisis.
          </Text>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    gap: 12,
  },
  avatar: {
    backgroundColor: '#6B9BD1',
  },
  headerTitle: {
    fontSize: 18,
    margin: 0,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginVertical: 4,
    gap: 8,
  },
  botMessageWrapper: {
    justifyContent: 'flex-start',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    backgroundColor: '#6B9BD1',
    width: 32,
    height: 32,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  botMessage: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  userMessage: {
    backgroundColor: '#6B9BD1',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  botMessageText: {
    color: '#2C3E50',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  quickRepliesContainer: {
    marginTop: 16,
  },
  quickRepliesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 12,
  },
  quickRepliesGrid: {
    gap: 8,
  },
  quickReplyCard: {
    elevation: 2,
    marginBottom: 8,
  },
  quickReplyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  quickReplyText: {
    fontSize: 14,
    color: '#2C3E50',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F9FC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    maxHeight: 100,
  },
  disclaimerCard: {
    margin: 12,
    marginTop: 0,
    backgroundColor: '#FFF9E6',
    elevation: 0,
  },
  disclaimer: {
    fontSize: 11,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 16,
  },
});
