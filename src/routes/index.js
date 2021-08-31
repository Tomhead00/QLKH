const accountRouter = require('./account');
const meRouter = require('./me');
const coursesRouter = require('./courses');
const siteRouter = require('./site');

function route(app) {
    app.use('/account', accountRouter);
    app.use('/me', meRouter);
    app.use('/courses', coursesRouter);

    app.use('/', siteRouter);
    app.use('/:slug', siteRouter);
}

module.exports = route;
