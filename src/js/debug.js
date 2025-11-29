/**
 * Debug Module
 * Simple debug system that can be toggled on/off
 * Provides logging, warnings, errors, and performance monitoring
 */

import config from './config.js';

class Debug {
  constructor() {
    this.enabled = config.debug;
    this.timers = new Map();
  }

  /**
   * Enable debug mode
   */
  enable() {
    this.enabled = true;
    this.log('Debug mode enabled');
  }

  /**
   * Disable debug mode
   */
  disable() {
    this.log('Debug mode disabled');
    this.enabled = false;
  }

  /**
   * Toggle debug mode
   */
  toggle() {
    this.enabled = !this.enabled;
    console.log(`Debug mode ${this.enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Log a debug message
   */
  log(...args) {
    if (this.enabled) {
      console.log('[DEBUG]', ...args);
    }
  }

  /**
   * Log a warning
   */
  warn(...args) {
    if (this.enabled) {
      console.warn('[DEBUG WARNING]', ...args);
    }
  }

  /**
   * Log an error
   */
  error(...args) {
    if (this.enabled) {
      console.error('[DEBUG ERROR]', ...args);
    }
  }

  /**
   * Log an info message
   */
  info(...args) {
    if (this.enabled) {
      console.info('[DEBUG INFO]', ...args);
    }
  }

  /**
   * Start a performance timer
   */
  timeStart(label) {
    if (this.enabled) {
      this.timers.set(label, performance.now());
      this.log(`Timer started: ${label}`);
    }
  }

  /**
   * End a performance timer and log the duration
   */
  timeEnd(label) {
    if (this.enabled && this.timers.has(label)) {
      const duration = performance.now() - this.timers.get(label);
      this.log(`Timer ${label}: ${duration.toFixed(2)}ms`);
      this.timers.delete(label);
    }
  }

  /**
   * Log object/data in a formatted table
   */
  table(data) {
    if (this.enabled) {
      console.table(data);
    }
  }

  /**
   * Group related log messages
   */
  group(label) {
    if (this.enabled) {
      console.group(`[DEBUG] ${label}`);
    }
  }

  /**
   * End a log group
   */
  groupEnd() {
    if (this.enabled) {
      console.groupEnd();
    }
  }

  /**
   * Assert a condition
   */
  assert(condition, message) {
    if (this.enabled && !condition) {
      console.assert(condition, `[DEBUG ASSERT] ${message}`);
    }
  }

  /**
   * Get current debug status
   */
  get status() {
    return this.enabled ? 'enabled' : 'disabled';
  }
}

// Create singleton instance
const debug = new Debug();

// Expose to window for console access
if (typeof window !== 'undefined') {
  window.debug = debug;
}

export default debug;
