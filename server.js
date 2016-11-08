

// fallthrough route
app.use(function(req, res) {
    res.sendStatus(404)
})















'use strict'

// init project
let express = require('express')
app.get('', function(req, res) {
    
})

let app = express()
let port = process.env.PORT || 3000
//let path = require('path')

//app.use(express.static(path.join(__dirname, 'public')))

function createNaturalDate(dateObject) {
    let month = dateObject.getMonth()
    let date = dateObject.getDate()
    let year = dateObject.getFullYear()
    let monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
    let naturalDate = monthNames[month] + ' ' + date + ', ' + year
    return naturalDate
}

// app.get('/', function(req, res) {
//     res.send("I'm running")
// })

app.get('/', function(req, res) {
    res.sendFile('index.html', {'root': __dirname})
})

app.get('/:time', function(req, res) {
    let time = req.params.time
    let unixTime
    let naturalDate

    if (time.match(/[0-9]+/)[0].split('').length === time.length) {
        app.get('/:time', function(req, res) {
            let time = req.params.time
            let unixTime
            let naturalDate

            if (time.match(/[0-9]+/)[0].split('').length === time.length) {
                unixTime = parseInt(time)
                let dateObject = new Date(time * 1000)
                naturalDate = createNaturalDate(dateObject)

            } else if (Date.parse(time)) {
                let dateObject = new Date(time)
                unixTime = Date.parse(time) / 1000
                naturalDate = createNaturalDate(dateObject)

            } else {
                unixTime = null
                naturalDate = null
            }

            let output = {
                'unix': unixTime,
                'natural': naturalDate
            }
            res.send(output)
        })
        unixTime = parseInt(time)
        let dateObject = new Date(time * 1000)
        naturalDate = createNaturalDate(dateObject)

    } else if (Date.parse(time)) {
        let dateObject = new Date(time)
        unixTime = Date.parse(time) / 1000
        naturalDate = createNaturalDate(dateObject)

    } else {
        unixTime = null
        naturalDate = null
    }

    let output = {
        'unix': unixTime,
        'natural': naturalDate
    }
    res.send(output)
})

// listen for requests
let listener = app.listen(port, function() {
    console.log('Your app is listening on port ' + listener.address().port)
})
