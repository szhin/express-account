const express = require('express');
const router = express.Router();

const auth = require('../../auth');
const userController = require('../app/controllers/UserController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/free-endpoint', userController.freeEndpoint);
router.get('/auth-endpoint', auth, userController.authEndpoint);
router.get('/', userController.index);

module.exports = router;
