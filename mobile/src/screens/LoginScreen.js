import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { setCredentials, setLoading, setError } from '../store/slices/authSlice';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (!email || !password) {
      alert('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    dispatch(setLoading(true));

    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
          dispatch(setCredentials({
            user: {
              id: user.id,
              nombre: user.nombre,
              email: user.email,
              edad: user.edad,
              profesion: user.profesion
            },
            token: 'token-' + Date.now(),
          }));
          alert('¡Bienvenido, ' + user.nombre + '! 🎉');
        } else {
          dispatch(setError('Credenciales incorrectas'));
          alert('❌ Email o contraseña incorrectos');
        }
      } catch (error) {
        dispatch(setError('Error al iniciar sesión'));
        alert('Error al iniciar sesión');
      }

      setIsLoading(false);
    }, 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calma</Text>
        <Text style={styles.subtitle}>Tu bienestar emocional en tus manos</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          Iniciar Sesión
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Register')}
          style={styles.linkButton}
        >
          ¿No tienes cuenta? Regístrate
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FC',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6B9BD1',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
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
