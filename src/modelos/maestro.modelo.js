'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MaestroSchema = Schema({

    nombre: String,
    password: String,
    rol: String, 
    
   


})

module.exports = mongoose.model('maestros',MaestroSchema);