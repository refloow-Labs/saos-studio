// Agent Drafts Module
// Loads AI-generated website drafts from the autonomous agent

let agentDrafts = [];

// Load drafts from the agent's synced JSON file
async function loadAgentDrafts() {
    try {
        // Try to load from the synced JSON file
        const response = await fetch('agent-drafts.json').catch(() => null);

        if (response && response.ok) {
            agentDrafts = await response.json();
            // Also save to localStorage for offline access
            saveDraftsToLocalStorage();
        } else {
            // Fallback: Load from local storage
            agentDrafts = loadDraftsFromLocalStorage();
        }

        updateAgentDraftsCount();
        return agentDrafts;
    } catch (error) {
        console.error('Failed to load agent drafts:', error);
        // Try localStorage as final fallback
        agentDrafts = loadDraftsFromLocalStorage();
        return agentDrafts;
    }
}

function loadDraftsFromLocalStorage() {
    const stored = localStorage.getItem('agentDrafts');
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
}

function saveDraftsToLocalStorage() {
    localStorage.setItem('agentDrafts', JSON.stringify(agentDrafts));
}

function updateAgentDraftsCount() {
    const badge = document.getElementById('agentDraftsCount');
    if (badge) {
        const pending = agentDrafts.filter(d => d.status === 'pending_approval').length;
        badge.textContent = pending;
    }
}

function renderAgentDrafts() {
    const grid = document.getElementById('clientGrid');

    if (!grid) return;

    if (agentDrafts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #737373;">
                <div style="font-size: 48px; margin-bottom: 16px;">🤖</div>
                <h3 style="font-size: 18px; margin-bottom: 8px; color: #0a0a0a;">No Agent Drafts Yet</h3>
                <p style="font-size: 14px;">The AI agent hasn't generated any website drafts yet.</p>
                <p style="font-size: 14px; margin-top: 8px;">Run the agent to start generating websites automatically.</p>
            </div>
        `;
        return;
    }

    const html = agentDrafts.map(draft => {
        const statusColors = {
            'pending_approval': '#f59e0b',
            'approved': '#10b981',
            'rejected': '#ef4444',
            'sent': '#3b82f6'
        };

        const statusLabels = {
            'pending_approval': 'Pending Review',
            'approved': 'Approved',
            'rejected': 'Rejected',
            'sent': 'Email Sent'
        };

        const color = statusColors[draft.status] || '#737373';
        const label = statusLabels[draft.status] || draft.status;

        return `
            <div class="client-card" data-draft-id="${draft.id}">
                <div class="client-card-header">
                    <h3 class="client-name">${draft.company}</h3>
                    <div class="status-badge" style="background: ${color}">${label}</div>
                </div>

                <div class="client-info-grid">
                    <div class="client-info-item">
                        <span class="client-info-label">Email</span>
                        <span class="client-info-value">${draft.email || 'N/A'}</span>
                    </div>
                    <div class="client-info-item">
                        <span class="client-info-label">Phone</span>
                        <span class="client-info-value">${draft.phone || 'N/A'}</span>
                    </div>
                    <div class="client-info-item">
                        <span class="client-info-label">Generated</span>
                        <span class="client-info-value">${formatDate(draft.created_at)}</span>
                    </div>
                </div>

                <div class="client-actions" style="margin-top: 16px; display: flex; gap: 8px;">
                    ${draft.status === 'pending_approval' ? `
                        <button onclick="previewDraft('${draft.id}')" style="flex: 1; padding: 10px; background: #000; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                            Preview
                        </button>
                        <button onclick="approveDraft('${draft.id}')" style="flex: 1; padding: 10px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                            Approve
                        </button>
                        <button onclick="rejectDraft('${draft.id}')" style="padding: 10px 16px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                            ✕
                        </button>
                    ` : `
                        <button onclick="previewDraft('${draft.id}')" style="flex: 1; padding: 10px; background: #000; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                            View
                        </button>
                    `}
                </div>
            </div>
        `;
    }).join('');

    grid.innerHTML = html;
}

function previewDraft(draftId) {
    const draft = agentDrafts.find(d => d.id == draftId);
    if (!draft) return;

    openWebsiteViewer(draft.demo_url, draft.company, null);
}

function approveDraft(draftId) {
    const draft = agentDrafts.find(d => d.id == draftId);
    if (!draft) return;

    if (confirm(`Approve website for ${draft.company}?\n\nThis will queue it for email sending.`)) {
        draft.status = 'approved';
        draft.approved_at = new Date().toISOString();

        saveDraftsToLocalStorage();
        renderAgentDrafts();
        updateAgentDraftsCount();

        // In production, would call API to update database
        console.log('Approved draft:', draftId);
    }
}

function rejectDraft(draftId) {
    const draft = agentDrafts.find(d => d.id == draftId);
    if (!draft) return;

    const reason = prompt(`Why reject ${draft.company}?`, 'Not suitable');
    if (reason) {
        draft.status = 'rejected';
        draft.error_message = reason;
        draft.updated_at = new Date().toISOString();

        saveDraftsToLocalStorage();
        renderAgentDrafts();
        updateAgentDraftsCount();

        console.log('Rejected draft:', draftId, reason);
    }
}

function formatDate(isoString) {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('el-GR', { day: 'numeric', month: 'short' });
}

// Export functions for use in main app
window.loadAgentDrafts = loadAgentDrafts;
window.renderAgentDrafts = renderAgentDrafts;
window.previewDraft = previewDraft;
window.approveDraft = approveDraft;
window.rejectDraft = rejectDraft;
