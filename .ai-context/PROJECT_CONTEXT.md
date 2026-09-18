# Project Context: Integrated Polar Expedition Logistics Platform

## Executive Summary
India operates two permanent Antarctic research stations (Maitri and Bharati) requiring year-long logistical planning. Every container of food, fuel, equipment, and spare parts must be tracked across multiple international touchpoints (Goa → Cape Town → Antarctica) with zero tolerance for error. This platform centralizes expedition planning, cargo tracking, inventory management, personnel movement, and emergency response into a single command center.

## Problem Statement
- **Fragmented systems:** Current operations rely on spreadsheets across multiple hubs
- **No real-time visibility:** Cargo location, inventory depletion, and personnel whereabouts lack centralized monitoring
- **Critical timing:** Incorrect stowage order can delay essential supplies for weeks
- **Emergency gaps:** No unified system for roll call, resource availability, and evacuation protocols during polar emergencies
- **Asset management:** Movable/immovable assets lack systematic lifecycle tracking

## Stakeholders
| Stakeholder | Role | Communication Preference |
|-------------|------|-------------------------|
| NCPOR Director | Project Sponsor | Executive summaries, risk dashboards |
| Expedition Planners | Primary Users | Detailed manifests, stowage optimization |
| Station Managers | End Users | Inventory alerts, consumption projections |
| Cargo Handlers | End Users | GPS tracking, receipt confirmation |
| MoES Emergency Cell | Critical Users | One-click alerts, real-time roll call |
| Researchers at Stations | End Users | Simple UI, offline-capable |

## Current Phase & Milestones
- **Phase:** Requirements & Architecture (Week 1-4 of 16-week timeline)
- **Deadline:** 30 September 2026 (SIH 2026 submission)
- **Milestone 1:** Core platform setup (Week 4)
- **Milestone 2:** Tracking & Inventory modules (Week 8)
- **Milestone 3:** Personnel & Emergency modules (Week 12)
- **Milestone 4:** Testing & Pilot deployment (Week 16)

## Business Objectives
1. Eliminate stockout incidents at Antarctic stations (90% reduction target)
2. Reduce time to locate cargo from hours/days to <5 minutes
3. Enable emergency response propagation in <2 minutes
4. Achieve >98% real-time inventory accuracy
5. Provide 100% personnel roll call visibility at all times

## Risk Factors
- **High:** Offline synchronization conflicts in polar conditions
- **High:** Satellite connectivity limitations in Antarctic regions
- **Medium:** Multi-hub data consistency across international borders
- **Medium:** Security compliance for personnel and asset data
- **Low:** User adoption (NCPOR has expressed strong need for this system)

## Success Criteria (Measurable)
- Stockout incidents reduced by 90%
- Cargo location time: <5 minutes (from hours/days)
- Emergency alert propagation: <2 minutes
- Inventory accuracy: >98% real-time
- Personnel tracking: 100% roll call visibility
- Expedition cost reduction: 20-30% through optimized logistics

## Domain-Specific Constraints
- **Antarctic Treaty Compliance:** All operations must comply with international Antarctic protocols
- **Seasonal Windows:** Only one resupply ship per year per station (November-March)
- **Extreme Conditions:** -40°C to -60°C temperatures affect equipment reliability
- **Communication Blackouts:** Stations may be unreachable for days during polar storms
- **Critical Supplies:** Fuel, food, medical supplies, oxygen—stockouts are life-threatening
