const express = require('express');
const Router = express.Router();
const {upload} = require('../../middleware/uploads');
const category = require('../../controllers/category/category.controller');

Router.post('/create-category', upload.single("image"), category.createCategory);
Router.get('/get-category', category.getAllCategory);
Router.get('/get-category/:id', category.getCategoryById);
Router.put('/update-category/:id', category.updateCategory);          
Router.delete('/delete-category/:id', category.deleteCategory);

module.exports = Router;