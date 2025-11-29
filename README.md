# An Immigrant's Story
### A Novel by Dick Griola

A beautiful, responsive website for reading "An Immigrant's Story" online.

## 🚀 Features

- **Responsive Design** - Optimized for laptop, tablet (iPad), and mobile devices
- **Easy Chapter Management** - Simply add HTML files to the `chapters/` folder
- **Analytics Dashboard** - Track chapter views and reading statistics
- **Security** - HTML sanitization and input validation
- **Debug System** - Toggle-able debug mode for development
- **No Build Required** - Pure HTML, CSS, and JavaScript (ES6 modules)

## 📁 Project Structure

```
Grandpas-Story/
├── index.html                 # Landing page
├── reader.html                # Chapter reader
├── admin.html                 # Analytics dashboard
├── chapters/                  # Chapter HTML files
│   ├── chapter-01.html
│   ├── chapter-02.html
│   └── ... (up to chapter-20.html)
├── src/
│   ├── js/                    # JavaScript modules
│   │   ├── config.js          # Configuration
│   │   ├── debug.js           # Debug system
│   │   ├── chapterLoader.js   # Chapter loading
│   │   ├── navigation.js      # Navigation
│   │   ├── analytics.js       # Analytics
│   │   ├── reader.js          # Reader page
│   │   ├── admin.js           # Admin page
│   │   └── main.js            # Landing page
│   └── css/                   # Stylesheets
│       ├── main.css
│       ├── typography.css
│       ├── layout.css
│       ├── components.css
│       ├── landing.css
│       └── reader.css
├── assets/
│   ├── images/                # Images and placeholders
│   └── data/                  # Analytics data
├── .env.development           # Development config
└── .env.production            # Production config
```

## 🎯 Getting Started

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/rgriola/book-publishing.git
   cd book-publishing
   ```

2. **Set up environment files**
   ```bash
   # Copy example files to create your local configs
   cp .env.development.example .env.development
   cp .env.production.example .env.production
   
   # Edit them to add your admin code
   # Change ADMIN_CODE=your_admin_code_here to your password
   ```

### Local Development

1. **Open with Live Server**
   - Open the project in VS Code
   - Install the "Live Server" extension if you haven't already
   - Right-click on `index.html` and select "Open with Live Server"
   - The site will open at `http://localhost:5500`

2. **Navigate the Site**
   - Landing page: `http://localhost:5500/index.html`
   - Reader: `http://localhost:5500/reader.html`
   - Admin: `http://localhost:5500/admin.html`

### Adding Chapters

1. Create a new file in the `chapters/` folder (e.g., `chapter-02.html`)
2. Use this format:

```html
<article class="chapter">
  <h1>Your Chapter Title</h1>
  
  <p>Your chapter content here...</p>
  
  <!-- Use any standard HTML tags -->
</article>
```

3. The chapter will automatically appear in the navigation menu
4. The title is extracted from the first `<h1>` tag

### Editing Content

**Landing Page:**
- Edit `index.html` to update book description, author bio, etc.
- Replace placeholder images in `assets/images/`

**Chapter Content:**
- Simply paste your HTML into the chapter files
- The system sanitizes HTML for security
- Allowed tags: `p, h1-h6, em, strong, ul, ol, li, blockquote, a, div, span, etc.`

## 🔐 Admin Dashboard

**Access:** `admin.html`  
**Security Code:** `8123`

The admin dashboard shows:
- Total views across all chapters
- Most viewed chapters
- Recently viewed chapters
- Complete chapter statistics
- Export/import analytics data

Analytics are stored in browser localStorage.

## 🛠️ Configuration

### Development vs Production

Edit `.env.development` and `.env.production` to configure:
- Debug mode
- Base URLs
- Analytics settings
- Admin security code

The system auto-detects the environment based on hostname.

### Debug Mode

In the browser console:
```javascript
debug.enable()   // Turn on debug mode
debug.disable()  // Turn off debug mode
debug.log('message')  // Log a debug message
```

## 🌐 Deployment

### GitHub Pages

1. Push your code to GitHub
2. Go to Settings > Pages
3. Select your branch and root folder
4. Your site will be live at `https://[username].github.io/[repo-name]`

### Render.com

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set build command: (none needed)
4. Set publish directory: `.`
5. Deploy!

### Custom Domain with CloudFlare

1. Add your custom domain in Render/GitHub Pages settings
2. Update DNS records in CloudFlare
3. Update `BASE_URL` in `.env.production` and `src/js/config.js`

## 📱 Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet (iPad):** 768px - 1024px
- **Laptop/Desktop:** > 1024px

## ⌨️ Keyboard Shortcuts (Reader)

- **←** or **P** - Previous chapter
- **→** or **N** - Next chapter
- **Esc** - Close chapter menu (mobile)

## 🎨 Customization

### Colors

Edit CSS variables in `src/css/main.css`:
```css
:root {
  --color-primary: #2c3e50;
  --color-accent: #3498db;
  /* ... etc */
}
```

### Typography

Edit `src/css/typography.css` for reading experience:
- Font families
- Font sizes
- Line heights
- Drop caps (first letter)

## 🔒 Security Features

- HTML sanitization (removes `<script>` tags and event handlers)
- Input validation for chapter numbers
- Admin authentication with session management
- Content Security Policy ready
- XSS prevention

## 📊 Analytics

Analytics are stored locally in the browser using localStorage:
- Chapter view counts
- Last viewed timestamps
- Total views
- Reading progress

Data persists across sessions and can be exported/imported.

## 🐛 Troubleshooting

**Chapter not loading?**
- Check console for errors (F12)
- Ensure chapter file exists in `chapters/` folder
- Verify file naming: `chapter-01.html`, `chapter-02.html`, etc.

**Analytics not working?**
- Check if localStorage is enabled in browser
- Clear browser cache and localStorage
- Enable debug mode to see detailed logs

**Styles not loading?**
- Check browser console for 404 errors
- Verify CSS file paths in HTML files
- Hard refresh (Cmd/Ctrl + Shift + R)

## 📄 License

© 2025 Dick Griola. All rights reserved.

## 🤝 Support

For issues or questions, please contact [your contact info].

---

**Built with:** Pure HTML, CSS, and JavaScript (ES6 Modules)  
**No frameworks, no build tools, just clean code.**

Enjoy sharing your story! 📖
