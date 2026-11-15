const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

class AuthController {
  async register(req, res) {
    try {
      const { email, password, nombre, edad, profesion, genero } = req.body;

      // Verificar si el usuario ya existe
      const existingUsers = await query(
        'SELECT email FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      // Hash de la contraseña
      const passwordHash = await bcrypt.hash(password, 10);

      // Insertar nuevo usuario
      const result = await query(
        'INSERT INTO users (email, password_hash, nombre, edad, profesion, genero) VALUES (?, ?, ?, ?, ?, ?)',
        [email, passwordHash, nombre, edad || null, profesion || null, genero || null]
      );

      const userId = result.insertId;

      // Generar token
      const token = jwt.sign(
        { userId, email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: { id: userId, email, nombre },
        token
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Buscar usuario por email
      const users = await query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const user = users[0];

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Actualizar último acceso
      await query(
        'UPDATE users SET ultimo_acceso = NOW() WHERE id = ?',
        [user.id]
      );

      // Generar token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        message: 'Login exitoso',
        user: { id: user.id, email: user.email, nombre: user.nombre },
        token
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }

  async logout(req, res) {
    res.json({ message: 'Logout exitoso' });
  }

  async verifyToken(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ valid: false });
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      res.json({ valid: true, userId: decoded.userId });
    } catch (error) {
      res.status(401).json({ valid: false });
    }
  }

  async forgotPassword(req, res) {
    res.json({ message: 'Funcionalidad en desarrollo' });
  }

  async resetPassword(req, res) {
    res.json({ message: 'Funcionalidad en desarrollo' });
  }
}

module.exports = new AuthController();
