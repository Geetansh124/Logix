// ═══════════════════════════════════════════════════════════════════
// LOGIX — Cargo Management 2.0 (Blueprint §5-7)
// Lifecycle, chain-of-custody, manifest integrity, transport windows
// ═══════════════════════════════════════════════════════════════════

function renderCargo() {
  const el = document.getElementById('view-cargo');
  if (!el) return;

  el.innerHTML = `
    <div class="fade-in">
      <div class="flex-between mb-sm">
        <span class="card-title" style="font-size:14px">Cargo Management</span>
        <div style="display:flex;gap:6px">
          <button class="btn btn-primary btn-sm" onclick="showNewCargoForm()"><i data-lucide="plus" style="width:12px;height:12px"></i> New Request</button>
          <button class="btn btn-ghost btn-sm" onclick="showManifestCheck()"><i data-lucide="shield-check" style="width:12px;height:12px"></i> Manifest Check</button>
        </div>
      </div>

      <!-- Transport Windows -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Transport Windows</span>
          <span class="card-badge" style="background:var(--accent);color:#fff">${DB.transports.length} active</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${DB.transports.map(t => {
            const weightPct = pct(t.usedKg, t.capacityKg);
            const volPct = pct(t.usedM3, t.capacityM3);
            const phaseColor = t.phase === 'GREEN' ? 'success' : t.phase === 'AMBER' ? 'warning' : 'danger';
            return `
              <div style="padding:12px;border:1px solid var(--border);border-radius:8px;border-left:3px solid var(--${phaseColor})">
                <div class="flex-between mb-sm">
                  <div>
                    <span class="font-bold text-sm">${t.id}: ${t.name}</span>
                    <span class="status status-${phaseColor}" style="margin-left:8px">${t.phase}</span>
                  </div>
                  <span class="status status-info">${t.mode}</span>
                </div>
                <div class="grid-2 text-xs" style="gap:16px">
                  <div>
                    <div class="text-muted">Departure</div><div class="font-bold">${fmtDate(t.departure)}</div>
                    <div class="text-muted mt-sm">Deadline</div><div class="font-bold">${fmtDate(t.deadline)}</div>
                  </div>
                  <div>
                    <div class="text-muted">ETA</div><div class="font-bold">${fmtDate(t.arrivalEst)}</div>
                    <div class="text-muted mt-sm">Destination</div><div class="font-bold">${DB.stations.find(s=>s.id===t.destination)?.name || t.destination}</div>
                  </div>
                </div>
                <div class="grid-2 mt-sm" style="gap:16px">
                  <div>
                    <div class="flex-between text-xs mb-sm"><span>Weight</span><span class="font-bold">${weightPct}%</span></div>
                    <div class="progress-bar"><div class="progress-fill ${weightPct > 90 ? 'danger' : weightPct > 70 ? 'warning' : 'accent'}" style="width:${weightPct}%"></div></div>
                    <div class="text-xs text-muted mt-sm">${fmtNum(t.usedKg)} / ${fmtNum(t.capacityKg)} kg</div>
                  </div>
                  <div>
                    <div class="flex-between text-xs mb-sm"><span>Volume</span><span class="font-bold">${volPct}%</span></div>
                    <div class="progress-bar"><div class="progress-fill ${volPct > 90 ? 'danger' : volPct > 70 ? 'warning' : 'accent'}" style="width:${volPct}%"></div></div>
                    <div class="text-xs text-muted mt-sm">${t.usedM3} / ${t.capacityM3} m³</div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Cargo Items -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Cargo Shipments</span>
          <span class="card-badge" style="background:var(--info);color:#fff">${DB.cargo.length}</span>
        </div>
        <table class="data-table">
          <thead><tr><th>ID</th><th>Description</th><th>State</th><th>Weight</th><th>Pkgs</th><th>Priority</th><th>Destination</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.cargo.map(c => {
              const stateClass = ['DISPATCHED','VESSEL_AIR','PORT_TRANSIT'].includes(c.state) ? 'active' : c.state === 'INVENTORY_POSTED' ? 'operational' : 'pending';
              const priorityClass = c.priority === 'CRITICAL' ? 'critical' : c.priority === 'HIGH' ? 'warning' : 'info';
              return `<tr>
                <td class="font-bold mono">${c.id}</td>
                <td>${c.description}</td>
                <td><span class="status status-${stateClass}">${c.state.replace(/_/g,' ')}</span></td>
                <td class="mono">${fmtNum(c.weight)} kg</td>
                <td class="mono">${c.packages}</td>
                <td><span class="status status-${priorityClass}">${c.priority}</span></td>
                <td>${DB.stations.find(s=>s.id===c.destinationId)?.name || '—'}</td>
                <td><button class="btn btn-ghost btn-sm" onclick="showCargoDetail('${c.id}')">View</button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Chain of Custody Log -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Chain of Custody Events</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${DB.cargoEvents.slice(-8).reverse().map(e => {
            const isException = e.event.includes('EXCEPTION');
            return `
              <div style="padding:8px;border-radius:6px;background:${isException ? 'var(--danger-bg)' : 'var(--bg-secondary)'};border:1px solid ${isException ? 'var(--danger-border)' : 'var(--border)'};font-size:11px">
                <div class="flex-between">
                  <span><strong>${e.cargoId}</strong> — ${e.event.replace(/_/g,' ')}</span>
                  <span class="text-muted mono">${fmtDate(e.timestamp)} ${fmtTime(e.timestamp)}</span>
                </div>
                <div class="text-xs text-muted mt-sm">${e.details} • ${e.location} • ${e.userId}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Manifest Integrity -->
      <div id="manifest-check-panel" class="hidden"></div>
      <!-- Cargo Detail Modal -->
      <div id="cargo-detail-panel" class="hidden"></div>
    </div>
  `;
  lucide.createIcons();
}

function showCargoDetail(cargoId) {
  const c = DB.cargo.find(x => x.id === cargoId);
  if (!c) return;
  const events = DB.cargoEvents.filter(e => e.cargoId === cargoId);
  const panel = document.getElementById('cargo-detail-panel');
  panel.classList.remove('hidden');
  panel.innerHTML = `
    <div class="card" style="border:2px solid var(--accent)">
      <div class="flex-between mb-sm">
        <span class="font-bold" style="font-size:14px">${c.id}: ${c.description}</span>
        <button class="btn btn-ghost btn-sm" onclick="this.closest('.card').parentElement.classList.add('hidden')">Close</button>
      </div>
      <div class="mb-sm">${renderPipeline(DB.cargoStates, c.state)}</div>
      <div class="grid-3 text-xs" style="margin:12px 0">
        <div><span class="text-muted">Weight</span><div class="font-bold">${fmtNum(c.weight)} kg</div></div>
        <div><span class="text-muted">Volume</span><div class="font-bold">${c.volume} m³</div></div>
        <div><span class="text-muted">Packages</span><div class="font-bold">${c.packages}</div></div>
      </div>
      <div class="font-bold text-xs mb-sm">Custody Timeline</div>
      ${events.map(e => `
        <div style="padding:6px 8px;border-left:2px solid var(--accent);margin-bottom:6px;font-size:10px">
          <div class="font-bold">${e.event.replace(/_/g,' ')}</div>
          <div class="text-muted">${fmtDate(e.timestamp)} • ${e.location} • ${e.userId}</div>
          <div>${e.details}</div>
        </div>
      `).join('')}
      <div style="margin-top:12px;display:flex;gap:6px">
        <button class="btn btn-primary btn-sm" onclick="advanceCargoState('${c.id}')">Advance State</button>
        <button class="btn btn-ghost btn-sm" onclick="addCargoScan('${c.id}')">Log Scan</button>
      </div>
    </div>
  `;
}

function advanceCargoState(cargoId) {
  const c = DB.cargo.find(x => x.id === cargoId);
  if (!c) return;
  const idx = DB.cargoStates.indexOf(c.state);
  if (idx < DB.cargoStates.length - 1) {
    const prev = c.state;
    c.state = DB.cargoStates[idx + 1];
    DB.cargoEvents.push({
      id: generateId('EVT'), cargoId, event: c.state,
      timestamp: new Date().toISOString(), userId: APP.currentUser,
      location: 'System', details: `State advanced from ${prev} to ${c.state}`,
    });
    addAuditEvent(APP.currentUser, 'CARGO_STATE_CHANGE', 'cargo', cargoId, prev, c.state);
    addNotification(`${cargoId} → ${c.state.replace(/_/g,' ')}`, 'INFO');
    renderCargo();
  }
}

function addCargoScan(cargoId) {
  DB.cargoEvents.push({
    id: generateId('EVT'), cargoId, event: 'PACKAGE_SCANNED',
    timestamp: new Date().toISOString(), userId: APP.currentUser,
    location: 'Field Scan', details: 'Manual scan logged',
  });
  queueOfflineAction('cargo_scan', cargoId, 'SCAN', {});
  renderCargo();
}

function showManifestCheck() {
  const panel = document.getElementById('manifest-check-panel');
  panel.classList.toggle('hidden');
  if (panel.classList.contains('hidden')) return;
  panel.innerHTML = `
    <div class="card" style="border:2px solid var(--warning)">
      <div class="card-header">
        <span class="card-title">Manifest Integrity Check</span>
      </div>
      ${DB.manifests.map(m => {
        const isOk = m.status !== 'EXCEPTION';
        return `
          <div style="padding:12px;border:1px solid ${isOk ? 'var(--success-border)' : 'var(--danger-border)'};border-radius:8px;background:${isOk ? 'var(--success-bg)' : 'var(--danger-bg)'}">
            <div class="font-bold text-sm mb-sm">Container ${m.containerId}</div>
            <div class="grid-2 text-xs">
              <div>
                <div class="text-muted">Expected</div>
                <div>Weight: <strong>${fmtNum(m.expectedWeight)} kg</strong></div>
                <div>Packages: <strong>${m.expectedPackages}</strong></div>
              </div>
              <div>
                <div class="text-muted">Scanned</div>
                <div>Weight: <strong>${fmtNum(m.scannedWeight)} kg</strong></div>
                <div>Packages: <strong>${m.scannedPackages}</strong></div>
              </div>
            </div>
            <div style="margin-top:8px"><span class="status status-${isOk ? 'operational' : 'critical'}">${m.status}</span></div>
            ${m.missingPackages.length ? `<div class="text-xs mt-sm text-danger font-bold">Missing: ${m.missingPackages.join(', ')}</div>` : ''}
            ${!isOk ? `<div style="margin-top:8px;display:flex;gap:6px">
              <button class="btn btn-primary btn-sm" onclick="addNotification('Investigation started for ${m.containerId}','WARNING')">Investigate</button>
              <button class="btn btn-danger btn-sm" onclick="addNotification('Shipment held: ${m.containerId}','CRITICAL')">Hold Shipment</button>
              <button class="btn btn-ghost btn-sm" onclick="addNotification('Escalated: ${m.containerId}','WARNING')">Escalate</button>
            </div>` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function showNewCargoForm() {
  addNotification('New cargo request form — use demo mode to simulate', 'INFO');
}
