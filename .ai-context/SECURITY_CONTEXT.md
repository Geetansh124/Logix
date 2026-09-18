# Security Context: Protocols & Compliance

## Authentication & Authorization

### JWT Token Structure
```json
{
  "sub": "user-id-uuid",
  "name": "User Name",
  "email": "user@ncpor.gov.in",
  "role": "expedition_planner",
  "permissions": ["cargo:read", "cargo:write", "inventory:read", ...],
  "iat": 1631234567,
  "exp": 1631235467,
  "iss": "polar-expedition-api",
  "aud": "polar-expedition-client"
}
```

### RBAC Permission Matrix

| Role | Expedition | Cargo | Inventory | Personnel | Emergency | Asset |
|------|------------|-------|-----------|-----------|-----------|-------|
| **NCPOR Director** | CRUD | Read | Read | Read | Read | Read |
| **Expedition Planner** | CRUD | CRUD | CRUD | CRUD | Read | CRUD |
| **Station Manager** | Read | Read (station) | CRUD (station) | CRUD (station) | CRUD (station) | CRUD (station) |
| **Cargo Handler** | Read | CRUD (assigned) | Read | Read | Read | Read |
| **Emergency Responder** | Read | Read | Read (critical) | Read (roll call) | CRUD | Read |
| **Researcher** | Read | Read | Read (own requests) | Read (own) | Read (trigger) | Read |

### Token Refresh Flow
```
1. Access token expires after 15 minutes
2. Client uses refresh token (7-day expiry) to request new access token
3. Server validates refresh token and issues new access token
4. Refresh token rotation: old refresh token invalidated, new one issued
```

## Data Encryption

### In Transit
- **Protocol:** TLS 1.3 (mandatory, TLS 1.2 fallback disabled)
- **Cipher Suites:** TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256
- **Certificate:** SHA-256 with RSA, 2048-bit minimum
- **HSTS:** Enabled with max-age=31536000 (1 year)

### At Rest
- **Database:** AES-256 encryption for sensitive columns (personnel data, emergency details)
- **File Storage:** Server-side encryption with AWS KMS or equivalent
- **Backup:** Encrypted backups with separate key management
- **Client-Side:** IndexedDB encryption using Web Crypto API for offline storage

### Key Management
- **Key Rotation:** Every 90 days for encryption keys
- **Key Storage:** Hardware Security Module (HSM) or cloud KMS
- **Access Control:** Separate roles for key management vs. data access

## Network Security

### API Gateway
- **DDoS Protection:** Rate limiting, IP-based throttling, CAPTCHA for suspicious traffic
- **WAF:** Web Application Firewall with OWASP Top 10 rules
- **API Gateway:** AWS API Gateway or Kong with authentication middleware

### Internal Network
- **VPC:** Isolated virtual private cloud for all services
- **Security Groups:** Restrictive inbound/outbound rules
- **Private Subnets:** Database and cache layers in private subnets (no public access)

## Audit Logging

### Log Events
- All authentication attempts (success/failure)
- All cargo receipt/damage/transfer events
- All emergency alert activations
- All inventory stock changes >10% of current stock
- All personnel status changes
- All RBAC permission changes

### Log Format
```json
{
  "timestamp": "2026-09-17T14:30:00Z",
  "userId": "user-uuid",
  "action": "cargo.receipt.confirm",
  "resource": "cargo-uuid",
  "details": { "hub": "CGI-Cape Town", "condition": "INTACT" },
  "ipAddress": "203.0.113.42",
  "userAgent": "PolarExpeditionClient/1.0.0",
  "correlationId": "req-uuid"
}
```

### Log Retention
- **Active Logs:** 90 days in hot storage (fast query)
- **Archived Logs:** 7 years in cold storage (compliance requirement)
- **Access:** Audit log access requires Director-level approval

## Compliance Requirements

### Indian Data Protection
- **Data Localization:** All citizen data stored within India
- **Consent:** Explicit consent for personnel data processing
- **Right to Erasure:** Personnel can request data deletion post-deployment (5-year retention override)

### Antarctic Treaty Compliance
- **Environmental Data:** All waste disposal and environmental impact data retained indefinitely
- **Audit Trail:** Immutable audit trail for all cargo handovers across international borders

### Government Security Standards
- **STQC Compliance:** Standardization Testing and Quality Certification for government software
- **CERT-In Guidelines:** Compliance with Indian Computer Emergency Response Team guidelines
- **Data Classification:** Personnel and emergency data classified as "Sensitive Government Information"

## Incident Response

### Security Incident Levels
- **Level 1 (Critical):** Data breach, unauthorized access to emergency systems
- **Level 2 (Serious):** DDoS attack, service disruption >1 hour
- **Level 3 (Advisory):** Failed login attempts, suspicious activity

### Incident Response Procedure
```
1. Detection: Automated monitoring alerts security team
2. Containment: Isolate affected systems, revoke compromised credentials
3. Eradication: Remove threat, patch vulnerabilities
4. Recovery: Restore systems from clean backups
5. Lessons Learned: Post-incident review, update security policies
```

### Notification Requirements
- **Level 1 Incidents:** Notify NCPOR Director, MoES, CERT-In within 6 hours
- **Level 2 Incidents:** Notify NCPOR Director within 24 hours
- **Level 3 Incidents:** Log incident, weekly security report

## Penetration Testing & Vulnerability Management

### Regular Testing
- **Quarterly:** External penetration testing by certified third party
- **Monthly:** Internal vulnerability scans
- **Pre-Deployment:** Full security audit before each expedition season

### Vulnerability Remediation SLAs
- **Critical (CVSS 9.0-10.0):** 24 hours
- **High (CVSS 7.0-8.9):** 7 days
- **Medium (CVSS 4.0-6.9):** 30 days
- **Low (CVSS 0.1-3.9):** 90 days

## Secure Development Lifecycle

### Code Security
- **Static Analysis:** SAST tools in CI/CD pipeline (SonarQube, Snyk)
- **Dependency Scanning:** Automated vulnerability scanning for npm packages
- **Secrets Management:** No hardcoded secrets; use environment variables or secrets manager

### Deployment Security
- **Immutable Infrastructure:** No SSH to production servers; all changes via CI/CD
- **Blue-Green Deployment:** Zero-downtime deployments with instant rollback
- **Canary Releases:** 5% traffic to new version, monitor for 24 hours before full rollout
