'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create ENUM types
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_users_role" AS ENUM ('ncpor_director','expedition_planner','station_manager','cargo_handler','emergency_responder','researcher');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN CREATE TYPE "enum_expeditions_status" AS ENUM ('PLANNING','ACTIVE','COMPLETED','CANCELLED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN CREATE TYPE "enum_cargo_category" AS ENUM ('CRITICAL','ESSENTIAL','STANDARD','BULK'); EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN CREATE TYPE "enum_cargo_priority" AS ENUM ('P0','P1','P2','P3'); EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN CREATE TYPE "enum_cargo_status" AS ENUM ('CONSOLIDATED','IN_TRANSIT','AT_TRANSSHIPMENT','DELIVERED','RECEIVED','DAMAGED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN CREATE TYPE "enum_personnel_status" AS ENUM ('ACTIVE_ON_STATION','IN_TRANSIT','MEDICAL_HOLD','ROTATION_DUE','DEPLOYED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN CREATE TYPE "enum_roll_calls_status" AS ENUM ('COMPLETED','PENDING','MISSING_PERSONNEL'); EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN CREATE TYPE "enum_emergencies_level" AS ENUM ('LEVEL_1_CRITICAL','LEVEL_2_SERIOUS','LEVEL_3_ADVISORY'); EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN CREATE TYPE "enum_emergencies_status" AS ENUM ('ACTIVE','RESOLVED','ESCALATED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN CREATE TYPE "enum_notifications_channel" AS ENUM ('EMAIL','SMS','DASHBOARD','WHATSAPP'); EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN CREATE TYPE "enum_notifications_status" AS ENUM ('PENDING','SENT','DELIVERED','FAILED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN CREATE TYPE "enum_assets_type" AS ENUM ('MOVABLE','IMMOVABLE','CONSUMABLE'); EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN CREATE TYPE "enum_assets_category" AS ENUM ('VEHICLE','EQUIPMENT','GENERATOR','CONTAINER','BUILDING','INFRASTRUCTURE','FUEL','FOOD','MEDICAL','SPARE_PARTS'); EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN CREATE TYPE "enum_assets_status" AS ENUM ('ACTIVE','IN_MAINTENANCE','DECOMMISSIONED','IN_TRANSIT'); EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN CREATE TYPE "enum_receipt_confirmations_condition" AS ENUM ('INTACT','DAMAGED','MISSING'); EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN CREATE TYPE "enum_maintenance_schedules_status" AS ENUM ('SCHEDULED','IN_PROGRESS','COMPLETED','CANCELLED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    // Users
    await queryInterface.createTable('users', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.ENUM('ncpor_director','expedition_planner','station_manager','cargo_handler','emergency_responder','researcher'), allowNull: false, defaultValue: 'researcher' },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // Stations
    await queryInterface.createTable('stations', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      location: { type: Sequelize.JSONB, allowNull: false },
      capacity: { type: Sequelize.INTEGER, allowNull: false },
      current_personnel: { type: Sequelize.INTEGER, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // Expeditions
    await queryInterface.createTable('expeditions', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      start_date: { type: Sequelize.DATEONLY, allowNull: false },
      end_date: { type: Sequelize.DATEONLY, allowNull: false },
      status: { type: Sequelize.ENUM('PLANNING','ACTIVE','COMPLETED','CANCELLED'), defaultValue: 'PLANNING', allowNull: false },
      description: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // Containers
    await queryInterface.createTable('containers', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      container_id: { type: Sequelize.STRING, allowNull: false, unique: true },
      type: { type: Sequelize.STRING, allowNull: false },
      dimensions: { type: Sequelize.JSONB },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // Cargo
    await queryInterface.createTable('cargo', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      expedition_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'expeditions', key: 'id' }, onDelete: 'CASCADE' },
      container_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'containers', key: 'id' } },
      category: { type: Sequelize.ENUM('CRITICAL','ESSENTIAL','STANDARD','BULK'), allowNull: false },
      priority: { type: Sequelize.ENUM('P0','P1','P2','P3'), allowNull: false },
      stowage_order: { type: Sequelize.INTEGER, allowNull: false },
      origin_hub: { type: Sequelize.STRING, allowNull: false, defaultValue: 'NCPOR-Goa' },
      destination_hub: { type: Sequelize.STRING, allowNull: false },
      current_location: { type: Sequelize.JSONB },
      status: { type: Sequelize.ENUM('CONSOLIDATED','IN_TRANSIT','AT_TRANSSHIPMENT','DELIVERED','RECEIVED','DAMAGED'), defaultValue: 'CONSOLIDATED', allowNull: false },
      description: { type: Sequelize.TEXT },
      weight_kg: { type: Sequelize.FLOAT },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // Inventories
    await queryInterface.createTable('inventories', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      station_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'stations', key: 'id' }, onDelete: 'CASCADE' },
      item_id: { type: Sequelize.STRING, allowNull: false },
      item_name: { type: Sequelize.STRING, allowNull: false },
      category: { type: Sequelize.STRING, allowNull: false },
      current_stock: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
      unit: { type: Sequelize.STRING, allowNull: false },
      location: { type: Sequelize.STRING },
      expiry_date: { type: Sequelize.DATEONLY },
      reorder_point: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
      safety_stock: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
      daily_consumption: { type: Sequelize.FLOAT, defaultValue: 0 },
      depletion_date: { type: Sequelize.DATEONLY },
      last_updated: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // Consumption Histories
    await queryInterface.createTable('consumption_histories', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      inventory_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'inventories', key: 'id' }, onDelete: 'CASCADE' },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      quantity: { type: Sequelize.FLOAT, allowNull: false },
      reason: { type: Sequelize.STRING, allowNull: false, defaultValue: 'normal usage' },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // Personnel
    await queryInterface.createTable('personnel', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.STRING, allowNull: false },
      expedition_id: { type: Sequelize.UUID, references: { model: 'expeditions', key: 'id' }, onDelete: 'SET NULL' },
      status: { type: Sequelize.ENUM('ACTIVE_ON_STATION','IN_TRANSIT','MEDICAL_HOLD','ROTATION_DUE','DEPLOYED'), defaultValue: 'ACTIVE_ON_STATION', allowNull: false },
      current_station: { type: Sequelize.STRING },
      medical_clearance: { type: Sequelize.DATEONLY },
      medical_clearance_expiry: { type: Sequelize.DATEONLY },
      rotation_due: { type: Sequelize.DATEONLY },
      contact_info: { type: Sequelize.JSONB },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // Roll Calls
    await queryInterface.createTable('roll_calls', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      station_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'stations', key: 'id' } },
      timestamp: { type: Sequelize.DATE, allowNull: false },
      status: { type: Sequelize.ENUM('COMPLETED','PENDING','MISSING_PERSONNEL'), defaultValue: 'PENDING', allowNull: false },
      personnel_ids: { type: Sequelize.ARRAY(Sequelize.UUID), defaultValue: [] },
      missing_personnel_ids: { type: Sequelize.ARRAY(Sequelize.UUID), defaultValue: [] },
      notes: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // Emergencies
    await queryInterface.createTable('emergencies', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      station_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'stations', key: 'id' } },
      level: { type: Sequelize.ENUM('LEVEL_1_CRITICAL','LEVEL_2_SERIOUS','LEVEL_3_ADVISORY'), allowNull: false },
      type: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      triggered_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      triggered_by: { type: Sequelize.STRING, allowNull: false },
      roll_call_snapshot: { type: Sequelize.JSONB },
      inventory_snapshot: { type: Sequelize.JSONB },
      status: { type: Sequelize.ENUM('ACTIVE','RESOLVED','ESCALATED'), defaultValue: 'ACTIVE', allowNull: false },
      resolved_at: { type: Sequelize.DATE },
      resolution_notes: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // Notifications
    await queryInterface.createTable('notifications', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      emergency_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'emergencies', key: 'id' }, onDelete: 'CASCADE' },
      recipient: { type: Sequelize.STRING, allowNull: false },
      channel: { type: Sequelize.ENUM('EMAIL','SMS','DASHBOARD','WHATSAPP'), allowNull: false },
      sent_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      status: { type: Sequelize.ENUM('PENDING','SENT','DELIVERED','FAILED'), defaultValue: 'PENDING', allowNull: false },
      error_message: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // Assets
    await queryInterface.createTable('assets', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      asset_id: { type: Sequelize.STRING, allowNull: false, unique: true },
      name: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.ENUM('MOVABLE','IMMOVABLE','CONSUMABLE'), allowNull: false },
      category: { type: Sequelize.ENUM('VEHICLE','EQUIPMENT','GENERATOR','CONTAINER','BUILDING','INFRASTRUCTURE','FUEL','FOOD','MEDICAL','SPARE_PARTS'), allowNull: false },
      station_id: { type: Sequelize.UUID, references: { model: 'stations', key: 'id' }, onDelete: 'SET NULL' },
      location: { type: Sequelize.JSONB },
      status: { type: Sequelize.ENUM('ACTIVE','IN_MAINTENANCE','DECOMMISSIONED','IN_TRANSIT'), defaultValue: 'ACTIVE', allowNull: false },
      purchase_date: { type: Sequelize.DATEONLY, allowNull: false },
      value: { type: Sequelize.FLOAT, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // Receipt Confirmations
    await queryInterface.createTable('receipt_confirmations', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      cargo_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'cargo', key: 'id' }, onDelete: 'CASCADE' },
      hub: { type: Sequelize.STRING, allowNull: false },
      timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      condition: { type: Sequelize.ENUM('INTACT','DAMAGED','MISSING'), allowNull: false },
      confirmed_by: { type: Sequelize.STRING, allowNull: false },
      notes: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // Maintenance Schedules
    await queryInterface.createTable('maintenance_schedules', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      asset_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'assets', key: 'id' }, onDelete: 'CASCADE' },
      scheduled_date: { type: Sequelize.DATEONLY, allowNull: false },
      completed_date: { type: Sequelize.DATEONLY },
      type: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      status: { type: Sequelize.ENUM('SCHEDULED','IN_PROGRESS','COMPLETED','CANCELLED'), defaultValue: 'SCHEDULED', allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // Performance indexes
    await queryInterface.addIndex('cargo', ['expedition_id']);
    await queryInterface.addIndex('cargo', ['status']);
    await queryInterface.addIndex('cargo', ['priority', 'stowage_order']);
    await queryInterface.addIndex('inventories', ['station_id', 'category']);
    await queryInterface.addIndex('inventories', ['depletion_date']);
    await queryInterface.addIndex('emergencies', ['station_id', 'status']);
    await queryInterface.addIndex('emergencies', ['level', 'triggered_at']);
    await queryInterface.addIndex('personnel', ['expedition_id']);
    await queryInterface.addIndex('personnel', ['status']);
  },

  async down(queryInterface) {
    const tables = [
      'maintenance_schedules', 'receipt_confirmations', 'assets',
      'notifications', 'emergencies', 'roll_calls', 'personnel',
      'consumption_histories', 'inventories', 'cargo', 'containers',
      'expeditions', 'stations', 'users',
    ];
    for (const table of tables) {
      await queryInterface.dropTable(table);
    }
  },
};
