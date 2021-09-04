const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bCrypt = require('bcrypt');

module.exports = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
    },
    function (email, password, done) {
        User.findOne({ email: email }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }

            var isMatch = bCrypt.compareSync(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    },
);
