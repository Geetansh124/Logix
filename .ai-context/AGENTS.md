# Polar Expedition Logistics Platform - AI Agent Context

## Project Identity
- **Name:** Integrated Polar Expedition Logistics and Asset Management System
- **ID:** SIH26062 (Smart India Hackathon 2026)
- **Client:** Ministry of Earth Sciences (MoES), NCPOR
- **Domain:** Polar expedition logistics, Antarctica operations
- **Criticality:** Life-safety system (food, fuel, medical supplies for research stations)

## Tech Stack (Non-Negotiable)
- **Frontend:** React 18 + Vite + Tailwind CSS + Leaflet + Chart.js
- **Backend:** Node.js + Express + Socket.io (real-time)
- **Database:** PostgreSQL + PostGIS (geospatial queries)
- **Auth:** JWT + bcryptjs with RBAC
- **Architecture:** Offline-first, multi-hub synchronization

## Core Modules
1. Expedition Planning (mission scheduling, resource allocation, voyage manifests)
2. Cargo Tracking (GPS integration, stowage order, real-time visibility)
3. Inventory Management (consumption rates, depletion projections, expiry alerts)
4. Personnel Movement (rotation schedules, roll call, medical clearance)
5. Emergency Response (one-click alerts, auto-notification to MoES, evacuation protocols)

## Critical Constraints
- **Offline-first:** Antarctic stations have no/poor internet; must sync when connectivity resumes
- **Multi-hub:** NCPOR-Goa → CGI-Cape Town → Maitri/Bharati (Antarctica)
- **Stowage logic:** Last-loaded = First-offloaded (critical for expedition success)
- **Real-time:** Socket.io for cargo tracking and emergency alerts
- **Security:** End-to-end encryption, role-based access control

## AI Agent Guidelines
- Always cite file paths when referencing code
- Prioritize offline-first patterns in all implementations
- Validate all geospatial queries use PostGIS
- Never suggest synchronous operations for cargo tracking
- Emergency alerts must propagate in <2 minutes
- Test all features with simulated connectivity loss

## Key Files
- `/src/modules/cargo/tracking.service.ts` - Real-time cargo location
- `/src/modules/inventory/depletion.predictor.ts` - ML-based stockout prediction
- `/src/modules/emergency/alert.system.ts` - One-click emergency propagation
- `/database/schema.prisma` - Core data models
- `/src/offline/sync.manager.ts` - Offline-first synchronization

## Success Metrics
- Stockout incidents: 90% reduction
- Cargo location time: <5 minutes
- Emergency response: <2 minutes
- Inventory accuracy: >98%
- Personnel tracking: 100% roll call visibility
