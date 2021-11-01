const { User } = require('../models/User');

module.exports = async function CheckUser(req, res, next) {
    // console.log(req.session.passport.user._id);
    // console.log(await User.countDocumentsDeleted({_id: req.session.passport.user._id}));

    if (
        req.session.passport != null &&
        (await User.countDocumentsDeleted({
            _id: req.session.passport.user._id,
        })) == 0
    ) {
        var newSes = await User.findOne({ _id: req.session.passport.user._id });
        // console.log(newSes);
        req.session.passport.user = newSes;
        req.session.save(function (err) {
            req.session.reload(function (err) {
                // console.log("test");
                if (err) throw err;
            });
        });
        next();
    } else {
        req.session.destroy((err) => {
            if (err) throw err;
            res.redirect('/account');
        });
    }
};
