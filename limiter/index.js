const RateLimiter = require('../db/models/rateLimit.model')
const Response = require('../response')

const setHeader = async (res, data) => {
    res.setHeader('X-RateLimit-Remaining', data.quantity)
    res.setHeader('X-RateLimit-Reset', data.resetTime)
}

const Limiter = async (req, res, next) => {
    const client = req.connection.remoteAddress
    try {
        const user = await RateLimiter.findUser(client)
        let data = null
        if(user) {
            switch(user.authorize()) {
                case 'reset':
                    data = await user.resetLimit()
                    setHeader(res, data)
                    break
                case 'decrease':
                    data = await user.decreaseQuantity()
                    setHeader(res, data)
                    break
                default:
                    setHeader(res, user)
                    return Response.send(res, 429, Response.message("Too many request"))
            }
        }
        else {
            data = await RateLimiter.createUser(client)
            setHeader(res, data)
            console.log(`IP: ${ data.ip } is recorded.`)
        }
    }
    catch(e) {
        console.error(e)
        return Response(res, 500, Response.message("Oop! Something is wrong!"))
    }
    return next()
}

module.exports = Limiter