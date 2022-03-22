const express = require('express');
const multer = require('multer');
const ramenController = require('../controllers/ramens');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isPostAuthor, validateRamen } = require('../middleware');
const { cloudinaryStorage } = require('../cloudinary/index');

const router = express.Router();
const upload = multer({ storage: cloudinaryStorage });

router
  .route('/')
  .get(ramenController.getRamenIndex)
  .post(
    isLoggedIn,
    upload.array('images'),
    catchAsync(validateRamen),
    catchAsync(ramenController.postNewRamen)
  );

router.route('/new').get(isLoggedIn, ramenController.getNewRamenForm);

router
  .route('/:id')
  .get(catchAsync(ramenController.getRamenDetail))
  .patch(isLoggedIn, isPostAuthor, catchAsync(ramenController.updateRamen))
  .delete(isLoggedIn, isPostAuthor, catchAsync(ramenController.deleteRamen));

router
  .route('/:id/edit')
  .get(isLoggedIn, isPostAuthor, ramenController.getUpdateRamenForm);

module.exports = router;

/**---------------------------------------------------------
 * Ramens - CRUD
 * Read index : GET /ramens
 * Create : GET /ramens/new
 * Create form : POST /ramens/new
 * Read detail : GET /ramens/:id
 * Update : PATCH /ramens/:id
 * Update form : GET /ramens/:id
 * Delete : DELETE /ramens/:id
 */
//----------------------------------------------------------
