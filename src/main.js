/*------ HTML references ------*/
let notesUList = document.getElementById('notes');
let addNoteForm = document.getElementById('add-note');
let addNoteTitle = addNoteForm['title'];
let addNoteContent = addNoteForm['content'];
let searchInput = document.getElementById('search')

let state = {}

function deleteNote(id) {

}

function renderNotes() {
  notesUList.innerHTML = ''

  let state = JSON.parse(JSON.stringify(state))
  let search = state.search
  let notes = state.notes

  // if (search) {
  //   notes = notes.filter(note => note.title.includes(search))
  // }

  // for (let note of notes) {
  //   notesUList.innerHTML += `
  //     <li>
  //       ${note.title} <button data-id="${note.id}">x</button>
  //       <p>${note.content}</p>
  //     </li>
  //   `
  // }

}


/* ------ Event Listeners ------ */
// function setDeleteNoteButtonsEventListeners() {
//   let buttons = document.querySelectorAll('ul#notes li button');

//   for (let button of buttons) {
//     button.addEventListener('click', () => {
//       deleteNote(button.dataset.id);
//     });
//   }
// }

addNoteForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let title = addNoteTitle.value
  let content = addNoteContent.value

  // Clear inputs
  addNoteTitle.value = ''
  addNoteContent.value = ''
});

/* ------ Render the initial Notes ------ */
renderNotes();
