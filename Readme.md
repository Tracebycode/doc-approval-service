
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
* If SMTP is unavailable, behavior can be logged (documented in code)

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
 │    ├── post.controller.ts
 │    ├── submit.controller.ts
 │    └── approval.controller.ts
 ├── services/
 │    ├── parser.service.ts
 │    ├── storage.service.ts
 │    └── email.service.ts
 ├── middleware/
 │    └── auth.ts
 ├── routes/
 │    ├── posts.route.ts
 │    └── manager.route.ts
 ├── storage/
 │    └── posts.json
 ├── types/
 │    └── posts.ts
 ├── tests/
 │    ├── parser.test.ts
 │    └── workflow.test.ts
 └── app.ts
```

---

## API Overview

### Writer APIs

#### Upload Document

```
POST /api/posts/upload
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
| Writer  | writer   | writer123  |
| Manager | manager  | manager123 |

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
BASE_URL=http://localhost:8000
```

---

## Running Locally

```bash
npm install
npm run dev
```

Server runs on:

```
http://localhost:8000
```

---

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

---

## Author

**Abhishek Barik**
SDE Internship Assignment Project

---

