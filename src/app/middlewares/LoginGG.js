var GoogleStrategy = require('passport-google-oauth20').Strategy;
const { ClientRequest } = require('http');
const conngg = require('../../config/conngg');
const { User } = require('../models/User');

module.exports = new GoogleStrategy(
    {
        clientID: conngg.clientID,
        clientSecret: conngg.clientSecret,
        callbackURL: conngg.callbackURL,
        profileFields: [
            'id',
            'displayName',
            'name',
            // 'gender',
            'picture.type(large)',
            'email',
        ],
    },
    function (accessToken, refreshToken, profile, done) {
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
                        // console.log("test");
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
                        // newUser.token = token; // we will save the token that facebook provides to the user
                        newUser.username = profile.displayName;
                        newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                        // newUser.gender = profile.gender
                        newUser.image = profile.photos[0].value;
                        newUser.password = profile.id;
                        console.log(newUser);
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
