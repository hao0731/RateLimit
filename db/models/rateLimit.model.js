const mongoose = require('mongoose')
const RateLimitSchema = require('../schema/rateLimit.schema')

const LIMIT_TIME = 60 * 60 * 1000
const QUANTITY = 999

RateLimitSchema.statics.findUser = async function (IP) {
    return await new Promise((resolve, reject) => {
        this.findOne({ ip: IP })
        .then(user => { resolve(user) })
        .catch(err => { reject(err) })
    })
}

RateLimitSchema.statics.createUser = async function (IP) {
    return await new Promise((resolve, reject) => {
        const user = new this({ ip: IP, resetTime: new Date().valueOf() + LIMIT_TIME, quantity: QUANTITY })
        user.save()
        .then(doc => { resolve(doc) })
        .catch(err => { reject(err) })
    })
}

RateLimitSchema.methods.authorize = function () {
    const now = new Date().valueOf()
    if(now >= this.resetTime) {
        return 'reset'
    }
    else if(this.quantity !== 0) {
        return 'decrease'
    }
    return 'reject'
}

RateLimitSchema.methods.resetLimit = async function () {
    return await new Promise((resolve, reject) => {
        this.resetTime = new Date().valueOf() + LIMIT_TIME
        this.quantity = QUANTITY
        this.save()
        .then(doc => { resolve(doc) })
        .catch(err => { reject(err) })
    })
}

RateLimitSchema.methods.decreaseQuantity = async function () {
    return await new Promise((resolve, reject) => {
        this.quantity -= 1
        this.save()
        .then(doc => { resolve(doc) })
        .catch(err => { reject(err) })
    })
}


module.exports = mongoose.model('limit', RateLimitSchema)