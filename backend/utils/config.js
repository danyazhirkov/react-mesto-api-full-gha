// const NoError = 200;
// const Created = 201;
// const CastError = 400;
// const DocumentNotFoundError = 404;
// const ServerError = 500;

// module.exports = {
//   NoError,
//   Created,
//   CastError,
//   DocumentNotFoundError,
//   ServerError,
// };

const { PORT = 3000, JWT_SECRET = 'DEV_JWT' } = process.env;

module.exports = {
  PORT,
  JWT_SECRET,
};
