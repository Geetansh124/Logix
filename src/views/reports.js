// ═══════════════════════════════════════════════════════════════════
// LOGIX — Reports & KPIs (Blueprint §46-47)
// Expedition, cargo, inventory, personnel, emergency reports
// ═══════════════════════════════════════════════════════════════════

function renderReports() {
  const el = document.getElementById('view-reports');
  if (!el) return;

  const dieselDos = getDaysOfSupply('INV-001');
  const cargoTotal = DB.cargo.length;
  const cargoDelivered = DB.cargo.filter(c => c.state === 'INVENTORY_POSTED').length;
  const manifestOk = DB.manifests.filter(m => m.status !== 'EXCEPTION').length;
  const manifestTotal = DB.manifests.length;
  const readiness = getPersonnelReadiness();
  const stockouts = DB.inventoryItems.filter(i => getBalance(i.id) <= 0).length;

  el.innerHTML = `
    <div class="fade-in">
      <div class="flex-between mb-sm">
        <span class="card-title" style="font-size:14px">Reports & Key Performance Indicators</span>
        <div style="display:flex;gap:6px">
          <button class="btn btn-primary btn-sm" onclick="addNotification('Report exported as PDF','INFO')"><i data-lucide="download" style="width:12px;height:12px"></i> Export PDF</button>
          <button class="btn btn-ghost btn-sm" onclick="addNotification('CSV export generated','INFO')"><i data-lucide="file-spreadsheet" style="width:12px;height:12px"></i> Export CSV</button>
        </div>
      </div>

      <!-- KPI Dashboard -->
      <div class="card">
        <div class="card-header"><span class="card-title">Logistics KPIs</span></div>
        <div class="stat-grid">
          <div class="stat-card"><span class="stat-label">Cargo Readiness</span><span class="stat-value">${cargoTotal ? pct(cargoDelivered, cargoTotal) : 0}%</span><span class="stat-sub">${cargoDelivered}/${cargoTotal} delivered</span></div>
          <div class="stat-card"><span class="stat-label">On-Time Delivery</span><span class="stat-value">78%</span><span class="stat-sub">Based on ETA adherence</span></div>
          <div class="stat-card"><span class="stat-label">Manifest Accuracy</span><span class="stat-value">${manifestTotal ? pct(manifestOk, manifestTotal) : 100}%</span><span class="stat-sub">${manifestTotal - manifestOk} discrepancies</span></div>
          <div class="stat-card"><span class="stat-label">Discrepancy Count</span><span class="stat-value">${manifestTotal - manifestOk}</span><span class="stat-sub">Pending resolution</span></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">Inventory KPIs</span></div>
        <div class="stat-grid">
          <div class="stat-card ${stockouts > 0 ? 'critical' : 'success'}"><span class="stat-label">Stockout Events</span><span class="stat-value">${stockouts}</span><span class="stat-sub">Current period</span></div>
          <div class="stat-card ${dieselDos < 30 ? 'critical' : dieselDos < 50 ? 'warning' : 'success'}"><span class="stat-label">Diesel Days-of-Supply</span><span class="stat-value">${dieselDos}</span><span class="stat-sub">Maitri station</span></div>
          <div class="stat-card"><span class="stat-label">Inventory Accuracy</span><span class="stat-value">96%</span><span class="stat-sub">Ledger vs physical</span></div>
          <div class="stat-card"><span class="stat-label">Emergency Resupply</span><span class="stat-value">1</span><span class="stat-sub">This expedition cycle</span></div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><span class="card-title">Personnel KPIs</span></div>
          <div style="display:flex;flex-direction:column;gap:8px;font-size:11px">
            <div class="flex-between"><span>Readiness</span><span class="font-bold mono">${readiness.total ? pct(readiness.medical, readiness.total) : 0}%</span></div>
            <div class="flex-between"><span>Cert Compliance</span><span class="font-bold mono">${readiness.total ? pct(readiness.certs, readiness.total) : 0}%</span></div>
            <div class="flex-between"><span>Unresolved Issues</span><span class="font-bold mono">${DB.personnel.filter(p => p.readiness === 'ACTION_REQUIRED').length}</span></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Emergency KPIs</span></div>
          <div style="display:flex;flex-direction:column;gap:8px;font-size:11px">
            <div class="flex-between"><span>Active Incidents</span><span class="font-bold mono">${DB.incidents.filter(i=>i.status==='ACTIVE').length}</span></div>
            <div class="flex-between"><span>Avg Ack Time</span><span class="font-bold mono">5 min</span></div>
            <div class="flex-between"><span>Unresolved</span><span class="font-bold mono">${DB.incidents.filter(i=>i.status==='ACTIVE').length}</span></div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">Digital Platform KPIs</span></div>
        <div class="stat-grid">
          <div class="stat-card"><span class="stat-label">Offline Ops Queued</span><span class="stat-value">${DB.syncQueue.length}</span></div>
          <div class="stat-card success"><span class="stat-label">Sync Success</span><span class="stat-value">99.2%</span></div>
          <div class="stat-card"><span class="stat-label">Conflicts</span><span class="stat-value">${DB.syncConflicts.length}</span></div>
          <div class="stat-card success"><span class="stat-label">Uptime</span><span class="stat-value">99.8%</span></div>
        </div>
      </div>

      <!-- Audit Log Summary -->
      <div class="card">
        <div class="card-header"><span class="card-title">Recent Audit Events</span></div>
        <table class="data-table">
          <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Entity</th><th>Details</th></tr></thead>
          <tbody>
            ${DB.auditLog.slice(-10).reverse().map(a => `
              <tr>
                <td class="mono">${fmtDate(a.when)} ${fmtTime(a.when)}</td>
                <td class="font-bold">${a.who}</td>
                <td>${a.what.replace(/_/g,' ')}</td>
                <td class="mono">${a.entity}</td>
                <td class="text-xs text-muted">${a.prevValue ? a.prevValue + ' → ' + a.newValue : a.reason || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  lucide.createIcons();
}
