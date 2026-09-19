// ═══════════════════════════════════════════════════════════════════
// LOGIX — Demo Mode & Simulation Controls (Blueprint §40)
// Each simulation triggers real application workflows
// ═══════════════════════════════════════════════════════════════════

function simulateOffline() {
  toggleOnlineState();
  if (!APP.isOnline) {
    addNotification('DEMO: Connection lost — entering offline mode', 'WARNING');
  } else {
    addNotification('DEMO: Connection restored — syncing queued operations', 'INFO');
    triggerSync();
  }
  renderSidebar();
}

function simulateCargoArrival() {
  const cargo = DB.cargo.find(c => c.state === 'VESSEL_AIR');
  if (!cargo) { addNotification('No cargo in transit to simulate arrival', 'WARNING'); return; }
  const prev = cargo.state;
  cargo.state = 'POLAR_ARRIVAL';
  DB.cargoEvents.push({
    id: generateId('EVT'), cargoId: cargo.id, event: 'ARRIVAL_RECORDED',
    timestamp: new Date().toISOString(), userId: 'DEMO',
    location: DB.stations.find(s => s.id === cargo.destinationId)?.name || 'Station',
    details: 'Simulated polar arrival',
  });
  addAuditEvent('DEMO', 'CARGO_ARRIVAL', 'cargo', cargo.id, prev, 'POLAR_ARRIVAL');
  addNotification(`DEMO: ${cargo.id} (${cargo.description}) arrived at station`, 'INFO');
  if (APP.currentView === 'cargo') renderCargo();
  if (APP.currentView === 'command-center') renderCommandCenter();
}

function simulateMissingPackage() {
  const manifest = DB.manifests[0];
  if (!manifest) return;
  manifest.missingPackages.push('PKG-' + Math.floor(Math.random() * 9000 + 1000));
  manifest.scannedPackages--;
  manifest.status = 'EXCEPTION';
  addNotification(`DEMO: New manifest exception on ${manifest.containerId}`, 'WARNING');
  if (APP.currentView === 'cargo') renderCargo();
}

function simulateStockConsumption() {
  const diesel = DB.inventoryItems.find(i => i.id === 'INV-001');
  if (!diesel) return;
  const consumeQty = Math.round(diesel.currentConsumption * 7); // 1 week
  DB.inventoryLedger.push({
    id: generateId('LED'), itemId: 'INV-001', type: 'CONSUMPTION',
    qty: -consumeQty, timestamp: new Date().toISOString(),
    userId: 'DEMO', note: 'Simulated 7-day consumption',
  });
  const newBal = getBalance('INV-001');
  const dos = getDaysOfSupply('INV-001');
  addNotification(`DEMO: Consumed ${fmtNum(consumeQty)}L diesel. Balance: ${fmtNum(newBal)}L (${dos} days)`, dos < 30 ? 'CRITICAL' : 'WARNING');
  if (APP.currentView === 'inventory') renderInventory();
  if (APP.currentView === 'command-center') renderCommandCenter();
  renderSidebar();
}

function simulateShipmentDelay() {
  const transport = DB.transports[0];
  if (!transport) return;
  const oldEta = transport.arrivalEst;
  const d = new Date(transport.arrivalEst);
  d.setDate(d.getDate() + 7);
  transport.arrivalEst = d.toISOString().split('T')[0];
  transport.phase = 'AMBER';
  addNotification(`DEMO: ${transport.id} delayed 7 days. New ETA: ${fmtDate(transport.arrivalEst)}`, 'WARNING');
  if (APP.currentView === 'cargo') renderCargo();
  if (APP.currentView === 'command-center') renderCommandCenter();
}

function simulateSOS() {
  const incident = {
    id: generateId('INC'), type: 'FIELD_MEDICAL', severity: 'CRITICAL',
    status: 'ACTIVE', stationId: 'STN-001', personId: 'PER-001',
    description: 'DEMO: Simulated field medical emergency — expedition team member',
    location: { lat: -70.85 + Math.random() * 0.2, lng: 11.50 + Math.random() * 0.5 },
    timestamp: new Date().toISOString(),
    acknowledgedBy: null, acknowledgedAt: null,
    responders: [], actions: ['SOS signal received', 'Location captured'],
    resolution: null,
  };
  DB.incidents.push(incident);
  addNotification(`🚨 DEMO: SOS triggered — ${incident.description}`, 'CRITICAL');
  if (APP.currentView === 'emergency') renderEmergency();
  if (APP.currentView === 'command-center') renderCommandCenter();
  renderSidebar();
}

function simulateSensorAnomaly() {
  const asset = DB.assets.find(a => a.id === 'AST-001');
  if (!asset) return;
  asset.riskLevel = 'HIGH';
  asset.runtimeHrs += 200;
  addNotification(`DEMO: Sensor anomaly on ${asset.name} — temperature spike detected, risk elevated to HIGH`, 'WARNING');
  if (APP.currentView === 'assets') renderAssets();
  renderSidebar();
}

function simulateResupplyForecast() {
  addNotification('DEMO: Resupply forecast recalculated — view Intelligence tab', 'INFO');
  navigateTo('intelligence');
}

// ── Field Mode (Blueprint §39) ──
function toggleFieldMode() {
  const panel = document.getElementById('field-mode-panel');
  panel.classList.toggle('hidden');
  if (!panel.classList.contains('hidden')) {
    panel.innerHTML = `
      <div class="modal-overlay" onclick="toggleFieldMode()">
        <div class="modal-content" onclick="event.stopPropagation()" style="max-width:360px">
          <div class="flex-between mb-sm">
            <span class="font-bold" style="font-size:14px">📱 Field Mode</span>
            <button onclick="toggleFieldMode()" style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--text-muted)">&times;</button>
          </div>
          <div class="text-xs text-muted mb-sm">Optimized for field operations — large touch targets, offline support</div>
          <div style="display:flex;flex-direction:column;gap:10px">
            ${[
              { icon: '📷', label: 'SCAN CARGO', action: "addNotification('Camera scan ready','INFO');toggleFieldMode()" },
              { icon: '📦', label: 'RECEIVE CARGO', action: "simulateCargoArrival();toggleFieldMode()" },
              { icon: '📝', label: 'UPDATE INVENTORY', action: "navigateTo('inventory');toggleFieldMode()" },
              { icon: '✅', label: 'CHECK IN', action: "queueOfflineAction('personnel','check-in','CHECK_IN',{});addNotification('Check-in recorded','INFO');toggleFieldMode()" },
              { icon: '🚪', label: 'CHECK OUT', action: "queueOfflineAction('personnel','check-out','CHECK_OUT',{});addNotification('Check-out recorded','INFO');toggleFieldMode()" },
              { icon: '⚠️', label: 'REPORT INCIDENT', action: "navigateTo('emergency');toggleFieldMode()" },
              { icon: '🚨', label: 'SOS', action: "openSOSModal();toggleFieldMode()" },
              { icon: '🔄', label: 'SYNC', action: "triggerSync();toggleFieldMode()" },
            ].map(btn => `
              <button onclick="${btn.action}" style="display:flex;align-items:center;gap:12px;padding:16px;border:1px solid var(--border);border-radius:10px;background:var(--bg-card);cursor:pointer;font-size:14px;font-weight:600;font-family:'JetBrains Mono',monospace;text-align:left;color:var(--text-primary)">
                <span style="font-size:24px">${btn.icon}</span>
                <span>${btn.label}</span>
              </button>
            `).join('')}
          </div>
          <div class="text-xs text-muted mt-md" style="text-align:center">
            ${APP.isOnline ? '🟢 ONLINE' : '🟡 OFFLINE — operations queued'} • Queue: ${DB.syncQueue.length}
          </div>
        </div>
      </div>
    `;
  }
}
