const mongoose = require('mongoose');
const validator = require('validator');
// const bcrypt = require('bcryptjs');
// const Unauthorized = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: false,
    validate: {
      validator(value) {
        return /^(https?:\/\/(www\.)?([a-zA-z0-9-]{1}[a-zA-z0-9-]*\.?)*\.{1}([a-zA-z0-9]){2,8}(\/?([a-zA-z0-9-])*\/?)*\/?([-._~:?#[]@!\$&'\(\)\*\+,;=])*)/.test(value);
      },
      message: 'Invalid avatar URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email address',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     default: 'Жак-Ив Кусто',
//     minlength: [2, 'Минимальная длинна поля "name" - 2'],
//     maxlength: [30, 'Максимальная длина поля "name" - 30'],
//   },
//   about: {
//     type: String,
//     default: 'Исследователь',
//     minlength: [2, 'Минимальная длинна поля "name" - 2'],
//     maxlength: [30, 'Максимальная длина поля "name" - 30'],
//   },
//   avatar: {
//     type: String,
//     default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
//     validate: {
//       validator(url) {
//       },
//       message: 'Неправильный url',
//     },
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     validate: {
//       validator(email) {
//         validator.isEmail(email);
//       },
//       message: 'Введите верный E-mail',
//     },
//   },
//   password: {
//     type: String,
//     required: true,
//     select: false,
//   },
// });

// userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
//   return this.findOne({ email }).select('+password')
//     .then((user) => {
//       if (!user) {
//         throw new Unauthorized('Неправильные почта или пароль');
//       }

//       return bcrypt.compare(password, user.password)
//         .then((matched) => {
//           if (!matched) {
//             throw new Unauthorized('Неправильные почта или пароль');
//           }

//           return user;
//         });
//     });
// };

// module.exports = mongoose.model('user', userSchema);
