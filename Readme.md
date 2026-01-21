# Doc Approval Service

A lightweight backend service that allows a writer to upload a document, automatically parse its title, content, and optional image reference, and prepare it for an approval workflow.

This project is built as part of an SDE Internship assignment and focuses on **clear separation of concerns, correctness, and simplicity**, as required by the problem statement.

---

## Current Status

✅ **Implemented**

* Document upload via API
* Parsing service for `.txt`, `.md`, and `.docx` files
* Robust parsing logic for title, content, and optional image reference
* Error handling for invalid and edge cases
* Manual verification via API route

⏳ **Upcoming**

* Submission & approval workflow
* Email notifications to manager
* JSON-based persistence
* Minimal UI
* Unit tests

---

## Tech Stack

* **Node.js**
* **Express**
* **TypeScript**
* **Multer** (file uploads)
* **Mammoth** (DOCX text extraction)

No database is used at this stage, as per assignment guidelines.

---

## Project Structure (so far)

```
src/
 ├── services/
 │    └── parser.service.ts     # Core document parsing logic
 ├── routes/
 │    └── parser.route.ts       # Temporary route to test parser
 ├── app.ts / server.ts
```

---

## Document Parsing Rules

The parsing logic follows the assignment specification exactly:

1. Supported file types:

   * `.txt`
   * `.md`
   * `.docx`

2. Parsing rules:

   * The **first meaningful line** is treated as the title.
   * If the **first line is an image reference**:

     * Markdown: `![caption](image.png)`
     * Or a URL
     * Then it is treated as an optional image reference.
     * The **next line becomes the title**.
   * All remaining lines are treated as content.

3. Validation:

   * Empty documents are rejected.
   * Documents without a valid title are rejected.
   * Documents without content are rejected.

---

## API Endpoint (Parser Test Route)

This is a **temporary route** used to manually verify parsing logic.

### `POST /api/parse`

**Request**

* `multipart/form-data`
* Field name: `file`
* Upload a `.txt`, `.md`, or `.docx` file

**Response (example)**

```json
{
  "title": "My Blog Title",
  "content": "This is the body of the document",
  "image": "cover.png"
}
```

**Error response (example)**

```json
{
  "error": "Missing title"
}
```

---

## How to Run Locally

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
  The assignment explicitly allows in-memory or JSON-based storage. At this stage, data persistence is not required.

* **Parser as a service**:
  The document parser is implemented as a standalone service to keep upload logic, parsing logic, and workflow logic clearly separated.

* **Strict validation**:
  The parser fails fast on invalid input to avoid corrupt or incomplete data entering the system.

---

## Future Improvements

* Add JSON-based persistence for submissions
* Implement approval workflow (pending → approved/rejected)
* Add email notifications using SMTP
* Add unit tests for parser and workflow logic
* Add minimal UI for writer and manager roles
* Replace JSON storage with a transactional database if concurrency becomes a concern

---

