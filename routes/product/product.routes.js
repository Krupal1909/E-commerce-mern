const express = require('express');
const Router = express.Router();
const {upload} = require('../../middleware/uploads');

const product = require('../../controllers/product/product.controller');

Router.post('/create-product',upload.single("image"), product.CreateProduct);
Router.get('/get-product', product.GetAllProducts);
Router.get('/get-product/:id', product.GetProductById);
Router.put('/update-product/:id', product.UpdateProduct);
Router.delete('/delete-product/:id', product.DeleteProduct);
Router.get('/get-related-product/:categoryId', product.getAllRelatedProducts);
Router.get('/get-products-by-category/:categoryId', product.getProductsByCategory);
module.exports = Router;