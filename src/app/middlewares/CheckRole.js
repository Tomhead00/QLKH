module.exports = function CheckRole(req, res, next) {
    // console.log(req.session.passport);
    if (req.session.passport != null) {
        if (req.session.passport.user.role == 'admin') next();
        else {
            res.redirect('/courses');
        }
    } else {
        res.redirect('/account');
    }
};
