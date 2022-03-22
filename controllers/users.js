const User = require('../models/user');

module.exports.getRegisterForm = async (req, res, next) => {
  res.render('users/register');
};

module.exports.postNewUser = async (req, res, next) => {
  const { username, password, nickname, email } = req.body.user;
  const newUser = new User({ username, email, nickname });
  if (req.file)
    newUser.profilePic = { url: req.file.path, filename: req.file.filename };
  else newUser.profilePic = { url: '/img/profile.jpg', filename: 'no-pick' };
  User.register(newUser, password, (err) => {
    if (err) {
      console.log(err);
      req.flash('error', err.message);
      return res.redirect('/register');
    }

    // register but not login i.e. 標準註冊後不會登入
    req.login(newUser, (e) => {
      if (e) {
        req.flash('error', e);
        res.redirect('/register');
      }
    });
    req.flash('success', `成功註冊囉！歡迎您 ${newUser.nickname}`);
    return res.redirect('/ramens');
  });
};

module.exports.getLoginForm = async (req, res, next) => {
  if (!req.user) {
    if (!req.session.returnTo) req.session.returnTo = req.header('Referer');
    res.render('users/login');
  } else {
    req.flash('error', '已經登入了，若想重新登入別的帳號');
    req.flash('error', '請先登出!');
    res.redirect('/ramens');
  }
};

module.exports.loginUser = async (req, res, next) => {
  const nickname = req.user.nickname || '';
  req.flash('success', `成功登入！歡迎回來ラーメンログ ${nickname}`);
  const redirectUrl = req.session.returnTo || '/ramens';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
  req.logout();
  req.flash('success', '成功登出囉～');
  res.redirect('/ramens');
};
