var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var facturaSchema = ({
    nombre: String,
    productos: [{type: Schema.ObjectId, ref:"Productos"}]
})

module.exports = mongoose.model("facturas", facturaSchema);