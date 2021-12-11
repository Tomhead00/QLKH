const Course = require('../models/Course');
const Video = require('../models/Video');
const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const { populate } = require('../models/Video');
const { course } = require('./CourseController');

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}

class MeController {
    // GET /me/stored/Courses
    storeCourses(req, res, next) {
        let courseQuery = Course.find({ actor: req.session.passport.user._id });

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
            .then(([courses, deletedCount]) =>
                res.render('me/stored-courses', {
                    title: 'Khóa học của tôi',
                    username: req.session.passport,
                    deletedCount,
                    courses: multipleMongooseToObject(courses),
                }),
            )
            .catch(next);
    }
    // GET /me/trash/Courses
    trashCourses(req, res, next) {
        let courseQuery = Course.findDeleted({
            actor: req.session.passport.user._id,
        });

        if (req.query.hasOwnProperty('_sort')) {
            courseQuery = courseQuery.sort({
                [req.query.column]: req.query.type,
            });
        }

        Promise.all([courseQuery, Course.countDocumentsDeleted()]).then(
            ([courses, deletedCount]) =>
                res.render('me/trash-courses', {
                    title: 'Xóa khóa học',
                    username: req.session.passport,
                    deletedCount,
                    courses: multipleMongooseToObject(courses),
                }),
        );
    }

    // GET /me/stored/:id/edit
    edit(req, res, next) {
        Course.findById(req.params.id)
            .populate('video')
            .populate({ modal: 'user', path: 'actor' })
            .then(async (course) => {
                // res.json(course);
                // console.log(course.actor.email);
                try {
                    if (
                        req.session.passport.user.email == course.actor.email ||
                        req.session.passport.user.role == 'admin'
                    ) {
                        var countDel;
                        await Course.findById(req.params.id).then(
                            async (course1) => {
                                // console.log(course1.video)
                                countDel = await Video.countDocumentsDeleted({
                                    _id: course1.video,
                                });
                            },
                        );
                        res.render('me/edit', {
                            title: 'Tùy chỉnh khóa học',
                            username: req.session.passport,
                            countDel,
                            course: mongooseToObject(course),
                        });
                    } else {
                        return res.redirect('/me/stored/courses');
                    }
                } catch (next) {
                    return res.redirect('/me/stored/courses');
                }
            })
            .catch(next);
    }
    // GET /me/stored/:id/edit/addVideo
    addVideo(req, res, next) {
        Course.findById(req.params.id)
            .then((course) =>
                res.render('me/editVideo', {
                    title: 'Thêm video cho khóa học',
                    username: req.session.passport,
                    course: mongooseToObject(course),
                }),
            )
            .catch(next);
    }

    // POST /me/stored/:id/edit/:_id/:action
    actionVideo(req, res, next) {
        // res.json(req.params);
        switch (req.params.action) {
            case 'preview':
                Course.findById({ _id: req.params.id })
                    .then((course) => {
                        var arr = course.video;
                        var pos = arr.indexOf(req.params._id);
                        var pos1 = pos - 1;
                        if (pos == 0) {
                            pos1 = arr.length - 1;
                        }
                        arr = array_move(arr, pos, pos1);
                        // console.log(arr, pos, pos1);
                        Course.findOneAndUpdate(
                            { _id: req.params.id },
                            { $pullAll: { video: arr } },
                        );
                        Course.findOneAndUpdate(
                            { _id: req.params.id },
                            { video: arr },
                        )
                            .then(() => {
                                res.redirect('back');
                            })
                            .catch(next);
                    })
                    .catch(next);
                break;
            case 'setting':
                res.redirect('update');
                break;
            case 'delete':
                Video.delete({ _id: req.params._id })
                    .then(() => {
                        res.redirect('/me/stored/' + req.params.id + '/edit/');
                    })
                    .catch(next);
                break;
            case 'next':
                Course.findById({ _id: req.params.id })
                    .then((course) => {
                        var arr = course.video;
                        var pos = arr.indexOf(req.params._id);
                        var pos1 = pos + 1;
                        if (pos == arr.length - 1) {
                            pos1 = 0;
                        }
                        arr = array_move(arr, pos, pos1);
                        // console.log(arr, pos, pos1);
                        Course.findOneAndUpdate(
                            { _id: req.params.id },
                            { $pullAll: { video: arr } },
                        );
                        Course.findOneAndUpdate(
                            { _id: req.params.id },
                            { video: arr },
                        )
                            .then(() => {
                                res.redirect('back');
                            })
                            .catch(next);
                    })
                    .catch(next);
                break;
            default:
                res.redirect('back');
        }
    }

    // GET /me/stored/:id/edit/:_id/update
    async updateVideo(req, res, next) {
        const course = await Course.findById(req.params.id);
        Video.findById(req.params._id)
            .then((video) =>
                res.render('me/updateVideo', {
                    title: 'Cập nhật video khóa học',
                    username: req.session.passport,
                    video: mongooseToObject(video),
                    course: mongooseToObject(course),
                }),
            )
            .catch(next);
    }

    // GET /me/trash/:id
    showTrashVideo(req, res, next) {
        Course.findById(req.params.id)
            .populate({ modal: 'user', path: 'actor' })
            .then((course) => {
                try {
                    if (
                        req.session.passport.user.email == course.actor.email ||
                        req.session.passport.user.role == 'admin'
                    ) {
                        let videoQuery = Video.findDeleted({
                            _id: course.video,
                        });

                        if (req.query.hasOwnProperty('_sort')) {
                            videoQuery = videoQuery.sort({
                                [req.query.column]: req.query.type,
                            });
                        }

                        videoQuery.then((videos) =>
                            res.render('me/trashId', {
                                title: 'Video đã xóa',
                                username: req.session.passport,
                                videos: multipleMongooseToObject(videos),
                                idCourse: req.params.id,
                                nameCourse: course.name,
                            }),
                        );
                    } else {
                        console.log(
                            req.session.passport.user.email,
                            course.actor.email,
                            req.session.passport.user.role,
                        );
                        return res.redirect('/me/stored/courses');
                    }
                } catch (next) {
                    return res.redirect('/me/stored/courses');
                }
            })
            .catch(next);
    }

    // PUT /me/stored/:id/edit/:_id/update
    putUpdateVideo(req, res, next) {
        // res.json(req.body)
        Video.findByIdAndUpdate(req.params._id, {
            name: req.body.name,
            mieuta: req.body.mieuta,
            videoID: req.body.videoID,
            image:
                'https://img.youtube.com/vi/' +
                req.body.videoID +
                '/sddefault.jpg',
        })
            .then(() => {
                // res.json(req.body)
                res.redirect('/me/stored/' + req.params.id + '/edit/');
            })
            .catch(next);
    }

    // PUT /me/stored/:id
    async storeVideo(req, res, next) {
        // res.json(req.body)
        const course = await Course.findById({ _id: req.params.id });
        // console.log(typeof(course._id))
        req.body.image = `https://img.youtube.com/vi/${req.body.videoID}/sddefault.jpg`;
        const video = new Video(req.body);
        video
            .save()
            .then(
                (video) =>
                    Course.findByIdAndUpdate(
                        req.params.id,
                        { $push: { video: video._id } },
                        { new: true, useFindAndModify: false },
                    ),
                // console.log(video),
                res.redirect('/me/stored/' + req.params.id + '/edit'),
            )
            .catch(next);
    }

    // PATCH /me/trash/:_id/restore/:id
    restoreVideo(req, res, next) {
        Video.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // DELETE /me/trash/:_id/delete/:id/force
    forceDeleteVideo(req, res, next) {
        // res.json(req.params)
        Course.updateOne(
            { _id: req.params._id },
            { $pull: { video: req.params.id } },
            { new: true, useFindAndModify: false },
        ).catch(next);

        Video.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // POST /me/trash/:_id/handle-form-actions-trash
    handleFormTrashVideoActions(req, res, next) {
        // res.json(req.body);
        switch (req.body.action) {
            case 'deletes':
                for (const _id of req.body.videoIDs) {
                    Course.updateMany(
                        { _id: req.params._id },
                        { $pull: { video: _id } },
                        { new: true, useFindAndModify: false },
                    ).catch(next);

                    Video.deleteOne({ _id: _id }).catch(next);
                }
                res.redirect('back');
                break;
            case 'restores':
                for (const _id of req.body.videoIDs) {
                    Video.restore({ _id: _id }).catch(next);
                }
                res.redirect('back');
                break;
            default:
                res.json({ message: 'Action is invalid!' });
        }
    }
}

module.exports = new MeController();
