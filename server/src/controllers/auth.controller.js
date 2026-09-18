const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ data: result });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json({ data: result });
  } catch (err) { next(err); }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);
    res.json({ data: tokens });
  } catch (err) { next(err); }
};
