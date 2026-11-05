# Software Requirements Specification (SRS)

## Sadhana Tracker

| Document Property | Value                          |
| ----------------- | ------------------------------ |
| Document Version  | 0.2.0                          |
| Last Updated      | 2026-11-05                     |
| Status            | Requirements Draft             |
| Product           | Sadhana Tracker                |
| Initial Users     | One explicitly authorized user |

---

# 1. Introduction

## 1.1 Purpose

This document defines the functional and non-functional requirements of Sadhana Tracker.

It serves as the primary requirements reference for architecture, database design, implementation, and testing.

The application is a private spiritual-practice journal designed to record daily mantra japa, stotra recitations, personal comments, and Anushthan commitments.

## 1.2 Product Objectives

The application should:

- Maintain an accurate historical record of spiritual practices.
- Track daily counts for multiple mantras and stotras.
- Calculate lifetime totals automatically.
- Support time-bound Anushthan commitments.
- Track Anushthan progress independently for each selected practice.
- Allow regular and Anushthan practice on the same date.
- Provide a calendar-based historical view.
- Protect personal data through authentication and database-level authorization.
- Remain maintainable and reliable over many years.

## 1.3 Intended User

The initial version is intended for one explicitly authorized user.

However, the database will include ownership fields to maintain proper data isolation and support possible future expansion.

---

# 2. Scope

## 2.1 Included in Version 1

- User authentication.
- Mantra library management.
- Stotra library management.
- Daily practice recording.
- Daily comments.
- Lifetime mantra and stotra totals.
- Regular Upasana tracking.
- Anushthan creation and tracking.
- Dynamic Anushthan target recommendations.
- Calendar and historical records.
- User settings.
- Panchang/Tithi display, provided a suitable provider is verified.
- Historical count protection.
- Database-level access control.

## 2.2 Excluded from Version 1

- Multiple simultaneously ongoing Anushthans.
- Anushthan extensions.
- Missed-day recovery workflows.
- Incomplete Anushthan management.
- Historical practice-count editing.
- Offline-first synchronization.
- Multi-user collaboration.
- Public profiles or social features.
- Advanced reminder and notification systems.

---

# 3. Domain Terminology

| Term            | Meaning                                                                        |
| --------------- | ------------------------------------------------------------------------------ |
| Mantra          | A registered mantra tracked through japa                                       |
| Mala            | One complete round of 108 mantra repetitions                                   |
| Japa            | Repetition of a mantra                                                         |
| Stotra          | A registered devotional hymn tracked through complete recitations              |
| Regular Upasana | Normal daily spiritual practice                                                |
| Anushthan       | A commitment to perform a specified amount of practice within a defined period |
| Daily Record    | The shared record associated with one calendar date                            |
| Daily Entry     | A specific mantra or stotra count recorded within a daily record               |
| Tithi           | A lunar day in the Hindu Panchang system                                       |

---

# 4. Functional Requirements

## 4.1 Mantra Management

The application shall provide a separate mantra library.

### Requirements

- The user can create a mantra.
- The user can view registered mantras.
- The user can edit mantra details.
- The user can archive/deactivate a mantra.
- Each mantra has a unique identifier.
- Each mantra belongs to the authenticated user.
- Historical entries must remain available when a mantra is archived.

### Mala Rules

One mala always contains 108 repetitions.

This is a fixed domain rule in v1.

The user enters daily practice in whole malas.

The application calculates:

`total_repetitions = total_malas × 108`

Mala size is not configurable and does not need to be stored in the mantra table.

### Lifetime Totals

For every mantra, the application shall calculate:

- Total malas completed.
- Total repetitions completed.

These totals include both Regular Upasana and Anushthan entries.

The totals must be derived from daily entries rather than manually incremented counters.

---

## 4.2 Stotra Management

The application shall provide a separate stotra library.

### Requirements

- The user can create a stotra.
- The user can view registered stotras.
- The user can edit stotra details.
- The user can archive/deactivate a stotra.
- Each stotra has a unique identifier.
- Each stotra belongs to the authenticated user.
- Historical entries remain available when a stotra is archived.

### Daily Input

The user records the number of complete stotra recitations.

### Lifetime Totals

The application calculates the total recitations from all daily stotra entries.

Both Regular Upasana and Anushthan recitations contribute to this total.

---

## 4.3 Daily Record Management

A single common daily record shall exist for each user and civil date.

### Daily Record Fields

- Record ID.
- User ID.
- Record date.
- Comment.
- Created timestamp.
- Updated timestamp.

### Daily Entry Details

Mantra and stotra entries shall be stored in separate tables.

A daily record may contain:

- Multiple mantra entries.
- Multiple stotra entries.
- Regular Upasana entries.
- Anushthan entries.
- A mixture of Regular Upasana and Anushthan entries.

### Example

November 5:

| Practice | Category    |   Daily Count |
| -------- | ----------- | ------------: |
| Mantra A | Regular     |       2 malas |
| Mantra B | Anushthan A |       5 malas |
| Stotra A | Regular     |  1 recitation |
| Stotra B | Anushthan A | 3 recitations |

All entries belong to the same daily record.

The date has one shared comment.

### Entry Attribution Rules

Every individual mantra or stotra entry must belong to exactly one category:

1. Regular Upasana.
2. Anushthan.

The database representation shall be:

- `anushthan_id = NULL`: Regular Upasana.
- `anushthan_id = Anushthan ID`: Anushthan practice.

The same mantra or stotra cannot be entered twice on the same date.

For example, Mantra A cannot have one Regular entry and another Anushthan entry on November 5.

However, Mantra A can be Regular while Stotra A belongs to an Anushthan on the same date.

### Empty Dates

- Dates without practice entries remain empty.
- The application must not create automatic zero-count entries.
- Opening a date must not automatically save a daily record.
- A daily record should be created when the user actually saves practice data or a comment.

---

## 4.4 Daily Comments

Each daily record contains one optional comment.

Comments may contain:

- Personal observations.
- Practice experiences.
- Reflections.
- Other notes related to that date.

### Rules

- One comment per daily record.
- The comment is shared across all practices recorded on that date.
- The same comment appears when opening the date through the main calendar or an Anushthan calendar.
- Historical comments may be edited.
- Comments must not be duplicated in Anushthan tables.

---

## 4.5 Historical Record Integrity

Practice counts are intended to be permanent historical records.

### Rules

- Counts can be entered or corrected on the current date.
- Once the date has passed, mantra and stotra counts become read-only.
- Historical comments may still be edited.
- The restriction must be enforced on the server/database side, not only through frontend controls.
- The configured user timezone determines the current-date boundary.

The application must not allow ordinary users to bypass historical count protection through direct API requests.

---

# 5. Anushthan Management

## 5.1 Definition

An Anushthan represents a commitment to perform a specified amount of one or more spiritual practices within a defined period.

Example:

A user commits to completing 1,25,000 repetitions of a mantra within 40 days.

The application tracks the commitment and its daily progress.

## 5.2 Supported Combinations

An Anushthan may contain:

- One mantra only.
- Multiple mantras only.
- One stotra only.
- Multiple stotras only.
- One or more mantras and one or more stotras.

At least one practice must be selected.

There is no requirement to select both a mantra and a stotra.

## 5.3 Practice Selection

During Anushthan creation, the user can:

1. Select an existing mantra from the mantra library.
2. Register a new mantra without leaving the creation flow.
3. Select an existing stotra from the stotra library.
4. Register a new stotra without leaving the creation flow.

Newly registered practices must be saved as normal records in their respective master tables.

They must then be associated with the Anushthan through the relevant mapping table.

## 5.4 Individual Targets

Each selected practice has its own target.

Targets are independent and are not combined across different practices.

Example:

| Practice |               Target | Duration |
| -------- | -------------------: | -------: |
| Mantra A | 1,25,000 repetitions |  40 days |
| Mantra B |   50,000 repetitions |  40 days |
| Stotra A |       40 recitations |  40 days |

The application tracks progress separately for each commitment.

### Mantra Targets

Mantra targets are expressed in total repetitions.

Daily input remains in malas.

The application converts daily malas into repetitions using the fixed value of 108.

### Stotra Targets

Stotra targets are expressed in complete recitations.

Daily input remains in complete recitations.

---

## 5.5 Anushthan Lifecycle

An Anushthan contains:

- Anushthan ID.
- User ID.
- Name.
- Start date.
- Duration.
- End date.
- Status.
- Creation timestamp.
- Updated timestamp.

### Single Ongoing Anushthan Rule

Only one Anushthan may be ongoing at a time.

If an Anushthan is already ongoing:

- The user cannot create another Anushthan.
- The application must prevent overlapping commitments.
- The restriction must be enforced beyond the frontend.

The database/server must protect against concurrent creation requests.

### V1 Assumption

For the initial version, the application assumes that the user will complete the Anushthan within the committed duration.

The following are deferred:

- Extending the duration.
- Continuing an incomplete Anushthan beyond its end date.
- Missed-day recovery workflows.
- Detailed incomplete-vow management.

---

## 5.6 Anushthan Daily Tracking

Anushthan practice is recorded through the same common daily record used by Regular Upasana.

An Anushthan does not maintain a duplicate daily count table.

Each daily practice entry contains an optional `anushthan_id`.

When populated, this associates that particular entry with the corresponding Anushthan.

### Example

On November 5:

- Mantra A: 2 malas under Regular Upasana.
- Mantra B: 5 malas under Anushthan A.
- Stotra A: 3 recitations under Anushthan A.

All entries belong to the same daily record.

The Anushthan tracker retrieves only entries associated with its own Anushthan ID.

The main calendar displays all entries for the date.

---

## 5.7 Anushthan Progress

Progress is calculated from daily entries.

For each mantra:

`completed_repetitions = sum(malas_completed × 108)`

For each stotra:

`completed_recitations = sum(recitations_completed)`

Only entries associated with the relevant Anushthan are included in its progress.

Lifetime practice totals include both Regular and Anushthan entries.

No count is copied into the Anushthan master or mapping tables.

---

## 5.8 Dynamic Daily Target Distribution

The application shall distribute each commitment as evenly as possible across the Anushthan duration.

### Initial Calculation

The initial daily recommendation is calculated using:

`remaining_target / total_duration_days`

### Dynamic Recalculation

After the user saves a daily entry:

1. Calculate the completed amount.
2. Subtract it from the original commitment.
3. Calculate the remaining number of days.
4. Redistribute the remaining target across those days.
5. Display the updated daily recommendation.

### Rules

- The original target cannot change through daily progress.
- The original duration remains fixed.
- Daily recommendations are not restrictions.
- Completing more than the suggested amount reduces the remaining recommendation.
- Completing less increases the remaining recommendation.
- The system must not silently modify the original commitment.

### Mathematical Constraint

Mantra input is measured in whole malas, while targets are expressed in repetitions.

Because one mala equals 108 repetitions, some targets cannot be represented exactly using whole malas.

For example, 1,25,000 repetitions are not divisible by 108.

The exact handling of residual repetitions and completion semantics must be finalized before implementation.

---

# 6. Calendar and Dashboard

## 6.1 Dashboard

The main dashboard should display:

- Today's civil date.
- Tithi/Panchang information when available.
- Today's recorded practices.
- An empty state when no practice has been recorded.
- Ongoing Anushthan information.
- Monthly calendar.

## 6.2 Main Calendar

The calendar shall support:

- Month navigation.
- Year navigation.
- Historical daily record access.
- Distinct visual markers for Regular Upasana and Anushthan activity.
- Empty dates.
- Opening a daily record by selecting a date.

The calendar cannot navigate earlier than `practice_start_date`.

## 6.3 Anushthan Calendar

The Anushthan detail page shall display:

- Start date.
- End date.
- Duration.
- Individual practice targets.
- Completed amounts.
- Remaining amounts.
- Daily recommended targets.
- A calendar/tracker covering the entire Anushthan duration.

Selecting a date opens the same shared daily record used by the main calendar.

The Anushthan calendar must not create duplicate daily records or comments.

---

# 7. First-Use Application Lifecycle

The application's real practice history begins when the user saves their first genuine practice record.

### Rules

1. The first genuine record must use the current date.
2. The first record must be saved successfully.
3. Its date initializes `user_settings.practice_start_date`.
4. The start date is initialized only once.
5. Calendar navigation cannot go earlier than this date.
6. Test data must not initialize the production start date.
7. Development and production must use separate environments/databases.

The initialization should be atomic with the first successful daily record save.

If the record save fails, the application must not initialize the start date.

---

# 8. Panchang and Tithi

The application is intended to display Hindu Tithi information.

However, Tithi calculations depend on:

- Geographic location.
- Timezone.
- Astronomical calculation.
- Panchang convention.

The application must not assume a location or convention without confirmation.

Before implementation, a suitable provider must be evaluated for:

- Data accuracy.
- API availability.
- Location support.
- Calculation convention.
- API limits.
- Cost.
- Long-term reliability.

If a verified source is unavailable, the application displays only the civil date.

---

# 9. User Settings

A dedicated `user_settings` table stores user-level preferences.

Candidate fields:

| Field                 | Description                               |
| --------------------- | ----------------------------------------- |
| `user_id`             | Associated authenticated user             |
| `practice_start_date` | Initialized from the first genuine record |
| `timezone`            | User's timezone                           |
| `panchang_location`   | Selected Panchang location                |
| `created_at`          | Creation timestamp                        |
| `updated_at`          | Last modification timestamp               |

Additional preferences may be introduced later.

### Environment Configuration

Environment-specific configuration must not be stored in the user settings table.

Examples:

- Supabase URL.
- API keys.
- Authentication secrets.
- External provider credentials.

These belong in environment variables and deployment secrets.

---

# 10. Proposed Database Schema

The following is a conceptual relational model. Exact SQL types, foreign keys, indexes, triggers, and security policies will be finalized during database design.

## 10.1 `mantras`

Stores registered mantras.

Candidate fields:

- `id`
- `user_id`
- `name`
- `is_active`
- `created_at`
- `updated_at`

Mala size is not stored because it is permanently fixed at 108 in v1.

## 10.2 `strotras`

Stores registered stotras.

Candidate fields:

- `id`
- `user_id`
- `name`
- `is_active`
- `created_at`
- `updated_at`

## 10.3 `anushthans`

Stores Anushthan metadata.

Candidate fields:

- `id`
- `user_id`
- `name`
- `start_date`
- `duration_days`
- `end_date`
- `status`
- `created_at`
- `updated_at`

## 10.4 `anushthan_mantras`

Maps mantras to Anushthans.

Candidate fields:

- `id`
- `anushthan_id`
- `mantra_id`
- `target_repetitions`

Unique constraint:

`(anushthan_id, mantra_id)`

## 10.5 `anushthan_strotras`

Maps stotras to Anushthans.

Candidate fields:

- `id`
- `anushthan_id`
- `strotra_id`
- `target_recitations`

Unique constraint:

`(anushthan_id, strotra_id)`

## 10.6 `daily_records`

Stores one common daily record per user and date.

Candidate fields:

- `id`
- `user_id`
- `record_date`
- `comment`
- `created_at`
- `updated_at`

Unique constraint:

`(user_id, record_date)`

## 10.7 `daily_mantra_entries`

Stores daily mantra counts.

Candidate fields:

- `id`
- `daily_record_id`
- `mantra_id`
- `anushthan_id` (nullable)
- `malas_completed`
- `created_at`

Unique constraint:

`(daily_record_id, mantra_id)`

A null `anushthan_id` means Regular Upasana.

A populated `anushthan_id` associates the entry with an Anushthan.

## 10.8 `daily_strotra_entries`

Stores daily stotra counts.

Candidate fields:

- `id`
- `daily_record_id`
- `strotra_id`
- `anushthan_id` (nullable)
- `recitations_completed`
- `created_at`

Unique constraint:

`(daily_record_id, strotra_id)`

A null `anushthan_id` means Regular Upasana.

A populated `anushthan_id` associates the entry with an Anushthan.

## 10.9 `user_settings`

Stores user-level configuration.

Candidate fields:

- `user_id`
- `practice_start_date`
- `timezone`
- `panchang_location`
- `created_at`
- `updated_at`

Enforce one settings row per user.

## 10.10 Authentication

Supabase Auth manages authentication identities through `auth.users`.

The application must not create a separate password table.

---

# 11. Database Integrity Rules

The database and server-side application logic must enforce the following rules.

1. Each user can access only their own data.
2. A user can have only one daily record per date.
3. A daily record can contain multiple mantra entries.
4. A daily record can contain multiple stotra entries.
5. A specific mantra can appear only once per daily record.
6. A specific stotra can appear only once per daily record.
7. Daily counts must be non-negative whole numbers.
8. Every Anushthan must contain at least one practice.
9. An Anushthan/practice association must be unique.
10. Only one Anushthan can be ongoing per user.
11. A daily entry associated with an Anushthan must reference a practice included in that Anushthan.
12. The Anushthan and daily record must belong to the same user.
13. The daily entry date must fall within the Anushthan's valid date range.
14. Historical counts must not be modified after the date has passed.
15. The first genuine daily record initializes the practice start date atomically.
16. Archiving a mantra or stotra must not delete historical entries.

Some cross-table rules require transactional server-side validation or PostgreSQL triggers. Simple CHECK constraints alone cannot enforce every rule.

---

# 12. Derived Calculations

Lifetime totals should not be manually maintained in the master tables.

They should be derived from daily entries.

### Mantra Lifetime Total

`total_malas = SUM(malas_completed)`

`total_repetitions = total_malas × 108`

### Stotra Lifetime Total

`total_recitations = SUM(recitations_completed)`

### Anushthan Mantra Progress

Sum the daily mantra repetitions associated with the relevant Anushthan and mantra.

### Anushthan Stotra Progress

Sum the daily stotra recitations associated with the relevant Anushthan and stotra.

### Remaining Target

`remaining_target = original_target - completed_amount`

The same daily entry contributes to the practice lifetime total and its associated Anushthan progress.

---

# 13. Security Requirements

- Authentication is mandatory.
- Only an explicitly authorized account can access the application.
- PostgreSQL Row Level Security (RLS) must protect every user-owned table.
- Server-side authorization must be implemented for mutations.
- Supabase service-role credentials must never be exposed in browser code.
- Passwords must not be stored in application tables.
- Direct API requests must not bypass ownership checks or historical count restrictions.
- Secrets must be managed through environment variables or deployment secrets.

Closing a browser tab is not a reliable logout event. A supported session expiration and inactivity policy must be selected.

---

# 14. Non-Functional Requirements

## 14.1 Reliability

The application should preserve accurate historical data over many years.

- Use database transactions for multi-table operations.
- Maintain schema migrations in version control.
- Provide portable data exports.
- Establish backup and restore procedures.
- Test restoration periodically.

## 14.2 Performance

The initial workload is expected to be small and primarily single-user.

PostgreSQL is suitable for the expected volume.

Indexes should be based on actual query patterns, particularly:

- User and record date.
- Daily record ID.
- Mantra ID.
- Stotra ID.
- Anushthan ID.

## 14.3 Usability

- Mobile-first responsive interface.
- Minimal steps for daily entry.
- Clear differentiation between malas, repetitions, and recitations.
- Clear indication of Regular versus Anushthan attribution.
- Accessible controls and readable text.
- Clear empty, loading, success, and error states.

## 14.4 Maintainability

- TypeScript throughout the application.
- Separation of UI, business logic, validation, and data access.
- Documented architecture decisions.
- Database migrations in Git.
- Automated tests for important domain rules.

---

# 15. Testing Requirements

The application should include tests for the following areas.

### Unit Tests

- Mala-to-repetition conversion.
- Lifetime total calculations.
- Anushthan progress calculations.
- Remaining target calculations.
- Dynamic daily target redistribution.
- Date and duration calculations.

### Integration Tests

- Daily record creation.
- Mantra entry creation.
- Stotra entry creation.
- Regular and Anushthan attribution.
- First-use lifecycle initialization.
- Historical count restrictions.
- Anushthan membership validation.
- One ongoing Anushthan rule.

### End-to-End Tests

- User authentication.
- Mantra registration.
- Stotra registration.
- Daily practice recording.
- Calendar navigation.
- Historical record viewing.
- Comment editing.
- Anushthan creation.
- Registering a new practice during Anushthan creation.
- Anushthan progress updates.
- Unauthorized access prevention.

---

# 16. Acceptance Criteria

Version 1 will be considered functionally complete when:

1. Multiple mantras can be registered.
2. Multiple stotras can be registered.
3. Daily mantra counts can be entered in malas.
4. Five malas correctly calculate to 540 repetitions.
5. Daily stotra recitations can be recorded.
6. Lifetime totals are accurate.
7. One common daily record exists per user/date.
8. Regular Upasana and Anushthan entries can coexist on the same date.
9. The same mantra or stotra cannot be recorded under both categories on the same date.
10. One shared comment is displayed from both calendar views.
11. Missing days remain empty.
12. Historical counts are read-only.
13. Historical comments remain editable.
14. Anushthan supports mantra-only, stotra-only, and mixed commitments.
15. New practices can be registered during Anushthan creation.
16. Each selected practice has its own target and progress.
17. Only one Anushthan can be ongoing at a time.
18. Daily Anushthan entries contribute to lifetime totals and Anushthan progress without duplication.
19. Daily recommendations redistribute after each saved entry.
20. The first genuine production record initializes the practice start date.
21. Calendar navigation cannot precede the practice start date.
22. Unauthorized users cannot access journal data.

---

# 17. Open Questions and Decisions Pending

These items are intentionally unresolved and must be finalized before implementation of the affected functionality.

| No. | Question                                                                | Area                   |
| --- | ----------------------------------------------------------------------- | ---------------------- |
| 1   | Are partial malas allowed, or only whole malas?                         | Mantra input           |
| 2   | How should targets not divisible by 108 be handled?                     | Anushthan calculations |
| 3   | How should daily mala recommendations be rounded?                       | Target distribution    |
| 4   | Is the start date counted as Day 1 and the end date included?           | Anushthan duration     |
| 5   | Can an Anushthan be scheduled for a future date?                        | Anushthan creation     |
| 6   | Are zero-count entries allowed?                                         | Daily records          |
| 7   | Can today's counts be edited until midnight in the configured timezone? | Historical integrity   |
| 8   | Which Panchang provider and calculation convention will be used?        | Panchang               |
| 9   | What should happen if the user travels to another timezone?             | Date handling          |
| 10  | What inactivity timeout and login behavior are required?                | Authentication         |
| 11  | Can a practice be archived while associated with an ongoing Anushthan?  | Practice lifecycle     |
| 12  | What exact condition marks an Anushthan completed?                      | Anushthan lifecycle    |

---

# 18. Risks and Mitigation

| Risk                                                      | Mitigation                                                     |
| --------------------------------------------------------- | -------------------------------------------------------------- |
| Repetition target cannot be represented using whole malas | Resolve target divisibility and rounding before implementation |
| Lifetime totals become inconsistent                       | Derive totals from daily entries                               |
| Anushthan progress differs from journal                   | Use daily entries as the single source of truth                |
| Duplicate daily practice entries                          | Database unique constraints                                    |
| Incorrect Anushthan attribution                           | Validate ownership, membership, and dates                      |
| Historical counts are modified                            | Enforce immutability server-side/database-side                 |
| Multiple ongoing Anushthans                               | Enforce the rule transactionally                               |
| Incorrect Tithi information                               | Verify provider, location, and calculation convention          |
| Session remains active unexpectedly                       | Configure session expiry and inactivity policy                 |
| Long-term data loss                                       | Portable exports and tested backups                            |
| Civil date shifts because of UTC conversion               | Use PostgreSQL DATE for practice dates                         |

---

# 19. Proposed Technology Stack

| Layer                      | Technology                          |
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

### 19.1 Architectural Notes

- Next.js will serve as the primary application framework.
- Node.js will provide the server-side runtime through Next.js.
- A separate Express.js backend is not planned for the initial version.
- Supabase will provide managed PostgreSQL database services and authentication.
- PostgreSQL Row Level Security (RLS) will enforce user-level data access policies.
- Zod will validate incoming data at application boundaries.
- React Hook Form may be introduced if form complexity justifies it.
- Jest will be used for unit and integration testing.
- Playwright will be used for end-to-end testing.
- Vercel will host the production application.
- Environment variables and secrets will be managed through local environment files and Vercel environment settings.
- Sensitive credentials, especially the Supabase service role key, must never be exposed to the browser.

---

# 20. Development Milestones

## Phase 1 — Requirements and Architecture

- Finalize requirements.
- Resolve open business rules.
- Design entity relationships.
- Define database constraints.
- Define authorization policies.
- Document architectural decisions.

## Phase 2 — Environment Setup

- Create Next.js application.
- Configure TypeScript and Tailwind CSS.
- Set up Supabase.
- Configure separate development and production environments.
- Establish Git workflow.

## Phase 3 — Database and Authentication

- Create database migrations.
- Configure authentication.
- Implement RLS policies.
- Verify ownership and access restrictions.

## Phase 4 — Core Practice Management

- Mantra library.
- Stotra library.
- Daily records.
- Daily comments.
- Lifetime totals.

## Phase 5 — Anushthan

- Anushthan creation.
- Practice associations.
- Individual targets.
- Dynamic target calculations.
- Anushthan calendar and progress.

## Phase 6 — Dashboard and Calendar

- Dashboard.
- Monthly calendar.
- Historical record views.
- Tithi/Panchang integration, if verified.

## Phase 7 — Testing

- Unit tests.
- Integration tests.
- Playwright E2E tests.
- Security and authorization tests.
- Responsive testing.

## Phase 8 — Deployment and Maintenance

- Production environment.
- Deployment.
- Backup/export strategy.
- Restore testing.
- Documentation and maintenance plan.

---

**Document Status:** Version 0.2.0 is a working requirements baseline. It is not yet frozen or approved for implementation. All unresolved domain rules must be reviewed before the relevant features are built.
