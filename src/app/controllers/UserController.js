const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { response } = require('express');

class UserController {
    // [POST] register endpoint
    register(req, res, next) {
        // hash the password
        bcrypt
            .hash(req.body.password, 10)
            .then((hashedPassword) => {
                // create a new user instance and collect the data
                const user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phone: req.body.phone,
                    country: req.body.country,
                    username: req.body.username,
                    image: req.body.image,
                    password: hashedPassword,
                });
                // save the new user
                user.save()
                    // return success if the new user is added to the database successfully
                    .then((result) => {
                        res.status(201).send({
                            message: 'User Created Successfully',
                            result,
                        });
                    })
                    // catch error if the new user wasn't added successfully to the database
                    .catch((error) => {
                        res.status(500).send({
                            message: 'Error creating user',
                            error,
                        });
                    });
            })
            // catch error if the password hash isn't successful
            .catch((e) => {
                res.status(500).send({
                    message: 'Password was not hashed successfully',
                    e,
                });
            });
    }
    // [POST] login endpoint
    login(req, res, next) {
        // check if email exists
        User.findOne({ email: req.body.email })
            // if email exists
            .then((user) => {
                // compare the password entered and the hashed password found
                bcrypt
                    .compare(req.body.password, user.password)

                    // if the passwords match
                    .then((passwordCheck) => {
                        // check if password matches
                        if (!passwordCheck) {
                            return res.status(400).send({
                                message: 'Passwords does not match',
                                error,
                            });
                        }

                        //   create JWT token
                        const token = jwt.sign(
                            {
                                userId: user._id,
                                userEmail: user.email,
                            },
                            'RANDOM-TOKEN',
                            { expiresIn: '24h' },
                        );

                        //   return success res
                        res.status(200).send({
                            message: 'Login Successful',
                            email: user.email,
                            token,
                        });
                    })
                    // catch error if password does not match
                    .catch((error) => {
                        res.status(400).send({
                            message: 'Passwords does not match',
                            error,
                        });
                    });
            })
            // catch error if email does not exist
            .catch((e) => {
                res.status(404).send({
                    message: 'Email not found',
                    e,
                });
            });
    }
    // [GET] free endpoint
    freeEndpoint(req, res, next) {
        res.json({ message: 'You are free to access me anytime' });
    }
    // [GET] authentication endpoint
    authEndpoint(req, res, next) {
        res.json({ message: 'You are authorized to access me' });
    }
    // [GET] home page
    index(req, res, next) {
        // res.send('Hello World!');
        res.render('home');
    }
}
module.exports = new UserController();
