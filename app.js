const express = require('express');
const app = express();
const cors = require('cors');

const usuarioRutas = require('./src/routes/usuario.routes');
const productoRutas = require('./src/routes/productos.routes');
const categoriasRutas = require('./src/routes/categoria.routes');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());

app.use('/api', usuarioRutas, productoRutas, categoriasRutas);

module.exports = app;