const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const http = require('http');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

dotenv.config();

const db = require('./src/config/db');
const route = require('./src/routes');
const auth = require('./auth');
const User = require('./src/app/models/User');

const app = express();

const port = process.env.REACT_APP_PORT || 8080;
const server = http.createServer(app);

// app.use(express.static(path.join(__dirname, 'src/public')));

app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Template engine
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
    }),
);
app.set('view engine', '.hbs');
// Set path for rendering views page
app.set('views', path.join(__dirname, 'src', 'resources', 'views'));
app.use(function (req, res, next) {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
});

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    );
    next();
});

route(app);

// db.connect();

// // register endpoint
// app.post('/register', (req, res) => {
//     // hash the password
//     bcrypt
//         .hash(req.body.password, 10)
//         .then((hashedPassword) => {
//             // create a new user instance and collect the data
//             const user = new User({
//                 firstName: req.body.firstName,
//                 lastName: req.body.lastName,
//                 email: req.body.email,
//                 phone: req.body.phone,
//                 country: req.body.country,
//                 username: req.body.username,
//                 image: req.body.image,
//                 password: hashedPassword,
//             });
//             // save the new user
//             user.save()
//                 // return success if the new user is added to the database successfully
//                 .then((result) => {
//                     res.status(201).send({
//                         message: 'User Created Successfully',
//                         result,
//                     });
//                 })
//                 // catch error if the new user wasn't added successfully to the database
//                 .catch((error) => {
//                     res.status(500).send({
//                         message: 'Error creating user',
//                         error,
//                     });
//                 });
//         })
//         // catch error if the password hash isn't successful
//         .catch((e) => {
//             res.status(500).send({
//                 message: 'Password was not hashed successfully',
//                 e,
//             });
//         });
// });

// // login endpoint
// app.post('/login', (req, res) => {
//     // check if email exists
//     User.findOne({ email: req.body.email })

//         // if email exists
//         .then((user) => {
//             // compare the password entered and the hashed password found
//             bcrypt
//                 .compare(req.body.password, user.password)

//                 // if the passwords match
//                 .then((passwordCheck) => {
//                     // check if password matches
//                     if (!passwordCheck) {
//                         return res.status(400).send({
//                             message: 'Passwords does not match',
//                             error,
//                         });
//                     }

//                     //   create JWT token
//                     const token = jwt.sign(
//                         {
//                             userId: user._id,
//                             userEmail: user.email,
//                         },
//                         'RANDOM-TOKEN',
//                         { expiresIn: '24h' },
//                     );

//                     //   return success res
//                     res.status(200).send({
//                         message: 'Login Successful',
//                         email: user.email,
//                         token,
//                     });
//                 })
//                 // catch error if password does not match
//                 .catch((error) => {
//                     res.status(400).send({
//                         message: 'Passwords does not match',
//                         error,
//                     });
//                 });
//         })
//         // catch error if email does not exist
//         .catch((e) => {
//             res.status(404).send({
//                 message: 'Email not found',
//                 e,
//             });
//         });
// });

// // free endpoint
// app.get('/free-endpoint', (req, res) => {
//     res.json({ message: 'You are free to access me anytime' });
// });

// // authentication endpoint
// app.get('/auth-endpoint', auth, (req, res) => {
//     res.json({ message: 'You are authorized to access me' });
// });

// // home page
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// app.listen(port, () => {
//     console.log(`Server is listening on http://localhost:${port}`);
// });

mongoose
    .connect(process.env.REACT_APP_DATABASE)
    .then(() => {
        console.log('Mongodb connected');
        server.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.log({ err });
        process.exit(1);
    });
