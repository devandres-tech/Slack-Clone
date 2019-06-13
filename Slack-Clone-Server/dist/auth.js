"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tryLogin = exports.refreshTokens = exports.createTokens = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _lodash = _interopRequireDefault(require("lodash"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createTokens = async (user, secret, secret2) => {
  const createToken = _jsonwebtoken.default.sign({
    user: _lodash.default.pick(user, ['id', 'username'])
  }, secret, {
    expiresIn: '1h'
  });

  const createRefreshToken = _jsonwebtoken.default.sign({
    user: _lodash.default.pick(user, 'id')
  }, secret2, {
    expiresIn: '7d'
  });

  return [createToken, createRefreshToken];
};

exports.createTokens = createTokens;

const refreshTokens = async (token, refreshToken, models, SECRET, SECRET2) => {
  let userId = 0;

  try {
    const {
      user: {
        id
      }
    } = _jsonwebtoken.default.decode(refreshToken);

    userId = id;
  } catch (err) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await models.User.findOne({
    where: {
      id: userId
    },
    raw: true
  });

  if (!user) {
    return {};
  }

  const refreshSecret = user.password + SECRET2;

  try {
    _jsonwebtoken.default.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshSecret);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user
  };
};

exports.refreshTokens = refreshTokens;

const tryLogin = async (email, password, models, SECRET, SECRET2) => {
  // Find user with given email
  const user = await models.User.findOne({
    where: {
      email
    },
    raw: true
  });

  if (!user) {
    // user with provided email not found, return response
    return {
      ok: false,
      errors: [{
        path: 'email',
        message: 'No user with this email exists!'
      }]
    };
  }

  const valid = await _bcrypt.default.compare(password, user.password);

  if (!valid) {
    // return a response if password is invalid
    return {
      ok: false,
      errors: [{
        path: 'password',
        message: 'Invalid password'
      }]
    };
  }

  const refreshTokenSecret = user.password + SECRET2;
  const [token, refreshToken] = await createTokens(user, SECRET, refreshTokenSecret);
  return {
    ok: true,
    token,
    refreshToken
  };
};

exports.tryLogin = tryLogin;