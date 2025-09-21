// Display apps in the grid
function displayApps() {
    if (!elements.appsGrid || !elements.emptyState) return;
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
                <div class="thumbnail-icon">${thumbnailIcons[app.thumbnail] || thumbnailIcons.default}</div>
            </div>
            <div class="app-info">
                <h3 class="app-title">${escapeHtml(app.name)}</h3>
                <p class="app-description">${escapeHtml(app.description)}</p>
                <div class="app-meta">
                    <span class="app-date">${formatDate(app.last_modified)}</span>
                    <span class="app-status ${app.status === 'aktywna' ? 'active' : 'inactive'}">${app.status}</span>
                </div>
            </div>
            <div class="app-actions">
                <button class="btn btn--primary app-open-btn" data-url="${escapeHtml(app.url)}">🚀 Otwórz</button>
                <button class="btn btn--secondary app-edit-btn" data-id="${app.id}">✏️ Edytuj</button>
                <div class="app-actions-secondary">
                    <button class="btn btn--outline app-toggle-btn" data-id="${app.id}">${app.status === 'aktywna' ? '⏸️ Dezaktywuj' : '▶️ Aktywuj'}</button>
                    <button class="btn btn--danger app-delete-btn" data-id="${app.id}">🗑️ Usuń</button>
                </div>
            </div>
        </div>
    `).join('');

    addAppCardEventListeners();
}

function addAppCardEventListeners() {
    document.querySelectorAll('.app-open-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = e.currentTarget.dataset.url;
            openApp(url);
        });
    });
    document.querySelectorAll('.app-edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(e.currentTarget.dataset.id);
            editApp(id);
        });
    });
    document.querySelectorAll('.app-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(e.currentTarget.dataset.id);
            toggleAppStatus(id);
        });
    });
    document.querySelectorAll('.app-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(e.currentTarget.dataset.id);
            deleteApp(id);
        });
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text = '') {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

function formatDate(dateString) {
    try { const date = new Date(dateString); return date.toLocaleDateString('pl-PL'); } catch { return dateString; }
}

function updateResultsCount() {
    if (!elements.resultsCount) return;
    const count = filteredApps.length;
    let countText;
    if (count === 1) countText = '1 aplikacja';
    else if (count < 5) countText = `${count} aplikacje`;
    else countText = `${count} aplikacji`;
    elements.resultsCount.textContent = countText;
}

function updateStatistics() {
    if (!elements.totalApps || !elements.activeApps || !elements.inactiveApps) return;
    const total = apps.length;
    const active = apps.filter(app => app.status === 'aktywna').length;
    const inactive = total - active;
    elements.totalApps.textContent = total;
    elements.activeApps.textContent = active;
    elements.inactiveApps.textContent = inactive;
}

function showModal(type) {
    if (type === 'add' && elements.addAppModal) {
        elements.addAppModal.classList.remove('hidden');
        elements.addAppForm?.reset?.();
    } else if (type === 'edit' && elements.editAppModal) {
        elements.editAppModal.classList.remove('hidden');
    }
    document.body.style.overflow = 'hidden';
}

function hideModal(type) {
    if (type === 'add' && elements.addAppModal) {
        elements.addAppModal.classList.add('hidden');
    } else if (type === 'edit' && elements.editAppModal) {
        elements.editAppModal.classList.add('hidden');
    }
    document.body.style.overflow = '';
}

function handleAddApp(e) {
    e.preventDefault();
    const newApp = {
        id: Date.now(),
        name: document.getElementById('appName')?.value.trim(),
        description: document.getElementById('appDescription')?.value.trim(),
        category: document.getElementById('appCategory')?.value,
        url: document.getElementById('appUrl')?.value.trim(),
        thumbnail: document.getElementById('appThumbnail')?.value.trim() || 'default.png',
        status: 'aktywna',
        last_modified: new Date().toISOString().split('T')[0]
    };
    if (!newApp.name || !newApp.description || !newApp.category || !newApp.url) { showNotification('Proszę wypełnić wszystkie wymagane pola!', 'error'); return; }
    apps.push(newApp);
    saveAppsToStorage();
    filterAndDisplayApps();
    updateStatistics();
    hideModal('add');
    showNotification('Aplikacja została dodana pomyślnie!', 'success');
}

function handleEditApp(e) {
    e.preventDefault();
    const appId = parseInt(document.getElementById('editAppId')?.value);
    const appIndex = apps.findIndex(app => app.id === appId);
    if (appIndex !== -1) {
        const updatedApp = {
            ...apps[appIndex],
            name: document.getElementById('editAppName')?.value.trim(),
            description: document.getElementById('editAppDescription')?.value.trim(),
            category: document.getElementById('editAppCategory')?.value,
            url: document.getElementById('editAppUrl')?.value.trim(),
            thumbnail: document.getElementById('editAppThumbnail')?.value.trim() || apps[appIndex].thumbnail,
            status: document.getElementById('editAppStatus')?.value,
            last_modified: new Date().toISOString().split('T')[0]
        };
        if (!updatedApp.name || !updatedApp.description || !updatedApp.category || !updatedApp.url) { showNotification('Proszę wypełnić wszystkie wymagane pola!', 'error'); return; }
        apps[appIndex] = updatedApp;
        saveAppsToStorage();
        filterAndDisplayApps();
        updateStatistics();
        hideModal('edit');
        showNotification('Aplikacja została zaktualizowana!', 'success');
    }
}

function openApp(url) { if (url) { window.open(url, '_blank'); showNotification('Otwieranie aplikacji w nowej karcie...', 'info'); } else { showNotification('Błąd: Brak URL aplikacji!', 'error'); } }

function editApp(id) {
    const app = apps.find(app => app.id === id);
    if (app) {
        document.getElementById('editAppId').value = app.id;
        document.getElementById('editAppName').value = app.name;
        document.getElementById('editAppDescription').value = app.description;
        document.getElementById('editAppCategory').value = app.category;
        document.getElementById('editAppUrl').value = app.url;
        document.getElementById('editAppThumbnail').value = app.thumbnail;
        document.getElementById('editAppStatus').value = app.status;
        showModal('edit');
    }
}

function toggleAppStatus(id) {
    const appIndex = apps.findIndex(app => app.id === id);
    if (appIndex !== -1) {
        const newStatus = apps[appIndex].status === 'aktywna' ? 'nieaktywna' : 'aktywna';
        apps[appIndex].status = newStatus;
        apps[appIndex].last_modified = new Date().toISOString().split('T')[0];
        saveAppsToStorage();
        filterAndDisplayApps();
        updateStatistics();
        showNotification(`Aplikacja została ${newStatus === 'aktywna' ? 'aktywowana' : 'dezaktywowana'}!`, 'info');
    }
}

function deleteApp(id) {
    const app = apps.find(app => app.id === id);
    if (app && confirm(`Czy na pewno chcesz usunąć aplikację "${app.name}"?`)) {
        apps = apps.filter(app => app.id !== id);
        saveAppsToStorage();
        filterAndDisplayApps();
        updateStatistics();
        showNotification('Aplikacja została usunięta!', 'error');
    }
}

function exportApps() {
    try {
        const dataStr = JSON.stringify(apps, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `moje-aplikacje-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showNotification('Lista aplikacji została wyeksportowana!', 'success');
    } catch (e) {
        console.error('Export error:', e);
        showNotification('Błąd podczas eksportu aplikacji!', 'error');
    }
}

function showNotification(message, type = 'info') {
    document.querySelectorAll('.notification').forEach(n => n.remove());
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `${escapeHtml(message)} <button class="notification-close">✕</button>`;
    notification.style.cssText = `position: fixed; top: 20px; right: 20px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-base); padding: var(--space-12) var(--space-16); box-shadow: var(--shadow-lg); z-index: 1001; display: flex; align-items: center; gap: var(--space-12); max-width: 400px; opacity: 0; transform: translateX(100%); transition: all var(--duration-normal) var(--ease-standard); font-size: var(--font-size-sm); color: var(--color-text);`;
    if (type === 'success') { notification.style.borderColor = 'var(--color-success)'; notification.style.backgroundColor = 'rgba(var(--color-success-rgb), 0.1)'; }
    else if (type === 'error') { notification.style.borderColor = 'var(--color-error)'; notification.style.backgroundColor = 'rgba(var(--color-error-rgb), 0.1)'; }
    else if (type === 'info') { notification.style.borderColor = 'var(--color-info)'; notification.style.backgroundColor = 'rgba(var(--color-info-rgb), 0.1)'; }
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `background: none; border: none; cursor: pointer; font-size: var(--font-size-sm); color: var(--color-text-secondary); padding: var(--space-2); border-radius: var(--radius-sm); transition: background-color var(--duration-fast) var(--ease-standard);`;
    closeBtn.addEventListener('click', () => { removeNotification(notification); });
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
        setTimeout(() => { if (notification.parentNode) notification.parentNode.removeChild(notification); }, 300);
    }
}

document.addEventListener('DOMContentLoaded', init);

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); elements.searchInput?.focus?.(); }
    if (e.key === 'Escape') {
        if (elements.addAppModal && !elements.addAppModal.classList.contains('hidden')) hideModal('add');
        if (elements.editAppModal && !elements.editAppModal.classList.contains('hidden')) hideModal('edit');
        const addCat = document.getElementById('addCategoryModal');
        if (addCat && !addCat.classList.contains('hidden')) hideAddCategoryModal();
    }
});

document.addEventListener('visibilitychange', () => { if (!document.hidden) { filterAndDisplayApps(); updateStatistics(); } });
