const { Station } = require('../models');

exports.findAll = async (req, res, next) => {
  try {
    const data = await Station.findAll({ order: [['name', 'ASC']] });
    res.json({ data });
  } catch (err) { next(err); }
};

exports.findById = async (req, res, next) => {
  try {
    const data = await Station.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: { message: 'Station not found' } });
    res.json({ data });
  } catch (err) { next(err); }
};
