// ═══════════════════════════════════════════════════════════════════
// LOGIX — Structured Operational Data Model (Blueprint §30-32)
// All entities, seed data, ledger patterns, event models
// ═══════════════════════════════════════════════════════════════════

const DB = {
  // ── Expeditions ──
  expeditions: [
    { id:'EXP-44B', name:'Overland Traverse to South Plateau', route:'Maitri Base → South Plateau Hub', status:'IN-PROGRESS', phase:'TRAVERSE', startDate:'2026-01-15', endDate:'2026-03-20', distanceKm:520, completedKm:320, leadId:'PER-001', stationId:'STN-001' },
    { id:'EXP-44A', name:'Coast-to-Maitri Resupply Vessel', route:'Cape Town → India Bay Coast', status:'EN-ROUTE', phase:'TRANSIT', startDate:'2026-01-08', endDate:'2026-02-28', distanceKm:4440, completedKm:3374, leadId:'PER-003', stationId:'STN-001' },
    { id:'EXP-45C', name:'Ice Core Drilling Reconnaissance', route:'Bharati Station → Dome High Ice', status:'PREPARATION', phase:'PLANNING', startDate:'2026-04-01', endDate:'2026-05-15', distanceKm:180, completedKm:0, leadId:'PER-005', stationId:'STN-002' },
  ],

  // ── Stations ──
  stations: [
    { id:'STN-001', name:'Maitri', type:'Research Station', lat:-70.7668, lng:11.7385, capacity:65, population:48, status:'OPERATIONAL', connectivity:'SATELLITE', lastSync:'2026-09-18T18:42:13Z' },
    { id:'STN-002', name:'Bharati', type:'Research Station', lat:-69.4072, lng:76.1872, capacity:47, population:32, status:'OPERATIONAL', connectivity:'SATELLITE', lastSync:'2026-09-18T18:31:02Z' },
    { id:'STN-003', name:'Himadri', type:'Arctic Station', lat:78.9253, lng:11.9312, capacity:20, population:12, status:'OPERATIONAL', connectivity:'NETWORK', lastSync:'2026-09-18T18:45:00Z' },
  ],

  // ── Personnel ──
  personnel: [
    { id:'PER-001', name:'Capt. V. Sharma', role:'Expedition Leader', stationId:'STN-001', expeditionId:'EXP-44B', medicalClearance:'VALID', medicalExpiry:'2026-06-15', trainingComplete:true, certifications:['Polar Survival','Vehicle Ops','First Aid'], certExpiry:'2026-08-20', callsign:'ALPHA-1', movement:'POLAR_STATION', readiness:'READY' },
    { id:'PER-002', name:'Dr. A. Mukherjee', role:'Medical Officer', stationId:'STN-001', expeditionId:'EXP-44B', medicalClearance:'EXPIRING', medicalExpiry:'2026-01-25', trainingComplete:true, certifications:['Polar Medicine','Emergency Response'], certExpiry:'2026-02-10', callsign:'MEDIC-1', movement:'POLAR_STATION', readiness:'ACTION_REQUIRED' },
    { id:'PER-003', name:'Cmdr. R. Singh', role:'Station Officer', stationId:'STN-001', expeditionId:'EXP-44A', medicalClearance:'VALID', medicalExpiry:'2026-07-30', trainingComplete:true, certifications:['Navigation','Ice Ops','Cargo Handling'], certExpiry:'2026-09-15', callsign:'BRAVO-1', movement:'VESSEL', readiness:'READY' },
    { id:'PER-004', name:'Eng. P. Verma', role:'Logistics Officer', stationId:'STN-001', expeditionId:'EXP-44A', medicalClearance:'VALID', medicalExpiry:'2026-05-20', trainingComplete:true, certifications:['Mechanical Eng','Cargo Ops'], certExpiry:'2026-07-01', callsign:'ENGR-1', movement:'VESSEL', readiness:'READY' },
    { id:'PER-005', name:'Dr. K. Patel', role:'Field Personnel', stationId:'STN-002', expeditionId:'EXP-45C', medicalClearance:'VALID', medicalExpiry:'2026-08-10', trainingComplete:true, certifications:['Glaciology','Drilling Ops','Polar Survival'], certExpiry:'2026-10-01', callsign:'SCIENCE-1', movement:'POLAR_STATION', readiness:'READY' },
    { id:'PER-006', name:'Tech. S. Roy', role:'Field Personnel', stationId:'STN-002', expeditionId:'EXP-45C', medicalClearance:'VALID', medicalExpiry:'2026-09-01', trainingComplete:false, certifications:['Ice Core Analysis'], certExpiry:'2026-11-15', callsign:'TECH-1', movement:'POLAR_STATION', readiness:'ACTION_REQUIRED' },
    { id:'PER-007', name:'Lt. M. Desai', role:'Station Officer', stationId:'STN-002', expeditionId:null, medicalClearance:'VALID', medicalExpiry:'2026-12-01', trainingComplete:true, certifications:['Station Ops','Emergency Response','Comms'], certExpiry:'2027-01-20', callsign:'BHARATI-CMD', movement:'POLAR_STATION', readiness:'READY' },
    { id:'PER-008', name:'Dr. N. Iyer', role:'Medical Officer', stationId:'STN-003', expeditionId:null, medicalClearance:'EXPIRED', medicalExpiry:'2026-01-05', trainingComplete:true, certifications:['Arctic Medicine','Cold Chain Mgmt'], certExpiry:'2026-03-30', callsign:'ARCTIC-MED', movement:'POLAR_STATION', readiness:'ACTION_REQUIRED' },
  ],

  // ── Cargo (with lifecycle states) ──
  cargoStates: ['REQUESTED','REVIEW','APPROVED','PROCURED','RECEIVED','PACKED','CONTAINERIZED','DISPATCHED','PORT_TRANSIT','VESSEL_AIR','POLAR_ARRIVAL','STATION_RECEIVED','INVENTORY_POSTED'],
  cargoExceptionStates: ['ON_HOLD','DELAYED','DAMAGED','MISSING','REJECTED','CANCELLED'],
  cargo: [
    { id:'CRG-1041', description:'Diesel Fuel Drums', weight:8200, volume:12.4, packages:42, containerIds:['C-1041'], state:'VESSEL_AIR', destinationId:'STN-001', transportId:'TRN-001', priority:'HIGH', requestedBy:'PER-004', requestDate:'2025-12-10' },
    { id:'CRG-1042', description:'Medical Supplies & Equipment', weight:4820, volume:8.6, packages:186, containerIds:['C-1042'], state:'DISPATCHED', destinationId:'STN-001', transportId:'TRN-001', priority:'CRITICAL', requestedBy:'PER-002', requestDate:'2025-12-08' },
    { id:'CRG-1043', description:'Generator Spare Parts', weight:1240, volume:3.2, packages:28, containerIds:['C-1043'], state:'PACKED', destinationId:'STN-002', transportId:'TRN-002', priority:'MEDIUM', requestedBy:'PER-007', requestDate:'2025-12-15' },
    { id:'CRG-1044', description:'Food Rations (3-Month)', weight:6400, volume:18.5, packages:320, containerIds:['C-1044','C-1045'], state:'APPROVED', destinationId:'STN-001', transportId:'TRN-001', priority:'HIGH', requestedBy:'PER-003', requestDate:'2025-12-20' },
    { id:'CRG-1045', description:'Scientific Instruments', weight:980, volume:2.1, packages:15, containerIds:['C-1046'], state:'REQUESTED', destinationId:'STN-002', transportId:null, priority:'LOW', requestedBy:'PER-005', requestDate:'2026-01-02' },
  ],

  // ── Cargo Events (Chain of Custody) ──
  cargoEvents: [
    { id:'EVT-001', cargoId:'CRG-1042', event:'CARGO_REQUESTED', timestamp:'2025-12-08T09:00:00Z', userId:'PER-002', location:'NCPOR Goa', details:'Medical supplies request submitted' },
    { id:'EVT-002', cargoId:'CRG-1042', event:'CARGO_APPROVED', timestamp:'2025-12-09T14:30:00Z', userId:'PER-003', location:'NCPOR Goa', details:'Approved by logistics coordinator' },
    { id:'EVT-003', cargoId:'CRG-1042', event:'PACKAGE_SCANNED', timestamp:'2025-12-18T11:00:00Z', userId:'PER-004', location:'Mumbai Port', details:'186 packages scanned, 185 verified' },
    { id:'EVT-004', cargoId:'CRG-1042', event:'CONTAINER_SEALED', timestamp:'2025-12-19T08:00:00Z', userId:'PER-004', location:'Mumbai Port', details:'Container C-1042 sealed' },
    { id:'EVT-005', cargoId:'CRG-1042', event:'EXCEPTION_RAISED', timestamp:'2025-12-18T11:30:00Z', userId:'SYSTEM', location:'Mumbai Port', details:'Manifest mismatch: Expected 186 packages, scanned 185. Missing: PKG-8842' },
  ],

  // ── Containers ──
  containers: [
    { id:'C-1041', cargoIds:['CRG-1041'], weight:8200, sealStatus:'SEALED', location:'Vessel Hold B' },
    { id:'C-1042', cargoIds:['CRG-1042'], weight:4820, sealStatus:'SEALED', location:'Mumbai Port Yard' },
    { id:'C-1043', cargoIds:['CRG-1043'], weight:1240, sealStatus:'OPEN', location:'NCPOR Warehouse' },
    { id:'C-1044', cargoIds:['CRG-1044'], weight:3200, sealStatus:'OPEN', location:'Procurement' },
    { id:'C-1045', cargoIds:['CRG-1044'], weight:3200, sealStatus:'OPEN', location:'Procurement' },
    { id:'C-1046', cargoIds:['CRG-1045'], weight:980, sealStatus:'PENDING', location:'Lab Storage' },
  ],

  // ── Manifests ──
  manifests: [
    { id:'MAN-001', containerId:'C-1042', expectedPackages:186, scannedPackages:185, expectedWeight:4820, scannedWeight:4816, status:'EXCEPTION', missingPackages:['PKG-8842'], transportId:'TRN-001' },
  ],

  // ── Transport Windows ──
  transports: [
    { id:'TRN-001', mode:'VESSEL', name:'MV Vasily Golovnin', departure:'2026-01-20', arrivalEst:'2026-02-28', capacityKg:50000, capacityM3:200, usedKg:19420, usedM3:39.5, phase:'GREEN', deadline:'2026-01-15', destination:'STN-001', status:'LOADING' },
    { id:'TRN-002', mode:'AIR', name:'IL-76 Charter Flight', departure:'2026-03-10', arrivalEst:'2026-03-12', capacityKg:15000, capacityM3:60, usedKg:1240, usedM3:3.2, phase:'GREEN', deadline:'2026-03-05', destination:'STN-002', status:'PLANNING' },
  ],

  // ── Inventory (Ledger-based) ──
  inventoryItems: [
    { id:'INV-001', name:'ATF Arctic Diesel', category:'Fuel', station:'STN-001', unit:'L', minThreshold:5000, safetyStock:8000, maxStock:35000, supplier:'IOC Polar Division', avgConsumption:430, currentConsumption:450 },
    { id:'INV-002', name:'Emergency Trauma Kits', category:'Medical', station:'STN-001', unit:'Kits', minThreshold:12, safetyStock:15, maxStock:50, supplier:'NCPOR Medical', avgConsumption:0.5, currentConsumption:0.8 },
    { id:'INV-003', name:'Food Rations', category:'Food', station:'STN-001', unit:'kg', minThreshold:2000, safetyStock:3500, maxStock:15000, supplier:'NCPOR Logistics', avgConsumption:85, currentConsumption:92 },
    { id:'INV-004', name:'Batteries (AA/AAA)', category:'Consumable', station:'STN-001', unit:'pcs', minThreshold:200, safetyStock:500, maxStock:2000, supplier:'General Stores', avgConsumption:12, currentConsumption:15 },
    { id:'INV-005', name:'Generator Filters', category:'Spare', station:'STN-001', unit:'pcs', minThreshold:6, safetyStock:10, maxStock:30, supplier:'Caterpillar India', avgConsumption:0.3, currentConsumption:0.4 },
    { id:'INV-006', name:'ATF Arctic Diesel', category:'Fuel', station:'STN-002', unit:'L', minThreshold:3000, safetyStock:5000, maxStock:20000, supplier:'IOC Polar Division', avgConsumption:280, currentConsumption:310 },
    { id:'INV-007', name:'Insulin (Cold Chain)', category:'Medical', station:'STN-001', unit:'vials', minThreshold:10, safetyStock:20, maxStock:50, supplier:'NCPOR Medical', avgConsumption:0.5, currentConsumption:0.5, coldChain:true, tempMin:2, tempMax:8, currentTemp:4.2 },
  ],

  // ── Inventory Ledger ──
  inventoryLedger: [
    { id:'LED-001', itemId:'INV-001', type:'RECEIPT', qty:20000, timestamp:'2025-11-01T00:00:00Z', userId:'PER-004', note:'Annual resupply' },
    { id:'LED-002', itemId:'INV-001', type:'CONSUMPTION', qty:-2800, timestamp:'2025-12-01T00:00:00Z', userId:'SYSTEM', note:'December consumption' },
    { id:'LED-003', itemId:'INV-001', type:'CONSUMPTION', qty:-2780, timestamp:'2026-01-01T00:00:00Z', userId:'SYSTEM', note:'January consumption' },
    { id:'LED-004', itemId:'INV-001', type:'ADJUSTMENT', qty:-220, timestamp:'2026-01-10T00:00:00Z', userId:'PER-003', note:'Spillage correction' },
    { id:'LED-005', itemId:'INV-002', type:'RECEIPT', qty:20, timestamp:'2025-11-01T00:00:00Z', userId:'PER-002', note:'Annual stock' },
    { id:'LED-006', itemId:'INV-002', type:'CONSUMPTION', qty:-8, timestamp:'2025-12-15T00:00:00Z', userId:'PER-002', note:'Field deployment & training' },
    { id:'LED-007', itemId:'INV-002', type:'CONSUMPTION', qty:-8, timestamp:'2026-01-10T00:00:00Z', userId:'PER-002', note:'Emergency use' },
    { id:'LED-008', itemId:'INV-003', type:'RECEIPT', qty:8000, timestamp:'2025-11-01T00:00:00Z', userId:'PER-004', note:'Bulk provisions' },
    { id:'LED-009', itemId:'INV-003', type:'CONSUMPTION', qty:-2550, timestamp:'2025-12-01T00:00:00Z', userId:'SYSTEM', note:'December rations' },
    { id:'LED-010', itemId:'INV-003', type:'CONSUMPTION', qty:-2760, timestamp:'2026-01-01T00:00:00Z', userId:'SYSTEM', note:'January rations (+7 personnel)' },
  ],

  // ── Assets ──
  assets: [
    { id:'AST-001', name:'Generator G-024', type:'Generator', make:'Caterpillar', model:'CAT D150', serial:'CAT-D150-7842', stationId:'STN-001', status:'OPERATIONAL', runtimeHrs:4820, installDate:'2023-06-15', lastMaintenance:'2026-01-05', nextMaintenance:'2026-01-16', maintenanceIntervalHrs:500, riskLevel:'MEDIUM', custodian:'PER-004' },
    { id:'AST-002', name:'PistenBully PB-300', type:'Vehicle', make:'Kässbohrer', model:'PB 300', serial:'PB300-1192', stationId:'STN-001', status:'DEPLOYED', runtimeHrs:2140, installDate:'2024-01-10', lastMaintenance:'2025-12-20', nextMaintenance:'2026-02-20', maintenanceIntervalHrs:300, riskLevel:'LOW', custodian:'PER-001' },
    { id:'AST-003', name:'VSAT Terminal', type:'Communication', make:'Hughes', model:'HX200', serial:'HX200-0045', stationId:'STN-001', status:'OPERATIONAL', runtimeHrs:8760, installDate:'2022-01-01', lastMaintenance:'2025-12-01', nextMaintenance:'2026-06-01', maintenanceIntervalHrs:2000, riskLevel:'LOW', custodian:'PER-003' },
    { id:'AST-004', name:'Ice Core Drill Rig', type:'Scientific', make:'KEMS', model:'Eclipse 3', serial:'ECL3-0012', stationId:'STN-002', status:'PLANNED', runtimeHrs:0, installDate:null, lastMaintenance:null, nextMaintenance:null, maintenanceIntervalHrs:200, riskLevel:'LOW', custodian:'PER-005' },
    { id:'AST-005', name:'Generator G-018', type:'Generator', make:'Caterpillar', model:'CAT D100', serial:'CAT-D100-5501', stationId:'STN-002', status:'MAINTENANCE', runtimeHrs:6200, installDate:'2022-08-20', lastMaintenance:'2026-01-12', nextMaintenance:'2026-01-12', maintenanceIntervalHrs:500, riskLevel:'HIGH', custodian:'PER-007' },
  ],

  // ── Incidents ──
  incidents: [
    { id:'INC-001', type:'EQUIPMENT_FAILURE', severity:'MEDIUM', status:'ACTIVE', stationId:'STN-002', personId:'PER-007', description:'Generator G-018 overheating alarm triggered', location:{lat:-69.4072,lng:76.1872}, timestamp:'2026-01-14T06:30:00Z', acknowledgedBy:'PER-007', acknowledgedAt:'2026-01-14T06:35:00Z', responders:['PER-007'], actions:['Shutdown initiated','Coolant check in progress'], resolution:null },
    { id:'INC-002', type:'MEDICAL', severity:'LOW', status:'RESOLVED', stationId:'STN-001', personId:'PER-002', description:'Minor frostbite treatment — field team member', location:{lat:-70.7668,lng:11.7385}, timestamp:'2026-01-10T14:00:00Z', acknowledgedBy:'PER-002', acknowledgedAt:'2026-01-10T14:05:00Z', responders:['PER-002'], actions:['First aid administered','Patient stable'], resolution:'Treated and released' },
  ],

  // ── Alerts ──
  alerts: [
    { id:'ALR-001', type:'STOCKOUT_RISK', severity:'HIGH', entity:'INV-001', stationId:'STN-001', title:'Diesel shortage projected', what:'ATF Arctic Diesel stock may deplete before next resupply', why:['Consumption +18% above baseline','Personnel count +7','Shipment delay +6 days','Stock below safety buffer'], when:'Estimated shortage in 11-15 days', impact:'Station power and heating compromise', action:'Increase next shipment quantity', dataChecked:'Inventory + consumption + transport schedule', timestamp:'2026-01-14T18:42:00Z', status:'UNACKNOWLEDGED' },
    { id:'ALR-002', type:'CERTIFICATION_EXPIRY', severity:'MEDIUM', entity:'PER-002', stationId:'STN-001', title:'Medical officer certification expiring', what:'Dr. A. Mukherjee polar medicine cert expires in 5 days', why:['Certification expiry date approaching'], when:'5 days', impact:'Field medical coverage gap', action:'Initiate certification renewal', dataChecked:'Personnel certifications', timestamp:'2026-01-14T12:00:00Z', status:'UNACKNOWLEDGED' },
    { id:'ALR-003', type:'MANIFEST_MISMATCH', severity:'MEDIUM', entity:'MAN-001', stationId:null, title:'Cargo C-1042 manifest discrepancy', what:'Expected 186 packages, scanned 185', why:['Package PKG-8842 not scanned at Mumbai Port'], when:'During loading inspection', impact:'Medical supply completeness risk', action:'Investigate missing package', dataChecked:'Manifest scan records', timestamp:'2025-12-18T11:30:00Z', status:'UNACKNOWLEDGED' },
    { id:'ALR-004', type:'MAINTENANCE_DUE', severity:'LOW', entity:'AST-001', stationId:'STN-001', title:'Generator G-024 maintenance due', what:'Generator approaching maintenance interval', why:['Runtime 4820hrs, interval at 5000hrs','Two recent temperature anomalies'], when:'Within 11 days (~84 operating hrs)', impact:'Power generation reliability', action:'Schedule maintenance window', dataChecked:'Asset telemetry + maintenance records', timestamp:'2026-01-14T10:00:00Z', status:'UNACKNOWLEDGED' },
  ],

  // ── Audit Log ──
  auditLog: [
    { id:'AUD-001', who:'PER-004', what:'CARGO_STATUS_CHANGE', when:'2025-12-19T08:00:00Z', entity:'CRG-1042', prevValue:'PACKED', newValue:'CONTAINERIZED', deviceId:'FIELD-07', reason:'Container sealed for dispatch' },
    { id:'AUD-002', who:'PER-003', what:'INVENTORY_ADJUSTMENT', when:'2026-01-10T00:00:00Z', entity:'INV-001', prevValue:'14420', newValue:'14200', deviceId:'STATION-01', reason:'Spillage during transfer' },
  ],

  // ── Sync Operations ──
  syncQueue: [],
  syncConflicts: [],

  // ── Notifications ──
  notifications: [
    { id:'NTF-001', alertId:'ALR-001', channel:'IN_APP', priority:'CRITICAL', recipientId:'PER-003', message:'Diesel shortage projected at Maitri — action required', timestamp:'2026-01-14T18:42:00Z', acknowledged:false },
    { id:'NTF-002', alertId:'ALR-002', channel:'IN_APP', priority:'WARNING', recipientId:'PER-002', message:'Your polar medicine certification expires in 5 days', timestamp:'2026-01-14T12:00:00Z', acknowledged:false },
  ],

  // ── Hazards ──
  hazards: [
    { id:'HAZ-001', type:'CREVASSE_ZONE', lat:-70.85, lng:11.50, radius:5000, severity:'HIGH', description:'High-crevasse danger zone near Waypoint Echo', active:true },
    { id:'HAZ-002', type:'WHITEOUT_RISK', lat:-69.50, lng:76.00, radius:15000, severity:'MEDIUM', description:'Seasonal whiteout risk zone — reduced visibility', active:true },
  ],

  // ── Weather ──
  weather: [
    { stationId:'STN-001', temp:-28, windSpeed:45, windDir:'SSE', visibility:800, pressure:982, humidity:65, timestamp:'2026-01-14T18:00:00Z' },
    { stationId:'STN-002', temp:-22, windSpeed:30, windDir:'NNW', visibility:2400, pressure:988, humidity:58, timestamp:'2026-01-14T18:00:00Z' },
    { stationId:'STN-003', temp:-15, windSpeed:20, windDir:'W', visibility:5000, pressure:1005, humidity:72, timestamp:'2026-01-14T18:00:00Z' },
  ],

  // ── Decision Queue ──
  decisions: [
    { id:'DEC-001', alertId:'ALR-001', severity:'HIGH', title:'Maitri diesel resupply shortfall', evidence:'42 days coverage vs 56 days to next resupply = 14-day gap', proposedAction:'Increase next shipment by 8,000L', status:'PENDING', approvedBy:null },
    { id:'DEC-002', alertId:'ALR-003', severity:'MEDIUM', title:'Cargo C-1042 manifest mismatch', evidence:'185/186 packages scanned', proposedAction:'Locate PKG-8842 before vessel departure', status:'PENDING', approvedBy:null },
    { id:'DEC-003', alertId:'ALR-002', severity:'MEDIUM', title:'Certification expiry approaching', evidence:'Dr. Mukherjee cert expires Jan 25', proposedAction:'Initiate renewal process', status:'PENDING', approvedBy:null },
    { id:'DEC-004', alertId:'ALR-004', severity:'LOW', title:'Generator maintenance due', evidence:'84 operating hours remaining', proposedAction:'Schedule 4-hour maintenance window', status:'PENDING', approvedBy:null },
  ],
};

// ── Computed helpers ──
function getBalance(itemId) {
  return DB.inventoryLedger.filter(l => l.itemId === itemId).reduce((sum, l) => sum + l.qty, 0);
}

function getDaysOfSupply(itemId) {
  const item = DB.inventoryItems.find(i => i.id === itemId);
  if (!item || item.currentConsumption <= 0) return Infinity;
  const balance = getBalance(itemId);
  return Math.max(0, Math.round(balance / item.currentConsumption));
}

function getPersonnelReadiness(stationId) {
  const people = DB.personnel.filter(p => !stationId || p.stationId === stationId);
  const total = people.length;
  const medical = people.filter(p => p.medicalClearance === 'VALID').length;
  const training = people.filter(p => p.trainingComplete).length;
  const certs = people.filter(p => p.certifications.length > 0 && p.readiness === 'READY').length;
  return { total, medical, training, certs };
}

function generateId(prefix) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}
