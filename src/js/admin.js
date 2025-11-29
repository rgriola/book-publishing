/**
 * Admin Module
 * Handles admin authentication and analytics dashboard
 */

import config from './config.js';
import debug from './debug.js';
import analytics from './analytics.js';

class Admin {
  constructor() {
    this.authenticated = false;
  }

  /**
   * Initialize admin page
   */
  init() {
    debug.log('Initializing admin page...');

    // Check if already authenticated in session
    if (sessionStorage.getItem(config.admin.sessionKey) === 'true') {
      this.authenticated = true;
      this.showDashboard();
    } else {
      this.showLogin();
    }

    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    const loginForm = document.getElementById('admin-login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const resetBtn = document.getElementById('reset-analytics-btn');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.logout();
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.refreshDashboard();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetAnalytics();
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportAnalytics();
      });
    }

    if (importBtn) {
      importBtn.addEventListener('click', () => {
        this.importAnalytics();
      });
    }
  }

  /**
   * Handle login form submission
   */
  handleLogin() {
    const codeInput = document.getElementById('admin-code');
    const errorMsg = document.getElementById('login-error');

    if (!codeInput) return;

    const enteredCode = codeInput.value.trim();

    if (enteredCode === config.admin.code) {
      debug.log('Admin login successful');
      this.authenticated = true;
      sessionStorage.setItem(config.admin.sessionKey, 'true');
      this.showDashboard();
      
      if (errorMsg) {
        errorMsg.classList.remove('visible');
      }
    } else {
      debug.warn('Admin login failed - incorrect code');
      
      if (errorMsg) {
        errorMsg.textContent = 'Incorrect security code';
        errorMsg.classList.add('visible');
      }

      // Clear input
      codeInput.value = '';
      codeInput.focus();
    }
  }

  /**
   * Logout admin
   */
  logout() {
    debug.log('Admin logout');
    this.authenticated = false;
    sessionStorage.removeItem(config.admin.sessionKey);
    this.showLogin();
  }

  /**
   * Show login form
   */
  showLogin() {
    const loginSection = document.getElementById('admin-login');
    const dashboardSection = document.getElementById('admin-dashboard');

    if (loginSection) {
      loginSection.classList.add('visible');
    }

    if (dashboardSection) {
      dashboardSection.classList.remove('visible');
    }
  }

  /**
   * Show dashboard
   */
  showDashboard() {
    const loginSection = document.getElementById('admin-login');
    const dashboardSection = document.getElementById('admin-dashboard');

    if (loginSection) {
      loginSection.classList.remove('visible');
    }

    if (dashboardSection) {
      dashboardSection.classList.add('visible');
    }

    // Load dashboard data
    this.loadDashboard();
  }

  /**
   * Load and display dashboard data
   */
  loadDashboard() {
    debug.log('Loading dashboard data...');

    // Load summary statistics
    this.loadSummary();

    // Load most viewed chapters
    this.loadMostViewed();

    // Load recently viewed chapters
    this.loadRecentlyViewed();

    // Load all chapters table
    this.loadAllChapters();
  }

  /**
   * Load summary statistics
   */
  loadSummary() {
    const summary = analytics.getSummary();
    const summaryContainer = document.getElementById('summary-stats');

    if (!summaryContainer) return;

    const readingProgress = Math.round((summary.chaptersViewed / summary.totalChapters) * 100);

    summaryContainer.innerHTML = `
      <div class="stat-card">
        <h3>Total Views</h3>
        <p class="stat-number">${summary.totalViews}</p>
      </div>
      <div class="stat-card">
        <h3>Chapters Read</h3>
        <p class="stat-number">${summary.chaptersViewed} / ${summary.totalChapters}</p>
        <p class="stat-subtitle">${readingProgress}% Complete</p>
      </div>
      <div class="stat-card">
        <h3>Average Views</h3>
        <p class="stat-number">${summary.averageViews}</p>
        <p class="stat-subtitle">per chapter</p>
      </div>
      <div class="stat-card">
        <h3>First Visit</h3>
        <p class="stat-date">${this.formatDate(summary.firstVisit)}</p>
      </div>
    `;
  }

  /**
   * Load most viewed chapters
   */
  loadMostViewed() {
    const mostViewed = analytics.getMostViewed(5);
    const container = document.getElementById('most-viewed-list');

    if (!container) return;

    if (mostViewed.length === 0) {
      container.innerHTML = '<p class="no-data">No chapters viewed yet</p>';
      return;
    }

    const html = mostViewed.map((chapter, index) => `
      <div class="chapter-stat-item">
        <span class="rank">${index + 1}</span>
        <div class="chapter-info">
          <span class="chapter-title">${chapter.title}</span>
          <span class="chapter-number">Chapter ${chapter.number}</span>
        </div>
        <span class="view-count">${chapter.views} views</span>
      </div>
    `).join('');

    container.innerHTML = html;
  }

  /**
   * Load recently viewed chapters
   */
  loadRecentlyViewed() {
    const recentlyViewed = analytics.getRecentlyViewed(5);
    const container = document.getElementById('recently-viewed-list');

    if (!container) return;

    if (recentlyViewed.length === 0) {
      container.innerHTML = '<p class="no-data">No chapters viewed yet</p>';
      return;
    }

    const html = recentlyViewed.map(chapter => `
      <div class="chapter-stat-item">
        <div class="chapter-info">
          <span class="chapter-title">${chapter.title}</span>
          <span class="chapter-number">Chapter ${chapter.number}</span>
        </div>
        <div class="view-info">
          <span class="view-count">${chapter.views} views</span>
          <span class="last-viewed">${this.formatDate(chapter.lastViewed)}</span>
        </div>
      </div>
    `).join('');

    container.innerHTML = html;
  }

  /**
   * Load all chapters table
   */
  loadAllChapters() {
    const allData = analytics.getAllData();
    const container = document.getElementById('all-chapters-table');

    if (!container) return;

    const chapters = Object.entries(allData.chapters)
      .map(([number, data]) => ({
        number: parseInt(number),
        ...data
      }))
      .sort((a, b) => a.number - b.number);

    const html = `
      <table class="analytics-table">
        <thead>
          <tr>
            <th>Chapter</th>
            <th>Title</th>
            <th>Views</th>
            <th>Last Viewed</th>
          </tr>
        </thead>
        <tbody>
          ${chapters.map(chapter => `
            <tr class="${chapter.views === 0 ? 'unread' : ''}">
              <td>${chapter.number}</td>
              <td>${chapter.title}</td>
              <td>${chapter.views}</td>
              <td>${chapter.lastViewed ? this.formatDate(chapter.lastViewed) : 'Never'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    container.innerHTML = html;
  }

  /**
   * Refresh dashboard data
   */
  refreshDashboard() {
    debug.log('Refreshing dashboard...');
    this.loadDashboard();
  }

  /**
   * Reset analytics data
   */
  resetAnalytics() {
    if (confirm('Are you sure you want to reset all analytics data? This cannot be undone.')) {
      analytics.reset();
      this.loadDashboard();
      debug.log('Analytics data reset');
      alert('Analytics data has been reset');
    }
  }

  /**
   * Export analytics data
   */
  exportAnalytics() {
    const data = analytics.export();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `immigrants-story-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    debug.log('Analytics data exported');
  }

  /**
   * Import analytics data
   */
  importAnalytics() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const success = analytics.import(event.target.result);
          if (success) {
            this.loadDashboard();
            alert('Analytics data imported successfully');
            debug.log('Analytics data imported');
          } else {
            alert('Failed to import analytics data. Invalid format.');
          }
        } catch (error) {
          alert('Error importing analytics data');
          debug.error('Import error:', error);
        }
      };
      reader.readAsText(file);
    });

    input.click();
  }

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  formatDate(dateString) {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
      }
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}

// Initialize admin when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const admin = new Admin();
    admin.init();
  });
} else {
  const admin = new Admin();
  admin.init();
}

export default Admin;
