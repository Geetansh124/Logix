# Workflow Diagrams

## Cargo Journey

```text
Indent Raised
  -> Planner Approval
  -> Procurement / Packing
  -> Container Assigned + QR Label
  -> NCPOR Goa Receipt
  -> Stowage Plan Approved
  -> Vessel Departure
  -> Cape Town Transshipment Receipt
  -> Antarctic Arrival
  -> Station Receipt + Condition Capture
  -> Inventory Updated + Audit Event Closed
```

## Offline Synchronization

```text
User action
  -> Validate locally
  -> Write mutation to IndexedDB outbox
  -> Show local success state
  -> Detect connectivity
  -> Send queued mutations to Sync API
  -> Server validates and commits transaction
  -> Receive acknowledgement / conflict response
  -> Apply canonical server state
  -> Mark outbox mutation complete
```

## Emergency Response

```text
Station user triggers alert
  -> Confirm alert type and severity
  -> Capture last roll call and critical-stock snapshot
  -> Store emergency event locally and enqueue sync
  -> Send via available channel
  -> Server creates incident and immutable audit event
  -> Notify NCPOR, MoES, planners, responders
  -> Stakeholders acknowledge / coordinate / update status
  -> Incident resolved and post-incident report generated
```
