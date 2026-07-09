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
