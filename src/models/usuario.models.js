const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var usuarioSchema = Schema ({
    nombres: String,
    apellidos: String,
    nombre_usuario: String,
    password: String,
    rol: String,
    correo: String,
    bills: [{type: Schema.ObjectId, ref: "facturas"}]
})

module.exports = mongoose.model("Usuarios", usuarioSchema);