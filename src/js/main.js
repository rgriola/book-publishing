/**
 * Main Module
 * Entry point for the landing page
 */

import config from './config.js';
import debug from './debug.js';

class Main {
  constructor() {
    this.init();
  }

  /**
   * Initialize landing page
   */
  init() {
    debug.log('Initializing landing page...');
    debug.log(`Environment: ${config.env}`);

    this.setupEventListeners();
    this.loadPlaceholderImages();

    debug.log('Landing page initialized');
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Start reading button
    const startReadingBtn = document.getElementById('start-reading-btn');
    if (startReadingBtn) {
      startReadingBtn.addEventListener('click', () => {
        this.startReading();
      });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href !== '#' && href.length > 1) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  /**
   * Navigate to reader with chapter 1
   */
  startReading() {
    debug.log('Starting reading from chapter 1');
    window.location.href = config.getChapterURL(1);
  }

  /**
   * Load placeholder images
   */
  loadPlaceholderImages() {
    // Add loading state or placeholder logic here if needed
    debug.log('Placeholder images ready');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Main();
  });
} else {
  new Main();
}

export default Main;
