/**
 * Analytics Module
 * Tracks chapter views and reading statistics
 * Stores data in localStorage
 */

import config from './config.js';
import debug from './debug.js';

class Analytics {
  constructor() {
    this.storageKey = config.analytics.storageKey;
    this.data = this.loadData();
  }

  /**
   * Load analytics data from localStorage
   * @returns {Object} Analytics data
   */
  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        debug.log('Analytics data loaded from localStorage');
        return data;
      }
    } catch (error) {
      debug.error('Error loading analytics data:', error);
    }

    // Return default structure
    return this.getDefaultData();
  }

  /**
   * Get default analytics data structure
   * @returns {Object} Default analytics data
   */
  getDefaultData() {
    const chapters = {};
    for (let i = 1; i <= config.chapters.total; i++) {
      chapters[i] = {
        views: 0,
        lastViewed: null,
        title: `${config.chapters.defaultTitle} ${i}`
      };
    }

    return {
      chapters: chapters,
      totalViews: 0,
      lastUpdated: null,
      firstVisit: new Date().toISOString()
    };
  }

  /**
   * Save analytics data to localStorage
   */
  saveData() {
    try {
      this.data.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
      debug.log('Analytics data saved to localStorage');
    } catch (error) {
      debug.error('Error saving analytics data:', error);
    }
  }

  /**
   * Track a chapter view
   * @param {number} chapterNumber - The chapter number
   * @param {string} title - The chapter title (optional)
   */
  trackView(chapterNumber, title = null) {
    if (!config.analytics.enabled) {
      return;
    }

    if (!config.isValidChapter(chapterNumber)) {
      debug.warn(`Invalid chapter number for analytics: ${chapterNumber}`);
      return;
    }

    const chapterKey = String(chapterNumber);

    // Initialize chapter data if it doesn't exist
    if (!this.data.chapters[chapterKey]) {
      this.data.chapters[chapterKey] = {
        views: 0,
        lastViewed: null,
        title: title || `${config.chapters.defaultTitle} ${chapterNumber}`
      };
    }

    // Update chapter data
    this.data.chapters[chapterKey].views++;
    this.data.chapters[chapterKey].lastViewed = new Date().toISOString();
    
    if (title) {
      this.data.chapters[chapterKey].title = title;
    }

    // Update total views
    this.data.totalViews++;

    // Save to localStorage
    this.saveData();

    debug.log(`Chapter ${chapterNumber} view tracked (total: ${this.data.chapters[chapterKey].views})`);
  }

  /**
   * Get analytics data for a specific chapter
   * @param {number} chapterNumber - The chapter number
   * @returns {Object} Chapter analytics data
   */
  getChapterData(chapterNumber) {
    const chapterKey = String(chapterNumber);
    return this.data.chapters[chapterKey] || {
      views: 0,
      lastViewed: null,
      title: `${config.chapters.defaultTitle} ${chapterNumber}`
    };
  }

  /**
   * Get all analytics data
   * @returns {Object} All analytics data
   */
  getAllData() {
    return { ...this.data };
  }

  /**
   * Get most viewed chapters
   * @param {number} limit - Number of top chapters to return
   * @returns {Array} Array of chapter data sorted by views
   */
  getMostViewed(limit = 5) {
    const chapters = Object.entries(this.data.chapters)
      .map(([number, data]) => ({
        number: parseInt(number),
        ...data
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);

    return chapters;
  }

  /**
   * Get recently viewed chapters
   * @param {number} limit - Number of recent chapters to return
   * @returns {Array} Array of chapter data sorted by last viewed
   */
  getRecentlyViewed(limit = 5) {
    const chapters = Object.entries(this.data.chapters)
      .map(([number, data]) => ({
        number: parseInt(number),
        ...data
      }))
      .filter(chapter => chapter.lastViewed !== null)
      .sort((a, b) => new Date(b.lastViewed) - new Date(a.lastViewed))
      .slice(0, limit);

    return chapters;
  }

  /**
   * Get total number of views across all chapters
   * @returns {number} Total views
   */
  getTotalViews() {
    return this.data.totalViews;
  }

  /**
   * Reset all analytics data
   */
  reset() {
    this.data = this.getDefaultData();
    this.saveData();
    debug.log('Analytics data reset');
  }

  /**
   * Export analytics data as JSON string
   * @returns {string} JSON string of analytics data
   */
  export() {
    return JSON.stringify(this.data, null, 2);
  }

  /**
   * Import analytics data from JSON string
   * @param {string} jsonString - JSON string of analytics data
   * @returns {boolean} Success status
   */
  import(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      // Validate structure
      if (data.chapters && typeof data.totalViews === 'number') {
        this.data = data;
        this.saveData();
        debug.log('Analytics data imported successfully');
        return true;
      } else {
        debug.error('Invalid analytics data format');
        return false;
      }
    } catch (error) {
      debug.error('Error importing analytics data:', error);
      return false;
    }
  }

  /**
   * Get summary statistics
   * @returns {Object} Summary statistics
   */
  getSummary() {
    const chapters = Object.entries(this.data.chapters);
    const viewedChapters = chapters.filter(([_, data]) => data.views > 0);
    const avgViews = viewedChapters.length > 0 
      ? this.data.totalViews / viewedChapters.length 
      : 0;

    return {
      totalChapters: config.chapters.total,
      chaptersViewed: viewedChapters.length,
      totalViews: this.data.totalViews,
      averageViews: Math.round(avgViews * 100) / 100,
      firstVisit: this.data.firstVisit,
      lastUpdated: this.data.lastUpdated
    };
  }
}

// Create singleton instance
const analytics = new Analytics();

export default analytics;
