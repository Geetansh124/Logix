const personnelService = require('../services/personnel.service');

exports.findAll = async (req, res, next) => {
  try {
    const data = await personnelService.findAll(req.query);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.findByExpedition = async (req, res, next) => {
  try {
    const data = await personnelService.findByExpedition(req.params.expeditionId, req.query);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.findById = async (req, res, next) => {
  try {
    const data = await personnelService.findById(req.params.id);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = await personnelService.create(req.body);
    res.status(201).json({ data });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const data = await personnelService.updateStatus(req.params.id, req.body);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.recordRollCall = async (req, res, next) => {
  try {
    const data = await personnelService.recordRollCall(req.params.stationId, req.body);
    res.status(201).json({ data });
  } catch (err) { next(err); }
};

exports.getRollCallHistory = async (req, res, next) => {
  try {
    const data = await personnelService.getRollCallHistory(req.params.stationId, req.query);
    res.json({ data });
  } catch (err) { next(err); }
};
