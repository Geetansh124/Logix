const { Personnel, RollCall, Expedition } = require('../models');
const { AppError } = require('../middleware/errorHandler');

class PersonnelService {
  async findByExpedition(expeditionId, query = {}) {
    const where = { expedition_id: expeditionId };
    if (query.status) where.status = query.status;

    return Personnel.findAll({
      where,
      order: [['name', 'ASC']],
    });
  }

  async findById(id) {
    const person = await Personnel.findByPk(id, {
      include: [
        { model: Expedition, as: 'expedition', attributes: ['id', 'name', 'status'] },
      ],
    });
    if (!person) throw new AppError('Personnel not found', 404);
    return person;
  }

  async create(data) {
    return Personnel.create(data);
  }

  async updateStatus(id, statusData) {
    const person = await this.findById(id);
    return person.update(statusData);
  }

  async recordRollCall(stationId, { timestamp, personnelIds, status }) {
    // Get all personnel at this station
    const allPersonnel = await Personnel.findAll({
      where: { current_station: stationId },
    });

    const allIds = allPersonnel.map((p) => p.id);
    const missingIds = allIds.filter((id) => !personnelIds.includes(id));
    const rollCallStatus = missingIds.length > 0 ? 'MISSING_PERSONNEL' : 'COMPLETED';

    const rollCall = await RollCall.create({
      station_id: stationId,
      timestamp: timestamp || new Date(),
      status: status || rollCallStatus,
      personnel_ids: personnelIds,
      missing_personnel_ids: missingIds,
    });

    return rollCall;
  }

  async getRollCallHistory(stationId, query = {}) {
    const where = { station_id: stationId };
    if (query.status) where.status = query.status;

    return RollCall.findAll({
      where,
      order: [['timestamp', 'DESC']],
      limit: query.limit || 50,
    });
  }

  async findAll(query = {}) {
    const where = {};
    if (query.status) where.status = query.status;
    if (query.currentStation) where.current_station = query.currentStation;

    return Personnel.findAll({
      where,
      order: [['name', 'ASC']],
      include: [
        { model: Expedition, as: 'expedition', attributes: ['id', 'name'] },
      ],
    });
  }
}

module.exports = new PersonnelService();
