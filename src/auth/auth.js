const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
    try {
        //   get the token from the authorization header
        console.log(req.headers.authorization);
        const token = req.headers.authorization.split(' ')[1];
        //check if the token matches the supposed origin
        const decodedToken = jwt.verify(token, process.env.REACT_APP_SECRET);

        // retrieve the user details of the logged in user
        const user = decodedToken;

        // pass the user down to the endpoints here
        req.user = user;

        // pass down functionality to the endpoint
        next();
    } catch (error) {
        console.log('huhu');
        res.status(401).json({
            error: new Error('Invalid req!'),
        });
    }
    
};
