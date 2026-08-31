# Dark Mode Logo Implementation Guide

## Overview
The website now supports automatic logo switching between light and dark themes. The infrastructure is in place, but you need to create the dark mode versions of the logos.

## Required Dark Mode Logo Files

### 1. **Navbar Logo (Dark Mode)**
- **File name:** `idea-lab-logo-transparent-dark.png`
- **Location:** `images/` folder
- **Current light version:** `idea-lab-logo-transparent.png`
- **Purpose:** Used in the sticky navigation bar
- **Specifications:**
  - Same dimensions as the light version
  - Replace all dark/black text with white or light neutral color (#FFFFFF or #F9FAFB)
  - Keep the colored icon/emblem unchanged
  - Ensure text remains crisp and legible on dark backgrounds
  - Export at 2x resolution for Retina displays (e.g., if original is 160px height, export at 320px)

### 2. **Footer Logo (Dark Mode)**
- **File name:** `idea-lab-logo-glow-dark.png`
- **Location:** `images/` folder
- **Current light version:** `idea-lab-logo-glow.png`
- **Purpose:** Used in the footer section
- **Specifications:**
  - Same dimensions as the light version (height: 96px when scaled with `h-24` class)
  - Replace all dark/black text with white or light neutral color (#FFFFFF or #F9FAFB)
  - Keep the colored icon/emblem and glow effects unchanged
  - Ensure text remains crisp and legible on dark backgrounds
  - Export at 2x resolution for Retina displays

## How It Works

### HTML Structure
Both `index.html` and `events.html` now use a logo stack pattern:

```html
<span class="logo-stack" aria-label="AKGEC IDEA Lab Logo">
    <!-- Light mode version (visible by default) -->
    <img src="images/idea-lab-logo-transparent.png" class="logo-light">
    <!-- Dark mode version (visible only in dark mode) -->
    <img src="images/idea-lab-logo-transparent-dark.png" class="logo-dark">
</span>
```

### CSS Logic
The `style.css` file contains the theme-switching logic:

```css
.logo-light {
    display: block;        /* Visible in light mode */
}

.logo-dark {
    display: none;         /* Hidden in light mode */
}

html.dark .logo-light {
    display: none;         /* Hidden in dark mode */
}

html.dark .logo-dark {
    display: block;        /* Visible in dark mode */
}
```

When the theme is switched to dark (by adding the `dark` class to the `<html>` element), the CSS automatically hides the light logo and shows the dark logo.

## Creating the Dark Mode Logos

### Method 1: Using Image Editor (Recommended)
1. Open `idea-lab-logo-transparent.png` in an image editor (Photoshop, Illustrator, Figma, GIMP, etc.)
2. Select the black/dark text elements ("AKGEC", "Lab", "Technical Business Incubator")
3. Change their color to white (#FFFFFF) or light gray (#F9FAFB)
4. Keep the colored icon/elements unchanged
5. Export as PNG with transparency: `idea-lab-logo-transparent-dark.png`
6. Repeat for `idea-lab-logo-glow.png` → `idea-lab-logo-glow-dark.png`

### Method 2: Using Figma or Web-based Tools
1. Upload the light logo to Figma
2. Duplicate the layers
3. Change text color to white
4. Export both versions as separate PNGs

### Method 3: Using Command Line (ImageMagick)
If you want to use a script to replace black colors with white:

```bash
# Basic replacement (replace black text with white)
convert idea-lab-logo-transparent.png -fuzz 10% -fill white -opaque black idea-lab-logo-transparent-dark.png
```

Note: This is a quick solution but may not preserve all design nuances. Manual editing is recommended.

## Testing the Implementation

1. **Light Mode:**
   - Open the website normally
   - The navbar should display `idea-lab-logo-transparent.png`
   - The footer should display `idea-lab-logo-glow.png`

2. **Dark Mode:**
   - Toggle to dark mode using the theme switcher
   - The navbar should automatically switch to `idea-lab-logo-transparent-dark.png`
   - The footer should automatically switch to `idea-lab-logo-glow-dark.png`
   - Verify that all text is clearly visible
   - Check both navbar and footer for consistency

3. **Responsive Testing:**
   - Test on mobile, tablet, and desktop sizes
   - Verify logo scaling is correct
   - Ensure no layout shifts occur during theme switching

4. **Retina Display Testing:**
   - If possible, test on high-DPI displays (Retina, 2x, 3x)
   - Logos should remain crisp

## Design Guidelines for Dark Mode Logos

✅ **DO:**
- Use pure white (#FFFFFF) or off-white (#F9FAFB, #F3F4F6) for text
- Maintain brand consistency
- Keep the same proportions and spacing as the light version
- Preserve all colored elements (icons, accents)
- Ensure 4.5:1 contrast ratio for accessibility

❌ **DON'T:**
- Use CSS filters (invert, brightness, contrast) on the entire logo
- Apply gray or muted colors to the text (use white/off-white)
- Change the icon colors
- Add drop shadows or glows without design intent
- Distort or resize elements

## File Specifications

| Property | Value |
|----------|-------|
| Format | PNG with transparency |
| Background | Transparent |
| Recommended DPI | 150-300 DPI (for print quality) |
| Width | Match light version (usually 200-300px) |
| Height | Match light version |
| Text Color | #FFFFFF (white) or #F9FAFB (off-white) |
| Export Profile | sRGB for web |
| Compression | Optimized for web (remove metadata) |

## Files to Create

Once you've created the dark mode logos, place them in the `images/` folder:

```
images/
├── idea-lab-logo-transparent.png      ✓ (existing)
├── idea-lab-logo-transparent-dark.png ← CREATE THIS
├── idea-lab-logo-glow.png             ✓ (existing)
└── idea-lab-logo-glow-dark.png        ← CREATE THIS
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Dark logo doesn't appear in dark mode | Verify filename exactly matches `idea-lab-logo-*-dark.png` |
| Logo flickers when switching themes | Ensure both images are the same size/dimensions |
| Dark logo text is still hard to read | Use pure white (#FFFFFF) instead of gray |
| Logo looks pixelated on Retina displays | Export at 2x resolution (double the height) |
| Layout shifts when switching themes | Verify both logo versions have identical dimensions |

## Next Steps

1. ✅ **Infrastructure is ready** – HTML and CSS are configured
2. ⏳ **Create dark mode logo files** – Follow the guidelines above
3. 🧪 **Test the implementation** – Verify theme switching works smoothly
4. 🚀 **Deploy** – Push the dark mode logos to production

---

**Note:** The current setup uses CSS `display: none/block` switching for optimal performance with no layout shifts. The logos must have identical dimensions to prevent reflow.
