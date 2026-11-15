const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
// const { supabase } = require('../config/supabase');
const db = require('../config/database');

router.get('/playlists/:estado', async (req, res) => {
  try {
    const { estado } = req.params;

    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('estado_emocional', estado);

    if (error) throw error;
    res.json({ playlists: data });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener playlists' });
  }
});

router.get('/playlists', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('playlists')
      .select('*');

    if (error) throw error;
    res.json({ playlists: data });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener playlists' });
  }
});

module.exports = router;
