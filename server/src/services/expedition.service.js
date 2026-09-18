const { Expedition, Cargo, Personnel, Station } = require('../models');
const { AppError } = require('../middleware/errorHandler');

class ExpeditionService {
  async findAll(query = {}) {
    const where = {};
    if (query.status) where.status = query.status;

    return Expedition.findAll({
      where,
      order: [['start_date', 'DESC']],
      include: [
        { model: Personnel, as: 'personnel', attributes: ['id', 'name', 'role', 'status'] },
      ],
    });
  }

  async findById(id) {
    const expedition = await Expedition.findByPk(id, {
      include: [
        { model: Cargo, as: 'cargo' },
        { model: Personnel, as: 'personnel' },
      ],
    });
    if (!expedition) throw new AppError('Expedition not found', 404);
    return expedition;
  }

  async create(data) {
    return Expedition.create(data);
  }

  async update(id, data) {
    const expedition = await this.findById(id);
    return expedition.update(data);
  }

  async delete(id) {
    const expedition = await this.findById(id);
    await expedition.destroy();
    return { message: 'Expedition deleted' };
  }

  async getStowagePlan(expeditionId) {
    return Cargo.findAll({
      where: { expedition_id: expeditionId },
      order: [['stowage_order', 'ASC']],
      include: [{ model: require('../models/Container'), as: 'container' }],
    });
  }
}

module.exports = new ExpeditionService();
