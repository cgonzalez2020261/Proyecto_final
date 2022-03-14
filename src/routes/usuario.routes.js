const express = require('express');
const controladorEntidad = require('../controller/usuario.controller');


const md_autenticacion = require('../middleware/autenticacion');

const api = express.Router();

api.post("/agregarUsuario", md_autenticacion.Auth, controladorEntidad.registrarUsuario);
api.post('/Login', controladorEntidad.Login);
api.delete("/eliminarusuario/:id", md_autenticacion.Auth, controladorEntidad.eliminarUsuario);

module.exports = api;