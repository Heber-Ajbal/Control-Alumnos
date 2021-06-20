'use stritc'

var Maestro = require("../modelos/maestro.modelo");
var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");




function Mdefault(req, res) {
    var maestroModel = new Maestro();

    if (maestroModel.nombre != 'MAESTRO') {

        maestroModel.nombre = 'MAESTRO';
        maestroModel.rol = 'ROL_MAESTRO';
        maestroModel.password = '123456'

        Maestro.find({

            $or: [
                { nombre: maestroModel.nombre }

            ]

        }).exec((err, adminoEncontrado) => {
            if (err) return console.log({ mensaje: "error en la peticion del admin" });
            if (adminoEncontrado.length >= 1) {
                return console.log("El MAESTRO ya se creo! ");
            } else {
                bcrypt.hash("123456", null, null, (err, passwordEncriptada) => {
                    maestroModel.password = passwordEncriptada;
    
                    maestroModel.save((err, usuarioguardado) => {
                        if (err) return console.log({ mensaje: "Error en la peticion Usuario" });
    
                        if (usuarioguardado) {
                            console.log("Maestro Creado!")
    
                        } else {
                            console.log({ mensaje: "Error al crear el Maestro" })
    
    
                        }
    
                    })
                })
            }
        })


    }





}

function registrar(req, res) {
    var maestroModel = new Maestro();
    var params = req.body;

    if (params.nombre) {
        maestroModel.nombre = params.nombre;
        maestroModel.rol = ' ROL_MAESTRO';

        Maestro.find({

            $or: [
                { nombre: maestroModel.nombre }

            ]

        }).exec((err, maestroEncontrados) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion de maestro' })

            if (maestroEncontrados && maestroEncontrados.length >= 1) {
                return res.status(500).send({ mensaje: 'El usuario ya existe' })

            } else {
                bcrypt.hash(params.password, null, null, (err, passwordEncriptada) => {

                    maestroModel.password = passwordEncriptada;

                    maestroModel.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de guardar usuario' });

                        if (usuarioGuardado) {
                            res.status(200).send({ usuarioGuardado })
                        } else {
                            res.status(404).send({ mensaje: 'no se ha podido resgistrar el usuario' });

                        }

                    })

                })

            }
        })


    }


}

function login(req, res) {
    var params = req.body;

    Maestro.findOne({ nombre: params.nombre }, (err, maestroEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });

        if (maestroEncontrado) {
            bcrypt.compare(params.password, maestroEncontrado.password, (err, passVerificada) => {
                if (passVerificada) {
                    if (params.getToken === 'true') {
                        return res.status(200).send({
                            token: jwt.createToken(maestroEncontrado)
                        })

                    } else {
                        maestroEncontrado.password = undefined;
                        return res.status(200).send({ maestroEncontrado });
                    }
                } else {
                    return res.status(500).send({ mensaje: 'El usuario no se a podido indentificar' })
                }

            })
        }  else {
            return res.status(500).send({ mensaje: 'Error al buscar el Usuario' })
        }
    })
}




module.exports = {
    registrar,
   
    Mdefault,
    login
}