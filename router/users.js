const express = require('express');
const multer = require('multer');
const passport = require('passport');
const userController = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const { cloudinaryStorage } = require('../cloudinary/index');
const { isLoggedIn } = require('../middleware');

const upload = multer({ storage: cloudinaryStorage });
const router = express.Router();

router
  .route('/register')
  .get(userController.getRegisterForm)
  .post(upload.single('profilePic'), catchAsync(userController.postNewUser));

router
  .route('/login')
  .get(userController.getLoginForm)
  .post(
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: '不存在的帳號或密碼錯誤',
    }),
    userController.loginUser
  );

router.route('/logout').get(isLoggedIn, userController.logoutUser);

module.exports = router;

/**---------------------------------------------------------
 * User - CRUD
 *
 * Register form: GET /register
 * Register : POST /register
 * Login form : GET /login
 * Login : POST /login
 * Logout : POST /logout
 */
//----------------------------------------------------------
