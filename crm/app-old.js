// SAOS Studio CRM Application
let currentView = 'all';
let currentFilter = 'all';
let currentCategory = null;
let selectedClient = null;
let searchQuery = '';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    updateStats();
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

            if (view) {
                currentView = view;
                currentCategory = null;
            } else if (category) {
                currentCategory = category;
                currentView = 'all';
            }

            renderClientGrid();
        });
    });

    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderClientGrid();
        });
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderClientGrid();
    });
}

function updateStats() {
    const total = clientsData.length;
    const active = clientsData.filter(c => c.status === 'in-progress').length;
    const demoSent = clientsData.filter(c => c.status === 'demo-sent').length;
    const completed = clientsData.filter(c => c.status === 'completed').length;
    const newLeads = clientsData.filter(c => c.status === 'new').length;
    const contacted = clientsData.filter(c => c.status === 'contacted').length;

    // Category counts
    const food = clientsData.filter(c => c.category === 'Food & Hospitality').length;
    const accommodation = clientsData.filter(c => c.category === 'Accommodation').length;
    const healthcare = clientsData.filter(c => c.category === 'Healthcare').length;

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

    // Apply category filter
    if (currentCategory) {
        filtered = filtered.filter(c => c.category === currentCategory);
    }

    // Apply status filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(c => c.status === currentFilter);
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
                <p>No clients found</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = clients.map(client => `
        <div class="client-card" onclick="showClientDetail('${client.id}')">
            <div class="client-card-header">
                <div>
                    <div class="client-name">${escapeHtml(client.name)}</div>
                    ${client.type ? `<div class="client-type">${escapeHtml(client.type)}</div>` : ''}
                </div>
                <span class="status-badge status-${client.status}">${formatStatus(client.status)}</span>
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

                ${client.category ? `
                    <div class="client-meta-item">
                        <svg class="client-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                        </svg>
                        ${escapeHtml(client.category)}
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
                    <div class="client-meta-item" style="color: var(--success);">
                        <svg class="client-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        Demo website ready
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function showClientDetail(clientId) {
    const client = clientsData.find(c => c.id === clientId);
    if (!client) return;

    selectedClient = client;

    const listView = document.getElementById('listView');
    const detailView = document.getElementById('detailView');

    listView.style.display = 'none';
    detailView.classList.add('active');

    detailView.innerHTML = `
        <a href="#" class="back-btn" onclick="hideClientDetail(); return false;">
            ← Back to clients
        </a>

        <div class="detail-header">
            <div class="detail-header-top">
                <div>
                    <h1 class="detail-title">${escapeHtml(client.name)}</h1>
                    <p class="detail-subtitle">${client.type || 'Client'} ${client.city ? `• ${client.city}` : ''}</p>
                </div>
                <div class="detail-actions">
                    <button class="btn btn-secondary" onclick="editClient('${client.id}')">Edit</button>
                    <button class="btn btn-primary" onclick="sendEmail('${client.id}')">Send Email</button>
                </div>
            </div>

            <div class="detail-meta-grid">
                <div class="detail-meta-item">
                    <div class="detail-meta-label">Status</div>
                    <div class="detail-meta-value">
                        <span class="status-badge status-${client.status}">${formatStatus(client.status)}</span>
                    </div>
                </div>

                ${client.phone ? `
                    <div class="detail-meta-item">
                        <div class="detail-meta-label">Phone</div>
                        <div class="detail-meta-value">${escapeHtml(client.phone)}</div>
                    </div>
                ` : ''}

                ${client.rating ? `
                    <div class="detail-meta-item">
                        <div class="detail-meta-label">Rating</div>
                        <div class="detail-meta-value">⭐ ${client.rating} (${client.reviews} reviews)</div>
                    </div>
                ` : ''}

                ${client.category ? `
                    <div class="detail-meta-item">
                        <div class="detail-meta-label">Category</div>
                        <div class="detail-meta-value">${escapeHtml(client.category)}</div>
                    </div>
                ` : ''}

                <div class="detail-meta-item">
                    <div class="detail-meta-label">Source</div>
                    <div class="detail-meta-value">${client.source === 'lead' ? 'Greece Leads' : 'SAOS Client'}</div>
                </div>

                <div class="detail-meta-item">
                    <div class="detail-meta-label">Created</div>
                    <div class="detail-meta-value">${formatDate(client.createdDate)}</div>
                </div>
            </div>
        </div>

        <div class="detail-tabs">
            <button class="detail-tab active" data-tab="overview">Overview</button>
            <button class="detail-tab" data-tab="communications">Communications</button>
            <button class="detail-tab" data-tab="website">Website</button>
            <button class="detail-tab" data-tab="notes">Notes</button>
        </div>

        <div class="detail-content">
            <div class="detail-section active" id="overview-section">
                ${renderOverviewSection(client)}
            </div>

            <div class="detail-section" id="communications-section">
                ${renderCommunicationsSection(client)}
            </div>

            <div class="detail-section" id="website-section">
                ${renderWebsiteSection(client)}
            </div>

            <div class="detail-section" id="notes-section">
                ${renderNotesSection(client)}
            </div>
        </div>
    `;

    // Setup tab switching
    document.querySelectorAll('.detail-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.detail-section').forEach(s => s.classList.remove('active'));

            tab.classList.add('active');
            const section = document.getElementById(`${tab.dataset.tab}-section`);
            if (section) section.classList.add('active');
        });
    });
}

function renderOverviewSection(client) {
    return `
        <h3 style="margin-bottom: 20px; font-size: 20px;">Business Information</h3>

        <div class="detail-meta-grid" style="margin-bottom: 32px;">
            ${client.address ? `
                <div class="detail-meta-item">
                    <div class="detail-meta-label">Address</div>
                    <div class="detail-meta-value">${escapeHtml(client.address)}</div>
                </div>
            ` : ''}

            ${client.webPresence ? `
                <div class="detail-meta-item">
                    <div class="detail-meta-label">Web Presence</div>
                    <div class="detail-meta-value">${escapeHtml(client.webPresence)}</div>
                </div>
            ` : ''}

            ${client.outreachStatus ? `
                <div class="detail-meta-item">
                    <div class="detail-meta-label">Outreach Status</div>
                    <div class="detail-meta-value">${escapeHtml(client.outreachStatus)}</div>
                </div>
            ` : ''}
        </div>

        ${client.googleMaps ? `
            <div style="margin-bottom: 32px;">
                <h3 style="margin-bottom: 12px; font-size: 18px;">Location</h3>
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(client.name + ' ' + client.city)}"
                   target="_blank"
                   class="btn btn-secondary">
                    View on Google Maps
                </a>
            </div>
        ` : ''}

        ${client.notes ? `
            <div>
                <h3 style="margin-bottom: 12px; font-size: 18px;">Notes</h3>
                <div style="background: var(--bg); padding: 16px; border-radius: 8px; white-space: pre-wrap;">
                    ${escapeHtml(client.notes)}
                </div>
            </div>
        ` : ''}

        ${client.websiteFolder ? `
            <div style="margin-top: 32px;">
                <h3 style="margin-bottom: 12px; font-size: 18px;">Project Files</h3>
                <div style="background: var(--bg); padding: 16px; border-radius: 8px; font-family: monospace; font-size: 13px;">
                    ${client.websiteFolder}
                </div>
                <button class="btn btn-secondary" style="margin-top: 12px;" onclick="openFolder('${client.websiteFolder}')">
                    Open in Finder
                </button>
            </div>
        ` : ''}
    `;
}

function renderCommunicationsSection(client) {
    if (!client.communications || client.communications.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📧</div>
                <p>No communications yet</p>
                <button class="btn btn-primary" style="margin-top: 16px;" onclick="sendEmail('${client.id}')">
                    Send First Email
                </button>
            </div>
        `;
    }

    return `
        <div class="timeline">
            ${client.communications.map(comm => `
                <div class="timeline-item">
                    <div class="timeline-date">${formatDate(comm.date)}</div>
                    <div class="timeline-content">
                        <div class="timeline-title">${comm.type} - ${comm.subject}</div>
                        <p style="margin-top: 8px; color: var(--text-light); font-size: 14px;">
                            ${comm.notes || 'No notes'}
                        </p>
                    </div>
                </div>
            `).join('')}
        </div>

        <button class="btn btn-primary" style="margin-top: 24px;" onclick="sendEmail('${client.id}')">
            Add Communication
        </button>
    `;
}

function renderWebsiteSection(client) {
    if (!client.hasWebsite && !client.websiteUrl) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">🌐</div>
                <p>No website created yet</p>
                <button class="btn btn-primary" style="margin-top: 16px;" onclick="createWebsite('${client.id}')">
                    Create Demo Website
                </button>
            </div>
        `;
    }

    return `
        <div style="margin-bottom: 20px;">
            <h3 style="font-size: 18px; margin-bottom: 12px;">Demo Website</h3>
            <div style="display: flex; gap: 12px;">
                <button class="btn btn-secondary" onclick="openWebsite('${client.websiteUrl}')">
                    Open Website
                </button>
                ${client.websiteFolder ? `
                    <button class="btn btn-secondary" onclick="openFolder('${client.websiteFolder}')">
                        Open Project Folder
                    </button>
                ` : ''}
            </div>
        </div>

        ${client.hasOutreach ? `
            <div style="margin-top: 24px;">
                <h3 style="font-size: 18px; margin-bottom: 12px;">Outreach Materials</h3>
                <button class="btn btn-secondary" onclick="viewOutreach('${client.id}')">
                    View Outreach Content
                </button>
            </div>
        ` : ''}

        ${client.hasReadme ? `
            <div style="margin-top: 24px;">
                <h3 style="font-size: 18px; margin-bottom: 12px;">Project Documentation</h3>
                <button class="btn btn-secondary" onclick="viewReadme('${client.id}')">
                    View README
                </button>
            </div>
        ` : ''}
    `;
}

function renderNotesSection(client) {
    return `
        <div class="notes-area">
            <h3 style="font-size: 18px; margin-bottom: 16px;">Client Notes</h3>

            <div class="form-group">
                <textarea class="form-textarea" id="clientNotes" placeholder="Add notes about this client...">${client.notes || ''}</textarea>
            </div>

            <button class="btn btn-primary" onclick="saveNotes('${client.id}')">
                Save Notes
            </button>
        </div>
    `;
}

function hideClientDetail() {
    const listView = document.getElementById('listView');
    const detailView = document.getElementById('detailView');

    listView.style.display = 'block';
    detailView.classList.remove('active');
    selectedClient = null;
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

// Action handlers
function editClient(clientId) {
    alert('Edit functionality - Update client status, information, etc.');
}

function sendEmail(clientId) {
    const client = clientsData.find(c => c.id === clientId);
    if (!client) return;

    window.location.href = `email-composer.html?client=${clientId}`;
}

function createWebsite(clientId) {
    alert('Create website functionality - Generate demo site for client');
}

function openWebsite(url) {
    if (url) {
        window.open(url, '_blank');
    }
}

function openFolder(path) {
    alert(`Open folder: ${path}\n\nIn production, this would open Finder to this location.`);
}

function viewOutreach(clientId) {
    const client = clientsData.find(c => c.id === clientId);
    if (client && client.websiteFolder) {
        alert(`View outreach content at: ${client.websiteFolder}/outreach.md`);
    }
}

function viewReadme(clientId) {
    const client = clientsData.find(c => c.id === clientId);
    if (client && client.websiteFolder) {
        alert(`View README at: ${client.websiteFolder}/README.md`);
    }
}

function saveNotes(clientId) {
    const notes = document.getElementById('clientNotes').value;
    const client = clientsData.find(c => c.id === clientId);
    if (client) {
        client.notes = notes;
        alert('Notes saved successfully!');
    }
}

function exportData() {
    const dataStr = JSON.stringify(clientsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'saos-clients-export.json';
    link.click();
}

function showEmailComposer() {
    window.location.href = 'email-composer.html';
}
