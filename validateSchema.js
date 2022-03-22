const Joi = require('joi');

module.exports.validateRamenSchema = Joi.object({
  ramen: Joi.object({
    title: Joi.string().required().messages({
      'string.empty': `店家為必填項目喔！`,
      'any.required': `店家為必填項目喔！`,
    }),
    area: Joi.string().required().messages({
      'string.empty': `地區為必填項目喔！`,
      'any.required': `地區為必填項目喔！`,
    }),
    price: Joi.number().min(0).required().messages({
      'number.min': `價格不能小於 0 元！`,
      'any.required': `價格為必填項目喔！`,
    }),
    rating: Joi.number().min(0).max(10).required().messages({
      'number.min': `評分不能小於 0 ！`,
      'number.max': `評分不能大於 10 !`,
      'any.required': `評分為必填項目喔！`,
    }),
    product: Joi.string().required().messages({
      'string.empty': `拉麵名稱為必填項目喔！`,
      'any.required': `拉麵名稱為必填項目喔！`,
    }),
  }).required(),
});

module.exports.validateReviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().messages({
      'any.required': '必須要要評分才能送出留言！',
    }),
    body: Joi.string().required().messages({
      'string.empty': '留言不能空白！',
      'any.required': '留言不能空白！',
    }),
  }).required(),
});
