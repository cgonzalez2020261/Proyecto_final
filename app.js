const express = require('express');
const app = express();
const cors = require('cors');

//rutas


app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());

app.use('/api', );

modelo.exports = app;