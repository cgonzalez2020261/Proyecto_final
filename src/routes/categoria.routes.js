const express = require('express');
const controladorCategoria = require('../controller/categoria.controller');


const md_autenticacion = require('../middleware/autenticacion');

const api = express.Router();

api.post("/agregarcategoria", md_autenticacion.Auth, controladorCategoria.crearCategoria);
api.put("/editarcategoria/:id", md_autenticacion.Auth, controladorCategoria.ActualizarCategoria);
api.delete("/eliminarCategoria/:id", md_autenticacion.Auth, controladorCategoria.eliminarCategoria);
api.get("/verCategorias", md_autenticacion.Auth, controladorCategoria.verCategorias);
api.get("/buscarCategorias", md_autenticacion.Auth, controladorCategoria.buscarCategorias);

module.exports = api;