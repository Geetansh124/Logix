// ═══════════════════════════════════════════════════════════════════
// LOGIX — Personnel Readiness & Movement (Blueprint §12-13)
// Readiness scorecard, certifications, movement tracking
// ═══════════════════════════════════════════════════════════════════

function renderPersonnel() {
  const el = document.getElementById('view-personnel');
  if (!el) return;

  const people = DB.personnel;
  const readiness = getPersonnelReadiness();
  const actionRequired = people.filter(p => p.readiness === 'ACTION_REQUIRED');

  const movementStates = ['HOME','NCPOR','TRANSIT_HUB','VESSEL','POLAR_STATION','FIELD_CAMP','RETURN'];

  el.innerHTML = `
    <div class="fade-in">
      <div class="flex-between mb-sm">
        <span class="card-title" style="font-size:14px">Personnel Management</span>
        <span class="status status-${actionRequired.length ? 'warning' : 'operational'}">${actionRequired.length} actions required</span>
      </div>

      <!-- Readiness Scorecard -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Personnel Readiness Scorecard</span>
        </div>
        <div class="stat-grid">
          <div class="stat-card ${readiness.medical < readiness.total ? 'warning' : 'success'}">
            <span class="stat-label">Medical Clearance</span>
            <span class="stat-value">${readiness.medical}/${readiness.total}</span>
            <span class="stat-sub">${readiness.total - readiness.medical} pending</span>
          </div>
          <div class="stat-card ${readiness.training < readiness.total ? 'warning' : 'success'}">
            <span class="stat-label">Required Training</span>
            <span class="stat-value">${readiness.training}/${readiness.total}</span>
            <span class="stat-sub">${readiness.total - readiness.training} incomplete</span>
          </div>
          <div class="stat-card ${readiness.certs < readiness.total ? 'warning' : 'success'}">
            <span class="stat-label">Certifications</span>
            <span class="stat-value">${readiness.certs}/${readiness.total}</span>
            <span class="stat-sub">${readiness.total - readiness.certs} issues</span>
          </div>
          <div class="stat-card success">
            <span class="stat-label">Total Personnel</span>
            <span class="stat-value">${readiness.total}</span>
            <span class="stat-sub">across ${DB.stations.length} stations</span>
          </div>
        </div>
      </div>

      <!-- Action Required -->
      ${actionRequired.length ? `
        <div class="card" style="border-left:3px solid var(--warning)">
          <div class="card-header">
            <span class="card-title">⚠ Action Required</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${actionRequired.map(p => {
              const issues = [];
              if (p.medicalClearance !== 'VALID') issues.push(`Medical: ${p.medicalClearance}`);
              if (!p.trainingComplete) issues.push('Training incomplete');
              return `
                <div style="padding:10px;border:1px solid var(--warning-border);border-radius:8px;background:var(--warning-bg);font-size:11px">
                  <div class="flex-between">
                    <span class="font-bold">${p.name}</span>
                    <span class="status status-warning">${p.readiness}</span>
                  </div>
                  <div class="text-xs text-muted mt-sm">${p.role} • ${DB.stations.find(s=>s.id===p.stationId)?.name} • ${issues.join(' • ')}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Personnel Roster -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Personnel Roster</span>
        </div>
        <table class="data-table">
          <thead><tr><th>Name</th><th>Role</th><th>Station</th><th>Callsign</th><th>Medical</th><th>Training</th><th>Certs</th><th>Movement</th><th>Readiness</th></tr></thead>
          <tbody>
            ${people.map(p => `
              <tr>
                <td class="font-bold">${p.name}</td>
                <td>${p.role}</td>
                <td>${DB.stations.find(s=>s.id===p.stationId)?.name || '—'}</td>
                <td class="mono">${p.callsign}</td>
                <td><span class="status status-${p.medicalClearance==='VALID'?'valid':p.medicalClearance==='EXPIRING'?'expiring':'expired'}">${p.medicalClearance}</span></td>
                <td>${p.trainingComplete ? '<span class="text-success font-bold">✓</span>' : '<span class="text-danger font-bold">✗</span>'}</td>
                <td class="text-xs">${p.certifications.length} cert${p.certifications.length !== 1 ? 's' : ''}</td>
                <td><span class="status status-info">${p.movement.replace(/_/g,' ')}</span></td>
                <td><span class="status status-${p.readiness==='READY'?'ready':'warning'}">${p.readiness}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Personnel Movement Tracker -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Movement Pipeline</span>
        </div>
        ${people.slice(0, 4).map(p => `
          <div style="padding:8px;margin-bottom:8px;border:1px solid var(--border);border-radius:6px;font-size:11px">
            <div class="font-bold mb-sm">${p.name} (${p.callsign})</div>
            ${renderPipeline(movementStates, p.movement)}
          </div>
        `).join('')}
      </div>

      <!-- Certification Expiry Timeline -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Certification Expiry Timeline</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${people.sort((a, b) => new Date(a.certExpiry) - new Date(b.certExpiry)).map(p => {
            const daysLeft = Math.ceil((new Date(p.certExpiry) - new Date()) / 86400000);
            const urgency = daysLeft < 30 ? 'danger' : daysLeft < 90 ? 'warning' : 'success';
            return `
              <div class="flex-between text-xs" style="padding:6px 8px;border-radius:4px;border:1px solid var(--${urgency}-border);background:var(--${urgency}-bg)">
                <span><strong>${p.name}</strong> — ${p.certifications.join(', ')}</span>
                <span class="font-bold mono" style="color:var(--${urgency})">${daysLeft > 0 ? daysLeft + 'd' : 'EXPIRED'}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}
