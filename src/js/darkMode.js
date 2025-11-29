/**
 * Dark Mode Control Module
 * Manages theme switching between light and dark modes
 */

import debug from './debug.js';

class DarkMode {
  constructor() {
    this.storageKey = 'theme-preference';
    this.themes = {
      light: 'light',
      dark: 'dark'
    };
    this.currentTheme = this.themes.light;
  }

  /**
   * Initialize dark mode control
   */
  init() {
    debug.log('Initializing dark mode control...');
    
    // Load saved theme preference
    this.loadSavedTheme();
    
    // Create control UI
    this.createControl();
    
    // Apply theme
    this.applyTheme(this.currentTheme);
    
    // Listen for system preference changes if in auto mode
    this.setupSystemThemeListener();
    
    debug.log('Dark mode control initialized');
  }

  /**
   * Load saved theme from localStorage
   */
  loadSavedTheme() {
    try {
      const savedTheme = localStorage.getItem(this.storageKey);
      if (savedTheme && this.themes[savedTheme]) {
        this.currentTheme = savedTheme;
        debug.log(`Loaded saved theme: ${savedTheme}`);
      }
    } catch (error) {
      debug.warn('Could not load saved theme:', error);
    }
  }

  /**
   * Save theme preference to localStorage
   */
  saveTheme(theme) {
    try {
      localStorage.setItem(this.storageKey, theme);
      debug.log(`Saved theme preference: ${theme}`);
    } catch (error) {
      debug.warn('Could not save theme preference:', error);
    }
  }

  /**
   * Create dark mode control UI
   */
  createControl() {
    const header = document.querySelector('.reader-header');
    if (!header) {
      debug.warn('Reader header not found, cannot create dark mode control');
      return;
    }

    // Create control container
    const controlContainer = document.createElement('div');
    controlContainer.className = 'dark-mode-control';
    controlContainer.setAttribute('role', 'group');
    controlContainer.setAttribute('aria-label', 'Theme selection');

    // Create theme buttons
    const themes = [
      { id: 'light', label: '☀️', title: 'Light theme' },
      { id: 'dark', label: '🌙', title: 'Dark theme' }
    ];

    themes.forEach(theme => {
      const button = document.createElement('button');
      button.className = 'theme-btn';
      button.setAttribute('data-theme', theme.id);
      button.setAttribute('title', theme.title);
      button.setAttribute('aria-label', theme.title);
      button.textContent = theme.label;
      
      // Set initial active state
      if (theme.id === this.currentTheme) {
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
      } else {
        button.setAttribute('aria-pressed', 'false');
      }
      
      button.addEventListener('click', () => this.setTheme(theme.id));
      controlContainer.appendChild(button);
    });

    // Insert control into header
    const flexContainer = header.querySelector('.flex');
    const fontSizeControl = document.querySelector('.font-size-control');
    
    if (flexContainer && fontSizeControl) {
      // Insert before font size control
      flexContainer.insertBefore(controlContainer, fontSizeControl);
    } else if (flexContainer) {
      // Insert at the beginning of flex container
      const firstChild = flexContainer.firstChild;
      if (firstChild) {
        flexContainer.insertBefore(controlContainer, firstChild);
      } else {
        flexContainer.appendChild(controlContainer);
      }
    } else {
      debug.warn('Could not find proper insertion point for dark mode control');
      header.appendChild(controlContainer);
    }

    debug.log('Dark mode control UI created');
  }

  /**
   * Apply theme to the document
   */
  applyTheme(theme) {
    const html = document.documentElement;
    
    // Remove existing theme classes
    html.classList.remove('theme-light', 'theme-dark');
    
    // Add new theme class
    html.classList.add(`theme-${theme}`);
    
    // Set data attribute for CSS
    html.setAttribute('data-theme', theme);
    
    debug.log(`Applied theme: ${theme}`);
  }

  /**
   * Set theme and update UI
   */
  setTheme(theme) {
    if (!this.themes[theme]) {
      debug.warn(`Invalid theme: ${theme}`);
      return;
    }
    
    this.currentTheme = theme;
    this.saveTheme(theme);
    this.applyTheme(theme);
    this.updateButtons();
    this.announceChange(theme);
  }

  /**
   * Update button states
   */
  updateButtons() {
    const buttons = document.querySelectorAll('.theme-btn');
    buttons.forEach(button => {
      const isActive = button.getAttribute('data-theme') === this.currentTheme;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  /**
   * Announce theme change to screen readers
   */
  announceChange(theme) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Theme changed to ${theme}`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Setup listener for system theme changes
   */
  setupSystemThemeListener() {
    // No longer needed without auto mode
  }
}

// Create singleton instance
const darkMode = new DarkMode();

export default darkMode;
