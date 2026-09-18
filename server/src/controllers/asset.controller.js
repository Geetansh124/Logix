const assetService = require('../services/asset.service');

exports.findAll = async (req, res, next) => {
  try {
    const data = await assetService.findAll(req.query);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.findByStation = async (req, res, next) => {
  try {
    const data = await assetService.findByStation(req.params.stationId, req.query);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.findById = async (req, res, next) => {
  try {
    const data = await assetService.findById(req.params.id);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = await assetService.create(req.body);
    res.status(201).json({ data });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const data = await assetService.updateStatus(req.params.id, req.body);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.scheduleMaintenance = async (req, res, next) => {
  try {
    const data = await assetService.scheduleMaintenance(req.params.id, req.body);
    res.status(201).json({ data });
  } catch (err) { next(err); }
};

exports.completeMaintenance = async (req, res, next) => {
  try {
    const data = await assetService.completeMaintenance(req.params.id, req.params.maintenanceId, req.body);
    res.json({ data });
  } catch (err) { next(err); }
};
