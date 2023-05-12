const express = require('express');
const router = express.Router();
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

// Serve static files from the 'src/public/uploads' directory
router.use(express.static(__dirname + '/src/public/uploads'));

// Allow access to the 'src/public/uploads' directory
router.use('/src/public/uploads', express.static('src/public/uploads'));

// Set the 'immutable' option to 'true' for the static middleware to allow write access
router.use(
    '/src/public/uploads',
    express.static('src/public/uploads', { immutable: true }),
);

const upload = multer({ storage: storage });

router.use(
    session({
        secret: process.env.REACT_APP_SECRET,
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.REACT_APP_DATABASE,
        }),
        cookie: { secure: false }, // Đặt thành true nếu triển khai trên môi trường HTTPS
    }),
);

router.use(flash());

router.get('/renderRegister', userController.renderRegister);
router.post('/register', upload.single('image'), userController.register);
router.get('/renderLogin/', userController.renderLogin);
router.post('/login/', userController.login);
router.post('/logout', userController.logout);
router.get('/info', userController.info);
router.get('/auth-endpoint', auth, userController.authEndpoint);
router.get('/yourAccount', userController.yourAccount);
router.get('/free-endpoint', userController.freeEndpoint);
router.get('/', userController.index);

module.exports = router;
