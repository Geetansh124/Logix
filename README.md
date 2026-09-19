# Logix — Polar Expedition Operations & Decision Intelligence Platform

> **National Centre for Polar and Ocean Research (NCPOR) & Ministry of Earth Sciences (MoES)**  
> **Problem Statement:** SIH26062 — Integrated Polar Expedition Logistics & Asset Management System  
> **Live Production URL:** [https://logix-orcin.vercel.app](https://logix-orcin.vercel.app)  
> **Platform Version:** `v2.4.0-production`

---

## 1. Executive Overview

**Logix** is an offline-first Polar Expedition Operations & Decision Intelligence Platform that unifies expedition planning, cargo chain-of-custody, station inventory ledgers, personnel readiness scorecards, asset maintenance telemetry, satellite emergency response (SOS), and predictive resupply into a unified situational awareness picture.

Designed specifically for the extreme conditions of Antarctica and the Arctic, Logix guarantees full operational continuity during blizzard-induced satellite outages through local transaction queues and cryptographic audit logging.

### Operational Nodes
- **Maitri Base (`STN-001`):** Antarctica (-70.7668°, 11.7385°) — 48 deployed personnel, bulk diesel supply, overland traverse hub.
- **Bharati Station (`STN-002`):** Antarctica (-69.4072°, 76.1872°) — 32 deployed personnel, ice core drilling operations.
- **Himadri Station (`STN-003`):** Arctic (78.9253°, 11.9312°) — 12 deployed personnel, marine and atmospheric research.

---

## 2. Recent Updates & Changelog

### 🚀 Production Deployment & Domain Standardization
- **Brand Consistency:** Updated title, headers, breadcrumbs, and AI Copilot branding to **Logix**.
- **Live Vercel Production:** Configured and deployed to high-availability HTTPS edge network under the dedicated domain: [https://logix-orcin.vercel.app](https://logix-orcin.vercel.app).
- **Cleaned Runtime Footprint:** Removed obsolete prototype files (`t.html`) and scratch analysis files to maintain a lean, high-performance repository.

### 🏛️ Modular Control-Room Architecture (`index.html`)
- Replaced monolithic legacy code with a decoupled modular architecture (`src/`).
- Built a command-room user interface with dual-theme support (Dark/Light mode) tailored for high-contrast visibility in polar field conditions.
- Integrated Tailwind CSS, Leaflet GIS mapping, Chart.js analytics, and Lucide icon sets via fast CDN.

### 🔐 7-Tier Role-Based Access Control (RBAC)
- **Level 1 (Read-Only / Field):** *MoES Oversight* (monitoring dashboards) and *Field Personnel* (mobile mode & SOS).
- **Level 2 (Specialist):** *Logistics Officer* (cargo/inventory) and *Medical Officer* (personnel health & cold chain).
- **Level 3 (Station Lead):** *Station Officer* (station assets, local personnel, incident command).
- **Level 5 (Full Authority):** *NCPOR Coordinator* and *System Administrator* (all modules, decisions, resupply approval).

### 📦 Chain-of-Custody & Cargo State Machine
- Implemented full 13-state cargo lifecycle: `REQUESTED` → `REVIEW` → `APPROVED` → `PROCURED` → `RECEIVED` → `PACKED` → `CONTAINERIZED` → `DISPATCHED` → `PORT_TRANSIT` → `VESSEL_AIR` → `POLAR_ARRIVAL` → `STATION_RECEIVED` → `INVENTORY_POSTED`.
- Manifest integrity validation detecting item discrepancies (e.g., Missing package detection on container `C-1042`).
- Transport window monitoring for ice-class vessel *MV Vasily Golovnin* (`TRN-001`) and *IL-76* cargo flights (`TRN-002`).

### 📊 Ledger-Based Inventory & Days-of-Supply (DoS)
- Replaced static counters with an **immutable transaction ledger** (`RECEIPT`, `CONSUMPTION`, `ADJUSTMENT`).
- Real-time Days-of-Supply formula calculating depletion risk based on daily consumption rates.
- Cold-chain monitoring for critical medical inventory (e.g., Insulin temperature bounds 2°C – 8°C).

### 🤖 Grounded AI Copilot & Decision Intelligence
- Interactive copilot reasoning engine grounded directly in live operational database values (burn rates, ETAs, days of supply).
- Simple Exponential Smoothing (SES, $\alpha = 0.3$) demand forecasting.
- What-If simulation engine analyzing shipment delays (+7/14 days) and surge personnel (+10) impact.

### 🚨 Emergency Operations Center (EOC) & Satellite SOS
- One-click SOS modal broadcasting prioritized distress protocols (Medical Evacuation, Power Loss, Comms Outage, Blizzard Shelter).
- Real-time incident response assignment, action logging, and status tracking.

---

## 3. Architecture & Repository Structure

```text
d:\Main\AI Summiti 2026\SIH\ps 62\pr\
├── index.html                                          # Master application shell & mount point
├── README.md                                           # Project overview & release documentation
├── LOGIX_Polar_Expedition_Platform_Upgrade_Blueprint.md # Comprehensive engineering blueprint (§0–§55)
└── src/
    ├── core.js                                         # Auth, routing, RBAC matrix, offline queue, audit log
    ├── data.js                                         # 19 operational entities, ledger math, seed data
    ├── styles.css                                      # Control-room design tokens, themes, layout CSS
    ├── components/
    │   ├── copilot.js                                  # Grounded AI Copilot assistant engine
    │   └── demo-mode.js                                # Scenario simulation triggers & Mobile Field Mode
    └── views/
        ├── admin.js                                    # System health monitoring, RBAC, audit log
        ├── assets.js                                   # Equipment register, runtime hours, maintenance risk
        ├── cargo.js                                    # Manifests, transport windows, cargo lifecycle
        ├── command-center.js                           # Situational awareness, readiness bars, station overview
        ├── emergency.js                                # Active incidents, response teams, emergency protocols
        ├── intelligence.js                             # SES forecasting, resupply recommendations, what-if
        ├── inventory.js                                # Stock balances, Days of Supply cards, cold chain
        ├── personnel.js                                # Workforce readiness scorecard, medical clearances
        ├── polar-map.js                                # Leaflet GIS Digital Twin with layer toggles & QR scan
        └── reports.js                                  # Key performance indicators, SLA metrics, CSV/PDF
```

---

## 4. Operational Invariants & Rules

1. **Zero Static Numbers:** All statistics, charts, and table values derive dynamically from `DB` state or calculated functions (`getBalance()`, `getDaysOfSupply()`, `getPersonnelReadiness()`).
2. **Ledger Immutability:** Stock levels cannot be edited directly; they are calculated by aggregating receipts and consumption records from `inventoryLedger`.
3. **Strict File Size:** Every file in the codebase is maintained strictly under **500 lines** for maintainability and modularity.
4. **Offline Resilience:** Actions performed offline are appended to `syncQueue` with UUIDs and client timestamps, syncing automatically when connectivity is restored.

---

## 5. Local Setup & Execution

### Prerequisites
- Any modern web browser (Chrome, Edge, Firefox, Safari).
- Python 3.x or Node.js (for local HTTP server).

### Running Locally

Using Python:
```bash
# Start local HTTP server
python -m http.server 8080

# Open in browser
http://127.0.0.1:8080/index.html
```

Using Node (`serve` or `http-server`):
```bash
npx serve -p 8080 .
```

### Production Deployment
To deploy updates to Vercel production:
```bash
vercel deploy --prod --yes
```

---

## 6. Demo & Evaluation Walkthrough (§53)

1. **Login:** Open [https://logix-orcin.vercel.app](https://logix-orcin.vercel.app) and log in with default callsign `Cmdr. R. Singh` as **NCPOR Coordinator**.
2. **Situational Awareness:** Review the **Command Center** showing active expeditions, critical inventory, and station readiness.
3. **Polar Digital Twin:** Navigate to **Polar Digital Twin** to explore station coordinates, hazard crevasse zones, and weather overlays.
4. **Cargo Chain of Custody:** Open **Cargo** to review transport capacity on the *MV Vasily Golovnin* and manifest discrepancy flags.
5. **Inventory & Cold Chain:** Check **Inventory** to inspect Days of Supply and the live temperature status of medical supplies.
6. **Decision Intelligence:** In **Intelligence**, review automated resupply proposals and run a **What-If** simulation (+7 days delay).
7. **AI Copilot:** Click **Copilot** in the top bar and type `diesel` to query fuel availability and burn rates.
8. **Field Emergency:** Click **SOS** to review emergency dispatch protocols.

---

*Logix — Engineering excellence for India's scientific frontier in Antarctica & the Arctic.*
