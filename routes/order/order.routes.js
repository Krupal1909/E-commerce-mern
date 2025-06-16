const express = require('express');
const Router = express.Router();
const Order = require('../../controllers/order/order.controller');

Router.post('/create-order', Order.CreateOrder);
Router.get('/get-order', Order.GetAllOrders);
Router.get('/get-order/:id', Order.GetOrderById);
Router.put('/update-order/:id', Order.UpdateOrder);
Router.delete('/delete-order/:id', Order.DeleteOrder);

module.exports = Router;