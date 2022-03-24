const Ramen = require('./models/ramen');
const Review = require('./models/review');
const {
  validateRamenSchema,
  validateReviewSchema,
  validateUserSchema,
} = require('./validateSchema');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', '請先登入喔！');
    return res.redirect('/login');
  }
  next();
};

module.exports.isPostAuthor = async function (req, res, next) {
  const { id } = req.params;
  const ramen = await Ramen.findById(id);
  if (!req.user.equals(ramen.author)) {
    req.flash('error', '你不是此篇文章的作者喔！不能進行變更刪除');
    return res.redirect(`/ramens/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async function (req, res, next) {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!req.user.equals(review.author)) {
    req.flash('error', '你不是該留言的作者喔！不能進行變更刪除');
    return res.redirect(`/ramens/${req.params.id}`);
  }
  next();
};

module.exports.validateRamen = async function (req, res, next) {
  const { error } = validateRamenSchema.validate(req.body, {
    allowUnknown: true,
  });
  if (error) {
    if (error.details) {
      const msg = error.details.map((el) => el.message).join(',');
      // standard Joi error msg.
      throw new ExpressError(msg, 400);
    } else {
      // custom message.
      throw new ExpressError(error, 400);
    }
  }
  next();
};

module.exports.validateReview = async function (req, res, next) {
  const { error } = validateReviewSchema.validate(req.body, {
    allowUnknown: true,
  });
  if (error) {
    if (error.details) {
      const msg = error.details.map((el) => el.message).join(',');
      // standard Joi error msg.
      throw new ExpressError(msg, 400);
    } else {
      // custom message.
      throw new ExpressError(error, 400);
    }
  }
  next();
};

module.exports.validateUser = async function (req, res, next) {
  const { error } = validateUserSchema.validate(req.body, {
    allowUnknown: true,
  });
  if (error) {
    if (error.details) {
      const msg = error.details.map((el) => el.message).join(',');
      // standard Joi error msg.
      throw new ExpressError(msg, 400);
    } else {
      // custom message.
      throw new ExpressError(error, 400);
    }
  }
  next();
};
