# Software Requirements Specification (SRS)

## Sadhana Tracker

**Document Version:** 0.3.0  
**Last Updated:** 2026-11-05  
**Status:** Draft — Requirements Finalization

---

# 1. Introduction

## 1.1 Purpose

Sadhana Tracker is a private web application designed to record, organize, and review personal spiritual practices.

It supports daily mantra japa, stotra recitations, personal observations, lifetime practice statistics, and structured Anushthan commitments.

The application must maintain accurate historical records and prevent duplication of practice data across different views.

## 1.2 Scope

The initial version will include:

- User authentication.
- Mantra and stotra libraries.
- Daily practice tracking.
- Regular Upasana and Anushthan attribution.
- Daily comments and observations.
- Calendar-based navigation.
- Anushthan creation and progress tracking.
- Dynamic target distribution.
- Anushthan history and reports.
- Lifetime practice statistics.
- User settings.
- Optional Panchang integration, subject to provider evaluation.

## 1.3 Intended User

The initial application is designed for private, individual use.

The database and authorization model must still enforce user-level data isolation.

---

# 2. Terminology

| Term           | Definition                                                                        |
| -------------- | --------------------------------------------------------------------------------- |
| Sadhana        | Personal spiritual practice                                                       |
| Mantra         | A mantra recorded in the practice library                                         |
| Japa           | Repetition of a mantra                                                            |
| Mala           | A unit consisting of 108 mantra repetitions                                       |
| Stotra         | A devotional hymn or prayer                                                       |
| Upasana        | Regular daily practice outside an Anushthan commitment                            |
| Anushthan      | A defined commitment to complete specified practice targets within a duration     |
| Daily Record   | The common record associated with a user's civil calendar date                    |
| Daily Entry    | An individual mantra or stotra practice record                                    |
| Target         | The committed quantity for an individual practice                                 |
| Recommendation | The dynamically calculated daily amount suggested to achieve the remaining target |

---

# 3. User Authentication and Authorization

## 3.1 Authentication

- Users will authenticate through Supabase Auth.
- No custom password storage table will be created.
- Authenticated sessions must be validated for protected operations.

## 3.2 Authorization

- Each user's data must remain isolated.
- PostgreSQL Row Level Security (RLS) must enforce user-level access.
- Server-side authorization must be performed for sensitive operations.
- The Supabase service role key must never be exposed to the browser.

## 3.3 Access Control

Users may access and modify only their own:

- Mantras.
- Stotras.
- Daily records.
- Daily practice entries.
- Anushthans.
- User settings.

---

# 4. Mantra Library

## 4.1 Functional Requirements

The system shall allow users to:

- Register a mantra.
- View registered mantras.
- Edit mantra information.
- Archive a mantra.
- View lifetime practice totals.

## 4.2 Mantra Data

The exact descriptive fields will be finalized during database design.

The library must support a stable identifier and ownership association.

## 4.3 Archival

- Archiving must not delete historical practice entries.
- Archived mantras must remain identifiable in historical records.
- The system must prevent invalid new selections of archived practices where applicable.

---

# 5. Stotra Library

## 5.1 Functional Requirements

The system shall allow users to:

- Register a stotra.
- View registered stotras.
- Edit stotra information.
- Archive a stotra.
- View lifetime recitation totals.

## 5.2 Archival

- Archiving must not delete historical recitations.
- Historical records must continue displaying the original stotra reference.

---

# 6. Daily Records

## 6.1 Daily Record Structure

The application shall maintain one common daily record per user and civil calendar date.

A daily record contains:

- User association.
- Civil calendar date.
- Optional shared comment.
- Creation timestamp.
- Update timestamp.

## 6.2 Record Creation

- Opening a date must not automatically create a database record.
- A daily record is created when actual practice data or a comment is saved.
- A date without saved activity must remain empty.
- Zero-count records must not be generated automatically.

## 6.3 Daily Comments

- Each date has one shared optional comment.
- The comment is accessible from both the main calendar and Anushthan calendar.
- Editing a comment must update the existing daily record.
- Historical comments remain editable.

## 6.4 Daily Record Uniqueness

The database must enforce:

`UNIQUE(user_id, practice_date)`

This prevents multiple daily records for the same user and date.

## 6.5 Shared Records

The main calendar and Anushthan calendar must reference the same daily record.

Opening the same date from either view must not create duplicate records or duplicate practice counts.

---

# 7. Daily Mantra Entries

## 7.1 Recording

- Daily mantra practice shall be recorded in whole malas.
- One mala always equals 108 repetitions.
- Partial malas are not supported in the initial version.
- A mantra entry must reference a valid daily record and mantra.
- An entry must be attributed to Regular Upasana or one Anushthan.

## 7.2 Attribution

- `anushthan_id = NULL` represents Regular Upasana.
- A non-null `anushthan_id` represents practice performed under that Anushthan.
- The same mantra cannot have separate Regular and Anushthan entries on the same date.
- Different practices on the same date may have different attribution.

Example:

| Practice | Attribution     |
| -------- | --------------- |
| Mantra A | Regular Upasana |
| Mantra B | Anushthan 1     |
| Stotra A | Regular Upasana |
| Stotra B | Anushthan 1     |

## 7.3 Uniqueness

The database shall enforce:

`UNIQUE(daily_record_id, mantra_id)`

## 7.4 Lifetime Calculation

Total mantra malas:

`SUM(daily_mantra_entries.malas_completed)`

Total mantra repetitions:

`Total malas × 108`

Lifetime totals include Regular Upasana and Anushthan entries.

---

# 8. Daily Stotra Entries

## 8.1 Recording

- Stotra practice shall be recorded in complete recitations.
- Partial recitations are not supported.
- Every entry must reference a valid daily record and stotra.
- Every entry must be attributed to Regular Upasana or one Anushthan.

## 8.2 Uniqueness

The database shall enforce:

`UNIQUE(daily_record_id, strotra_id)`

## 8.3 Lifetime Calculation

Total stotra recitations:

`SUM(daily_strotra_entries.recitations_completed)`

Lifetime totals include Regular Upasana and Anushthan entries.

---

# 9. Regular Upasana

Regular Upasana represents daily practice not associated with an Anushthan.

Requirements:

- Regular mantra entries have `anushthan_id = NULL`.
- Regular stotra entries have `anushthan_id = NULL`.
- Regular practice contributes to lifetime totals.
- Regular practice can coexist with Anushthan practice on the same date for different practices.

---

# 10. Anushthan Management

## 10.1 Definition

An Anushthan represents a commitment to complete specified quantities of one or more practices within a defined duration.

An Anushthan may contain:

- One or more mantras.
- One or more stotras.
- A combination of mantras and stotras.

At least one practice must be selected.

## 10.2 Creation

The user shall provide:

- Anushthan title or name.
- Start date.
- End date.
- One or more selected mantras and their individual targets.
- One or more selected stotras and their individual targets.

The user may:

- Select an existing mantra or stotra.
- Register a new mantra or stotra directly during Anushthan creation.

A newly registered practice must be saved in its normal library table and linked through the relevant Anushthan mapping table.

## 10.3 Independent Targets

Every selected practice must have its own independent target.

Mantra target:

- Expressed in whole malas.

Stotra target:

- Expressed in complete recitations.

Example:

| Practice |         Target |
| -------- | -------------: |
| Mantra A |    1,200 malas |
| Mantra B |      500 malas |
| Stotra A | 40 recitations |
| Stotra B | 20 recitations |

Targets must never be combined into one shared quantity.

## 10.4 Ongoing Anushthan Restriction

Only one ongoing Anushthan may exist for a user.

The restriction must be enforced at the database/server boundary, not only in the frontend.

Concurrent creation requests must not allow multiple ongoing Anushthans.

## 10.5 Practice Association

Each Anushthan practice must be associated through its mapping table.

Daily entries attributed to an Anushthan must satisfy all of the following:

- The Anushthan belongs to the authenticated user.
- The selected practice is included in that Anushthan.
- The daily entry date is within the Anushthan's permitted duration.
- The Anushthan is in a state that permits recording.

The database and server-side operations must enforce these rules.

---

# 11. Anushthan Target Distribution

## 11.1 Initial Distribution

The application shall distribute each practice's target as evenly as possible across the Anushthan duration.

The distribution uses whole-number quantities.

Example:

Target: 100 malas  
Duration: 3 days

| Day   | Recommended malas |
| ----- | ----------------: |
| Day 1 |                34 |
| Day 2 |                33 |
| Day 3 |                33 |

## 11.2 Balanced Distribution Rule

For a remaining target `R` and remaining days `D`:

- Base allocation = `floor(R / D)`
- Remainder = `R % D`
- The earliest remaining days receive one additional unit until the remainder is exhausted.

This ensures:

- Whole-number recommendations.
- Balanced daily allocation.
- Exact preservation of the total target.
- No recommendation exceeds the remaining commitment.

The same principle applies to stotra recitation targets.

## 11.3 Dynamic Redistribution

After a daily entry is successfully saved:

1. Calculate actual completed quantity.
2. Calculate remaining target.
3. Calculate remaining eligible days.
4. Recalculate balanced daily recommendations.

Example:

Original target: 100 malas  
Original duration: 10 days

Suppose 35 malas are completed on Day 1.

Remaining target: 65 malas  
Remaining days: 9

The application redistributes the remaining 65 malas across those nine days.

## 11.4 Progress Calculation

For each practice:

`Remaining target = Original target - Actual completed quantity`

`Achievement percentage = (Actual completed quantity / Original target) × 100`

The system must not count entries associated with other Anushthans or Regular Upasana toward this Anushthan's progress.

## 11.5 Recommendation Versus Restriction

Daily recommendations are guidance, not limits.

Users may complete more or fewer malas/recitations than recommended.

The original target and duration remain unchanged.

---

# 12. Anushthan History and Reports

## 12.1 History

Every Anushthan must become part of Anushthan History after its end date, regardless of whether the committed target was completed.

No manual completion confirmation is required.

No separate Pending Review state is required.

## 12.2 Historical Records

The historical Anushthan must preserve:

- Original commitment.
- Selected practices.
- Individual targets.
- Start date.
- End date.
- Actual daily entries.
- Total completed quantities.
- Remaining quantities.
- Achievement percentages.

## 12.3 Final Report

Opening a historical Anushthan shall display its final report.

Example:

| Metric           |     Value |
| ---------------- | --------: |
| Committed target | 100 malas |
| Actual completed |  90 malas |
| Remaining        |  10 malas |
| Achievement      |       90% |
| Duration         |   10 days |

For a mixed Anushthan, each mantra and stotra must have its own report.

## 12.4 Historical Integrity

- Historical records must not be automatically extended.
- Original target and duration must be preserved.
- Historical progress must be based on actual saved daily entries.
- The application must not automatically label an Anushthan as Completed or Incomplete based on target fulfillment.
- History membership is determined by the Anushthan's lifecycle/end date, not a manually selected outcome.

---

# 13. Calendar

## 13.1 Main Calendar

The main calendar shall:

- Display the user's practice history.
- Allow navigation between dates.
- Show dates with saved practice records.
- Open the corresponding daily record.
- Display daily comments and practice entries.

## 13.2 Anushthan Calendar

The Anushthan calendar shall:

- Display the complete Anushthan duration.
- Show daily practice associated with that Anushthan.
- Open the same daily record used by the main calendar.
- Display shared daily comments.
- Show per-practice progress and recommendations.

## 13.3 Empty Dates

Dates without saved activity must remain empty.

The application must not create zero-count records merely because a date is displayed.

---

# 14. Editing Rules

## 14.1 Current Date

Daily counts may be corrected or edited on the current practice date.

## 14.2 Past Dates

Once a practice date has passed:

- Mantra counts become read-only.
- Stotra counts become read-only.
- Historical comments remain editable.

## 14.3 Enforcement

These rules must be enforced server-side and at the database boundary where applicable.

Frontend-disabled inputs alone are insufficient.

The exact timezone and date-boundary policy remains to be finalized.

---

# 15. First-Use Lifecycle

## 15.1 Initialization

The application's practice history begins on the date of the user's first genuine practice record.

## 15.2 Requirements

- The first genuine practice record must be for the current date.
- The system must not allow a backdated first record.
- `user_settings.practice_start_date` is initialized only once.
- Initialization must occur atomically with the successful first daily record save.
- Opening the calendar must not initialize the practice start date.
- Test records must not initialize production data.

## 15.3 Calendar Boundary

The earliest accessible practice calendar date is the initialized practice start date.

The practice start date is not editable through ordinary settings.

---

# 16. User Settings

The proposed `user_settings` table will contain:

| Field                 | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| `user_id`             | Unique user reference                           |
| `practice_start_date` | First genuine practice date; initially nullable |
| `timezone`            | User's civil date/timezone configuration        |
| `panchang_location`   | Location used for Panchang calculations         |
| `created_at`          | Creation timestamp                              |
| `updated_at`          | Last update timestamp                           |

Timezone and Panchang location are separate settings.

Application secrets, API keys, and deployment configuration must be stored in environment variables or deployment secrets, not user settings.

The fixed mala size of 108 must not be configurable.

---

# 17. Panchang Integration

Panchang display is a planned feature.

The implementation must consider:

- Provider reliability.
- API availability.
- Location-dependent calculations.
- Timezone handling.
- Relevant regional/traditional conventions.

The provider, convention, and location-selection workflow must be decided before implementation.

The application must not display fabricated or unverified Panchang information.

---

# 18. Proposed Database Design

The initial database design consists of nine application tables.

Authentication is provided separately by Supabase Auth.

## 18.1 `mantras`

Stores the user's mantra library.

Proposed fields:

- `id`
- `user_id`
- Descriptive mantra fields
- `is_archived`
- `created_at`
- `updated_at`

## 18.2 `strotras`

Stores the user's stotra library.

Proposed fields:

- `id`
- `user_id`
- Descriptive stotra fields
- `is_archived`
- `created_at`
- `updated_at`

## 18.3 `anushthans`

Stores Anushthan commitments.

Proposed fields:

- `id`
- `user_id`
- `name`
- `start_date`
- `end_date`
- `created_at`
- `updated_at`

The lifecycle state may be derived from the dates and whether the Anushthan is active. A separate history table is not required.

## 18.4 `anushthan_mantras`

Maps mantras to Anushthans.

Proposed fields:

- `id`
- `anushthan_id`
- `mantra_id`
- `target_malas`

Each mapping represents one independent mantra commitment.

## 18.5 `anushthan_strotras`

Maps stotras to Anushthans.

Proposed fields:

- `id`
- `anushthan_id`
- `strotra_id`
- `target_recitations`

Each mapping represents one independent stotra commitment.

## 18.6 `daily_records`

Stores one common daily record per user and civil date.

Proposed fields:

- `id`
- `user_id`
- `practice_date`
- `comment`
- `created_at`
- `updated_at`

Unique constraint:

`UNIQUE(user_id, practice_date)`

## 18.7 `daily_mantra_entries`

Stores daily mantra practice.

Proposed fields:

- `id`
- `daily_record_id`
- `mantra_id`
- `anushthan_id` (nullable)
- `malas_completed`
- `created_at`
- `updated_at`

Unique constraint:

`UNIQUE(daily_record_id, mantra_id)`

## 18.8 `daily_strotra_entries`

Stores daily stotra practice.

Proposed fields:

- `id`
- `daily_record_id`
- `strotra_id`
- `anushthan_id` (nullable)
- `recitations_completed`
- `created_at`
- `updated_at`

Unique constraint:

`UNIQUE(daily_record_id, strotra_id)`

## 18.9 `user_settings`

Stores user-specific application settings.

Proposed fields:

- `id`
- `user_id` (unique)
- `practice_start_date` (nullable)
- `timezone`
- `panchang_location`
- `created_at`
- `updated_at`

---

# 19. Database Integrity and Business Constraints

The database and server-side application must enforce:

1. Every practice and record belongs to the authenticated user.
2. Every daily record has a unique user/date combination.
3. A mantra can appear only once per daily record.
4. A stotra can appear only once per daily record.
5. Each daily entry has exactly one attribution: Regular or one valid Anushthan.
6. An Anushthan must belong to the same user as its daily entry.
7. The selected practice must belong to the corresponding Anushthan mapping.
8. Anushthan entries must fall within the permitted date range.
9. Anushthan creation must enforce the single-ongoing-Anushthan rule, including concurrent requests.
10. Mantra quantities must be whole malas.
11. Stotra quantities must be complete recitations.
12. Counts must not be negative.
13. Targets must be positive.
14. Historical count-edit restrictions must be enforced outside the frontend.
15. First-use initialization must be atomic with the first genuine daily save.

Additional composite foreign keys, database functions, constraints, and transaction boundaries will be evaluated during detailed database design.

---

# 20. Lifetime Statistics and Calculations

## 20.1 Mantra Statistics

Total malas:

`SUM(malas_completed)`

Total repetitions:

`SUM(malas_completed) × 108`

## 20.2 Stotra Statistics

Total recitations:

`SUM(recitations_completed)`

## 20.3 Anushthan Statistics

Only entries explicitly associated with the relevant Anushthan contribute to its progress.

Lifetime statistics include both Regular Upasana and Anushthan entries.

The same daily entry must never be counted twice.

---

# 21. Non-Functional Requirements

## 21.1 Responsive Design

The application must be mobile-first and usable on desktop and mobile devices.

## 21.2 Security

- Supabase Auth for authentication.
- PostgreSQL RLS for database authorization.
- Server-side validation and authorization.
- Secure environment variable management.
- No service role credentials in client-side code.

## 21.3 Reliability

- Prevent duplicate records.
- Preserve historical data.
- Use database transactions for related operations.
- Protect against concurrent Anushthan creation.
- Support reliable backups and recovery.

## 21.4 Maintainability

- Modular application architecture.
- Clear separation of UI, validation, and data access.
- Type-safe application interfaces.
- Reusable components.
- Automated tests for critical business rules.

## 21.5 Performance

- Avoid unnecessary database queries.
- Calculate aggregates efficiently.
- Paginate or limit large historical datasets when appropriate.
- Optimize calendar queries and rendering.

---

# 22. Testing Requirements

## 22.1 Unit Tests — Jest

Test:

- Mala-to-repetition conversion.
- Balanced target distribution.
- Remaining target calculations.
- Achievement percentages.
- Anushthan progress calculations.
- Date and lifecycle calculations.
- Validation rules.

## 22.2 Integration Tests

Test:

- Daily record creation.
- Daily entry creation and updates.
- Duplicate-entry prevention.
- Attribution validation.
- Anushthan practice mapping validation.
- User ownership enforcement.
- First-use initialization.
- Transaction and concurrency-sensitive operations.

## 22.3 End-to-End Tests — Playwright

Test complete user workflows:

- Authentication.
- Registering and archiving practices.
- Saving daily mantra and stotra entries.
- Adding daily comments.
- Navigating the main calendar.
- Creating an Anushthan.
- Registering a practice during Anushthan creation.
- Recording Anushthan progress.
- Dynamic target redistribution.
- Viewing Anushthan history and reports.
- Verifying lifetime totals.
- Verifying user-level data isolation.

---

# 23. Acceptance Criteria

The initial version will be considered functionally complete when:

1. Users can securely authenticate.
2. Users can manage mantra and stotra libraries.
3. Daily entries can be saved without creating duplicate records.
4. Regular and Anushthan practice can coexist on the same date for different practices.
5. Each practice has correct attribution.
6. Lifetime totals correctly aggregate all practice entries.
7. Anushthan targets are independent for each selected practice.
8. Balanced distribution produces correct whole-number recommendations.
9. Recommendations update after daily progress is saved.
10. Anushthan progress uses only its own entries.
11. Every ended Anushthan appears in history, regardless of target completion.
12. Historical reports accurately display committed and actual quantities.
13. Main and Anushthan calendars share the same daily records.
14. Past practice counts cannot be edited through unauthorized operations.
15. The first-use lifecycle is initialized correctly.
16. Critical workflows are covered by automated tests.
17. Production deployment works securely on Vercel with Supabase.

---

# 24. Unresolved Requirements

The following decisions must be completed before the relevant features are implemented.

| #   | Question                                                                     | Status |
| --- | ---------------------------------------------------------------------------- | ------ |
| 1   | Are Anushthan start and end dates inclusive?                                 | Open   |
| 2   | Can an Anushthan have a future start date?                                   | Open   |
| 3   | Can an Anushthan be created with a target already completed?                 | Open   |
| 4   | Are zero-count entries allowed, or should saving zero remove/omit the entry? | Open   |
| 5   | What timezone determines the civil practice date?                            | Open   |
| 6   | How should travel across timezones affect daily records?                     | Open   |
| 7   | What exact cutoff determines when a date becomes historical?                 | Open   |
| 8   | Which Panchang provider and regional convention should be used?              | Open   |
| 9   | Can archived practices remain selectable in a new Anushthan?                 | Open   |
| 10  | What happens if a practice linked to an ongoing Anushthan is archived?       | Open   |
| 11  | What is the account session/inactivity policy?                               | Open   |
| 12  | Should an Anushthan target or duration be editable after it begins?          | Open   |

These questions must be resolved before the affected features are finalized.

---

# 25. Proposed Technology Stack

| Layer                      | Technology                    |
| -------------------------- | ----------------------------- |
| Frontend                   | React                         |
| Framework                  | Next.js                       |
| Language                   | TypeScript                    |
| Backend Runtime            | Node.js (Next.js server-side) |
| Database                   | PostgreSQL                    |
| Backend Services           | Supabase                      |
| Authentication             | Supabase Auth                 |
| Authorization              | PostgreSQL Row Level Security |
| Styling                    | Tailwind CSS                  |
| Validation                 | Zod                           |
| Forms                      | React Hook Form (if needed)   |
| Unit & Integration Testing | Jest                          |
| End-to-End Testing         | Playwright                    |
| Deployment & Hosting       | Vercel                        |

## 25.1 Architectural Notes

- Next.js is the primary application framework.
- Node.js provides the server-side runtime through Next.js.
- No separate Express or H3 server is planned.
- Supabase provides managed PostgreSQL and authentication.
- Zod validates application input at data boundaries.
- React Hook Form will be introduced if form complexity warrants it.
- Jest handles unit and integration tests.
- Playwright handles end-to-end workflows.
- Vercel hosts the production application.
- Environment variables and deployment secrets must be managed securely.

---

# 26. Implementation Milestones

### Milestone 1 — Requirements and Architecture

- Finalize SRS.
- Finalize unresolved business rules.
- Review relational schema.
- Define authorization and integrity strategy.

### Milestone 2 — Project Setup

- Initialize Next.js and TypeScript.
- Configure Tailwind CSS.
- Configure ESLint and formatting.
- Configure Jest and Playwright.
- Establish Git workflow.

### Milestone 3 — Database and Authentication

- Create Supabase project.
- Configure PostgreSQL schema and migrations.
- Configure RLS policies.
- Implement authentication.
- Verify user data isolation.

### Milestone 4 — Practice Libraries

- Mantra CRUD.
- Stotra CRUD.
- Archival behavior.

### Milestone 5 — Daily Practice

- Daily record handling.
- Mantra entries.
- Stotra entries.
- Shared comments.
- Attribution rules.
- Lifetime statistics.

### Milestone 6 — Calendar

- Main calendar.
- Daily record navigation.
- Anushthan calendar integration.

### Milestone 7 — Anushthan

- Creation workflow.
- Practice mappings.
- Independent targets.
- Balanced distribution.
- Dynamic redistribution.
- Progress calculation.

### Milestone 8 — History and Reports

- End-date lifecycle.
- Historical listing.
- Per-practice reports.
- Historical data preservation.

### Milestone 9 — Quality and Deployment

- Automated testing.
- Security review.
- Production configuration.
- Vercel deployment.
- Backup and recovery verification.

---

# 27. Document Status

This SRS is the working requirements baseline for Sadhana Tracker.

Requirements that have been explicitly confirmed are treated as fixed for the current scope. Open decisions remain subject to review before implementation of the affected functionality.

Database field names and constraints are proposed and may be refined during schema design without changing the confirmed business rules.
