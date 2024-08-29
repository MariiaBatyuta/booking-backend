import Joi from "joi";

export const userLoginSchema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required().min(6),
});