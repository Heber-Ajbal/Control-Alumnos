'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CursoSchema = Schema({
    alumno: String,
    Profesor: String,
    nombre: String,
    CursoMaestro: String
    
})

module.exports = mongoose.model('cursos', CursoSchema )