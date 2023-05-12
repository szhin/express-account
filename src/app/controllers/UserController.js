const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { mongooseToObject } = require('../../util/mongoose');
dotenv.config();

class UserController {
    // [GET] render page login user
    renderLogin(req, res, next) {
        const errorPassword = req.flash('errorPassword');
        const errorEmail = req.flash('errorEmail');
        res.render('login', { errorPassword, errorEmail });
    }
    // [GET] render page register user
    renderRegister(req, res, next) {
        const error = req.flash('error');
        const errorPassword = req.flash('errorPassword');
        const countries = [
            // Asia
            { code: 'AF', name: 'Afghanistan' },
            { code: 'AM', name: 'Armenia' },
            { code: 'AZ', name: 'Azerbaijan' },
            { code: 'BH', name: 'Bahrain' },
            { code: 'BD', name: 'Bangladesh' },
            { code: 'BT', name: 'Bhutan' },
            { code: 'BN', name: 'Brunei' },
            { code: 'KH', name: 'Cambodia' },
            { code: 'CN', name: 'China' },
            { code: 'CY', name: 'Cyprus' },
            { code: 'GE', name: 'Georgia' },
            { code: 'IN', name: 'India' },
            { code: 'ID', name: 'Indonesia' },
            { code: 'IR', name: 'Iran' },
            { code: 'IQ', name: 'Iraq' },
            { code: 'IL', name: 'Israel' },
            { code: 'JP', name: 'Japan' },
            { code: 'JO', name: 'Jordan' },
            { code: 'KZ', name: 'Kazakhstan' },
            { code: 'KW', name: 'Kuwait' },
            { code: 'KG', name: 'Kyrgyzstan' },
            { code: 'LA', name: 'Laos' },
            { code: 'LB', name: 'Lebanon' },
            { code: 'MY', name: 'Malaysia' },
            { code: 'MV', name: 'Maldives' },
            { code: 'MN', name: 'Mongolia' },
            { code: 'MM', name: 'Myanmar' },
            { code: 'NP', name: 'Nepal' },
            { code: 'KP', name: 'North Korea' },
            { code: 'OM', name: 'Oman' },
            { code: 'PK', name: 'Pakistan' },
            { code: 'PH', name: 'Philippines' },
            { code: 'QA', name: 'Qatar' },
            { code: 'RU', name: 'Russia' },
            { code: 'SA', name: 'Saudi Arabia' },
            { code: 'SG', name: 'Singapore' },
            { code: 'KR', name: 'South Korea' },
            { code: 'LK', name: 'Sri Lanka' },
            { code: 'SY', name: 'Syria' },
            { code: 'TW', name: 'Taiwan' },
            { code: 'TJ', name: 'Tajikistan' },
            { code: 'TH', name: 'Thailand' },
            { code: 'TR', name: 'Turkey' },
            { code: 'TM', name: 'Turkmenistan' },
            { code: 'AE', name: 'United Arab Emirates' },
            { code: 'UZ', name: 'Uzbekistan' },
            { code: 'VN', name: 'Vietnam' },
            { code: 'YE', name: 'Yemen' },
            // Europe
            { code: 'BE', name: 'Belgium' },
            { code: 'BA', name: 'Bosnia and Herzegovina' },
            { code: 'BG', name: 'Bulgaria' },
            { code: 'HR', name: 'Croatia' },
            { code: 'CY', name: 'Cyprus' },
            { code: 'CZ', name: 'Czech Republic' },
            { code: 'DK', name: 'Denmark' },
            { code: 'EE', name: 'Estonia' },
            { code: 'FO', name: 'Faroe Islands' },
            { code: 'FI', name: 'Finland' },
            { code: 'FR', name: 'France' },
            { code: 'DE', name: 'Germany' },
            { code: 'GI', name: 'Gibraltar' },
            { code: 'GR', name: 'Greece' },
            { code: 'HU', name: 'Hungary' },
            { code: 'IS', name: 'Iceland' },
            { code: 'IE', name: 'Ireland' },
            { code: 'IT', name: 'Italy' },
            { code: 'XK', name: 'Kosovo' },
            { code: 'LV', name: 'Latvia' },
            { code: 'LI', name: 'Liechtenstein' },
            { code: 'LT', name: 'Lithuania' },
            { code: 'LU', name: 'Luxembourg' },
            { code: 'MK', name: 'North Macedonia' },
            { code: 'MT', name: 'Malta' },
            { code: 'MD', name: 'Moldova' },
            { code: 'MC', name: 'Monaco' },
            { code: 'ME', name: 'Montenegro' },
            { code: 'NL', name: 'Netherlands' },
            { code: 'NO', name: 'Norway' },
            { code: 'PL', name: 'Poland' },
            { code: 'PT', name: 'Portugal' },
            { code: 'RO', name: 'Romania' },
            { code: 'RU', name: 'Russia' },
            { code: 'SM', name: 'San Marino' },
            { code: 'RS', name: 'Serbia' },
            { code: 'SK', name: 'Slovakia' },
            { code: 'SI', name: 'Slovenia' },
            { code: 'ES', name: 'Spain' },
            { code: 'SE', name: 'Sweden' },
            { code: 'CH', name: 'Switzerland' },
            { code: 'UA', name: 'Ukraine' },
            { code: 'GB', name: 'United Kingdom' },
            { code: 'VA', name: 'Vatican City' },
            // Add more countries as needed
        ];
        // Create variables for register.hbs
        res.render('register', { error, errorPassword, countries });
    }
    // [POST] register endpoint
    async register(req, res, next) {
        const { password, repeatPassword, email, username } = req.body;
        if (password !== repeatPassword) {
            req.flash('errorPassword', ' - wrong');
            return res.redirect('/renderRegister');
        }
        // const splitPathImage = req.file.path.split('/');
        // const pathAvatar =
        //     splitPathImage[splitPathImage.length - 2] +
        //     '/' +
        //     splitPathImage[splitPathImage.length - 1];
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
                    .then(async (hashedPassword) => {
                        // create a new user instance and collect the data
                        const user = new User({
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            phone: req.body.phone,
                            country: req.body.country,
                            username: req.body.username,
                            gender: req.body.gender,
                            password: hashedPassword,
                        });
                        // save the new user
                        user.save()
                            // return success if the new user is added to the database successfully
                            .then(() => res.redirect('/renderLogin'))
                            .catch(next);

                        // catch error if the new user wasn't added successfully to the database
                    })
                    // catch error if the password hash isn't successful
                    .catch((err) => {
                        res.status(500).send({
                            message: 'Password was not hashed successfully',
                            err,
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
                            process.env.REACT_APP_SECRET,
                            { expiresIn: '24h' },
                        );
                        req.session.user = {
                            userId: user._id,
                            userEmail: user.email,
                            userImage: user.image,
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

    info(req, res, next) {
        if (req.session.user) {
            // Lấy thông tin từ session
            const user = req.session.user;

            // Trả về JSON chứa thông tin
            return res.status(200).json({
                user,
            });
        } else {
            // Người dùng chưa đăng nhập, trả về lỗi hoặc thông báo không đủ quyền truy cập
            return res.status(401).json({
                message: 'Bạn cần đăng nhập để truy cập thông tin',
            });
        }
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
        // res.render('home');
        res.redirect('/yourAccount');
    }

    // [GET] free endpoint
    freeEndpoint(req, res, next) {
        res.json({ message: 'You are free to access me anytime' });
    }
}
module.exports = new UserController();
