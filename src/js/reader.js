/**
 * Reader Page Module
 * Main entry point for the chapter reader page
 */

import config from './config.js';
import debug from './debug.js';
import chapterLoader from './chapterLoader.js';
import navigation from './navigation.js';
import analytics from './analytics.js';
import fontSizeControl from './fontSizeControl.js';

class Reader {
  constructor() {
    this.chapterContainer = null;
    this.loadingIndicator = null;
    this.errorContainer = null;
  }

  /**
   * Initialize the reader
   */
  async init() {
    debug.log('Initializing reader...');
    debug.log(`Environment: ${config.env}`);

    // Get DOM elements
    this.chapterContainer = document.getElementById('chapter-content');
    this.loadingIndicator = document.getElementById('loading-indicator');
    this.errorContainer = document.getElementById('error-container');

    if (!this.chapterContainer) {
      debug.error('Chapter container not found');
      return;
    }

    // Initialize font size control
    fontSizeControl.init();

    // Initialize navigation
    navigation.init(async (chapterNumber) => {
      await this.loadAndDisplayChapter(chapterNumber);
    });

    // Setup navigation buttons
    navigation.setupNavigationButtons();

    // Setup chapter menu
    await this.setupChapterMenu();

    // Setup menu toggle
    this.setupMenuToggle();

    debug.log('Reader initialized successfully');
  }

  /**
   * Load and display a chapter
   * @param {number} chapterNumber - Chapter number to load
   */
  async loadAndDisplayChapter(chapterNumber) {
    debug.log(`Loading chapter ${chapterNumber}`);

    try {
      // Show loading indicator
      this.showLoading();

      // Hide any previous errors
      this.hideError();

      // Load chapter
      const chapterData = await chapterLoader.loadChapter(chapterNumber);

      // Display chapter
      this.displayChapter(chapterData);

      // Track analytics
      analytics.trackView(chapterNumber, chapterData.title);

      // Hide loading indicator
      this.hideLoading();

      // Update page title
      document.title = `${chapterData.title} - An Immigrant's Story`;

    } catch (error) {
      debug.error('Error loading chapter:', error);
      this.showError(`Failed to load chapter ${chapterNumber}. Please try again.`);
      this.hideLoading();
    }
  }

  /**
   * Display chapter content
   * @param {Object} chapterData - Chapter data object
   */
  displayChapter(chapterData) {
    debug.log(`Displaying chapter: ${chapterData.title}`);

    // Update chapter container
    this.chapterContainer.innerHTML = chapterData.content;

    // Add chapter metadata
    const metadata = document.createElement('div');
    metadata.className = 'chapter-metadata';
    
    const chapterInfo = document.createElement('p');
    chapterInfo.className = 'chapter-info';
    
    const chapterNumberSpan = document.createElement('span');
    chapterNumberSpan.className = 'chapter-number-display';
    chapterNumberSpan.textContent = `Chapter ${chapterData.number}`; // Safe: uses textContent
    
    // Add chapter title
    if (chapterData.title) {
      const titleSeparator = document.createTextNode(' - ');
      chapterNumberSpan.appendChild(titleSeparator);
      
      const titleText = document.createTextNode(chapterData.title);
      chapterNumberSpan.appendChild(titleText);
    }
    
    chapterInfo.appendChild(chapterNumberSpan);
    metadata.appendChild(chapterInfo);
    
    this.chapterContainer.insertBefore(metadata, this.chapterContainer.firstChild);
  }

  /**
   * Show loading indicator
   */
  showLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.add('visible');
    }
    if (this.chapterContainer) {
      this.chapterContainer.classList.add('loading');
    }
  }

  /**
   * Hide loading indicator
   */
  hideLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.remove('visible');
    }
    if (this.chapterContainer) {
      this.chapterContainer.classList.remove('loading');
    }
  }

  /**
   * Show error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    if (this.errorContainer) {
      this.errorContainer.textContent = message;
      this.errorContainer.classList.add('visible');
    }
  }

  /**
   * Hide error message
   */
  hideError() {
    if (this.errorContainer) {
      this.errorContainer.classList.remove('visible');
    }
  }

  /**
   * Setup chapter menu
   */
  async setupChapterMenu() {
    const menuContainer = document.getElementById('chapter-menu-container');
    if (!menuContainer) {
      debug.warn('Chapter menu container not found');
      return;
    }

    try {
      const menuHTML = await navigation.generateChapterMenu();
      menuContainer.innerHTML = menuHTML;
      debug.log('Chapter menu generated');
    } catch (error) {
      debug.error('Error generating chapter menu:', error);
    }
  }

  /**
   * Setup menu toggle functionality
   */
  setupMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const menuOverlay = document.getElementById('menu-overlay');

    if (!menuToggle || !sidebar) {
      debug.warn('Menu toggle elements not found');
      return;
    }

    // Toggle menu
    menuToggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      
      if (menuOverlay) {
        menuOverlay.classList.toggle('visible');
      }

      debug.log(`Menu ${isOpen ? 'opened' : 'closed'}`);
    });

    // Close menu on overlay click
    if (menuOverlay) {
      menuOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        menuOverlay.classList.remove('visible');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    }

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        if (menuOverlay) {
          menuOverlay.classList.remove('visible');
        }
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// Initialize reader when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const reader = new Reader();
    reader.init();
  });
} else {
  const reader = new Reader();
  reader.init();
}

export default Reader;
