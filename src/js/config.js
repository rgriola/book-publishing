/**
 * Configuration Module
 * Centralized configuration for URLs, paths, and settings
 * Automatically detects environment (development vs production)
 */

const config = {
  // Environment detection
  env: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'development' 
    : 'production',

  // Base URLs (auto-detected)
  get baseURL() {
    // Prefer an injected global (set by hosting environment) -> development default -> runtime origin
    if (window.__SITE_BASE_URL__) return window.__SITE_BASE_URL__;
    return this.env === 'development'
      ? 'http://localhost:5500'
      : window.location.origin;
  },

  // Paths (environment-aware) - use relative paths so hosts like Netlify work without a repo prefix
  get paths() {
    return {
      chapters: 'chapters/',
      assets: 'assets/',
      images: 'assets/images/',
      data: 'assets/data/'
    };
  },

  // Chapter configuration
  chapters: {
    total: 21,
    filePrefix: 'chapter-',
    fileExtension: '.html',
    defaultTitle: 'Chapter'
  },

  // Analytics configuration
  get analytics() {
    return {
      enabled: true,
      storageKey: 'immigrantStoryAnalytics',
      dataFile: `${this.paths.data}analytics.json`
    };
  },

  // Admin configuration
  admin: {
    get code() {
      return atob('ODEyMw==');
    },
    sessionKey: 'adminAuthenticated'
  },

  // Debug configuration
  get debug() {
    return this.env === 'development';
  },

  // Cache configuration
  get cacheEnabled() {
    return this.env === 'production';
  },

  // Allowed HTML tags for sanitization
  sanitization: {
    allowedTags: [
      'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'em', 'strong', 'i', 'b', 'u',
      'ul', 'ol', 'li',
      'blockquote', 'q', 'cite',
      'a', 'span', 'div',
      'article', 'section', 'header', 'footer',
      'hr', 'pre', 'code'
    ],
    allowedAttributes: {
      'a': ['href', 'title', 'target'],
      'span': ['class'],
      'div': ['class'],
      'article': ['class'],
      'section': ['class']
    }
  },

  // Get chapter file path
  getChapterPath(chapterNumber) {
    const num = String(chapterNumber).padStart(2, '0');
    return `${this.paths.chapters}${this.chapters.filePrefix}${num}${this.chapters.fileExtension}`;
  },

  // Get chapter URL with hash
  getChapterURL(chapterNumber) {
    return `reader.html#chapter-${chapterNumber}`;
  },

  // Validate chapter number
  isValidChapter(chapterNumber) {
    const num = parseInt(chapterNumber);
    return !isNaN(num) && num >= 1 && num <= this.chapters.total;
  }
};

// Freeze config to prevent modifications
Object.freeze(config);

export default config;
