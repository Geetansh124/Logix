// ═══════════════════════════════════════════════════════════════════
// LOGIX — Core Engine (Auth, Routing, RBAC, Offline Sync, Audit)
// Blueprint §19-24, §23, §29
// ═══════════════════════════════════════════════════════════════════

const APP = {
  currentUser: null,
  currentRole: null,
  currentView: 'command-center',
  isOnline: true,
  isDemoMode: true,
  theme: 'light',
  copilotOpen: false,
  sosModalOpen: false,
};

// ── RBAC Permission Matrix (§23) ──
const ROLES = {
  'MoES Oversight':      { views: ['command-center','polar-map','reports','intelligence'], canApprove: false, canEdit: false, level: 1 },
  'NCPOR Coordinator':   { views: ['command-center','polar-map','expeditions','cargo','inventory','personnel','assets','emergency','intelligence','reports','admin'], canApprove: true, canEdit: true, level: 5 },
  'Station Officer':     { views: ['command-center','polar-map','inventory','cargo','personnel','assets','emergency'], canApprove: false, canEdit: true, level: 3 },
  'Logistics Officer':   { views: ['command-center','cargo','inventory','polar-map'], canApprove: false, canEdit: true, level: 2 },
  'Medical Officer':     { views: ['command-center','inventory','personnel','emergency'], canApprove: false, canEdit: true, level: 2 },
  'Field Personnel':     { views: ['command-center','emergency','field-mode'], canApprove: false, canEdit: false, level: 1 },
  'System Administrator':{ views: ['command-center','polar-map','expeditions','cargo','inventory','personnel','assets','emergency','intelligence','reports','admin'], canApprove: true, canEdit: true, level: 5 },
};

// ── Auth ──
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const role = document.getElementById('login-role').value;
  if (!username) return;
  APP.currentUser = username;
  APP.currentRole = role;
  document.getElementById('view-login').classList.add('hidden');
  document.getElementById('view-app').classList.remove('hidden');
  initApp();
}

function handleLogout() {
  APP.currentUser = null;
  APP.currentRole = null;
  document.getElementById('view-app').classList.add('hidden');
  document.getElementById('view-login').classList.remove('hidden');
}

// ── Init ──
function initApp() {
  renderSidebar();
  updateTopbar();
  navigateTo('command-center');
  updateSyncIndicator();
  renderAlertBanner();
  if (APP.isDemoMode) renderDemoPanel();
  lucide.createIcons();
}

// ── Sidebar ──
function renderSidebar() {
  const allowed = ROLES[APP.currentRole]?.views || [];
  const items = [
    { section: 'OPERATIONS' },
    { id: 'command-center', icon: 'layout-dashboard', label: 'Command Center' },
    { id: 'polar-map', icon: 'globe-2', label: 'Polar Digital Twin' },
    { section: 'LOGISTICS' },
    { id: 'cargo', icon: 'package', label: 'Cargo', badge: DB.cargo.filter(c => c.state !== 'INVENTORY_POSTED').length, badgeType: 'info' },
    { id: 'inventory', icon: 'warehouse', label: 'Inventory', badge: DB.inventoryItems.filter(i => getBalance(i.id) <= i.minThreshold).length, badgeType: 'danger' },
    { section: 'WORKFORCE' },
    { id: 'personnel', icon: 'users', label: 'Personnel', badge: DB.personnel.filter(p => p.readiness === 'ACTION_REQUIRED').length, badgeType: 'warning' },
    { id: 'assets', icon: 'hard-drive', label: 'Assets', badge: DB.assets.filter(a => a.riskLevel === 'HIGH').length, badgeType: 'danger' },
    { section: 'SAFETY' },
    { id: 'emergency', icon: 'siren', label: 'Emergency Ops', badge: DB.incidents.filter(i => i.status === 'ACTIVE').length, badgeType: 'danger' },
    { section: 'INTELLIGENCE' },
    { id: 'intelligence', icon: 'brain', label: 'Intelligence' },
    { id: 'reports', icon: 'file-bar-chart', label: 'Reports & KPIs' },
    { section: 'SYSTEM' },
    { id: 'admin', icon: 'settings', label: 'Administration' },
  ];

  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = '';
  items.forEach(item => {
    if (item.section) {
      nav.innerHTML += `<div class="sidebar-section">${item.section}</div>`;
      return;
    }
    if (!allowed.includes(item.id)) return;
    const active = APP.currentView === item.id ? ' active' : '';
    const badge = item.badge ? `<span class="badge badge-${item.badgeType}">${item.badge}</span>` : '';
    nav.innerHTML += `<div class="sidebar-item${active}" onclick="navigateTo('${item.id}')"><i data-lucide="${item.icon}"></i><span>${item.label}</span>${badge}</div>`;
  });
  lucide.createIcons();
}

// ── Navigation ──
function navigateTo(viewId) {
  APP.currentView = viewId;
  document.querySelectorAll('.view-panel').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(`view-${viewId}`);
  if (target) { target.classList.add('active'); target.classList.add('fade-in'); }
  renderSidebar();
  updateTopbar();
  // Render view content
  const renderers = {
    'command-center': renderCommandCenter,
    'polar-map': renderPolarMap,
    'cargo': renderCargo,
    'inventory': renderInventory,
    'personnel': renderPersonnel,
    'assets': renderAssets,
    'emergency': renderEmergency,
    'intelligence': renderIntelligence,
    'reports': renderReports,
    'admin': renderAdmin,
  };
  if (renderers[viewId]) renderers[viewId]();
}

// ── Topbar ──
function updateTopbar() {
  const viewNames = {
    'command-center': 'Command Center', 'polar-map': 'Polar Digital Twin',
    'cargo': 'Cargo Management', 'inventory': 'Inventory', 'personnel': 'Personnel',
    'assets': 'Assets', 'emergency': 'Emergency Operations', 'intelligence': 'Intelligence',
    'reports': 'Reports & KPIs', 'admin': 'Administration',
  };
  document.getElementById('breadcrumb-view').textContent = viewNames[APP.currentView] || APP.currentView;
  document.getElementById('role-badge').textContent = APP.currentRole;
}

// ── Alert Banner ──
function renderAlertBanner() {
  const critical = DB.alerts.find(a => a.severity === 'HIGH' && a.status === 'UNACKNOWLEDGED');
  const banner = document.getElementById('alert-banner');
  if (critical) {
    banner.classList.remove('hidden');
    banner.className = `alert-banner ${critical.severity === 'HIGH' ? 'critical' : 'warning'}`;
    document.getElementById('alert-banner-text').textContent = `ALERT: ${critical.title} — ${critical.what}`;
  } else {
    banner.classList.add('hidden');
  }
}

function dismissAlertBanner() {
  document.getElementById('alert-banner').classList.add('hidden');
}

// ── Sync Engine (§19-22) ──
function updateSyncIndicator() {
  const el = document.getElementById('sync-indicator');
  const queueLen = DB.syncQueue.length;
  if (APP.isOnline && queueLen === 0) {
    el.className = 'sync-indicator sync-online';
    el.innerHTML = `<span class="sync-dot online"></span><span>ONLINE — Synced</span>`;
  } else if (APP.isOnline && queueLen > 0) {
    el.className = 'sync-indicator sync-offline';
    el.innerHTML = `<span class="sync-dot offline"></span><span>SYNCING — ${queueLen} queued</span>`;
  } else {
    el.className = 'sync-indicator sync-offline';
    el.innerHTML = `<span class="sync-dot offline"></span><span>OFFLINE — ${queueLen} queued</span>`;
  }
}

function queueOfflineAction(entity, entityId, operation, payload) {
  const op = {
    operationId: generateId('SYN'),
    entity, entityId, operation, payload,
    deviceId: 'BROWSER-01',
    userId: APP.currentUser,
    clientTimestamp: new Date().toISOString(),
    status: 'PENDING',
  };
  DB.syncQueue.push(op);
  updateSyncIndicator();
  addAuditEvent(APP.currentUser, operation, entity, entityId);
  addNotification('Offline operation queued', 'INFO');
}

function triggerSync() {
  if (DB.syncQueue.length === 0) { addNotification('Queue empty — all synced', 'INFO'); return; }
  const count = DB.syncQueue.length;
  DB.syncQueue.forEach(op => op.status = 'ACKNOWLEDGED');
  DB.syncQueue = [];
  updateSyncIndicator();
  addNotification(`Synchronized ${count} operations`, 'INFO');
}

function toggleOnlineState() {
  APP.isOnline = !APP.isOnline;
  updateSyncIndicator();
  addNotification(APP.isOnline ? 'Connection restored' : 'Connection lost — offline mode', APP.isOnline ? 'INFO' : 'WARNING');
}

// ── Audit (§24) ──
function addAuditEvent(who, what, entity, entityId, prevValue, newValue, reason) {
  DB.auditLog.push({
    id: generateId('AUD'), who, what,
    when: new Date().toISOString(),
    entity: `${entity}:${entityId}`,
    prevValue: prevValue || '', newValue: newValue || '',
    deviceId: 'BROWSER-01', reason: reason || '',
  });
}

// ── Notifications (§29) ──
function addNotification(message, priority) {
  DB.notifications.unshift({
    id: generateId('NTF'), alertId: null, channel: 'IN_APP',
    priority, recipientId: APP.currentUser, message,
    timestamp: new Date().toISOString(), acknowledged: false,
  });
  showToast(message, priority);
}

function showToast(message, type) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  const colors = { CRITICAL: 'danger', WARNING: 'warning', INFO: 'accent' };
  toast.className = `card fade-in`;
  toast.style.cssText = `border-left: 3px solid var(--${colors[type] || 'accent'}); padding: 10px 14px; font-size: 11px; margin-bottom: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);`;
  toast.innerHTML = `<div class="flex-between"><span>${message}</span><button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;cursor:pointer;color:var(--text-muted);font-weight:700">&times;</button></div>`;
  container.prepend(toast);
  setTimeout(() => toast.remove(), 5000);
}

// ── Theme Toggle ──
function toggleTheme() {
  APP.theme = APP.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', APP.theme);
}

// ── Demo Panel (§40) ──
function renderDemoPanel() {
  const panel = document.getElementById('demo-panel');
  if (!panel) return;
  panel.classList.remove('hidden');
}

// ── SOS Modal (§17) ──
function openSOSModal() {
  APP.sosModalOpen = true;
  document.getElementById('modal-sos').classList.remove('hidden');
}
function closeSOSModal() {
  APP.sosModalOpen = false;
  document.getElementById('modal-sos').classList.add('hidden');
}
function dispatchSOS() {
  const protocol = document.getElementById('sos-protocol').value;
  const incident = {
    id: generateId('INC'), type: protocol, severity: 'CRITICAL',
    status: 'ACTIVE', stationId: DB.stations[0].id, personId: APP.currentUser,
    description: `SOS dispatched: ${protocol}`,
    location: { lat: -70.7668, lng: 11.7385 },
    timestamp: new Date().toISOString(),
    acknowledgedBy: null, acknowledgedAt: null,
    responders: [], actions: ['Distress signal transmitted'],
    resolution: null,
  };
  DB.incidents.push(incident);
  queueOfflineAction('incident', incident.id, 'SOS_DISPATCH', incident);
  closeSOSModal();
  addNotification(`SOS DISPATCHED: ${protocol}`, 'CRITICAL');
  renderSidebar();
}

// ── Copilot Toggle ──
function toggleCopilot() {
  APP.copilotOpen = !APP.copilotOpen;
  document.getElementById('copilot-window').classList.toggle('hidden', !APP.copilotOpen);
}

// ── Utility: Format helpers ──
function fmtNum(n) { return n.toLocaleString(); }
function fmtDate(iso) { if (!iso) return '—'; return new Date(iso).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }); }
function fmtTime(iso) { if (!iso) return '—'; return new Date(iso).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }); }
function pct(val, max) { return Math.min(100, Math.round((val / max) * 100)); }

// ── Pipeline renderer ──
function renderPipeline(states, currentState) {
  const idx = states.indexOf(currentState);
  return `<div class="pipeline">${states.map((s, i) => {
    const cls = i < idx ? 'completed' : i === idx ? 'current' : '';
    const arrow = i < states.length - 1 ? '<span class="pipeline-arrow">→</span>' : '';
    return `<span class="pipeline-step ${cls}">${s.replace(/_/g,' ')}</span>${arrow}`;
  }).join('')}</div>`;
}
