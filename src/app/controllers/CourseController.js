const Course = require('../models/Course');
const { mongooseToObject } = require('../../util/mongoose');
const { multipleMongooseToObject } = require('../../util/mongoose');

class CourseController {
    // GET /course
    course(req, res, next) {
        Course.find({})
            .then((courses) => {
                res.render('courses/courses', {
                    courses: multipleMongooseToObject(courses),
                    username: req.session.username,
                    image: req.session.image,
                });
            })
            .catch(next);
    }

    // GET /courses/:slug
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then((course) => {
                res.render('courses/show', {
                    course: mongooseToObject(course),
                    username: req.session.username,
                    image: req.session.image,
                });
            })
            .catch(next);
        // res.send('Course Detail - ' + req.params.slug);
    }

    // GET /courses/create
    create(req, res, next) {
        res.render('courses/create', {
            username: req.session.username,
            image: req.session.image,
        });
    }

    // POST /courses/store
    store(req, res, next) {
        // res.json(req.body)
        req.body.image = `https://img.youtube.com/vi/${req.body.videoID}/sddefault.jpg`;
        const course = new Course(req.body);
        course
            .save()
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next);
    }

    // GET /courses/:id/edit
    edit(req, res, next) {
        Course.findById(req.params.id)
            .then((course) =>
                res.render('courses/edit', {
                    course: mongooseToObject(course),
                }),
            )
            .catch(next);
    }

    // PUT /courses/:id
    update(req, res, next) {
        // res.json(req.body)
        Course.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next);
    }

    // DELETE /courses/:id
    delete(req, res, next) {
        // res.json(req.body)
        Course.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // PATCH /courses/:id/restore
    restore(req, res, next) {
        Course.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    // DELETE /courses/:id/forceDelete
    forceDelete(req, res, next) {
        // res.json(req.body)
        Course.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    // POST /courses/handle-form-actions
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Course.delete({ _id: { $in: req.body.courseIds } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action is invalid!' });
        }
    }
}

module.exports = new CourseController();
