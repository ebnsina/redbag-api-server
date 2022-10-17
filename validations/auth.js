const { required } = require("joi");
const Joi = require("joi");

exports.validateRegister = (data) => {
  const registerSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().min(6).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    location: Joi.string().required(),
    phone: Joi.string().required(),
    lastDonate: Joi.string().required(),
    gender: Joi.string().required(),
    bloodGroup: Joi.string().required(),
    dob: Joi.string().required(),
  });

  return registerSchema.validate(data);
};

exports.validateLogin = (data) => {
  const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });

  return loginSchema.validate(data);
};
