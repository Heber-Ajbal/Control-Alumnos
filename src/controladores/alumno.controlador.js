'use strict'

var Alumno = require("../modelos/alumno.modelo");
var Cursos = require("../modelos/curso.modelo");

var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");

function registrar(req, res) {
    var alumnoModel = new Alumno();
    var params = req.body;

    if (params.nombre && params.password) {
        alumnoModel.nombre = params.nombre;
        alumnoModel.rol = 'ROL_ALUMNO';

        Alumno.find({

            $or: [
                { nombre: alumnoModel.nombre }
            ]

        }).exec((err, AlumnoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion del Alumno' });

            if (AlumnoEncontrado && AlumnoEncontrado.length >= 1) {
                return res.status(500).send({ mensaje: 'El Alumno ya existe' })
            } else {
                bcrypt.hash(params.password, null, null, (err, passwordEncriptada) => {

                    alumnoModel.password = passwordEncriptada;

                    alumnoModel.save((err, alumnoGuardado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de guardar Alumno' });

                        if (alumnoGuardado) {
                            res.status(200).send({ alumnoGuardado })
                        } else {
                            res.status(404).send({ mensaje: 'no se ha podido Registrar' })
                        }
                    })

                })
            }
        })
    }
}

function login(req, res) {
    var params = req.body;

    Alumno.findOne({ nombre: params.nombre }, (err, AlumnoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });

        if (AlumnoEncontrado) {
            bcrypt.compare(params.password, AlumnoEncontrado.password, (err, passVerificada) => {
                if (passVerificada) {
                    if (params.getToken === 'true') {
                        return res.status(200).send({
                            token: jwt.createToken(AlumnoEncontrado)
                        })

                    } else {
                        AlumnoEncontrado.password = undefined;
                        return res.status(200).send({ AlumnoEncontrado });
                    }
                } else {
                    return res.status(500).send({ mensaje: 'El Alumno no se a podido indentificar' })
                }

            })
        } else {
            return res.status(500).send({ mensaje: 'Error al buscar el Alumno' })
        }
    })
}

function editarAlumno(req, res) {
    var idAlumno = req.params.id;
    var params = req.body;

    delete params.password;

    if (req.user.rol === "ROL_MAESTRO") {

        if (req.user.rol === "ROL_MAESTRO" && idAlumno != req.user.sub) {
            return res.status(500).send({ mensaje: "Un maestro no puede editar Alumnos" })

        }

        if (req.user.rol === "ROL_MAESTRO") {
            return res.status(500).send({ mensaje: "Un maestro no puede editar su Alumno, si desea alguna modificacion comuniquese con el administrador" })
        }

    }

    if (idAlumno != req.user.sub) {
        return res.status(500).send({ mensaje: "no se puede modificar otro Alumno " });



    }
    Alumno.findByIdAndUpdate(idAlumno, params, { new: true }, (err, Alumnoactualizado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
        if (!Alumnoactualizado) return res.status(500).send({ mensaje: "No se ha podido editar el Alumno" });

        return res.status(200).send({ Alumnoactualizado });


    }
    )

}

function eliminarAlumno(req, res) {
    var idAlumno = req.params.id;
    var params = req.body;

    if (req.user.rol === "ROL_MAESTRO") {


        if (req.user.rol === "ROL_MAESTRO" && idAlumno != req.user.sub) {
            return res.status(500).send({ mensaje: "Un maestro no puede Eliminar Alumnos" })

        }

        if (req.user.rol === "ROL_MAESTRO") {
            return res.status(500).send({ mensaje: "Un maestro no puede Eliminar su Alumno, si desea alguna modificacion comuniquese con el administrador" })
        }

    }

    if (idAlumno != req.user.sub) {
        return res.status(500).send({ mensaje: "no se puede Eliminar otro Alumno " });

    }


    Cursos.deleteMany({ alumno: req.user.sub }).exec((err, Alumnoactualizado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
        if (!Alumnoactualizado) return res.status(500).send({ mensaje: "No se ha podido Eliminar el Alumnoo" });


        Alumno.findByIdAndDelete(idAlumno, (err, AlumnoEliminado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!Alumnoactualizado) return res.status(500).send({ mensaje: "No se ha podido Eliminar el Alumnoo" });


            return res.status(200).send({ mensaje: 'El ALUMNO SE HA ELIMINADO' });


        }
        )


    }
    )
}


module.exports = {

    registrar,
    login,
    editarAlumno,
    eliminarAlumno

}