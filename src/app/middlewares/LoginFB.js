const facebookStratery = require('passport-facebook').Strategy;
const { ClientRequest } = require('http');
const connfb = require('../../config/connfb');
const { User } = require('../models/User');

module.exports = new facebookStratery(
    {
        clientID: connfb.facebook_key,
        clientSecret: connfb.facebook_secret,
        callbackURL: connfb.callback_url,
        profileFields: [
            'id',
            'displayName',
            'name',
            'gender',
            'picture.type(large)',
            'email',
        ],
    },
    function (token, refreshToken, profile, done) {
        // console.log(profile);
        // return done(null, profile);
        process.nextTick(function (req, res, next) {
            User.findOne(
                { email: profile.emails[0].value },
                async function (err, user) {
                    if (err)
                        return done(err, {
                            message:
                                'Đăng nhập thất bại! Vui lòng thử lại hoặc chọn phương thức đăng nhập khác!',
                        });
                    if (
                        (await User.countDocumentsDeleted({
                            email: profile.emails[0].value,
                        })) == 1
                    ) {
                        // console.log(await User.countDocumentsDeleted({ email: profile.emails[0].value }));
                        return done(null, false, {
                            message: 'Tài khoản đã bị khóa!',
                            reason: 'blocked',
                        });
                    } else if (user) {
                        // console.log("user found")
                        // console.log(user)
                        return done(null, user);
                    } else {
                        var newUser = new User();
                        // newUser.uid    = profile.id; // set the users facebook id
                        // newUser.token = token; // we will save the token that facebook provides to the userzzz
                        newUser.username = profile.displayName;
                        newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                        // newUser.gender = profile.gender
                        newUser.image = profile.photos[0].value;
                        newUser.password = profile.id;
                        newUser.save(function (err) {
                            if (err) throw err;
                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }
                },
            );
        });
    },
);
