const jwt_simple = require('jwt-simple');
const moment = require('moment');
const Clavesecreta = 'clave_secreta';

exports.crearToken = function (usuario) {
    let payload = {
        sub: usuario._id,
        nombre: usuario.nombres,
        email: usuario.email,
        rol: usuario.rol,
        iat: moment().unix(),
        exp: moment().day(7, 'days').unix()
    }

    return jwt_simple.encode(payload, Clavesecreta);
}