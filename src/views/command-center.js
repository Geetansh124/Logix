// ═══════════════════════════════════════════════════════════════════
// LOGIX — Command Center View (Blueprint §3)
// Operations room: 10-second situational awareness
// ═══════════════════════════════════════════════════════════════════

function renderCommandCenter() {
  const el = document.getElementById('view-command-center');
  if (!el) return;

  const activeExp = DB.expeditions.filter(e => e.status !== 'COMPLETED');
  const totalPersonnel = DB.personnel.length;
  const deployedPersonnel = DB.personnel.filter(p => p.movement === 'POLAR_STATION' || p.movement === 'VESSEL').length;
  const activeIncidents = DB.incidents.filter(i => i.status === 'ACTIVE').length;
  const cargoInTransit = DB.cargo.filter(c => ['DISPATCHED','PORT_TRANSIT','VESSEL_AIR'].includes(c.state)).length;
  const criticalInventory = DB.inventoryItems.filter(i => getBalance(i.id) <= i.minThreshold).length;
  const assetsAtRisk = DB.assets.filter(a => a.riskLevel === 'HIGH' || a.riskLevel === 'MEDIUM').length;
  const readiness = getPersonnelReadiness();
  const pendingDecisions = DB.decisions.filter(d => d.status === 'PENDING').length;
  const unackAlerts = DB.alerts.filter(a => a.status === 'UNACKNOWLEDGED').length;

  // Readiness percentages
  const cargoReady = DB.cargo.length ? pct(DB.cargo.filter(c => c.state === 'INVENTORY_POSTED').length, DB.cargo.length) : 0;
  const invReady = DB.inventoryItems.length ? pct(DB.inventoryItems.filter(i => getBalance(i.id) > i.safetyStock).length, DB.inventoryItems.length) : 0;
  const perReady = readiness.total ? pct(readiness.medical, readiness.total) : 0;
  const astReady = DB.assets.length ? pct(DB.assets.filter(a => a.status === 'OPERATIONAL' || a.status === 'DEPLOYED').length, DB.assets.length) : 0;

  el.innerHTML = `
    <div class="fade-in">
      <!-- Stat Cards -->
      <div class="stat-grid" style="margin-bottom:16px">
        <div class="stat-card">
          <span class="stat-label">Active Expeditions</span>
          <span class="stat-value">${activeExp.length}</span>
          <span class="stat-sub">${activeExp.filter(e=>e.status==='IN-PROGRESS').length} in progress</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Stations</span>
          <span class="stat-value">${DB.stations.length}</span>
          <span class="stat-sub">${DB.stations.filter(s=>s.status==='OPERATIONAL').length} operational</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Personnel</span>
          <span class="stat-value">${deployedPersonnel}/${totalPersonnel}</span>
          <span class="stat-sub">deployed</span>
        </div>
        <div class="stat-card ${cargoInTransit > 0 ? '' : 'success'}">
          <span class="stat-label">Cargo In Transit</span>
          <span class="stat-value">${cargoInTransit}</span>
          <span class="stat-sub">${DB.cargo.length} total shipments</span>
        </div>
        <div class="stat-card ${criticalInventory > 0 ? 'critical' : 'success'}">
          <span class="stat-label">Critical Inventory</span>
          <span class="stat-value">${criticalInventory}</span>
          <span class="stat-sub">items below threshold</span>
        </div>
        <div class="stat-card ${activeIncidents > 0 ? 'critical' : 'success'}">
          <span class="stat-label">Active Emergencies</span>
          <span class="stat-value">${activeIncidents}</span>
          <span class="stat-sub">${DB.incidents.length} total incidents</span>
        </div>
        <div class="stat-card ${assetsAtRisk > 0 ? 'warning' : 'success'}">
          <span class="stat-label">Assets at Risk</span>
          <span class="stat-value">${assetsAtRisk}</span>
          <span class="stat-sub">${DB.assets.length} tracked</span>
        </div>
        <div class="stat-card ${pendingDecisions > 0 ? 'warning' : 'success'}">
          <span class="stat-label">Pending Decisions</span>
          <span class="stat-value">${pendingDecisions}</span>
          <span class="stat-sub">${unackAlerts} unack alerts</span>
        </div>
      </div>

      <div class="grid-2">
        <!-- Mission Readiness -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Mission Readiness</span>
          </div>
          ${renderReadinessBar('Cargo', cargoReady)}
          ${renderReadinessBar('Inventory', invReady)}
          ${renderReadinessBar('Personnel', perReady)}
          ${renderReadinessBar('Assets', astReady)}
        </div>

        <!-- Critical Alerts -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Critical Alerts</span>
            <span class="card-badge" style="background:var(--danger);color:#fff">${unackAlerts}</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${DB.alerts.filter(a => a.status === 'UNACKNOWLEDGED').map(a => `
              <div style="padding:8px;border-radius:6px;background:var(--${a.severity==='HIGH'?'danger':'warning'}-bg);border:1px solid var(--${a.severity==='HIGH'?'danger':'warning'}-border);font-size:11px">
                <div class="flex-between">
                  <span class="font-bold" style="color:var(--${a.severity==='HIGH'?'danger':'warning'})">${a.severity === 'HIGH' ? '🔴' : '🟠'} ${a.title}</span>
                  <button class="btn btn-ghost btn-sm" onclick="acknowledgeAlert('${a.id}')">ACK</button>
                </div>
                <div class="text-muted text-xs mt-sm">${a.what}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="grid-2" style="margin-top:4px">
        <!-- Expedition Status -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Active Expeditions</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${activeExp.map(exp => {
              const prog = exp.distanceKm > 0 ? pct(exp.completedKm, exp.distanceKm) : 0;
              return `
                <div style="padding:8px;border-radius:6px;border:1px solid var(--border);background:var(--bg-secondary);font-size:11px">
                  <div class="flex-between mb-sm">
                    <span class="font-bold">${exp.id}: ${exp.name}</span>
                    <span class="status status-${exp.status==='IN-PROGRESS'?'in-progress':exp.status==='EN-ROUTE'?'active':'pending'}">${exp.status}</span>
                  </div>
                  <div class="text-xs text-muted mb-sm">${exp.route}</div>
                  <div class="flex-between text-xs mb-sm">
                    <span>Progress</span>
                    <span class="font-bold">${fmtNum(exp.completedKm)} / ${fmtNum(exp.distanceKm)} km (${prog}%)</span>
                  </div>
                  <div class="progress-bar"><div class="progress-fill accent" style="width:${prog}%"></div></div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Decision Queue Preview -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Decision Queue</span>
            <span class="card-badge" style="background:var(--warning);color:#fff">${pendingDecisions}</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${DB.decisions.filter(d => d.status === 'PENDING').map(d => {
              const sev = d.severity === 'HIGH' ? '🔴' : d.severity === 'MEDIUM' ? '🟠' : '🟡';
              return `
                <div style="padding:8px;border-radius:6px;border:1px solid var(--border);font-size:11px;background:var(--bg-card)">
                  <div class="flex-between">
                    <span>${sev} <strong>${d.title}</strong></span>
                  </div>
                  <div class="text-xs text-muted mt-sm">${d.evidence}</div>
                  <div class="text-xs mt-sm" style="color:var(--accent)">→ ${d.proposedAction}</div>
                  <div style="margin-top:6px;display:flex;gap:6px">
                    <button class="btn btn-primary btn-sm" onclick="approveDecision('${d.id}')">Approve</button>
                    <button class="btn btn-ghost btn-sm" onclick="navigateTo('intelligence')">Details</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Station Overview -->
      <div class="card" style="margin-top:4px">
        <div class="card-header">
          <span class="card-title">Station Overview</span>
        </div>
        <table class="data-table">
          <thead><tr><th>Station</th><th>Status</th><th>Population</th><th>Connectivity</th><th>Diesel (days)</th><th>Incidents</th></tr></thead>
          <tbody>
            ${DB.stations.map(s => {
              const diesel = DB.inventoryItems.find(i => i.name.includes('Diesel') && i.station === s.id);
              const dieselDays = diesel ? getDaysOfSupply(diesel.id) : '—';
              const incidents = DB.incidents.filter(i => i.stationId === s.id && i.status === 'ACTIVE').length;
              return `<tr>
                <td class="font-bold">${s.name}</td>
                <td><span class="status status-operational">${s.status}</span></td>
                <td>${s.population} / ${s.capacity}</td>
                <td><span class="status status-${s.connectivity==='SATELLITE'?'warning':'operational'}">${s.connectivity}</span></td>
                <td class="${dieselDays !== '—' && dieselDays < 30 ? 'text-danger font-bold' : ''}">${dieselDays !== '—' ? dieselDays + ' days' : dieselDays}</td>
                <td>${incidents > 0 ? `<span class="status status-critical">${incidents}</span>` : '<span class="text-muted">0</span>'}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  lucide.createIcons();
}

function renderReadinessBar(label, value) {
  const color = value >= 80 ? 'success' : value >= 50 ? 'warning' : 'danger';
  return `
    <div style="margin-bottom:10px">
      <div class="flex-between text-xs mb-sm">
        <span>${label}</span>
        <span class="font-bold mono">${value}%</span>
      </div>
      <div class="progress-bar"><div class="progress-fill ${color}" style="width:${value}%"></div></div>
    </div>
  `;
}

function acknowledgeAlert(alertId) {
  const alert = DB.alerts.find(a => a.id === alertId);
  if (alert) {
    alert.status = 'ACKNOWLEDGED';
    addAuditEvent(APP.currentUser, 'ALERT_ACKNOWLEDGED', 'alert', alertId);
    addNotification(`Alert acknowledged: ${alert.title}`, 'INFO');
    renderCommandCenter();
    renderAlertBanner();
    renderSidebar();
  }
}

function approveDecision(decId) {
  const dec = DB.decisions.find(d => d.id === decId);
  if (dec) {
    dec.status = 'APPROVED';
    dec.approvedBy = APP.currentUser;
    addAuditEvent(APP.currentUser, 'DECISION_APPROVED', 'decision', decId);
    addNotification(`Decision approved: ${dec.title}`, 'INFO');
    renderCommandCenter();
    renderSidebar();
  }
}
