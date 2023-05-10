const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { mongooseToObject } = require('../../util/mongoose');

class UserController {
    // [POST] register endpoint
    register(req, res, next) {
        const { password, repeatPassword, email, username } = req.body;
        console.log(password);
        if (password !== repeatPassword) {
            req.flash('errorPassword', ' - repeat password is incorrect');
            return res.redirect('/renderRegister');
        }
        const splitPathImage = req.file.path.split('/');
        const pathAvatar =
            splitPathImage[splitPathImage.length - 2] +
            '/' +
            splitPathImage[splitPathImage.length - 1];
        User.count({
            $or: [{ email }, { username }],
        })
            .then((count) => {
                if (count > 0) {
                    // Variable error = - User.... in register.hbs
                    req.flash('error', ' - Username or email already in use');
                    return res.redirect('/renderRegister');
                }
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
                            image: pathAvatar,
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
            })
            .catch((err) => {
                res.status(500).send({
                    message: 'Something went wrong',
                    err,
                });
            });
        // hash the password
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
                            req.flash(
                                'errorPassword',
                                ' - password is incorrect',
                            );
                            return res.redirect('/renderLogin');
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
                        req.session.user = {
                            userId: user._id,
                            userEmail: user.email,
                            token,
                        };
                        return res.redirect('/YourAccount');
                        res.setHeader('Authorization', 'Bearer', token);
                        res.status(200).send({
                            message: 'Login Successful',
                            email: user.email,
                            token,
                        });
                    });
                // catch error if password does not match
            })
            // catch error if email does not exist
            .catch((e) => {
                req.flash('errorEmail', ' - email is not found');
                return res.redirect('/renderLogin');
            });
    }

    // [GET] authentication endpoint
    authEndpoint(req, res, next) {
        res.json({ message: 'You areauthorized to access me' });
    }
    // [GET] render page login user
    yourAccount(req, res, next) {
        // Check status account is logged in
        if (!req.session.user) {
            return res.redirect('renderLogin');
        }

        // Find one account logged in to render your-account.hbs
        User.findOne({
            email: req.session.user.userEmail,
        })
            .then((user) => {
                res.render('your-account', {
                    // convert all element in courses to object
                    user: mongooseToObject(user),
                });
            })
            .catch(next);
    }
    // [POST] /YourAccount/logout
    // Process logout account
    logout(req, res, next) {
        // destroy session login
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/renderLogin');
            }
        });
    }
    // [GET] home page
    index(req, res, next) {
        // res.send('Hello World!');
        res.render('home');
    }
    // [GET] render page register user
    renderRegister(req, res, next) {
        const error = req.flash('error');
        const errorPassword = req.flash('errorPassword');
        // Create variables for register.hbs
        res.render('register', { error, errorPassword });
    }
    // [GET] render page login user
    renderLogin(req, res, next) {
        const errorPassword = req.flash('errorPassword');
        const errorEmail = req.flash('errorEmail');
        res.render('login', { errorPassword, errorEmail });
    }

    // [GET] free endpoint
    freeEndpoint(req, res, next) {
        res.json({ message: 'You are free to access me anytime' });
    }
}
module.exports = new UserController();
