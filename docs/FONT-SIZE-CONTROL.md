# Font Size Control Feature

## Overview
The font size control feature allows readers to adjust the text size for better readability across all devices (desktop, tablet, and mobile).

## Features

### Font Size Options
- **Small (A-)**: 16px base font size
- **Medium (A)**: 18px base font size (default)
- **Large (A+)**: 20px base font size
- **Extra Large (A++)**: 22px base font size

### Key Benefits
1. **Accessibility**: Helps users with visual impairments
2. **Personalization**: Allows each reader to choose their comfort level
3. **Persistence**: Saves preference in localStorage
4. **Responsive**: Works seamlessly on all screen sizes
5. **Smooth Transitions**: Elegant font size changes
6. **Screen Reader Support**: Announces changes to assistive technologies

## User Interface

### Desktop
- Located in the header between the title and menu toggle
- Shows "Text Size:" label with four buttons (A-, A, A+, A++)
- Active size is highlighted in white
- Hover effects provide visual feedback

### Tablet
- Similar to desktop but with slightly smaller buttons
- Label remains visible for clarity

### Mobile
- Compact button layout to save space
- Label hidden on small screens
- Smaller touch targets optimized for mobile

## Technical Implementation

### Files Created
1. `src/js/fontSizeControl.js` - Main module handling font size logic
2. `src/css/font-size-control.css` - Styling for the control interface

### Files Modified
1. `src/js/reader.js` - Integrated font size control initialization
2. `reader.html` - Added CSS link for font size control styles
3. `src/css/reader.css` - Enhanced header layout for controls

### How It Works

1. **Initialization**
   - Module loads saved preference from localStorage
   - Creates UI controls in the header
   - Sets up event listeners
   - Applies saved or default font size

2. **User Interaction**
   - Click any button (A-, A, A+, A++)
   - Font size changes immediately
   - Preference is saved automatically
   - Change is announced to screen readers

3. **CSS Application**
   - Sets `--reader-font-size` CSS custom property
   - Sets `data-font-size` attribute on root element
   - Proportionally adjusts headings and line height
   - Maintains reading comfort at all sizes

## Usage

### For Users
1. Open any chapter in the reader
2. Look for the "Text Size:" controls in the header
3. Click your preferred size (A-, A, A+, or A++)
4. The change applies immediately and is saved for future visits

### For Developers

#### Accessing the Module
```javascript
import fontSizeControl from './fontSizeControl.js';

// Get current size
const currentSize = fontSizeControl.getCurrentSize();

// Set size programmatically
fontSizeControl.setFontSize('large');
```

#### Customizing Sizes
Edit `src/js/fontSizeControl.js`:
```javascript
this.fontSizes = {
  small: 16,   // Change these values
  medium: 18,
  large: 20,
  xlarge: 22
};
```

#### Styling Custom Elements
Use the `data-font-size` attribute:
```css
[data-font-size="large"] .custom-element {
  /* Your custom styles */
}
```

Or use the CSS custom property:
```css
.custom-element {
  font-size: calc(var(--reader-font-size) * 0.8);
}
```

## Accessibility Features

1. **ARIA Labels**: All buttons have descriptive labels
2. **ARIA Pressed**: Active button state is announced
3. **Live Regions**: Changes announced to screen readers
4. **Keyboard Support**: Fully keyboard navigable
5. **High Contrast**: Enhanced borders in high contrast mode
6. **Reduced Motion**: Respects user's motion preferences

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires localStorage support
- Gracefully degrades if localStorage unavailable
- Works with CSS custom properties

## Mobile Optimization

### Touch Targets
- Minimum 32px touch targets on mobile
- Adequate spacing between buttons
- Large enough for comfortable tapping

### Layout
- Responsive design adapts to screen size
- No horizontal scrolling
- Controls remain accessible in both orientations

### Performance
- Minimal JavaScript overhead
- CSS-based transitions
- No layout shifts during size changes

## Future Enhancements

Potential additions:
- More size options (2XL, 3XL)
- Font family selection
- Reading mode (night/day themes)
- Line spacing adjustment
- Column width control
- Integration with browser reading modes

## Testing

### Manual Testing Checklist
- [ ] Default size loads correctly
- [ ] All four sizes work properly
- [ ] Preference persists after reload
- [ ] Works on desktop browsers
- [ ] Works on tablet (iPad)
- [ ] Works on mobile (iPhone/Android)
- [ ] Keyboard navigation works
- [ ] Screen reader announces changes
- [ ] Print view uses appropriate size
- [ ] No layout breaks at any size

### Browser Testing
- [ ] Chrome (desktop & mobile)
- [ ] Firefox (desktop & mobile)
- [ ] Safari (desktop & iOS)
- [ ] Edge (desktop)

## Troubleshooting

### Font size not changing
- Check browser console for errors
- Verify CSS file is loaded
- Ensure JavaScript module is imported

### Preference not saving
- Check localStorage is enabled
- Verify browser privacy settings
- Check for browser extensions blocking storage

### Layout issues
- Verify responsive CSS is loaded
- Check for CSS conflicts
- Test in different viewports

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all files are properly linked
3. Test in incognito/private mode
4. Clear cache and reload

---

**Last Updated**: November 29, 2025
**Version**: 1.0.0
