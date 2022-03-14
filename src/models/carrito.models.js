var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var caritoSchema = ({
    compra: Boolean,
    usuario: {type: Schema.ObjectId, ref:"Usuarios"},
    producto: [{type: Schema.ObjectId, ref:"Productos"}],
    stock: [Number]
})

module.exports = mongoose.model("Caritos", caritoSchema);