const express = require('express');
const Router = express.Router();
const userAddress = require('../../controllers/userAddress/userAddress.controller');

Router.post('/add-address', userAddress.addUserAddress);
Router.get('/get-address', userAddress.getUserAddresses);     
Router.put('/update-address/:id', userAddress.updateUserAddress);
Router.delete('/delete-address/:id', userAddress.deleteUserAddress);

module.exports = Router;