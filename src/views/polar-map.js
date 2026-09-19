// ═══════════════════════════════════════════════════════════════════
// LOGIX — Polar Digital Twin Map (Blueprint §4)
// Interactive GIS with toggleable layers, station drill-down
// ═══════════════════════════════════════════════════════════════════

let mapInstance = null;
let mapLayers = { stations: true, personnel: true, cargo: true, hazards: true, weather: true, incidents: true };
let layerGroups = {};

function renderPolarMap() {
  const el = document.getElementById('view-polar-map');
  if (!el) return;

  el.innerHTML = `
    <div class="fade-in" style="display:flex;height:calc(100vh - var(--topbar-height) - 50px);gap:0">
      <div style="flex:1;position:relative">
        <div id="polar-map-container" style="width:100%;height:100%;border-radius:8px;overflow:hidden;border:1px solid var(--border)"></div>
        <!-- Layer Controls -->
        <div class="map-layers-panel">
          <div class="font-bold text-xs mb-sm" style="color:var(--text-primary)">Map Layers</div>
          ${Object.keys(mapLayers).map(key => `
            <label class="map-layer-toggle">
              <input type="checkbox" ${mapLayers[key] ? 'checked' : ''} onchange="toggleMapLayer('${key}', this.checked)" />
              <span class="text-xs">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
            </label>
          `).join('')}
        </div>
        <!-- Quick Scan -->
        <div style="position:absolute;top:12px;left:12px;z-index:1000;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:10px;display:flex;gap:6px;align-items:center;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
          <i data-lucide="scan-line" style="width:16px;height:16px;color:var(--accent)"></i>
          <input type="text" id="map-scan-input" placeholder="Scan QR / RFID..." class="form-input" style="width:180px;padding:6px 10px;font-size:11px" onkeypress="if(event.key==='Enter')mapQuickScan()" />
          <button class="btn btn-primary btn-sm" onclick="mapQuickScan()">Scan</button>
        </div>
      </div>
      <!-- Station Detail Panel -->
      <div id="station-detail-panel" style="width:320px;background:var(--bg-card);border:1px solid var(--border);border-radius:0 8px 8px 0;overflow-y:auto;padding:16px;display:none">
      </div>
    </div>
  `;
  lucide.createIcons();
  setTimeout(initPolarMap, 100);
}

function initPolarMap() {
  const container = document.getElementById('polar-map-container');
  if (!container) return;
  if (mapInstance) { mapInstance.remove(); mapInstance = null; }

  mapInstance = L.map('polar-map-container', { zoomControl: true }).setView([-70.0, 40.0], 3);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap', maxZoom: 18,
  }).addTo(mapInstance);

  layerGroups = {
    stations: L.layerGroup(),
    personnel: L.layerGroup(),
    cargo: L.layerGroup(),
    hazards: L.layerGroup(),
    weather: L.layerGroup(),
    incidents: L.layerGroup(),
  };

  // Station markers
  DB.stations.forEach(s => {
    const color = s.status === 'OPERATIONAL' ? '#059669' : '#dc2626';
    const marker = L.circleMarker([s.lat, s.lng], { radius: 10, fillColor: color, color: '#fff', weight: 2, fillOpacity: 0.9 });
    marker.bindTooltip(`<strong>${s.name}</strong><br>${s.type}`, { permanent: true, direction: 'top', offset: [0, -12], className: 'mono' });
    marker.on('click', () => showStationDetail(s.id));
    layerGroups.stations.addLayer(marker);
  });

  // Hazard zones
  DB.hazards.forEach(h => {
    const color = h.severity === 'HIGH' ? '#dc2626' : '#d97706';
    const circle = L.circle([h.lat, h.lng], { radius: h.radius, fillColor: color, color: color, weight: 1, fillOpacity: 0.15, dashArray: '6 4' });
    circle.bindPopup(`<strong>${h.type.replace(/_/g,' ')}</strong><br>${h.description}<br><em>Severity: ${h.severity}</em>`);
    layerGroups.hazards.addLayer(circle);
  });

  // Incidents
  DB.incidents.filter(i => i.status === 'ACTIVE').forEach(inc => {
    const marker = L.circleMarker([inc.location.lat, inc.location.lng], { radius: 8, fillColor: '#dc2626', color: '#fff', weight: 2, fillOpacity: 0.9 });
    marker.bindPopup(`<strong>🚨 ${inc.type}</strong><br>${inc.description}<br>Severity: ${inc.severity}`);
    layerGroups.incidents.addLayer(marker);
  });

  // Cargo routes (simplified)
  DB.cargo.filter(c => ['DISPATCHED','VESSEL_AIR','PORT_TRANSIT'].includes(c.state)).forEach(c => {
    const dest = DB.stations.find(s => s.id === c.destinationId);
    if (dest) {
      const origin = [20.0, 73.0]; // Approximate India origin
      const line = L.polyline([origin, [dest.lat, dest.lng]], { color: '#0284c7', weight: 2, dashArray: '8 6', opacity: 0.7 });
      line.bindPopup(`<strong>${c.id}</strong>: ${c.description}<br>State: ${c.state}`);
      layerGroups.cargo.addLayer(line);
    }
  });

  // Personnel (at stations)
  DB.stations.forEach(s => {
    const people = DB.personnel.filter(p => p.stationId === s.id);
    if (people.length) {
      const marker = L.circleMarker([s.lat + 0.3, s.lng + 0.3], { radius: 6, fillColor: '#2563eb', color: '#fff', weight: 1, fillOpacity: 0.8 });
      marker.bindTooltip(`${people.length} personnel`, { direction: 'right' });
      layerGroups.personnel.addLayer(marker);
    }
  });

  // Add visible layers
  Object.keys(mapLayers).forEach(key => {
    if (mapLayers[key] && layerGroups[key]) layerGroups[key].addTo(mapInstance);
  });
}

function toggleMapLayer(key, visible) {
  mapLayers[key] = visible;
  if (visible && layerGroups[key]) layerGroups[key].addTo(mapInstance);
  else if (!visible && layerGroups[key]) mapInstance.removeLayer(layerGroups[key]);
}

function showStationDetail(stationId) {
  const s = DB.stations.find(st => st.id === stationId);
  if (!s) return;
  const panel = document.getElementById('station-detail-panel');
  panel.style.display = 'block';

  const fuel = DB.inventoryItems.find(i => i.name.includes('Diesel') && i.station === s.id);
  const fuelBalance = fuel ? getBalance(fuel.id) : 0;
  const fuelDays = fuel ? getDaysOfSupply(fuel.id) : '—';
  const people = DB.personnel.filter(p => p.stationId === s.id);
  const stationAssets = DB.assets.filter(a => a.stationId === s.id);
  const stationIncidents = DB.incidents.filter(i => i.stationId === s.id && i.status === 'ACTIVE');
  const wx = DB.weather.find(w => w.stationId === s.id);

  panel.innerHTML = `
    <div class="fade-in">
      <div class="flex-between mb-sm">
        <span class="font-bold" style="font-size:14px">${s.name}</span>
        <button onclick="document.getElementById('station-detail-panel').style.display='none'" style="background:none;border:none;cursor:pointer;font-size:16px;color:var(--text-muted)">&times;</button>
      </div>
      <span class="status status-operational">${s.status}</span>
      <div style="margin-top:12px;display:flex;flex-direction:column;gap:8px;font-size:11px">
        <div class="flex-between"><span class="text-muted">Population</span><span class="font-bold">${s.population} / ${s.capacity}</span></div>
        <div class="flex-between"><span class="text-muted">Connectivity</span><span class="font-bold">${s.connectivity}</span></div>
        <div class="flex-between"><span class="text-muted">Last Sync</span><span class="mono">${fmtTime(s.lastSync)}</span></div>
        <hr style="border:none;border-top:1px solid var(--border);margin:4px 0">
        <div class="font-bold text-xs">Fuel Status</div>
        <div class="flex-between"><span class="text-muted">Diesel</span><span class="font-bold ${fuelDays < 30 ? 'text-danger' : ''}">${fmtNum(fuelBalance)} L (${fuelDays} days)</span></div>
        <hr style="border:none;border-top:1px solid var(--border);margin:4px 0">
        <div class="font-bold text-xs">Personnel (${people.length})</div>
        ${people.map(p => `<div class="flex-between text-xs"><span>${p.name}</span><span class="status status-${p.readiness==='READY'?'ready':'warning'}">${p.readiness}</span></div>`).join('')}
        <hr style="border:none;border-top:1px solid var(--border);margin:4px 0">
        <div class="font-bold text-xs">Assets (${stationAssets.length})</div>
        ${stationAssets.map(a => `<div class="flex-between text-xs"><span>${a.name}</span><span class="status status-${a.status==='OPERATIONAL'||a.status==='DEPLOYED'?'operational':a.status==='MAINTENANCE'?'warning':'critical'}">${a.status}</span></div>`).join('')}
        ${stationIncidents.length ? `<hr style="border:none;border-top:1px solid var(--border);margin:4px 0"><div class="font-bold text-xs text-danger">Active Incidents (${stationIncidents.length})</div>` : ''}
        ${stationIncidents.map(i => `<div class="text-xs" style="padding:4px;background:var(--danger-bg);border-radius:4px">🚨 ${i.description}</div>`).join('')}
        ${wx ? `
          <hr style="border:none;border-top:1px solid var(--border);margin:4px 0">
          <div class="font-bold text-xs">Weather</div>
          <div class="flex-between text-xs"><span class="text-muted">Temperature</span><span class="font-bold">${wx.temp}°C</span></div>
          <div class="flex-between text-xs"><span class="text-muted">Wind</span><span>${wx.windSpeed} km/h ${wx.windDir}</span></div>
          <div class="flex-between text-xs"><span class="text-muted">Visibility</span><span>${fmtNum(wx.visibility)} m</span></div>
        ` : ''}
      </div>
    </div>
  `;
}

function mapQuickScan() {
  const input = document.getElementById('map-scan-input');
  const val = input.value.trim();
  if (!val) return;
  queueOfflineAction('cargo_scan', val, 'SCAN', { scannedAt: 'Polar Map', value: val });
  addNotification(`Scan logged: ${val}`, 'INFO');
  input.value = '';
}
