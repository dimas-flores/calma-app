const { query } = require('../config/database');

class QuestionnaireController {
  async submitQuestionnaire(req, res) {
    try {
      const respuestas = req.body;

      const resultado = this.calcularEstadoEmocional(respuestas);
      const recomendaciones = await this.obtenerRecomendaciones(resultado);

      res.json({
        resultado: resultado,
        recomendaciones: recomendaciones,
        mensaje: 'Cuestionario procesado exitosamente'
      });

    } catch (error) {
      console.error('Error al procesar cuestionario:', error);
      res.status(500).json({ error: 'Error al procesar cuestionario', details: error.message });
    }
  }

  calcularEstadoEmocional(respuestas) {
    const puntuaciones = {
      estres: 0,
      ansiedad: 0,
      tristeza: 0,
      insomnio: 0,
      faltaAtencion: 0,
      dolorCabeza: 0
    };

    if (respuestas.energia <= 2) {
      puntuaciones.tristeza += 2;
      puntuaciones.insomnio += 1;
    } else if (respuestas.energia >= 5) {
      puntuaciones.ansiedad += 1;
    }

    if (respuestas.concentracion <= 2) {
      puntuaciones.faltaAtencion += 3;
      puntuaciones.ansiedad += 1;
    }

    if (respuestas.estadoEmocional <= 2) {
      puntuaciones.tristeza += 2;
      puntuaciones.ansiedad += 2;
    }

    const mapaSintomas = {
      'dolor_cabeza': 'dolorCabeza',
      'tension_muscular': 'estres',
      'palpitaciones': 'ansiedad',
      'fatiga': 'tristeza'
    };

    if (respuestas.sintomas && mapaSintomas[respuestas.sintomas]) {
      puntuaciones[mapaSintomas[respuestas.sintomas]] += 3;
    }

    const mapaSueno = {
      'muy_mal': 'insomnio',
      'mal': 'ansiedad',
      'regular': 'estres'
    };

    if (respuestas.sueno && mapaSueno[respuestas.sueno]) {
      puntuaciones[mapaSueno[respuestas.sueno]] += 2;
    }

    const mapaPensamientos = {
      'preocupaciones': 'ansiedad',
      'negativos': 'tristeza',
      'agobio': 'estres',
      'falta_foco': 'faltaAtencion'
    };

    if (respuestas.pensamientos && mapaPensamientos[respuestas.pensamientos]) {
      puntuaciones[mapaPensamientos[respuestas.pensamientos]] += 3;
    }

    const estadoPredominante = Object.keys(puntuaciones)
      .reduce((a, b) => puntuaciones[a] > puntuaciones[b] ? a : b);

    const puntuacionMax = puntuaciones[estadoPredominante];
    let nivel = 'leve';
    if (puntuacionMax >= 8) nivel = 'severo';
    else if (puntuacionMax >= 5) nivel = 'moderado';

    return {
      estado: estadoPredominante,
      nivel: nivel,
      puntuacion: puntuacionMax,
      detalles: puntuaciones
    };
  }

  async obtenerRecomendaciones(resultado) {
    try {
      const playlists = await query(
        'SELECT * FROM playlists WHERE activa = 1 LIMIT 3'
      );

      const ejercicios = await query(
        'SELECT * FROM cbt_exercises WHERE activo = 1 LIMIT 3'
      );

      return {
        playlists: playlists || [],
        ejercicios: ejercicios || [],
        nivel: resultado.nivel,
        estado: resultado.estado
      };
    } catch (error) {
      console.error('Error al obtener recomendaciones:', error);
      return {
        playlists: [],
        ejercicios: [],
        nivel: resultado.nivel,
        estado: resultado.estado
      };
    }
  }

  async getHistory(req, res) {
    try {
      const userId = req.user.id;

      const history = await query(
        'SELECT * FROM user_progress WHERE user_id = ? ORDER BY fecha DESC LIMIT 30',
        [userId]
      );

      res.json({ history });

    } catch (error) {
      console.error('Error al obtener historial:', error);
      res.status(500).json({ error: 'Error al obtener historial' });
    }
  }
}

module.exports = new QuestionnaireController();
