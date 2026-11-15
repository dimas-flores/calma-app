const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware de autenticación para todas las rutas (COMENTADO PARA PRUEBAS)
// router.use(authMiddleware);

/**
 * @route POST /api/chatbot/message
 * @desc Enviar mensaje al chatbot
 * @access Private
 */
router.post('/message', async (req, res) => {
  await chatbotController.sendMessage(req, res);
});

/**
 * @route GET /api/chatbot/history/:userId
 * @desc Obtener historial de conversación
 * @access Private
 */
router.get('/history/:userId', async (req, res) => {
  await chatbotController.getConversationHistory(req, res);
});

/**
 * @route GET /api/chatbot/stats/:userId
 * @desc Obtener estadísticas del chatbot
 * @access Private
 */
router.get('/stats/:userId', async (req, res) => {
  await chatbotController.getChatbotStats(req, res);
});

/**
 * @route DELETE /api/chatbot/history/:userId
 * @desc Limpiar historial de conversación
 * @access Private
 */
router.delete('/history/:userId', async (req, res) => {
  await chatbotController.clearHistory(req, res);
});

/**
 * @route GET /api/chatbot/crisis-resources
 * @desc Obtener recursos de crisis
 * @access Private
 */
router.get('/crisis-resources', async (req, res) => {
  await chatbotController.getCrisisResources(req, res);
});

module.exports = router;
