const express = require('express');
const router = express.Router();

const auth = require('../auth/auth');
const userController = require('../app/controllers/UserController');

const session = require('express-session');
const flash = require('connect-flash');

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

router.use(
    session({
        secret: 'YOUR-SECRET-KEY',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    }),
);

router.use(flash());

router.get('/renderRegister', userController.renderRegister);
router.post('/register', upload.single('image'), userController.register);
router.get('/renderLogin', userController.renderLogin);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/auth-endpoint', auth, userController.authEndpoint);
router.get('/yourAccount', userController.yourAccount);
router.get('/free-endpoint', userController.freeEndpoint);
router.get('/', userController.index);

module.exports = router;
