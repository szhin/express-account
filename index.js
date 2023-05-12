const express = require('express');
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

const app = express();


const port = process.env.REACT_APP_PORT || 8080;


app.use(cookieParser());

app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(bodyParser.json());
const corsOptions = {
    origin: 'https://szhin.vercel.app',
    allowedHeaders: ['Content-Type'],
    credentials: true,
};
app.use(cors(corsOptions));
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

db.connect();
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

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://szhin.vercel.app');
    next();
});
route(app);

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});