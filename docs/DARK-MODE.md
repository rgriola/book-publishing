# Dark Mode Feature Documentation

## Overview
The Dark Mode feature provides readers with three theme options: Light, Dark, and Auto (follows system preference). This feature reduces eye strain, improves readability in low-light conditions, and respects user preferences.

## Features

### Theme Options
1. **Light Theme** ☀️ - Traditional light background with dark text
2. **Dark Theme** 🌙 - Dark background with light text, optimized for low-light reading
3. **Auto Theme** 🔄 - Automatically follows system/browser dark mode preference

### Key Benefits
- **Reduced Eye Strain**: Dark mode is easier on the eyes in low-light environments
- **Battery Savings**: Dark themes can save battery life on OLED/AMOLED screens
- **Preference Persistence**: Your theme choice is saved and remembered across sessions
- **System Integration**: Auto mode respects your device's dark mode settings
- **Accessibility**: Fully accessible with keyboard navigation and screen reader support

## Technical Implementation

### Files
- **JavaScript**: `/src/js/darkMode.js` - Core dark mode logic
- **CSS**: `/src/css/dark-mode.css` - Theme styles and variables
- **Integration**: Modified `reader.js` and `reader.html`

### How It Works

#### Theme Storage
```javascript
// Saved to localStorage as 'theme-preference'
// Values: 'light', 'dark', or 'auto'
```

#### CSS Variables
The system uses CSS custom properties that change based on the active theme:

**Light Theme Colors:**
- Background: `#ffffff`
- Text: `#333333`
- Primary: `#2c3e50`

**Dark Theme Colors:**
- Background: `#0f172a`
- Text: `#e4e4e7`
- Primary: `#1a2332`

#### Theme Application
1. User selects a theme (or system preference is detected)
2. JavaScript applies `data-theme="light"` or `data-theme="dark"` to `<html>` element
3. CSS variables automatically update based on the attribute
4. All UI elements inherit the new color scheme

### Auto Mode
When set to Auto:
- Detects system preference using `prefers-color-scheme` media query
- Automatically updates when system preference changes
- No user intervention required

## Usage

### For Users
1. Look for the theme controls in the reader header (between chapter info and font controls)
2. Click one of three buttons:
   - ☀️ for light theme
   - 🌙 for dark theme
   - 🔄 for auto (system preference)
3. Your choice is automatically saved

### For Developers

#### Initialization
```javascript
import darkMode from './darkMode.js';

// Initialize dark mode
darkMode.init();
```

#### Programmatic Theme Change
```javascript
// Set specific theme
darkMode.setTheme('dark');   // or 'light' or 'auto'

// Get current theme
console.log(darkMode.currentTheme);

// Get actual applied theme (useful for auto mode)
console.log(darkMode.getSystemTheme());
```

#### Adding Dark Mode to New Elements
Add styles in `dark-mode.css`:

```css
html[data-theme="dark"] .your-element {
  background-color: var(--color-background-alt);
  color: var(--color-text);
  border-color: var(--color-border);
}
```

## Accessibility Features

### Keyboard Navigation
- All theme buttons are keyboard accessible
- Tab to navigate between theme options
- Enter/Space to select

### Screen Reader Support
- Buttons have descriptive `aria-label` attributes
- `aria-pressed` indicates active theme
- Theme changes are announced via `aria-live` regions

### ARIA Attributes
```html
<button 
  class="theme-btn active"
  data-theme="dark"
  title="Dark theme"
  aria-label="Dark theme"
  aria-pressed="true">
  🌙
</button>
```

### Additional Accessibility
- High contrast mode support
- Reduced motion support (disables theme transitions)
- Print styles (always uses light theme)
- Minimum touch target size: 44x44px (WCAG AAA)

## Browser Compatibility

### Supported Browsers
- Chrome/Edge 76+ (CSS Custom Properties, prefers-color-scheme)
- Firefox 67+
- Safari 12.1+
- Opera 63+

### Fallback Behavior
- If `localStorage` is unavailable, defaults to light theme
- If `matchMedia` is unavailable, auto mode defaults to light theme
- Graceful degradation for older browsers

## Performance Considerations

### Optimization
- Single DOM update when changing themes
- CSS transitions controlled by `prefers-reduced-motion`
- LocalStorage caching prevents unnecessary re-renders
- System theme listener only active in auto mode

### Memory Usage
- Minimal memory footprint (~2KB JavaScript)
- No images or heavy assets
- CSS custom properties are highly performant

## Customization

### Changing Theme Colors
Edit the CSS variables in `dark-mode.css`:

```css
html[data-theme="dark"] {
  --color-background: #your-color;
  --color-text: #your-color;
  /* etc */
}
```

### Adding New Themes
1. Add theme to `darkMode.js` themes object
2. Create button in `createControl()` method
3. Add CSS variables for new theme
4. Update `applyTheme()` logic if needed

### Disabling Auto Mode
Remove the auto button from the `createControl()` method:

```javascript
const themes = [
  { id: 'light', label: '☀️', title: 'Light theme' },
  { id: 'dark', label: '🌙', title: 'Dark theme' }
  // Remove auto theme
];
```

## Troubleshooting

### Theme Not Saving
- Check browser's localStorage is enabled
- Verify no browser extensions are blocking storage
- Check browser console for errors

### Theme Not Applying
- Ensure `dark-mode.css` is loaded after `main.css`
- Check that HTML element has `data-theme` attribute
- Verify CSS custom properties are supported

### Auto Mode Not Working
- Check browser supports `prefers-color-scheme`
- Verify system dark mode is enabled/disabled
- Check console for matchMedia errors

## Future Enhancements

### Potential Features
1. **Custom Color Themes**: Add sepia, high contrast, etc.
2. **Scheduled Dark Mode**: Automatically switch based on time of day
3. **Per-Chapter Themes**: Different themes for different chapters
4. **Theme Preview**: Preview themes before applying
5. **Contrast Adjustment**: Fine-tune contrast levels

### Integration Opportunities
- Combine with reading preferences panel
- Sync across devices via cloud storage
- Theme-aware illustrations/images
- Dynamic syntax highlighting for code samples

## Related Features
- Font Size Control (already implemented)
- Line Spacing Control (planned)
- Reading Width Control (planned)
- Focus Mode (planned)

## Testing

### Manual Testing Checklist
- [ ] Light theme applies correctly
- [ ] Dark theme applies correctly
- [ ] Auto theme follows system preference
- [ ] Theme preference persists on page reload
- [ ] Keyboard navigation works
- [ ] Screen reader announcements work
- [ ] Works on mobile devices
- [ ] Works on tablets
- [ ] Print styles use light theme
- [ ] High contrast mode works
- [ ] Reduced motion disables transitions

### Browser Testing
- [ ] Chrome (Desktop & Mobile)
- [ ] Firefox (Desktop & Mobile)
- [ ] Safari (Desktop & Mobile)
- [ ] Edge

## Resources
- [MDN: prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Web.dev: Dark Mode](https://web.dev/prefers-color-scheme/)

## Support
For issues or questions, check the browser console for error messages and verify all files are properly loaded.
