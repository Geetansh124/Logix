# Testing Strategy

## Quality Goals

The platform must preserve data integrity despite intermittent connectivity, make emergency workflows dependable, and provide an auditable chain of custody for cargo and assets.

## Test Layers

- **Unit tests:** Business rules, stowage scoring, depletion calculations, RBAC checks, input validation.
- **Integration tests:** REST APIs, database transactions, PostGIS queries, QR receipt flow, notification delivery adapters.
- **End-to-end tests:** Planner-to-station cargo journey, offline inventory update and sync, roll call, Level 1 emergency alert.
- **Security tests:** Authentication, authorization, OWASP checks, dependency scanning, secret detection.
- **Performance tests:** Low-bandwidth simulation, WebSocket reconnection, sync backlog, concurrent operations.
- **Resilience tests:** Network loss, duplicate messages, out-of-order events, database failover, service restart.

## Critical Acceptance Tests

1. An inventory update entered offline appears locally immediately and syncs without data loss after reconnection.
2. A conflicting inventory update is detected, recorded, and resolved according to the documented rule.
3. A P0 container cannot be assigned an invalid stowage position without an explicit authorized override and audit event.
4. A cargo receipt creates a custody record with actor, timestamp, hub, condition, and supporting notes.
5. A Level 1 alert snapshots roll call and critical stock, creates an audit event, and dispatches notifications.
6. A station manager cannot access another station's restricted data without a permitted role and scope.

## Test Data

Use synthetic personnel, cargo, medical, inventory, and asset data in all development and test environments. Never use production personal data in local machines, demos, screenshots, or public repositories.

## Definition of Done

A feature is complete only when requirements are traceable to tests, offline behaviour is verified where applicable, authorization tests pass, logging is implemented, documentation is updated, and reviewers approve the change.
