const pokemonNotFound = function (err, req, res, next) {
  res.status(404).send("Pokemon not found");
};
const forbiddenAction = function (err, req, res, next) {
  res.status(403).send("Forbidden action");
};
const serverError = function (err, req, res, next) {
  res.status(500).send("server error");
};
const noAuth = function (err, req, res, next) {
  res.status(401).send("you did not fill in the user");
};

const errorfunc = { pokemonNotFound, forbiddenAction, serverError, noAuth };

module.exports = { errorfunc };
