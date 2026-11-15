const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const db = require('../config/database');

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, email, nombre, edad, profesion, fecha_registro FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user: rows[0] });
  } catch (error) {
    console.error('Error en profile:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { nombre, edad, profesion } = req.body;

    await db.execute(
      'UPDATE users SET nombre = ?, edad = ?, profesion = ? WHERE id = ?',
      [nombre, edad, profesion, req.user.id]
    );

    const [rows] = await db.execute(
      'SELECT id, email, nombre, edad, profesion, fecha_registro FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({ message: 'Perfil actualizado', user: rows[0] });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

module.exports = router;
