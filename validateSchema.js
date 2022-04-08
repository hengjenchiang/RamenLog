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
  })
    .required()
    .messages({
      'string.empty': `沒有拉麵物件！！`,
      'any.required': `沒有拉麵物件！！`,
    }),
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

module.exports.validateUserSchema = Joi.object({
  user: Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: false },
      })
      .required()
      .messages({
        'string.empty': '一定要有email！',
        'string.email': 'email不符合格式！',
        'any.required': '一定要有email！',
      }),
    nickname: Joi.string()
      .trim()
      .required()
      .prefs({ convert: false })
      .messages({
        'string.trim': '暱稱不能包含空白！',
        'string.empty': '暱稱不能空白！',
        'any.required': '暱稱不能空白！',
      }),
    username: Joi.string()
      .trim()
      .required()
      .prefs({ convert: false })
      .messages({
        'string.trim': '帳號不能包含空白！',
        'string.empty': '請輸入帳號！',
        'any.required': '請輸入帳號',
      }),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required()
      .messages({
        'string.empty': '密碼不能空白！',
        'string.pattern.base':
          '密碼不符合格式！（大小寫英文數字混合，3 ~ 30 個字）',
        'any.required': '密碼不能空白！',
      }),
  }).required(),
});
