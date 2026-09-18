# API Context: REST & WebSocket Specifications

## Base URL & Authentication

```
Base URL: https://api.polar-expedition.ncpor.gov.in/v1

Authentication: Bearer JWT Token
Header: Authorization: Bearer <jwt_token>

Token Expiry: 15 minutes (with refresh token support)
```

## REST API Endpoints

### Expedition Management

```http
# List all expeditions
GET /expeditions
Query Params: status, startDate, endDate, station

# Get expedition details
GET /expeditions/:id
Response: Expedition object with stations, personnel, cargo

# Create new expedition
POST /expeditions
Body: { name, startDate, endDate, stationIds, personnelIds }

# Update expedition
PUT /expeditions/:id
Body: { name?, startDate?, endDate?, status? }

# Delete expedition
DELETE /expeditions/:id
```

### Cargo Tracking

```http
# List cargo for expedition
GET /expeditions/:expeditionId/cargo
Query Params: status, priority, category, destinationHub

# Get cargo details with location history
GET /cargo/:id
Response: Cargo object with container, location history, receipt confirmations

# Update cargo location (GPS update)
PATCH /cargo/:id/location
Body: { lat, lng, hub?, timestamp }

# Confirm cargo receipt at hub
POST /cargo/:id/receipt
Body: { hub, condition, confirmedBy, notes? }

# Get stowage plan for expedition
GET /expeditions/:expeditionId/stowage-plan
Response: Array of cargo sorted by stowageOrder

# Update stowage order
PUT /cargo/:id/stowage-order
Body: { stowageOrder }
```

### Inventory Management

```http
# Get inventory for station
GET /stations/:stationId/inventory
Query Params: category, depletionAlert, expiryAlert

# Get inventory item details
GET /inventory/:id
Response: Inventory object with consumption history

# Update inventory stock
PATCH /inventory/:id/stock
Body: { quantityChange, reason, timestamp }

# Get depletion projections
GET /stations/:stationId/inventory/depletion-projections
Response: Array of items with depletionDate, daysRemaining, alertLevel

# Get consumption analytics
GET /stations/:stationId/inventory/consumption-analytics
Query Params: itemId, startDate, endDate, granularity (daily/weekly/monthly)
Response: Time series data with actual vs projected consumption

# Trigger reorder
POST /inventory/:id/reorder
Body: { quantity, priority, notes? }
Response: Purchase requisition object
```

### Personnel Management

```http
# List personnel for expedition
GET /expeditions/:expeditionId/personnel
Query Params: status, rotationDue, medicalClearanceExpiry

# Get personnel details
GET /personnel/:id
Response: Personnel object with expedition, roll call history

# Update personnel status
PATCH /personnel/:id/status
Body: { status, currentStation?, rotationDue?, medicalClearanceExpiry? }

# Record roll call
POST /stations/:stationId/roll-call
Body: { timestamp, personnelIds, status }
Response: RollCall object

# Get roll call history
GET /stations/:stationId/roll-call
Query Params: startDate, endDate, status
```

### Emergency Response

```http
# Trigger emergency alert
POST /stations/:stationId/emergency
Body: { level, type, description, triggeredBy }
Response: Emergency object with auto-captured roll call and inventory snapshot

# Get active emergencies
GET /stations/:stationId/emergencies
Query Params: status, level

# Get emergency details
GET /emergencies/:id
Response: Emergency object with notifications, timeline

# Update emergency status
PATCH /emergencies/:id/status
Body: { status, notes? }

# Get resource availability dashboard
GET /stations/:stationId/emergency/resource-dashboard
Response: { fuel: { quantity, daysRemaining }, food: {...}, medical: {...}, oxygen: {...} }
```

### Asset Management

```http
# List assets for station
GET /stations/:stationId/assets
Query Params: type, category, status

# Get asset details
GET /assets/:id
Response: Asset object with maintenance history

# Create new asset
POST /assets
Body: { assetId, name, type, category, stationId?, location, value, purchaseDate }

# Update asset status
PATCH /assets/:id/status
Body: { status, location? }

# Schedule maintenance
POST /assets/:id/maintenance
Body: { scheduledDate, type, description }

# Record maintenance completion
PATCH /assets/:id/maintenance/:maintenanceId
Body: { completedDate, notes? }
```

## WebSocket Events (Socket.io)

### Connection & Authentication

```javascript
// Client connects with JWT token
const socket = io('wss://api.polar-expedition.ncpor.gov.in', {
  auth: { token: jwtToken }
});

// Server validates token and establishes connection
socket.on('connect', () => {
  console.log('Connected with user:', socket.handshake.auth.user);
});
```

### Real-Time Cargo Tracking

```javascript
// Client subscribes to cargo updates for expedition
socket.emit('subscribe:cargo', { expeditionId });

// Server pushes location updates
socket.on('cargo:location:update', (data) => {
  // data: { cargoId, location: { lat, lng, hub, timestamp } }
  updateMapMarker(data);
});

// Server pushes status changes
socket.on('cargo:status:update', (data) => {
  // data: { cargoId, status, timestamp }
  updateCargoStatus(data);
});
```

### Real-Time Inventory Alerts

```javascript
// Client subscribes to inventory alerts for station
socket.emit('subscribe:inventory', { stationId });

// Server pushes depletion alerts
socket.on('inventory:depletion:alert', (data) => {
  // data: { itemId, itemName, currentStock, depletionDate, daysRemaining }
  showDepletionAlert(data);
});

// Server pushes expiry alerts
socket.on('inventory:expiry:alert', (data) => {
  // data: { itemId, itemName, expiryDate, daysUntilExpiry }
  showExpiryAlert(data);
});
```

### Emergency Alert Propagation

```javascript
// Client triggers emergency (one-click)
socket.emit('emergency:trigger', { stationId, level, type, description, triggeredBy });

// Server acknowledges and broadcasts to all stakeholders
socket.on('emergency:acknowledged', (data) => {
  // data: { emergencyId, notificationsSent: [...] }
  showEmergencyConfirmation(data);
});

// All subscribed clients receive emergency broadcast
socket.on('emergency:broadcast', (data) => {
  // data: { emergencyId, stationId, level, type, rollCallSnapshot, inventorySnapshot, triggeredAt }
  showEmergencyDashboard(data);
});
```

### Personnel Roll Call Updates

```javascript
// Client subscribes to roll call updates for station
socket.emit('subscribe:roll-call', { stationId });

// Server pushes roll call completions
socket.on('roll-call:completed', (data) => {
  // data: { rollCallId, timestamp, status, missingPersonnel: [...] }
  updateRollCallStatus(data);
});
```

### Offline Sync Events

```javascript
// Client pushes offline mutations when connectivity resumes
socket.emit('sync:push', { operations: [...] });

// Server acknowledges and returns any server-side changes
socket.on('sync:ack', (data) => {
  // data: { acknowledged: [...], conflicts: [...], serverChanges: [...] }
  handleSyncResponse(data);
});

// Server pushes server-side changes to offline clients
socket.on('sync:pull', (data) => {
  // data: { changes: [...] }
  applyServerChanges(data);
});
```

## Error Handling & Status Codes

```http
# Success
200 OK - Standard success response
201 Created - Resource created successfully
204 No Content - Successful deletion

# Client Errors
400 Bad Request - Invalid request body or parameters
401 Unauthorized - Missing or invalid JWT token
403 Forbidden - Insufficient permissions (RBAC)
404 Not Found - Resource does not exist
409 Conflict - Resource conflict (e.g., duplicate container ID)
422 Unprocessable Entity - Validation errors

# Server Errors
500 Internal Server Error - Unexpected server error
503 Service Unavailable - Server temporarily unavailable (maintenance)
```

## Rate Limiting

```
Rate Limit: 100 requests per minute per user
Rate Limit: 1000 WebSocket messages per minute per connection

Headers:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1631234567
```

## API Versioning

```
Current Version: v1
Deprecation Policy: 6 months notice before deprecation
Migration Guide: Provided for each major version upgrade
```

## Sample Request/Response

```http
# Request: Get depletion projections for Bharati station
GET /stations/bharati-station-id/inventory/depletion-projections
Authorization: Bearer <jwt_token>

# Response: 200 OK
{
  "data": [
    {
      "itemId": "diesel-001",
      "itemName": "Diesel Fuel",
      "category": "Fuel",
      "currentStock": 15000,
      "unit": "liters",
      "dailyConsumption": 250,
      "depletionDate": "2026-10-17T00:00:00Z",
      "daysRemaining": 60,
      "alertLevel": "WARNING",
      "nextResupplyWindow": "2026-11-01T00:00:00Z"
    },
    {
      "itemId": "food-rice-001",
      "itemName": "Rice",
      "category": "Food",
      "currentStock": 500,
      "unit": "kg",
      "dailyConsumption": 15,
      "depletionDate": "2026-12-27T00:00:00Z",
      "daysRemaining": 100,
      "alertLevel": "INFO",
      "nextResupplyWindow": "2026-11-01T00:00:00Z"
    }
  ]
}
```
