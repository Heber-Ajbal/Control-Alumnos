'use strict'

// IMPORTACIONES 
var express = require("express");

var cursoControlador = require("../controladores/curso.controlador");


//IMPORTACIONES MIDD
var md_autorizacion = require("../middlewares/authenticated")

var api = express.Router()

api.post('/CrearCurso',md_autorizacion.ensureAuth, cursoControlador.ingresarCurso);
api.post('/AsignarCursos',md_autorizacion.ensureAuth,cursoControlador.asignarCurso);
api.get('/MostrarCursos',md_autorizacion.ensureAuth,cursoControlador.obtenerCurso);
api.put('/EditarCursos/:id', md_autorizacion.ensureAuth, cursoControlador.editarCurso)
api.put('/EliminarCursos/:id',md_autorizacion.ensureAuth, cursoControlador.EliminarCurso)

module.exports = api;