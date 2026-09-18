const cargoService = require('../services/cargo.service');

exports.findByExpedition = async (req, res, next) => {
  try {
    const data = await cargoService.findByExpedition(req.params.expeditionId, req.query);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.findById = async (req, res, next) => {
  try {
    const data = await cargoService.findById(req.params.id);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = await cargoService.create(req.body);
    res.status(201).json({ data });
  } catch (err) { next(err); }
};

exports.updateLocation = async (req, res, next) => {
  try {
    const data = await cargoService.updateLocation(req.params.id, req.body);
    res.json({ data });
  } catch (err) { next(err); }
};

exports.confirmReceipt = async (req, res, next) => {
  try {
    const data = await cargoService.confirmReceipt(req.params.id, req.body);
    res.status(201).json({ data });
  } catch (err) { next(err); }
};

exports.updateStowageOrder = async (req, res, next) => {
  try {
    const data = await cargoService.updateStowageOrder(req.params.id, req.body.stowageOrder);
    res.json({ data });
  } catch (err) { next(err); }
};
