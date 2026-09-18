const emergencyService = require('../services/emergency.service');

exports.trigger = async (req, res, next) => {
  try {
    const data = await emergencyService.trigger(req.params.stationId, req.body);
    res.status(201).json({ data });
  } catch (err) { next(err); }
};

exports.findByStation = async (req, res, next) => {
  try {
    const data = await emergencyService.findByStation(req.params.stationId, req.query);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.findById = async (req, res, next) => {
  try {
    const data = await emergencyService.findById(req.params.id);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const data = await emergencyService.updateStatus(req.params.id, req.body);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.getResourceDashboard = async (req, res, next) => {
  try {
    const data = await emergencyService.getResourceDashboard(req.params.stationId);
    res.json({ data });
  } catch (err) { next(err); }
};
