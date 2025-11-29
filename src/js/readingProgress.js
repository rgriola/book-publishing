/**
 * Reading Progress Module
 * Tracks and displays reading progress with bookmark functionality
 */

import debug from './debug.js';

class ReadingProgress {
  constructor() {
    this.storageKey = 'reading-progress';
    this.bookmarkKey = 'reading-bookmark';
    this.progressBar = null;
    this.progressText = null;
    this.resumeButton = null;
    this.currentChapter = null;
    this.scrollPosition = 0;
  }

  /**
   * Initialize reading progress tracking
   */
  init(currentChapter) {
    debug.log('Initializing reading progress...');
    
    this.currentChapter = currentChapter;
    
    // Create progress UI
    this.createProgressBar();
    this.createResumeButton();
    
    // Setup scroll tracking
    this.setupScrollTracking();
    
    // Load saved progress
    this.loadProgress();
    
    // Check for bookmark
    this.checkBookmark();
    
    debug.log('Reading progress initialized');
  }

  /**
   * Create progress bar UI
   */
  createProgressBar() {
    // Check if already exists
    if (document.querySelector('.reading-progress-bar')) {
      return;
    }

    const progressContainer = document.createElement('div');
    progressContainer.className = 'reading-progress-container';
    progressContainer.setAttribute('role', 'progressbar');
    progressContainer.setAttribute('aria-label', 'Reading progress');
    progressContainer.setAttribute('aria-valuemin', '0');
    progressContainer.setAttribute('aria-valuemax', '100');
    progressContainer.setAttribute('aria-valuenow', '0');

    // Progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    progressContainer.appendChild(progressBar);

    // Progress text (percentage)
    const progressText = document.createElement('div');
    progressText.className = 'reading-progress-text';
    progressText.textContent = '0%';
    progressContainer.appendChild(progressText);

    // Insert inside header at the bottom (so it sticks with the header)
    const header = document.querySelector('.reader-header');
    if (header) {
      header.appendChild(progressContainer);
    } else {
      // Fallback: insert at top of body if header not found
      document.body.insertBefore(progressContainer, document.body.firstChild);
    }

    this.progressBar = progressBar;
    this.progressText = progressText;
    this.progressContainer = progressContainer;

    debug.log('Progress bar created');
  }

  /**
   * Create resume reading button
   */
  createResumeButton() {
    const bookmark = this.getBookmark();
    if (!bookmark) return;

    // Don't show if already on the bookmarked chapter
    if (bookmark.chapter === this.currentChapter) return;

    // Check if button already exists
    if (document.querySelector('.resume-reading-btn')) return;

    const resumeBtn = document.createElement('button');
    resumeBtn.className = 'resume-reading-btn';
    resumeBtn.innerHTML = `
      <span class="resume-icon">📖</span>
      <span class="resume-text">
        <strong>Continue Reading</strong>
        <small>Chapter ${bookmark.chapter} • ${bookmark.progress}% complete</small>
      </span>
      <span class="resume-close" aria-label="Dismiss">✕</span>
    `;
    resumeBtn.setAttribute('aria-label', `Resume reading Chapter ${bookmark.chapter}`);

    // Click to resume
    resumeBtn.addEventListener('click', (e) => {
      if (e.target.classList.contains('resume-close')) {
        // Just dismiss the button
        resumeBtn.remove();
      } else {
        // Navigate to bookmarked chapter
        this.resumeReading();
      }
    });

    // Insert into content area
    const content = document.querySelector('.reader-content');
    if (content) {
      content.insertBefore(resumeBtn, content.firstChild);
      this.resumeButton = resumeBtn;
      debug.log(`Resume button created for Chapter ${bookmark.chapter}`);
    }
  }

  /**
   * Setup scroll tracking
   */
  setupScrollTracking() {
    let scrollTimeout;

    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Calculate progress percentage
      const scrollableHeight = documentHeight - windowHeight;
      const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
      const roundedProgress = Math.min(100, Math.max(0, Math.round(progress)));

      // Update UI
      this.updateProgressBar(roundedProgress);

      // Save progress (debounced)
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.saveProgress(roundedProgress, scrollTop);
      }, 500);
    };

    // Update on scroll
    window.addEventListener('scroll', updateProgress, { passive: true });

    // Update on resize
    window.addEventListener('resize', updateProgress, { passive: true });

    // Initial update
    setTimeout(updateProgress, 100);
  }

  /**
   * Update progress bar display
   */
  updateProgressBar(progress) {
    if (this.progressBar) {
      this.progressBar.style.width = `${progress}%`;
      this.progressContainer.setAttribute('aria-valuenow', progress);
    }
    
    if (this.progressText) {
      this.progressText.textContent = `${progress}%`;
    }
  }

  /**
   * Save reading progress
   */
  saveProgress(progress, scrollPosition) {
    if (!this.currentChapter) return;

    try {
      const progressData = {
        chapter: this.currentChapter,
        progress: progress,
        scrollPosition: scrollPosition,
        timestamp: Date.now()
      };

      localStorage.setItem(this.storageKey, JSON.stringify(progressData));
      
      // Auto-bookmark if progress > 10%
      if (progress > 10) {
        this.saveBookmark(progress, scrollPosition);
      }

      debug.log(`Progress saved: Chapter ${this.currentChapter} - ${progress}%`);
    } catch (error) {
      debug.warn('Could not save progress:', error);
    }
  }

  /**
   * Load saved progress
   */
  loadProgress() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) return;

      const progressData = JSON.parse(saved);
      
      // Only restore if it's the same chapter
      if (progressData.chapter === this.currentChapter) {
        debug.log(`Loaded progress: ${progressData.progress}%`);
        // Don't auto-scroll, just update the bar
        this.updateProgressBar(progressData.progress);
      }
    } catch (error) {
      debug.warn('Could not load progress:', error);
    }
  }

  /**
   * Save bookmark
   */
  saveBookmark(progress, scrollPosition) {
    if (!this.currentChapter) return;

    try {
      const bookmark = {
        chapter: this.currentChapter,
        progress: progress,
        scrollPosition: scrollPosition,
        timestamp: Date.now(),
        date: new Date().toLocaleDateString()
      };

      localStorage.setItem(this.bookmarkKey, JSON.stringify(bookmark));
      debug.log(`Bookmark saved: Chapter ${this.currentChapter}`);
    } catch (error) {
      debug.warn('Could not save bookmark:', error);
    }
  }

  /**
   * Get saved bookmark
   */
  getBookmark() {
    try {
      const saved = localStorage.getItem(this.bookmarkKey);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      debug.warn('Could not load bookmark:', error);
      return null;
    }
  }

  /**
   * Check if there's a bookmark to resume from
   */
  checkBookmark() {
    const bookmark = this.getBookmark();
    if (!bookmark) return;

    // If we're on the bookmarked chapter, scroll to saved position
    if (bookmark.chapter === this.currentChapter && bookmark.scrollPosition > 100) {
      this.showScrollPrompt(bookmark.scrollPosition);
    }
  }

  /**
   * Show prompt to scroll to saved position
   */
  showScrollPrompt(scrollPosition) {
    // Create a subtle prompt
    const prompt = document.createElement('div');
    prompt.className = 'scroll-prompt';
    prompt.innerHTML = `
      <span>Continue from where you left off?</span>
      <button class="scroll-prompt-btn">Yes</button>
      <button class="scroll-prompt-btn secondary">No</button>
    `;

    const content = document.querySelector('.reader-content');
    if (!content) return;

    content.insertBefore(prompt, content.firstChild);

    // Handle buttons
    const buttons = prompt.querySelectorAll('.scroll-prompt-btn');
    buttons[0].addEventListener('click', () => {
      window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
      prompt.remove();
    });
    buttons[1].addEventListener('click', () => {
      prompt.remove();
    });

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (prompt.parentNode) {
        prompt.remove();
      }
    }, 10000);
  }

  /**
   * Resume reading from bookmark
   */
  resumeReading() {
    const bookmark = this.getBookmark();
    if (!bookmark) return;

    debug.log(`Resuming Chapter ${bookmark.chapter}`);

    // Navigate to chapter
    if (bookmark.chapter !== this.currentChapter) {
      // Trigger chapter load (assumes navigation module is available)
      window.location.href = `reader.html?chapter=${bookmark.chapter}`;
    } else {
      // Just scroll to position
      window.scrollTo({ top: bookmark.scrollPosition, behavior: 'smooth' });
      if (this.resumeButton) {
        this.resumeButton.remove();
      }
    }
  }

  /**
   * Clear bookmark
   */
  clearBookmark() {
    try {
      localStorage.removeItem(this.bookmarkKey);
      if (this.resumeButton) {
        this.resumeButton.remove();
      }
      debug.log('Bookmark cleared');
    } catch (error) {
      debug.warn('Could not clear bookmark:', error);
    }
  }

  /**
   * Get reading statistics
   */
  getStatistics() {
    const bookmark = this.getBookmark();
    const progress = localStorage.getItem(this.storageKey);
    
    return {
      hasBookmark: !!bookmark,
      currentChapter: bookmark?.chapter || null,
      progress: bookmark?.progress || 0,
      lastRead: bookmark?.date || null,
      timestamp: bookmark?.timestamp || null
    };
  }

  /**
   * Update current chapter (called when chapter changes)
   */
  updateChapter(chapterNumber) {
    this.currentChapter = chapterNumber;
    
    // Remove old resume button if exists
    if (this.resumeButton) {
      this.resumeButton.remove();
      this.resumeButton = null;
    }
    
    // Create new resume button if needed
    this.createResumeButton();
    
    // Reset progress bar
    this.updateProgressBar(0);
    
    debug.log(`Chapter updated to: ${chapterNumber}`);
  }
}

// Create singleton instance
const readingProgress = new ReadingProgress();

export default readingProgress;
