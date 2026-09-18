# Integrated Polar Expedition Logistics and Asset Management System

## Project Overview

A centralized digital platform for India's Antarctic expedition operations, enabling expedition planning, cargo tracking, inventory management, personnel movement, and emergency response across multiple international hubs (Goa → Cape Town → Antarctica).

**Problem Statement ID:** SIH26062  
**Organization:** Ministry of Earth Sciences (MoES), NCPOR  
**Deadline:** 30 September 2026 (Smart India Hackathon 2026)

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+ with PostGIS extension
- Redis 7+
- Docker (optional, for containerized deployment)

### Development Setup

```bash
# Clone repository
git clone https://github.com/your-org/polar-expedition-platform.git
cd polar-expedition-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials, JWT secret, etc.

# Run database migrations
npm run db:migrate

# Start development server
npm run dev

# Access application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
# API Documentation: http://localhost:3000/api-docs
```

### Docker Setup

```bash
# Start all services (PostgreSQL, Redis, API, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Documentation

### AI Context Files (for AI Agents)
- [`AGENTS.md`](./.ai-context/AGENTS.md) - Primary AI context file (start here)
- [`PROJECT_CONTEXT.md`](./.ai-context/PROJECT_CONTEXT.md) - Master project brief
- [`ARCHITECTURE_CONTEXT.md`](./.ai-context/ARCHITECTURE_CONTEXT.md) - System architecture
- [`DOMAIN_CONTEXT.md`](./.ai-context/DOMAIN_CONTEXT.md) - Polar expedition domain knowledge
- [`REQUIREMENTS_CONTEXT.md`](./.ai-context/REQUIREMENTS_CONTEXT.md) - Functional and non-functional requirements
- [`DATA_CONTEXT.md`](./.ai-context/DATA_CONTEXT.md) - Database schema and data models
- [`API_CONTEXT.md`](./.ai-context/API_CONTEXT.md) - API specifications
- [`SECURITY_CONTEXT.md`](./.ai-context/SECURITY_CONTEXT.md) - Security protocols
- [`DEPLOYMENT_CONTEXT.md`](./.ai-context/DEPLOYMENT_CONTEXT.md) - Infrastructure and deployment
- [`DECISION_LOG.md`](./.ai-context/DECISION_LOG.md) - Architecture Decision Records

### Additional Documentation
- [`docs/user-stories.md`](./docs/user-stories.md) - User stories and acceptance criteria
- [`docs/workflow-diagrams.md`](./docs/workflow-diagrams.md) - System workflow diagrams
- [`docs/testing-strategy.md`](./docs/testing-strategy.md) - Testing approach and test plans

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React 18  │────▶│  Node.js +  │────▶│ PostgreSQL  │
│   + Vite    │◀────│   Express   │◀────│  + PostGIS  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Leaflet   │     │  Socket.io  │     │    Redis    │
│  Chart.js   │     │   + JWT     │     │   (Cache)   │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Core Modules

1. **Expedition Planning** - Mission scheduling, resource allocation, voyage manifests
2. **Cargo Tracking** - GPS integration, stowage order, real-time visibility
3. **Inventory Management** - Consumption rates, depletion projections, expiry alerts
4. **Personnel Movement** - Rotation schedules, roll call, medical clearance
5. **Emergency Response** - One-click alerts, auto-notification to MoES, evacuation protocols

## Testing

```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## Deployment

### Staging Environment
```bash
npm run deploy:staging
```

### Production Environment
```bash
npm run deploy:production
```

## Contributing

### For AI Agents
1. Read [`AGENTS.md`](./.ai-context/AGENTS.md) for project context and guidelines
2. Always cite file paths when referencing code
3. Prioritize offline-first patterns in all implementations
4. Validate all geospatial queries use PostGIS
5. Never suggest synchronous operations for cargo tracking

### For Human Developers
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a pull request

## License

This project is licensed under the [MIT License](LICENSE). Developed for the Ministry of Earth Sciences (MoES), Government of India, as part of Smart India Hackathon 2026.

## Contact

- **Project Sponsor:** NCPOR Director
- **Technical Lead:** [Your Name/Team Name]
- **Email:** [your-email@example.com]
- **SIH 2026 Problem Statement:** SIH26062
