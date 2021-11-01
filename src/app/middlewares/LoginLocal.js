const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models/User');
const bCrypt = require('bcrypt');

module.exports = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
    },
    function (email, password, done) {
        User.findOne({ email: email }, async function (err, user) {
            if (err) {
                // console.log("test");
                return done(err);
            }
            if ((await User.countDocumentsDeleted({ email: email })) == 1) {
                // console.log("test");
                return done(null, false, {
                    message: 'Tài khoản đã bị khóa!',
                    reason: 'blocked',
                });
            } else if (!user) {
                return done(null, false, {
                    message: 'Tài khoản không tồn tại!',
                });
            }

            var isMatch = bCrypt.compareSync(password, user.password);
            if (!isMatch) {
                return done(null, false, {
                    message: 'Sai mật khẩu!',
                    email: user.email,
                });
            }
            return done(null, user);
        });
    },
);
