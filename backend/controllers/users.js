const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const ServerError = require('../errors/ServerError');
const Unauthorized = require('../errors/Unauthorized');
const { JWT_SECRET } = require('../utils/config');

const ConflictError = require('../errors/ConflictError');
// const newError = require('../middlewares/newError');

// const NotError = 200;

// Контроллер для получения всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// Контроллер для получения пользователя по ID
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new NotFound('Пользователь по указанному _id не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequest('Запрашиваемый пользователь не найден'));
      } else {
        next(e);
      }
    });
};

// Контроллер для создания пользователей
module.exports.createUser = (req, res, next) => {
  const {
    name = 'Жак-Ив Кусто',
    about = 'Исследователь',
    avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    email,
    password,
  } = req.body;

  // Хеширование пароля
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      throw new ServerError('Произошла ошибка при хешировании пароля');
    }

    return User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        // Exclude the 'password' field from the user object
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        res.status(201).send({ data: userWithoutPassword });
      })
      .catch((error) => {
        if (error.name === 'ValidationError') {
          next(new BadRequest('Введены некорректные данные'));
        } else if (error.code === 11000) {
          next(new ConflictError('Такой пользователь уже существует!)'));
        } else {
          next(error);
        }
      });
  });
};

// Контроллер для аутентификации пользователя и выдачи JWT-токена
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const TOKEN_EXPIRATION = '7d';
  let foundUser; // Declare the variable here

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Аутентификация не удалась. Пользователь не найден.');
      }

      foundUser = user; // Assign the value to the variable
      return bcrypt.compare(password, user.password);
    })
    .then((result) => {
      if (result) {
        const token = jwt.sign({ _id: foundUser._id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
        res.cookie('jwt', token, { httpOnly: true });
        res.status(200).send({ message: 'Аутентификация успешна.', token });
      } else {
        throw new Unauthorized('Аутентификация не удалась. Неверный пароль.');
      }
    })
    .catch((error) => next(error));
};

// Контроллер для обновления профиля пользователя
// eslint-disable-next-line consistent-return
module.exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;

  const updatedFields = {};
  updatedFields.name = req.body.name;
  updatedFields.about = req.body.about;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new BadRequest('Невалидный идентификатор пользователя');
  }

  User.findByIdAndUpdate(userId, { $set: updatedFields }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFound('Нет пользователя с таким id');
      }
      return res.status(200).send({ data: updatedUser });
    })
    .catch((error) => {
      // Обработка ошибок валидации
      if (error.name === 'ValidationError') {
        next(new BadRequest('Введены некорректные данные'));
      } else {
        next(error);
      }
    });
};

// Контроллер для получения информации о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new NotFound('Пользователь по указанному _id не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequest('Запрашиваемый пользователь не найден'));
      } else {
        next(e);
      }
    });
};

// Контроллер для обновления аватар
// eslint-disable-next-line consistent-return
module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { $set: { avatar } }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFound('Нет пользователя с таким id');
      }
      res.status(200).send({ data: updatedUser });
    })
    .catch((error) => {
      if (error.name === 'CastError' || error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные для обновления аватара'));
      } else {
        next(error);
      }
    });
};

/* const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(NotError).send(users);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const payload = { _id: user._id };
      const token = jwt.sign(payload, 'some-secret-key', { expiresIn: '7d' });
      res.status(NotError).send({ token });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id).orFail(() => new NotFound('Данных с указанным id не существует'))
    .then((user) => {
      res.status(NotError).send({ data: user });
    })

    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequest('Ошибка: Неверные данные'));
      }

      return next(err);
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с таким id не найден');
      }
      return res.status(NotError).send({ user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Ошибка: Неверные данные'));
      } else {
        next(error);
      }
    });
};

const editUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Переданы некорректные данные при обновлении профиля.');
      }
      return res.status(NotError).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Пользователь с указанным _id не найден.'));
      }
      return next(error);
    });
};

const editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при обновлении аватара.'));
      }
      return next(error);
    });
};

module.exports = {
  getUsers,
  getUserInfo,
  getUserById,
  createUser,
  editUser,
  editAvatar,
  login,
}; */
