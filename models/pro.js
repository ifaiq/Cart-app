var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    image: {type: String, required: true},
    title: {type: String, required: true},
    pro: {type: String},
    description: {type: String, required: true},
    price: {type: Number, required: true}
});

module.exports = mongoose.model('Product', schema);