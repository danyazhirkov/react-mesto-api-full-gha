const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const Unauthorized = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);

    return next();
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }
};

// const jwt = require('jsonwebtoken');
// const Unauthorized = require('../errors/Unauthorized');

// module.exports.auth = (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     throw new Unauthorized('Необходима авторизация');
//   }

//   const token = authorization.replace('Bearer ', '');
//   let payload;

//   try {
//     payload = jwt.verify(token, 'some-secret-key');
//   } catch (err) {
//     throw new Unauthorized('Необходима авторизация');
//   }

//   req.user = payload;

//   next();
// };
