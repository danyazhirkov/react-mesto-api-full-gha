const express = require('express');

const router = express.Router();

const {
  celebrate,
  Joi,
} = require('celebrate');
const {
  getCards,
  createCard,
  deleteCardId,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// Роутер для получения всех карточек
router.get('/', getCards);
// Роутер для создания карточки
router.post('/', celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      link: Joi.string()
        .required()
        .regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
    }),
}), createCard);
// Роутер для удаления карточки по идентификатору
router.delete('/:cardId', celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .hex()
        .length(24),
    }),
}), deleteCardId);
// Роутер для лайка карточке
router.put('/:cardId/likes', celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .hex()
        .length(24),
    }),
}), likeCard);
// Роутер удаления карточки по идентификатору
router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string()
          .hex()
          .length(24),
      }),
  }),
  dislikeCard,
);

module.exports = router;

// const router = require('express').Router();
// const { celebrate, Joi } = require('celebrate');
// const { auth } = require('../middlewares/auth');

// const {
//   getInitialCards,
//   createNewCard,
//   deleteCard,
//   likeCard,
//   disLike,
// } = require('../controllers/cards');

// router.get('/', auth, getInitialCards);
// router.post('/', auth, celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().required().min(2).max(30),
//   }),
// }), createNewCard);
// router.delete('/:cardId', auth, celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().length(24).hex().required(),
//   }),
// }), deleteCard);
// router.put('/:cardId/likes', auth, celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().length(24).hex().required(),
//   }),
// }), likeCard);
// router.delete('/:cardId/likes', auth, celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().length(24).hex().required(),
//   }),
// }), disLike);

// module.exports = router;
