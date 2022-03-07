const Review = require('../models/review');
const Ramen = require('../models/ramen');

module.exports.postNewReview = async (req, res, next) => {
  const { id } = req.params;
  const ramen = await Ramen.findById(id);
  const { body, rating } = req.body;
  const review = new Review({ body, rating, author: req.user });
  ramen.reviews.push(review);
  await review.save();
  await ramen.save();
  req.flash('success', '成功留言囉！');
  res.redirect(`/ramens/${id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  await Ramen.findByIdAndUpdate(id, { $pull: reviewId });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', '成功刪除留言囉！');
  res.redirect(`/ramens/${id}`);
};
