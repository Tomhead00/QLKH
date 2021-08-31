const Course = require('../models/Course');
const { multipleMongooseToObject } = require('../../util/mongoose');

class SitesController {
    // GET /home
    home(req, res) {
        res.render('home', {
            layout: false,
            username: req.session.username,
            image: req.session.image,
        });
    }
}

module.exports = new SitesController();
