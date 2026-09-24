# 🎫 Feature Ticket List

> **Project:** [Project Name]
> **Sprint:** [Sprint Number / Milestone Name]
> **Version Target:** v[X.Y.Z]
> **Last Updated:** [YYYY-MM-DD]
> **Maintained By:** [Product Manager / Tech Lead]
> **Status:** 🟢 Active

---

## 📌 Quick Reference

| Symbol | Meaning        | Symbol | Meaning           |
|--------|----------------|--------|-------------------|
| 🔴     | Critical / P0  | 🟠     | High / P1         |
| 🟡     | Medium / P2    | 🟢     | Low / P3          |
| ⬜     | Not Started    | 🔄     | In Progress       |
| 🧪     | In QA / Review | ✅     | Done              |
| 🚫     | Blocked        | ❄️     | Icebox / Deferred |

---

## 📊 Sprint Overview

| Metric              | Count |
|---------------------|-------|
| **Total Tickets**   | XX    |
| **Not Started** ⬜  | XX    |
| **In Progress** 🔄  | XX    |
| **In QA** 🧪        | XX    |
| **Done** ✅          | XX    |
| **Blocked** 🚫       | XX    |

**Sprint Goal:**
> [One line describing what we want to achieve by end of this sprint]

---

## 🔐 EPIC-01: Authentication & Authorization

> **Goal:** Secure user registration, login, session management, and role-based access.
> **Epic Owner:** [Name] | **Target:** v1.0.0

---

### TICKET-001 — User Registration

| Field          | Details                                |
|----------------|----------------------------------------|
| **ID**         | TICKET-001                             |
| **Title**      | User Registration with Email & Password|
| **Epic**       | EPIC-01: Authentication                |
| **Priority**   | 🔴 Critical                            |
| **Status**     | ⬜ Not Started                          |
| **Assignee**   | [Developer Name]                       |
| **Estimate**   | 3 SP (Story Points)                    |
| **Labels**     | `backend` `frontend` `auth`            |

**User Story:**
> *As a new visitor, I want to create an account using my email and password so that I can access the platform.*

**Acceptance Criteria:**
- [ ] User can register with: name, email, password, confirm password
- [ ] Zod validation runs on submit (client-side)
- [ ] Backend validates email uniqueness — returns 409 if already exists
- [ ] Password is hashed with bcrypt (cost factor: 12) before saving
- [ ] On success: verification email sent, user redirected to `/verify-email` page
- [ ] On failure: descriptive error message shown inline (not toast)
- [ ] Rate limiting: max 5 registration attempts per IP per hour

**Technical Notes:**
```
POST /api/auth/register
Body: { name, email, password }
Response: { message: "Verification email sent" }
```

**Dependencies:** None
**Blocked By:** —
**Related:** TICKET-002 (Login), TICKET-005 (Email Verification)

---

### TICKET-002 — User Login

| Field          | Details                                |
|----------------|----------------------------------------|
| **ID**         | TICKET-002                             |
| **Title**      | Email + Password Login with JWT        |
| **Epic**       | EPIC-01: Authentication                |
| **Priority**   | 🔴 Critical                            |
| **Status**     | ⬜ Not Started                          |
| **Assignee**   | [Developer Name]                       |
| **Estimate**   | 2 SP                                   |
| **Labels**     | `backend` `frontend` `auth`            |

**User Story:**
> *As a registered user, I want to log in with my email and password so that I can access my account.*

**Acceptance Criteria:**
- [ ] Login form: email + password fields
- [ ] On success: JWT access token in memory + refresh token in HttpOnly cookie
- [ ] Access token expiry: 15 minutes
- [ ] Refresh token expiry: 7 days
- [ ] Max 5 failed attempts → account locked for 15 minutes
- [ ] "Remember me" option extends refresh token to 30 days
- [ ] Redirect to `/dashboard` after successful login
- [ ] If account not verified → show "verify your email" error

**Technical Notes:**
```
POST /api/auth/login
Body: { email, password, rememberMe?: boolean }
Response: { accessToken, user: { id, name, email, role } }
Set-Cookie: refreshToken (HttpOnly, Secure, SameSite=Strict)
```

**Dependencies:** TICKET-001
**Blocked By:** —

---

### TICKET-003 — Google OAuth Login

| Field          | Details                                |
|----------------|----------------------------------------|
| **ID**         | TICKET-003                             |
| **Title**      | Google OAuth 2.0 Sign-In               |
| **Epic**       | EPIC-01: Authentication                |
| **Priority**   | 🟠 High                                |
| **Status**     | ⬜ Not Started                          |
| **Assignee**   | [Developer Name]                       |
| **Estimate**   | 3 SP                                   |
| **Labels**     | `backend` `frontend` `auth` `oauth`    |

**User Story:**
> *As a user, I want to sign in with my Google account so that I don't need to remember another password.*

**Acceptance Criteria:**
- [ ] "Continue with Google" button on login + register page
- [ ] OAuth flow: redirect to Google → callback → create/find user → issue JWT
- [ ] If Google email already exists as local account → merge accounts (prompt user)
- [ ] Avatar from Google profile picture stored
- [ ] New OAuth users skip email verification step
- [ ] Works in Safari (no third-party cookie issues)

**Dependencies:** TICKET-001, TICKET-002
**Blocked By:** —

---

### TICKET-004 — Logout & Token Refresh

| Field          | Details                                |
|----------------|----------------------------------------|
| **ID**         | TICKET-004                             |
| **Title**      | Logout + Silent Token Refresh          |
| **Epic**       | EPIC-01: Authentication                |
| **Priority**   | 🔴 Critical                            |
| **Status**     | ⬜ Not Started                          |
| **Assignee**   | [Developer Name]                       |
| **Estimate**   | 2 SP                                   |
| **Labels**     | `backend` `frontend` `auth`            |

**User Story:**
> *As a logged-in user, I want my session to stay active without re-logging in every 15 minutes, and I want to be able to log out securely.*

**Acceptance Criteria:**
- [ ] Axios interceptor silently refreshes token on 401 response
- [ ] Refresh happens at most once (queue concurrent requests during refresh)
- [ ] If refresh fails → clear auth state → redirect to `/login`
- [ ] Logout: clears access token from memory + calls `POST /api/auth/logout` to invalidate refresh token cookie
- [ ] "Logout from all devices" option in settings

**Technical Notes:**
```
POST /api/auth/refresh  → new accessToken (uses HttpOnly cookie)
POST /api/auth/logout   → clears refresh token cookie + Redis blacklist
```

**Dependencies:** TICKET-002
**Blocked By:** —

---

### TICKET-005 — Email Verification

| Field          | Details                    |
|----------------|----------------------------|
| **ID**         | TICKET-005                 |
| **Title**      | Email Verification Flow    |
| **Priority**   | 🟠 High                    |
| **Status**     | ⬜ Not Started              |
| **Assignee**   | [Developer Name]           |
| **Estimate**   | 2 SP                       |
| **Labels**     | `backend` `email`          |

**Acceptance Criteria:**
- [ ] Verification email sent on registration (Resend / SendGrid)
- [ ] Email contains unique token link (expiry: 24 hours)
- [ ] Clicking link → account verified → redirect to `/dashboard`
- [ ] Resend verification email button (rate limited: once per minute)
- [ ] Expired token → user can request new one

**Dependencies:** TICKET-001
**Blocked By:** Email service setup

---

### TICKET-006 — Forgot / Reset Password

| Field          | Details                      |
|----------------|------------------------------|
| **ID**         | TICKET-006                   |
| **Title**      | Password Reset Flow          |
| **Priority**   | 🟠 High                      |
| **Status**     | ⬜ Not Started                |
| **Assignee**   | [Developer Name]             |
| **Estimate**   | 2 SP                         |
| **Labels**     | `backend` `frontend` `email` |

**Acceptance Criteria:**
- [ ] "Forgot password?" link on login page
- [ ] User enters email → reset link sent (even if email doesn't exist, show same success message — security)
- [ ] Reset token: 1-hour expiry, one-time use
- [ ] New password must meet strength requirements
- [ ] After reset → all existing refresh tokens invalidated
- [ ] Confirmation email after successful reset

---

## 📊 EPIC-02: Dashboard & Core UI

> **Goal:** Deliver the primary dashboard interface with navigation, stats, and key data views.
> **Epic Owner:** [Name] | **Target:** v1.0.0

---

### TICKET-010 — Dashboard Layout & Navigation

| Field          | Details                                      |
|----------------|----------------------------------------------|
| **ID**         | TICKET-010                                   |
| **Title**      | Sidebar Navigation + Responsive Dashboard Layout |
| **Epic**       | EPIC-02: Dashboard                           |
| **Priority**   | 🔴 Critical                                  |
| **Status**     | 🔄 In Progress                               |
| **Assignee**   | [Frontend Dev Name]                          |
| **Estimate**   | 5 SP                                         |
| **Labels**     | `frontend` `ui`                              |

**Acceptance Criteria:**
- [ ] Left sidebar: logo, nav items, user avatar + name at bottom
- [ ] Sidebar collapsible (icon-only mode) on desktop
- [ ] Sidebar becomes drawer (overlay) on mobile
- [ ] Active route highlighted in sidebar
- [ ] Topbar: breadcrumb, global search (stub), notification bell, user menu
- [ ] User menu: Profile, Settings, Logout options
- [ ] Dark mode toggle functional

**Dependencies:** TICKET-002 (auth state needed)
**Blocked By:** —

---

### TICKET-011 — Dashboard Home Page (Stats + Overview)

| Field          | Details                          |
|----------------|----------------------------------|
| **ID**         | TICKET-011                       |
| **Title**      | Dashboard Overview with KPI Cards|
| **Priority**   | 🔴 Critical                      |
| **Status**     | ⬜ Not Started                    |
| **Assignee**   | [Developer Name]                 |
| **Estimate**   | 4 SP                             |
| **Labels**     | `frontend` `backend` `charts`    |

**Acceptance Criteria:**
- [ ] 4 KPI stat cards: [Metric 1], [Metric 2], [Metric 3], [Metric 4]
- [ ] Each card shows: current value, % change vs last period, trend arrow
- [ ] Main chart: [Line/Bar chart of key metric over time] — last 30 days
- [ ] Recent activity feed (last 10 items)
- [ ] Quick actions row (shortcuts to common tasks)
- [ ] Skeleton loading state while data fetches
- [ ] Empty state if no data yet
- [ ] Data auto-refreshes every 5 minutes (TanStack Query `refetchInterval`)

**API Needed:**
```
GET /api/dashboard/stats
GET /api/dashboard/chart?period=30d
GET /api/dashboard/activity?limit=10
```

---

### TICKET-012 — Global Search

| Field          | Details                     |
|----------------|-----------------------------|
| **ID**         | TICKET-012                  |
| **Title**      | Global Search (Cmd+K)       |
| **Priority**   | 🟡 Medium                   |
| **Status**     | ⬜ Not Started               |
| **Assignee**   | [Developer Name]            |
| **Estimate**   | 4 SP                        |
| **Labels**     | `frontend` `backend` `search`|

**Acceptance Criteria:**
- [ ] `Cmd+K` / `Ctrl+K` opens command palette (cmdk library)
- [ ] Search across: [entities] in real-time (debounced 300ms)
- [ ] Results grouped by type: Pages, [Feature 1], [Feature 2], Users
- [ ] Arrow keys to navigate, Enter to select, Escape to close
- [ ] Recent searches cached in localStorage
- [ ] Shows "No results" gracefully

---

## 📁 EPIC-03: [Core Feature Name]

> **Goal:** [Describe the main feature being built]
> **Epic Owner:** [Name] | **Target:** v1.0.0

---

### TICKET-020 — [Feature] List View

| Field          | Details                         |
|----------------|---------------------------------|
| **ID**         | TICKET-020                      |
| **Title**      | [Feature] — List with Filters & Pagination |
| **Epic**       | EPIC-03: [Core Feature]         |
| **Priority**   | 🔴 Critical                     |
| **Status**     | ⬜ Not Started                   |
| **Assignee**   | [Developer Name]                |
| **Estimate**   | 5 SP                            |
| **Labels**     | `frontend` `backend`            |

**User Story:**
> *As a user, I want to see all my [items] in a table with search, filter, and sort options so I can find what I need quickly.*

**Acceptance Criteria:**
- [ ] Paginated table: 20 items per page (server-side pagination)
- [ ] Columns: [Col1], [Col2], [Col3], Status, Created At, Actions
- [ ] Column sorting (click header to toggle ASC/DESC)
- [ ] Search bar: debounced search on [field name]
- [ ] Filter dropdown: by [status/type/date range]
- [ ] Bulk select with checkbox + bulk actions (delete, export)
- [ ] Row click → opens detail view / sidebar
- [ ] Status badges with appropriate colors
- [ ] Loading state: skeleton table rows
- [ ] Empty state: illustration + "Create your first item" CTA
- [ ] URL reflects current page, sort, filters (shareable links)

**API Needed:**
```
GET /api/[feature]?page=1&limit=20&search=&sort=createdAt&order=desc&status=
```

---

### TICKET-021 — Create [Feature]

| Field          | Details                         |
|----------------|---------------------------------|
| **ID**         | TICKET-021                      |
| **Title**      | Create [Feature] — Modal Form   |
| **Priority**   | 🔴 Critical                     |
| **Status**     | ⬜ Not Started                   |
| **Assignee**   | [Developer Name]                |
| **Estimate**   | 3 SP                            |
| **Labels**     | `frontend` `backend`            |

**Acceptance Criteria:**
- [ ] "Add New" button opens a modal (not a new page)
- [ ] Form fields: [field1 (required)], [field2], [field3], [field4 (select)]
- [ ] Client-side validation with Zod + React Hook Form
- [ ] Submit button disabled until form is valid
- [ ] Loading state on submit (spinner + "Creating...")
- [ ] On success: modal closes, list refetches, toast "Created successfully"
- [ ] On error: API error message shown inside modal (not toast)
- [ ] Escape / X button closes modal (with unsaved-changes warning if dirty)

**API Needed:**
```
POST /api/[feature]
Body: { field1, field2, field3, field4 }
Response: { id, ...fields, createdAt }
```

---

### TICKET-022 — Edit [Feature]

| Field          | Details                         |
|----------------|---------------------------------|
| **ID**         | TICKET-022                      |
| **Title**      | Edit [Feature] — Pre-filled Form|
| **Priority**   | 🟠 High                         |
| **Status**     | ⬜ Not Started                   |
| **Assignee**   | [Developer Name]                |
| **Estimate**   | 2 SP                            |
| **Labels**     | `frontend` `backend`            |

**Acceptance Criteria:**
- [ ] Edit action in table row menu (⋮ dropdown)
- [ ] Same modal as Create but pre-filled with existing data
- [ ] Form is dirty-tracked (submit only enabled on actual change)
- [ ] Optimistic update: table reflects change immediately
- [ ] On success: toast "Updated successfully"
- [ ] On API error: revert optimistic update

**Dependencies:** TICKET-020, TICKET-021
**API Needed:**
```
PATCH /api/[feature]/:id
Body: { ...changedFields }
```

---

### TICKET-023 — Delete [Feature]

| Field          | Details                         |
|----------------|---------------------------------|
| **ID**         | TICKET-023                      |
| **Title**      | Delete [Feature] — With Confirmation |
| **Priority**   | 🟠 High                         |
| **Status**     | ⬜ Not Started                   |
| **Assignee**   | [Developer Name]                |
| **Estimate**   | 1 SP                            |
| **Labels**     | `frontend` `backend`            |

**Acceptance Criteria:**
- [ ] Delete action in row menu
- [ ] Confirmation dialog: "Are you sure? This cannot be undone." + item name
- [ ] "Delete" button is red/destructive style
- [ ] Soft delete (marks `deletedAt`) — not hard delete in DB
- [ ] On success: row removed from list with fade animation, toast "Deleted"
- [ ] Bulk delete available from bulk-select toolbar

**API Needed:**
```
DELETE /api/[feature]/:id
Response: 204 No Content
```

---

### TICKET-024 — [Feature] Detail View

| Field          | Details                          |
|----------------|----------------------------------|
| **ID**         | TICKET-024                       |
| **Title**      | [Feature] Detail Page / Drawer   |
| **Priority**   | 🟡 Medium                        |
| **Status**     | ⬜ Not Started                    |
| **Assignee**   | [Developer Name]                 |
| **Estimate**   | 4 SP                             |
| **Labels**     | `frontend` `backend`             |

**Acceptance Criteria:**
- [ ] Clicking a row opens a right-side drawer (not full page navigation)
- [ ] Drawer shows: all field values, activity/history log, related items
- [ ] Quick edit inline: click field → edit in place → auto-save on blur
- [ ] Tabs inside drawer: Overview, Activity, [Sub-section]
- [ ] Drawer is shareable (URL param `?selected=[id]`)

---

## 👤 EPIC-04: User Profile & Settings

---

### TICKET-030 — User Profile Page

| Field          | Details                     |
|----------------|-----------------------------|
| **ID**         | TICKET-030                  |
| **Title**      | User Profile — View & Edit  |
| **Priority**   | 🟡 Medium                   |
| **Status**     | ⬜ Not Started               |
| **Assignee**   | [Developer Name]            |
| **Estimate**   | 3 SP                        |
| **Labels**     | `frontend` `backend`        |

**Acceptance Criteria:**
- [ ] Profile fields: avatar, name, email (read-only), bio, timezone, language
- [ ] Avatar upload: drag-and-drop or click to select (max 2MB, JPG/PNG/WEBP)
- [ ] Avatar cropped to circle before upload (react-image-crop)
- [ ] Avatar stored on S3/R2, URL saved in DB
- [ ] Timezone selector (searchable dropdown with all IANA timezones)
- [ ] "Save Changes" button — dirty tracking
- [ ] "Change Password" tab (separate from profile, requires current password)

---

### TICKET-031 — Notification Preferences

| Field          | Details                          |
|----------------|----------------------------------|
| **ID**         | TICKET-031                       |
| **Title**      | Notification Settings            |
| **Priority**   | 🟡 Medium                        |
| **Status**     | ⬜ Not Started                    |
| **Assignee**   | [Developer Name]                 |
| **Estimate**   | 2 SP                             |
| **Labels**     | `frontend` `backend`             |

**Acceptance Criteria:**
- [ ] Toggle matrix: notification type × channel (Email / In-App / Push)
- [ ] Notification types: [Event 1], [Event 2], [Event 3], Weekly Digest
- [ ] Preferences saved per user in DB
- [ ] Changes take effect immediately (no page reload)
- [ ] "Unsubscribe from all" one-click option

---

## 🛡️ EPIC-05: Admin Panel

---

### TICKET-040 — User Management (Admin)

| Field          | Details                                |
|----------------|----------------------------------------|
| **ID**         | TICKET-040                             |
| **Title**      | Admin — User List, Roles & Suspension  |
| **Epic**       | EPIC-05: Admin                         |
| **Priority**   | 🟠 High                                |
| **Status**     | ⬜ Not Started                          |
| **Assignee**   | [Developer Name]                       |
| **Estimate**   | 5 SP                                   |
| **Labels**     | `frontend` `backend` `admin`           |

**Acceptance Criteria:**
- [ ] Admin-only page at `/admin/users`
- [ ] Table: all users with Name, Email, Role, Status, Joined, Last Active
- [ ] Filter: by role, status (active/suspended/unverified)
- [ ] Change user role: USER ↔ ADMIN (dropdown in row)
- [ ] Suspend / Unsuspend user (with reason modal)
- [ ] Impersonate user (for debugging — with audit log)
- [ ] Suspended users cannot log in (check in auth middleware)

---

### TICKET-041 — System Audit Log (Admin)

| Field          | Details                          |
|----------------|----------------------------------|
| **ID**         | TICKET-041                       |
| **Title**      | Admin — Audit Log Viewer         |
| **Priority**   | 🟡 Medium                        |
| **Status**     | ⬜ Not Started                    |
| **Assignee**   | [Developer Name]                 |
| **Estimate**   | 4 SP                             |
| **Labels**     | `frontend` `backend` `admin`     |

**Acceptance Criteria:**
- [ ] View all user actions: login, logout, create, update, delete
- [ ] Columns: Timestamp, User, Action, Resource, IP Address, User Agent
- [ ] Filter by: user, action type, date range
- [ ] Export to CSV
- [ ] Logs retained for 90 days

---

## 🐛 Bug Tickets

### BUG-001 — [Bug Title]

| Field          | Details                    |
|----------------|----------------------------|
| **ID**         | BUG-001                    |
| **Type**       | 🐛 Bug                     |
| **Priority**   | 🔴 Critical                |
| **Status**     | 🔄 In Progress             |
| **Assignee**   | [Developer Name]           |
| **Reporter**   | [QA / User Name]           |
| **Found In**   | v[X.Y.Z] / staging         |

**Description:**
> [Describe the bug clearly — what is happening vs what should happen]

**Steps to Reproduce:**
1. Go to [page]
2. Click [element]
3. [Next step]
4. See error: [error message]

**Expected Behavior:**
> [What should happen]

**Actual Behavior:**
> [What is actually happening]

**Environment:**
```
Browser: Chrome 124 / Safari 17 / Firefox 125
OS:      macOS 14 / Windows 11
Screen:  1440×900 (desktop) / 390×844 (mobile)
User:    ADMIN role / USER role
```

**Attachments:** [Screenshot / Screen Recording / Sentry link]

---

## ❄️ Icebox (Deferred Tickets)

> These tickets are valid ideas but not planned for current release.

| ID          | Title                           | Reason Deferred               |
|-------------|---------------------------------|-------------------------------|
| ICE-001     | Mobile App (React Native)       | Post v1.0 — focus on web first|
| ICE-002     | AI-Powered [Feature]            | Needs more data to train on   |
| ICE-003     | Multi-language (i18n)           | v2.0 roadmap                  |
| ICE-004     | Zapier / API Webhooks           | Depends on user demand         |
| ICE-005     | Dark Mode v2 (custom themes)    | Nice-to-have, not critical     |

---

## 📐 Estimation Guide

| Story Points | Effort               | Complexity         | Example                     |
|--------------|----------------------|--------------------|-----------------------------|
| 1 SP         | 2–4 hours            | Trivial            | Change a label, add tooltip |
| 2 SP         | 4–8 hours (half day) | Simple             | New API endpoint            |
| 3 SP         | 1 day                | Moderate           | Login page with validation  |
| 5 SP         | 2–3 days             | Complex            | Feature CRUD with table     |
| 8 SP         | 3–5 days             | Very complex       | OAuth integration           |
| 13 SP        | 1–2 weeks            | Needs breakdown!   | Break into smaller tickets  |

> ⚠️ **Rule:** Agar ticket 8 SP se zyada lag raha hai, usse tod do smaller tickets mein.

---

## 🔗 Linked Documents

| Document              | Link                          |
|-----------------------|-------------------------------|
| 📋 PRD                 | `Prd.md`                      |
| 🎨 Frontend Spec       | `FRONTEND_SPEC.md`            |
| 🔌 API Documentation   | `API.md`                      |
| ✅ Acceptance Report   | `ACCEPTANCE_REPORT.md`        |
| 📝 PRD Closure         | `PRD_CLOSURE.md`              |

---

*Last Updated By: [Name] | Sprint: [Sprint Number] | Total Tickets: [XX]*
