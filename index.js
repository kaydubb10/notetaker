const newNoteBtn = document.getElementById('new-note-btn');
const saveNoteBtn = document.getElementById('save-note-btn');
const notesList = document.getElementById('notes');
const noteTitle = document.getElementById('note-title');
const noteText = document.getElementById('note-text');

let activeNote = {};

// Fetches notes from the server and displays them in the notes list
const getNotes = () => {
  return fetch('/api/notes')
    .then((res) => res.json())
    .then((data) => {
      let notes = '';
      if (data.length > 0) {
        notes = data
          .map(
            (note) =>
              `<li class="note" data-id=${note.id}><div><strong>${note.title}</strong></div><div>${note.text}</div><div><button class="delete-note-btn">x</button></div></li>`
          )
          .join('');
      }
      notesList.innerHTML = notes;
    });
};

// Sets the activeNote to an empty object and allows the user to enter a new note
const handleNewNoteClick = () => {
  activeNote = {};
  noteTitle.value = '';
  noteText.value = '';
  saveNoteBtn.classList.remove('hidden');
};

// Sets the activeNote to the selected note and displays its title and text in the input fields
const handleNoteSelect = (event) => {
  const note = event.target.closest('.note');
  if (note) {
    const id = parseInt(note.dataset.id);
    activeNote = { id };
    noteTitle.value = note.querySelector('strong').innerText;
    noteText.value = note.querySelector('div:nth-child(2)').innerText;
    saveNoteBtn.classList.remove('hidden');
  }
};

// Saves the activeNote to the server and updates the notes list
const handleNoteSave = () => {
  const title = noteTitle.value.trim();
  const text = noteText.value.trim();

  if (title && text) {
    activeNote.title = title;
    activeNote.text = text;

    fetch('/api/notes', {
      method: activeNote.id ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activeNote),
    })
      .then((res) => res.json())
      .then(() => {
        activeNote = {};
        noteTitle.value = '';
        noteText.value = '';
        saveNoteBtn.classList.add('hidden');
        getNotes();
      });
  }
};

// Deletes the selected note from the server and updates the notes list
const handleNoteDelete = (event) => {
  event.stopPropagation();
  const note = event.target.closest('.note');
  if (note) {
    const id = parseInt(note.dataset.id);
    fetch(`/api/notes/${id}`, {
      method: 'DELETE',
    }).then(() => getNotes());
  }
};

// Initializes the app by fetching the notes and adding event listeners
const init = () => {
  getNotes();
  newNoteBtn.addEventListener('click', handleNewNoteClick);
  saveNoteBtn.addEventListener('click', handleNoteSave);
  notesList.addEventListener('click', handleNoteSelect);
  notesList.addEventListener('click', handleNoteDelete);

  // Hide save button initially
  saveNoteBtn.classList.add('hidden');

  // Set focus to note title input field
  noteTitle.focus();

  // Handle form submission
  const noteForm = document.querySelector('.new-note form');
  noteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    handleNoteSave();
  });
};

init();
