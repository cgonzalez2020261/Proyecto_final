const express = require('express');
const app = express();
const cors = require('cors');

const usuarioRutas = require('./src/routes/usuario.routes');
const productoRutas = require('./src/routes/productos.routes');
const categoriasRutas = require('./src/routes/categoria.routes');
const CarritoRutas = require('./src/routes/carrito.routes');
const facturasRutas = require('./src/routes/factura.routes');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());

app.use('/api', usuarioRutas, productoRutas, categoriasRutas, CarritoRutas, facturasRutas);

module.exports = app;