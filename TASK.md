# Build a Notes App

Use plain HTML, CSS, and JavaScript with Vite.
Use localStorage for persistence. No backend.
Implement the required features only; omit Markdown and dates.

## Interface

- A list of saved notes.
- Inputs labelled "Title" and "Body".
- "New note" and "Save" buttons.
- An "Edit" and "Delete" action for each saved note.
- Both title and body are required.
- A readable layout on desktop and mobile.

## Acceptance criteria

A1. Create a note titled "Shopping" with body "Milk".
    Saving displays it in the note list.

A2. Edit its body to "Milk and eggs".
    Saving updates that note without creating a duplicate.

A3. Delete one note.
    It disappears; other notes remain unchanged.

A4. Saved content survives page reload and closing/reopening
    the browser with the same browser profile and app URL.
    Edits persist, and deleted notes stay deleted.

A5. Saving a blank or whitespace-only title/body shows validation
    and does not create a note.

A6. Text such as "<b>Milk</b>" displays literally, without becoming HTML.

## Deliverables

- Working application.
- Playwright browser tests covering A1–A6.
- npm run dev: start Vite at http://127.0.0.1:5173,
  using strict port mode.
- npm run build: produce the production build.
- npm test: run Chromium tests once and exit.
- Playwright configuration that starts/stops its own test server.
- README.md explaining installation, running, and testing.
- .gitignore covering dependencies, build output, and test artifacts.
