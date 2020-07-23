const Joi = require('@hapi/joi')


const regisValidation = data => {
    const schema = {
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        username: Joi.string().min(4).required(),
        password: Joi.string().min(6).required()
    }
    return Joi.validate(data, schema)
}
const loginValidation = data => {
    const schema = {
        username: Joi.string().min(4).required(),
        password: Joi.string().min(6).required()
    }
    return Joi.validate(data, schema)
}

module.exports.loginValidation = loginValidation
module.exports.regisValidation = regisValidation