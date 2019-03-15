const express = require('express')
const app = express()
const Limiter = require('./limiter')
const Database = require('./db/config')

Database.connect()

app.use(Limiter)

app.get('/',(req, res, next) => {
    res.send('helloworld')
})

app.listen(5000, () => { console.log(`run at http://localhost:5000`) })