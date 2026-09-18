# Requirements Context: Functional & Non-Functional

## Functional Requirements

### Module 1: Expedition Planning

#### FR-EP-001: Mission Scheduling
- **Description:** Create and manage expedition missions with timelines, stations, and personnel assignments
- **Acceptance Criteria:**
  - Users can create expeditions with start/end dates
  - Assign stations (Maitri, Bharati, or both) to expedition
  - Link personnel roster to expedition
  - Set expedition status (Planning, Active, Completed)
- **Priority:** P0 (Critical)

#### FR-EP-002: Resource Allocation
- **Description:** Allocate resources (cargo, personnel, budget) per station/season
- **Acceptance Criteria:**
  - Define resource requirements per station
  - Allocate budget across categories (fuel, food, equipment)
  - Track allocation vs. actual consumption
  - Generate resource summary reports
- **Priority:** P0

#### FR-EP-003: Voyage Manifest Generation
- **Description:** Auto-generate voyage manifests with optimal stowage order
- **Acceptance Criteria:**
  - System suggests stowage order (last-loaded = first-offloaded)
  - Manifest includes container IDs, contents, destination station
  - Export manifest as PDF for ship loading teams
  - Validate manifest against resource allocation
- **Priority:** P0

### Module 2: Cargo Tracking

#### FR-CT-001: Real-Time Location Tracking
- **Description:** Track cargo containers from origin to destination with GPS integration
- **Acceptance Criteria:**
  - Display cargo location on map (Leaflet)
  - Update location every 15 minutes (when online)
  - Show last-known location when offline
  - Alert if cargo deviates from planned route
- **Priority:** P0

#### FR-CT-002: Stowage Order Management
- **Description:** Manage container stowage order based on priority and unloading sequence
- **Acceptance Criteria:**
  - Visual representation of ship hold with container positions
  - Drag-and-drop interface to adjust stowage
  - Validation: P0 containers must be last-loaded (first-offloaded)
  - Export stowage plan for loading teams
- **Priority:** P0

#### FR-CT-003: Receipt Confirmation
- **Description:** Confirm cargo receipt at each touchpoint (Goa → Cape Town → Station)
- **Acceptance Criteria:**
  - Scan container QR code at each hub
  - Record receipt timestamp and location
  - Capture condition (intact/damaged)
  - Auto-update inventory at destination
- **Priority:** P0

### Module 3: Inventory Management

#### FR-IM-001: Station-Level Stock Tracking
- **Description:** Track inventory levels at each Antarctic station in real-time
- **Acceptance Criteria:**
  - Display current stock levels per category
  - Show stock location within station (warehouse, lab, etc.)
  - Track stock movements (in/out/transfer)
  - Support offline data entry with sync
- **Priority:** P0

#### FR-IM-002: Consumption Rate Analytics
- **Description:** Calculate and visualize consumption rates for all inventory items
- **Acceptance Criteria:**
  - Calculate daily/weekly/monthly consumption
  - Compare actual vs. projected consumption
  - Identify anomalies (unusual spikes/drops)
  - Export consumption reports
- **Priority:** P1

#### FR-IM-003: Depletion Projections
- **Description:** Predict stockout dates based on consumption patterns
- **Acceptance Criteria:**
  - Forecast depletion date for each item
  - Alert if depletion < next resupply window
  - Suggest reorder quantities
  - Visualize depletion timeline on chart
- **Priority:** P0

#### FR-IM-004: Expiry Alerts
- **Description:** Alert users about items approaching expiry
- **Acceptance Criteria:**
  - Track expiry dates for perishable items
  - Alert 30 days, 14 days, and 7 days before expiry
  - Suggest FIFO (First-In-First-Out) usage
  - Auto-flag expired items for disposal
- **Priority:** P1

#### FR-IM-005: Automated Reorder Triggers
- **Description:** Auto-generate reorder requests when stock reaches reorder point
- **Acceptance Criteria:**
  - Calculate reorder point based on safety stock formula
  - Auto-generate purchase requisition
  - Route for approval based on item value
  - Track requisition status
- **Priority:** P1

### Module 4: Personnel Movement

#### FR-PM-001: Team Whereabouts Tracking
- **Description:** Track location and status of all expedition personnel
- **Acceptance Criteria:**
  - Display personnel roster with current status
  - Show location (station, in-transit, deployed)
  - Update status in real-time
  - Support offline status updates
- **Priority:** P0

#### FR-PM-002: Rotation Schedules
- **Description:** Manage personnel rotation schedules and timelines
- **Acceptance Criteria:**
  - Define rotation schedule per personnel
  - Alert 30 days before rotation due
  - Track rotation completion
  - Generate rotation summary reports
- **Priority:** P1

#### FR-PM-003: Medical Clearance Status
- **Description:** Track medical clearance status for all personnel
- **Acceptance Criteria:**
  - Record medical clearance date and validity
  - Alert when clearance expires in 60 days
  - Block deployment if clearance expired
  - Export medical clearance reports
- **Priority:** P1

#### FR-PM-004: Roll Call Management
- **Description:** Conduct and record twice-daily roll calls
- **Acceptance Criteria:**
  - Record roll call at 0800 and 2000 hours
  - Mark personnel as Present/Absent/On-Leave
  - Alert if personnel missing from roll call
  - Generate roll call history reports
- **Priority:** P0

### Module 5: Emergency Response

#### FR-ER-001: One-Click Emergency Alerts
- **Description:** Trigger emergency alerts with single button press
- **Acceptance Criteria:**
  - Single button to activate emergency
  - Capture emergency type (Level 1/2/3)
  - Auto-capture current roll call and inventory
  - Send alert within 30 seconds
- **Priority:** P0 (Critical)

#### FR-ER-002: Auto-Notification to MoES/NCPOR
- **Description:** Automatically notify MoES and NCPOR of emergencies
- **Acceptance Criteria:**
  - Send notification to NCPOR Director within 30 seconds
  - Send notification to MoES Emergency Cell within 60 seconds
  - Include emergency details, roll call, and critical inventory
  - Support multiple notification channels (email, SMS, dashboard)
- **Priority:** P0

#### FR-ER-003: Resource Availability Dashboard
- **Description:** Display real-time availability of critical resources during emergencies
- **Acceptance Criteria:**
  - Show fuel, food, medical supplies, oxygen levels
  - Calculate days remaining at current consumption
  - Highlight critical shortages in red
  - Update in real-time
- **Priority:** P0

#### FR-ER-004: Evacuation Protocols
- **Description:** Provide step-by-step evacuation procedures
- **Acceptance Criteria:**
  - Display evacuation checklist
  - Track evacuation progress
  - Record evacuated personnel
  - Generate evacuation report
- **Priority:** P1

### Module 6: Asset Management

#### FR-AM-001: Movable Asset Tracking
- **Description:** Track movable assets (vehicles, equipment, containers) across lifecycle
- **Acceptance Criteria:**
  - Record asset details (ID, type, location, status)
  - Track asset movements between hubs
  - Record maintenance history
  - Generate asset utilization reports
- **Priority:** P1

#### FR-AM-002: Immovable Asset Registry
- **Description:** Maintain registry of immovable assets (buildings, infrastructure)
- **Acceptance Criteria:**
  - Record asset details (ID, type, location, condition)
  - Track maintenance schedules
  - Record depreciation
  - Generate asset valuation reports
- **Priority:** P2


## Non-Functional Requirements

### NFR-001: Offline-First Architecture
- **Description:** System must function fully offline with automatic sync when connectivity resumes
- **Acceptance Criteria:**
  - All CRUD operations available offline
  - Local storage using IndexedDB
  - Automatic sync when online detected
  - Conflict resolution for concurrent edits
- **Priority:** P0

### NFR-002: Real-Time Updates
- **Description:** Cargo tracking and emergency alerts must update in real-time
- **Acceptance Criteria:**
  - WebSocket connection for live updates
  - Update latency < 2 seconds
  - Fallback to polling if WebSocket unavailable
  - Reconnection handling
- **Priority:** P0

### NFR-003: Security & Encryption
- **Description:** End-to-end encryption for all data in transit and at rest
- **Acceptance Criteria:**
  - TLS 1.3 for all API calls
  - AES-256 for sensitive data at rest
  - JWT authentication with 15-minute expiry
  - RBAC with least-privilege access
- **Priority:** P0

### NFR-004: Performance
- **Description:** System must perform under polar conditions with limited bandwidth
- **Acceptance Criteria:**
  - Page load time < 3 seconds on 3G connection
  - API response time < 500ms (95th percentile)
  - Support 100 concurrent users
  - Offline data sync < 30 seconds for typical payload
- **Priority:** P1

### NFR-005: Availability
- **Description:** System must be available 99.9% during expedition windows
- **Acceptance Criteria:**
  - 99.9% uptime during November-March (expedition season)
  - Automatic failover to backup servers
  - Data backup every 6 hours
  - Disaster recovery RTO < 4 hours
- **Priority:** P0

### NFR-006: Scalability
- **Description:** System must scale to support multiple simultaneous expeditions
- **Acceptance Criteria:**
  - Support 5 concurrent expeditions
  - Horizontal scaling for API layer
  - Database read replicas for geographic distribution
  - CDN for static assets
- **Priority:** P1

### NFR-007: Audit Trail
- **Description:** All cargo handovers and emergency alerts must be auditable
- **Acceptance Criteria:**
  - Log all cargo receipt/damage/transfer events
  - Log all emergency alert activations
  - Immutable audit log (append-only)
  - Export audit reports for compliance
- **Priority:** P0

### NFR-008: Accessibility
- **Description:** System must be usable in extreme polar conditions
- **Acceptance Criteria:**
  - WCAG 2.1 AA compliance
  - High-contrast mode for low-light conditions
  - Large touch targets for gloved hands
  - Keyboard navigation support
- **Priority:** P2
