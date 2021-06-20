'use strict'

// IMPORTACIONES 
var express = require("express");
var maestroControlador = require("../controladores/maestro.controlador");
var cursoControlador = require("../controladores/curso.controlador");
var alumnoControlador = require("../controladores/alumno.controlador")

//IMPORTACIONES MIDD
var md_autorizacion = require("../middlewares/authenticated")

// RUTAS 
var api = express.Router()
api.post('/registrarMaestro',maestroControlador.registrar);
api.post('/loginMaestro', maestroControlador.login);

/*api.post('/registrarAlumno', alumnoControlador.registrar);
api.post('/loginAlumno', alumnoControlador.login);
api.put('/EditarAlumno/:id',md_autorizacion.ensureAuth, alumnoControlador.editarAlumno);
api.put('/EliminarAlumno/:id', md_autorizacion.ensureAuth, alumnoControlador.eliminarAlumno);


api.post('/CrearCurso',md_autorizacion.ensureAuth, cursoControlador.ingresarCurso);
api.post('/AsignarCursos',md_autorizacion.ensureAuth,cursoControlador.asignarCurso);
api.get('/MostrarCursos',md_autorizacion.ensureAuth,cursoControlador.obtenerCurso);
api.put('/EditarCursos/:id', md_autorizacion.ensureAuth, cursoControlador.editarCurso)
api.put('/EliminarCursos/:id',md_autorizacion.ensureAuth, cursoControlador.EliminarCurso)*/






//api.get('/obtenerMaestro', maestroControlador.obtenerMaestro);



//RUTAS CURSOS  
//api.post('/crearCurso', md_autorizacion.ensureAuth,  cursoControlador.crearCurso);
//api.get('/verCursos', md_autorizacion.ensureAuth, cursoControlador.verCursos)

//RUTAS ALUMNO




module.exports = api;