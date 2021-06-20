'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta';

exports.createToken = function(maestro){
    var payload = {
        sub: maestro._id,
        nombre: maestro.nombre,
        rol: maestro.rol,
        iat: moment().unix(),
        exp: moment().day(10, 'days').unix()
    }

    return jwt.encode(payload, secret);

}