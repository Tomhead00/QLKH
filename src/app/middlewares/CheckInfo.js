module.exports = function CheckRole(req, res, next) {
    // console.log(req.session.passport);
    if (req.session.passport != null) {
        // console.log(req.session.passport.user._id,  req.params.id)
        if (
            req.session.passport.user.role == 'admin' ||
            req.session.passport.user._id == req.params.id
        )
            next();
        else {
            res.redirect('/courses');
        }
    } else {
        res.redirect('/account');
    }
};
