# Sadhana Tracker

A private, mobile-first application for tracking daily spiritual practices, maintaining a long-term Sadhana journal, and managing Anushthan commitments.

## Overview

Sadhana Tracker helps maintain a structured and reliable record of mantra japa, stotra recitations, daily observations, and personal Anushthan commitments.

The application provides a unified calendar and practice history, allowing daily activities to be recorded and reviewed without duplicating data.

## Core Features

### 1. Practice Library

Maintain separate libraries for:

- **Mantras:** Create, view, edit, and archive mantras.
- **Stotras:** Create, view, edit, and archive stotras.

Archived practices remain available in historical records.

### 2. Daily Practice Tracking

- Record daily mantra japa in whole malas.
- One mala always equals 108 repetitions.
- Record stotra recitations in complete units.
- Add an optional daily comment or observation.
- Track Regular Upasana and Anushthan practices on the same date.
- View daily records through the main calendar or an Anushthan calendar.
- Maintain a single daily record per user and date.

### 3. Anushthan Management

Create Anushthans with one or more mantras, stotras, or a combination of both.

Each selected practice has an independent target:

- Mantras: Target number of malas.
- Stotras: Target number of complete recitations.

Features include:

- Define a start date and end date.
- Automatically distribute targets across the duration.
- Redistribute remaining targets after daily progress is saved.
- Calculate progress independently for every selected practice.
- Track Anushthan-specific progress without duplicating daily entries.
- Allow only one ongoing Anushthan at a time.

### 4. Anushthan History and Reports

Every Anushthan becomes part of historical records after its end date, whether its target was fulfilled or not.

Historical reports include:

- Original commitment.
- Start and end dates.
- Total committed malas or recitations.
- Actual completed malas or recitations.
- Remaining target.
- Achievement percentage.
- Daily practice history.

Historical records preserve actual progress and are not automatically extended.

### 5. Lifetime Statistics

- Total malas completed for each mantra.
- Total mantra repetitions (malas × 108).
- Total stotra recitations.
- Practice history across Regular Upasana and Anushthans.

### 6. Calendar

- Display daily practice records.
- Navigate from the practice calendar to daily details.
- View the entire duration of an Anushthan.
- Access the same daily record and comments from both calendar views.
- Preserve empty dates without creating artificial zero-count entries.

### 7. Panchang Integration

Planned functionality:

- Display relevant Panchang information.
- Support a configurable Panchang location.
- Keep timezone and Panchang location as separate settings.

Availability and reliability of a suitable provider will be evaluated before implementation.

## Technology Stack

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

## Proposed Database Structure

The application will initially use the following tables:

| Table                   | Responsibility                     |
| ----------------------- | ---------------------------------- |
| `mantras`               | Mantra library                     |
| `strotras`              | Stotra library                     |
| `anushthans`            | Anushthan commitments              |
| `anushthan_mantras`     | Mantra targets within an Anushthan |
| `anushthan_strotras`    | Stotra targets within an Anushthan |
| `daily_records`         | One daily record per user and date |
| `daily_mantra_entries`  | Daily mantra practice entries      |
| `daily_strotra_entries` | Daily stotra practice entries      |
| `user_settings`         | User-specific application settings |

Authentication will use Supabase Auth.

## Important Business Rules

- One mala is always 108 repetitions.
- Mantra daily entries and Anushthan mantra targets use whole malas.
- Stotra entries and targets use complete recitations.
- Every mantra and stotra has an independent Anushthan target.
- Daily recommendations use balanced whole-number distribution.
- Actual daily progress determines remaining recommendations.
- Regular and Anushthan practices can coexist on the same date.
- The same individual practice cannot be recorded under both categories on the same date.
- Historical daily counts become read-only after the practice date; historical comments remain editable.
- Anushthan history retains every ended commitment, regardless of target completion.
- Lifetime totals include both Regular and Anushthan practice entries.

## Project Principles

- Mobile-first and responsive design.
- Reliable, long-term data storage.
- No duplicate daily records or practice counts.
- Database-level data integrity.
- Server-side authorization and validation.
- Maintainable application architecture.
- Automated testing for important workflows.
- Secure deployment and environment configuration.

## Development Roadmap

1. Finalize requirements and database design.
2. Set up the Next.js application and development environment.
3. Configure Supabase and PostgreSQL.
4. Implement authentication and authorization.
5. Implement mantra and stotra libraries.
6. Implement daily practice tracking.
7. Implement the calendar.
8. Implement Anushthan management and dynamic target distribution.
9. Implement Anushthan history and reports.
10. Implement lifetime statistics.
11. Implement testing and security checks.
12. Deploy to Vercel.
13. Evaluate PWA support and Panchang integration.

## Current Status

**Phase:** Requirements finalization and project planning.

Implementation will begin after the remaining business rules and database constraints are reviewed.

---

Built as a personal Sadhana tracking and journaling application.
