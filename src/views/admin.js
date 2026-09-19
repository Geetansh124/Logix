// ═══════════════════════════════════════════════════════════════════
// LOGIX — Administration (Blueprint §23-24, §36, §45)
// RBAC, audit logs, system health, data quality
// ═══════════════════════════════════════════════════════════════════

function renderAdmin() {
  const el = document.getElementById('view-admin');
  if (!el) return;

  const dataIssues = [
    { entity: 'CRG-1042', issue: 'MISSING', desc: 'Package PKG-8842 not scanned — manifest incomplete' },
    { entity: 'PER-008', issue: 'EXPIRED', desc: 'Medical clearance expired — Dr. N. Iyer' },
    { entity: 'PER-006', issue: 'INCOMPLETE', desc: 'Training not completed — Tech. S. Roy' },
    { entity: 'AST-005', issue: 'OVERDUE', desc: 'Generator G-018 maintenance overdue' },
  ];

  el.innerHTML = `
    <div class="fade-in">
      <div class="flex-between mb-sm">
        <span class="card-title" style="font-size:14px">Administration</span>
      </div>

      <!-- System Health -->
      <div class="card">
        <div class="card-header"><span class="card-title">System Health</span></div>
        <div class="grid-3" style="gap:10px">
          ${[
            { name: 'API', status: 'UP' }, { name: 'Database', status: 'UP' }, { name: 'Storage', status: 'UP' },
            { name: 'Sync Engine', status: APP.isOnline ? 'UP' : 'DEGRADED' }, { name: 'Notifications', status: 'UP' }, { name: 'Forecast Service', status: 'UP' },
            { name: 'AI Copilot', status: 'UP' },
          ].map(s => `
            <div class="flex-between text-xs" style="padding:8px;border:1px solid var(--border);border-radius:6px">
              <span>${s.name}</span>
              <span style="color:${s.status === 'UP' ? 'var(--success)' : 'var(--warning)'};font-weight:700">${s.status === 'UP' ? '🟢' : '🟡'} ${s.status}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- RBAC Roles -->
      <div class="card">
        <div class="card-header"><span class="card-title">Role-Based Access Control</span></div>
        <table class="data-table">
          <thead><tr><th>Role</th><th>Level</th><th>Can Approve</th><th>Can Edit</th><th>Views</th></tr></thead>
          <tbody>
            ${Object.entries(ROLES).map(([role, config]) => `
              <tr ${role === APP.currentRole ? 'style="background:var(--accent-light)"' : ''}>
                <td class="font-bold">${role} ${role === APP.currentRole ? '← You' : ''}</td>
                <td class="mono">${config.level}</td>
                <td>${config.canApprove ? '<span class="text-success font-bold">✓</span>' : '<span class="text-muted">✗</span>'}</td>
                <td>${config.canEdit ? '<span class="text-success font-bold">✓</span>' : '<span class="text-muted">✗</span>'}</td>
                <td class="text-xs">${config.views.length} views</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Data Quality -->
      <div class="card" style="border-left:3px solid var(--warning)">
        <div class="card-header">
          <span class="card-title">Data Quality Issues</span>
          <span class="card-badge" style="background:var(--warning);color:#fff">${dataIssues.length}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${dataIssues.map(d => `
            <div class="flex-between text-xs" style="padding:8px;border:1px solid var(--warning-border);border-radius:6px;background:var(--warning-bg)">
              <div><span class="font-bold mono">${d.entity}</span> <span class="status status-warning">${d.issue}</span> <span class="text-muted">${d.desc}</span></div>
              <button class="btn btn-ghost btn-sm" onclick="addNotification('Investigating: ${d.entity}','INFO')">Fix</button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Connectivity / Devices -->
      <div class="card">
        <div class="card-header"><span class="card-title">Device & Connectivity Status</span></div>
        <table class="data-table">
          <thead><tr><th>Station</th><th>Connectivity</th><th>Last Sync</th><th>Queue</th><th>Status</th></tr></thead>
          <tbody>
            ${DB.stations.map(s => `
              <tr>
                <td class="font-bold">${s.name}</td>
                <td><span class="status status-${s.connectivity === 'NETWORK' ? 'operational' : 'warning'}">${s.connectivity}</span></td>
                <td class="mono">${fmtTime(s.lastSync)}</td>
                <td class="mono">0</td>
                <td><span class="status status-operational">SYNCED</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Full Audit Log -->
      <div class="card">
        <div class="card-header"><span class="card-title">Full Audit Log</span></div>
        <table class="data-table">
          <thead><tr><th>ID</th><th>Time</th><th>Who</th><th>Action</th><th>Entity</th><th>Change</th><th>Device</th><th>Reason</th></tr></thead>
          <tbody>
            ${DB.auditLog.slice().reverse().map(a => `
              <tr>
                <td class="mono text-xs">${a.id}</td>
                <td class="mono text-xs">${fmtDate(a.when)}</td>
                <td class="font-bold text-xs">${a.who}</td>
                <td class="text-xs">${a.what.replace(/_/g,' ')}</td>
                <td class="mono text-xs">${a.entity}</td>
                <td class="text-xs">${a.prevValue ? a.prevValue + ' → ' + a.newValue : '—'}</td>
                <td class="mono text-xs">${a.deviceId}</td>
                <td class="text-xs text-muted">${a.reason || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Sync Queue -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Offline Sync Queue</span>
          <button class="btn btn-primary btn-sm" onclick="triggerSync();renderAdmin()">Sync Now</button>
        </div>
        ${DB.syncQueue.length === 0 ? '<div class="text-xs text-muted" style="text-align:center;padding:16px">Queue empty — all operations synchronized</div>' : `
          <table class="data-table">
            <thead><tr><th>Op ID</th><th>Entity</th><th>Operation</th><th>Status</th><th>Time</th></tr></thead>
            <tbody>
              ${DB.syncQueue.map(op => `
                <tr>
                  <td class="mono text-xs">${op.operationId}</td>
                  <td class="text-xs">${op.entity}:${op.entityId}</td>
                  <td class="text-xs">${op.operation}</td>
                  <td><span class="status status-pending">${op.status}</span></td>
                  <td class="mono text-xs">${fmtTime(op.clientTimestamp)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}
      </div>
    </div>
  `;
  lucide.createIcons();
}
