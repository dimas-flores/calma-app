import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { setCredentials, setLoading, setError } from '../store/slices/authSlice';

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [profesion, setProfesion] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleRegister = () => {
    if (!nombre || !edad || !email || !password) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    setIsLoading(true);
    dispatch(setLoading(true));

    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        if (users.find(u => u.email === email)) {
          dispatch(setError('Email ya registrado'));
          alert('❌ Este email ya está registrado');
          setIsLoading(false);
          return;
        }

        const newUser = {
          id: Date.now().toString(),
          nombre,
          email,
          edad,
          profesion: profesion || '',
          password,
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        dispatch(setCredentials({
          user: {
            id: newUser.id,
            nombre: newUser.nombre,
            email: newUser.email,
            edad: newUser.edad,
            profesion: newUser.profesion
          },
          token: 'token-' + Date.now(),
        }));

        alert('✅ ¡Bienvenido, ' + nombre + '! 🎉');
      } catch (error) {
        dispatch(setError('Error al registrar'));
        alert('Error al registrar');
      }

      setIsLoading(false);
    }, 500);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Únete a Calma</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label="Nombre completo *"
          value={nombre}
          onChangeText={setNombre}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Edad *"
          value={edad}
          onChangeText={setEdad}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label="Profesión (opcional)"
          value={profesion}
          onChangeText={setProfesion}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Email *"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Contraseña *"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          Registrarse
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Login')}
          style={styles.linkButton}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FC',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6B9BD1',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
  linkButton: {
    marginTop: 16,
  },
});
