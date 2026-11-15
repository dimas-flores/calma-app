const express = require('express');
const router = express.Router();
const questionnaireController = require('../controllers/questionnaire.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/submit', questionnaireController.submitQuestionnaire);
router.get('/history', authMiddleware, questionnaireController.getHistory);

module.exports = router;
