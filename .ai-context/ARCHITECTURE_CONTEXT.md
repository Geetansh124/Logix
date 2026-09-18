# Architecture Context: Polar Expedition Platform

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                            │
│  React 18 + Vite + Tailwind CSS + Leaflet + Chart.js            │
│  (Offline-first PWA with service workers)                       │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                             │
│  Node.js + Express + Socket.io (real-time WebSocket)            │
│  JWT Authentication + RBAC Middleware                           │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│  │Expedition│ │  Cargo   │ │Inventory │ │Personnel │ │Emergency││
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │ │Service ││
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘│
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                         │
│  │ Offline  │ │  Sync    │ │Notification│                        │
│  │ Manager  │ │ Manager  │ │ Service   │                         │
│  └──────────┘ └──────────┘ └──────────┘                         │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                    │
│  PostgreSQL + PostGIS (geospatial queries)                      │
│  Redis (caching + Socket.io pub/sub)                            │
│  LocalStorage/IndexedDB (offline-first client-side storage)     │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack Justification

### Frontend
- **React 18 + Vite:** Fast development, hot module replacement, production optimization
- **Tailwind CSS:** Rapid UI development, consistent design system
- **Leaflet:** Geospatial visualization for cargo tracking and station maps
- **Chart.js:** Data visualization for inventory trends and consumption projections
- **Service Workers:** Offline-first PWA capabilities for polar stations

### Backend
- **Node.js + Express:** Non-blocking I/O for real-time cargo tracking
- **Socket.io:** WebSocket-based real-time updates (critical for emergency alerts)
- **JWT + bcryptjs:** Stateless authentication with secure password hashing
- **Sequelize ORM:** Type-safe database queries with migration support

### Database
- **PostgreSQL + PostGIS:** Geospatial queries for cargo location tracking
- **Redis:** Caching for frequently accessed data (inventory levels, personnel status)
- **IndexedDB:** Client-side offline storage with automatic sync

## Architecture Patterns

### 1. Offline-First Architecture
```typescript
// Pattern: All mutations go to local store first, then sync to server
class OfflineManager {
  async mutate(operation: Mutation) {
    await localStore.save(operation); // Always succeeds offline
    if (navigator.onLine) {
      await syncManager.push(operation);
    }
  }
}
```

### 2. Event-Driven Synchronization
```typescript
// Pattern: Changes emit events for multi-hub propagation
class SyncManager {
  async push(operation: Mutation) {
    await eventBus.emit('cargo.updated', operation);
    await notificationService.notifyStakeholders(operation);
  }
}
```

### 3. CQRS for Inventory Projections
```typescript
// Pattern: Separate read/write models for consumption projections
class InventoryService {
  async getDepletionProjection(stationId: string) {
    // Read from optimized projection table
    return await projectionRepo.getDepletionForecast(stationId);
  }
}
```

## Cross-Cutting Concerns

### Security
- End-to-end encryption for all data in transit (TLS 1.3)
- AES-256 encryption for sensitive data at rest
- RBAC with least-privilege access
- Audit logging for all cargo handovers and emergency alerts

### Observability
- Structured logging (JSON format) with correlation IDs
- Distributed tracing for multi-hub operations
- Real-time dashboards for expedition status
- Alerting on stockout predictions and emergency events

### Scalability
- Horizontal scaling for API layer (stateless design)
- Read replicas for PostgreSQL (geographic distribution)
- Redis clustering for high-availability caching
- CDN for static assets (critical for low-bandwidth polar regions)

## Technical Debt & Risks
- **Known Issue:** Offline sync conflict resolution needs extensive testing
- **Risk:** Satellite connectivity limitations may require store-and-forward patterns
- **Debt:** ML-based depletion prediction requires historical data (currently using rule-based)
- **Risk:** Multi-hub data consistency across international borders (India → South Africa → Antarctica)

## ADR References
- ADR-001: Chose PostgreSQL + PostGIS over MongoDB for geospatial queries
- ADR-002: Implemented offline-first architecture despite complexity
- ADR-003: Selected Socket.io over raw WebSockets for fallback support
- ADR-004: Adopted RBAC over ABAC for simpler permission management
