const mongoose = require('mongoose')
const homeSchema = mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    des: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    category: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    type: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    latitude: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    longitude: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    tel: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    province: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    area: {
        type: Number,
        required: true,
        min: 6,

    },
    price: {
        type: Number,
        required: true,
        min: 6,

    },
    date: {
        type: Date,
        default: Date.now
    },
    img_url: {
        type: Array,
        required: true
    }

})

module.exports = mongoose.model('Home', homeSchema)