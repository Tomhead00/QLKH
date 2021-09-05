const Course = require('../models/Course');
const { multipleMongooseToObject } = require('../../util/mongoose');
var username = null;
var image = null;

class MeController {
    // GET /me/stored/Courses
    storeCourses(req, res, next) {
        try {
            username = req.session.passport.user.username;
            image = req.session.passport.user.image;
        } catch {
            var username = null;
            var image = null;
        }
        let courseQuery = Course.find({});

        if (req.query.hasOwnProperty('_sort')) {
            courseQuery = courseQuery.sort({
                [req.query.column]: req.query.type,
            });
        }

        Promise.all([courseQuery, Course.countDocumentsDeleted()])
            .then(([courses, deletedCount]) =>
                res.render('me/stored-courses', {
                    username: username,
                    image: image,
                    deletedCount,
                    courses: multipleMongooseToObject(courses),
                }),
            )
            .catch(next);
    }
    // GET /me/trash/Courses
    trashCourses(req, res, next) {
        Course.findDeleted({})
            .then((courses) =>
                res.render('me/trash-courses', {
                    username: req.session.username,
                    image: req.session.image,
                    courses: multipleMongooseToObject(courses),
                }),
            )
            .catch(next);
    }
}

module.exports = new MeController();
