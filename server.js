'use strict'

let routes = require('./urlShortener/urlShortenerRoutes')
const path = require('path')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
// const ip = process.env.IP || 'localhost'

// static files route
app.use(express.static(path.join(__dirname, 'public')))

console.log('Successfully connected to MongoDB.')

routes(app)

// listen for requests
let listener = app.listen(port, process.env.IP, function() {
    console.log('Your app is listening at ' + listener.address().port)
})
