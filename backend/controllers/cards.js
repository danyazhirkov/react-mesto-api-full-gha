const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

// const NotError = 200;
// const CreateCode = 201;

// Контроллер для получения всех карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

// Контроллер для создания карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user && req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(', ');
        next(new BadRequest(`Переданы некорректные данные: ${errorMessage}`));
      } else {
        next(err);
      }
    });
};

// Контроллер для удаления карточки по идентификатору
module.exports.deleteCardId = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  return Card.findById(cardId)
    .orFail(() => new NotFound('Карточка с указанным _id не найдена'))
    .then((card) => {
      const owner = card.owner.toString();
      if (userId !== owner) {
        throw new Forbidden('Невозможно удалить карточку');
      }

      return Card.deleteOne(card)
        .then(() => res.send(card))
        .catch(next);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные удаления'));
      }
      return next(e);
    });
};

// Контроллер для добавления лайка к карточке
module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => new NotFound('Передан несуществующий _id карточки'))
  .then((card) => res.send(card))
  .catch((e) => {
    if (e.name === 'CastError') {
      return next(new BadRequest('Переданы некорректные данные для добавления лайка'));
    }
    return next(e);
  });

// Контроллер для удаления лайка к карточке
module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => new NotFound('Передан несуществующий _id карточки'))
  .then((card) => res.send(card))
  .catch((e) => {
    if (e.name === 'CastError') {
      return next(new BadRequest('Переданы некорректные данные для снятия лайка'));
    }
    return next(e);
  });

// const getInitialCards = (req, res, next) => {
//   Card.find({})
//     .then((cards) => res.status(NotError).send(cards))
//     .catch(next);
// };

// const createNewCard = (req, res, next) => {
//   const { name, link } = req.body;
//   const owner = req.user._id;

//   Card.create({ name, link, owner })
//     .then((card) => res.status(CreateCode).send(card))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new BadRequest('Переданы некорректные данные при создании карточки.'));
//       } else {
//         next(err);
//       }
//     });
// };

// const deleteCard = (req, res, next) => {
//   const { cardId } = req.params;

//   Card.findById(cardId)
//     .orFail(() => {
//       throw new NotFound('Карточка с указанным _id не найдена');
//     })
//     .then((card) => {
//       if (card.owner.toString() !== req.user._id) {
//         throw new Forbidden('Вы не можете удалить эту карточку');
//       }
//       return Card.findByIdAndRemove(cardId).then(() => res.status(200).send(card));
//     })
//     .catch(next);
// };

// const likeCard = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true },
//   )
//     .then((card) => {
//       if (!card) {
//         throw new NotFound('Передан несуществующий _id карточки.');
//       }
//       return res.status(NotError).send(card);
//     })
//     .catch((error) => {
//       if (error.name === 'CastError') {
//         return next(new BadRequest('Переданы некорректные данные для постановки лайка.'));
//       }
//       return next(error);
//     });
// };

// const disLike = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } },
//     { new: true },
//   )
//     .then((card) => {
//       if (!card) {
//         throw new NotFound('Передан несуществующий _id карточки.');
//       }
//       return res.status(NotError).send(card);
//     })
//     .catch((error) => {
//       if (error.name === 'CastError') {
//         return next(new BadRequest('Переданы некорректные данные для снятии лайка.'));
//       }
//       return next(error);
//     });
// };

// module.exports = {
//   getInitialCards,
//   createNewCard,
//   deleteCard,
//   likeCard,
//   disLike,
// };
