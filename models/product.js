let mongoose = require('mongoose');

//Create model of product
let productModel = mongoose.Schema(
    {
        "name": String,
        "company": String,
        "price": Number
    },
    {
        collection: "product"
    }
);

module.exports = mongoose.model('Product', productModel);