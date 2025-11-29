/**
 * Navigation Module
 * Handles chapter navigation, menu generation, and URL routing
 */

import config from './config.js';
import debug from './debug.js';
import chapterLoader from './chapterLoader.js';

class Navigation {
  constructor() {
    this.currentChapter = null;
    this.onChapterChange = null;
  }

  /**
   * Initialize navigation
   * @param {Function} onChapterChange - Callback when chapter changes
   */
  init(onChapterChange) {
    this.onChapterChange = onChapterChange;
    this.setupHashListener();
    this.loadFromHash();
  }

  /**
   * Setup hash change listener
   */
  setupHashListener() {
    window.addEventListener('hashchange', () => {
      debug.log('Hash changed:', window.location.hash);
      this.loadFromHash();
    });
  }

  /**
   * Load chapter from URL hash
   */
  loadFromHash() {
    const hash = window.location.hash;
    
    if (!hash || hash === '#') {
      // Default to chapter 1
      this.navigateToChapter(1, false);
      return;
    }

    // Extract chapter number from hash (e.g., #chapter-1)
    const match = hash.match(/#chapter-(\d+)/);
    
    if (match) {
      const chapterNumber = parseInt(match[1]);
      if (config.isValidChapter(chapterNumber)) {
        this.navigateToChapter(chapterNumber, false);
      } else {
        debug.warn(`Invalid chapter number in hash: ${chapterNumber}`);
        this.navigateToChapter(1);
      }
    } else {
      debug.warn(`Invalid hash format: ${hash}`);
      this.navigateToChapter(1);
    }
  }

  /**
   * Navigate to a specific chapter
   * @param {number} chapterNumber - The chapter to navigate to
   * @param {boolean} updateHash - Whether to update the URL hash
   */
  navigateToChapter(chapterNumber, updateHash = true) {
    if (!config.isValidChapter(chapterNumber)) {
      debug.error(`Cannot navigate to invalid chapter: ${chapterNumber}`);
      return;
    }

    debug.log(`Navigating to chapter ${chapterNumber}`);

    this.currentChapter = chapterNumber;

    // Update hash if needed
    if (updateHash) {
      window.location.hash = `chapter-${chapterNumber}`;
    }

    // Call the chapter change callback
    if (this.onChapterChange) {
      this.onChapterChange(chapterNumber);
    }

    // Update navigation UI
    this.updateNavigationUI();

    // Scroll to top
    window.scrollTo(0, 0);

    // Preload adjacent chapters
    this.preloadAdjacentChapters(chapterNumber);
  }

  /**
   * Navigate to next chapter
   */
  nextChapter() {
    if (this.currentChapter < config.chapters.total) {
      this.navigateToChapter(this.currentChapter + 1);
    } else {
      debug.log('Already on last chapter');
    }
  }

  /**
   * Navigate to previous chapter
   */
  previousChapter() {
    if (this.currentChapter > 1) {
      this.navigateToChapter(this.currentChapter - 1);
    } else {
      debug.log('Already on first chapter');
    }
  }

  /**
   * Update navigation UI (buttons, menu)
   */
  updateNavigationUI() {
    // Update prev/next buttons
    const prevBtn = document.getElementById('prev-chapter');
    const nextBtn = document.getElementById('next-chapter');

    if (prevBtn) {
      prevBtn.disabled = this.currentChapter <= 1;
      prevBtn.setAttribute('aria-disabled', this.currentChapter <= 1);
    }

    if (nextBtn) {
      nextBtn.disabled = this.currentChapter >= config.chapters.total;
      nextBtn.setAttribute('aria-disabled', this.currentChapter >= config.chapters.total);
    }

    // Update chapter menu
    this.updateChapterMenu();

    // Update current chapter display
    const chapterInfo = document.getElementById('current-chapter-info');
    if (chapterInfo) {
      chapterInfo.textContent = `Chapter ${this.currentChapter} of ${config.chapters.total}`;
    }
  }

  /**
   * Update chapter menu to highlight current chapter
   */
  updateChapterMenu() {
    const menuItems = document.querySelectorAll('.chapter-menu-item');
    menuItems.forEach(item => {
      const chapterNum = parseInt(item.dataset.chapter);
      if (chapterNum === this.currentChapter) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'page');
      } else {
        item.classList.remove('active');
        item.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Preload adjacent chapters for faster navigation
   * @param {number} chapterNumber - Current chapter number
   */
  preloadAdjacentChapters(chapterNumber) {
    // Preload next chapter
    if (chapterNumber < config.chapters.total) {
      chapterLoader.preload(chapterNumber + 1);
    }

    // Preload previous chapter
    if (chapterNumber > 1) {
      chapterLoader.preload(chapterNumber - 1);
    }
  }

  /**
   * Generate chapter menu HTML
   * @returns {Promise<string>} HTML string for chapter menu
   */
  async generateChapterMenu() {
    debug.log('Generating chapter menu');
    
    const chapters = chapterLoader.getAllChapterNumbers();
    const menuItems = [];

    for (const chapterNum of chapters) {
      try {
        const title = await chapterLoader.getTitle(chapterNum);
        const isActive = chapterNum === this.currentChapter;
        
        menuItems.push(`
          <li>
            <a href="#chapter-${chapterNum}" 
               class="chapter-menu-item ${isActive ? 'active' : ''}"
               data-chapter="${chapterNum}"
               ${isActive ? 'aria-current="page"' : ''}>
              <span class="chapter-number">${chapterNum}</span>
              <span class="chapter-title">${title}</span>
            </a>
          </li>
        `);
      } catch (error) {
        debug.warn(`Could not load title for chapter ${chapterNum}`, error);
        menuItems.push(`
          <li>
            <a href="#chapter-${chapterNum}" 
               class="chapter-menu-item"
               data-chapter="${chapterNum}">
              <span class="chapter-number">${chapterNum}</span>
              <span class="chapter-title">Chapter ${chapterNum}</span>
            </a>
          </li>
        `);
      }
    }

    return `<ul class="chapter-menu">${menuItems.join('')}</ul>`;
  }

  /**
   * Setup navigation button event listeners
   */
  setupNavigationButtons() {
    const prevBtn = document.getElementById('prev-chapter');
    const nextBtn = document.getElementById('next-chapter');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.previousChapter();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.nextChapter();
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Left arrow or 'p' for previous
      if (e.key === 'ArrowLeft' || e.key === 'p') {
        this.previousChapter();
      }
      // Right arrow or 'n' for next
      if (e.key === 'ArrowRight' || e.key === 'n') {
        this.nextChapter();
      }
    });

    debug.log('Navigation buttons setup complete');
  }

  /**
   * Get current chapter number
   * @returns {number|null} Current chapter number
   */
  getCurrentChapter() {
    return this.currentChapter;
  }
}

// Create singleton instance
const navigation = new Navigation();

export default navigation;
