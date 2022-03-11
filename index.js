const mongoose = require('mongoose');
const app = require('./app');
const {RegistrarAdmin} = require ('./src/controller/usuario.controller')
const {categoriaporDefecto} = require('./src/controller/categoria.controller')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/VentaOnline', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('se a conectado correctamente a la base de datos');

    app.listen(3000, function(){
        console.log('servidor de expres corriendo correctamente en el puerto 3000')
    })

}).catch(error => console.log(error));

RegistrarAdmin();
categoriaporDefecto();