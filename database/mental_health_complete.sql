-- ============================================
-- MENTAL HEALTH APP - BASE DE DATOS COMPLETA
-- ============================================
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS mental_health_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mental_health_db;

-- ============================================
-- ELIMINAR TABLAS EXISTENTES (si existen)
-- ============================================
DROP TABLE IF EXISTS user_answers;
DROP TABLE IF EXISTS user_questionnaire_responses;
DROP TABLE IF EXISTS question_options;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS questionnaires;
DROP TABLE IF EXISTS user_favorites;
DROP TABLE IF EXISTS user_achievements;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS user_progress;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS playlist_songs;
DROP TABLE IF EXISTS songs;
DROP TABLE IF EXISTS playlists;
DROP TABLE IF EXISTS cbt_exercises;
DROP TABLE IF EXISTS journal_entries;
DROP TABLE IF EXISTS emotional_states;
DROP TABLE IF EXISTS users;

-- ============================================
-- TABLA 1: users (Usuarios)
-- ============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    edad INT,
    profesion VARCHAR(100),
    genero ENUM('masculino', 'femenino', 'otro', 'prefiero_no_decir'),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP NULL,
    activo BOOLEAN DEFAULT TRUE,
    avatar_url VARCHAR(255),
    INDEX idx_email (email),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA 2: emotional_states (Estados Emocionales)
-- ============================================
CREATE TABLE emotional_states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    color_hex VARCHAR(7),
    icono VARCHAR(50),
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA 3: questionnaires (Cuestionarios)
-- ============================================
CREATE TABLE questionnaires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo ENUM('inicial', 'seguimiento', 'evaluacion') DEFAULT 'inicial',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tipo (tipo),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA 4: questions (Preguntas)
-- ============================================
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    questionnaire_id INT NOT NULL,
    texto TEXT NOT NULL,
    tipo_respuesta ENUM('escala', 'multiple', 'abierta') DEFAULT 'escala',
    orden INT NOT NULL,
    peso INT DEFAULT 1,
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE CASCADE,
    INDEX idx_questionnaire (questionnaire_id),
    INDEX idx_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA 5: question_options (Opciones de Respuesta)
-- ============================================
CREATE TABLE question_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    texto VARCHAR(255) NOT NULL,
    valor INT NOT NULL,
    emotional_state_id INT,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (emotional_state_id) REFERENCES emotional_states(id) ON DELETE SET NULL,
    INDEX idx_question (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA 6: user_questionnaire_responses (Respuestas de Usuarios)
-- ============================================
CREATE TABLE user_questionnaire_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    questionnaire_id INT NOT NULL,
    fecha_respuesta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    puntuacion_total INT,
    emotional_state_resultado_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE CASCADE,
    FOREIGN KEY (emotional_state_resultado_id) REFERENCES emotional_states(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_fecha (fecha_respuesta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA 7: user_answers (Respuestas Individuales)
-- ============================================
CREATE TABLE user_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    response_id INT NOT NULL,
    question_id INT NOT NULL,
    option_id INT,
    respuesta_texto TEXT,
    FOREIGN KEY (response_id) REFERENCES user_questionnaire_responses(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES question_options(id) ON DELETE SET NULL,
    INDEX idx_response (response_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA 8: playlists (Playlists de Música)
-- ============================================
CREATE TABLE playlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    emotional_state_id INT NOT NULL,
    imagen_url VARCHAR(255),
    spotify_playlist_id VARCHAR(100),
    duracion_minutos INT,
    numero_canciones INT DEFAULT 0,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emotional_state_id) REFERENCES emotional_states(id) ON DELETE CASCADE,
    INDEX idx_emotional_state (emotional_state_id),
    INDEX idx_activa (activa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA 9: songs (Canciones)
-- ============================================
CREATE TABLE songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    artista VARCHAR(255),
    album VARCHAR(255),
    duracion_segundos INT,
    spotify_track_id VARCHAR(100),
    preview_url VARCHAR(255),
    imagen_url VARCHAR(255),
    bpm INT,
    valencia DECIMAL(3,2), -- Positividad de la canción (0-1)
    energia DECIMAL(3,2), -- Energía de la canción (0-1)
    INDEX idx_titulo (titulo),
    INDEX idx_artista (artista)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA 10: playlist_songs (Relación Playlist-Canciones)
-- ============================================
CREATE TABLE playlist_songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    playlist_id INT NOT NULL,
    song_id INT NOT NULL,
    orden INT NOT NULL,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_playlist_song (playlist_id, song_id),
    INDEX idx_playlist (playlist_id),
    INDEX idx_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA 11: cbt_exercises (Ejercicios de TCC)
-- ============================================
CREATE TABLE cbt_exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo ENUM('respiracion', 'mindfulness', 'reestructuracion', 'relajacion', 'meditacion') NOT NULL,
    emotional_state_id INT,
    duracion_minutos INT,
    instrucciones TEXT,
    audio_url VARCHAR(255),
    video_url VARCHAR(255),
    dificultad ENUM('principiante', 'intermedio', 'avanzado') DEFAULT 'principiante',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emotional_state_id) REFERENCES emotional_states(id) ON DELETE SET NULL,
    INDEX idx_tipo (tipo),
    INDEX idx_emotional_state (emotional_state_id),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA 12: user_sessions (Sesiones de Usuario)
-- ============================================
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    emotional_state_inicio_id INT,
    emotional_state_fin_id INT,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP NULL,
    duracion_minutos INT,
    playlist_id INT,
    ejercicio_id INT,
    notas TEXT,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (emotional_state_inicio_id) REFERENCES emotional_states(id) ON DELETE SET NULL,
    FOREIGN KEY (emotional_state_fin_id) REFERENCES emotional_states(id) ON DELETE SET NULL,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE SET NULL,
    FOREIGN KEY (ejercicio_id) REFERENCES cbt_exercises(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_fecha_inicio (fecha_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA 13: user_progress (Progreso del Usuario)
-- ============================================
CREATE TABLE user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    fecha DATE NOT NULL,
    emotional_state_id INT,
    nivel_estres INT CHECK (nivel_estres BETWEEN 1 AND 10),
    nivel_ansiedad INT CHECK (nivel_ansiedad BETWEEN 1 AND 10),
    nivel_animo INT CHECK (nivel_animo BETWEEN 1 AND 10),
    horas_sueno DECIMAL(3,1),
    minutos_meditacion INT DEFAULT 0,
    sesiones_completadas INT DEFAULT 0,
    notas_diarias TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (emotional_state_id) REFERENCES emotional_states(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_date (user_id, fecha),
    INDEX idx_user (user_id),
    INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA 14: user_favorites (Favoritos del Usuario)
-- ============================================
CREATE TABLE user_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tipo ENUM('playlist', 'ejercicio', 'cancion') NOT NULL,
    item_id INT NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_favorite (user_id, tipo, item_id),
    INDEX idx_user (user_id),
    INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA 15: notifications (Notificaciones)
-- ============================================
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT,
    tipo ENUM('recordatorio', 'logro', 'sistema', 'motivacion') DEFAULT 'recordatorio',
    leida BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_programada TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_leida (leida),
    INDEX idx_fecha_programada (fecha_programada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA 16: achievements (Logros)
-- ============================================
CREATE TABLE achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50),
    tipo ENUM('sesiones', 'dias_consecutivos', 'ejercicios', 'progreso') NOT NULL,
    requisito_valor INT NOT NULL,
    puntos INT DEFAULT 0,
    INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA 17: user_achievements (Logros del Usuario)
-- ============================================
CREATE TABLE user_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    fecha_obtenido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_achievement (user_id, achievement_id),
    INDEX idx_user (user_id),
    INDEX idx_fecha (fecha_obtenido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA 18: feedback (Retroalimentación)
-- ============================================
CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    tipo ENUM('bug', 'sugerencia', 'comentario', 'otro') NOT NULL,
    titulo VARCHAR(255),
    mensaje TEXT NOT NULL,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    estado ENUM('pendiente', 'revisado', 'resuelto') DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_creacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA 19: journal_entries (Entradas de Diario)
-- ============================================
CREATE TABLE journal_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    emotional_state_id INT,
    titulo VARCHAR(255),
    contenido TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (emotional_state_id) REFERENCES emotional_states(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_fecha (fecha_creacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA 20: chatbot_conversations (Conversaciones del Chatbot)
-- ============================================
CREATE TABLE chatbot_conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    sentiment_score DECIMAL(3,2),
    crisis_detected BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_fecha (created_at),
    INDEX idx_crisis (crisis_detected)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERTAR DATOS INICIALES
-- ============================================

-- Estados emocionales
INSERT INTO emotional_states (nombre, descripcion, color_hex, icono) VALUES
('Feliz', 'Sentimiento de alegría y satisfacción', '#FFD700', '😊'),
('Triste', 'Sentimiento de tristeza y melancolía', '#4169E1', '😢'),
('Ansioso', 'Sentimiento de ansiedad y preocupación', '#FF6347', '😰'),
('Calmado', 'Sentimiento de calma y tranquilidad', '#90EE90', '😌'),
('Enérgico', 'Sentimiento de energía y vitalidad', '#FFA500', '⚡'),
('Cansado', 'Sentimiento de cansancio y fatiga', '#9370DB', '😴'),
('Enojado', 'Sentimiento de enojo e irritabilidad', '#DC143C', '😠'),
('Confundido', 'Sentimiento de confusión e incertidumbre', '#808080', '😕'),
('Motivado', 'Sentimiento de motivación y determinación', '#32CD32', '💪'),
('Relajado', 'Sentimiento de relajación y paz', '#87CEEB', '🧘');

-- Cuestionario inicial
INSERT INTO questionnaires (titulo, descripcion, tipo) VALUES
('Evaluación Inicial de Bienestar', 'Cuestionario para evaluar el estado emocional inicial del usuario', 'inicial');

-- Preguntas del cuestionario
INSERT INTO questions (questionnaire_id, texto, tipo_respuesta, orden) VALUES
(1, '¿Cómo te sientes hoy en general?', 'escala', 1),
(1, '¿Qué tan estresado te sientes?', 'escala', 2),
(1, '¿Cómo calificarías tu nivel de ansiedad?', 'escala', 3),
(1, '¿Qué tan satisfecho estás con tu vida actual?', 'escala', 4),
(1, '¿Cómo calificarías tu calidad de sueño?', 'escala', 5),
(1, '¿Qué tan motivado te sientes para hacer actividades?', 'escala', 6);

-- Opciones de respuesta para las preguntas
INSERT INTO question_options (question_id, texto, valor, emotional_state_id) VALUES
-- Pregunta 1: ¿Cómo te sientes hoy en general?
(1, 'Muy mal', 1, 2), -- Triste
(1, 'Mal', 2, 2), -- Triste
(1, 'Regular', 3, 8), -- Confundido
(1, 'Bien', 4, 1), -- Feliz
(1, 'Muy bien', 5, 1), -- Feliz

-- Pregunta 2: ¿Qué tan estresado te sientes?
(2, 'Muy estresado', 1, 3), -- Ansioso
(2, 'Estresado', 2, 3), -- Ansioso
(2, 'Moderadamente', 3, 8), -- Confundido
(2, 'Poco', 4, 4), -- Calmado
(2, 'Nada', 5, 4), -- Calmado

-- Pregunta 3: ¿Cómo calificarías tu nivel de ansiedad?
(3, 'Muy alto', 1, 3), -- Ansioso
(3, 'Alto', 2, 3), -- Ansioso
(3, 'Moderado', 3, 8), -- Confundido
(3, 'Bajo', 4, 4), -- Calmado
(3, 'Muy bajo', 5, 4), -- Calmado

-- Pregunta 4: ¿Qué tan satisfecho estás con tu vida actual?
(4, 'Muy insatisfecho', 1, 2), -- Triste
(4, 'Insatisfecho', 2, 2), -- Triste
(4, 'Neutral', 3, 8), -- Confundido
(4, 'Satisfecho', 4, 1), -- Feliz
(4, 'Muy satisfecho', 5, 1), -- Feliz

-- Pregunta 5: ¿Cómo calificarías tu calidad de sueño?
(5, 'Muy mala', 1, 6), -- Cansado
(5, 'Mala', 2, 6), -- Cansado
(5, 'Regular', 3, 8), -- Confundido
(5, 'Buena', 4, 10), -- Relajado
(5, 'Excelente', 5, 10), -- Relajado

-- Pregunta 6: ¿Qué tan motivado te sientes para hacer actividades?
(6, 'Nada motivado', 1, 6), -- Cansado
(6, 'Poco motivado', 2, 6), -- Cansado
(6, 'Moderadamente', 3, 8), -- Confundido
(6, 'Motivado', 4, 9), -- Motivado
(6, 'Muy motivado', 5, 9); -- Motivado

-- Playlists
INSERT INTO playlists (nombre, descripcion, emotional_state_id, duracion_minutos, numero_canciones) VALUES
('Relajación Profunda', 'Música suave para reducir el estrés y la ansiedad', 4, 90, 20),
('Concentración', 'Música instrumental para mejorar el enfoque', 1, 120, 25),
('Energía Positiva', 'Música energizante para levantar el ánimo', 5, 75, 18),
('Sueño Reparador', 'Sonidos relajantes para dormir mejor', 10, 60, 15),
('Meditación', 'Música para mindfulness y meditación', 4, 90, 12),
('Naturaleza', 'Sonidos naturales para calmar la mente', 4, 120, 20),
('Motivación', 'Música inspiradora para mantenerse motivado', 9, 60, 15);

-- Ejercicios de TCC
INSERT INTO cbt_exercises (titulo, descripcion, tipo, duracion_minutos, dificultad, instrucciones) VALUES
('Reestructuración Cognitiva', 'Técnica para cambiar patrones de pensamiento negativos', 'reestructuracion', 15, 'intermedio',
'1. Identifica el pensamiento negativo\n2. Evalúa la evidencia a favor y en contra\n3. Genera pensamientos alternativos más equilibrados\n4. Practica el nuevo pensamiento'),
('Grounding 5-4-3-2-1', 'Técnica de anclaje para momentos de ansiedad', 'mindfulness', 5, 'principiante',
'1. 5 cosas que puedes ver\n2. 4 cosas que puedes tocar\n3. 3 cosas que puedes escuchar\n4. 2 cosas que puedes oler\n5. 1 cosa que puedes saborear'),
('Respiración 4-7-8', 'Técnica de respiración para calmar el sistema nervioso', 'respiracion', 3, 'principiante',
'1. Inhala por la nariz durante 4 segundos\n2. Mantén la respiración durante 7 segundos\n3. Exhala por la boca durante 8 segundos\n4. Repite el ciclo 4 veces'),
('Mindfulness Básico', 'Práctica de atención plena al momento presente', 'mindfulness', 10, 'principiante',
'1. Siéntate cómodamente con la espalda recta\n2. Enfoca tu atención en la respiración\n3. Observa tus pensamientos sin juzgar\n4. Regresa suavemente a la respiración cuando te distraigas'),
('Exposición Gradual', 'Técnica para enfrentar miedos de manera controlada', 'reestructuracion', 30, 'avanzado',
'1. Identifica tu miedo específico\n2. Crea una jerarquía de exposición (de menos a más temido)\n3. Comienza con el nivel más bajo\n4. Practica regularmente hasta que la ansiedad disminuya'),
('Activación Conductual', 'Planificación de actividades para mejorar el estado de ánimo', 'reestructuracion', 20, 'intermedio',
'1. Haz una lista de actividades que disfrutas\n2. Programa al menos 3 actividades para la semana\n3. Realiza las actividades aunque no tengas ganas\n4. Registra cómo te sientes después'),
('Resolución de Problemas', 'Técnica estructurada para afrontar desafíos', 'reestructuracion', 20, 'intermedio',
'1. Define claramente el problema\n2. Genera múltiples soluciones posibles\n3. Evalúa los pros y contras de cada opción\n4. Elige la mejor solución e impleméntala'),
('Registro de Pensamientos', 'Herramienta para analizar y modificar pensamientos', 'reestructuracion', 10, 'principiante',
'1. Describe la situación que te preocupa\n2. Anota el pensamiento automático que tienes\n3. Identifica la emoción que sientes\n4. Busca evidencia a favor y en contra\n5. Genera una respuesta más equilibrada');

-- Logros
INSERT INTO achievements (nombre, descripcion, icono, tipo, requisito_valor, puntos) VALUES
('Primera Sesión', 'Completaste tu primera sesión de bienestar', '🎯', 'sesiones', 1, 10),
('Meditador Constante', '7 días consecutivos de meditación', '🔥', 'dias_consecutivos', 7, 50),
('Explorador de TCC', 'Completaste 5 ejercicios diferentes de TCC', '🧠', 'ejercicios', 5, 30),
('Semana Completa', '7 días consecutivos usando la app', '📅', 'dias_consecutivos', 7, 40),
('Mes de Bienestar', '30 días consecutivos de práctica', '🌟', 'dias_consecutivos', 30, 200),
('Maestro Zen', '100 sesiones de meditación completadas', '🧘', 'sesiones', 100, 500),
('Guerrero del Bienestar', 'Acumulaste 1000 puntos de bienestar', '⚡', 'progreso', 1000, 100),
('Diario Emocional', 'Escribiste en tu diario por 7 días seguidos', '📝', 'dias_consecutivos', 7, 35),
('Músico Terapéutico', 'Escuchaste música terapéutica por 10 horas', '🎵', 'progreso', 600, 50);

-- Crear una cuenta propia desde el registro de la aplicación.

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: Resumen de progreso del usuario
CREATE VIEW v_user_progress_summary AS
SELECT
    u.id AS user_id,
    u.nombre,
    u.email,
    COUNT(DISTINCT us.id) AS total_sesiones,
    AVG(us.duracion_minutos) AS promedio_duracion_sesiones,
    SUM(up.minutos_meditacion) AS total_minutos_meditacion,
    AVG(up.nivel_animo) AS promedio_nivel_animo,
    COUNT(DISTINCT ua.achievement_id) AS total_logros,
    MAX(us.fecha_inicio) AS ultima_sesion
FROM users u
LEFT JOIN user_sessions us ON u.id = us.user_id
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
GROUP BY u.id, u.nombre, u.email;

-- Vista: Estados emocionales más frecuentes por usuario
CREATE VIEW v_user_emotional_trends AS
SELECT
    u.id AS user_id,
    u.nombre,
    es.nombre AS estado_emocional,
    COUNT(*) AS frecuencia,
    DATE_FORMAT(uqr.fecha_respuesta, '%Y-%m') AS mes
FROM users u
JOIN user_questionnaire_responses uqr ON u.id = uqr.user_id
JOIN emotional_states es ON uqr.emotional_state_resultado_id = es.id
GROUP BY u.id, u.nombre, es.nombre, mes
ORDER BY u.id, mes DESC, frecuencia DESC;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: Actualizar contador de canciones en playlist
DELIMITER //
CREATE TRIGGER update_playlist_song_count AFTER INSERT ON playlist_songs
FOR EACH ROW
BEGIN
    UPDATE playlists
    SET numero_canciones = (
        SELECT COUNT(*) FROM playlist_songs WHERE playlist_id = NEW.playlist_id
    )
    WHERE id = NEW.playlist_id;
END//
DELIMITER ;

-- Trigger: Actualizar último acceso del usuario
DELIMITER //
CREATE TRIGGER update_user_last_access AFTER INSERT ON user_sessions
FOR EACH ROW
BEGIN
    UPDATE users
    SET ultimo_acceso = CURRENT_TIMESTAMP
    WHERE id = NEW.user_id;
END//
DELIMITER ;

-- ============================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ============================================

-- Índices compuestos para consultas frecuentes
CREATE INDEX idx_user_fecha_progress ON user_progress(user_id, fecha DESC);
CREATE INDEX idx_user_fecha_sessions ON user_sessions(user_id, fecha_inicio DESC);
CREATE INDEX idx_emotional_state_active ON playlists(emotional_state_id, activa);

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

SELECT 'Base de datos creada exitosamente' AS Resultado;
SELECT 'Usuarios' AS Tabla, COUNT(*) AS Total FROM users
UNION ALL
SELECT 'Estados emocionales', COUNT(*) FROM emotional_states
UNION ALL
SELECT 'Cuestionarios', COUNT(*) FROM questionnaires
UNION ALL
SELECT 'Preguntas', COUNT(*) FROM questions
UNION ALL
SELECT 'Playlists', COUNT(*) FROM playlists
UNION ALL
SELECT 'Ejercicios TCC', COUNT(*) FROM cbt_exercises
UNION ALL
SELECT 'Logros', COUNT(*) FROM achievements;
