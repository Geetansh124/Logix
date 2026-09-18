const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AppError } = require('../middleware/errorHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_do_not_use_in_production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '15m';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

class AuthService {
  async register({ name, email, password, role }) {
    const existing = await User.scope('withPassword').findOne({ where: { email } });
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword, role });

    const tokens = this._generateTokens(user);
    return { user: this._sanitize(user), ...tokens };
  }

  async login({ email, password }) {
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const tokens = this._generateTokens(user);
    return { user: this._sanitize(user), ...tokens };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      const user = await User.findByPk(decoded.sub);
      if (!user) {
        throw new AppError('User not found', 401);
      }
      const tokens = this._generateTokens(user);
      return tokens;
    } catch {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  _generateTokens(user) {
    const payload = { sub: user.id, name: user.name, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    const refreshToken = jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRY });
    return { accessToken, refreshToken };
  }

  _sanitize(user) {
    const json = user.toJSON();
    delete json.password;
    return json;
  }
}

module.exports = new AuthService();
