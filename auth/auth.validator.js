const Joi = require('joi');

const RegistrationSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

  password: Joi.string()
    .required()
    .pattern(/^[a-zA-Z0-9]{6,20}$/)
    .error((errors) => {
      errors.forEach((err) => {
        if (err.code === 'string.pattern.base') {
          err.message = "'password is not valid";
        }
      });
      return errors;
    }),
});

const validationMiddleware = (schema) => async (req, res, next) => {
  const { error } = await schema.validate(req.body);

  if (error) {
    const message = error.details.reduce((msg, nextError) => {
      if (msg) {
        return msg + ',' + nextError;
      }
      return nextError.message;
    }, '');

    res.status(400).json({
      code: 400,
      status: 'Bad request',
      message,
    });
    return;
  }
  next();
};

const ResendingEmailSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
});

module.exports = {
  registrationValidatorMiddleware: validationMiddleware(RegistrationSchema),
  resendingEmailValidatorMiddleware: validationMiddleware(ResendingEmailSchema),
};
