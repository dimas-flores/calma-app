const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateRegistro, validateLogin } = require('../validators/auth.validator');

// Registro de usuario
router.post('/register', validateRegistro, authController.register);

// Login
router.post('/login', validateLogin, authController.login);

// Logout
router.post('/logout', authController.logout);

// Verificar token
router.get('/verify', authController.verifyToken);

// Recuperar contraseña
router.post('/forgot-password', authController.forgotPassword);

// Resetear contraseña
router.post('/reset-password', authController.resetPassword);

module.exports = router;
