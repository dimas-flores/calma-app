const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
// const { supabase } = require('../config/supabase');
const db = require('../config/database');

router.get('/exercises', async (req, res) => {
  try {
    const { tipo } = req.query;

    let query = supabase.from('tcc_exercises').select('*');

    if (tipo) {
      query = query.eq('tipo', tipo);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json({ exercises: data });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ejercicios' });
  }
});

router.get('/exercises/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('tcc_exercises')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json({ exercise: data });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ejercicio' });
  }
});

module.exports = router;
