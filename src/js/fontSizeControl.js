/**
 * Font Size Control Module
 * Provides adjustable font sizes for better readability
 */

import debug from './debug.js';

class FontSizeControl {
  constructor() {
    // Font size options (in pixels for base font)
    this.fontSizes = {
      small: 16,
      medium: 18,
      large: 20,
      xlarge: 22
    };

    this.currentSize = 'medium'; // default
    this.storageKey = 'reader-font-size';
  }

  /**
   * Initialize font size control
   */
  init() {
    debug.log('Initializing font size control...');

    // Load saved preference
    this.loadSavedSize();

    // Create control UI
    this.createControl();

    // Setup event listeners
    this.setupEventListeners();

    // Apply current size
    this.applyFontSize(this.currentSize);

    debug.log(`Font size control initialized with size: ${this.currentSize}`);
  }

  /**
   * Load saved font size from localStorage
   */
  loadSavedSize() {
    try {
      const savedSize = localStorage.getItem(this.storageKey);
      if (savedSize && this.fontSizes[savedSize]) {
        this.currentSize = savedSize;
        debug.log(`Loaded saved font size: ${savedSize}`);
      }
    } catch (error) {
      debug.warn('Could not load saved font size:', error);
    }
  }

  /**
   * Save font size to localStorage
   */
  saveFontSize(size) {
    try {
      localStorage.setItem(this.storageKey, size);
      debug.log(`Saved font size: ${size}`);
    } catch (error) {
      debug.warn('Could not save font size:', error);
    }
  }

  /**
   * Create font size control UI
   */
  createControl() {
    const header = document.querySelector('.reader-header .container');
    if (!header) {
      debug.error('Header container not found');
      return;
    }

    // Create control container
    const controlContainer = document.createElement('div');
    controlContainer.id = 'font-size-control';
    controlContainer.className = 'font-size-control';
    controlContainer.setAttribute('aria-label', 'Text size control');

    // Create label
    const label = document.createElement('span');
    label.className = 'font-size-label';
    label.textContent = 'Text Size:';
    label.setAttribute('aria-hidden', 'true');

    // Create button group
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'font-size-buttons';
    buttonGroup.setAttribute('role', 'group');
    buttonGroup.setAttribute('aria-label', 'Font size options');

    // Create buttons for each size
    Object.keys(this.fontSizes).forEach(size => {
      const button = document.createElement('button');
      button.className = 'font-size-btn';
      button.dataset.size = size;
      button.setAttribute('aria-label', `Set text size to ${size}`);
      button.setAttribute('aria-pressed', size === this.currentSize);
      
      // Button text (A with size indicators)
      const sizeMap = {
        small: 'A-',
        medium: 'A',
        large: 'A+',
        xlarge: 'A++'
      };
      button.textContent = sizeMap[size] || 'A';
      
      // Add active class to current size
      if (size === this.currentSize) {
        button.classList.add('active');
      }

      buttonGroup.appendChild(button);
    });

    controlContainer.appendChild(label);
    controlContainer.appendChild(buttonGroup);

    // Find the flex container (which contains current-chapter-info and menu-toggle)
    const flexContainer = header.querySelector('.flex');
    const chapterInfo = document.getElementById('current-chapter-info');
    
    if (flexContainer && chapterInfo) {
      // Insert before the chapter info span
      flexContainer.insertBefore(controlContainer, chapterInfo);
    } else if (flexContainer) {
      // Insert at the beginning of flex container
      flexContainer.insertBefore(controlContainer, flexContainer.firstChild);
    } else {
      // Fallback: append to header
      header.appendChild(controlContainer);
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    const buttons = document.querySelectorAll('.font-size-btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const size = e.target.dataset.size;
        if (size) {
          this.setFontSize(size);
        }
      });
    });
  }

  /**
   * Set font size
   * @param {string} size - Size key (small, medium, large, xlarge)
   */
  setFontSize(size) {
    if (!this.fontSizes[size]) {
      debug.error(`Invalid font size: ${size}`);
      return;
    }

    this.currentSize = size;
    this.applyFontSize(size);
    this.updateButtons(size);
    this.saveFontSize(size);

    debug.log(`Font size changed to: ${size}`);
  }

  /**
   * Apply font size to content
   * @param {string} size - Size key
   */
  applyFontSize(size) {
    const fontSize = this.fontSizes[size];
    
    // Set CSS custom property on root
    document.documentElement.style.setProperty('--reader-font-size', `${fontSize}px`);
    
    // Also set a data attribute for CSS targeting
    document.documentElement.setAttribute('data-font-size', size);

    // Announce change to screen readers
    this.announceChange(size);
  }

  /**
   * Update button states
   * @param {string} activeSize - Currently active size
   */
  updateButtons(activeSize) {
    const buttons = document.querySelectorAll('.font-size-btn');
    
    buttons.forEach(button => {
      const size = button.dataset.size;
      const isActive = size === activeSize;
      
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive);
    });
  }

  /**
   * Announce font size change to screen readers
   * @param {string} size - New size
   */
  announceChange(size) {
    // Create or update announcement element
    let announcement = document.getElementById('font-size-announcement');
    if (!announcement) {
      announcement = document.createElement('div');
      announcement.id = 'font-size-announcement';
      announcement.className = 'sr-only';
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      document.body.appendChild(announcement);
    }

    announcement.textContent = `Text size changed to ${size}`;
  }

  /**
   * Get current font size
   * @returns {string} Current size key
   */
  getCurrentSize() {
    return this.currentSize;
  }
}

// Create singleton instance
const fontSizeControl = new FontSizeControl();

export default fontSizeControl;
