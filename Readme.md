
# Doc Approval Service

A lightweight backend service that allows a writer to upload a document, automatically parse its title, content, and optional image reference, and submit it for manager approval.
The manager receives an email with a summary and can approve or reject the submission via links.

This project is built as part of an **SDE Internship Assignment**, focusing on correctness, clean workflow logic, and simplicity over overengineering.

---

## Features Implemented

### ✅ Document Upload & Parsing

* Supports `.txt`, `.md`, and `.docx` files
* Automatically extracts:

  * **Title**
  * **Content**
  * **Optional image reference** (only if present as the first line)
* Validates:

  * Empty documents
  * Missing title
  * Missing content

---

### ✅ Authentication (Hardcoded)

* Stateless **Basic Auth**
* Two roles:

  * **Writer**
  * **Manager**
* Credentials are hardcoded as per assignment requirements
* No sessions, no JWT, no database-backed auth

---

### ✅ Workflow & State Management

Posts follow a strict workflow:

```
DRAFT → PENDING → APPROVED / REJECTED
```

* Upload creates a post in `DRAFT`
* Submit moves post to `PENDING`
* Manager can only approve/reject `PENDING` posts
* Invalid state transitions are rejected

---

### ✅ JSON-based Persistence

* No database used (as required by assignment)
* Posts are stored in a local JSON file
* Data persists across server restarts

---

### ✅ Email Notification

* When a post is submitted:

  * Manager receives an email with:

    * Post title
    * Content snippet (first 100 characters)
    * Approve link
    * Reject link
* Uses **Gmail SMTP**
* If SMTP credentials are not provided (e.g. in hosted environments),
the service logs the approve/reject links to the console instead.
This keeps the workflow testable without requiring email setup.


---

### ✅ Manager Approval / Rejection

* Manager-only routes:

  * Approve a post
  * Reject a post
* Triggered via email links
* Updates post status in JSON storage

---

### ✅ Basic Tests

* One unit test for document parser
* One test covering workflow state transition logic

---

## What I Focused On

- Correct interpretation of requirements
- Clean separation of responsibilities
- Strict workflow enforcement
- Minimal but robust authentication
- Avoiding unnecessary infrastructure

---

## Tech Stack

* **Node.js**
* **Express**
* **TypeScript**
* **Multer** (file uploads)
* **Mammoth** (DOCX parsing)
* **Nodemailer** (email)
* **UUID** (post IDs)

No database or external services beyond SMTP.

---

## Project Structure

```
src/
 ├── controllers/
 │    ├── auth.controller.ts
 │    └── post.controller.ts
 ├── middlewares/
 │    ├── auth.ts
 │    └── requireRole.ts
 ├── routes/
 │    ├── auth.routes.ts
 │    └── post.routes.ts
 ├── services/
 │    ├── email.service.ts
 │    ├── parser.service.ts
 │    ├── post-workflow.service.ts
 │    └── storage.service.ts
 ├── storage/
 │    ├── post.json
 │    └── users.ts
 ├── types/
 │    └── posts.ts
 ├── utils/
 ├── app.ts
 └── server.ts
tests/
 ├── parser.test.ts
 └── workflow.test.ts

```

---

## API Overview

### Writer APIs

#### Upload Document

```
POST /api/posts/create
```

* Auth: Writer
* Creates a post in `DRAFT` state

#### Submit for Approval

```
POST /api/posts/:id/submit
```

* Auth: Writer
* Moves post from `DRAFT → PENDING`
* Triggers email to manager

---

### Manager APIs

#### Approve Post

```
GET /api/posts/approve?post_id=ID
```

#### Reject Post

```
GET /api/posts/reject?post_id=ID
```

* Auth: Manager
* Only works for `PENDING` posts

---

## Authentication Details

Authentication is implemented using **stateless Basic Auth** with hardcoded credentials.

### Credentials

| Role    | Username | Password   |
| ------- | -------- | ---------- |
| Writer  | writer1   | writer123  |
| Manager | manager1  | manager123 |

The client stores credentials and sends them in the `Authorization` header with every request.
The backend does not maintain any session state.

---

## Environment Setup

Create a `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_app_password
MANAGER_EMAIL=manager@gmail.com
BASE_URL=http://localhost:3000
```

---

## Running Locally

```bash
npm install
npm run dev
```

Server runs on:

```
http://localhost:3000
```

---


## Email Approval Flow

Approve and Reject actions are performed via clickable links sent in email.

When a manager clicks an approval/rejection link:
1. The browser triggers a Basic Authentication prompt
2. Manager enters credentials
3. The request is retried with Authorization headers
4. The post status is updated
5. A simple success response is returned

This avoids frontend complexity while keeping the approval flow secure and auditable.


## Design Decisions

* **No database**:
  JSON storage was chosen to match assignment constraints and avoid unnecessary infrastructure.

* **Stateless authentication**:
  Basic Auth with hardcoded credentials keeps the system simple and predictable.

* **Strict workflow enforcement**:
  Explicit state transitions prevent accidental overwrites or invalid actions.

* **Clear separation of concerns**:
  Parsing, storage, workflow, email, and auth are isolated into dedicated modules.

---

## Future Improvements

* Replace JSON storage with a transactional database
* Add proper authentication and authorization
* Add UI for writer and manager roles
* Improve test coverage
* Add retry handling for email delivery

## One Thing I’d Improve

Given more time, I would add a minimal manager-facing UI
to preview the full document before approval, instead of
approving based only on the email summary. This would improve
usability while keeping the backend workflow unchanged.


---

## Author

**Abhishek Barik**
SDE Internship Assignment Project

---

