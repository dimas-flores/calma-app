const Joi = require('joi');

const validateRegistro = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    nombre: Joi.string().min(2).required(),
    edad: Joi.number().integer().min(13).max(120).optional().allow(null, ''),
    profesion: Joi.string().optional().allow(null, '')
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: 'Datos de registro inválidos',
      details: error.details[0].message
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: 'Datos de login inválidos',
      details: error.details[0].message
    });
  }

  next();
};

module.exports = {
  validateRegistro,
  validateLogin
};
