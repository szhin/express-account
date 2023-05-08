// external imports
const mongoose = require('mongoose');

async function connect() {
    // use mongoose to connect this app to our database on mongoDB using the DB_URL (connection string)
    mongoose
        .connect(process.env.REACT_APP_DATABASE, {
            //   these are options to ensure that the connection is done properly
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('Successfully connected to MongoDB Atlas!');
        })
        .catch((error) => {
            console.log('Unable to connect to MongoDB Atlas!');
            console.error(error);
        });
}

module.exports = { connect };
