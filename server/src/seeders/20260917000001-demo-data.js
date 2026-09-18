'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Fixed UUIDs for seed data so they can be referenced across seeders
const STATION_MAITRI = '11111111-1111-1111-1111-111111111111';
const STATION_BHARATI = '22222222-2222-2222-2222-222222222222';
const EXPEDITION_ID = '33333333-3333-3333-3333-333333333333';
const ADMIN_USER_ID = '44444444-4444-4444-4444-444444444444';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // 1. Users
    await queryInterface.bulkInsert('users', [
      {
        id: ADMIN_USER_ID,
        name: 'Admin User',
        email: 'admin@ncpor.gov.in',
        password: hashedPassword,
        role: 'expedition_planner',
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Dr. Rajesh Kumar',
        email: 'director@ncpor.gov.in',
        password: hashedPassword,
        role: 'ncpor_director',
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Priya Sharma',
        email: 'priya.sharma@ncpor.gov.in',
        password: hashedPassword,
        role: 'station_manager',
        created_at: now,
        updated_at: now,
      },
    ]);

    // 2. Stations
    await queryInterface.bulkInsert('stations', [
      {
        id: STATION_MAITRI,
        name: 'Maitri',
        location: JSON.stringify({ lat: -70.7667, lng: 11.7333, elevation: 117 }),
        capacity: 65,
        current_personnel: 25,
        created_at: now,
        updated_at: now,
      },
      {
        id: STATION_BHARATI,
        name: 'Bharati',
        location: JSON.stringify({ lat: -69.4078, lng: 76.1897, elevation: 42 }),
        capacity: 47,
        current_personnel: 18,
        created_at: now,
        updated_at: now,
      },
    ]);

    // 3. Expedition
    await queryInterface.bulkInsert('expeditions', [
      {
        id: EXPEDITION_ID,
        name: 'Indian Antarctic Expedition 44 (IAE-44)',
        start_date: '2026-11-01',
        end_date: '2027-04-15',
        status: 'PLANNING',
        description: '44th Indian Antarctic Expedition — resupply mission to Maitri and Bharati stations',
        created_at: now,
        updated_at: now,
      },
    ]);

    // 4. Containers
    const containers = [
      { id: uuidv4(), container_id: 'NCPOR-C001', type: '20ft Standard', dimensions: JSON.stringify({ length: 6.1, width: 2.44, height: 2.59, weight: 2200 }) },
      { id: uuidv4(), container_id: 'NCPOR-C002', type: '40ft Refrigerated', dimensions: JSON.stringify({ length: 12.2, width: 2.44, height: 2.59, weight: 3800 }) },
      { id: uuidv4(), container_id: 'NCPOR-C003', type: '20ft Standard', dimensions: JSON.stringify({ length: 6.1, width: 2.44, height: 2.59, weight: 2200 }) },
    ];
    await queryInterface.bulkInsert('containers', containers.map((c) => ({ ...c, created_at: now, updated_at: now })));

    // 5. Cargo
    await queryInterface.bulkInsert('cargo', [
      {
        id: uuidv4(), expedition_id: EXPEDITION_ID, container_id: containers[0].id,
        category: 'CRITICAL', priority: 'P0', stowage_order: 1,
        origin_hub: 'NCPOR-Goa', destination_hub: 'Maitri',
        current_location: JSON.stringify({ lat: 15.4909, lng: 73.8278, hub: 'NCPOR-Goa', timestamp: now.toISOString() }),
        status: 'CONSOLIDATED', description: 'Emergency medical supplies', weight_kg: 1500,
        created_at: now, updated_at: now,
      },
      {
        id: uuidv4(), expedition_id: EXPEDITION_ID, container_id: containers[1].id,
        category: 'ESSENTIAL', priority: 'P1', stowage_order: 2,
        origin_hub: 'NCPOR-Goa', destination_hub: 'Bharati',
        current_location: JSON.stringify({ lat: 15.4909, lng: 73.8278, hub: 'NCPOR-Goa', timestamp: now.toISOString() }),
        status: 'CONSOLIDATED', description: 'Food supplies — perishables', weight_kg: 8000,
        created_at: now, updated_at: now,
      },
      {
        id: uuidv4(), expedition_id: EXPEDITION_ID, container_id: containers[2].id,
        category: 'STANDARD', priority: 'P2', stowage_order: 3,
        origin_hub: 'NCPOR-Goa', destination_hub: 'Maitri',
        current_location: JSON.stringify({ lat: 15.4909, lng: 73.8278, hub: 'NCPOR-Goa', timestamp: now.toISOString() }),
        status: 'CONSOLIDATED', description: 'Research equipment and spare parts', weight_kg: 4200,
        created_at: now, updated_at: now,
      },
    ]);

    // 6. Inventory (critical supplies for Maitri)
    await queryInterface.bulkInsert('inventories', [
      { id: uuidv4(), station_id: STATION_MAITRI, item_id: 'FUEL-DIESEL-001', item_name: 'Diesel Fuel', category: 'Fuel', current_stock: 15000, unit: 'liters', location: 'Fuel depot', reorder_point: 5000, safety_stock: 3000, daily_consumption: 250, depletion_date: '2026-11-17', last_updated: now, created_at: now, updated_at: now },
      { id: uuidv4(), station_id: STATION_MAITRI, item_id: 'FOOD-RICE-001', item_name: 'Rice', category: 'Food', current_stock: 500, unit: 'kg', location: 'Warehouse A', reorder_point: 100, safety_stock: 50, daily_consumption: 15, depletion_date: '2026-12-20', last_updated: now, created_at: now, updated_at: now },
      { id: uuidv4(), station_id: STATION_MAITRI, item_id: 'MED-OXY-001', item_name: 'Medical Oxygen', category: 'Medical', current_stock: 200, unit: 'liters', location: 'Medical bay', reorder_point: 50, safety_stock: 30, daily_consumption: 5, depletion_date: '2026-11-26', last_updated: now, created_at: now, updated_at: now },
      { id: uuidv4(), station_id: STATION_BHARATI, item_id: 'FUEL-DIESEL-002', item_name: 'Diesel Fuel', category: 'Fuel', current_stock: 12000, unit: 'liters', location: 'Fuel depot', reorder_point: 4000, safety_stock: 2500, daily_consumption: 200, depletion_date: '2026-11-26', last_updated: now, created_at: now, updated_at: now },
    ]);

    // 7. Personnel
    await queryInterface.bulkInsert('personnel', [
      { id: uuidv4(), name: 'Dr. Anand Verma', role: 'Station Leader', expedition_id: EXPEDITION_ID, status: 'ACTIVE_ON_STATION', current_station: 'Maitri', medical_clearance: '2026-08-15', medical_clearance_expiry: '2027-08-15', rotation_due: '2027-03-01', created_at: now, updated_at: now },
      { id: uuidv4(), name: 'Suresh Patil', role: 'Meteorologist', expedition_id: EXPEDITION_ID, status: 'ACTIVE_ON_STATION', current_station: 'Maitri', medical_clearance: '2026-07-20', medical_clearance_expiry: '2027-07-20', rotation_due: '2027-03-01', created_at: now, updated_at: now },
      { id: uuidv4(), name: 'Dr. Meena Rao', role: 'Medical Officer', expedition_id: EXPEDITION_ID, status: 'ACTIVE_ON_STATION', current_station: 'Bharati', medical_clearance: '2026-09-01', medical_clearance_expiry: '2027-09-01', rotation_due: '2027-04-01', created_at: now, updated_at: now },
      { id: uuidv4(), name: 'Vikram Singh', role: 'Mechanical Engineer', expedition_id: EXPEDITION_ID, status: 'DEPLOYED', current_station: 'Bharati', medical_clearance: '2026-08-10', medical_clearance_expiry: '2027-08-10', rotation_due: '2027-03-15', created_at: now, updated_at: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('personnel', null, {});
    await queryInterface.bulkDelete('inventories', null, {});
    await queryInterface.bulkDelete('cargo', null, {});
    await queryInterface.bulkDelete('containers', null, {});
    await queryInterface.bulkDelete('expeditions', null, {});
    await queryInterface.bulkDelete('stations', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
