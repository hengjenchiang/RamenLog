/**---------------------------------------------------------
 * DEV environment variable
 */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
//----------------------------------------------------------

/**---------------------------------------------------------
 * Declare Variable
 */
const express = require('express');

const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const multer = require('multer');
const colors = require('colors');
const ExpressError = require('./utils/ExpressError'); // usage: new ExpressError(message, statusCode)
const { cloudinaryStorage } = require('./cloudinary/index');

const app = express();
const port = process.env.PORT || 5000;
const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ramenlog';
//----------------------------------------------------------

/**---------------------------------------------------------
 * Models
 */
const Ramen = require('./models/ramen');
const User = require('./models/user');
const Review = require('./models/review');
//----------------------------------------------------------

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    // FIXME:depends on the store DEPRECATED
    resave: false,
    saveUninitialized: false, // DEPRECATED
    secret: 'thisissessionscretindevmode',
    cookie: {
      // secure: true, //FIXME: Production
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(flash());

/**---------------------------------------------------------
 * Database - mongoDB connection
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(dbUri);
    console.log(
      `Successfully connect to mongoDB : ramenlog! ${conn.connection.host}`
        .bgRed.black
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
connectDB();

//----------------------------------------------------------

/**---------------------------------------------------------
 * Configure passport authentication
 */
app.use(passport.initialize());
app.use(passport.session());

// CHANGE : USE "createStrategy" INSTEAD OF "authenticate" since v0.2.1
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//----------------------------------------------------------

/**---------------------------------------------------------
 *  res locals middleware
 */
app.use((req, res, next) => {
  // current user will be available on every view if logged in. otherwise it will be undefined. 必須要放在passport config 之後！
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
//----------------------------------------------------------

/**---------------------------------------------------------
 * Router config
 */
const ramenRouter = require('./router/ramens');
const reviewRouter = require('./router/reviews');
const userRouter = require('./router/users');

app.use('/ramens', ramenRouter);
app.use('/ramens/:id/reviews', reviewRouter);
app.use('/', userRouter);
//----------------------------------------------------------

/**---------------------------------------------------------
 * User - CRUD
 *
 * Register form: GET /register
 * Register : POST /register
 * Login form : GET /login
 * Login : POST /login
 * Logout : POST /logout
 * Delete : DELETE /user/:id TODO: 刪除的時候 既有的post 留言 皆需更改為former member 刪掉cloudinary上的照片
 * Reset pwd : GET / IMPROVE:
 * Confim email : IMPROVE:
 * Personal page : IMPROVE:
 */
//----------------------------------------------------------

/**
 * Home Page
 */
app.get('/', (req, res) => {
  res.render('homepage');
});

/**
 * Error Handling e.g. 404
 */
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

/**
 * Middleware
 * moved to separate js file
 */

// TODO:  error.ejs
/** Error middleware */
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = '糟糕!好像哪裡出了問題';
  res.status(statusCode).render('error', { err });
  next();
});

app.listen(port, () => {
  console.log(`listen to port ${port}`.cyan.underline);
});
