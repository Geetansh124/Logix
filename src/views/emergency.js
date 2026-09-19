// ═══════════════════════════════════════════════════════════════════
// LOGIX — Emergency Operations Center (Blueprint §17-18)
// SOS workflow, incidents, response teams, emergency map
// ═══════════════════════════════════════════════════════════════════

function renderEmergency() {
  const el = document.getElementById('view-emergency');
  if (!el) return;

  const active = DB.incidents.filter(i => i.status === 'ACTIVE');
  const resolved = DB.incidents.filter(i => i.status === 'RESOLVED');

  el.innerHTML = `
    <div class="fade-in">
      <div class="flex-between mb-sm">
        <span class="card-title" style="font-size:14px">Emergency Operations Center</span>
        <button class="btn btn-danger btn-sm" onclick="openSOSModal()"><i data-lucide="siren" style="width:12px;height:12px"></i> Trigger SOS</button>
      </div>

      <!-- Active Incidents -->
      ${active.length ? `
        <div class="card" style="border:2px solid var(--danger)">
          <div class="card-header">
            <span class="card-title" style="color:var(--danger)">🚨 Active Incidents</span>
            <span class="card-badge" style="background:var(--danger);color:#fff">${active.length}</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px">
            ${active.map(inc => `
              <div style="padding:14px;border:1px solid var(--danger-border);border-radius:8px;background:var(--danger-bg)">
                <div class="flex-between mb-sm">
                  <span class="font-bold">${inc.id}: ${inc.type.replace(/_/g,' ')}</span>
                  <span class="status status-critical">${inc.severity}</span>
                </div>
                <div class="text-xs mb-sm">${inc.description}</div>
                <div class="grid-2 text-xs" style="gap:12px;margin:8px 0">
                  <div>
                    <div class="text-muted">Station</div><div class="font-bold">${DB.stations.find(s=>s.id===inc.stationId)?.name || '—'}</div>
                    <div class="text-muted mt-sm">Location</div><div class="mono">${inc.location.lat.toFixed(4)}°, ${inc.location.lng.toFixed(4)}°</div>
                  </div>
                  <div>
                    <div class="text-muted">Reported</div><div class="mono">${fmtDate(inc.timestamp)} ${fmtTime(inc.timestamp)}</div>
                    <div class="text-muted mt-sm">Acknowledged</div><div>${inc.acknowledgedBy ? `${inc.acknowledgedBy} at ${fmtTime(inc.acknowledgedAt)}` : '<span class="text-danger font-bold">UNACKNOWLEDGED</span>'}</div>
                  </div>
                </div>
                <!-- Responders -->
                <div class="text-xs font-bold mb-sm">Response Team</div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
                  ${inc.responders.map(r => {
                    const person = DB.personnel.find(p => p.id === r);
                    return `<span class="status status-info">${person?.name || r}</span>`;
                  }).join('')}
                </div>
                <!-- Actions Timeline -->
                <div class="text-xs font-bold mb-sm">Actions</div>
                ${inc.actions.map((a, i) => `
                  <div style="padding:4px 8px;border-left:2px solid var(--danger);margin-bottom:4px;font-size:10px">
                    <span class="text-muted">#${i+1}</span> ${a}
                  </div>
                `).join('')}
                <div style="margin-top:10px;display:flex;gap:6px">
                  <button class="btn btn-primary btn-sm" onclick="addIncidentAction('${inc.id}')">Add Action</button>
                  <button class="btn btn-ghost btn-sm" onclick="assignResponder('${inc.id}')">Assign Responder</button>
                  <button class="btn btn-danger btn-sm" onclick="resolveIncident('${inc.id}')">Resolve</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : `
        <div class="card" style="text-align:center;padding:32px">
          <div style="font-size:36px;margin-bottom:8px">✅</div>
          <div class="font-bold">No Active Incidents</div>
          <div class="text-xs text-muted mt-sm">All emergency situations resolved</div>
        </div>
      `}

      <!-- Emergency Protocols -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Emergency Protocols</span>
        </div>
        <div class="grid-2" style="gap:10px">
          ${[
            { name: 'Protocol A: Field Medical Emergency', icon: '🏥', desc: 'Medical evacuation, first aid, triage procedures' },
            { name: 'Protocol B: Station Power Loss', icon: '⚡', desc: 'Generator failure, backup activation, fuel conservation' },
            { name: 'Protocol C: Communication Failure', icon: '📡', desc: 'SATCOM backup, relay procedures, position reporting' },
            { name: 'Protocol D: Weather Emergency', icon: '🌨️', desc: 'Whiteout, blizzard, shelter-in-place procedures' },
            { name: 'Protocol E: Equipment Failure', icon: '🔧', desc: 'Vehicle breakdown, field repair, recovery operations' },
            { name: 'Protocol F: Personnel Missing', icon: '🔍', desc: 'Search and rescue, GPS tracking, area coordination' },
          ].map(p => `
            <div style="padding:10px;border:1px solid var(--border);border-radius:6px;font-size:11px;cursor:pointer" onclick="addNotification('Protocol activated: ${p.name}','WARNING')">
              <span style="font-size:18px">${p.icon}</span>
              <div class="font-bold mt-sm">${p.name}</div>
              <div class="text-xs text-muted">${p.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Resolved Incidents -->
      ${resolved.length ? `
        <div class="card">
          <div class="card-header">
            <span class="card-title">Resolved Incidents</span>
          </div>
          <table class="data-table">
            <thead><tr><th>ID</th><th>Type</th><th>Station</th><th>Severity</th><th>Date</th><th>Resolution</th></tr></thead>
            <tbody>
              ${resolved.map(inc => `
                <tr>
                  <td class="mono">${inc.id}</td>
                  <td>${inc.type.replace(/_/g,' ')}</td>
                  <td>${DB.stations.find(s=>s.id===inc.stationId)?.name || '—'}</td>
                  <td><span class="status status-${inc.severity==='CRITICAL'?'critical':inc.severity==='MEDIUM'?'warning':'info'}">${inc.severity}</span></td>
                  <td class="mono">${fmtDate(inc.timestamp)}</td>
                  <td class="text-xs">${inc.resolution || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      <!-- Hazard Map Reference -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Known Hazards</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${DB.hazards.map(h => `
            <div class="flex-between text-xs" style="padding:8px;border:1px solid var(--${h.severity==='HIGH'?'danger':'warning'}-border);border-radius:6px;background:var(--${h.severity==='HIGH'?'danger':'warning'}-bg)">
              <div>
                <span class="font-bold">${h.type.replace(/_/g,' ')}</span>
                <span class="text-muted"> — ${h.description}</span>
              </div>
              <span class="status status-${h.severity==='HIGH'?'critical':'warning'}">${h.severity}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

function addIncidentAction(incId) {
  const action = prompt('Enter action taken:');
  if (!action) return;
  const inc = DB.incidents.find(i => i.id === incId);
  if (inc) {
    inc.actions.push(action);
    addAuditEvent(APP.currentUser, 'INCIDENT_ACTION', 'incident', incId, '', action);
    queueOfflineAction('incident', incId, 'ACTION_ADDED', { action });
    renderEmergency();
  }
}

function assignResponder(incId) {
  const inc = DB.incidents.find(i => i.id === incId);
  if (!inc) return;
  const stationPersonnel = DB.personnel.filter(p => p.stationId === inc.stationId && !inc.responders.includes(p.id));
  if (stationPersonnel.length === 0) { addNotification('No available responders at station', 'WARNING'); return; }
  const responder = stationPersonnel[0];
  inc.responders.push(responder.id);
  addAuditEvent(APP.currentUser, 'RESPONDER_ASSIGNED', 'incident', incId, '', responder.name);
  addNotification(`${responder.name} assigned to ${incId}`, 'INFO');
  renderEmergency();
}

function resolveIncident(incId) {
  const resolution = prompt('Enter resolution summary:');
  if (!resolution) return;
  const inc = DB.incidents.find(i => i.id === incId);
  if (inc) {
    inc.status = 'RESOLVED';
    inc.resolution = resolution;
    addAuditEvent(APP.currentUser, 'INCIDENT_RESOLVED', 'incident', incId, 'ACTIVE', 'RESOLVED', resolution);
    addNotification(`Incident ${incId} resolved`, 'INFO');
    queueOfflineAction('incident', incId, 'RESOLVED', { resolution });
    renderEmergency();
    renderSidebar();
  }
}
