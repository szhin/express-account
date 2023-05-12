const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const User = new mongoose.Schema(
    {
        firstName: { type: String },
        lastName: { type: String },
        country: { type: String },
        phone: { type: String },
        username: { type: String },
        email: {
            type: String,
            required: [true, 'Please provide an Email!'],
            unique: [true, 'Email Exist'],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password!'],
            unique: false,
        },
        // image: { type: String },
        slug: { type: String, slug: 'username', unique: true },
    },
    { timestamps: true },
);

// Tự tạo collection cái chữ 'User' => users
module.exports = mongoose.model('Users', User);
