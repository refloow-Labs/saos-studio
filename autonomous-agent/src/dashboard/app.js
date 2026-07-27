(function () {
  const STATUS_LABELS = {
    pending_approval: 'Σε αναμονή',
    approved: 'Εγκρίθηκε',
    sent: 'Στάλθηκε',
    replied: 'Απάντηση',
    rejected: 'Απορρίφθηκε',
    failed: 'Απέτυχε',
    qa_failed: 'QA απέτυχε'
  };
  const STATUS_ORDER = ['pending_approval', 'approved', 'sent', 'replied', 'rejected', 'failed', 'qa_failed'];

  const REFRESH_INTERVAL_MS = 30000;

  const countersEl = document.getElementById('counters');
  const weeklyEl = document.getElementById('weekly-stats');
  const queueBodyEl = document.getElementById('queue-body');
  const lastUpdatedEl = document.getElementById('last-updated');
  const refreshBtn = document.getElementById('refresh-btn');

  let refreshTimer = null;

  async function fetchJson(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      throw new Error(`${url} -> ${res.status}: ${text}`);
    }
    return res.json();
  }

  function renderCounters(queueStats) {
    countersEl.innerHTML = '';
    STATUS_ORDER.forEach((status) => {
      const count = queueStats[status] || 0;
      const card = document.createElement('div');
      card.className = 'counter-card';
      card.innerHTML = `
        <div class="count">${count}</div>
        <div class="label">${STATUS_LABELS[status] || status}</div>
      `;
      countersEl.appendChild(card);
    });
  }

  function renderWeekly(weeklyRows) {
    const totals = (weeklyRows || []).reduce(
      (acc, row) => {
        acc.sites += row.websites_generated || 0;
        acc.emails += row.emails_sent || 0;
        acc.replies += row.replies_received || 0;
        return acc;
      },
      { sites: 0, emails: 0, replies: 0 }
    );

    weeklyEl.textContent =
      `Τελευταίες 7 ημέρες — Sites: ${totals.sites} · Emails: ${totals.emails} · Απαντήσεις: ${totals.replies}`;
  }

  function qaBadgeClass(score) {
    if (score === null || score === undefined) return 'qa-none';
    if (score >= 80) return 'qa-good';
    if (score >= 50) return 'qa-mid';
    return 'qa-bad';
  }

  function formatDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString('el-GR');
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildIssuesList(qaReport) {
    const issues = (qaReport && Array.isArray(qaReport.issues)) ? qaReport.issues : [];
    if (issues.length === 0) {
      return '<div class="muted">Δεν υπάρχουν καταγεγραμμένα προβλήματα.</div>';
    }
    const items = issues.map((issue) => {
      const sev = escapeHtml(issue.severity || 'medium');
      const desc = escapeHtml(issue.description || '');
      const fix = issue.fix ? `<span class="fix">Διόρθωση: ${escapeHtml(issue.fix)}</span>` : '';
      return `<li><span class="sev sev-${sev.toLowerCase()}">${sev}</span>${desc}${fix}</li>`;
    }).join('');
    return `<ul class="qa-issues">${items}</ul>`;
  }

  function renderQueueRow(item) {
    const tr = document.createElement('tr');

    const status = item.status || 'unknown';
    const statusLabel = STATUS_LABELS[status] || status;

    const hasQaScore = item.qa_score !== null && item.qa_score !== undefined;
    const qaScoreText = hasQaScore ? item.qa_score : '—';
    const qaReport = item.qa_report;
    const hasIssues = qaReport && Array.isArray(qaReport.issues) && qaReport.issues.length > 0;

    tr.innerHTML = `
      <td data-label="Εταιρεία">${escapeHtml(item.company)}</td>
      <td data-label="Email">${escapeHtml(item.email)}</td>
      <td data-label="Ημερομηνία">${escapeHtml(formatDate(item.created_at))}</td>
      <td data-label="Κατάσταση"><span class="status-chip status-${escapeHtml(status)}">${escapeHtml(statusLabel)}</span></td>
      <td data-label="QA">
        <span class="qa-badge ${qaBadgeClass(item.qa_score)}">${qaScoreText}</span>
        ${hasIssues ? '<button type="button" class="qa-toggle">Προβλήματα ▾</button><div class="qa-issues-wrap" hidden></div>' : ''}
      </td>
      <td data-label="Ενέργειες">
        <div class="actions">
          <button type="button" class="btn btn-secondary btn-preview">Προεπισκόπηση</button>
          <button type="button" class="btn btn-primary btn-approve" ${status === 'approved' || status === 'sent' ? 'disabled' : ''}>Έγκριση</button>
          <button type="button" class="btn btn-danger btn-reject" ${status === 'rejected' ? 'disabled' : ''}>Απόρριψη</button>
        </div>
      </td>
    `;

    if (hasIssues) {
      const toggleBtn = tr.querySelector('.qa-toggle');
      const wrap = tr.querySelector('.qa-issues-wrap');
      toggleBtn.addEventListener('click', () => {
        const isHidden = wrap.hasAttribute('hidden');
        if (isHidden) {
          wrap.innerHTML = buildIssuesList(qaReport);
          wrap.removeAttribute('hidden');
          toggleBtn.textContent = 'Προβλήματα ▴';
        } else {
          wrap.setAttribute('hidden', '');
          toggleBtn.textContent = 'Προβλήματα ▾';
        }
      });
    }

    tr.querySelector('.btn-preview').addEventListener('click', () => {
      window.open(`/api/queue/${item.id}/preview`, '_blank');
    });

    tr.querySelector('.btn-approve').addEventListener('click', () => {
      approveItem(item.id);
    });

    tr.querySelector('.btn-reject').addEventListener('click', () => {
      if (window.confirm(`Απόρριψη του site για "${item.company}";`)) {
        rejectItem(item.id);
      }
    });

    return tr;
  }

  function renderQueue(items) {
    queueBodyEl.innerHTML = '';
    if (!items || items.length === 0) {
      queueBodyEl.innerHTML = '<tr><td colspan="6" class="muted">Δεν υπάρχουν εγγραφές στην ουρά.</td></tr>';
      return;
    }
    items.forEach((item) => {
      queueBodyEl.appendChild(renderQueueRow(item));
    });
  }

  async function approveItem(id) {
    try {
      await fetchJson(`/api/queue/${id}/approve`, { method: 'POST' });
      await loadAll();
    } catch (err) {
      window.alert(`Αποτυχία έγκρισης: ${err.message}`);
    }
  }

  async function rejectItem(id) {
    try {
      await fetchJson(`/api/queue/${id}/reject`, { method: 'POST' });
      await loadAll();
    } catch (err) {
      window.alert(`Αποτυχία απόρριψης: ${err.message}`);
    }
  }

  async function loadAll() {
    try {
      const [stats, queue] = await Promise.all([
        fetchJson('/api/stats'),
        fetchJson('/api/queue')
      ]);
      renderCounters(stats.queue || {});
      renderWeekly(stats.weekly || []);
      renderQueue(queue);
      lastUpdatedEl.textContent = `Ενημερώθηκε: ${new Date().toLocaleTimeString('el-GR')}`;
    } catch (err) {
      lastUpdatedEl.textContent = `Σφάλμα ενημέρωσης: ${err.message}`;
    }
  }

  function scheduleRefresh() {
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(loadAll, REFRESH_INTERVAL_MS);
  }

  refreshBtn.addEventListener('click', loadAll);

  loadAll();
  scheduleRefresh();
})();
