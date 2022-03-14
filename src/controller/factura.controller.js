const Factura = require("../models/factura.models");
const Usuario = require("../models/usuario.models");
const Carrito = require("../models/carrito.models");
const Producto = require("../models/producto.models");


function agregarFactura(req,res){
    var userId = req.user.sub;
    var modeloFactura = new Factura();

    Carrito.findOne({usuario: userId},(err, carritoEncontrado)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar su carrito"});
        }else if(carritoEncontrado){
            if(carritoEncontrado.products != ""){
                let cantidad = carritoEncontrado.stock;
                let producto = carritoEncontrado.producto;
                let i = 0;
                let j = 0;
                producto.forEach(element =>{
                    Producto.findOne({_id:element},(err, productoEncontrado)=>{
                        if(err){
                            res.status(500).send({message: "Error al buscar producto"})
                        }else if(productoEncontrado){
                            const stockP = productoEncontrado.stock;
                            if(stockP<cantidad[i]){
                                i++;
                                return res.send({message: "Cantidad de carrito (stock) ahora no es válida"});
                            }else{
                                i++;
                            }
                        }else{
                        res.status(403).send({message: "No se encontró el producto"});
                        }
                    })
                })
                producto.forEach(element =>{
                    Producto.findOne({_id:element},(err, productoEncontrado)=>{
                        if(err){
                            res.status(500).send({message: "Error al buscar producto"})
                        }else if(productoEncontrado){
                            let stockP = productoEncontrado.stock;
                            let stockT = stockP - cantidad[j];
                            j++;
                            Producto.findByIdAndUpdate(element, {stock:stockT},{new:true},(err, stockActualisado)=>{
                                if(err){
                                    res.status(500).send({message: "Error al actualizar stock"});
                                }else if(stockActualisado){
                                    console.log("El stock del producto se actualizó exitosamente");
                                }else{
                                    res.status(500).send({message: "No se actualizó"});
                                }
                            })
                        }else{
                        res.status(403).send({message: "No se encontró el producto"});
                        }
                    })
                })

                modeloFactura.nombre = req.user.nombre;
                modeloFactura.productos = producto;
                modeloFactura.save((err, facturaGuardado)=>{
                    if(err){
                        return res.status(500).send({message: "Error al guardar factura"});
                    }else if(facturaGuardado){
                        Usuario.findByIdAndUpdate(userId,{$push:{facturas: facturaGuardado._id}},{new:true},(err, usuarioActualizado)=>{
                            if(err){
                                return res.status(500).send({message: "Error al conectar factura con usuario"});
                            }else if(usuarioActualizado){
                                Carrito.findOneAndRemove({usuario: userId},(err, quitarCarrito)=>{
                                    if(err){
                                        return res.status(500).send({message: "Error al eliminar carrito"});
                                    }else if(quitarCarrito){
                                        const modeloCarrito = new Carrito();
                                        modeloCarrito.usuario = req.user.sub;
                                        modeloCarrito.save((err, carritoGuardado)=>{
                                            if(err){
                                                return res.status(500).send({message: "Error al limpiar carrito"});
                                            }else if(carritoGuardado){
                                                return res.send({carrito: facturaGuardado});
                                            }else{
                                                return res.status(404).send({message: "No se limpió el carrito"});
                                            }
                                        })
                                    }else{
                                        return res.status(404).send({message: "Carrito no existente"});
                                    }
                                })
                            }else{
                                return res.status(404).send({message: "No se conectó la factura con el usuario"});
                            }
                        })
                    }else{
                        return res.status(404).send({message: "Factura no creada"});
                    }
                })
            }else{
                return res.status(403).send({message: "No tiene productos en su carrito"});
            }
        }else{
            return res.status(403).send({message: "No se encontró su carrito"});
        }
    })
}

function obtenerFacturas(req,res){
    var usuarioID = req.user.sub;
    var facturas = Usuario.facturaEncontrada;
    if(req.user.rol == "ADMIN"){
        Factura.find({}).exec((err, facturaEncontrada)=>{
            if(err){
                return res.status(500).send({message: "Error al obtener facturas"});
            }else if(facturaEncontrada){
                return res.send({facturas: facturaEncontrada});
            }else{
                return res.status(403).send({message: "no existen facturas actualmente"});
            }
        })
    }else{
        Usuario.findOne({_id : usuarioID}).populate("facturaEncontrada").exec((err, usuario)=>{
            if(err){
                console.log(err);
                return res.status(500).send({message: "error al obtener las facturas"});
            }else if(usuario){
                return res.send({message: "Facturas: ", facturas});
            }
        })
    }
}

function obtenerProductoFactura(req,res){
    var FacturaId = req.params.id;
    var productos = Factura.productos;
    Factura.findById({_id: FacturaId}).populate("productos").exec((err, facturaEncontrada)=>{
        if(err){
            return res.status(500).send({message: "error al buscar factura"});
        }else if(facturaEncontrada){
            return res.send({facturas : facturaEncontrada});
        }else{
            return res.status(403).send({message: "error al encontrar la factura"});
        }
    })
}


module.exports = {
    agregarFactura,
    obtenerFacturas,
    obtenerProductoFactura
}