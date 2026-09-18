# Data Context: Database Schema & Data Models

## Entity Relationship Overview

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│ Expedition  │───┬───│   Cargo      │───┬───│  Container  │
└─────────────┘   │   └──────────────┘   │   └─────────────┘
       │          │            │          │
       │          │            │          │
       ▼          │            ▼          │
┌─────────────┐   │   ┌──────────────┐   │   ┌─────────────┐
│  Personnel  │───┘   │  Inventory   │───┘   │   Station   │
└─────────────┘       └──────────────┘       └─────────────┘
       │                     │
       │                     │
       ▼                     ▼
┌─────────────┐       ┌──────────────┐
│  Emergency  │       │    Asset     │
└─────────────┘       └──────────────┘
```

## Core Data Models (Prisma Schema)

```prisma
// Expedition Model
model Expedition {
  id          String   @id @default(uuid())
  name        String
  startDate   DateTime
  endDate     DateTime
  stations    Station[]
  personnel   Personnel[]
  cargo       Cargo[]
  status      ExpeditionStatus @default(PLANNING)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum ExpeditionStatus {
  PLANNING
  ACTIVE
  COMPLETED
  CANCELLED
}

// Station Model
model Station {
  id          String   @id @default(uuid())
  name        String   @unique // Maitri, Bharati
  location    Json     // { lat, lng, elevation }
  capacity    Int
  currentPersonnel Int
  inventories Inventory[]
  assets      Asset[]
  emergencies Emergency[]
}

// Cargo Model
model Cargo {
  id              String   @id @default(uuid())
  expeditionId    String
  expedition      Expedition @relation(fields: [expeditionId], references: [id])
  containerId     String
  container       Container @relation(fields: [containerId], references: [id])
  category        CargoCategory
  priority        Priority // P0, P1, P2, P3
  stowageOrder    Int      // Last-loaded = first-offloaded
  originHub       String   // NCPOR-Goa
  destinationHub  String   // CGI-Cape Town, Maitri, Bharati
  currentLocation Json     // { lat, lng, hub, timestamp }
  status          CargoStatus @default(IN_TRANSIT)
  receiptConfirmations ReceiptConfirmation[]
}

enum CargoCategory {
  CRITICAL
  ESSENTIAL
  STANDARD
  BULK
}

enum Priority {
  P0
  P1
  P2
  P3
}

enum CargoStatus {
  CONSOLIDATED
  IN_TRANSIT
  AT_TRANSSHIPMENT
  DELIVERED
  RECEIVED
  DAMAGED
}

// Container Model
model Container {
  id          String   @id @default(uuid())
  containerId String   @unique // QR code identifier
  type        String   // 20ft, 40ft, refrigerated, etc.
  dimensions  Json     // { length, width, height, weight }
  cargo       Cargo[]
}

// Inventory Model
model Inventory {
  id              String   @id @default(uuid())
  stationId       String
  station         Station @relation(fields: [stationId], references: [id])
  itemId          String
  itemName        String
  category        String
  currentStock    Float
  unit            String   // liters, kg, units, etc.
  location        String   // warehouse, lab, etc.
  expiryDate      DateTime?
  reorderPoint    Float
  safetyStock     Float
  dailyConsumption Float
  depletionDate   DateTime?
  lastUpdated     DateTime @default(now())
  consumptionHistory ConsumptionHistory[]
}

model ConsumptionHistory {
  id          String   @id @default(uuid())
  inventoryId String
  inventory   Inventory @relation(fields: [inventoryId], references: [id])
  date        DateTime
  quantity    Float
  reason      String   // normal usage, emergency, spillage, etc.
}

// Personnel Model
model Personnel {
  id              String   @id @default(uuid())
  name            String
  role            String
  expeditionId    String?
  expedition      Expedition? @relation(fields: [expeditionId], references: [id])
  status          PersonnelStatus @default(ACTIVE_ON_STATION)
  currentStation  String?
  medicalClearance DateTime?
  medicalClearanceExpiry DateTime?
  rotationDue     DateTime?
  rollCalls       RollCall[]
}

enum PersonnelStatus {
  ACTIVE_ON_STATION
  IN_TRANSIT
  MEDICAL_HOLD
  ROTATION_DUE
  DEPLOYED
}

// Roll Call Model
model RollCall {
  id          String   @id @default(uuid())
  stationId   String
  timestamp   DateTime
  personnel   Personnel[]
  status      RollCallStatus
}

enum RollCallStatus {
  COMPLETED
  PENDING
  MISSING_PERSONNEL
}

// Emergency Model
model Emergency {
  id              String   @id @default(uuid())
  stationId       String
  station         Station @relation(fields: [stationId], references: [id])
  level           EmergencyLevel // Level 1, 2, 3
  type            String
  description     String
  triggeredAt     DateTime @default(now())
  triggeredBy     String
  rollCallSnapshot Json
  inventorySnapshot Json
  status          EmergencyStatus @default(ACTIVE)
  notifications   Notification[]
}

enum EmergencyLevel {
  LEVEL_1_CRITICAL
  LEVEL_2_SERIOUS
  LEVEL_3_ADVISORY
}

enum EmergencyStatus {
  ACTIVE
  RESOLVED
  ESCALATED
}

// Notification Model
model Notification {
  id          String   @id @default(uuid())
  emergencyId String
  emergency   Emergency @relation(fields: [emergencyId], references: [id])
  recipient   String   // NCPOR Director, MoES Emergency Cell, etc.
  channel     NotificationChannel
  sentAt      DateTime @default(now())
  status      NotificationStatus @default(PENDING)
}

enum NotificationChannel {
  EMAIL
  SMS
  DASHBOARD
  WHATSAPP
}

enum NotificationStatus {
  PENDING
  SENT
  DELIVERED
  FAILED
}

// Asset Model
model Asset {
  id          String   @id @default(uuid())
  assetId     String   @unique
  name        String
  type        AssetType
  category    AssetCategory
  stationId   String?
  station     Station? @relation(fields: [stationId], references: [id])
  location    Json     // { lat, lng, building, room }
  status      AssetStatus
  purchaseDate DateTime
  value       Float
  maintenanceSchedule MaintenanceSchedule[]
}

enum AssetType {
  MOVABLE
  IMMOVABLE
  CONSUMABLE
}

enum AssetCategory {
  VEHICLE
  EQUIPMENT
  GENERATOR
  CONTAINER
  BUILDING
  INFRASTRUCTURE
  FUEL
  FOOD
  MEDICAL
  SPARE_PARTS
}

enum AssetStatus {
  ACTIVE
  IN_MAINTENANCE
  DECOMMISSIONED
  IN_TRANSIT
}

// Receipt Confirmation Model
model ReceiptConfirmation {
  id          String   @id @default(uuid())
  cargoId     String
  cargo       Cargo @relation(fields: [cargoId], references: [id])
  hub         String   // NCPOR-Goa, CGI-Cape Town, Maitri, Bharati
  timestamp   DateTime @default(now())
  condition   Condition // INTACT, DAMAGED
  confirmedBy String
  notes       String?
}

enum Condition {
  INTACT
  DAMAGED
  MISSING
}

// Maintenance Schedule Model
model MaintenanceSchedule {
  id          String   @id @default(uuid())
  assetId     String
  asset       Asset @relation(fields: [assetId], references: [id])
  scheduledDate DateTime
  completedDate DateTime?
  type        String
  description String
  status      MaintenanceStatus @default(SCHEDULED)
}

enum MaintenanceStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

## Indexes & Performance Optimization

```prisma
// Critical indexes for query performance
model Cargo {
  @@index([expeditionId])
  @@index([currentLocation])
  @@index([status])
  @@index([priority, stowageOrder])
}

model Inventory {
  @@index([stationId, category])
  @@index([depletionDate])
  @@index([expiryDate])
}

model Emergency {
  @@index([stationId, status])
  @@index([level, triggeredAt])
}

// Geospatial indexes (PostGIS)
model Station {
  @@map("stations")
  // location field uses GIST index for geospatial queries
}

model Cargo {
  @@map("cargo")
  // currentLocation field uses GIST index for proximity queries
}
```

## Data Migration Strategy

```
Phase 1: Legacy Data Import
- Import existing cargo manifests from Excel/CSV
- Import current inventory levels from station spreadsheets
- Import personnel roster from HR system
- Validate data integrity with checksums

Phase 2: Historical Data Enrichment
- Calculate historical consumption rates from past 3 expeditions
- Import asset registry from NCPOR database
- Map legacy container IDs to new QR code system

Phase 3: Cutover
- Freeze legacy systems during cutover (48-hour window)
- Final data sync and validation
- Go-live with new platform
- Parallel run for 2 weeks (legacy + new system)
```

## Data Retention & Archival

- **Active Expedition Data:** Retained indefinitely
- **Completed Expedition Data:** Archived after 2 years, retained for 10 years
- **Emergency Records:** Retained indefinitely (compliance requirement)
- **Audit Logs:** Retained for 7 years (compliance requirement)
- **Personnel Data:** Retained for 5 years post-deployment (privacy compliance)
