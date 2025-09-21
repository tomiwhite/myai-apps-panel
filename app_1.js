// Application state
let apps = [];
let filteredApps = [];
let currentFilter = 'all';
let currentCategory = 'all';
let currentSort = 'name';
let searchTerm = '';

// DOM elements
const elements = {
    appsGrid: document.getElementById('appsGrid'),
    searchInput: document.getElementById('searchInput'),
    sortSelect: document.getElementById('sortSelect'),
    resultsCount: document.getElementById('resultsCount'),
    emptyState: document.getElementById('emptyState'),
    totalApps: document.getElementById('totalApps'),
    activeApps: document.getElementById('activeApps'),
    inactiveApps: document.getElementById('inactiveApps'),
    
    // Modal elements
    addAppModal: document.getElementById('addAppModal'),
    editAppModal: document.getElementById('editAppModal'),
    addAppBtn: document.getElementById('addAppBtn'),
    closeModal: document.getElementById('closeModal'),
    closeEditModal: document.getElementById('closeEditModal'),
    cancelBtn: document.getElementById('cancelBtn'),
    cancelEditBtn: document.getElementById('cancelEditBtn'),
    addAppForm: document.getElementById('addAppForm'),
    editAppForm: document.getElementById('editAppForm'),
    
    // Export
    exportBtn: document.getElementById('exportBtn')
};

// Sample data
const sampleApps = [
    {
        "id": 1,
        "name": "Kalkulator BMI",
        "description": "Prosty kalkulator wskaźnika masy ciała",
        "category": "narzędzia",
        "url": "/apps/bmi-calculator/index.html",
        "status": "aktywna",
        "last_modified": "2025-09-15",
        "thumbnail": "calculator.png"
    },
    {
        "id": 2,
        "name": "Lista Zadań",
        "description": "Aplikacja do zarządzania zadaniami",
        "category": "narzędzia",
        "url": "/apps/todo-list/index.html",
        "status": "aktywna",
        "last_modified": "2025-09-10",
        "thumbnail": "todo.png"
    },
    {
        "id": 3,
        "name": "Konwerter Walut",
        "description": "Przelicznik walut z aktualnym kursem",
        "category": "narzędzia",
        "url": "/apps/currency/index.html",
        "status": "nieaktywna",
        "last_modified": "2025-08-20",
        "thumbnail": "currency.png"
    },
    {
        "id": 4,
        "name": "Gra Memory",
        "description": "Klasyczna gra w dopasowywanie par",
        "category": "gry",
        "url": "/apps/memory/index.html",
        "status": "aktywna",
        "last_modified": "2025-09-05",
        "thumbnail": "game.png"
    },
    {
        "id": 5,
        "name": "Prezentacja AI",
        "description": "Slajdy o zastosowaniu AI w biznesie",
        "category": "prezentacje",
        "url": "/apps/ai-slides/index.html",
        "status": "aktywna",
        "last_modified": "2025-09-12",
        "thumbnail": "slides.png"
    },
    {
        "id": 6,
        "name": "Generator Haseł",
        "description": "Narzędzie do generowania bezpiecznych haseł",
        "category": "narzędzia",
        "url": "/apps/password-gen/index.html",
        "status": "aktywna",
        "last_modified": "2025-09-08",
        "thumbnail": "password.png"
    },
    {
        "id": 7,
        "name": "Wykres Sprzedaży",
        "description": "Dashboard z wykresami sprzedaży",
        "category": "prezentacje",
        "url": "/apps/sales-chart/index.html",
        "status": "nieaktywna",
        "last_modified": "2025-08-15",
        "thumbnail": "chart.png"
    },
    {
        "id": 8,
        "name": "Quiz JavaScript",
        "description": "Interaktywny quiz o programowaniu",
        "category": "gry",
        "url": "/apps/js-quiz/index.html",
        "status": "aktywna",
        "last_modified": "2025-09-01",
        "thumbnail": "quiz.png"
    }
];

// Thumbnail icons mapping
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

// Category icons
const categoryIcons = {
    'narzędzia': '🔧',
    'gry': '🎮',
    'prezentacje': '📊'
};

// Initialize the application
function init() {
    loadAppsFromStorage();
    setupEventListeners();
    filterAndDisplayApps();
    updateStatistics();
}

// Load apps from localStorage or use sample data
function loadAppsFromStorage() {
    const storedApps = localStorage.getItem('htmlApps');
    if (storedApps) {
        try {
            apps = JSON.parse(storedApps);
        } catch (e) {
            console.error('Error parsing stored apps:', e);
            apps = [...sampleApps];
            saveAppsToStorage();
        }
    } else {
        apps = [...sampleApps];
        saveAppsToStorage();
    }
}

// Save apps to localStorage
function saveAppsToStorage() {
    try {
        localStorage.setItem('htmlApps', JSON.stringify(apps));
    } catch (e) {
        console.error('Error saving apps to storage:', e);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality - fixed debouncing
    let searchTimeout;
    elements.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchTerm = e.target.value.toLowerCase().trim();
            filterAndDisplayApps();
        }, 300);
    });
    
    // Sort functionality
    elements.sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterAndDisplayApps();
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            filterAndDisplayApps();
        });
    });
    
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            filterAndDisplayApps();
        });
    });
    
    // Modal functionality - ensure elements exist
    if (elements.addAppBtn) {
        elements.addAppBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal('add');
        });
    }
    
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal('add');
        });
    }
    
    if (elements.closeEditModal) {
        elements.closeEditModal.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal('edit');
        });
    }
    
    if (elements.cancelBtn) {
        elements.cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal('add');
        });
    }
    
    if (elements.cancelEditBtn) {
        elements.cancelEditBtn.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal('edit');
        });
    }
    
    // Form submissions
    if (elements.addAppForm) {
        elements.addAppForm.addEventListener('submit', handleAddApp);
    }
    
    if (elements.editAppForm) {
        elements.editAppForm.addEventListener('submit', handleEditApp);
    }
    
    // Export functionality
    if (elements.exportBtn) {
        elements.exportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            exportApps();
        });
    }
    
    // Click outside modal to close
    if (elements.addAppModal) {
        elements.addAppModal.addEventListener('click', (e) => {
            if (e.target === elements.addAppModal || e.target.classList.contains('modal-backdrop')) {
                hideModal('add');
            }
        });
    }
    
    if (elements.editAppModal) {
        elements.editAppModal.addEventListener('click', (e) => {
            if (e.target === elements.editAppModal || e.target.classList.contains('modal-backdrop')) {
                hideModal('edit');
            }
        });
    }
}

// Filter and display apps
function filterAndDisplayApps() {
    // Start with all apps
    filteredApps = [...apps];
    
    // Apply search filter
    if (searchTerm) {
        filteredApps = filteredApps.filter(app => 
            app.name.toLowerCase().includes(searchTerm) ||
            app.description.toLowerCase().includes(searchTerm) ||
            app.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply status filter
    if (currentFilter !== 'all') {
        if (currentFilter === 'recent') {
            // Show apps modified in last 30 days
            const recentDate = new Date();
            recentDate.setDate(recentDate.getDate() - 30);
            filteredApps = filteredApps.filter(app => 
                new Date(app.last_modified) >= recentDate
            );
        } else {
            filteredApps = filteredApps.filter(app => app.status === currentFilter);
        }
    }
    
    // Apply category filter
    if (currentCategory !== 'all') {
        filteredApps = filteredApps.filter(app => app.category === currentCategory);
    }
    
    // Apply sorting
    filteredApps.sort((a, b) => {
        switch (currentSort) {
            case 'name':
                return a.name.localeCompare(b.name, 'pl');
            case 'date':
                return new Date(b.last_modified) - new Date(a.last_modified);
            case 'category':
                return a.category.localeCompare(b.category, 'pl');
            default:
                return 0;
        }
    });
    
    displayApps();
    updateResultsCount();
}

// Display apps in the grid
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
                <div class="app-actions-secondary">
                    <button class="btn btn--outline app-toggle-btn" data-id="${app.id}">
                        ${app.status === 'aktywna' ? '⏸️ Dezaktywuj' : '▶️ Aktywuj'}
                    </button>
                    <button class="btn btn--danger app-delete-btn" data-id="${app.id}">
                        🗑️ Usuń
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to dynamically created buttons
    addAppCardEventListeners();
}

// Add event listeners to app card buttons
function addAppCardEventListeners() {
    // Open app buttons
    document.querySelectorAll('.app-open-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = e.target.dataset.url;
            openApp(url);
        });
    });
    
    // Edit app buttons
    document.querySelectorAll('.app-edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(e.target.dataset.id);
            editApp(id);
        });
    });
    
    // Toggle status buttons
    document.querySelectorAll('.app-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(e.target.dataset.id);
            toggleAppStatus(id);
        });
    });
    
    // Delete app buttons
    document.querySelectorAll('.app-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(e.target.dataset.id);
            deleteApp(id);
        });
    });
}

// Escape HTML to prevent XSS
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

// Format date for display
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL');
    } catch (e) {
        return dateString;
    }
}

// Update results count
function updateResultsCount() {
    const count = filteredApps.length;
    let countText;
    if (count === 1) {
        countText = '1 aplikacja';
    } else if (count < 5) {
        countText = `${count} aplikacje`;
    } else {
        countText = `${count} aplikacji`;
    }
    elements.resultsCount.textContent = countText;
}

// Update statistics
function updateStatistics() {
    const total = apps.length;
    const active = apps.filter(app => app.status === 'aktywna').length;
    const inactive = total - active;
    
    elements.totalApps.textContent = total;
    elements.activeApps.textContent = active;
    elements.inactiveApps.textContent = inactive;
}

// Show modal
function showModal(type) {
    if (type === 'add') {
        elements.addAppModal.classList.remove('hidden');
        if (elements.addAppForm) {
            elements.addAppForm.reset();
        }
    } else if (type === 'edit') {
        elements.editAppModal.classList.remove('hidden');
    }
    document.body.style.overflow = 'hidden';
}

// Hide modal
function hideModal(type) {
    if (type === 'add') {
        elements.addAppModal.classList.add('hidden');
    } else if (type === 'edit') {
        elements.editAppModal.classList.add('hidden');
    }
    document.body.style.overflow = '';
}

// Handle add app form submission
function handleAddApp(e) {
    e.preventDefault();
    
    const newApp = {
        id: Date.now(), // Simple ID generation
        name: document.getElementById('appName').value.trim(),
        description: document.getElementById('appDescription').value.trim(),
        category: document.getElementById('appCategory').value,
        url: document.getElementById('appUrl').value.trim(),
        thumbnail: document.getElementById('appThumbnail').value.trim() || 'default.png',
        status: 'aktywna',
        last_modified: new Date().toISOString().split('T')[0]
    };
    
    // Validate required fields
    if (!newApp.name || !newApp.description || !newApp.category || !newApp.url) {
        showNotification('Proszę wypełnić wszystkie wymagane pola!', 'error');
        return;
    }
    
    apps.push(newApp);
    saveAppsToStorage();
    filterAndDisplayApps();
    updateStatistics();
    hideModal('add');
    
    showNotification('Aplikacja została dodana pomyślnie!', 'success');
}

// Handle edit app form submission
function handleEditApp(e) {
    e.preventDefault();
    
    const appId = parseInt(document.getElementById('editAppId').value);
    const appIndex = apps.findIndex(app => app.id === appId);
    
    if (appIndex !== -1) {
        const updatedApp = {
            ...apps[appIndex],
            name: document.getElementById('editAppName').value.trim(),
            description: document.getElementById('editAppDescription').value.trim(),
            category: document.getElementById('editAppCategory').value,
            url: document.getElementById('editAppUrl').value.trim(),
            thumbnail: document.getElementById('editAppThumbnail').value.trim() || apps[appIndex].thumbnail,
            status: document.getElementById('editAppStatus').value,
            last_modified: new Date().toISOString().split('T')[0]
        };
        
        // Validate required fields
        if (!updatedApp.name || !updatedApp.description || !updatedApp.category || !updatedApp.url) {
            showNotification('Proszę wypełnić wszystkie wymagane pola!', 'error');
            return;
        }
        
        apps[appIndex] = updatedApp;
        saveAppsToStorage();
        filterAndDisplayApps();
        updateStatistics();
        hideModal('edit');
        
        showNotification('Aplikacja została zaktualizowana!', 'success');
    }
}

// Open app in new tab
function openApp(url) {
    if (url) {
        window.open(url, '_blank');
        showNotification('Otwieranie aplikacji w nowej karcie...', 'info');
    } else {
        showNotification('Błąd: Brak URL aplikacji!', 'error');
    }
}

// Edit app
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

// Toggle app status
function toggleAppStatus(id) {
    const appIndex = apps.findIndex(app => app.id === id);
    if (appIndex !== -1) {
        const newStatus = apps[appIndex].status === 'aktywna' ? 'nieaktywna' : 'aktywna';
        apps[appIndex].status = newStatus;
        apps[appIndex].last_modified = new Date().toISOString().split('T')[0];
        
        saveAppsToStorage();
        filterAndDisplayApps();
        updateStatistics();
        
        showNotification(
            `Aplikacja została ${newStatus === 'aktywna' ? 'aktywowana' : 'dezaktywowana'}!`,
            'info'
        );
    }
}

// Delete app
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

// Export apps to JSON
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

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <span>${escapeHtml(message)}</span>
        <button class="notification-close">✕</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-base);
        padding: var(--space-12) var(--space-16);
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: var(--space-12);
        max-width: 400px;
        opacity: 0;
        transform: translateX(100%);
        transition: all var(--duration-normal) var(--ease-standard);
        font-size: var(--font-size-sm);
        color: var(--color-text);
    `;
    
    // Type-specific styling
    if (type === 'success') {
        notification.style.borderColor = 'var(--color-success)';
        notification.style.backgroundColor = 'rgba(var(--color-success-rgb), 0.1)';
    } else if (type === 'error') {
        notification.style.borderColor = 'var(--color-error)';
        notification.style.backgroundColor = 'rgba(var(--color-error-rgb), 0.1)';
    } else if (type === 'info') {
        notification.style.borderColor = 'var(--color-info)';
        notification.style.backgroundColor = 'rgba(var(--color-info-rgb), 0.1)';
    }
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        cursor: pointer;
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        padding: var(--space-2);
        border-radius: var(--radius-sm);
        transition: background-color var(--duration-fast) var(--ease-standard);
    `;
    
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.backgroundColor = 'var(--color-secondary)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.backgroundColor = 'transparent';
    });
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 4000);
}

// Remove notification
function removeNotification(notification) {
    if (notification && notification.parentNode) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (elements.searchInput) {
            elements.searchInput.focus();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        if (elements.addAppModal && !elements.addAppModal.classList.contains('hidden')) {
            hideModal('add');
        }
        if (elements.editAppModal && !elements.editAppModal.classList.contains('hidden')) {
            hideModal('edit');
        }
    }
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Refresh data when page becomes visible
        filterAndDisplayApps();
        updateStatistics();
    }
});