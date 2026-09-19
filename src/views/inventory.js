// ═══════════════════════════════════════════════════════════════════
// LOGIX — Inventory Management 2.0 (Blueprint §8-10, §16, §31)
// Ledger-based, days-of-supply, cold-chain, consumables/durables
// ═══════════════════════════════════════════════════════════════════

function renderInventory() {
  const el = document.getElementById('view-inventory');
  if (!el) return;

  const items = DB.inventoryItems.map(item => {
    const balance = getBalance(item.id);
    const dos = getDaysOfSupply(item.id);
    const pctFill = item.maxStock > 0 ? pct(balance, item.maxStock) : 0;
    const status = balance <= item.minThreshold ? 'CRITICAL' : balance <= item.safetyStock ? 'WARNING' : 'NORMAL';
    return { ...item, balance, dos, pctFill, status };
  });

  const critical = items.filter(i => i.status === 'CRITICAL');
  const coldChain = items.filter(i => i.coldChain);

  el.innerHTML = `
    <div class="fade-in">
      <div class="flex-between mb-sm">
        <span class="card-title" style="font-size:14px">Inventory Management</span>
        <button class="btn btn-primary btn-sm" onclick="showLedgerEntry()"><i data-lucide="plus" style="width:12px;height:12px"></i> Record Transaction</button>
      </div>

      <!-- Days of Supply Overview -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Days of Supply — Critical Resources</span>
          <span class="card-badge" style="background:var(--danger);color:#fff">${critical.length} critical</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px">
          ${items.filter(i => i.station === 'STN-001').map(item => {
            const dosColor = item.dos < 20 ? 'danger' : item.dos < 40 ? 'warning' : 'success';
            return `
              <div style="padding:12px;border:1px solid var(--border);border-radius:8px;border-left:3px solid var(--${dosColor})">
                <div class="flex-between mb-sm">
                  <span class="font-bold text-xs">${item.name}</span>
                  <span class="status status-${item.status === 'CRITICAL' ? 'critical' : item.status === 'WARNING' ? 'warning' : 'operational'}">${item.status}</span>
                </div>
                <div class="text-xs text-muted">${item.category} • ${DB.stations.find(s=>s.id===item.station)?.name || item.station}</div>
                <div style="margin:8px 0">
                  <span style="font-size:24px;font-weight:800;font-family:'JetBrains Mono',monospace;color:var(--${dosColor})">${item.dos === Infinity ? '∞' : item.dos}</span>
                  <span class="text-xs text-muted"> days of supply</span>
                </div>
                <div class="flex-between text-xs mb-sm">
                  <span>Stock</span>
                  <span class="font-bold mono">${fmtNum(item.balance)} ${item.unit}</span>
                </div>
                <div class="progress-bar"><div class="progress-fill ${dosColor}" style="width:${item.pctFill}%"></div></div>
                <div class="text-xs text-muted mt-sm">Burn: ${item.currentConsumption} ${item.unit}/day • Min: ${fmtNum(item.minThreshold)} • Safety: ${fmtNum(item.safetyStock)}</div>
                ${item.status === 'CRITICAL' ? `<div class="text-xs text-danger font-bold mt-sm">⚠ Auto-reorder triggered</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Cold Chain Tracking -->
      ${coldChain.length ? `
        <div class="card">
          <div class="card-header">
            <span class="card-title">Cold Chain Monitoring</span>
            <span class="card-badge" style="background:var(--info);color:#fff">Active</span>
          </div>
          ${coldChain.map(item => {
            const tempOk = item.currentTemp >= item.tempMin && item.currentTemp <= item.tempMax;
            return `
              <div style="padding:10px;border:1px solid ${tempOk ? 'var(--success-border)' : 'var(--danger-border)'};border-radius:8px;background:${tempOk ? 'var(--success-bg)' : 'var(--danger-bg)'}">
                <div class="flex-between">
                  <span class="font-bold text-xs">${item.name}</span>
                  <span class="status status-${tempOk ? 'operational' : 'critical'}">${tempOk ? 'NORMAL' : 'EXCURSION'}</span>
                </div>
                <div class="text-xs mt-sm">
                  Current: <strong>${item.currentTemp}°C</strong> • Range: ${item.tempMin}°C – ${item.tempMax}°C
                  • Stock: ${fmtNum(getBalance(item.id))} ${item.unit}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- Full Inventory Table -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">All Inventory Items</span>
        </div>
        <table class="data-table">
          <thead><tr><th>Item</th><th>Category</th><th>Station</th><th>Balance</th><th>Unit</th><th>DoS</th><th>Consumption</th><th>Status</th></tr></thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td class="font-bold">${item.name}</td>
                <td>${item.category}</td>
                <td>${DB.stations.find(s=>s.id===item.station)?.name || item.station}</td>
                <td class="mono font-bold">${fmtNum(item.balance)}</td>
                <td>${item.unit}</td>
                <td class="mono ${item.dos < 20 ? 'text-danger font-bold' : ''}">${item.dos === Infinity ? '∞' : item.dos + 'd'}</td>
                <td class="mono">${item.currentConsumption}/day</td>
                <td><span class="status status-${item.status==='CRITICAL'?'critical':item.status==='WARNING'?'warning':'operational'}">${item.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Inventory Ledger -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Transaction Ledger</span>
          <span class="text-xs text-muted">Append-only event log</span>
        </div>
        <table class="data-table">
          <thead><tr><th>ID</th><th>Item</th><th>Type</th><th>Qty</th><th>Date</th><th>User</th><th>Note</th></tr></thead>
          <tbody>
            ${DB.inventoryLedger.slice().reverse().map(l => {
              const item = DB.inventoryItems.find(i => i.id === l.itemId);
              const typeColor = l.type === 'RECEIPT' ? 'text-success' : l.type === 'CONSUMPTION' ? 'text-danger' : 'text-warning';
              return `<tr>
                <td class="mono">${l.id}</td>
                <td>${item?.name || l.itemId}</td>
                <td class="${typeColor} font-bold">${l.type}</td>
                <td class="mono font-bold ${l.qty > 0 ? 'text-success' : 'text-danger'}">${l.qty > 0 ? '+' : ''}${fmtNum(l.qty)}</td>
                <td class="mono">${fmtDate(l.timestamp)}</td>
                <td>${l.userId}</td>
                <td class="text-muted">${l.note}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div id="ledger-entry-form" class="hidden"></div>
    </div>
  `;
  lucide.createIcons();
}

function showLedgerEntry() {
  const form = document.getElementById('ledger-entry-form');
  form.classList.toggle('hidden');
  if (form.classList.contains('hidden')) return;
  form.innerHTML = `
    <div class="card" style="border:2px solid var(--accent)">
      <div class="card-header">
        <span class="card-title">Record Inventory Transaction</span>
        <button class="btn btn-ghost btn-sm" onclick="this.closest('.card').parentElement.classList.add('hidden')">Cancel</button>
      </div>
      <div class="grid-2" style="gap:12px">
        <div>
          <label class="form-label">Item</label>
          <select id="ledger-item" class="form-input">
            ${DB.inventoryItems.map(i => `<option value="${i.id}">${i.name} (${DB.stations.find(s=>s.id===i.station)?.name})</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="form-label">Type</label>
          <select id="ledger-type" class="form-input">
            <option value="RECEIPT">Receipt (+)</option>
            <option value="CONSUMPTION">Consumption (−)</option>
            <option value="TRANSFER">Transfer (−)</option>
            <option value="ADJUSTMENT">Adjustment (±)</option>
          </select>
        </div>
        <div>
          <label class="form-label">Quantity</label>
          <input type="number" id="ledger-qty" class="form-input" placeholder="Enter quantity" />
        </div>
        <div>
          <label class="form-label">Note</label>
          <input type="text" id="ledger-note" class="form-input" placeholder="Reason / details" />
        </div>
      </div>
      <button class="btn btn-primary mt-md" onclick="submitLedgerEntry()">Submit Transaction</button>
    </div>
  `;
}

function submitLedgerEntry() {
  const itemId = document.getElementById('ledger-item').value;
  const type = document.getElementById('ledger-type').value;
  let qty = parseInt(document.getElementById('ledger-qty').value);
  const note = document.getElementById('ledger-note').value;
  if (isNaN(qty) || qty === 0) { addNotification('Invalid quantity', 'WARNING'); return; }
  if (type === 'CONSUMPTION' || type === 'TRANSFER') qty = -Math.abs(qty);
  const prevBalance = getBalance(itemId);
  DB.inventoryLedger.push({
    id: generateId('LED'), itemId, type, qty,
    timestamp: new Date().toISOString(),
    userId: APP.currentUser, note: note || type,
  });
  const newBalance = getBalance(itemId);
  addAuditEvent(APP.currentUser, 'INVENTORY_TRANSACTION', 'inventory', itemId, String(prevBalance), String(newBalance), note);
  queueOfflineAction('inventory', itemId, type, { qty, note });
  addNotification(`Inventory ${type}: ${qty > 0 ? '+' : ''}${qty} on ${itemId}`, 'INFO');
  renderInventory();
  renderSidebar();
}
