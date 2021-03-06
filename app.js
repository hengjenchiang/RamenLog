/**---------------------------------------------------------
 * DEV environment variable
 */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
//----------------------------------------------------------

/**---------------------------------------------------------
 * Variable declaration
 */
const express = require('express');

const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const colors = require('colors');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const ExpressError = require('./utils/ExpressError'); // usage: new ExpressError(message, statusCode)
const {
  connectSrcUrls,
  scriptSrcUrls,
  styleSrcUrls,
  fontSrcUrls,
  imgSrcUrls,
} = require('./helmetConfig');

const app = express();
const port = process.env.PORT || 5000;
const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ramenlog'; // Local storage in DEV

//----------------------------------------------------------

/**---------------------------------------------------------
 * Models
 */
const Ramen = require('./models/ramen');
const User = require('./models/user');
const Review = require('./models/review');
//----------------------------------------------------------

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
 * Express app configuration
 */

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
const secret = process.env.SECRET || 'thisissessionscretindevmode';
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: dbUri,
      touchAfter: 12 * 3600,
      crypto: {
        secret: process.env.SECRET || 'thisissessionscretindevmode',
      },
    }),
    name: 's_ramen_id',
    resave: false,
    saveUninitialized: false,
    secret,
    cookie: {
      secure: process.env.NODE_ENV === 'development' ? false : true, // requires HTTPS enabled site (which localhost is not)
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 12,
      maxAge: 1000 * 60 * 60 * 12, // half day
    },
  })
);
app.use(flash());

// Heroku hosted on a reverse proxy. Inorder to use session in HTTPS.
// If you have your node.js behind a proxy and are using secure: true, you need to set "trust proxy" in express:
// ref: https://www.npmjs.com/package/express-session
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}
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
 * Configure security: helmet, monogoSanitize
 */

app.use(mongoSanitize()); // Must before defining routes
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", 'blob:'],
        objectSrc: [],
        imgSrc: ["'self'", 'blob:', 'data:', ...imgSrcUrls],
        fontSrc: ["'self'", ...fontSrcUrls],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

//----------------------------------------------------------

/**---------------------------------------------------------
 *  res locals middleware
 */
app.use((req, res, next) => {
  // current user will be available on every view if logged in. otherwise it will be undefined. ???????????????passport config ?????????
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
//----------------------------------------------------------

/**---------------------------------------------------------
 * Router configuration
 */
const ramenRouter = require('./router/ramens');
const reviewRouter = require('./router/reviews');
const userRouter = require('./router/users');

app.use('/ramens', ramenRouter);
app.use('/ramens/:id/reviews', reviewRouter);
app.use('/', userRouter);
//----------------------------------------------------------

/**
 * Landing page
 */
app.get('/', (req, res) => {
  res.render('homepage');
});

/**
 * Error Handling
 */
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

/*
 * Error middleware
 */
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = '??????!????????????????????????';
  res.status(statusCode).render('error', { err });
  next();
});

app.listen(port, () => {
  console.log(`listen to port ${port}`.cyan.underline);
});
