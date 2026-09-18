# Architecture Decision Records (ADRs)

## ADR-001: PostgreSQL + PostGIS over MongoDB

### Status
Accepted

### Context
The platform requires robust geospatial queries for cargo tracking, station mapping, and proximity-based alerts. We evaluated PostgreSQL + PostGIS vs. MongoDB for data storage.

### Decision
Chose PostgreSQL + PostGIS over MongoDB.

### Rationale
- **Geospatial Capabilities:** PostGIS provides industry-leading geospatial functions (distance calculations, proximity queries, geofencing) with superior performance
- **Data Integrity:** PostgreSQL's ACID compliance critical for financial transactions (cargo payments at Cape Town) and inventory tracking
- **Complex Queries:** Expedition logistics require complex joins (cargo → container → expedition → station) better suited to relational model
- **Maturity:** PostGIS has 20+ years of development, proven in production for government and military applications
- **Compliance:** PostgreSQL's audit logging and row-level security align with government security requirements

### Consequences
- **Positive:** Robust geospatial queries, strong data integrity, mature ecosystem
- **Negative:** More complex schema migrations vs. document database, requires ORM (Sequelize) for TypeScript integration
- **Mitigation:** Use Prisma/Sequelize for type-safe queries, implement comprehensive migration tests

### References
- PostGIS Documentation: https://postgis.net/
- MongoDB Geospatial: https://www.mongodb.com/docs/manual/geospatial-queries/

---

## ADR-002: Offline-First Architecture

### Status
Accepted

### Context
Antarctic stations have no or extremely limited internet connectivity. The platform must function fully offline and synchronize when connectivity resumes.

### Decision
Implemented offline-first architecture with local IndexedDB storage and automatic synchronization.

### Rationale
- **Operational Necessity:** Stations may be offline for days during polar storms; system must remain functional
- **User Experience:** Station managers need to record inventory changes, cargo receipts, and roll calls in real-time (even offline)
- **Data Integrity:** Local-first approach ensures no data loss during connectivity blackouts
- **Conflict Resolution:** Modern conflict resolution algorithms (last-write-wins, custom merge strategies) handle concurrent edits

### Consequences
- **Positive:** System remains functional during connectivity blackouts, no data loss, improved user experience
- **Negative:** Increased complexity (sync logic, conflict resolution), larger client-side storage requirements
- **Mitigation:** Use established libraries (PouchDB, Dexie.js) for IndexedDB abstraction, implement comprehensive sync tests

### References
- Offline-First Manifesto: https://offlinefirst.org/
- PouchDB: https://pouchdb.com/
- Dexie.js: https://dexie.org/

---

## ADR-003: Socket.io over Raw WebSockets

### Status
Accepted

### Context
Real-time cargo tracking and emergency alerts require low-latency bidirectional communication. We evaluated Socket.io vs. raw WebSockets.

### Decision
Chose Socket.io over raw WebSockets.

### Rationale
- **Fallback Support:** Socket.io automatically falls back to HTTP long-polling if WebSockets unavailable (critical for polar regions with unstable connectivity)
- **Reconnection:** Automatic reconnection with exponential backoff handles network interruptions
- **Rooms:** Built-in room abstraction for subscription-based updates (cargo:expeditionId, inventory:stationId)
- **Acknowledgments:** Built-in acknowledgment mechanism for critical messages (emergency alerts)
- **Ecosystem:** Mature client libraries for React, Node.js, mobile platforms

### Consequences
- **Positive:** Robust real-time communication with fallback support, automatic reconnection, easier subscription management
- **Negative:** Slightly higher overhead vs. raw WebSockets, additional dependency
- **Mitigation:** Use binary message format for efficiency, monitor Socket.io performance metrics

### References
- Socket.io Documentation: https://socket.io/
- WebSocket API: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

---

## ADR-004: RBAC over ABAC

### Status
Accepted

### Context
The platform requires fine-grained access control for different user roles (expedition planners, station managers, cargo handlers, emergency responders). We evaluated Role-Based Access Control (RBAC) vs. Attribute-Based Access Control (ABAC).

### Decision
Chose RBAC over ABAC.

### Rationale
- **Simplicity:** RBAC easier to understand, implement, and audit vs. complex ABAC policies
- **Performance:** RBAC permission checks faster (role lookup vs. policy evaluation)
- **Government Standards:** RBAC aligns with Indian government security standards (STQC compliance)
- **Sufficient Granularity:** Current requirements can be met with role + resource-level permissions (e.g., station manager can only access their station's data)

### Consequences
- **Positive:** Simpler implementation, faster permission checks, easier auditing, compliance alignment
- **Negative:** Less flexible than ABAC for complex scenarios (e.g., "allow access if user is station manager AND station is in emergency state AND time is 0800-2000")
- **Mitigation:** Can evolve to ABAC in future if requirements become more complex; current RBAC implementation supports resource-level scoping

### References
- NIST RBAC Standard: https://csrc.nist.gov/projects/role-based-access-control
- ABAC vs. RBAC: https://www.auth0.com/blog/abac-vs-rbac/

---

## ADR-005: React 18 + Vite over Next.js

### Status
Accepted

### Context
The frontend requires fast development, offline-first PWA capabilities, and deployment flexibility. We evaluated React 18 + Vite vs. Next.js.

### Decision
Chose React 18 + Vite over Next.js.

### Rationale
- **Offline-First:** Vite's simpler build output easier to configure for offline-first PWA (service workers, IndexedDB)
- **Deployment Flexibility:** Static build can be deployed to any CDN (Cloudflare, AWS S3) without Node.js server requirement
- **Development Speed:** Vite's instant HMR (Hot Module Replacement) faster than Next.js for development
- **Cost:** No server-side rendering required (all data from API), so Next.js SSR benefits not needed
- **Bundle Size:** Vite produces smaller bundles for SPA use case

### Consequences
- **Positive:** Faster development, simpler deployment, better offline support, lower hosting costs
- **Negative:** No SSR (SEO not critical for this internal tool), manual routing setup vs. Next.js file-based routing
- **Mitigation:** Use React Router for client-side routing, implement comprehensive PWA tests

### References
- Vite Documentation: https://vitejs.dev/
- Next.js Documentation: https://nextjs.org/
- PWA Best Practices: https://web.dev/progressive-web-apps/

---

## ADR-006: JWT with 15-Minute Expiry

### Status
Accepted

### Context
The platform requires secure authentication with balance between security and user experience. We evaluated JWT token expiry times.

### Decision
Chose JWT with 15-minute access token expiry and 7-day refresh token.

### Rationale
- **Security:** Short-lived access tokens reduce impact of token theft (15-minute window)
- **User Experience:** Refresh tokens allow seamless re-authentication without user re-entering credentials
- **Compliance:** Aligns with Indian government security guidelines for sensitive applications
- **Revocation:** Can revoke refresh tokens immediately if compromise detected

### Consequences
- **Positive:** Strong security with minimal user friction, compliant with government standards
- **Negative:** Slightly more complex token refresh logic, refresh token storage security critical
- **Mitigation:** Store refresh tokens in HTTP-only cookies (not accessible to JavaScript), implement refresh token rotation

### References
- JWT Best Practices: https://auth0.com/blog/jwt-security-best-practices/
- OAuth 2.0 Token Rotation: https://datatracker.ietf.org/doc/html/draft-ietf-oauth-token-exchange

---

## ADR-007: Multi-Hub Data Synchronization

### Status
Accepted

### Context
The platform must synchronize data across multiple international hubs (NCPOR-Goa, CGI-Cape Town, Maitri/Bharati) with intermittent connectivity.

### Decision
Implemented event-driven multi-hub synchronization with conflict resolution.

### Rationale
- **Geographic Distribution:** Hubs span multiple countries and time zones; centralized database too slow for real-time operations
- **Connectivity:** Antarctic stations have intermittent connectivity; must support offline operations with eventual consistency
- **Data Sovereignty:** Some data must remain within India (compliance requirement); cannot use single global database
- **Conflict Resolution:** Modern conflict resolution algorithms handle concurrent edits across hubs

### Consequences
- **Positive:** Supports offline operations, complies with data sovereignty requirements, better performance for local operations
- **Negative:** Eventual consistency (not strong consistency), complex conflict resolution logic, increased testing burden
- **Mitigation:** Use event sourcing for audit trail, implement comprehensive conflict resolution tests, provide conflict resolution UI for users

### References
- Event Sourcing: https://martinfowler.com/eaaDev/EventSourcing.html
- Conflict-Free Replicated Data Types: https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type
