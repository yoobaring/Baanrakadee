const Joi = require('@hapi/joi')

const homeValidation = data => {
    const schema = {
        name: Joi.string().min(4).required(),
        des: Joi.string().min(2).required(),
        latitude: Joi.string().min(2).required(),
        longitude: Joi.string().min(2).required(),
        price: Joi.number().min(2).required(),
        area: Joi.number().min(6).required(),
        type: Joi.string().min(4).required(),
        category: Joi.string().min(4).required(),
        tel: Joi.string().min(6).required(),
        province: Joi.string().min(2).required(),
        img_url: Joi.array()

    }
    return Joi.validate(data, schema)
}

module.exports.homeValidation = homeValidation
