const expeditionService = require('../services/expedition.service');

exports.findAll = async (req, res, next) => {
  try {
    const data = await expeditionService.findAll(req.query);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.findById = async (req, res, next) => {
  try {
    const data = await expeditionService.findById(req.params.id);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = await expeditionService.create(req.body);
    res.status(201).json({ data });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const data = await expeditionService.update(req.params.id, req.body);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const data = await expeditionService.delete(req.params.id);
    res.status(204).json(data);
  } catch (err) { next(err); }
};

exports.getStowagePlan = async (req, res, next) => {
  try {
    const data = await expeditionService.getStowagePlan(req.params.id);
    res.json({ data });
  } catch (err) { next(err); }
};
