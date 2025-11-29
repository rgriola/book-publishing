# Quick Start Guide
## An Immigrant's Story - Website Setup

### ⚡ Start Developing in 3 Steps

1. **Open in VS Code**
   ```bash
   cd /Users/rgriola/Desktop/01_Vibecode/Grandpas-Story
   code .
   ```

2. **Start Live Server**
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - Site opens at `http://localhost:5500`

3. **Start Editing!**
   - Replace placeholder content in `index.html`
   - Add your chapter content to `chapters/chapter-01.html`
   - Replace placeholder images in `assets/images/`

---

## 📝 Adding Your Content

### Landing Page (index.html)

Replace these placeholders:
- **Book description** - Section with "About the Book"
- **Author bio** - Section with "About the Author"
- **Images** - Upload real images to `assets/images/`

### Chapter 1 (chapters/chapter-01.html)

1. Open `chapters/chapter-01.html`
2. Delete all placeholder content
3. Paste your chapter with HTML tags
4. Must start with `<h1>Your Chapter Title</h1>`
5. Save and refresh browser

Example:
```html
<article class="chapter">
  <h1>Chapter 1: A New Beginning</h1>
  
  <p>The morning sun rose over the harbor...</p>
  
  <p>Giuseppe looked out at the Statue of Liberty...</p>
</article>
```

---

## 🎨 Customization

### Change Colors

Edit `src/css/main.css` - look for `:root` variables:
```css
--color-primary: #2c3e50;  /* Change to your color */
--color-accent: #3498db;   /* Change to your color */
```

### Change Fonts

Edit `src/css/main.css`:
```css
--font-primary: 'Your Font', sans-serif;
--font-reading: 'Your Reading Font', serif;
```

---

## 🔐 Admin Access

1. Open `http://localhost:5500/admin.html`
2. Enter security code: **8123**
3. View chapter analytics
4. Export/import data

---

## 📱 Test Responsive Design

In browser (Chrome/Firefox):
1. Press `F12` to open DevTools
2. Click device toggle icon (phone/tablet)
3. Test on different screen sizes:
   - iPhone
   - iPad
   - Desktop

---

## 🚀 Deployment Options

### Option 1: GitHub Pages (Free)
1. Create GitHub repository
2. Push your code
3. Enable GitHub Pages in settings
4. Done! Site is live

### Option 2: Render.com (Free)
1. Create account on Render.com
2. New Static Site
3. Connect GitHub repo
4. Deploy!

### Option 3: Netlify (Free)
1. Drag and drop folder to netlify.com/drop
2. Instant deployment
3. Get shareable URL

---

## ✅ Pre-Launch Checklist

- [ ] Replace book cover image
- [ ] Replace author photo
- [ ] Update book description
- [ ] Update author bio
- [ ] Add Chapter 1 content
- [ ] Test on mobile device
- [ ] Test on tablet (iPad)
- [ ] Test on laptop/desktop
- [ ] Test all navigation buttons
- [ ] Test admin dashboard
- [ ] Update production URL in config
- [ ] Add remaining chapters

---

## 🐛 Common Issues

**Chapters not loading?**
- Check console (F12)
- Verify file exists in `chapters/` folder
- Check file naming: `chapter-01.html` not `chapter-1.html`

**Styles look broken?**
- Hard refresh: `Cmd/Ctrl + Shift + R`
- Check CSS file paths in HTML

**Admin won't login?**
- Security code is: `8123`
- Check browser console for errors

---

## 📞 Need Help?

1. Check `README.md` for detailed documentation
2. Open browser console (F12) for error messages
3. Enable debug mode: In console type `debug.enable()`

---

**Ready to launch? Let's get started! 🎉**
