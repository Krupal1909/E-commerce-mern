const express = require('express');
const Router = express.Router();
const cart = require('../../controllers/cart/cart.controller');

Router.post('/add-to-cart', cart.addToCart);
Router.get('/get-cart', cart.getCartItems);
Router.put('/update-cart/:id', cart.updateCartItem);
Router.delete('/delete-cart/:id', cart.deleteCartItem);


module.exports = Router;