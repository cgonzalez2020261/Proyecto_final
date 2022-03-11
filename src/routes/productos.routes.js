const express = require('express');
const controladorProduto = require('../controller/producto.controller');


const md_autenticacion = require('../middleware/autenticacion');

const api = express.Router();

api.put("/agregarProducto/:idcat", md_autenticacion.Auth, controladorProduto.agregarProductos);
api.put("/:idcat/actualizarProducto/:idP", md_autenticacion.Auth, controladorProduto.actualizarProducto);
api.put("/:idcat/eliminarProducto/:idP", md_autenticacion.Auth, controladorProduto.eliminarProducto);
api.get("/verProductos", md_autenticacion.Auth, controladorProduto.obtenerProducto);
api.get("/buscarProductos", md_autenticacion.Auth, controladorProduto.buscarProducto);

module.exports = api;