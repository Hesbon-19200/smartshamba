# MkulimaAI Database Architecture

## Overview
MkulimaAI is architected for PostgreSQL with Prisma ORM for relational integrity, while providing an embedded persistence layer for zero-friction hackathon demos and deployment portability.

## Entity Relationship Overview
- **User (1) ── (N) Farm**: A farmer or agribusiness can manage multiple plots/shambas across counties.
- **Farm (1) ── (N) FarmAnalysis**: Each shamba has historical seasonal decision analyses tracking suitability, projected costs, and net profit.
- **Farm (1) ── (N) DiseaseAnalysis**: Field crop scans linked to specific farms to track pathology history.
- **FarmAnalysis (1) ── (N) Prediction**: Model tracking layer storing model versions, regression R² scores, and predicted values.
- **User (1) ── (N) ChatConversation ── (N) ChatMessage**: Persistent context with MkulimaAI Agronomist.
- **WeatherSnapshot & MarketSnapshot**: Periodic environmental and commodity price records.

## Migration & Deployment
```bash
# Push schema to PostgreSQL database
npx prisma db push

# Generate Prisma Client
npx prisma generate
```
