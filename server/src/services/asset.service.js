const { Asset, MaintenanceSchedule, Station } = require('../models');
const { AppError } = require('../middleware/errorHandler');

class AssetService {
  async findByStation(stationId, query = {}) {
    const where = { station_id: stationId };
    if (query.type) where.type = query.type;
    if (query.category) where.category = query.category;
    if (query.status) where.status = query.status;

    return Asset.findAll({
      where,
      order: [['name', 'ASC']],
    });
  }

  async findById(id) {
    const asset = await Asset.findByPk(id, {
      include: [
        { model: Station, as: 'station', attributes: ['id', 'name'] },
        { model: MaintenanceSchedule, as: 'maintenanceSchedule', order: [['scheduled_date', 'DESC']] },
      ],
    });
    if (!asset) throw new AppError('Asset not found', 404);
    return asset;
  }

  async create(data) {
    return Asset.create(data);
  }

  async updateStatus(id, { status, location }) {
    const asset = await this.findById(id);
    const updateData = { status };
    if (location) updateData.location = location;
    return asset.update(updateData);
  }

  async scheduleMaintenance(assetId, { scheduledDate, type, description }) {
    await this.findById(assetId); // Validate asset exists
    return MaintenanceSchedule.create({
      asset_id: assetId,
      scheduled_date: scheduledDate,
      type,
      description,
    });
  }

  async completeMaintenance(assetId, maintenanceId, { completedDate, notes }) {
    const maintenance = await MaintenanceSchedule.findOne({
      where: { id: maintenanceId, asset_id: assetId },
    });
    if (!maintenance) throw new AppError('Maintenance record not found', 404);

    return maintenance.update({
      completed_date: completedDate || new Date(),
      status: 'COMPLETED',
      description: notes ? `${maintenance.description}\n\nCompletion notes: ${notes}` : maintenance.description,
    });
  }

  async findAll(query = {}) {
    const where = {};
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;

    return Asset.findAll({
      where,
      order: [['name', 'ASC']],
      include: [{ model: Station, as: 'station', attributes: ['id', 'name'] }],
    });
  }
}

module.exports = new AssetService();
