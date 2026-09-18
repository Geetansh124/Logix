const { Op } = require('sequelize');
const { Inventory, ConsumptionHistory, Station } = require('../models');
const { AppError } = require('../middleware/errorHandler');

class InventoryService {
  async findByStation(stationId, query = {}) {
    const where = { station_id: stationId };
    if (query.category) where.category = query.category;

    return Inventory.findAll({
      where,
      order: [['item_name', 'ASC']],
      include: [{ model: Station, as: 'station', attributes: ['id', 'name'] }],
    });
  }

  async findById(id) {
    const item = await Inventory.findByPk(id, {
      include: [
        { model: Station, as: 'station', attributes: ['id', 'name'] },
        { model: ConsumptionHistory, as: 'consumptionHistory', order: [['date', 'DESC']], limit: 30 },
      ],
    });
    if (!item) throw new AppError('Inventory item not found', 404);
    return item;
  }

  async create(data) {
    const item = await Inventory.create(data);
    // Auto-calculate depletion date
    await this._updateDepletionDate(item);
    return item.reload();
  }

  async updateStock(id, { quantityChange, reason, timestamp }) {
    const item = await this.findById(id);
    const newStock = item.current_stock + quantityChange;
    if (newStock < 0) throw new AppError('Stock cannot go below zero', 422);

    await ConsumptionHistory.create({
      inventory_id: id,
      date: timestamp || new Date(),
      quantity: Math.abs(quantityChange),
      reason: reason || 'normal usage',
    });

    await item.update({
      current_stock: newStock,
      last_updated: new Date(),
    });

    await this._updateDepletionDate(item);
    return item.reload();
  }

  async getDepletionProjections(stationId) {
    const items = await Inventory.findAll({
      where: { station_id: stationId, daily_consumption: { [Op.gt]: 0 } },
      order: [['depletion_date', 'ASC']],
    });

    return items.map((item) => {
      const daysRemaining = item.daily_consumption > 0
        ? Math.floor(item.current_stock / item.daily_consumption)
        : null;

      let alertLevel = 'INFO';
      if (daysRemaining !== null) {
        if (daysRemaining <= 7) alertLevel = 'CRITICAL';
        else if (daysRemaining <= 14) alertLevel = 'WARNING';
        else if (daysRemaining <= 30) alertLevel = 'CAUTION';
      }

      return {
        itemId: item.id,
        itemName: item.item_name,
        category: item.category,
        currentStock: item.current_stock,
        unit: item.unit,
        dailyConsumption: item.daily_consumption,
        depletionDate: item.depletion_date,
        daysRemaining,
        alertLevel,
      };
    });
  }

  async getConsumptionAnalytics(stationId, query = {}) {
    const where = {};
    if (query.startDate) where.date = { ...where.date, [Op.gte]: query.startDate };
    if (query.endDate) where.date = { ...where.date, [Op.lte]: query.endDate };

    const items = await Inventory.findAll({
      where: { station_id: stationId },
      include: [{
        model: ConsumptionHistory,
        as: 'consumptionHistory',
        where: Object.keys(where).length ? where : undefined,
        required: false,
      }],
    });

    return items;
  }

  async _updateDepletionDate(item) {
    if (item.daily_consumption > 0) {
      const daysRemaining = Math.floor(item.current_stock / item.daily_consumption);
      const depletionDate = new Date();
      depletionDate.setDate(depletionDate.getDate() + daysRemaining);
      await item.update({ depletion_date: depletionDate });
    }
  }
}

module.exports = new InventoryService();
