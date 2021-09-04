const path = require('path');
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const { dirname } = require('path');
const methodOverride = require('method-override');

const app = express();
const port = 3000;

const SortMiddleware = require('./app/middlewares/SortMiddleware');
const route = require('./routes');
const db = require('./config/db');
const session = require('express-session');
const CheckUser = require('./app/middlewares/CheckUser');
const MongoDBStore = require('connect-mongodb-session')(session);
// passport
const passport = require('passport');
const connfb = require('./config/connfb');
const User = require('./app/models/User');
const LoginFB = require('./app/middlewares/LoginFB');
const LoginLocal = require('./app/middlewares/LoginLocal');

// connect to DB
db.connect();

// use static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

app.use(methodOverride('_method'));

// connect mongodb session
const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/QLKH',
    collection: 'mySessions',
});

// cookie session
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: store,
    }),
);

// Custom middleware
app.use(SortMiddleware);
// app.get('/courses/:slug', CheckUser);

// passport fb
passport.use(LoginFB);
// passport local
passport.use(LoginLocal);

// Lưu session
passport.serializeUser(function (user, done) {
    return done(null, user);
});
passport.deserializeUser(function (id, done) {
    return done(null, id);
});
app.use(passport.initialize());
app.use(passport.session());

// Middleware facebook
app.get(
    '/auth/facebook/',
    passport.authenticate('facebook', { scope: 'email' }),
);
app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/courses',
        failureRedirect: '/account',
    }),
);

// Middleware Local
app.post(
    '/account/login',
    passport.authenticate('local', {
        successRedirect: '/courses',
        failureRedirect: '/account',
    }),
);

// HTTP log
// app.use(morgan('combined'));

// Template engine
app.engine(
    'hbs',
    exphbs({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
            sortable: (field, sort) => {
                const sortType = field === sort.column ? sort.type : 'default';

                const icons = {
                    default: 'oi oi-elevator',
                    asc: 'oi oi-sort-ascending',
                    desc: 'oi oi-sort-descending',
                };

                const types = {
                    default: 'desc',
                    asc: 'desc',
                    desc: 'asc',
                };

                const icon = icons[sortType];
                const type = types[sortType];

                return `<a href="?_sort&column=${field}&type=${type}">
                    <span class="${icon}"></span>
                    </a>`;
            },
        },
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

route(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
