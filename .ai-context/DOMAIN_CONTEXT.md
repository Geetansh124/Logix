# Domain Context: Polar Expedition Logistics

## Antarctic Operations Overview

### Research Stations
- **Maitri Station:** Established 1989, Schirmacher Oasis, East Antarctica
  - Capacity: 25 personnel (summer), 15 (winter)
  - Annual consumption: ~50,000L diesel, ~30,000kg food supplies
- **Bharati Station:** Established 2015, Larsemann Hills, East Antarctica
  - Capacity: 20 personnel (summer), 10 (winter)
  - Annual consumption: ~40,000L diesel, ~25,000kg food supplies

### Expedition Timeline
```
Year-Long Planning Cycle:
- January-March: Requirements gathering from stations
- April-June: Cargo consolidation at NCPOR-Goa
- July-September: Ship charter and voyage planning
- October: Final manifest approval
- November-March: Voyage execution (Goa → Cape Town → Antarctica)
- March-April: Station receipt confirmation and inventory update
```

### Critical Logistics Constraints
1. **Single Annual Voyage:** Only one resupply ship per station per year (November-March window)
2. **Stowage Order:** Last-loaded = First-offloaded (critical for essential supplies)
3. **International Touchpoints:** 
   - NCPOR-Goa (origin)
   - CGI-Cape Town (transshipment hub)
   - Maitri/Bharati (destination)
4. **Extreme Conditions:** -40°C to -60°C affects equipment, fuel viscosity, food preservation
5. **Communication Blackouts:** Polar storms can isolate stations for days

## Cargo Categories & Priority

| Category | Examples | Priority | Shelf Life | Temperature Sensitivity |
|----------|----------|----------|------------|------------------------|
| **Critical** | Medical supplies, oxygen cylinders, fuel | P0 | Varies | High |
| **Essential** | Food supplies, spare parts, scientific equipment | P1 | 6-12 months | Medium |
| **Standard** | Clothing, stationery, recreational items | P2 | Indefinite | Low |
| **Bulk** | Construction materials, vehicles, heavy machinery | P3 | Indefinite | None |

## Inventory Management Domain Rules

### Consumption Rate Calculation
```
Daily Consumption Rate = (Historical Average) × (Seasonal Factor) × (Personnel Count Factor)

Seasonal Factors:
- Summer (Nov-Feb): 1.2× (higher activity, more personnel)
- Winter (Mar-Oct): 0.8× (lower activity, fewer personnel)

Safety Stock Formula:
Safety Stock = (Max Daily Consumption × Max Lead Time) - (Avg Daily Consumption × Avg Lead Time)
Reorder Point = (Avg Daily Consumption × Avg Lead Time) + Safety Stock
```

### Depletion Projection Algorithm
```
For each inventory item:
  1. Calculate current stock level
  2. Project daily consumption based on:
     - Historical consumption patterns
     - Current personnel count
     - Seasonal activity level
     - Planned scientific experiments (equipment usage)
  3. Forecast depletion date = Current Stock / Projected Daily Consumption
  4. Alert if depletion date < Next Resupply Window
```

## Emergency Response Protocols

### Emergency Levels
- **Level 1 (Critical):** Life-threatening (medical emergency, fire, structural failure)
  - Response: Immediate MoES notification, evacuation protocol activation
- **Level 2 (Serious):** Station operations compromised (fuel shortage, equipment failure)
  - Response: MoES notification, emergency resupply consideration
- **Level 3 (Advisory):** Non-critical issues (personnel rotation delay, minor equipment)
  - Response: Log incident, notify expedition planners

### Emergency Alert Propagation
```
1. Station Manager triggers one-click alert
2. System captures: current roll call, critical inventory levels, emergency type
3. Auto-notification sent to:
   - NCPOR Director (within 30 seconds)
   - MoES Emergency Cell (within 60 seconds)
   - Expedition Planning Team (within 90 seconds)
4. Real-time dashboard updated with emergency status
5. Evacuation protocol activated if Level 1
```

## Personnel Movement Domain

### Rotation Schedule
- **Summer Expedition:** November-March (4-5 months)
- **Winter Expedition:** March-November (8-9 months)
- **Medical Clearance:** Mandatory before deployment
- **Roll Call:** Required twice daily (0800 and 2000 hours)

### Personnel Status States
- `ACTIVE_ON_STATION` - Currently at Antarctic station
- `IN_TRANSIT` - En route to/from station
- `MEDICAL_HOLD` - Cleared but on medical hold
- `ROTATION_DUE` - Scheduled for rotation within 30 days
- `DEPLOYED` - Currently on expedition voyage

## Asset Management Domain

### Asset Categories
- **Movable Assets:** Vehicles, scientific equipment, generators, containers
- **Immovable Assets:** Station infrastructure, buildings, fuel tanks, communication towers
- **Consumable Assets:** Fuel, food, medical supplies, spare parts

### Asset Lifecycle States
```
Procurement → Consolidation (Goa) → Voyage → Station Receipt → 
Active Use → Maintenance → Decommissioning → Disposal/Recycling
```

## Compliance & Regulatory Context

### Antarctic Treaty System
- All operations must comply with Protocol on Environmental Protection
- Waste management and disposal protocols mandatory
- Environmental impact assessments required for new infrastructure

### International Maritime Regulations
- Cargo ship must comply with Polar Code (IMO regulations)
- Insurance requirements for polar voyage
- Customs documentation for Cape Town transshipment

### Data Protection
- Personnel data must comply with Indian data protection laws
- Asset tracking data classified as sensitive government information
- Audit trail required for all cargo handovers across international borders
