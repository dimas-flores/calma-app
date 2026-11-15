const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
// const { supabase } = require('../config/supabase');
const db = require('../config/database');

router.post('/log', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { fecha, estado_emocional, actividades_completadas, notas } = req.body;

    const { data, error } = await supabase
      .from('user_progress')
      .insert([{
        user_id: userId,
        fecha: fecha || new Date().toISOString().split('T')[0],
        estado_emocional,
        actividades_completadas,
        notas
      }])
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Progreso registrado', progress: data });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar progreso' });
  }
});

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { dias = 7 } = req.query;

    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - parseInt(dias));

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .gte('fecha', fechaInicio.toISOString().split('T')[0])
      .order('fecha', { ascending: true });

    if (error) throw error;
    res.json({ stats: data });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

module.exports = router;
