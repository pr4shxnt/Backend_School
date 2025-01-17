const mongoose = require('mongoose')
const { post } = require('../Routes/adminRoute')

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    post: {
        type: String,

         required: true
    }

},
{
    timestamps: true,
})


module.exports = mongoose.model('Testimonial', testimonialSchema)
