const { Console } = require('console');
const { default: mongoose } = require('mongoose');
const mongooose = require('mongoose');
const app = require('./app');

const {registratAdmin} = require ('./registrat/admin');

mongoose.Promise =  global.Promise;
mongooose.connect('mongodb://localhost:27017//VentaOnline', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('se a conectado correctamente a la base de datos venta online');

    app.listen(3000, function () {
        console.log('servidor de expres corriendo correctamente en el puerto 3000')
    })
}).catch(error => console.log('error'));

