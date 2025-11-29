/**
 * Chapter Loader Module
 * Handles loading, parsing, and sanitizing chapter content
 * Extracts chapter titles from HTML content
 */

import config from './config.js';
import debug from './debug.js';

class ChapterLoader {
  constructor() {
    this.cache = new Map();
    this.chapterTitles = new Map();
  }

  /**
   * Load a chapter by number
   * @param {number} chapterNumber - The chapter number (1-20)
   * @returns {Promise<Object>} Chapter data with content and title
   */
  async loadChapter(chapterNumber) {
    debug.timeStart(`loadChapter-${chapterNumber}`);
    
    if (!config.isValidChapter(chapterNumber)) {
      debug.error(`Invalid chapter number: ${chapterNumber}`);
      throw new Error(`Chapter ${chapterNumber} does not exist`);
    }

    // Check cache first
    if (config.cacheEnabled && this.cache.has(chapterNumber)) {
      debug.log(`Loading chapter ${chapterNumber} from cache`);
      debug.timeEnd(`loadChapter-${chapterNumber}`);
      return this.cache.get(chapterNumber);
    }

    try {
      const chapterPath = config.getChapterPath(chapterNumber);
      debug.log(`Fetching chapter from: ${chapterPath}`);

      const response = await fetch(chapterPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load chapter: ${response.statusText}`);
      }

      const html = await response.text();
      const sanitizedHTML = this.sanitizeHTML(html);
      const title = this.extractTitle(sanitizedHTML, chapterNumber);

      const chapterData = {
        number: chapterNumber,
        title: title,
        content: sanitizedHTML,
        loadedAt: new Date().toISOString()
      };

      // Cache the result
      if (config.cacheEnabled) {
        this.cache.set(chapterNumber, chapterData);
      }

      // Store title for quick access
      this.chapterTitles.set(chapterNumber, title);

      debug.log(`Chapter ${chapterNumber} loaded successfully: "${title}"`);
      debug.timeEnd(`loadChapter-${chapterNumber}`);

      return chapterData;

    } catch (error) {
      debug.error(`Error loading chapter ${chapterNumber}:`, error);
      debug.timeEnd(`loadChapter-${chapterNumber}`);
      throw error;
    }
  }

  /**
   * Extract title from chapter HTML
   * Looks for <h1>, then <h2>, then uses default
   * @param {string} html - Chapter HTML content
   * @param {number} chapterNumber - Chapter number for fallback
   * @returns {string} Extracted or default title
   */
  extractTitle(html, chapterNumber) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Try to find h1 first
    let titleElement = doc.querySelector('h1');
    
    // Fall back to h2
    if (!titleElement) {
      titleElement = doc.querySelector('h2');
    }

    if (titleElement) {
      const title = titleElement.textContent.trim();
      debug.log(`Extracted title from HTML: "${title}"`);
      return title;
    }

    // Default fallback
    const defaultTitle = `${config.chapters.defaultTitle} ${chapterNumber}`;
    debug.warn(`No title found in chapter ${chapterNumber}, using default: "${defaultTitle}"`);
    return defaultTitle;
  }

  /**
   * Sanitize HTML content to prevent XSS
   * @param {string} html - Raw HTML content
   * @returns {string} Sanitized HTML
   */
  sanitizeHTML(html) {
    debug.log('Sanitizing HTML content');
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove script tags and event handlers
    this.removeScripts(doc);
    this.removeEventHandlers(doc);
    
    // Filter allowed tags
    this.filterTags(doc.body);
    
    return doc.body.innerHTML;
  }

  /**
   * Remove all script tags
   */
  removeScripts(doc) {
    const scripts = doc.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    debug.log(`Removed ${scripts.length} script tags`);
  }

  /**
   * Remove event handler attributes (onclick, onerror, etc.)
   */
  removeEventHandlers(doc) {
    const allElements = doc.querySelectorAll('*');
    let removedCount = 0;
    
    allElements.forEach(element => {
      const attributes = Array.from(element.attributes);
      attributes.forEach(attr => {
        if (attr.name.startsWith('on')) {
          element.removeAttribute(attr.name);
          removedCount++;
        }
      });
    });
    
    if (removedCount > 0) {
      debug.warn(`Removed ${removedCount} event handler attributes`);
    }
  }

  /**
   * Filter elements to only allowed tags
   */
  filterTags(element) {
    const children = Array.from(element.children);
    
    children.forEach(child => {
      if (!config.sanitization.allowedTags.includes(child.tagName.toLowerCase())) {
        debug.warn(`Removing disallowed tag: <${child.tagName.toLowerCase()}>`);
        // Replace with its content
        while (child.firstChild) {
          element.insertBefore(child.firstChild, child);
        }
        child.remove();
      } else {
        // Filter attributes
        this.filterAttributes(child);
        // Recursively filter children
        this.filterTags(child);
      }
    });
  }

  /**
   * Filter attributes to only allowed ones
   */
  filterAttributes(element) {
    const tagName = element.tagName.toLowerCase();
    const allowedAttrs = config.sanitization.allowedAttributes[tagName] || [];
    const attributes = Array.from(element.attributes);
    
    attributes.forEach(attr => {
      if (!allowedAttrs.includes(attr.name)) {
        element.removeAttribute(attr.name);
      }
    });
  }

  /**
   * Get chapter title (from cache if available)
   * @param {number} chapterNumber - The chapter number
   * @returns {Promise<string>} Chapter title
   */
  async getTitle(chapterNumber) {
    if (this.chapterTitles.has(chapterNumber)) {
      return this.chapterTitles.get(chapterNumber);
    }

    const chapterData = await this.loadChapter(chapterNumber);
    return chapterData.title;
  }

  /**
   * Preload a chapter (without displaying)
   * @param {number} chapterNumber - The chapter number
   */
  async preload(chapterNumber) {
    debug.log(`Preloading chapter ${chapterNumber}`);
    try {
      await this.loadChapter(chapterNumber);
    } catch (error) {
      debug.error(`Failed to preload chapter ${chapterNumber}`, error);
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    debug.log('Cache cleared');
  }

  /**
   * Get all available chapter numbers
   * @returns {Array<number>} Array of chapter numbers
   */
  getAllChapterNumbers() {
    return Array.from({ length: config.chapters.total }, (_, i) => i + 1);
  }
}

// Create singleton instance
const chapterLoader = new ChapterLoader();

export default chapterLoader;
