import Joi from 'joi';

export const validateCandidate = (data: any) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    position: Joi.string().required(),
    experience: Joi.number().min(0).max(50).required(),
    skills: Joi.array().items(Joi.string()).required()
  });
  
  const result = schema.validate(data, { abortEarly: false });
  
  if (result.error) {
    return { error: result.error.details.map(d => d.message) };
  }
  
  return { error: null };
};
