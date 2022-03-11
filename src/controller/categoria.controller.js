const Categoria = require('../models/categoria.models');

function crearCategoria(req,res){
    var parametros = req.body;
    const modeloCategoria = new Categoria();
    
    if(parametros.nombre){
        Categoria.findOne({nombre: parametros.nombre},(err, categoriaEncontrada)=>{
            if(err){
                return res.status(500).send({message: "error en la busqueda"});
            }else if(categoriaEncontrada){
                return res.send({message: "la categoria ya existe"});
            }else{
                modeloCategoria.nombre = parametros.nombre;
                modeloCategoria.save((err, categoriaGuardada)=>{
                    if(err){
                        return res.status(500).send({message: "Error al agregar"});
                    }else if(categoriaGuardada){
                        return res.send({categoria: categoriaGuardada});
                    }else{
                        return res.status(404).send({message: "No se guardo se guardo la categoria"});
                    }
                })
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese los datos mínimos (Nombre)"})
    }
}

function categoriaporDefecto(){
    var nombre = "Default"
    const modeloCategoria = new Categoria();
    Categoria.findOne({nombre: nombre},(err, categoriaEncontrada)=>{
        if(err){
            console.log("Error al encontrar la categoria default",err);
        }else if(categoriaEncontrada){
            console.log("la categoria por default ya existente");
        }else{
            modeloCategoria.nombre = "Default";
            modeloCategoria.save((err, categoriaGuardada)=>{
                if(err){
                    console.log("Error al agregar");
                }else if(categoriaGuardada){
                    console.log("Categoría default creada");
                }else{
                    console.log("error al crear la categoria");
                }
            })
        }
    })
}

function ActualizarCategoria(req,res){
    const categoriaId = req.params.id;
    const parametros = req.body;

    if(parametros.nombre){
        Categoria.findOne({nombre: parametros.nombre},(err, categoriaEncontrada)=>{
            if(err){
                return res.status(500).send({message: "error al buscar"});
            }else if(categoriaEncontrada){
                return res.send({message: "la categoria ya existe"});
            }else{
                Categoria.findByIdAndUpdate(categoriaId, parametros, {new:true}, (err, categoriaActualizada)=>{
                    if(err){
                        return res.status(500).send({message: "Error al actualizar"});
                    }else if(categoriaActualizada){
                        return res.send({categoria: categoriaActualizada});
                    }else{
                        return res.status(500).send({message: "no se pudo actualizar la categoria"});
                    }
                })
            }
        })
    }else{
        return res.status(403).send({message: "ingrese los campos obligatorios (nuevo nombre de la categoria)"});
    }
}

function eliminarCategoria(req,res){
    const categoriaId = req.params.id;
    

    Categoria.findOne({_id : categoriaId}, (err, categoriaEncontrada)=>{
        if(err){
            return res.status(500).send({message: "error al buscar"});
        }else if(categoriaEncontrada){
            var productos = categoriaEncontrada.productos;
            Categoria.findOneAndUpdate({nombre: "Default"},{$push:{productos: productos}}, {new: true},(err, categoriaActualizada)=>{
                if(err){
                    return res.status(500).send({message: "error en la actualizacion de la clase default"});
                }else if(categoriaActualizada){
                   
                    Categoria.findOne({_id : categoriaId},(err, categoriaEncontrada)=>{
                        if(err){
                            return res.status(500).send({message: "error al buscar"});
                        }else if(categoriaEncontrada){
                            Categoria.findByIdAndRemove(categoriaId,(err, categoriaEliminada)=>{
                                if(err){
                                    return res.status(500).send({message: "no se pudo eliminar"});
                                }else if(categoriaEliminada){
                                    return res.send({categoria: categoriaEliminada});
                                }else{
                                    return res.status(404).send({message: "no se pudo eliminar"});
                                }
                            })
                        }else{
                            return res.status(403).send({message: "esta categoria no existe :v"});
                        }
                    })
                }else{
                    return res.status(404).send({message: "error en la actualizacion owo"});
                }
            })
        }else{
            return res.status(403).send({message: "esta categoria no existe :v"});
        }
    })
}

function verCategorias(req,res){
    Categoria.find({}).populate("productos").exec((err, TdoCategorias)=>{
        if(err){
            return res.status(500).send({message: "Error al obtener los datos"});
        }else if(TdoCategorias){
            return res.send({message: " Todas las categorias:", TdoCategorias});
        }else{
            return res.status(403).send({message: "No hay datos"});
        }
    })
}

function buscarCategorias(req,res){
    var parametros = req.body;

    if(parametros.search){
        Categoria.find({nombre: parametros.search},(err, categoriaEncontrada)=>{
            if(err){
                return res.status(500).send({message: "error al buscar categoria"});
            }else if(categoriaEncontrada){
                if(categoriaEncontrada != ""){
                    return res.send({message: "Coinciencias encontradas: ", categoriaEncontrada});
                }else{
                    return res.status(404).send({message: "no se encontraron coincidencias"});
                }
            }else{
                return res.status(404).send({message: "No se encontraron coincidencias owo"});
            }
        })
    }else if(parametros.search == ""){
        Categoria.find({}).exec((err, Categorias)=>{
            if(err){
                return res.status(500).send({message: "error al obtener las categorias"});
            }else if(Categorias){
                return res.send({categorias: Categorias});
            }else{
                return res.status(403).send({message: "No hay cateogiras disponibles"});
            }
        })
    }else{
        return res.status(403).send({message: "debe llenar los parametros obligatorios"});
    }
}

module.exports = {
    crearCategoria,
    categoriaporDefecto,
    ActualizarCategoria,
    eliminarCategoria,
    verCategorias,
    buscarCategorias
}