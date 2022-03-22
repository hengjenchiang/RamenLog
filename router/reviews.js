const express = require('express');
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware');

// Inorder to access ramen ID from original URL
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');

router
  .route('/')
  .post(
    isLoggedIn,
    catchAsync(validateReview),
    catchAsync(reviewController.postNewReview)
  );

router
  .route('/:reviewId')
  .delete(
    isLoggedIn,
    isReviewAuthor,
    catchAsync(reviewController.deleteReview)
  );

module.exports = router;

/**---------------------------------------------------------
 * Review - CRUD
 * Create form: GET /ramen/:id
 * Post: POST /ramen/:id/reviews
 * Delete: DELETE /ramen/:id/reviews/:reviewID
 ----------------------------------------------------------*/
