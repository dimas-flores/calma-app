import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Avatar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import api from '../services/api';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      setProfile(response.data.user);
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={80} label={user?.nombre?.charAt(0) || 'U'} />
        <Title style={styles.name}>{profile?.nombre || user?.nombre}</Title>
        <Paragraph style={styles.email}>{profile?.email || user?.email}</Paragraph>
      </View>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Title>Información Personal</Title>
          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Edad:</Paragraph>
            <Paragraph style={styles.infoValue}>{profile?.edad || 'N/A'}</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Profesión:</Paragraph>
            <Paragraph style={styles.infoValue}>{profile?.profesion || 'N/A'}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      <Button mode="contained" onPress={handleLogout} style={styles.logoutButton} icon="logout">
        Cerrar Sesión
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9FC' },
  header: { alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#FFFFFF' },
  name: { fontSize: 24, marginTop: 16 },
  email: { color: '#7F8C8D', marginTop: 4 },
  infoCard: { margin: 20, elevation: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  infoLabel: { fontWeight: 'bold', color: '#2C3E50' },
  infoValue: { color: '#7F8C8D' },
  logoutButton: { margin: 20, paddingVertical: 6 },
});
