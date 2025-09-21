// Prosta aplikacja do przeglądania dokumentacji projektowej
const docs = [
  {
    title: "Rekomendacje Claude",
    filename: "claude_full_review.md"
  }
];

const docsList = document.getElementById('docs-list');
const docContent = document.getElementById('doc-content');

function renderDocsList() {
  docsList.innerHTML = docs.map((doc, idx) =>
    `<button onclick="loadDoc(${idx})">${doc.title}</button>`
  ).join(' ');
}

function loadDoc(idx) {
  fetch(docs[idx].filename)
    .then(res => res.text())
    .then(md => {
      docContent.innerHTML = `<h2>${docs[idx].title}</h2><pre style='white-space:pre-wrap'>${md}</pre>`;
    });
}

renderDocsList();
loadDoc(0);
