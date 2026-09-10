# SAMADHAAN Database & PostGIS Architecture

## Overview
SAMADHAAN uses **PostgreSQL 16** with the **PostGIS** spatial extension and **Prisma ORM**.

---

## 🏛️ Core Relational Entities

```mermaid
erDiagram
    User ||--o| CitizenProfile : has
    User ||--o| Expert : has
    User ||--o| StudentProfile : has
    User ||--o| IndustryPartner : has
    User ||--o{ Challenge : creates
    
    University ||--o{ UniversityDepartment : has
    UniversityDepartment ||--o{ Expert : employs
    UniversityDepartment ||--o{ StudentProfile : enrolls
    University ||--o{ Project : leads
    
    Challenge ||--o{ ChallengeEvidence : contains
    Challenge ||--o{ ChallengeStatusHistory : tracks
    Challenge ||--o| AIAnalysis : triaged_by
    Challenge ||--o{ Project : resolved_by
    
    Project ||--o{ ResearchTeam : formed_by
    Project ||--o{ Solution : produces
    Project ||--o{ Partnership : funded_by
    Project ||--o{ ImpactMetric : achieves
    
    Solution ||--o{ Deployment : deploys_to
```

---

## 🗺️ Geospatial Indexing & Queries

1. **Composite Coordinates Index:** `@@index([latitude, longitude])`
2. **Radius Search:** Utilizes bounding-box pre-filtering followed by exact Haversine / ST_DWithin distance computation in kilometers.
3. **Hotspot Aggregation:** City and district level spatial clustering computed dynamically for heatmap visualization.
