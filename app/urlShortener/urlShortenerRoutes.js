'use strict'


/* MONGOOSE AND MONGOLAB
 * ----------------------------------------------------------------------------
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for 
 * plenty of time in most operating environments.
 =============================================================================*/
require('dotenv').config()
const options = {
    server: {
        socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 }
    }, 
    replset: {
        socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 }
    }

}

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

// const mongoConnectStr = 'mongodb://process.env.mongoUser:process.env.mongoPassword@ds147777.mlab.com:47777/urlshortenerdb'
//const mongoConnectStr = 'mongodb://user1:FCCstudy@ds147777.mlab.com:47777/urlshortenerdb'
mongoose.connect('mongodb://' + process.env.mongoUser + ':' + process.env.mongoPassword + '@ds147777.mlab.com:47777/urlshortenerdb', options) 
console.log(process.env.mongoUser)
const validator = require('validator')
const UrlModel = require('./urlShortenerModel')


// MODEL #####################################################
                    // this could end up in a module file

module.exports = function(app) {

    function findNextId(url, callback) {
    // check for largest urlId in db and set local var if found
    
        UrlModel.count({}, function(err, count) {
            let uniqueIdCount
            console.log('count: ', count)
            if (count === 0) {
                uniqueIdCount = 0
                createAndInsertUrl(uniqueIdCount + 1, url)
            } else {
            // set uniqueIdCount to the largest id in the collection
                UrlModel.find({}).sort({urlId: -1}).limit(1).exec(function(err, data) {
                // console.log(data)
                    uniqueIdCount = data[0].urlId
                    console.log(uniqueIdCount)
                    createAndInsertUrl(uniqueIdCount + 1, url)
                
                    if (callback) {
                        callback(uniqueIdCount + 1)
                    }
                }) 
            }
        })
    }
    
    function createAndInsertUrl(uniqueIdCount, url) {
    //insert object in db
        let newUrl = new UrlModel({
            url: url,
            urlId: uniqueIdCount
        })
    
        newUrl.save(function(err, data) {
            if (err) throw err
            console.log('object added')
        })
    
    }
    
    function renderShortUrl(url) {
    // do stuff to render using a template might be nice!
    }
    
   // app.use(app.static(path.join(__dirname, 'public')))
    
    console.log('Successfully connected to MongoDB.')
    
    app.get('/new/*', function(req, res) {
        // store url in var
        let url = req.url.replace(/^\/new\//, '')
        if (!validator.isURL(url, {require_tld: true, require_protocol: true, require_host: true, require_valid_protocol: true})) {
            let response = {
                'error': 'Wrong url format, make sure you have a valid protocol and real site.'
            }
            res.json(response)
        } else {    
            //let shortUrl = dbInsert(url)
            // renderShortUrl(shortUrl)
            // console.log(url);
            findNextId(url, function(data) {
                //res.send('hello!')
                console.log('this data:', data + url)
                let response = {
                    original_url: url,
                    short_url: req.protocol + '://' + req.hostname + '/' + data
                }
                res.json(response)
            })
        }
        // console.log('return id: ', uniqueId)
    })
    
    app.get('/:id', function(req, res) {
        
        let id = req.params.id
        if (/^\d+$/.test(id)) {
            // look up the id from the database
            UrlModel.find({urlId: id}, function(err, doc) {
                console.log(doc)
                if (err) {
                    throw err
                }
                
                if (doc.length !== 0 ) {
                    let url = doc[0].url
                    res.redirect(url)
                } else {
                    let response = {
                        'error': 'Not in the database.'
                    }
                    res.json(response)
                }
                
            })
        }         
    })
    
    // fallthrough route
    app.use(function(req, res) {
        res.sendStatus(404)
    })    
}
