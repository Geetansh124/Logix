const inventoryService = require('../services/inventory.service');

exports.findByStation = async (req, res, next) => {
  try {
    const data = await inventoryService.findByStation(req.params.stationId, req.query);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.findById = async (req, res, next) => {
  try {
    const data = await inventoryService.findById(req.params.id);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = await inventoryService.create(req.body);
    res.status(201).json({ data });
  } catch (err) { next(err); }
};

exports.updateStock = async (req, res, next) => {
  try {
    const data = await inventoryService.updateStock(req.params.id, req.body);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.getDepletionProjections = async (req, res, next) => {
  try {
    const data = await inventoryService.getDepletionProjections(req.params.stationId);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.getConsumptionAnalytics = async (req, res, next) => {
  try {
    const data = await inventoryService.getConsumptionAnalytics(req.params.stationId, req.query);
    res.json({ data });
  } catch (err) { next(err); }
};
