const mongoose = require('mongoose')
const url = 'mongodb://localhost/ratelimiter'

const connect = () => {
    mongoose.connect(url)
    let database = mongoose.connection
    database.on('error', console.error.bind(console, 'Console error:'))
    database.once('open', () => {
        console.log('Database is connected!!!')
    })
}
module.exports = { connect }