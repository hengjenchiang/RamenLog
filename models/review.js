const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  rating: {
    type: Number,
  },
  body: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
