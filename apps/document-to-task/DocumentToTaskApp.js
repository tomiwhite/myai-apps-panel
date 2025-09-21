// DocumentToTaskApp.js
// Aplikacja do generowania zadań z dokumentów

// Elementy DOM
const appRoot = document.getElementById('app-root');

// Tworzenie interfejsu
const container = document.createElement('div');
container.className = 'document-to-task-app';

const label = document.createElement('label');
label.textContent = 'Wklej treść dokumentu:';
label.setAttribute('for', 'document-input');

const textarea = document.createElement('textarea');
textarea.id = 'document-input';
textarea.rows = 10;
textarea.placeholder = 'Wklej tutaj treść dokumentu...';

const generateBtn = document.createElement('button');
generateBtn.textContent = 'Generuj zadania';
generateBtn.id = 'generate-tasks-btn';

const resultLabel = document.createElement('h2');
resultLabel.textContent = 'Wygenerowane zadania:';
resultLabel.style.display = 'none';

const resultArea = document.createElement('pre');
resultArea.id = 'tasks-result';
resultArea.style.display = 'none';

const copyBtn = document.createElement('button');
copyBtn.textContent = 'Kopiuj zadania';
copyBtn.id = 'copy-tasks-btn';
copyBtn.style.display = 'none';

container.appendChild(label);
container.appendChild(textarea);
container.appendChild(generateBtn);
container.appendChild(resultLabel);
container.appendChild(resultArea);
container.appendChild(copyBtn);
appRoot.appendChild(container);

// Funkcja generująca zadania (prosta symulacja)
function generateTasksFromDocument(text) {
    if (!text.trim()) return 'Brak treści dokumentu.';
    // Przykładowa logika: dziel na zdania i twórz zadania
    const sentences = text.split(/[.!?]\s+/);
    const tasks = sentences
        .filter(s => s.length > 10)
        .map((s, i) => `${i + 1}. ${s.trim()}`);
    return tasks.length ? tasks.join('\n') : 'Nie znaleziono zadań.';
}

// Obsługa kliknięcia "Generuj zadania"
generateBtn.addEventListener('click', () => {
    const docText = textarea.value;
    const tasks = generateTasksFromDocument(docText);
    resultArea.textContent = tasks;
    resultLabel.style.display = 'block';
    resultArea.style.display = 'block';
    copyBtn.style.display = tasks.startsWith('Nie znaleziono') || tasks.startsWith('Brak treści') ? 'none' : 'inline-block';
});

// Obsługa kopiowania
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(resultArea.textContent)
        .then(() => {
            copyBtn.textContent = 'Skopiowano!';
            setTimeout(() => { copyBtn.textContent = 'Kopiuj zadania'; }, 1500);
        });
});

console.log('DocumentToTaskApp uruchomiona!');
