'use strict'

//VARIABLES

const express = require("express");
const app = express();
const bodyParser = require('body-parser');


// IMPORTACION DE RUTAS 

var maestro_ruta = require("./src/rutas/maestro.rutas");
var cursos_ruta = require("./src/rutas/cursos.rutas");
var alumnos_ruta = require("./src/rutas/alumnos.rutas")


// MIDDLEWARES
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//APLICACION DE RUTAS 
app.use('/api', maestro_ruta, cursos_ruta, alumnos_ruta);

// EXPORTAR

module.exports = app;