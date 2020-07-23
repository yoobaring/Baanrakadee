const Joi = require('@hapi/joi')

const imageValidate = data => {
    const schema = {
        image: Joi.number().required(),
        id: Joi.number().required()
    }
    return Joi.validate(data, schema)
}

module.exports.imageValidate = imageValidate
