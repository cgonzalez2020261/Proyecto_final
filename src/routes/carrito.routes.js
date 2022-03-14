var express = require('express');

var carritoController = require('../controller/carrito.controller');
var api = express.Router();
var md_autenticacion = require('../middleware/autenticacion');

api.put('/agregarCarrito/:id', md_autenticacion.Auth, carritoController.agregarCarrito);

module.exports = api;