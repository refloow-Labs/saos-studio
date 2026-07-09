// SAOS Studio CRM Application - Enhanced Version
let currentView = 'all';
let currentCategory = null;
let currentAssigned = null;
let searchQuery = '';
let activeFilters = {
    status: '',
    category: '',
    city: '',
    rating: '',
    hasWebsite: '',
    source: '',
    nomos: '',
    assignedTo: ''
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    updateStats();
    populateCityFilter();
    renderClientGrid();
    setupEventListeners();
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const view = item.dataset.view;
            const category = item.dataset.category;
            const assigned = item.dataset.assigned;

            if (view) {
                currentView = view;
                currentCategory = null;
                currentAssigned = null;
                // Update category filter to match
                document.getElementById('categoryFilter').value = '';
            } else if (category) {
                currentCategory = category;
                currentView = 'all';
                currentAssigned = null;
                // Update category filter to match
                document.getElementById('categoryFilter').value = category;
            } else if (assigned) {
                currentAssigned = assigned;
                currentView = 'all';
                currentCategory = null;
            }

            applyFilters();
        });
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderClientGrid();
    });

    // Close website viewer on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeWebsiteViewer();
        }
    });

    // Close website viewer on background click
    document.getElementById('websiteViewerModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeWebsiteViewer();
        }
    });
}

function populateCityFilter() {
    const cities = [...new Set(clientsData
        .map(c => c.city)
        .filter(city => city && city.trim())
    )].sort();

    const cityFilter = document.getElementById('cityFilter');
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
    });
}

function updateStats() {
    const total = clientsData.length;
    const active = clientsData.filter(c => c.status === 'in-progress').length;
    const demoSent = clientsData.filter(c => c.status === 'demo-sent').length;
    const completed = clientsData.filter(c => c.status === 'completed').length;
    const newLeads = clientsData.filter(c => c.status === 'new').length;

    // Category counts
    const food = clientsData.filter(c => c.category === 'Food & Hospitality').length;
    const accommodation = clientsData.filter(c => c.category === 'Accommodation').length;
    const healthcare = clientsData.filter(c => c.category === 'Healthcare').length;

    // Salesperson counts
    const giannisLeads = clientsData.filter(c => c.assignedTo === 'Giannis').length;
    const kostasLeads = clientsData.filter(c => c.assignedTo === 'Kostas').length;
    const sotirisLeads = clientsData.filter(c => c.assignedTo === 'ΣΩΤΗΡΗΣ').length;

    document.getElementById('totalClientsCount').textContent = total;
    document.getElementById('activeCount').textContent = active;
    document.getElementById('demoSentCount').textContent = demoSent;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('allClientsCount').textContent = total;
    document.getElementById('newLeadsCount').textContent = newLeads;
    document.getElementById('inProgressCount').textContent = active;
    document.getElementById('completedNavCount').textContent = completed;
    document.getElementById('foodCount').textContent = food;
    document.getElementById('accommodationCount').textContent = accommodation;
    document.getElementById('healthcareCount').textContent = healthcare;
    document.getElementById('giannisCount').textContent = giannisLeads;
    document.getElementById('kostasCount').textContent = kostasLeads;
    document.getElementById('sotirisCount').textContent = sotirisLeads;
}

function applyFilters() {
    // Update activeFilters from form
    activeFilters.status = document.getElementById('statusFilter').value;
    activeFilters.category = document.getElementById('categoryFilter').value;
    activeFilters.city = document.getElementById('cityFilter').value;
    activeFilters.rating = document.getElementById('ratingFilter').value;
    activeFilters.hasWebsite = document.getElementById('websiteFilter').value;
    activeFilters.source = document.getElementById('sourceFilter').value;
    activeFilters.assignedTo = document.getElementById('assignedToFilter').value;

    // Update active filter tags
    updateActiveFilterTags();

    // Re-render grid
    renderClientGrid();
}

function updateActiveFilterTags() {
    const container = document.getElementById('activeFilters');
    const tags = [];

    if (activeFilters.status) {
        tags.push({ key: 'status', label: `Status: ${formatStatus(activeFilters.status)}` });
    }
    if (activeFilters.category) {
        tags.push({ key: 'category', label: `Category: ${activeFilters.category}` });
    }
    if (activeFilters.city) {
        tags.push({ key: 'city', label: `City: ${activeFilters.city}` });
    }
    if (activeFilters.rating) {
        tags.push({ key: 'rating', label: `Rating: ${activeFilters.rating}` });
    }
    if (activeFilters.hasWebsite) {
        tags.push({ key: 'hasWebsite', label: `Website: ${activeFilters.hasWebsite === 'yes' ? 'Yes' : 'No'}` });
    }
    if (activeFilters.source) {
        tags.push({ key: 'source', label: `Source: ${activeFilters.source === 'lead' ? 'Greece Leads' : 'SAOS Client'}` });
    }

    if (tags.length > 0) {
        container.style.display = 'flex';
        container.innerHTML = tags.map(tag => `
            <div class="filter-tag">
                <span>${escapeHtml(tag.label)}</span>
                <span class="filter-tag-remove" onclick="removeFilter('${tag.key}')">×</span>
            </div>
        `).join('');
    } else {
        container.style.display = 'none';
    }
}

function removeFilter(filterKey) {
    activeFilters[filterKey] = '';
    document.getElementById(`${filterKey}Filter`).value = '';
    applyFilters();
}

function clearAllFilters() {
    Object.keys(activeFilters).forEach(key => {
        activeFilters[key] = '';
        const filterElement = document.getElementById(`${key}Filter`);
        if (filterElement) {
            filterElement.value = '';
        }
    });
    searchQuery = '';
    document.getElementById('searchInput').value = '';
    applyFilters();
}

function getFilteredClients() {
    let filtered = [...clientsData];

    // Apply view filter
    if (currentView === 'new') {
        filtered = filtered.filter(c => c.status === 'new');
    } else if (currentView === 'in-progress') {
        filtered = filtered.filter(c => c.status === 'in-progress');
    } else if (currentView === 'completed') {
        filtered = filtered.filter(c => c.status === 'completed');
    }

    // Apply category filter from navigation
    if (currentCategory) {
        filtered = filtered.filter(c => c.category === currentCategory);
    }

    // Apply assignedTo filter from navigation
    if (currentAssigned) {
        filtered = filtered.filter(c => c.assignedTo === currentAssigned);
    }

    // Apply advanced filters
    if (activeFilters.status) {
        filtered = filtered.filter(c => c.status === activeFilters.status);
    }

    if (activeFilters.category) {
        filtered = filtered.filter(c => c.category === activeFilters.category);
    }

    if (activeFilters.city) {
        filtered = filtered.filter(c => c.city === activeFilters.city);
    }

    if (activeFilters.rating) {
        const minRating = parseFloat(activeFilters.rating);
        filtered = filtered.filter(c => c.rating && parseFloat(c.rating) >= minRating);
    }

    if (activeFilters.hasWebsite) {
        if (activeFilters.hasWebsite === 'yes') {
            filtered = filtered.filter(c => c.hasWebsite);
        } else if (activeFilters.hasWebsite === 'no') {
            filtered = filtered.filter(c => !c.hasWebsite);
        }
    }

    if (activeFilters.source) {
        filtered = filtered.filter(c => c.source === activeFilters.source);
    }

    if (activeFilters.nomos) {
        filtered = filtered.filter(c => c.nomos === activeFilters.nomos);
    }

    if (activeFilters.assignedTo) {
        if (activeFilters.assignedTo === 'unassigned') {
            filtered = filtered.filter(c => !c.assignedTo || c.assignedTo === '');
        } else {
            filtered = filtered.filter(c => c.assignedTo === activeFilters.assignedTo);
        }
    }

    // Apply search
    if (searchQuery) {
        filtered = filtered.filter(c =>
            (c.name && c.name.toLowerCase().includes(searchQuery)) ||
            (c.city && c.city.toLowerCase().includes(searchQuery)) ||
            (c.type && c.type.toLowerCase().includes(searchQuery)) ||
            (c.category && c.category.toLowerCase().includes(searchQuery))
        );
    }

    return filtered;
}

function renderClientGrid() {
    const grid = document.getElementById('clientGrid');
    const clients = getFilteredClients();

    if (clients.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">📋</div>
                <p>No clients found matching your filters</p>
                <button class="btn btn-secondary" style="margin-top: 16px;" onclick="clearAllFilters()">
                    Clear Filters
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = clients.map(client => `
        <div class="client-card" onclick="viewClientWebsite('${client.id}', event)">
            <div class="client-card-header">
                <div>
                    <div class="client-name">${escapeHtml(client.name)}</div>
                    ${client.type ? `<div class="client-type">${escapeHtml(client.type)}</div>` : ''}
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <span class="status-badge status-${client.status}">${formatStatus(client.status)}</span>
                    ${renderAssignmentBadge(client)}
                </div>
            </div>

            <div class="client-assignment-selector" onclick="event.stopPropagation();" style="margin: 12px 0; padding: 8px; background: var(--bg); border-radius: 6px;">
                <label style="font-size: 11px; font-weight: 600; color: var(--text-light); display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Assigned To</label>
                <select
                    class="filter-select"
                    style="font-size: 13px; padding: 6px 8px;"
                    value="${client.assignedTo || ''}"
                    onchange="updateClientAssignment('${client.id}', this.value)"
                >
                    <option value="">Unassigned</option>
                    <option value="Giannis" ${client.assignedTo === 'Giannis' ? 'selected' : ''}>Giannis</option>
                    <option value="Kostas" ${client.assignedTo === 'Kostas' ? 'selected' : ''}>Kostas</option>
                    <option value="ΣΩΤΗΡΗΣ" ${client.assignedTo === 'ΣΩΤΗΡΗΣ' ? 'selected' : ''}>ΣΩΤΗΡΗΣ</option>
                </select>
            </div>

            <div class="client-meta">
                ${client.city ? `
                    <div class="client-meta-item">
                        <svg class="client-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        ${escapeHtml(client.city)}
                    </div>
                ` : ''}

                ${client.address ? `
                    <div class="client-meta-item">
                        <svg class="client-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                        </svg>
                        <a href="${generateGoogleMapsUrl(client)}" target="_blank" onclick="event.stopPropagation()" style="color: inherit; text-decoration: none; display: flex; align-items: center; gap: 4px;">
                            ${escapeHtml(client.address)}
                            <span style="font-size: 10px; opacity: 0.7;">🗺️</span>
                        </a>
                    </div>
                ` : ''}

                ${client.phone ? `
                    <div class="client-meta-item">
                        <svg class="client-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                        <a href="tel:${client.phone.replace(/\s/g, '')}" onclick="event.stopPropagation()" style="color: inherit; text-decoration: none;">
                            ${escapeHtml(client.phone)}
                        </a>
                    </div>
                ` : ''}

                ${client.email ? `
                    <div class="client-meta-item">
                        <svg class="client-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <a href="mailto:${client.email}" onclick="event.stopPropagation()" style="color: inherit; text-decoration: none;">
                            ${escapeHtml(client.email)}
                        </a>
                    </div>
                ` : ''}

                ${client.rating ? `
                    <div class="client-meta-item">
                        <span class="client-rating">
                            ⭐ ${client.rating} (${client.reviews} reviews)
                        </span>
                    </div>
                ` : ''}

                ${client.hasWebsite ? `
                    <div class="client-meta-item" style="color: var(--success); font-weight: 600;">
                        <svg class="client-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        Click to view demo website
                    </div>
                ` : `
                    <div class="client-meta-item" style="color: var(--text-light);">
                        <svg class="client-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                        No website yet
                    </div>
                `}
            </div>
        </div>
    `).join('');
}

function viewClientWebsite(clientId, event) {
    const client = clientsData.find(c => c.id === clientId);
    if (!client) return;

    // If client has a website, open it in the built-in viewer
    if (client.hasWebsite && client.websiteUrl) {
        openWebsiteViewer(client.websiteUrl, client.name, clientId);
        event.stopPropagation();
    } else {
        // Otherwise, show client detail (you can customize this)
        alert(`Client: ${client.name}\n\nNo demo website available yet.\n\nWould you like to create one?`);
    }
}

function openWebsiteViewer(url, clientName, clientId) {
    // Check if it's a local file:// URL (shouldn't happen anymore, but safety check)
    if (url && url.startsWith('file://')) {
        // For local files, open in a new tab
        alert(`Opening "${clientName}" in a new tab.\n\n(Local files cannot be displayed in embedded viewers)`);
        window.open(url, '_blank');
        return;
    }

    // Use the modal viewer for HTTP URLs
    const modal = document.getElementById('websiteViewerModal');
    const iframe = document.getElementById('websiteViewerIframe');
    const title = document.getElementById('websiteViewerTitle');

    title.textContent = clientName;
    iframe.src = url;
    modal.classList.add('active');

    // Load feedback for this client
    if (clientId) {
        loadFeedbackForClient(clientId);
    }

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeWebsiteViewer() {
    const modal = document.getElementById('websiteViewerModal');
    const iframe = document.getElementById('websiteViewerIframe');

    modal.classList.remove('active');
    iframe.src = '';

    // Restore body scroll
    document.body.style.overflow = '';
}

function formatStatus(status) {
    const statusMap = {
        'new': 'New',
        'contacted': 'Contacted',
        'demo-sent': 'Demo Sent',
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'archived': 'Archived'
    };
    return statusMap[status] || status;
}

function formatDate(date) {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, m => map[m]);
}

function generateGoogleMapsUrl(client) {
    // Generate a Google Maps search URL from client name and address
    const query = `${client.name || ''} ${client.address || ''} ${client.city || ''}`.trim();
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// Action handlers
function exportData() {
    const filtered = getFilteredClients();
    const dataStr = JSON.stringify(filtered, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `saos-clients-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

function showEmailComposer() {
    window.location.href = 'email-composer.html';
}

// ===========================================
// FEEDBACK MANAGEMENT SYSTEM
// ===========================================

let currentClientForFeedback = null;

function loadFeedbackForClient(clientId) {
    currentClientForFeedback = clientId;
    const client = clientsData.find(c => c.id === clientId);

    if (!client) return;

    // Initialize feedback array if it doesn't exist
    if (!client.feedback) {
        client.feedback = [];
    }

    renderFeedbackList(client.feedback);
}

function renderFeedbackList(feedbackArray) {
    const list = document.getElementById('feedbackList');
    const count = document.getElementById('feedbackCount');

    count.textContent = `${feedbackArray.length} item${feedbackArray.length !== 1 ? 's' : ''}`;

    if (feedbackArray.length === 0) {
        list.innerHTML = `
            <div class="empty-state" style="padding: 40px 20px;">
                <div class="empty-state-icon">📝</div>
                <p style="font-size: 13px;">No feedback yet.<br>Add your first feedback item above.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = feedbackArray.map((item, index) => `
        <div class="feedback-item">
            <div class="feedback-item-header">
                <span class="feedback-priority-badge ${item.priority}">${item.priority.toUpperCase()}</span>
                <span class="feedback-status ${item.status}">${item.status.replace('-', ' ')}</span>
            </div>
            <div class="feedback-text">${escapeHtml(item.text)}</div>
            <div class="feedback-meta">
                <span>${formatDate(item.createdAt)}</span>
            </div>
            <div class="feedback-actions-btn">
                ${item.status === 'pending' ? `
                    <button class="btn btn-secondary" onclick="markFeedbackInProgress(${index})">Start Work</button>
                ` : ''}
                ${item.status === 'in-progress' ? `
                    <button class="btn btn-accent" onclick="markFeedbackResolved(${index})">Mark Resolved</button>
                ` : ''}
                <button class="btn btn-secondary" onclick="deleteFeedback(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

function addFeedback() {
    const input = document.getElementById('feedbackInput');
    const priority = document.getElementById('feedbackPriority');
    const text = input.value.trim();

    if (!text) {
        alert('Please enter feedback text');
        return;
    }

    if (!currentClientForFeedback) {
        alert('No client selected');
        return;
    }

    const client = clientsData.find(c => c.id === currentClientForFeedback);
    if (!client) return;

    if (!client.feedback) {
        client.feedback = [];
    }

    const feedbackItem = {
        id: Date.now().toString(),
        text: text,
        priority: priority.value,
        status: 'pending',
        createdAt: new Date().toISOString(),
        resolvedAt: null
    };

    client.feedback.push(feedbackItem);

    // Clear input
    input.value = '';
    priority.value = 'medium';

    // Re-render
    renderFeedbackList(client.feedback);

    // Save to localStorage
    saveFeedbackToStorage();
}

function markFeedbackInProgress(index) {
    const client = clientsData.find(c => c.id === currentClientForFeedback);
    if (!client || !client.feedback) return;

    client.feedback[index].status = 'in-progress';
    renderFeedbackList(client.feedback);
    saveFeedbackToStorage();
}

function markFeedbackResolved(index) {
    const client = clientsData.find(c => c.id === currentClientForFeedback);
    if (!client || !client.feedback) return;

    client.feedback[index].status = 'resolved';
    client.feedback[index].resolvedAt = new Date().toISOString();
    renderFeedbackList(client.feedback);
    saveFeedbackToStorage();
}

function deleteFeedback(index) {
    if (!confirm('Delete this feedback item?')) return;

    const client = clientsData.find(c => c.id === currentClientForFeedback);
    if (!client || !client.feedback) return;

    client.feedback.splice(index, 1);
    renderFeedbackList(client.feedback);
    saveFeedbackToStorage();
}

function saveFeedbackToStorage() {
    try {
        localStorage.setItem('saos-feedback', JSON.stringify(clientsData.map(c => ({
            id: c.id,
            feedback: c.feedback || []
        }))));
    } catch (e) {
        console.error('Failed to save feedback:', e);
    }
}

function loadFeedbackFromStorage() {
    try {
        const stored = localStorage.getItem('saos-feedback');
        if (stored) {
            const feedbackData = JSON.parse(stored);
            feedbackData.forEach(item => {
                const client = clientsData.find(c => c.id === item.id);
                if (client) {
                    client.feedback = item.feedback || [];
                }
            });
        }
    } catch (e) {
        console.error('Failed to load feedback:', e);
    }
}

// ===========================================
// ADD CLIENT MODAL
// ===========================================

function showAddClientModal() {
    const modal = document.getElementById('addClientModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAddClientModal() {
    const modal = document.getElementById('addClientModal');
    const form = document.getElementById('addClientForm');

    modal.classList.remove('active');
    form.reset();
    document.body.style.overflow = '';
}

function saveNewClient(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const newClient = {
        id: `manual-${Date.now()}`,
        name: formData.get('name'),
        type: formData.get('type') || '',
        category: formData.get('category') || '',
        city: formData.get('city') || '',
        address: formData.get('address') || '',
        phone: formData.get('phone') || '',
        email: formData.get('email') || '',
        rating: formData.get('rating') || '',
        reviews: formData.get('reviews') || '',
        webPresence: '',
        googleMaps: '',
        outreachStatus: '',
        notes: formData.get('notes') || '',
        source: 'manual',
        status: 'new',
        communications: [],
        websiteUrl: formData.get('websiteUrl') || null,
        hasWebsite: !!formData.get('websiteUrl'),
        lastContact: null,
        createdDate: new Date().toISOString().split('T')[0],
        feedback: []
    };

    // Add to clients array
    clientsData.unshift(newClient);

    // Update stats
    updateStats();

    // Re-render grid
    renderClientGrid();

    // Close modal
    closeAddClientModal();

    // Show success message
    alert(`✓ Client "${newClient.name}" added successfully!`);
}

// Update the openWebsiteViewer function to load feedback
const originalOpenWebsiteViewer = openWebsiteViewer;
window.openWebsiteViewer = function(url, clientName, clientId) {
    originalOpenWebsiteViewer(url, clientName);

    // Load feedback for this client
    if (clientId) {
        loadFeedbackForClient(clientId);
    }
};

// Initialize feedback system on load
document.addEventListener('DOMContentLoaded', () => {
    loadFeedbackFromStorage();
});

// Update viewClientWebsite to pass clientId

// ===========================================
// DEPLOYMENT MANAGEMENT SYSTEM
// ===========================================

let currentClientForDeployment = null;

function loadDeploymentForClient(clientId) {
    currentClientForDeployment = clientId;
    const client = clientsData.find(c => c.id === clientId);

    if (!client) return;

    // Initialize deployment object if it doesn't exist
    if (!client.deployment) {
        client.deployment = {
            status: 'not-deployed', // not-deployed, marked, deploying, deployed, failed
            markedAt: null,
            deployedAt: null,
            netlifyUrl: null,
            siteId: null,
            lastDeployment: null
        };
    }

    renderDeploymentSection(client.deployment);
}

function renderDeploymentSection(deployment) {
    const statusBadge = document.getElementById('deploymentStatus');
    const infoDiv = document.getElementById('deploymentInfo');
    const markBtn = document.getElementById('markDeploymentBtn');
    const urlSection = document.getElementById('deploymentUrlSection');
    const urlInput = document.getElementById('deploymentUrl');

    // Update status badge
    statusBadge.className = `deployment-status ${deployment.status}`;
    statusBadge.textContent = deployment.status.replace('-', ' ');

    // Update info
    const infoItems = [];

    if (deployment.markedAt) {
        infoItems.push(`
            <div class="deployment-info-item">
                <span class="deployment-info-label">Marked:</span>
                <span class="deployment-info-value">${formatDate(deployment.markedAt)}</span>
            </div>
        `);
    }

    if (deployment.deployedAt) {
        infoItems.push(`
            <div class="deployment-info-item">
                <span class="deployment-info-label">Deployed:</span>
                <span class="deployment-info-value">${formatDate(deployment.deployedAt)}</span>
            </div>
        `);
    }

    if (deployment.siteId) {
        infoItems.push(`
            <div class="deployment-info-item">
                <span class="deployment-info-label">Site ID:</span>
                <span class="deployment-info-value">${deployment.siteId}</span>
            </div>
        `);
    }

    infoDiv.innerHTML = infoItems.join('');

    // Update button
    if (deployment.status === 'not-deployed') {
        markBtn.textContent = '✓ Mark for Deployment';
        markBtn.className = 'btn btn-deploy';
        markBtn.disabled = false;
    } else if (deployment.status === 'marked') {
        markBtn.textContent = '✓ Marked - Ready for Deploy';
        markBtn.className = 'btn btn-secondary';
        markBtn.disabled = false;
    } else if (deployment.status === 'deploying') {
        markBtn.textContent = '⏳ Deploying...';
        markBtn.className = 'btn btn-secondary';
        markBtn.disabled = true;
    } else if (deployment.status === 'deployed') {
        markBtn.textContent = '✓ Deployed';
        markBtn.className = 'btn btn-secondary';
        markBtn.disabled = true;
    }

    // Show URL section if deployed
    if (deployment.netlifyUrl) {
        urlSection.style.display = 'flex';
        urlInput.value = deployment.netlifyUrl;
    } else {
        urlSection.style.display = 'none';
    }
}

function markForDeployment() {
    if (!currentClientForDeployment) return;

    const client = clientsData.find(c => c.id === currentClientForDeployment);
    if (!client) return;

    if (!client.deployment) {
        client.deployment = {};
    }

    // Toggle between not-deployed and marked
    if (client.deployment.status === 'not-deployed' || !client.deployment.status) {
        client.deployment.status = 'marked';
        client.deployment.markedAt = new Date().toISOString();

        alert(`✓ "${client.name}" marked for deployment!\n\nRun /saos-deploy in Claude Code to deploy all marked sites.`);
    } else if (client.deployment.status === 'marked') {
        client.deployment.status = 'not-deployed';
        client.deployment.markedAt = null;

        alert(`✓ "${client.name}" unmarked.`);
    }

    renderDeploymentSection(client.deployment);
    saveDeploymentToStorage();
}

function copyDeploymentUrl() {
    const urlInput = document.getElementById('deploymentUrl');
    urlInput.select();
    document.execCommand('copy');

    alert('✓ Netlify URL copied to clipboard!');
}

function openDeploymentUrl() {
    const urlInput = document.getElementById('deploymentUrl');
    if (urlInput.value) {
        window.open(urlInput.value, '_blank');
    }
}

function saveDeploymentToStorage() {
    try {
        localStorage.setItem('saos-deployment', JSON.stringify(clientsData.map(c => ({
            id: c.id,
            deployment: c.deployment || {}
        }))));
    } catch (e) {
        console.error('Failed to save deployment data:', e);
    }
}

function loadDeploymentFromStorage() {
    try {
        const stored = localStorage.getItem('saos-deployment');
        if (stored) {
            const deploymentData = JSON.parse(stored);
            deploymentData.forEach(item => {
                const client = clientsData.find(c => c.id === item.id);
                if (client) {
                    client.deployment = item.deployment || {};
                }
            });
        }
    } catch (e) {
        console.error('Failed to load deployment data:', e);
    }
}

// Update openWebsiteViewer to load deployment
const originalOpenViewer = window.openWebsiteViewer;
window.openWebsiteViewer = function(url, clientName, clientId) {
    if (originalOpenViewer) {
        originalOpenViewer(url, clientName, clientId);
    }

    // Load deployment for this client
    if (clientId) {
        loadDeploymentForClient(clientId);
    }
};

// Initialize deployment system on load
if (typeof document !== 'undefined') {
    const originalDOMContentLoaded = document.addEventListener;
    document.addEventListener('DOMContentLoaded', () => {
        loadDeploymentFromStorage();
    });
}
// Render assignment badge with color coding
function renderAssignmentBadge(client) {
    if (!client.assignedTo) {
        return '<span style="font-size: 11px; color: var(--text-light); font-weight: 500;">Unassigned</span>';
    }

    const colors = {
        'Giannis': { bg: '#3b82f6', text: '#fff' },      // Blue
        'Kostas': { bg: '#10b981', text: '#fff' },       // Green
        'ΣΩΤΗΡΗΣ': { bg: '#f59e0b', text: '#000' }       // Amber
    };

    const color = colors[client.assignedTo] || { bg: '#6b7280', text: '#fff' };

    return `<span style="
        font-size: 11px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 12px;
        background: ${color.bg};
        color: ${color.text};
        white-space: nowrap;
    ">${client.assignedTo}</span>`;
}

// Update client assignment
function updateClientAssignment(clientId, assignedTo) {
    const clientIndex = clientsData.findIndex(c => c.id === clientId);
    if (clientIndex !== -1) {
        clientsData[clientIndex].assignedTo = assignedTo || '';

        // Save to localStorage
        localStorage.setItem('crmClients', JSON.stringify(clientsData));

        // Update stats and re-render
        updateStats();
        renderClientGrid();

        console.log(`Updated ${clientsData[clientIndex].name} assignment to: ${assignedTo || 'Unassigned'}`);
    }
}
