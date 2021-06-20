'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AlumnoSchema = Schema({

    nombre: String,
    password:String,
    rol: String,    
    
})

module.exports = mongoose.model('alumo', AlumnoSchema );