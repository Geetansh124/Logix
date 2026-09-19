// ═══════════════════════════════════════════════════════════════════
// LOGIX — Intelligence Center (Blueprint §9, §11, §26-28)
// Forecasting, resupply optimizer, explainable alerts, what-if, decisions
// ═══════════════════════════════════════════════════════════════════

let forecastChartInstance = null;

function renderIntelligence() {
  const el = document.getElementById('view-intelligence');
  if (!el) return;

  const pendingDec = DB.decisions.filter(d => d.status === 'PENDING');
  const diesel = DB.inventoryItems.find(i => i.id === 'INV-001');
  const dieselBalance = getBalance('INV-001');
  const dieselDos = getDaysOfSupply('INV-001');
  const nextResupply = DB.transports.find(t => t.destination === 'STN-001');

  el.innerHTML = `
    <div class="fade-in">
      <div class="flex-between mb-sm">
        <span class="card-title" style="font-size:14px">Intelligence & Decision Support</span>
      </div>

      <!-- Resupply Intelligence -->
      <div class="card" style="border-left:3px solid var(--accent)">
        <div class="card-header">
          <span class="card-title">Resupply Recommendation — Maitri</span>
          <span class="card-badge" style="background:var(--accent);color:#fff">AI-Assisted</span>
        </div>
        <div class="grid-2" style="gap:16px">
          <div>
            <table class="data-table">
              <thead><tr><th>Item</th><th>Suggested Qty</th></tr></thead>
              <tbody>
                <tr><td>Diesel</td><td class="mono font-bold">8,000 L</td></tr>
                <tr><td>Medical Supplies</td><td class="mono font-bold">120 units</td></tr>
                <tr><td>Generator Filters</td><td class="mono font-bold">24 pcs</td></tr>
                <tr><td>Batteries</td><td class="mono font-bold">180 pcs</td></tr>
                <tr><td>Food Rations</td><td class="mono font-bold">1,200 kg</td></tr>
              </tbody>
            </table>
          </div>
          <div class="text-xs" style="display:flex;flex-direction:column;gap:6px">
            <div class="flex-between"><span class="text-muted">Projected Weight</span><span class="font-bold mono">3.8 t</span></div>
            <div class="flex-between"><span class="text-muted">Projected Volume</span><span class="font-bold mono">14.2 m³</span></div>
            <div class="flex-between"><span class="text-muted">Coverage Before</span><span class="font-bold mono text-danger">${dieselDos} days</span></div>
            <div class="flex-between"><span class="text-muted">Coverage After</span><span class="font-bold mono text-success">${dieselDos + 29} days</span></div>
            <hr style="border:none;border-top:1px solid var(--border)">
            <div class="text-muted italic">Method: Heuristic — average consumption × safety factor × transport window</div>
            <div class="text-muted">Data: Inventory ledger + consumption records + transport schedule</div>
            <div class="text-muted">Updated: ${new Date().toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'})} IST</div>
          </div>
        </div>
      </div>

      <!-- Demand Forecast Chart -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Demand Forecasting</span>
          <span class="card-badge" style="background:var(--info);color:#fff">SES Model</span>
        </div>
        <div style="height:220px"><canvas id="intelligenceForecastChart"></canvas></div>
        <div class="text-xs text-muted mt-sm italic">
          Method: Simple Exponential Smoothing (α=0.3). Baseline heuristic — insufficient history for seasonal models.
        </div>
      </div>

      <!-- Explainable Alerts -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Explainable Alerts</span>
          <span class="card-badge" style="background:var(--warning);color:#fff">${DB.alerts.length}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${DB.alerts.map(a => {
            const sevColor = a.severity === 'HIGH' ? 'danger' : a.severity === 'MEDIUM' ? 'warning' : 'info';
            return `
              <div style="padding:14px;border:1px solid var(--${sevColor}-border);border-radius:8px;background:var(--${sevColor}-bg)">
                <div class="flex-between mb-sm">
                  <span class="font-bold">${a.severity === 'HIGH' ? '🔴' : a.severity === 'MEDIUM' ? '🟠' : '🟡'} ${a.title}</span>
                  <span class="status status-${a.status === 'ACKNOWLEDGED' ? 'operational' : 'pending'}">${a.status}</span>
                </div>
                <div class="text-xs" style="display:flex;flex-direction:column;gap:4px;margin-top:8px">
                  <div><strong>WHAT?</strong> ${a.what}</div>
                  <div><strong>WHY?</strong></div>
                  <ul style="margin:0;padding-left:16px">${a.why.map(w => `<li>${w}</li>`).join('')}</ul>
                  <div><strong>WHEN?</strong> ${a.when}</div>
                  <div><strong>IMPACT?</strong> ${a.impact}</div>
                  <div><strong>ACTION:</strong> <span style="color:var(--accent)">${a.action}</span></div>
                  <div class="text-muted mt-sm italic">Data checked: ${a.dataChecked} • ${fmtTime(a.timestamp)}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- What-If Simulation -->
      <div class="card" style="border-left:3px solid var(--info)">
        <div class="card-header">
          <span class="card-title">What-If Simulation</span>
          <span class="card-badge" style="background:var(--info);color:#fff">Scenario Engine</span>
        </div>
        <div id="whatif-controls" class="grid-2" style="gap:12px;margin-bottom:12px">
          <div>
            <label class="form-label">Scenario</label>
            <select id="whatif-scenario" class="form-input">
              <option value="delay7">Shipment delayed by 7 days</option>
              <option value="delay14">Shipment delayed by 14 days</option>
              <option value="personnel10">+10 personnel deployed</option>
              <option value="consumption20">Consumption +20%</option>
            </select>
          </div>
          <div style="display:flex;align-items:flex-end">
            <button class="btn btn-primary" onclick="runWhatIf()">Run Simulation</button>
          </div>
        </div>
        <div id="whatif-result"></div>
      </div>

      <!-- Decision Queue -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Decision Queue</span>
          <span class="card-badge" style="background:var(--warning);color:#fff">${pendingDec.length} pending</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${DB.decisions.map(d => {
            const sev = d.severity === 'HIGH' ? '🔴' : d.severity === 'MEDIUM' ? '🟠' : '🟡';
            const isApproved = d.status === 'APPROVED';
            return `
              <div style="padding:12px;border:1px solid var(--border);border-radius:8px;background:${isApproved ? 'var(--success-bg)' : 'var(--bg-card)'}">
                <div class="flex-between mb-sm">
                  <span>${sev} <strong>${d.title}</strong></span>
                  <span class="status status-${isApproved ? 'operational' : 'pending'}">${d.status}</span>
                </div>
                <div class="text-xs"><strong>Evidence:</strong> ${d.evidence}</div>
                <div class="text-xs mt-sm"><strong>Proposed:</strong> <span style="color:var(--accent)">${d.proposedAction}</span></div>
                ${isApproved ? `<div class="text-xs text-success mt-sm">Approved by ${d.approvedBy}</div>` : `
                  <div style="margin-top:8px;display:flex;gap:6px">
                    <button class="btn btn-primary btn-sm" onclick="approveDecision('${d.id}');renderIntelligence()">Approve</button>
                    <button class="btn btn-ghost btn-sm" onclick="addNotification('Decision deferred','INFO')">Defer</button>
                  </div>
                `}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  // Init forecast chart
  setTimeout(() => {
    const ctx = document.getElementById('intelligenceForecastChart');
    if (!ctx) return;
    if (forecastChartInstance) forecastChartInstance.destroy();
    forecastChartInstance = new Chart(ctx.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar (Forecast)', 'Apr (Forecast)'],
        datasets: [
          { label: 'Diesel Consumption (L/day)', data: [400, 415, 430, 445, 450, null, null], borderColor: '#0284c7', backgroundColor: 'rgba(2,132,199,0.1)', fill: true, tension: 0.3 },
          { label: 'SES Forecast', data: [null, null, null, null, 450, 458, 462], borderColor: '#d97706', borderDash: [6, 4], backgroundColor: 'transparent', tension: 0.3 },
          { label: 'Safety Threshold', data: [430, 430, 430, 430, 430, 430, 430], borderColor: '#dc2626', borderDash: [2, 2], backgroundColor: 'transparent', pointRadius: 0 },
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { font: { size: 10, family: "'JetBrains Mono'" } } } }, scales: { y: { beginAtZero: false } } }
    });
  }, 100);

  lucide.createIcons();
}

function runWhatIf() {
  const scenario = document.getElementById('whatif-scenario').value;
  const resultEl = document.getElementById('whatif-result');
  const dieselDos = getDaysOfSupply('INV-001');

  const scenarios = {
    delay7: { label: 'Shipment Delayed +7 Days', diesel: dieselDos - 7, food: 63 - 7, battery: 'MEDIUM', actions: ['Increase diesel reserve', 'Prioritize medical cargo', 'Postpone non-critical cargo'] },
    delay14: { label: 'Shipment Delayed +14 Days', diesel: dieselDos - 14, food: 63 - 14, battery: 'HIGH', actions: ['Emergency fuel rationing', 'Request emergency airlift', 'Activate Protocol B'] },
    personnel10: { label: '+10 Personnel Deployed', diesel: Math.round(dieselDos * 0.82), food: Math.round(56 * 0.82), battery: 'LOW', actions: ['Increase ration allocation', 'Additional medical supplies', 'Expand housing capacity'] },
    consumption20: { label: 'Consumption +20%', diesel: Math.round(dieselDos * 0.83), food: Math.round(56 * 0.83), battery: 'MEDIUM', actions: ['Increase next shipment quantity', 'Implement conservation measures'] },
  };

  const s = scenarios[scenario];
  if (!s) return;

  resultEl.innerHTML = `
    <div style="padding:14px;border:1px solid var(--info-border);border-radius:8px;background:var(--info-bg);margin-top:8px">
      <div class="font-bold text-sm mb-sm">SCENARIO: ${s.label}</div>
      <div class="text-xs" style="font-style:italic;color:var(--text-muted);margin-bottom:8px">⚠ Simulation — not a factual prediction</div>
      <table class="data-table">
        <thead><tr><th>Metric</th><th>Baseline</th><th>Scenario</th><th>Change</th></tr></thead>
        <tbody>
          <tr><td>Diesel Coverage</td><td class="mono">${dieselDos} days</td><td class="mono font-bold ${s.diesel < 20 ? 'text-danger' : ''}">${s.diesel} days</td><td class="mono text-danger">${s.diesel - dieselDos}d</td></tr>
          <tr><td>Food Coverage</td><td class="mono">63 days</td><td class="mono font-bold">${s.food} days</td><td class="mono text-danger">${s.food - 63}d</td></tr>
          <tr><td>Battery Risk</td><td>LOW</td><td class="font-bold ${s.battery === 'HIGH' ? 'text-danger' : s.battery === 'MEDIUM' ? 'text-warning' : ''}">${s.battery}</td><td>—</td></tr>
        </tbody>
      </table>
      <div class="font-bold text-xs mt-md mb-sm">Recommended Actions:</div>
      <ul style="margin:0;padding-left:16px;font-size:11px">${s.actions.map(a => `<li>${a}</li>`).join('')}</ul>
    </div>
  `;
}
