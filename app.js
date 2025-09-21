function compareDatesDesc(a, b) {
  return new Date(b.last_modified) - new Date(a.last_modified);
}
  // Category filter
  if (currentCategory !== 'all') filteredApps = filteredApps.filter(a => a.category === currentCategory);
  // Search
  if (searchTerm) filteredApps = filteredApps.filter(a => (a.name + ' ' + a.description).toLowerCase().includes(searchTerm));
  // Sort
  if (currentSort === 'name') filteredApps.sort((a,b) => a.name.localeCompare(b.name, 'pl'));
  else if (currentSort === 'date') filteredApps.sort(compareDatesDesc);
  else if (currentSort === 'category') filteredApps.sort((a,b) => (a.category||'').localeCompare(b.category||'', 'pl'));
  displayApps();
  updateResultsCount();
}

function handleAddApp(e) {
  e.preventDefault();
  const newApp = {
    id: Date.now(),
    name: document.getElementById('appName')?.value?.trim(),
    description: document.getElementById('appDescription')?.value?.trim(),
    category: document.getElementById('appCategory')?.value,
    url: document.getElementById('appUrl')?.value?.trim(),
    thumbnail: document.getElementById('appThumbnail')?.value?.trim() || 'default.png',
    status: 'aktywna',
    last_modified: new Date().toISOString().split('T')[0]
  };
  if (!newApp.name || !newApp.description || !newApp.category || !newApp.url) { showNotification('Proszę wypełnić wszystkie wymagane pola!', 'error'); return; }
  apps.push(newApp);
  saveState();
  filterAndDisplayApps();
  updateStatistics();
  hideModal('add');
  showNotification('Aplikacja została dodana pomyślnie!', 'success');
}

function handleEditApp(e) {
  e.preventDefault();
  const appId = parseInt(document.getElementById('editAppId')?.value);
  const idx = apps.findIndex(a => a.id === appId);
  if (idx === -1) return;
  const updated = {
    ...apps[idx],
    name: document.getElementById('editAppName')?.value?.trim(),
    description: document.getElementById('editAppDescription')?.value?.trim(),
    category: document.getElementById('editAppCategory')?.value,
    url: document.getElementById('editAppUrl')?.value?.trim(),
    thumbnail: document.getElementById('editAppThumbnail')?.value?.trim() || apps[idx].thumbnail,
    status: document.getElementById('editAppStatus')?.value,
    last_modified: new Date().toISOString().split('T')[0]
  };
  if (!updated.name || !updated.description || !updated.category || !updated.url) { showNotification('Proszę wypełnić wszystkie wymagane pola!', 'error'); return; }
  apps[idx] = updated;
  saveState();
  filterAndDisplayApps();
  updateStatistics();
  hideModal('edit');
  showNotification('Aplikacja została zaktualizowana!', 'success');
}

function openApp(url) { if (url) { window.open(url, '_blank'); showNotification('Otwieranie aplikacji w nowej karcie...', 'info'); } else { showNotification('Błąd: Brak URL aplikacji!', 'error'); } }
function editApp(id) {
  const app = apps.find(a => a.id === id);
  if (!app) return;
  document.getElementById('editAppId').value = app.id;
  document.getElementById('editAppName').value = app.name;
  document.getElementById('editAppDescription').value = app.description;
  document.getElementById('editAppCategory').value = app.category;
  document.getElementById('editAppUrl').value = app.url;
  document.getElementById('editAppThumbnail').value = app.thumbnail;
  document.getElementById('editAppStatus').value = app.status;
  showModal('edit');
}
function toggleAppStatus(id) {
  const idx = apps.findIndex(a => a.id === id);
  if (idx === -1) return;
  const newStatus = apps[idx].status === 'aktywna' ? 'nieaktywna' : 'aktywna';
  apps[idx].status = newStatus;
  apps[idx].last_modified = new Date().toISOString().split('T')[0];
  saveState();
  filterAndDisplayApps();
  updateStatistics();
  showNotification(`Aplikacja została ${newStatus === 'aktywna' ? 'aktywowana' : 'dezaktywowana'}!`, 'info');
}
function deleteApp(id) {
  const app = apps.find(a => a.id === id);
  if (app && confirm(`Czy na pewno chcesz usunąć aplikację "${app.name}"?`)) {
    apps = apps.filter(a => a.id !== id);
    saveState();
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
