const mongoose = require('mongoose');
const Review = require('./review');

const { Schema } = mongoose;

const ramenSchema = new Schema({
  title: String, // 店家名稱
  area: String, // 區域
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  product: String, // 拉麵名稱
  price: Number, // 價格
  images: [
    // 圖片
    {
      url: String,
      filename: String,
    },
  ],
  rating: Number, // 評分
  thoughts: String, // 心得感想
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

// post query middleware -> delete dependent reviews after quering
ramenSchema.post('findOneAndDelete', async (doc) => {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

// Adding error middleware to handle casting error for ramen ObjectId
ramenSchema.post('findOne', (err, doc, next) => {
  if (err.name === 'CastError') {
    next(new Error('找不到該拉麵'));
  } else {
    next();
  }
});

const Ramen = mongoose.model('Ramen', ramenSchema);

module.exports = Ramen;
