const BadRequestError = require("./errors/BadRequestError");
const NotFoundError = require("./errors/NotFoundError");
const InternalServerError = require("./errors/InternalServerError");
const UnauthorizedError = require("./errors/UnauthorizedError");
const ForbiddenError = require("./errors/ForbiddenError");
const ConflictError = require("./errors/ConflictError");

module.exports = {
  BadRequestError,
  NotFoundError,
  InternalServerError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
};
