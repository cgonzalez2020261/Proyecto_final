var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var caritoSchema = ({
    compra: Boolean,
    dueño: {type: Schema.ObjectId, ref:"Usuarios"},
    producto: [{type: Schema.ObjectId, ref:"Productos"}],
    stock: [Number]
})

module.exports = mongoose.model("Caritos", caritoSchema);