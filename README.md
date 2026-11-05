# Sadhana Tracker

A private, mobile-first spiritual practice journal for tracking daily mantra japa, stotra recitations, personal observations, and Anushthan commitments.

**Project Status:** Requirements & Planning  
**Version:** 0.2.0  
**Target:** Personal use  
**Architecture:** Next.js + TypeScript + Supabase

---

## Overview

Sadhana Tracker is designed to maintain a structured, long-term record of personal spiritual practices.

The application allows users to:

- Record daily mantra japa in malas.
- Record daily stotra recitations.
- Track lifetime totals for individual mantras and stotras.
- Maintain comments and personal observations for each day.
- Create and monitor time-bound Anushthan commitments.
- View historical practice records through a calendar.
- Track Anushthan progress independently from regular daily practice.

The application prioritizes accurate record-keeping, privacy, simplicity, and long-term data integrity.

## Core Features

### 1. Mantra Management

Maintain a personal library of mantras.

- Create, view, edit, and archive mantras.
- Record daily japa in malas.
- One mala is always 108 repetitions.
- Automatically calculate total repetitions.
- View lifetime malas and repetitions for each mantra.

Example:

| Metric               |  Value |
| -------------------- | -----: |
| Daily malas          |      5 |
| Repetitions per mala |    108 |
| Daily repetitions    |    540 |
| Lifetime malas       |    500 |
| Lifetime repetitions | 54,000 |

### 2. Stotra Management

Maintain a separate library of stotras.

- Create, view, edit, and archive stotras.
- Record daily complete recitations.
- Calculate lifetime recitation totals.
- View historical practice records.

### 3. Daily Practice Tracking

Each calendar date has one common daily record.

A daily record contains:

- Practice date.
- Personal comment or observation.
- Multiple mantra entries.
- Multiple stotra entries.

Regular Upasana and Anushthan practice can coexist on the same date.

Each individual mantra or stotra entry belongs to either Regular Upasana or one Anushthan.

The same mantra or stotra cannot be recorded under both categories on the same date.

### 4. Anushthan Management

An Anushthan represents a commitment to perform a specified amount of one or more practices within a defined period.

Supported combinations:

- One or more mantras.
- One or more stotras.
- A combination of mantras and stotras.

Each selected practice has its own independent target.

Example:

| Practice |           Commitment | Duration |
| -------- | -------------------: | -------: |
| Mantra A | 1,25,000 repetitions |  40 days |
| Stotra A |       40 recitations |  40 days |

Features:

- Create Anushthans with selected practices.
- Select existing mantras and stotras.
- Register new practices directly during Anushthan creation.
- Track progress separately for every selected practice.
- View the complete Anushthan duration in a dedicated calendar.
- Calculate daily recommended targets dynamically.
- Allow only one ongoing Anushthan at a time.

### 5. Dynamic Daily Targets

The application distributes each Anushthan commitment as evenly as possible across its duration.

After recording daily practice:

- Completed amounts are deducted from the remaining commitment.
- The recommended daily target is recalculated.
- Remaining targets are redistributed across the remaining days.
- The original commitment and duration remain unchanged.

Daily recommendations do not restrict actual practice counts.

### 6. Calendar and History

The main calendar provides:

- Monthly navigation.
- Historical daily records.
- Distinct indicators for Regular Upasana and Anushthan activity.
- Access to comments and practice counts.
- An earliest-date boundary based on the first genuine practice entry.

Anushthan calendars display the entire commitment period.

Both calendars open the same underlying daily record.

### 7. Panchang and Tithi

The dashboard is intended to display:

- Civil date.
- Hindu Tithi.
- Relevant Panchang information.

Panchang integration is conditional on selecting a reliable provider and verifying its calculation convention and location requirements.

If no suitable provider is selected, the application will display the normal civil date without inventing Tithi information.

### 8. Settings

A dedicated user settings table will support:

- Practice start date.
- Timezone.
- Panchang location.
- Additional preferences introduced in future versions.

Sensitive credentials and environment configuration will remain outside the database.

---

## Technology Stack

## 🛠️ Technology Stack

| Category                   | Technology                          |
| -------------------------- | ----------------------------------- |
| Frontend                   | React                               |
| Framework                  | Next.js                             |
| Language                   | TypeScript                          |
| Backend Runtime            | Node.js (Next.js server-side)       |
| Database                   | PostgreSQL                          |
| Backend Services           | Supabase                            |
| Authentication             | Supabase Auth                       |
| Authorization              | PostgreSQL Row Level Security (RLS) |
| Styling                    | Tailwind CSS                        |
| Validation                 | Zod                                 |
| Forms                      | React Hook Form (if needed)         |
| Unit & Integration Testing | Jest                                |
| End-to-End Testing         | Playwright                          |
| Deployment & Hosting       | Vercel                              |

A separate Express backend is not currently required.

## Proposed Database Tables

| Table                   | Responsibility                                      |
| ----------------------- | --------------------------------------------------- |
| `mantras`               | Registered mantras                                  |
| `strotras`              | Registered stotras                                  |
| `anushthans`            | Anushthan details and duration                      |
| `anushthan_mantras`     | Mantra associations and individual targets          |
| `anushthan_strotras`    | Stotra associations and individual targets          |
| `daily_records`         | Common daily record and comment                     |
| `daily_mantra_entries`  | Daily mantra counts and Anushthan attribution       |
| `daily_strotra_entries` | Daily stotra counts and Anushthan attribution       |
| `user_settings`         | User preferences and application lifecycle settings |

Supabase Auth will manage authentication identities.

See [`docs/SRS.md`](./docs/SRS.md) for detailed requirements, relationships, constraints, and unresolved decisions.

## Important Design Principles

1. **Single source of truth:** One daily record per user and date.
2. **No duplicate counts:** An entry contributes to lifetime totals and, when applicable, Anushthan progress.
3. **Independent attribution:** Regular Upasana and Anushthan can coexist on a date.
4. **Historical integrity:** Past practice counts cannot be edited; comments can remain editable.
5. **No automatic zero records:** Missing days remain empty.
6. **Database-level security:** User data must be protected through RLS and server-side authorization.
7. **Derived totals:** Lifetime totals are calculated from daily entries rather than maintained as manually updated counters.

## Development Philosophy

This project is being developed incrementally with an emphasis on understanding production-level engineering practices.

Development will follow these stages:

1. Requirements gathering and validation.
2. Architecture and database design.
3. Environment and project setup.
4. Authentication and security.
5. Core functionality.
6. UI and responsive design.
7. Automated testing.
8. Deployment.
9. Maintenance, backups, and future improvements.

Each feature will be implemented in small, reviewable steps with meaningful Git commits and documentation.

## Current Status

**Phase 1 — Requirements Discovery**

The core product behavior and major database relationships have been discussed.

The following still require final decisions:

- Mala input and repetition-target rounding.
- Anushthan date boundaries.
- Anushthan creation/start-date rules.
- Panchang provider and calculation convention.
- Authentication session policy.
- Exact database constraints and RLS policies.

Implementation will begin after requirements and architecture are finalized.

---

## Future Possibilities

Potential improvements after the initial release:

- Installable Progressive Web App.
- Offline-first practice recording.
- Advanced practice statistics.
- Historical export and backup tools.
- More detailed Panchang information.
- Notifications and reminders.
- Anushthan completion and missed-day management.

These are not commitments for the initial release.
