const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

/**
 * The **validation** module contains the validators to validate server request bodies
 *
 *@author [Devin Jaggernauth](https://github.com/mentalcaries)
 *@author [Hoang Le Chau](https://github.com/hoanglechau)
 *@author [Yuffie Hu](https://github.com/yuff1006)
 */

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message('The URL is not valid');
};

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.message('The email is not valid');
};

const validateRequestAuth = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string().required().messages({
        'string.empty': 'Authorization required',
      }),
    })
    .unknown(true),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().min(8).required().messages({
      'string.min': 'The password field needs at least 8 characters',
      'string.empty': 'The password field is empty',
    }),
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'The name field needs at least 2 characters',
      'string.max': 'The maximum length of the name field is 30 characters',
      'string.empty': 'The name field is empty',
    }),
    avatar: Joi.string().custom(validateURL).allow(''),
    preferences: Joi.array().items(Joi.string().allow('')),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().min(8).required().messages({
      'string.min': 'The password field needs at least 8 characters',
      'string.empty': 'The password field is empty',
    }),
  }),
});

const validatePasswordChange = celebrate({
  body: Joi.object().keys({
    _id: Joi.string().hex().length(24)
      .messages({
        'any.invalid': 'Invalid User Name',
      }),
    oldPassword: Joi.string().min(8).required().messages({
      'string.min': 'The password field needs at least 8 characters',
      'string.empty': 'The password field is empty',
    }),
    newPassword: Joi.string().min(8).disallow(Joi.ref('oldPassword')).required()
      .messages({
        'string.min': 'The password field needs at least 8 characters',
        'string.empty': 'The password field is empty',
        'any.invalid': 'Passwords must be different',
      }),
  }),
});

const validateUserId = celebrate({
  body: Joi.object().keys({
    _id: Joi.string().hex().length(24)
      .messages({
        'any.invalid': 'Invalid User Name',
      }),
  }),
});

const validatePreferences = celebrate({
  body: Joi.object()
    .keys({
      _id: Joi.string().hex().length(24).messages({
        'string.empty': 'ID required',
      }),
      preferences: Joi.array().items(Joi.string()),
    })
    .unknown(true),
});

const validateTemperatureSelection = celebrate({
  body: Joi.object()
    .keys({
      _id: Joi.string().hex().length(24).messages({
        'string.empty': 'ID required',
      }),
      temperatureSelection: Joi.string().length(1).required(),
    })
    .unknown(true),
});

const validateProfileChanges = celebrate({
  body: Joi.object()
    .keys({
      _id: Joi.string().hex().length(24).messages({
        'string.empty': 'ID required',
      }),
      name: Joi.string().min(2).max(30).messages({
        'string.min': 'The name field needs at least 2 characters',
        'string.max': 'The maximum length of the name field is 30 characters',
        'string.empty': 'The name field is empty',
      }),
      avatar: Joi.string().custom(validateURL).allow(''),
    }),
});

const validateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Item name must be at least 2 characters',
        'string.max': 'Item name exceeds 30 characters',
        'string.empty': 'Item name field is empty',
      }),
    type: Joi.string().min(2).required().messages({
      'string.min': 'Type field must be at least 2 characters',
      'string.empty': 'The type field is empty',
    }),
    weather: Joi.string().min(2).max(30).messages({
      'string.min': 'Weather field needs at least 2 characters',
      'string.max': 'Weather name exceeds 30 characters',
      'string.empty': 'Weather field is empty',
    }),
    imageUrl: Joi.string().custom(validateURL).required().messages({
      'string.empty': 'URL cannot be empty',
    }),
  }),
});

module.exports = {
  validateLogin,
  validateRequestAuth,
  validateUser,
  validateUserId,
  validatePreferences,
  validateTemperatureSelection,
  validateProfileChanges,
  validatePasswordChange,
  validateItem,
};
