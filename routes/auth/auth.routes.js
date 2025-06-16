const express = require('express');
const Router = express.Router();
const register = require('../../controllers/auth/register.controller')
const login = require('../../controllers/auth/login.controller')


Router.post('/register', register);
Router.post('/login',login);
module.exports = Router;