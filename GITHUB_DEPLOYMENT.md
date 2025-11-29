# GitHub Deployment Guide
## An Immigrant's Story - GitHub Pages Setup

## ✅ Successfully Pushed to GitHub!

**Repository:** https://github.com/rgriola/book-publishing

---

## 🌐 Enable GitHub Pages (Free Hosting)

### Step 1: Configure GitHub Pages

1. Go to your repository: https://github.com/rgriola/book-publishing
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under **Source**, select:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Click **Save**

### Step 2: Wait for Deployment

- GitHub will build and deploy your site (takes 1-2 minutes)
- Once ready, you'll see: **"Your site is live at https://rgriola.github.io/book-publishing/"**

### Step 3: Update Production URL

After your site is live, update the base URL in your code:

**File:** `src/js/config.js`

Find line ~12 and update:
```javascript
get baseURL() {
  return this.env === 'development' 
    ? 'http://localhost:5500' 
    : 'https://rgriola.github.io/book-publishing';  // <-- Update this
}
```

**File:** `.env.production`

Update:
```
BASE_URL=https://rgriola.github.io/book-publishing
```

Then commit and push:
```bash
git add .
git commit -m "Update production URL for GitHub Pages"
git push
```

---

## 🔗 Your Live URLs

Once deployed:

- **Landing Page:** https://rgriola.github.io/book-publishing/
- **Reader:** https://rgriola.github.io/book-publishing/reader.html
- **Admin:** https://rgriola.github.io/book-publishing/admin.html (code: 8123)

---

## 🎨 Custom Domain (Optional)

### If you want a custom domain like `www.immigrantstory.com`:

1. **Buy a domain** (Namecheap, GoDaddy, etc.)
2. **In GitHub:**
   - Settings → Pages
   - Enter your custom domain
   - Enable HTTPS
3. **In your domain registrar:**
   - Add CNAME record pointing to `rgriola.github.io`
4. **Wait 24-48 hours** for DNS propagation

---

## 📝 Making Updates

### To update content:

1. **Edit files locally**
2. **Commit changes:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```
3. **GitHub Pages auto-deploys** (1-2 minutes)

### Quick update example:
```bash
# After editing chapter files
cd /Users/rgriola/Desktop/01_Vibecode/Grandpas-Story
git add chapters/
git commit -m "Added Chapter 2 content"
git push
```

---

## 🔒 Security Note

Your admin password (8123) is currently in the code. For production:

1. Consider using a stronger password
2. Update in `src/js/config.js` and `.env.production`
3. Commit and push changes

---

## 📊 Analytics

Analytics are stored in browser localStorage, so:
- Each visitor has their own analytics
- Data persists across sessions
- Admin can export/import data

---

## 🚀 Alternative Hosting Options

### Render.com (Free)
- More control than GitHub Pages
- Custom domains easier
- Static site deployment

### Netlify (Free)
- Drag & drop deployment
- Automatic HTTPS
- Form handling

### Cloudflare Pages (Free)
- Fast global CDN
- Unlimited bandwidth
- Great for custom domains

---

## 📱 Testing Your Live Site

1. **Open in browser:** https://rgriola.github.io/book-publishing/
2. **Test on mobile:** Use your phone
3. **Test responsive:** Browser DevTools (F12) → Device toggle
4. **Test all pages:**
   - Landing page
   - Reader (all chapters)
   - Admin dashboard

---

## 🎉 You're Live!

Your book is now published online and accessible to anyone!

**Share your link:**
- Email to friends and family
- Post on social media
- Add to your author bio

---

## 📞 Support

If you encounter issues:
1. Check GitHub Actions tab for build errors
2. Check browser console (F12) for JavaScript errors
3. Review commit history for changes

**GitHub Repository:** https://github.com/rgriola/book-publishing

---

**Congratulations on publishing your book online! 📖✨**
