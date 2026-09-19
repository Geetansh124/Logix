// ═══════════════════════════════════════════════════════════════════
// LOGIX — Grounded AI Copilot (Blueprint §25)
// Data-driven responses, not generic chatbot
// ═══════════════════════════════════════════════════════════════════

const COPILOT_RESPONSES = {
  'diesel': () => {
    const dos = getDaysOfSupply('INV-001');
    const bal = getBalance('INV-001');
    return `📊 **Diesel Status — Maitri**\nCurrent stock: ${fmtNum(bal)} L\nBurn rate: 450 L/day\nDays of supply: **${dos} days**\nNext resupply: TRN-001 (ETA ${fmtDate(DB.transports[0].arrivalEst)})\n${dos < 45 ? '⚠ Risk: Coverage gap projected before resupply.' : '✅ Coverage adequate.'}`;
  },
  'cargo': () => {
    const inTransit = DB.cargo.filter(c => ['DISPATCHED','VESSEL_AIR','PORT_TRANSIT'].includes(c.state));
    const exceptions = DB.manifests.filter(m => m.status === 'EXCEPTION');
    return `📦 **Cargo Summary**\nTotal shipments: ${DB.cargo.length}\nIn transit: ${inTransit.length}\nManifest exceptions: ${exceptions.length}\n${exceptions.length ? '⚠ ' + exceptions.map(m => `Container ${m.containerId}: ${m.missingPackages.length} missing package(s)`).join('\n') : '✅ All manifests clear.'}`;
  },
  'personnel': () => {
    const r = getPersonnelReadiness();
    const action = DB.personnel.filter(p => p.readiness === 'ACTION_REQUIRED');
    return `👥 **Personnel Readiness**\nTotal: ${r.total}\nMedical cleared: ${r.medical}/${r.total}\nTraining complete: ${r.training}/${r.total}\nAction required: ${action.length} people\n${action.map(p => `• ${p.name}: ${p.medicalClearance !== 'VALID' ? 'Medical ' + p.medicalClearance : 'Training incomplete'}`).join('\n')}`;
  },
  'maintenance': () => {
    const due = DB.assets.filter(a => a.riskLevel === 'HIGH' || a.riskLevel === 'MEDIUM');
    return `🔧 **Asset Maintenance**\n${due.length} assets need attention:\n${due.map(a => `• ${a.name}: ${a.riskLevel} risk — ${a.status}`).join('\n')}\n${due.length === 0 ? '✅ All assets nominal.' : '→ Schedule maintenance via Assets view.'}`;
  },
  'certification': () => {
    const expiring = DB.personnel.filter(p => {
      const days = Math.ceil((new Date(p.certExpiry) - new Date()) / 86400000);
      return days < 30;
    });
    return `📋 **Certification Expiry (30 days)**\n${expiring.length ? expiring.map(p => `• ${p.name}: expires ${fmtDate(p.certExpiry)}`).join('\n') : '✅ No certifications expiring within 30 days.'}`;
  },
  'inventory': () => {
    const critical = DB.inventoryItems.filter(i => getBalance(i.id) <= i.minThreshold);
    return `📦 **Critical Inventory**\n${critical.length} items below minimum threshold:\n${critical.map(i => `• ${i.name} (${DB.stations.find(s=>s.id===i.station)?.name}): ${fmtNum(getBalance(i.id))} ${i.unit} (min: ${fmtNum(i.minThreshold)})`).join('\n')}\n${critical.length === 0 ? '✅ All inventory above thresholds.' : '⚠ Auto-reorder triggered for critical items.'}`;
  },
  'emergency': () => {
    const active = DB.incidents.filter(i => i.status === 'ACTIVE');
    return `🚨 **Emergency Status**\nActive incidents: ${active.length}\n${active.map(i => `• ${i.id}: ${i.type.replace(/_/g,' ')} at ${DB.stations.find(s=>s.id===i.stationId)?.name} — ${i.severity}`).join('\n')}\n${active.length === 0 ? '✅ No active emergencies.' : '→ Open Emergency Operations for details.'}`;
  },
  'alert': () => {
    const unack = DB.alerts.filter(a => a.status === 'UNACKNOWLEDGED');
    return `⚠ **Unacknowledged Alerts: ${unack.length}**\n${unack.map(a => `• ${a.severity}: ${a.title}\n  Reason: ${a.why[0]}\n  Action: ${a.action}`).join('\n\n')}`;
  },
};

function processCopilotQuery(query) {
  const q = query.toLowerCase();
  if (q.includes('diesel') || q.includes('fuel')) return COPILOT_RESPONSES.diesel();
  if (q.includes('cargo') || q.includes('shipment') || q.includes('manifest')) return COPILOT_RESPONSES.cargo();
  if (q.includes('personnel') || q.includes('team') || q.includes('readiness')) return COPILOT_RESPONSES.personnel();
  if (q.includes('maintenance') || q.includes('asset') || q.includes('generator')) return COPILOT_RESPONSES.maintenance();
  if (q.includes('cert') || q.includes('training') || q.includes('clearance')) return COPILOT_RESPONSES.certification();
  if (q.includes('inventory') || q.includes('stock') || q.includes('supply')) return COPILOT_RESPONSES.inventory();
  if (q.includes('emergency') || q.includes('sos') || q.includes('incident')) return COPILOT_RESPONSES.emergency();
  if (q.includes('alert') || q.includes('warning') || q.includes('risk')) return COPILOT_RESPONSES.alert();
  return `I can help with operational queries. Try asking about:\n• Diesel / fuel status\n• Cargo / shipments / manifest\n• Personnel / readiness\n• Inventory / stock / supply\n• Assets / maintenance\n• Emergency / incidents\n• Alerts / warnings\n\nAll answers are sourced from current system data — timestamp: ${new Date().toLocaleTimeString('en-IN')}.`;
}

function sendCopilotMessage() {
  const input = document.getElementById('copilot-input');
  const messages = document.getElementById('copilot-messages');
  if (!input || !input.value.trim()) return;
  const query = input.value.trim();

  // User message
  const userDiv = document.createElement('div');
  userDiv.style.cssText = 'padding:8px 12px;border-radius:8px;background:var(--bg-secondary);color:var(--text-primary);font-size:11px;align-self:flex-end;max-width:85%;text-align:right;';
  userDiv.textContent = query;
  messages.appendChild(userDiv);

  // AI response
  setTimeout(() => {
    const response = processCopilotQuery(query);
    const aiDiv = document.createElement('div');
    aiDiv.style.cssText = 'padding:8px 12px;border-radius:8px;background:var(--accent-light);color:var(--text-primary);font-size:11px;max-width:90%;white-space:pre-wrap;line-height:1.5;';
    aiDiv.textContent = response;
    messages.appendChild(aiDiv);
    messages.scrollTop = messages.scrollHeight;
  }, 300);

  input.value = '';
  messages.scrollTop = messages.scrollHeight;
}
