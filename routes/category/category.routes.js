const express = require('express');
const Router = express.Router();
const category = require('../../controllers/category/category.controller');

Router.post('/create-category', category.createCategory);
Router.get('/get-category', category.getAllCategory);
Router.get('/get-category/:id', category.getCategoryById);
Router.put('/update-category/:id', category.updateCategory);          
Router.delete('/delete-category/:id', category.deleteCategory);

module.exports = Router;