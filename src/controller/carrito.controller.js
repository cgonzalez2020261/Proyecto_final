const Carrito = require("../models/carrito.models");
const Producto = require("../models/producto.models");

function agregarCarrito(req,res){
    var productoId = req.params.id;
    var parametros = req.body;
    var usuarioId = req.user.sub;

    if(parametros.stock){
        Producto.findById(productoId, (err, productoEncontrado)=>{
            if(err){
                return res.status(500).send({message: "error en la peticion"});
            }else if(productoEncontrado){
                if(parametros.stock > productoEncontrado.stock){
                    return res.status(403).send({message: "no existen suficientes productos para que los agrege"});
                }else{
                    Carrito.findOneAndUpdate({ usuario: usuarioId}, {$push:{producto: productoEncontrado._id, stock:parametros.stock}},{new:true},(err, carritoActualizado)=>{
                        if(err){
                            console.log(productoEncontrado);
                            return res.status(500).send({message: "error al agregar el producto a su carrito :3 "});
                        }else if(carritoActualizado){
                            return res.send({carritos: carritoActualizado});
                        }else{
                            return res.status(404).send({message: "error al enconrar el carrito"});
                        }
                    })
                }
            }else{
                return res.status(403).send({message: "productos sin existencia"});
            }
        })
    }else{
        return res.status(403).send({message: "debe llenar los parametros obligarotios"});
    }
}

module.exports = {
    agregarCarrito
}