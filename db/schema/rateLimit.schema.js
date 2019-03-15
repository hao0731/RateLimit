const mongoose = require('mongoose')
const RateLimitSchema = mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    resetTime: {
        type: Number,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    }
})

module.exports = RateLimitSchema