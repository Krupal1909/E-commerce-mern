const express = require('express');
const Router = express.Router();
const register = require('../../controllers/auth/register.controller')
const login = require('../../controllers/auth/login.controller')
const logout = require('../../controllers/auth/logout.controller');

Router.post('/register', register);
Router.post('/login',login);
Router.post('/logout', logout);
module.exports = Router;