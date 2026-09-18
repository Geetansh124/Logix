# Deployment Context: Infrastructure & Strategy

## Cloud Infrastructure Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    GLOBAL LAYER                                  │
│  Cloudflare CDN (static assets, DDoS protection)                │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    REGIONAL LAYER (Mumbai)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  VPC (Virtual Private Cloud)                             │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │  │
│  │  │  Public     │  │  Private    │  │  Private    │      │  │
│  │  │  Subnet     │  │  Subnet 1   │  │  Subnet 2   │      │  │
│  │  │             │  │             │  │             │      │  │
│  │  │  - API GW   │  │  - API      │  │  - API      │      │  │
│  │  │  - Load     │  │    Servers  │  │    Servers  │      │  │
│  │  │    Balancer │  │  - Redis    │  │  - Redis    │      │  │
│  │  │             │  │    Cluster  │  │    Cluster  │      │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Data Layer (Private Subnet 3)                     │  │  │
│  │  │  - PostgreSQL (Primary + Read Replicas)            │  │  │
│  │  │  - PostgreSQL (Standby - Multi-AZ)                 │  │  │
│  │  │  - S3 (Encrypted backups)                          │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Compute
- **API Servers:** AWS EC2 (t3.medium) or AWS Fargate (containerized)
- **Auto-Scaling:** 2-10 instances based on CPU utilization (>70% scale up, <30% scale down)
- **Container Orchestration:** AWS ECS with Fargate (serverless containers)

### Database
- **Primary:** AWS RDS PostgreSQL 15 (db.r5.large)
- **Read Replicas:** 2 read replicas for geographic distribution (Mumbai, Hyderabad)
- **Standby:** Multi-AZ deployment for automatic failover
- **PostGIS:** Enabled for geospatial queries

### Caching
- **Redis Cluster:** AWS ElastiCache Redis 7 (cache.r5.large, 3 nodes)
- **Use Cases:** Session storage, Socket.io pub/sub, frequently accessed data

### Storage
- **Static Assets:** AWS S3 with CloudFront CDN
- **Backups:** S3 with versioning and lifecycle policies (90 days hot, 7 years cold)
- **File Uploads:** S3 with pre-signed URLs for secure upload/download

### Networking
- **Load Balancer:** AWS Application Load Balancer (ALB)
- **DNS:** AWS Route 53 with health checks
- **CDN:** Cloudflare for global edge caching

## Deployment Strategy

### CI/CD Pipeline
```
1. Developer pushes code to GitHub
2. GitHub Actions triggers:
   - Run unit tests (Jest)
   - Run integration tests (Supertest)
   - Run E2E tests (Playwright)
   - Run security scans (Snyk, SonarQube)
3. If all tests pass:
   - Build Docker image
   - Push to AWS ECR
   - Deploy to staging environment
4. Manual approval for production
5. Deploy to production (blue-green):
   - Deploy to green environment
   - Run smoke tests
   - Switch ALB to green (5% traffic)
   - Monitor for 24 hours
   - Switch ALB to 100% green
   - Terminate blue environment
```

### Environment Configuration
```
# Development
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/polar_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev_secret_do_not_use_in_production

# Staging
NODE_ENV=staging
DATABASE_URL=postgresql://staging-db:5432/polar_staging
REDIS_URL=redis://staging-redis:6379
JWT_SECRET=<staging_secret_from_secrets_manager>

# Production
NODE_ENV=production
DATABASE_URL=postgresql://prod-db:5432/polar_prod
REDIS_URL=redis://prod-redis:6379
JWT_SECRET=<prod_secret_from_secrets_manager>
```

## Disaster Recovery

### Backup Strategy
- **Database:** Automated daily backups, point-in-time recovery enabled
- **S3:** Versioning enabled, cross-region replication to Hyderabad
- **Configuration:** All infrastructure as code (Terraform) in GitHub

### Recovery Objectives
- **RTO (Recovery Time Objective):** 4 hours
- **RPO (Recovery Point Objective):** 1 hour

### Disaster Recovery Procedure
```
1. Detect disaster (automated monitoring or manual report)
2. Activate DR team (NCPOR Director, Tech Lead, DevOps)
3. Assess damage and determine recovery strategy:
   - Single AZ failure: Automatic failover to standby
   - Region failure: Restore from cross-region backup
4. Restore database from latest backup
5. Deploy infrastructure from Terraform state
6. Restore data from S3 backup
7. Validate data integrity
8. Switch DNS to DR environment
9. Notify stakeholders
10. Post-incident review
```

## Monitoring & Observability

### Metrics (Prometheus + Grafana)
- **API Performance:** Response time, error rate, throughput
- **Database:** Query latency, connection pool usage, replication lag
- **Redis:** Cache hit rate, memory usage, eviction rate
- **Infrastructure:** CPU, memory, disk, network utilization

### Logging (ELK Stack)
- **Centralized Logging:** All logs shipped to Elasticsearch
- **Log Aggregation:** Logstash for parsing and enrichment
- **Visualization:** Kibana dashboards for log analysis

### Alerting (PagerDuty)
- **Critical Alerts:** API downtime, database failover, emergency system failure
- **Warning Alerts:** High error rate, high latency, low disk space
- **Info Alerts:** Deployment completed, backup completed, scaling events

### Distributed Tracing (Jaeger)
- **Trace Propagation:** All API calls include trace ID
- **Service Map:** Visualize dependencies between services
- **Latency Analysis:** Identify bottlenecks in request flow

## Cost Optimization

### Reserved Instances
- **Database:** 1-year reserved instance for RDS (40% cost savings)
- **Cache:** 1-year reserved nodes for ElastiCache (35% cost savings)

### Spot Instances
- **Batch Processing:** Use EC2 Spot instances for data migration and batch jobs (70% cost savings)

### Auto-Scaling
- **Scale Down:** Automatically scale down during non-expedition season (April-October)
- **Scheduled Scaling:** Scale up before expedition season (November-March)

### Storage Lifecycle
- **S3 Lifecycle:** Move logs older than 90 days to S3 Glacier (80% cost savings)
- **Backup Retention:** Delete backups older than 7 years (compliance minimum)

## Compliance & Certifications

### Infrastructure Certifications
- **ISO 27001:** Information Security Management
- **SOC 2 Type II:** Service Organization Control for data security
- **STQC:** Standardization Testing and Quality Certification (Indian government)

### Data Residency
- **Primary Region:** AWS Mumbai (ap-south-1)
- **Backup Region:** AWS Hyderabad (ap-south-2)
- **Compliance:** All data stored within India (data localization requirement)
