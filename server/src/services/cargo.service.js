const { Cargo, Container, ReceiptConfirmation } = require('../models');
const { AppError } = require('../middleware/errorHandler');

class CargoService {
  async findByExpedition(expeditionId, query = {}) {
    const where = { expedition_id: expeditionId };
    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.category) where.category = query.category;

    return Cargo.findAll({
      where,
      order: [['stowage_order', 'ASC']],
      include: [{ model: Container, as: 'container' }],
    });
  }

  async findById(id) {
    const cargo = await Cargo.findByPk(id, {
      include: [
        { model: Container, as: 'container' },
        { model: ReceiptConfirmation, as: 'receiptConfirmations', order: [['timestamp', 'ASC']] },
      ],
    });
    if (!cargo) throw new AppError('Cargo not found', 404);
    return cargo;
  }

  async create(data) {
    return Cargo.create(data);
  }

  async updateLocation(id, locationData) {
    const cargo = await this.findById(id);
    const location = {
      lat: locationData.lat,
      lng: locationData.lng,
      hub: locationData.hub || null,
      timestamp: locationData.timestamp || new Date().toISOString(),
    };
    return cargo.update({ current_location: location });
  }

  async confirmReceipt(cargoId, receiptData) {
    const cargo = await this.findById(cargoId);
    const receipt = await ReceiptConfirmation.create({
      cargo_id: cargoId,
      hub: receiptData.hub,
      condition: receiptData.condition,
      confirmed_by: receiptData.confirmedBy,
      notes: receiptData.notes,
    });

    // Auto-update cargo status based on destination
    if (receiptData.hub === cargo.destination_hub) {
      await cargo.update({ status: 'RECEIVED' });
    } else {
      await cargo.update({ status: 'AT_TRANSSHIPMENT' });
    }

    return receipt;
  }

  async updateStowageOrder(id, stowageOrder) {
    const cargo = await this.findById(id);
    return cargo.update({ stowage_order: stowageOrder });
  }

  async update(id, data) {
    const cargo = await this.findById(id);
    return cargo.update(data);
  }
}

module.exports = new CargoService();
