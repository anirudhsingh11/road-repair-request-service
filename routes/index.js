var express = require('express');
var router = express.Router();

var request_controller = require('../controllers/requestController');
var user_controller = require('../controllers/userController');

//Display Login Form GET
router.get('/', user_controller.user_login_get);

//Handle Login Form POST
router.post('/login', user_controller.user_login_post);

//Display Signup Form GET
router.get('/signup', user_controller.user_create_get);

//Handle Signup Form POST
router.post('/signup', user_controller.user_create_post);

module.exports = router;