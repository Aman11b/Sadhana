# Sadhana Tracker

A personal, mobile-friendly application for tracking daily mantra japa, stotra recitation, and structured spiritual practice.

Sadhana Tracker helps maintain a personal practice library, record daily activity, manage Anushthans, review historical practice, and understand long-term progress.

> **Project status:** Requirements finalized. Database design and feature implementation are in progress.

---

## Features

### Practice Library

- Maintain separate mantra and stotra libraries.
- Create and edit practice details.
- Archive practices without deleting historical records.
- Keep archived practices out of new Anushthan selection.

### Daily Practice Tracking

- Record mantra japa in malas.
- Record stotra recitations as complete counts.
- One mala equals 108 repetitions.
- Add daily comments and reflections.
- Keep dates without practice records empty.
- Lock historical counts at local midnight.

### Anushthan Management

- Create mantra-only, stotra-only, or combined Anushthans.
- Set independent targets for mantra and stotra practices.
- Distribute targets as evenly as possible across inclusive date ranges.
- Track progress against targets.
- Preserve completed and incomplete Anushthan history.
- Generate final target-versus-actual reports.
- Lock targets and dates after an Anushthan starts.

### Calendar and History

- Monthly calendar view.
- Inspect previous practice dates.
- Review daily mantra and stotra activity.
- Access daily comments and historical records.

### Lifetime Statistics

- Total mantra malas.
- Total mantra repetitions.
- Total stotra recitations.
- Individual practice totals.
- Anushthan history and outcomes.

### Privacy and Authentication

- Supabase authentication.
- Persistent Supabase sessions.
- PostgreSQL Row Level Security.
- User-specific private practice records.

---

## Tech Stack

| Category       | Technology         |
| -------------- | ------------------ |
| Framework      | Next.js App Router |
| Language       | TypeScript         |
| UI             | React              |
| Styling        | Tailwind CSS       |
| Backend        | Supabase           |
| Database       | PostgreSQL         |
| Authentication | Supabase Auth      |
| Authorization  | PostgreSQL RLS     |
| Validation     | Zod                |
| Unit Testing   | Jest               |
| E2E Testing    | Playwright         |
| Deployment     | Vercel             |

---

## Core Business Rules

### Daily Practice

- One mantra mala equals 108 repetitions.
- Mantra counts are recorded in whole malas.
- Stotra counts represent complete recitations.
- Zero-count entries are omitted; zero means no practice entry.
- A practice cannot be recorded as both regular Upasana and Anushthan activity for the same date.
- Historical counts become read-only when the device's local date changes at midnight.
- Practice dates use the device timezone at the time of record creation.
- Existing practice dates do not shift when the device timezone changes later.

### Anushthans

- Start and end dates are inclusive.
- Anushthans cannot have future start dates.
- Anushthans may be created even if their targets have already been achieved.
- Mantra and stotra targets are independent.
- Mantra targets use whole malas.
- Stotra targets use complete recitations.
- Targets are distributed as evenly as possible across the date range.
- A new Anushthan cannot start while another is ongoing.
- Targets and dates cannot be edited after an Anushthan starts.
- Archived practices cannot be selected for new Anushthans.
- Archiving a practice linked to an ongoing Anushthan is blocked.
- The user manually marks an ended Anushthan as Completed or Incomplete.
- Anushthan history and final reports are preserved.

### Date and Panchang

- The device's current timezone determines the date of a new practice record.
- The recorded date is frozen at creation.
- Panchang integration is deferred from v1.
- The application uses the regular Gregorian date in v1.

---

## Proposed Database Structure

The logical data model currently includes:

| Entity                  | Purpose                                     |
| ----------------------- | ------------------------------------------- |
| `mantras`               | Personal mantra library                     |
| `strotras`              | Personal stotra library                     |
| `daily_logs`            | Daily records and comments                  |
| `daily_mantra_entries`  | Mantra counts per date                      |
| `daily_strotra_entries` | Stotra counts per date                      |
| `anushthans`            | Anushthan metadata and lifecycle            |
| `anushthan_mantras`     | Mantra targets within Anushthans            |
| `anushthan_strotras`    | Stotra targets within Anushthans            |
| User/settings data      | User-specific configuration, where required |

The final relational schema, constraints, indexes, and migrations are pending database design.

---

## Architecture Principles

- Feature-oriented project structure.
- Separation of UI, business logic, and data access.
- Reusable validation and domain rules.
- PostgreSQL as the source of truth for persisted records.
- Database-level integrity and authorization.
- Supabase Auth and RLS for private user data.
- Version-controlled database migrations.
- Derived statistics rather than duplicate counters.
- Isolated development/test data.

---

## Development Roadmap

| Phase | Work                                   | Status      |
| ----- | -------------------------------------- | ----------- |
| 1     | Project initialization and tooling     | Complete    |
| 2     | Requirements and SRS finalization      | Complete    |
| 3     | Initial dashboard UI and visual assets | In progress |
| 4     | Relational database design             | Next        |
| 5     | Supabase setup and migrations          | Planned     |
| 6     | Practice library                       | Planned     |
| 7     | Daily practice recording               | Planned     |
| 8     | Calendar and history                   | Planned     |
| 9     | Anushthan management                   | Planned     |
| 10    | Reports and lifetime statistics        | Planned     |
| 11    | Authentication and RLS                 | Planned     |
| 12    | Unit and end-to-end testing            | Planned     |
| 13    | Deployment and production readiness    | Planned     |

---

## Development Setup

### Prerequisites

- Node.js
- npm
- Git

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

## Testing Strategy

The project will use:

- **Jest** for unit testing business logic and utility functions.
- **Playwright** for end-to-end testing of user workflows.

Important scenarios include:

- Mantra mala calculations.
- Stotra count validation.
- Daily date boundaries.
- Historical count locking.
- Anushthan target distribution.
- Anushthan lifecycle and immutability.
- Archive restrictions.
- User data isolation.

---

## Development Data and Privacy

Development and test records must remain isolated from genuine personal practice history.

- Use repeatable seed scripts for sample data.
- Keep test data separate from real practice records.
- Clean sample rows without dropping database tables or migrations.
- Never expose Supabase service-role credentials to the browser.
- Enable authentication and RLS before using the application for genuine personal records.

---

## Future Considerations

- Panchang and tithi
