// Panel aplikacji AI – dynamiczne ładowanie z apps.json
let apps = [];
let filteredApps = [];
let currentFilter = 'all';
let currentCategory = 'all';
let currentSort = 'name';
let searchTerm = '';

const elements = {
	appsGrid: document.getElementById('appsGrid'),
	searchInput: document.getElementById('searchInput'),
	sortSelect: document.getElementById('sortSelect'),
	resultsCount: document.getElementById('resultsCount'),
	emptyState: document.getElementById('emptyState'),
	totalApps: document.getElementById('totalApps'),
	activeApps: document.getElementById('activeApps'),
	inactiveApps: document.getElementById('inactiveApps'),
	addAppModal: document.getElementById('addAppModal'),
	editAppModal: document.getElementById('editAppModal'),
	addAppBtn: document.getElementById('addAppBtn'),
	closeModal: document.getElementById('closeModal'),
	closeEditModal: document.getElementById('closeEditModal'),
	cancelBtn: document.getElementById('cancelBtn'),
	cancelEditBtn: document.getElementById('cancelEditBtn'),
	addAppForm: document.getElementById('addAppForm'),
	editAppForm: document.getElementById('editAppForm'),
	exportBtn: document.getElementById('exportBtn')
};

const thumbnailIcons = {
	'calculator.png': '🧮',
	'todo.png': '📝',
	'currency.png': '💱',
	'game.png': '🎮',
	'slides.png': '📊',
	'password.png': '🔐',
	'chart.png': '📈',
	'quiz.png': '❓',
	'default': '📱'
};

const categoryIcons = {
	'narzędzia': '🔧',
	'gry': '🎮',
	'prezentacje': '📊'
};

function init() {
	fetch('apps.json')
		.then(res => res.json())
		.then(data => {
			apps = data;
			filterAndDisplayApps();
			updateStatistics();
		})
		.catch(() => {
			apps = [];
			filterAndDisplayApps();
			updateStatistics();
		});
	setupEventListeners();
}

function setupEventListeners() {
	let searchTimeout;
	elements.searchInput.addEventListener('input', (e) => {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			searchTerm = e.target.value.toLowerCase().trim();
			filterAndDisplayApps();
		}, 300);
	});
	elements.sortSelect.addEventListener('change', (e) => {
		currentSort = e.target.value;
		filterAndDisplayApps();
	});
	document.querySelectorAll('.filter-btn').forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
			e.target.classList.add('active');
			currentFilter = e.target.dataset.filter;
			filterAndDisplayApps();
		});
	});
	document.querySelectorAll('.category-btn').forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
			e.target.classList.add('active');
			currentCategory = e.target.dataset.category;
			filterAndDisplayApps();
		});
	});
	if (elements.addAppBtn) elements.addAppBtn.addEventListener('click', () => showModal('add'));
	if (elements.closeModal) elements.closeModal.addEventListener('click', () => hideModal('add'));
	if (elements.closeEditModal) elements.closeEditModal.addEventListener('click', () => hideModal('edit'));
	if (elements.cancelBtn) elements.cancelBtn.addEventListener('click', () => hideModal('add'));
	if (elements.cancelEditBtn) elements.cancelEditBtn.addEventListener('click', () => hideModal('edit'));
	if (elements.addAppForm) elements.addAppForm.addEventListener('submit', handleAddApp);
	if (elements.editAppForm) elements.editAppForm.addEventListener('submit', handleEditApp);
	if (elements.exportBtn) elements.exportBtn.addEventListener('click', exportApps);
	if (elements.addAppModal) elements.addAppModal.addEventListener('click', (e) => { if (e.target === elements.addAppModal || e.target.classList.contains('modal-backdrop')) hideModal('add'); });
	if (elements.editAppModal) elements.editAppModal.addEventListener('click', (e) => { if (e.target === elements.editAppModal || e.target.classList.contains('modal-backdrop')) hideModal('edit'); });
}

function filterAndDisplayApps() {
	filteredApps = [...apps];
	if (searchTerm) {
		filteredApps = filteredApps.filter(app =>
			app.name.toLowerCase().includes(searchTerm) ||
			app.description.toLowerCase().includes(searchTerm) ||
			app.category.toLowerCase().includes(searchTerm)
		);
	}
	if (currentFilter !== 'all') {
		if (currentFilter === 'recent') {
			const recentDate = new Date();
			recentDate.setDate(recentDate.getDate() - 30);
			filteredApps = filteredApps.filter(app => new Date(app.last_modified) >= recentDate);
		} else {
			filteredApps = filteredApps.filter(app => app.status === currentFilter);
		}
	}
	if (currentCategory !== 'all') {
		filteredApps = filteredApps.filter(app => app.category === currentCategory);
	}
	filteredApps.sort((a, b) => {
		switch (currentSort) {
			case 'name': return a.name.localeCompare(b.name, 'pl');
			case 'date': return new Date(b.last_modified) - new Date(a.last_modified);
			case 'category': return a.category.localeCompare(b.category, 'pl');
			default: return 0;
		}
	});
	displayApps();
	updateResultsCount();
}

function displayApps() {
	if (filteredApps.length === 0) {
		elements.appsGrid.style.display = 'none';
		elements.emptyState.classList.remove('hidden');
		return;
	}
	elements.appsGrid.style.display = 'grid';
	elements.emptyState.classList.add('hidden');
	elements.appsGrid.innerHTML = filteredApps.map(app => `
		<div class="app-card" data-id="${app.id}">
			<div class="app-thumbnail">
				<div class="thumbnail-icon">
					${thumbnailIcons[app.thumbnail] || thumbnailIcons.default}
				</div>
			</div>
			<div class="app-info">
				<h3 class="app-title">${escapeHtml(app.name)}</h3>
				<p class="app-description">${escapeHtml(app.description)}</p>
				<div class="app-meta">
					<span class="app-date">${formatDate(app.last_modified)}</span>
					<span class="app-status ${app.status === 'aktywna' ? 'active' : 'inactive'}">
						${app.status}
					</span>
				</div>
			</div>
			<div class="app-actions">
				<button class="btn btn--primary app-open-btn" data-url="${escapeHtml(app.url)}">
					🚀 Otwórz
				</button>
				<button class="btn btn--secondary app-edit-btn" data-id="${app.id}">
					✏️ Edytuj
				</button>
			</div>
		</div>
	`).join('');
	addAppCardEventListeners();
}

function addAppCardEventListeners() {
	document.querySelectorAll('.app-open-btn').forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			const url = e.target.dataset.url;
			openApp(url);
		});
	});
	document.querySelectorAll('.app-edit-btn').forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			const id = parseInt(e.target.dataset.id);
			editApp(id);
		});
	});
}

function escapeHtml(text) {
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function formatDate(dateString) {
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString('pl-PL');
	} catch (e) {
		return dateString;
	}
}

function updateResultsCount() {
	const count = filteredApps.length;
	let countText;
	if (count === 1) countText = '1 aplikacja';
	else if (count < 5) countText = `${count} aplikacje`;
	else countText = `${count} aplikacji`;
	elements.resultsCount.textContent = countText;
}

function updateStatistics() {
	const total = apps.length;
	const active = apps.filter(app => app.status === 'aktywna').length;
	const inactive = total - active;
	elements.totalApps.textContent = total;
	elements.activeApps.textContent = active;
	elements.inactiveApps.textContent = inactive;
}

function showModal(type) {
	if (type === 'add') {
		elements.addAppModal.classList.remove('hidden');
		if (elements.addAppForm) elements.addAppForm.reset();
	} else if (type === 'edit') {
		elements.editAppModal.classList.remove('hidden');
	}
	document.body.style.overflow = 'hidden';
}

function hideModal(type) {
	if (type === 'add') elements.addAppModal.classList.add('hidden');
	else if (type === 'edit') elements.editAppModal.classList.add('hidden');
	document.body.style.overflow = '';
}

function handleAddApp(e) {
	e.preventDefault();
	// ...tu można dodać obsługę dodawania do pliku apps.json przez backend/API...
	showNotification('Dodawanie nowych aplikacji wymaga backendu!', 'error');
}

function handleEditApp(e) {
	e.preventDefault();
	showNotification('Edycja aplikacji wymaga backendu!', 'error');
}

function openApp(url) {
	if (url) {
		window.open(url, '_blank');
		showNotification('Otwieranie aplikacji w nowej karcie...', 'info');
	} else {
		showNotification('Błąd: Brak URL aplikacji!', 'error');
	}
}

function editApp(id) {
	showNotification('Edycja aplikacji wymaga backendu!', 'info');
}

function exportApps() {
	showNotification('Eksport wymaga backendu!', 'info');
}

function showNotification(message, type = 'info') {
	document.querySelectorAll('.notification').forEach(n => n.remove());
	const notification = document.createElement('div');
	notification.className = `notification notification--${type}`;
	notification.innerHTML = `<span>${escapeHtml(message)}</span><button class="notification-close">✕</button>`;
	notification.style.cssText = `position: fixed;top: 20px;right: 20px;background: var(--color-surface);border: 1px solid var(--color-border);border-radius: var(--radius-base);padding: var(--space-12) var(--space-16);box-shadow: var(--shadow-lg);z-index: 1001;display: flex;align-items: center;gap: var(--space-12);max-width: 400px;opacity: 0;transform: translateX(100%);transition: all var(--duration-normal) var(--ease-standard);font-size: var(--font-size-sm);color: var(--color-text);`;
	const closeBtn = notification.querySelector('.notification-close');
	closeBtn.style.cssText = `background: none;border: none;cursor: pointer;font-size: var(--font-size-sm);color: var(--color-text-secondary);padding: var(--space-2);border-radius: var(--radius-sm);transition: background-color var(--duration-fast) var(--ease-standard);`;
	closeBtn.addEventListener('click', () => removeNotification(notification));
	closeBtn.addEventListener('mouseenter', () => { closeBtn.style.backgroundColor = 'var(--color-secondary)'; });
	closeBtn.addEventListener('mouseleave', () => { closeBtn.style.backgroundColor = 'transparent'; });
	document.body.appendChild(notification);
	setTimeout(() => { notification.style.opacity = '1'; notification.style.transform = 'translateX(0)'; }, 10);
	setTimeout(() => { removeNotification(notification); }, 4000);
}

function removeNotification(notification) {
	if (notification && notification.parentNode) {
		notification.style.opacity = '0';
		notification.style.transform = 'translateX(100%)';
		setTimeout(() => {
			if (notification.parentNode) notification.parentNode.removeChild(notification);
		}, 300);
	}
}

document.addEventListener('DOMContentLoaded', init);
