'use strict'


/* MONGOOSE AND MONGOLAB
 * ----------------------------------------------------------------------------
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for 
 * plenty of time in most operating environments.
 =============================================================================*/

const options = {
  server: {
    socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 }
  }, 
  replset: {
    socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 }
  }
};

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const mongoConnectStr = 'mongodb://user1:FCCstudy@ds147777.mlab.com:47777/urlshortenerdb'
mongoose.connect(mongoConnectStr, options) 
const validator = require('validator')

//create a schema - like a blueprint of what the db should expect to receive
const urlSchema = new mongoose.Schema({
    url: String,
    urlId: Number
})

// create the model
const Url = mongoose.model('urls', urlSchema)


module.exports = function(app){
    
    function findNextId(model) {
        //get the largest id
        //return id
         
        model.count({}, function(err, count) {
            let uniqueIdCount
            console.log('count: ', count)
            if (count === 0) {
                uniqueIdCount = 1
                return uniqueIdCount
            } else {
                // set uniqueIdCount to the largest id in the collection
                model.find({}).sort({urlId : -1}).limit(1).exec(function(err, doc) {
                    // console.log(data)
                    uniqueIdCount = doc[0].urlId
                    // console.log(uniqueIdCount + 1)
                    return uniqueIdCount + 1
                }) 
            }
        })
    }
    

    function createAndInsertUrl(uniqueIdCount, url, callback) {
        //insert object in db
        console.log(uniqueIdCount)
        let newUrl = new Url({
            url: url,
            urlId: uniqueIdCount
        })
        
        newUrl.save(function(err, data) {
            if (err) throw err
            console.log('object added')
        })
        if (callback) {
           callback(uniqueIdCount)
        }
    }


    app.get('/new/*', function(req, res) {
        // store url in var
        let url = req.url.replace(/^\/new\//, '')
        if (!validator.isURL(url, {require_tld: true, require_protocol: true, require_host: true, require_valid_protocol: true}) ) {
            let response = {
                "error": "Wrong url format, make sure you have a valid protocol and real site."
            }
            res.json(response)
        } 
        else {
           createAndInsertUrl(findNextId(Url), url, function(uniqueIdCount) {
                
                let response = {
                    original_url: url,
                    short_url: req.protocol + '://' + req.hostname + '/' + uniqueIdCount
                }
            res.json(response);
           })
        }
    })
    
    app.get('/:id', function(req, res) {
        
        let id = req.params.id
        if ( !/^\d+$/.test(id) ) {
            let response = {
                "error": "Not a valid format ID."
            }
            res.json(response)
        } else {
            // look up the id from the database
            Url.find({urlId: id}, function(err, doc) {
                console.log(doc)
                if (err) {
                    throw err;
                }
                if (doc.length !== 0 ) {
                    let url = doc[0].url
                    res.redirect(url)
                } else {
                    let response = {
                    "error": "Not in the database."
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
