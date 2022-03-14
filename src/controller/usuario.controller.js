const  Usuario = require("../models/usuario.models");
const Carrito = require("../models/carrito.models");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../service/jwt");

function RegistrarAdmin(){
    var modeloAdmin = new Usuario();
    

        Usuario.find({ correo : 'adminVenta@kinal.edu.gt'}, (err, correoEncontrado) => {
        if(correoEncontrado.length > 0){
            return console.log('el usuario admin ya existe');
        }else{
            modeloAdmin.nombres = 'Admin';
            modeloAdmin.correo = 'adminVenta@kinal.edu.gt';
            modeloAdmin.password = '123456';
            modeloAdmin.rol = 'ADMIN';

            bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                modeloAdmin.password = passwordEncriptada;
            
                modeloAdmin.save((err, usuarioGuardado) => {
                    if(err) return res.status(500).send({mensaje: 'error en la peticion'});
                    if(!usuarioGuardado) return console.log({mensaje: 'error al gurdar el usuario'});
    
                    return console.log('Administrador:' + ' ' + usuarioGuardado);
                });
            });
                    }
   
        });

}

function Login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ correo : parametros.correo }, (err, entidadEncontrado) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if (entidadEncontrado){
            bcrypt.compare(parametros.password, entidadEncontrado.password, 
                (err, verificacionPassword) => {
                    if (verificacionPassword) {
                        return res.status(200).send({ token: jwt.crearToken(entidadEncontrado) })
                    } else {
                        return res.status(500).send({ mensaje: 'el password no coinciden'})
                    }
                })
        } else {
            return res.status(500).send({ mensaje: 'el usuario no se ha podido identificar'})
        }
    })
}

function registrarUsuario(req,res){
    var usuarioModel =  new Usuario();
    var parametros = req.body;
 
 
         usuarioModel.nombres = parametros.nombres;
         usuarioModel.apellidos = parametros.apellidos;
         usuarioModel.nombre_usuario = parametros.user;
         usuarioModel.correo = parametros.correo;
         usuarioModel.rol = 'ROL_CLIENTE';
         usuarioModel.password = parametros.password;
     
 
     Usuario.find({nombre_usuario : parametros.user},(err,usuarioEncontrado)=>{
         if(err) return res.status(500).send({message:'error en la peticion'})
         if(usuarioEncontrado.length == 0){
 
             bcrypt.hash(parametros.password,null,null,(err,passwordEncriptada)=>{
 
                 usuarioModel.password = passwordEncriptada;
 
                 usuarioModel.save((err,usuarioGuadado)=>{
                     if(err) return res.status(500).send({message:'error en la peticion'});
 
                     if(!usuarioEncontrado){return res.status(500).send({message:'error al agregar el Usuario'});}else{
                         crearCarrito(usuarioGuadado);
                     } 
 
                     return res.status(200).send({usuario: usuarioGuadado});
                 })
 
             })
         }else{
             return res.status(500).send({message:'el nombre usuario ya se encuentra en uso '})
         }
 
 
     })
 
 }

 function crearCarrito(Usuario){
    var carritoModel = new Carrito();

    carritoModel.compra = false;
    carritoModel.usuario = Usuario._id;
    carritoModel.save((err, carritoGuardado)=>{
        if(err){
            console.log(err);
        }else if(carritoGuardado){
            console.log("Carrito de compras creado exitosamente", carritoGuardado);
        }else{
            console.log("el carrito no se pudo crear");
        }
    })
}


 function cerrarCarrito(user){
    Carrito.findOneAndRemove({usuario: user._id},(err, carritoEliminado)=>{
        if(err){
            console.log("error al eliminar carrito");
        }else if(carritoEliminado){
            console.log("Carrito eliminado exitosamente");
        }
    })
}

function eliminarUsuario(req,res){
    let usuarioId = req.params.id;
    
    if(req.user.rol == "ADMIN"){
        Usuario.findById(usuarioId, (err, usuarioEncontrado)=>{
            if(err){
                return res.status(500).send({message: "error en la peticion"});
            }else if(usuarioEncontrado){
                
                    cerrarCarrito(usuarioEncontrado);
                    Usuario.findByIdAndRemove(usuarioId,(err, usuarioEliminado)=>{
                        if(err){
                            return res.status(500).send({message: "Error al intentar eliminar"});
                        }else if(usuarioEliminado){
                            return res.send({usuario: usuarioEliminado});
                        }
                    })
            }else{
                return res.status(403).send({message: "error al eliminar"});
            }
        })
    }else{
        return res.status(401).send({message: "no tiene los permisos necesarios"});
    }
}

module.exports = {
    RegistrarAdmin,
    Login,
    registrarUsuario,
    cerrarCarrito,
    eliminarUsuario,
    crearCarrito
}
