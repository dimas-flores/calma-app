import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Avatar, Chip, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CommunityScreen({ navigation }) {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'María González',
      avatar: 'account-circle',
      time: 'Hace 2 horas',
      content: 'Hoy completé mi primera semana de meditación diaria. Me siento mucho más tranquila y enfocada. ¡Gracias por esta app! 🧘‍♀️',
      likes: 24,
      comments: 8,
      category: 'Logro',
      mood: '😊'
    },
    {
      id: 2,
      author: 'Carlos Ramírez',
      avatar: 'account-circle',
      time: 'Hace 5 horas',
      content: 'Alguien más tiene problemas para dormir? He probado la playlist de Sueño Profundo y me ha ayudado mucho. Les recomiendo combinarla con el ejercicio de respiración 4-7-8.',
      likes: 18,
      comments: 12,
      category: 'Consejo',
      mood: '😌'
    },
    {
      id: 3,
      author: 'Ana Martínez',
      avatar: 'account-circle',
      time: 'Hace 1 día',
      content: 'Recordatorio: Está bien no estar bien. Hoy fue un día difícil, pero escribir en mi diario me ayudó a procesar mis emociones. Un paso a la vez. 💙',
      likes: 45,
      comments: 15,
      category: 'Reflexión',
      mood: '🦋'
    },
    {
      id: 4,
      author: 'Luis Torres',
      avatar: 'account-circle',
      time: 'Hace 1 día',
      content: '¡30 días consecutivos usando la app! Mi clima emocional pasó de nublado a radiante. La constancia realmente funciona. 🌟',
      likes: 67,
      comments: 20,
      category: 'Logro',
      mood: '🎉'
    },
    {
      id: 5,
      author: 'Sofia Hernández',
      avatar: 'account-circle',
      time: 'Hace 2 días',
      content: 'El chat de apoyo me ayudó mucho anoche cuando tuve un ataque de ansiedad. Saber que hay recursos disponibles 24/7 me da mucha paz mental.',
      likes: 33,
      comments: 9,
      category: 'Agradecimiento',
      mood: '💚'
    }
  ]);

  const [likedPosts, setLikedPosts] = useState([]);

  const handleLike = (postId) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, likes: post.likes - 1 } : post
      ));
    } else {
      setLikedPosts([...likedPosts, postId]);
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Logro': return '#4CAF50';
      case 'Consejo': return '#2196F3';
      case 'Reflexión': return '#9C27B0';
      case 'Agradecimiento': return '#FF9800';
      default: return '#6B9BD1';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Comunidad</Text>
        <IconButton
          icon="plus"
          size={24}
          onPress={() => alert('📝 Crear Publicación\n\nComparte tu experiencia con la comunidad.\n\n✨ Próximamente disponible.')}
        />
      </View>

      <ScrollView>
        <View style={styles.header}>
          <Icon name="account-group" size={48} color="#6B9BD1" />
          <Title style={styles.title}>Comunidad de Bienestar</Title>
          <Paragraph style={styles.subtitle}>
            Comparte experiencias y apoya a otros
          </Paragraph>
        </View>

        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Icon name="account-multiple" size={32} color="#6B9BD1" />
                <Text style={styles.statNumber}>1,234</Text>
                <Text style={styles.statLabel}>Miembros</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="message-text" size={32} color="#4CAF50" />
                <Text style={styles.statNumber}>567</Text>
                <Text style={styles.statLabel}>Publicaciones</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="heart" size={32} color="#FF4081" />
                <Text style={styles.statNumber}>3,456</Text>
                <Text style={styles.statLabel}>Apoyos</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip style={styles.categoryChip} selected>Todos</Chip>
            <Chip style={styles.categoryChip}>Logros</Chip>
            <Chip style={styles.categoryChip}>Consejos</Chip>
            <Chip style={styles.categoryChip}>Reflexiones</Chip>
            <Chip style={styles.categoryChip}>Agradecimientos</Chip>
          </ScrollView>
        </View>

        {posts.map((post) => (
          <Card key={post.id} style={styles.postCard}>
            <Card.Content>
              <View style={styles.postHeader}>
                <Avatar.Icon size={40} icon={post.avatar} style={styles.avatar} />
                <View style={styles.postInfo}>
                  <Text style={styles.authorName}>{post.author}</Text>
                  <Text style={styles.postTime}>{post.time}</Text>
                </View>
                <Chip
                  style={[styles.categoryBadge, { backgroundColor: getCategoryColor(post.category) }]}
                  textStyle={{ color: '#FFFFFF', fontSize: 11 }}
                >
                  {post.category}
                </Chip>
              </View>

              <Paragraph style={styles.postContent}>
                {post.mood} {post.content}
              </Paragraph>

              <View style={styles.postActions}>
                <Button
                  mode="text"
                  icon={likedPosts.includes(post.id) ? "heart" : "heart-outline"}
                  onPress={() => handleLike(post.id)}
                  textColor={likedPosts.includes(post.id) ? "#FF4081" : "#7F8C8D"}
                >
                  {post.likes}
                </Button>
                <Button
                  mode="text"
                  icon="comment-outline"
                  textColor="#7F8C8D"
                  onPress={() => alert(`💬 Comentarios (${post.comments})\n\n✨ Próximamente disponible.`)}
                >
                  {post.comments}
                </Button>
                <Button
                  mode="text"
                  icon="share-variant"
                  textColor="#7F8C8D"
                  onPress={() => alert('📤 Compartir\n\nComparte esta publicación.\n\n✨ Próximamente disponible.')}
                >
                  Compartir
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}

        <Card style={styles.guidelinesCard}>
          <Card.Content>
            <Title>Normas de la Comunidad</Title>
            <View style={styles.guidelinesList}>
              <Text style={styles.guideline}>✓ Sé respetuoso y empático</Text>
              <Text style={styles.guideline}>✓ Comparte experiencias constructivas</Text>
              <Text style={styles.guideline}>✓ No compartas información personal</Text>
              <Text style={styles.guideline}>✓ Reporta contenido inapropiado</Text>
              <Text style={styles.guideline}>✓ Apoya a otros miembros</Text>
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
  statsCard: {
    margin: 20,
    marginTop: 12,
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoryChip: {
    marginRight: 8,
  },
  postCard: {
    margin: 20,
    marginTop: 12,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: '#6B9BD1',
  },
  postInfo: {
    flex: 1,
    marginLeft: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  postTime: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  categoryBadge: {
    height: 24,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#2C3E50',
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
  },
  guidelinesCard: {
    margin: 20,
    marginTop: 12,
    backgroundColor: '#E8F4F8',
    elevation: 2,
  },
  guidelinesList: {
    marginTop: 12,
  },
  guideline: {
    fontSize: 14,
    color: '#2C3E50',
    marginVertical: 4,
  },
});
