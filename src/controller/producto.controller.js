var Producto = require("../models/producto.models");
var Categoria = require("../models/categoria.models");

function agregarProductos(req,res){
    var categoriaId = req.params.idcat;
    var parametros = req.body;

    if(parametros.nombre && parametros.precio && parametros.stock){
        Categoria.findById(categoriaId, (err, categoriaEncontrada)=>{
            if(err){return res.status(500).send({message: "error en la peticion"});
            }else if(categoriaEncontrada){
                Producto.findOne({nombre: parametros.nombre},(err, productoEncontrado)=>{
                    if(err){
                        return res.status(500).send({message: "error al enconrtar"});
                    }else if(productoEncontrado){
                        return res.send({message: "Producto ya existente"});
                    }else{
                        var Modeloproducto = new Producto();
                        Modeloproducto.nombre = parametros.nombre;
                        Modeloproducto.precio = parametros.precio;
                        Modeloproducto.stock = parametros.stock;
                        Modeloproducto.save((err, productoGuardado)=>{
                            if(err){
                                return res.status(500).send({message: "Error al agregar el producto"});
                            }else if(productoGuardado){
                                Categoria.findByIdAndUpdate(categoriaId,{$push:{productos: productoGuardado._id}},{new: true},(err, categoriaActualizada)=>{
                                    if(err){
                                        return res.status(500).send({message: "Error al agregar producto a categoría"});
                                    }else if(categoriaActualizada){
                                        return res.send({categoria: categoriaActualizada});
                                    }else{
                                        return res.status(404).send({message: "No se agregó el producto a categoría"});
                                    }
                                })
                            }else{
                                return res.status(404).send({message: "producto no usuarioGuardado"});
                            }
                        })
                    }
                })
            }else{
                return res.status(403).send({message: "Categoría inexistente"});
            }
        })
    }else{
        return res.status(403).send({message: "debe llenar los parametros obligatoriso"});
    }
}

function actualizarProducto(req,res){
    let categoriaId = req.params.idcat;
    let productoId = req.params.idP;
    let actualizar = req.body;

    if(actualizar.stock){
        Producto.findById(productoId,(err, productoEncontrado)=>{
            if(err){
                return res.status(500).send({message: "error en la peticion"});
            }else if(productoEncontrado){
                Categoria.findOne({_id:categoriaId,productos:productoId},(err,categoriaEncontrada)=>{
                    if(err){
                        return res.status(500).send({message: "Error al buscar categoría"});
                    }else if(categoriaEncontrada){
                        Producto.findByIdAndUpdate(productoId, actualizar, {new:true}, (err, productoActualizado)=>{
                            if(err){
                                return res.status(500).send({message: "Error al actualizar producto"});
                            }else if(productoActualizado){
                                return res.send({producto: productoActualizado});
                            }else{
                                return res.status(404).send({message: "No se actualizó el producto :c"});
                            }
                        })
                    }else{
                        return res.status(403).send({message: "el Id de categoría no existe"});
                    }
                })
            }else{
                return res.status(403).send({message: "el Id de producto no existe"});
            }
        })
    }else{
        return res.status(403).send({message: "debe llenar los parametros obligatorios"});
    }
}

function eliminarProducto(req,res){
    let categoriaId = req.params.idcat;
    let productoId = req.params.idP;

    Categoria.findOneAndUpdate({_id:categoriaId,productos:productoId},{$pull:{productos:productoId}},{new:true},(err,categoriaActualizada)=>{
        if(err){
            return res.status(500).send({message: "Error al eliminar producto"});
        }else if(categoriaActualizada){
            Producto.findByIdAndRemove(productoId,(err, productoEliminado)=>{
                if(err){
                    return res.status(500).send({message: "Error al eliminar producto"});
                }else if(productoEliminado){
                    return res.send({message: "Producto eliminado exitosamente", productoEliminado});
                }else{
                    return res.status(403).send({message: "error al eliminar el productoActualizado"});
                }
            })
        }else{
            return res.status(404).send({message: "este producto no existe"});
        }
    })
}

function obtenerProducto(req,res){
    Producto.find({}).exec((err, productosEncontrados)=>{
        if(err){
            return res.status(500).send({message: "Error al encontrar los productos"});
        }else if(productosEncontrados){
            return res.send({message: "Productos: ", productosEncontrados});
        }else{
            return res.status(403).send({message: "No se encontraron productos"});
        }
    })
}

function buscarProducto(req,res){
    var parametros = req.body;

    if(parametros.search){
        Producto.find({nombre: parametros.search},(err, resultado)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar coincidencias"});
            }else if(resultado){
                return res.send({producto: resultado});
            }else{
                return res.status(403).send({message: "No se encontraron coincidencias"});
            }
        })
    }else if(params.search == ""){
        Producto.find({}).exec((err, productos)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar"});
            }else if(productos){
                return res.send({message: "Productos: ",productos});
            }else{
                return res.status(403).send({message: "No se encontraron productos"});
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese el campo de búsqueda (search)"});
    }
}

function productosGastados(req,res){
    Producto.find({stock: 0},(err, resultado)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar productos agotados"});
        }else if(resultado){
            if(resultado != ""){
                return res.send({message: "Productos agotados: ", resultado});
            }else{
                return res.status(404).send({message: "No se encontraron productos agotados"});
            }
        }else{
            return res.status(404).send({message: "No se encontraron productos agotados"});
        }
    })
}

module.exports = {
    agregarProductos,
    actualizarProducto,
    eliminarProducto,
    obtenerProducto,
    buscarProducto,
    productosGastados
}