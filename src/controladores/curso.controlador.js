'use strict'

var Curso = require("../modelos/curso.modelo");
var Maestro = require("../modelos/maestro.modelo");
var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");
const maestroModelo = require("../modelos/maestro.modelo");

function ingresarCurso(req, res) {

    var CursoModel = Curso();
    var params = req.body;

    if (req.user.rol === "ROL_ALUMNO") {
        return res.status(500).send({ mensaje: "Solo los profesores pueden crear el curso" })

    } else {
        if (params.nombre) {
            CursoModel.Profesor = req.user.sub;
            CursoModel.nombre = params.nombre;

            Curso.find({ nombre: CursoModel.nombre })

                .exec((err, CursoEncontrados) => {

                    if (err) return res.status(500).send({ mensaje: "error en la peticion de Curso" });

                    if (CursoEncontrados && CursoEncontrados.length >= 1) {

                        return res.status(500).send({ mensaje: "El Curso ya existe " });

                    } else {
                        CursoModel.save((err, CursoGuardado) => {
                            if (err) return res.status(500).send({ mensaje: "Error en la peticion Empleado" });

                            if (CursoGuardado) {
                                res.status(200).send({ CursoGuardado })

                            } else {
                                res.status(404).send({ mensaje: "No se a podido guardar el Usuario" })


                            }

                        })



                    }

                })







        }
    }
}

function asignarCurso(req, res) {
    var CursoModel = Curso();

    var params = req.body;

    if (req.user.rol === "ROL_MAESTRO") {
        return res.status(500).send({ mensaje: "Solo los alumnos pueden unirse a un curso" })

    } else {

        if (params.nombre) {

            CursoModel.nombre = params.nombre;
            CursoModel.alumno = req.user.sub;

            Curso.find({ alumno: CursoModel.alumno, nombre: CursoModel.nombre }).exec((err, CursoR) => {
                if (err)
                    return res.status(500).send({ mensaje: "Error en la peticion obtener unir" });

                if (!CursoR)
                    return res.status(500).send({ mensaje: " No tienes datos " });

                if (CursoR && CursoR.length >= 1) {

                    return res.status(500).send({ mensaje: "ya esta asignado al curso " });

                } else {
                    Curso.find({ alumno: CursoModel.alumno }).exec((err, CursoM) => {
                        if (err)
                            return res.status(500).send({ mensaje: "Error en la peticion obtener" });

                        if (!CursoM)
                            return res.status(500).send({ mensaje: " No existen los datos " });

                        if (CursoM && CursoM.length > 2) {

                            return res.status(500).send({ mensaje: "Limite de cantidad de curso alcanzado" })
                        } else {

                            Curso.findOne({ nombre: CursoModel.nombre }, `Profesor`)

                                .exec((err, CursoRel) => {
                                    if (err)
                                        return res.status(500).send({ mensaje: "Error en la peticion obtener unir" });

                                    if (!CursoRel)
                                        return res.status(500).send({ mensaje: " No tienes datos " });


                                    CursoModel.Profesor = CursoRel.Profesor;
                                    CursoModel.CursoMaestro = CursoRel._id
                                    CursoModel.save((err, CursoGuardado) => {
                                        if (err) return res.status(500).send({ mensaje: "Error en la peticion Empleado" });

                                        if (CursoGuardado) {
                                            res.status(200).send({ CursoGuardado })

                                        } else {
                                            res.status(404).send({ mensaje: "No se a podido guardar el Usuario" })


                                        }

                                    })

                                })
                        }


                    })

                }

            })

        } else {
            return res.status(500).send({ mensaje: "No envio los parametro suficientes o envio de mas" })

        }

    }
}

function obtenerCurso(req, res) {

    if (req.user.rol != "ROL_MAESTRO") {

        Curso.find({ alumno: req.user.sub }).exec((err, Curso) => {
            if (err)
                return res.status(500).send({ mensaje: "Error en la peticion obtener Curso" });

            if (!Curso)
                return res.status(500).send({ mensaje: "Error en la consulta de Usuarios o No tienes datos " });

            return res.status(200).send({ Curso });


        })


    } else {

        Curso.find({ CursoMaestro: req.user.sub }).exec((err, Curso) => {
            if (err)
                return res.status(500).send({ mensaje: "Error en la peticion obtener datos" });

            if (!Curso)
                return res.status(500).send({ mensaje: "Error en la consulta de Usuarios o No tienes datos " });

            return res.status(200).send({ Curso });

        })



    }

}

function editarCurso(req, res) {
    var iDCurso = req.params.id;
    var params = req.body;

    delete params.password;

    if (req.user.rol === "ROL_MAESTRO")

        return res.status(500).send({ mensaje: "Solo los profesores pueden modificar" })

        Curso.findOne({ _id: iDCurso, alumno: null }).exec((err, CursoB) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion obtener Empleados" });

        if (!CursoB) return res.status(500).send({ mensaje: "Error en la consulta de Usuarios o No tienes datos " });

        if (CursoB.Profesor != req.user.sub) return res.status(500).send({ mensaje: "No tiene tiene derecho a modificar" });


        
        
        
        
        Curso.update({ CursoMaestro: iDCurso }, { $set: { nombre: params.nombre } }, { multi: true }).exec((err, Cursoactualizado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!Cursoactualizado) return res.status(500).send({ mensaje: "No se ha podido editat el usuario" });

            if (Cursoactualizado) {

                Curso.findByIdAndUpdate(iDCurso, params, { new: true }, (err, Cursoactualizado) => {
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
                    if (!Cursoactualizado) return res.status(500).send({ mensaje: "No se ha podido editat el usuario" });

                    if (Cursoactualizado) {

                        return res.status(200).send({ Cursoactualizado });

                    }
                })

            }

        })
        


    })


}

function EliminarCurso(req, res) {
    var iDCurso = req.params.id;

    if (req.user.rol === "ROL_MAESTRO")

         return res.status(500).send({ mensaje: "Solo los profesores pueden Eliminar Cursos" })


    Curso.findOne({ _id: iDCurso, alumno: null }).exec((err, CursosB) => {
         if (err)
              return res.status(500).send({ mensaje: "Error en la peticion delete Cursos" });

         if (!CursosB)
              return res.status(500).send({ mensaje: "Error en la consulta de Eliminar Cursos o No tienes datos " });

         if (CursosB.Profesor != req.user.sub)

              return res.status(500).send({ mensaje: "No se puede Eliminar un curso ageno" });

         Curso.update({ CursoMaestro: iDCurso }, { $set: { nombre: "defult(Curso Eliminado)" } }, { multi: true }).exec((err, Cursoactualizado) => {
              if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
              if (!Cursoactualizado) return res.status(500).send({ mensaje: "No se ha podido eliminar CUrsos" });

              if (Cursoactualizado) {

                   Curso.findByIdAndDelete(iDCurso, (err, CursoEliminado) => {
                        if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
                        if (!Cursoactualizado) return res.status(500).send({ mensaje: "No se ha podido eliminar el Curso" });

                        if (Cursoactualizado) {

                             return res.status(200).send({ mensaje:'El curso se ha eliminado' });

                        }

                   })

              }

         })


    })


}


module.exports = {
    ingresarCurso,
    asignarCurso,
    obtenerCurso,
    editarCurso,
    EliminarCurso

}