const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    profilePic: {
      url: {
        type: String,
        default: '/img/profile.jpg',
      },
      filename: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(passportLocalMongoose); // Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.
userSchema.post('save', (error, res, next) => {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('信箱不能重複註冊帳號喔！'));
  } else {
    next();
  }
});
const User = mongoose.model('User', userSchema);

module.exports = User;
