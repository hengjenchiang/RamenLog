const format = require('date-fns/format');
const Ramen = require('../models/ramen');
const { cloudinary } = require('../cloudinary/index');

// @desc    Get ramen index
// @route   GET /ramens
// @access  Public
module.exports.getRamenIndex = async (req, res, next) => {
  const ramens = await Ramen.find();
  res.render('ramens/index', { ramens });
};

// @desc    Get new ramen form
// @route   GET /ramens/new
// @access  Auth Check
module.exports.getNewRamenForm = async (req, res, next) => {
  res.render('ramens/new');
};

// @desc    Get ramen detail
// @route   GET /ramens/:id
// @access  Public
module.exports.getRamenDetail = async (req, res, next) => {
  const { id } = req.params;
  const ramen = await Ramen.findById(id).populate('author').populate({
    path: 'reviews',
    populate: 'author',
  });
  if (!ramen) {
    req.flash('error', '找不到該拉麵資訊喔！');
    return res.redirect('/ramens');
  }

  // if (req.user)  console.log(ramen.author.equals(req.user._id)); //不能用 === 要用.equals (mongoose API)
  res.render('ramens/show', { ramen, format });
};

// @desc    Post new ramen
// @route   POST /ramens
// @access  Auth Check
module.exports.postNewRamen = async (req, res, next) => {
  const ramen = new Ramen({ ...req.body.ramen });
  ramen.author = req.user._id;

  // ramen.images.push({url: req.body.imageURL, filename: 'testFile'});
  ramen.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  await ramen.save();
  res.redirect('ramens');
};

// @desc    Get edit ramen form
// @route   GET /ramens/:id/edit
// @access  Auth Check
module.exports.getUpdateRamenForm = async (req, res, next) => {
  const { id } = req.params;
  const ramen = await Ramen.findById(id);
  res.render('ramens/edit', { ramen });
};

module.exports.updateRamen = async (req, res, next) => {
  const { id } = req.params;
  const update = req.body.ramen;
  const ramen = await Ramen.findById(id);
  ramen.images.push(
    ...req.files.map((f) => ({ url: f.path, filename: f.filename }))
  );
  update.images = ramen.images;
  await ramen.updateOne(update);
  if (req.body.deleteImages) {
    for (const filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await ramen.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  // await ramen.save();

  // https://mongoosejs.com/docs/documents.html#updating-using-save 建議使用save()更新，因為其他不會觸發完整的middleware //改用findByIdAndUpdate 原本用findOneAndUpdate會更新錯誤
  // await Ramen.findByIdAndUpdate(id, update, { new: true });

  // ramen.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));

  req.flash('success', '更新成功！');
  res.redirect(`/ramens/${id}`);
};

module.exports.deleteRamen = async (req, res, next) => {
  const { id } = req.params;
  const ramen = await Ramen.findById(id);
  for (const file of ramen.images) {
    if (file && file.filename) {
      await cloudinary.uploader.destroy(file.filename);
    }
  }

  // triggers Mongo middleware a.k.a pre and post hooks => delete comments
  await Ramen.findByIdAndDelete(id);
  req.flash('success', '成功刪掉囉');
  res.redirect('/ramens');
};
