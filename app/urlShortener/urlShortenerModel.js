'use strict'

var mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    url: String,
    urlId: Number
})


const Url = mongoose.model('urls', urlSchema)

module.exports = Url