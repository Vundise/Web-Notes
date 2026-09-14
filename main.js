const STORAGE_KEY = 'agent-notes';

const form = document.querySelector('#note-form');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const titleError = document.querySelector('#title-error');
const bodyError = document.querySelector('#body-error');
const editorHeading = document.querySelector('#editor-heading');
const newNoteButton = document.querySelector('#new-note');
const notesList = document.querySelector('#notes-list');
const emptyState = document.querySelector('#empty-state');
const noteCount = document.querySelector('#note-count');

let notes = loadNotes();
let editingId = null;

function loadNotes() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function clearErrors() {
  titleError.textContent = '';
  bodyError.textContent = '';
  titleInput.removeAttribute('aria-invalid');
  bodyInput.removeAttribute('aria-invalid');
}

function resetEditor({ focus = false } = {}) {
  editingId = null;
  form.reset();
  clearErrors();
  editorHeading.textContent = 'New note';
  if (focus) titleInput.focus();
}

function startEditing(note) {
  editingId = note.id;
  titleInput.value = note.title;
  bodyInput.value = note.body;
  clearErrors();
  editorHeading.textContent = 'Edit note';
  titleInput.focus();
  editorHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderNotes() {
  notesList.replaceChildren();
  emptyState.hidden = notes.length > 0;
  noteCount.textContent = `${notes.length} ${notes.length === 1 ? 'note' : 'notes'}`;

  for (const note of notes) {
    const article = document.createElement('article');
    article.className = 'note-card';
    article.dataset.noteId = note.id;

    const title = document.createElement('h3');
    title.textContent = note.title;

    const body = document.createElement('p');
    body.className = 'note-body';
    body.textContent = note.body;

    const actions = document.createElement('div');
    actions.className = 'note-actions';

    const editButton = document.createElement('button');
    editButton.className = 'text-button';
    editButton.type = 'button';
    editButton.textContent = 'Edit';
    editButton.setAttribute('aria-label', `Edit ${note.title}`);
    editButton.addEventListener('click', () => startEditing(note));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'text-button danger';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete ${note.title}`);
    deleteButton.addEventListener('click', () => {
      notes = notes.filter((savedNote) => savedNote.id !== note.id);
      saveNotes();
      if (editingId === note.id) resetEditor();
      renderNotes();
    });

    actions.append(editButton, deleteButton);
    article.append(title, body, actions);
    notesList.append(article);
  }
}

function validate(title, body) {
  clearErrors();
  let valid = true;

  if (!title) {
    titleError.textContent = 'Title is required.';
    titleInput.setAttribute('aria-invalid', 'true');
    valid = false;
  }

  if (!body) {
    bodyError.textContent = 'Body is required.';
    bodyInput.setAttribute('aria-invalid', 'true');
    valid = false;
  }

  return valid;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!validate(title, body)) return;

  if (editingId) {
    notes = notes.map((note) => note.id === editingId ? { ...note, title, body } : note);
  } else {
    notes.push({ id: createId(), title, body });
  }

  saveNotes();
  resetEditor();
  renderNotes();
});

newNoteButton.addEventListener('click', () => resetEditor({ focus: true }));

renderNotes();
