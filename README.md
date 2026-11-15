# Calma App

Prototipo académico de una aplicación de bienestar emocional, con cliente móvil en React Native/Expo y una API en Node.js, Express y MySQL.

Nombre original: `mental-health-app`.

## Incluye

- Registro e inicio de sesión con JWT.
- Cuestionarios y visualización de resultados.
- Pantallas de diario, meditación, música y seguimiento del progreso.
- Código experimental de chatbot con servicio remoto y respuestas locales.
- Cliente web adicional en `web/`.

## Desarrollo

Requiere Node.js, npm y MySQL/MariaDB; el cliente utiliza Expo SDK 49.

1. Importar `database/mental_health_complete.sql` en una base de desarrollo.
2. Copiar `backend/.env.example` a `backend/.env` y configurar MySQL y un `JWT_SECRET` aleatorio propio.
3. En `backend/`, ejecutar `npm ci` y `npm run dev`. La API utiliza el puerto 3001; `/health` permite comprobar que responde.
4. En `mobile/`, copiar `.env.example` a `.env`, ejecutar `npm ci` y `npm start`.
5. Para un teléfono físico, asignar a `EXPO_PUBLIC_API_URL` la IP local del equipo que ejecuta la API, seguida de `:3001/api`.

La clave de OpenAI es opcional para inspeccionar el código; el servicio remoto la necesita para realizar solicitudes. Nunca subir claves ni archivos `.env`.

## Estado y alcance

Prototipo de portafolio, sin validación clínica. Algunas pantallas y funciones son experimentales: el router del chatbot está incluido pero no está montado en `backend/server.js`, y la recuperación de contraseña contiene respuestas provisionales. Se conservan variantes `_NEW` y `_SIMPLE` de las pantallas originales para revisión. No se ha verificado el flujo completo móvil/API/base de datos.

El código conserva los nombres originales de tablas y la base `mental_health_db` para evitar romper sus consultas.
