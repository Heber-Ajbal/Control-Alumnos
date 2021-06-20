'use strict'

// IMPORTACIONES 
var express = require("express");

var alumnoControlador = require("../controladores/alumno.controlador")

//IMPORTACIONES MIDD
var md_autorizacion = require("../middlewares/authenticated")

var api = express.Router()
api.post('/registrarAlumno', alumnoControlador.registrar);
api.post('/loginAlumno', alumnoControlador.login);
api.put('/EditarAlumno/:id',md_autorizacion.ensureAuth, alumnoControlador.editarAlumno);
api.put('/EliminarAlumno/:id', md_autorizacion.ensureAuth, alumnoControlador.eliminarAlumno);

module.exports = api;