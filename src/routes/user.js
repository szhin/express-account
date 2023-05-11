const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const auth = require('../auth/auth');
const userController = require('../app/controllers/UserController');

const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');

const multer = require('multer');
const path = require('path');
dotenv.config();

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
        // secret: process.env.REACT_APP_SECRET,
        secret: "TOKEN SECRET SZHIN KEY",
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.REACT_APP_DATABASE,
        }),
        cookie: { secure: true }, // Đặt thành true nếu triển khai trên môi trường HTTPS
    }),
);

router.use(flash());

router.get('/renderRegister', userController.renderRegister);
router.post('/register', upload.single('image'), userController.register);
router.get('/renderLogin', userController.renderLogin);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/info', userController.info);
router.get('/auth-endpoint', auth, userController.authEndpoint);
router.get('/yourAccount', userController.yourAccount);
router.get('/free-endpoint', userController.freeEndpoint);
router.get('/', userController.index);

module.exports = router;
