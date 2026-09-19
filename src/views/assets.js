// ═══════════════════════════════════════════════════════════════════
// LOGIX — Asset Management & Predictive Maintenance (Blueprint §14-15)
// Lifecycle, maintenance tracking, failure risk indicators
// ═══════════════════════════════════════════════════════════════════

function renderAssets() {
  const el = document.getElementById('view-assets');
  if (!el) return;

  const assetStates = ['PLANNED','PROCURED','IN_TRANSIT','RECEIVED','DEPLOYED','OPERATIONAL','MAINTENANCE','OUT_OF_SERVICE','RETIRED'];
  const highRisk = DB.assets.filter(a => a.riskLevel === 'HIGH' || a.riskLevel === 'MEDIUM');

  el.innerHTML = `
    <div class="fade-in">
      <div class="flex-between mb-sm">
        <span class="card-title" style="font-size:14px">Asset Management</span>
        <span class="status status-${highRisk.length ? 'warning' : 'operational'}">${highRisk.length} at risk</span>
      </div>

      <!-- Asset Overview -->
      <div class="stat-grid" style="margin-bottom:16px">
        <div class="stat-card success">
          <span class="stat-label">Operational</span>
          <span class="stat-value">${DB.assets.filter(a => a.status === 'OPERATIONAL' || a.status === 'DEPLOYED').length}</span>
        </div>
        <div class="stat-card warning">
          <span class="stat-label">Maintenance</span>
          <span class="stat-value">${DB.assets.filter(a => a.status === 'MAINTENANCE').length}</span>
        </div>
        <div class="stat-card critical">
          <span class="stat-label">High Risk</span>
          <span class="stat-value">${DB.assets.filter(a => a.riskLevel === 'HIGH').length}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Total Tracked</span>
          <span class="stat-value">${DB.assets.length}</span>
        </div>
      </div>

      <!-- Predictive Maintenance Alerts -->
      ${highRisk.length ? `
        <div class="card" style="border-left:3px solid var(--warning)">
          <div class="card-header">
            <span class="card-title">Predictive Maintenance Alerts</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px">
            ${highRisk.map(a => {
              const hrsToMaint = a.nextMaintenance ? Math.max(0, Math.ceil((new Date(a.nextMaintenance) - new Date()) / 3600000)) : null;
              const riskColor = a.riskLevel === 'HIGH' ? 'danger' : 'warning';
              return `
                <div style="padding:12px;border:1px solid var(--${riskColor}-border);border-radius:8px;background:var(--${riskColor}-bg)">
                  <div class="flex-between mb-sm">
                    <span class="font-bold text-sm">${a.name}</span>
                    <span class="status status-${riskColor}">${a.riskLevel} RISK</span>
                  </div>
                  <div class="text-xs">
                    <div class="flex-between mb-sm"><span class="text-muted">Status</span><span class="font-bold">${a.status}</span></div>
                    <div class="flex-between mb-sm"><span class="text-muted">Runtime</span><span class="mono">${fmtNum(a.runtimeHrs)} hrs</span></div>
                    <div class="flex-between mb-sm"><span class="text-muted">Next Service</span><span class="mono font-bold">${hrsToMaint !== null ? hrsToMaint + ' hrs' : 'TBD'}</span></div>
                    <div class="flex-between mb-sm"><span class="text-muted">Maint. Interval</span><span class="mono">${a.maintenanceIntervalHrs} hrs</span></div>
                  </div>
                  <div style="margin-top:8px;padding:8px;background:var(--bg-card);border-radius:6px;font-size:10px;border:1px solid var(--border)">
                    <div class="font-bold mb-sm">Risk Assessment</div>
                    <div>• Observed: Runtime ${fmtNum(a.runtimeHrs)} hrs, interval ${a.maintenanceIntervalHrs} hrs</div>
                    <div>• Calculated: ${a.riskLevel} risk based on usage trajectory</div>
                    ${a.riskLevel === 'HIGH' ? '<div>• Alert: Maintenance overdue or imminent failure indicators</div>' : ''}
                    <div class="text-muted mt-sm italic">Method: Rule-based heuristic (runtime/interval ratio + fault history)</div>
                  </div>
                  <div style="margin-top:8px;display:flex;gap:6px">
                    <button class="btn btn-primary btn-sm" onclick="scheduleAssetMaintenance('${a.id}')">Schedule Maintenance</button>
                    <button class="btn btn-ghost btn-sm" onclick="addNotification('Asset ${a.id} details viewed','INFO')">Full History</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- All Assets Table -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Asset Register</span>
        </div>
        <table class="data-table">
          <thead><tr><th>Asset</th><th>Type</th><th>Make/Model</th><th>Station</th><th>Status</th><th>Runtime</th><th>Risk</th><th>Next Maint.</th></tr></thead>
          <tbody>
            ${DB.assets.map(a => {
              const statusClass = (a.status === 'OPERATIONAL' || a.status === 'DEPLOYED') ? 'operational' : a.status === 'MAINTENANCE' ? 'warning' : a.status === 'PLANNED' ? 'pending' : 'critical';
              const riskClass = a.riskLevel === 'HIGH' ? 'critical' : a.riskLevel === 'MEDIUM' ? 'warning' : 'operational';
              return `<tr>
                <td class="font-bold">${a.name}</td>
                <td>${a.type}</td>
                <td class="text-xs">${a.make} ${a.model}</td>
                <td>${DB.stations.find(s=>s.id===a.stationId)?.name || '—'}</td>
                <td><span class="status status-${statusClass}">${a.status}</span></td>
                <td class="mono">${fmtNum(a.runtimeHrs)} hrs</td>
                <td><span class="status status-${riskClass}">${a.riskLevel}</span></td>
                <td class="mono">${fmtDate(a.nextMaintenance)}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Asset Lifecycle -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Asset Lifecycle Pipeline</span>
        </div>
        ${DB.assets.slice(0, 3).map(a => `
          <div style="padding:8px;margin-bottom:8px;border:1px solid var(--border);border-radius:6px;font-size:11px">
            <div class="font-bold mb-sm">${a.name} (${a.serial})</div>
            ${renderPipeline(assetStates, a.status)}
          </div>
        `).join('')}
      </div>
    </div>
  `;
  lucide.createIcons();
}

function scheduleAssetMaintenance(assetId) {
  const asset = DB.assets.find(a => a.id === assetId);
  if (!asset) return;
  const prevStatus = asset.status;
  asset.status = 'MAINTENANCE';
  asset.lastMaintenance = new Date().toISOString().split('T')[0];
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 60);
  asset.nextMaintenance = nextDate.toISOString().split('T')[0];
  asset.riskLevel = 'LOW';
  addAuditEvent(APP.currentUser, 'ASSET_MAINTENANCE_SCHEDULED', 'asset', assetId, prevStatus, 'MAINTENANCE');
  addNotification(`Maintenance scheduled for ${asset.name}`, 'INFO');
  queueOfflineAction('asset', assetId, 'MAINTENANCE_SCHEDULED', {});
  renderAssets();
  renderSidebar();
}
