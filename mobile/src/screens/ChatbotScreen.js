import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '../services/api';

const ChatbotScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    loadConversationHistory();
  }, []);

  const loadConversationHistory = async () => {
    try {
      const response = await api.get(`/chatbot/history/${user.id}?limit=20`);
      if (response.data.success) {
        const formattedMessages = [];
        response.data.data.forEach(conv => {
          formattedMessages.push(
            { id: `${conv.id}-user`, text: conv.user_message, isUser: true, timestamp: conv.created_at },
            { id: `${conv.id}-ai`, text: conv.ai_response, isUser: false, timestamp: conv.created_at }
          );
        });
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error cargando historial:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await api.post('/chatbot/message', {
        message: userMessage.text,
        userId: user.id
      });

      if (response.data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          text: response.data.data.response,
          isUser: false,
          timestamp: response.data.data.timestamp,
          sentiment: response.data.data.sentiment,
          crisis: response.data.data.crisis,
          recommendations: response.data.data.recommendations
        };

        setMessages(prev => [...prev, aiMessage]);

        // Si hay crisis, mostrar alerta
        if (response.data.data.crisis.isCrisis) {
          showCrisisAlert(response.data.data.crisis);
        }
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      Alert.alert('Error', 'No se pudo enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const showCrisisAlert = (crisisData) => {
    Alert.alert(
      '🚨 Apoyo Inmediato',
      'Detectamos que estás pasando por un momento muy difícil. No estás solo.\n\n' +
      'Por favor, contacta:\n' +
      '• Línea de Crisis: 113\n' +
      '• WhatsApp: +51 999 999 999\n' +
      '• O acude a emergencias\n\n' +
      'Estamos aquí para apoyarte.',
      [
        { text: 'Entendido', style: 'default' },
        { text: 'Recursos de Crisis', onPress: () => showCrisisResources() }
      ]
    );
  };

  const showCrisisResources = async () => {
    try {
      const response = await api.get('/chatbot/crisis-resources');
      if (response.data.success) {
        const resources = response.data.data.resources;
        Alert.alert(
          'Recursos de Crisis',
          `Perú: ${resources.peru.line} - ${resources.peru.phone}\n` +
          `México: ${resources.mexico.line} - ${resources.mexico.phone}\n` +
          `USA: ${resources.usa.line} - ${resources.usa.phone}\n` +
          `España: ${resources.españa.line} - ${resources.españa.phone}`,
          [{ text: 'Entendido' }]
        );
      }
    } catch (error) {
      console.error('Error obteniendo recursos:', error);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.isUser;

    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}>
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
            {item.text}
          </Text>

          {!isUser && item.sentiment && (
            <View style={styles.sentimentIndicator}>
              <Text style={styles.sentimentText}>
                {getSentimentEmoji(item.sentiment.emotion)}
              </Text>
            </View>
          )}
        </View>

        {item.recommendations && item.recommendations.length > 0 && (
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationsTitle}>💡 Recomendaciones:</Text>
            {item.recommendations.map((rec, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recommendationItem}
                onPress={() => handleRecommendation(rec)}
              >
                <Text style={styles.recommendationText}>{rec.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const getSentimentEmoji = (emotion) => {
    const emojiMap = {
      'muy_positivo': '😊',
      'positivo': '🙂',
      'neutral': '😐',
      'negativo': '😔',
      'muy_negativo': '😢'
    };
    return emojiMap[emotion] || '😐';
  };

  const handleRecommendation = (recommendation) => {
    Alert.alert(
      recommendation.title,
      recommendation.description,
      [{ text: 'Entendido' }]
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={[styles.messageContainer, styles.aiMessage]}>
        <View style={[styles.messageBubble, styles.aiBubble]}>
          <View style={styles.typingContainer}>
            <ActivityIndicator size="small" color="#6B9BD1" />
            <Text style={styles.typingText}>Asistente escribiendo...</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Asistente IA</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => Alert.alert('Menú', 'Opciones del chatbot')}
        >
          <Icon name="more-vert" size={24} color="#2C3E50" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={[...messages, ...(isTyping ? [renderTypingIndicator()] : [])]}
          renderItem={renderMessage}
          keyExtractor={(item, index) => item.id || `typing-${index}`}
          style={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escribe tu mensaje aquí..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Icon name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  menuButton: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageContainer: {
    marginVertical: 4,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#6B9BD1',
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#2C3E50',
  },
  sentimentIndicator: {
    marginTop: 8,
    alignItems: 'center',
  },
  sentimentText: {
    fontSize: 20,
  },
  recommendationsContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#E8F4FD',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6B9BD1',
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  recommendationItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#D1E7DD',
  },
  recommendationText: {
    fontSize: 14,
    color: '#2C3E50',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B9BD1',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
    color: '#2C3E50',
  },
  sendButton: {
    backgroundColor: '#6B9BD1',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default ChatbotScreen;
