const Course = require('../models/Course');
const { User } = require('../models/User');
const Comment = require('../models/Comment');
const Video = require('../models/Video');
const { multipleMongooseToObject } = require('../../util/mongoose');

class ManagerController {
    // GET /account
    async account(req, res, next) {
        let accountAdmin = await User.find({ role: 'admin' });
        let accountUser = await User.find({ role: 'user' });
        let accountBlock = await User.countDocumentsDeleted();
        res.render('manager/account', {
            title: 'Quản lý tài khoản',
            accountAdmin: multipleMongooseToObject(accountAdmin),
            accountUser: multipleMongooseToObject(accountUser),
            accountBlock,
            username: req.session.passport,
        });
    }

    // GET /blocked
    async blocked(req, res, next) {
        let accountBlock = await User.findDeleted({});
        res.render('manager/blockAccount', {
            title: 'Danh sách thành viên bị khóa',
            accountBlock: multipleMongooseToObject(accountBlock),
            username: req.session.passport,
        });
    }

    // DELETE /:id
    async block(req, res, next) {
        Course.find({ actor: req.params.id })
            .then((courses) => {
                for (const course of courses) {
                    for (const _id of course.video) {
                        Video.delete({ _id: _id }).catch(next);
                    }
                    Course.delete({ _id: course._id }).catch(next);
                }
            })
            .catch(next);

        User.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // PATCH /:id
    async restore(req, res, next) {
        Course.findDeleted({ actor: req.params.id })
            .then((courses) => {
                for (const course of courses) {
                    for (const _id of course.video) {
                        Video.restore({ _id: _id }).catch(next);
                    }
                    Course.restore({ _id: course._id }).catch(next);
                }
            })
            .catch(next);

        await User.updateOneDeleted({ _id: req.params.id }, { role: 'user' });

        User.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // DELETE /:id
    async delete(req, res, next) {
        Course.find({ actor: req.params.id })
            .then((courses) => {
                for (const course of courses) {
                    for (const _id of course.video) {
                        Video.deleteOne({ _id: _id }).catch(next);
                    }
                    Course.deleteOne({ _id: course._id }).catch(next);
                }
            })
            .catch(next);

        User.deleteOne({ _id: req.params.id })
            .then((user) => {
                res.redirect('back');
            })
            .catch(next);
    }

    // PATCH /:id/down
    async down(req, res, next) {
        await User.updateOne({ _id: req.params.id }, { role: 'user' });
        res.redirect('back');
    }

    // PATCH /:id/down
    async up(req, res, next) {
        if ((await User.countDocuments({ role: 'admin' })) < 5) {
            await User.updateOne({ _id: req.params.id }, { role: 'admin' });
            res.redirect('back');
        } else {
            res.redirect('back');
        }
    }

    // ------------------ Courses ------------------
    // GET /courses
    async courses(req, res, next) {
        let courseQuery = Course.find({}).populate({
            modal: 'user',
            path: 'actor',
        });

        if (req.query.hasOwnProperty('_sort')) {
            courseQuery = courseQuery.sort({
                [req.query.column]: req.query.type,
            });
        }

        Promise.all([
            courseQuery,
            Course.countDocumentsDeleted({
                actor: req.session.passport.user._id,
            }),
        ])
            .then(([courses, deletedCount]) => {
                // res.json(courses)
                res.render('manager/courses', {
                    title: 'Quản lý khóa học',
                    username: req.session.passport,
                    deletedCount,
                    courses: multipleMongooseToObject(courses),
                });
            })
            .catch(next);
    }
}

module.exports = new ManagerController();
