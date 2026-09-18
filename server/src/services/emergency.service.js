const { Emergency, Notification, Station, Inventory, Personnel } = require('../models');
const { AppError } = require('../middleware/errorHandler');

class EmergencyService {
  async trigger(stationId, { level, type, description, triggeredBy }) {
    // Auto-capture snapshots
    const [personnelSnap, inventorySnap] = await Promise.all([
      Personnel.findAll({
        where: { current_station: stationId },
        attributes: ['id', 'name', 'role', 'status'],
        raw: true,
      }),
      Inventory.findAll({
        where: { station_id: stationId },
        attributes: ['id', 'item_name', 'category', 'current_stock', 'unit', 'daily_consumption'],
        raw: true,
      }),
    ]);

    const emergency = await Emergency.create({
      station_id: stationId,
      level,
      type,
      description,
      triggered_by: triggeredBy,
      roll_call_snapshot: personnelSnap,
      inventory_snapshot: inventorySnap,
    });

    // Auto-generate notifications based on emergency level
    const recipients = this._getRecipients(level);
    const notifications = await Promise.all(
      recipients.map((r) =>
        Notification.create({
          emergency_id: emergency.id,
          recipient: r.name,
          channel: r.channel,
          status: 'SENT', // In production, this would be async
        }),
      ),
    );

    return { emergency, notifications };
  }

  async findByStation(stationId, query = {}) {
    const where = { station_id: stationId };
    if (query.status) where.status = query.status;
    if (query.level) where.level = query.level;

    return Emergency.findAll({
      where,
      order: [['triggered_at', 'DESC']],
      include: [{ model: Station, as: 'station', attributes: ['id', 'name'] }],
    });
  }

  async findById(id) {
    const emergency = await Emergency.findByPk(id, {
      include: [
        { model: Station, as: 'station' },
        { model: Notification, as: 'notifications' },
      ],
    });
    if (!emergency) throw new AppError('Emergency not found', 404);
    return emergency;
  }

  async updateStatus(id, { status, notes }) {
    const emergency = await this.findById(id);
    const updateData = { status };
    if (status === 'RESOLVED') {
      updateData.resolved_at = new Date();
      updateData.resolution_notes = notes;
    }
    return emergency.update(updateData);
  }

  async getResourceDashboard(stationId) {
    const criticalCategories = ['Fuel', 'Food', 'Medical', 'Oxygen'];
    const items = await Inventory.findAll({
      where: { station_id: stationId, category: criticalCategories },
      attributes: ['id', 'item_name', 'category', 'current_stock', 'unit', 'daily_consumption', 'depletion_date'],
    });

    const resources = {};
    for (const item of items) {
      const cat = item.category.toLowerCase();
      if (!resources[cat]) resources[cat] = [];
      resources[cat].push({
        itemName: item.item_name,
        quantity: item.current_stock,
        unit: item.unit,
        daysRemaining: item.daily_consumption > 0
          ? Math.floor(item.current_stock / item.daily_consumption)
          : null,
      });
    }

    return resources;
  }

  _getRecipients(level) {
    const base = [
      { name: 'NCPOR Director', channel: 'DASHBOARD' },
      { name: 'Station Manager', channel: 'DASHBOARD' },
    ];

    if (level === 'LEVEL_1_CRITICAL' || level === 'LEVEL_2_SERIOUS') {
      base.push(
        { name: 'MoES Emergency Cell', channel: 'EMAIL' },
        { name: 'NCPOR Director', channel: 'SMS' },
      );
    }

    if (level === 'LEVEL_1_CRITICAL') {
      base.push(
        { name: 'MoES Emergency Cell', channel: 'SMS' },
        { name: 'All Station Personnel', channel: 'DASHBOARD' },
      );
    }

    return base;
  }
}

module.exports = new EmergencyService();
