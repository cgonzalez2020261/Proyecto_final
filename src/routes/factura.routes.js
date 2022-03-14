const express = require("express");
const controladorFactura = require("../controller/factura.controller");


const md_autenticacion = require("../middleware/autenticacion");
const api = express.Router();

api.put("/agregarFactura", md_autenticacion.Auth, controladorFactura.agregarFactura);
api.get("/obtenerFactura", md_autenticacion.Auth, controladorFactura.obtenerFacturas);
api.get("/productosDeFactura/:id", md_autenticacion.Auth, controladorFactura.obtenerProductoFactura);

module.exports = api;