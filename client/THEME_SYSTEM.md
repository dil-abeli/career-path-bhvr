# Theme System

This application supports three theme systems that can be switched dynamically with CSS files loaded on-demand for optimal performance.

## Available Themes

### 1. Solar Dusk Theme
- Uses custom OKLCH color values and unique fonts (Oxanium, Merriweather, Fira Code)
- Provides a distinctive visual identity with carefully crafted colors and typography
- Available in both light and dark modes
- CSS files: `styles/themes/solar-dusk-light.css` and `styles/themes/solar-dusk-dark.css`

### 2. Notebook Theme
- Uses neutral grayscale colors with handwritten-style fonts (Architects Daughter)
- Provides a paper-like, notebook aesthetic with custom letter spacing
- Available in both light and dark modes
- CSS files: `styles/themes/notebook-light.css` and `styles/themes/notebook-dark.css`

### 3. Atlas Theme
- Uses your company's design tokens from `@diligentcorp/atlas-design-tokens`
- Ensures consistency with other company applications
- Automatically inherits updates when the design system is updated
- Available in both light and dark modes
- CSS file: `styles/themes/atlas.css` (handles both light and dark modes)

## Architecture

### Dynamic CSS Loading
The theme system now uses dynamic CSS loading for optimal performance:

- **On-demand loading**: Theme CSS files are loaded only when needed
- **Preloading**: After initial theme load, other themes are preloaded for instant switching
- **Memory management**: Unused theme stylesheets are removed from the DOM to conserve memory
- **Fallback support**: A fallback theme ensures the app works even if theme loading fails

### File Structure
```
client/src/
├── styles/
│   └── themes/
│       ├── solar-dusk-light.css  # Solar Dusk theme - light mode
│       ├── solar-dusk-dark.css   # Solar Dusk theme - dark mode
│       ├── notebook-light.css    # Notebook theme - light mode
│       ├── notebook-dark.css     # Notebook theme - dark mode
│       ├── atlas.css             # Atlas theme (both modes)
│       └── fallback.css          # Fallback theme
├── lib/
│   ├── theme.ts                  # Theme types and utilities
│   └── theme-loader.ts           # Dynamic CSS loading logic
└── index.css                     # Base styles (no theme definitions)
```

## How to Use

### Theme Switcher Component
The app includes a theme switcher in the navigation bar with:
- **Sun/Moon icon**: Toggle between light and dark modes
- **Palette icon**: Cycle through Solar Dusk, Notebook, and Atlas themes
- **Theme label**: Shows current theme name (Solar Dusk/Notebook/Atlas)

### Programmatic Usage

```tsx
import { useTheme } from '@/lib/theme'

function MyComponent() {
  const { theme, setTheme, toggleTheme, toggleMode } = useTheme()

  // Current theme state
  console.log(theme) // { type: 'solar-dusk' | 'notebook' | 'atlas', mode: 'light' | 'dark' }

  // Change theme type (async)
  await setTheme({ type: 'notebook' })

  // Change mode (async)
  await setTheme({ mode: 'light' })

  // Toggle between themes (cycles through all three)
  toggleTheme()

  // Toggle between light/dark
  toggleMode()
}
```

## Performance Features

### Loading States
- The ThemeProvider shows a loading spinner while initializing the theme system
- Theme changes are handled asynchronously to prevent UI blocking

### Optimization
- **Lazy loading**: Only loads CSS for the active theme
- **Preloading**: Loads other themes in the background after initial load
- **Cleanup**: Removes unused stylesheets to prevent memory leaks
- **Error handling**: Graceful fallback if theme loading fails

## Theme Persistence

Theme preferences are automatically saved to `localStorage` and restored on app reload. The system also handles legacy theme names (automatically migrates 'custom' to 'solar-dusk').

## Technical Implementation

### CSS Structure
- **Solar Dusk theme**: Separate files for light (`.solar-dusk.light`) and dark (`.solar-dusk.dark`) modes
- **Notebook theme**: Separate files for light (`.notebook.light`) and dark (`.notebook.dark`) modes
- **Atlas theme**: Single file with both `.atlas.light` and `.atlas.dark` selectors
- **Fallback**: `:root` provides default theme values loaded immediately

### Theme Provider
The `ThemeProvider` component:
- Manages theme state with async loading support
- Shows loading state during theme initialization
- Handles localStorage persistence with legacy migration
- Provides context for theme switching
- Preloads themes for faster switching

### Dynamic Loading System
The `ThemeLoader` class:
- Dynamically loads CSS files as `<link>` elements
- Manages multiple theme stylesheets
- Removes unused themes to conserve memory
- Handles loading errors gracefully
- Supports preloading for better UX

### Design Token Integration
Atlas theme uses Lens semantic design tokens directly:
```css
.atlas.light,
.atlas.dark {
  --background: var(--lens-semantic-color-background-base);
  --primary: var(--lens-semantic-color-action-primary-default);
  --font-sans: var(--lens-semantic-font-family-body);
  /* ... more mappings */
}
```

**Note**: No fallback colors are provided - the Lens design tokens must be available for the Atlas theme to work properly.

## Theme Features

### Letter Spacing Support
The Notebook theme includes custom letter spacing via the `--tracking-normal` variable:
- Applied to the body element for consistent text spacing
- Tailwind utility classes are configured to use these values
- Other themes can override this for different typography treatments

### Font Loading
Each theme can specify its own font stack:
- **Solar Dusk**: Oxanium (headings), Merriweather (body), Fira Code (monospace)
- **Notebook**: Architects Daughter (handwritten style)
- **Atlas**: Uses Lens design system fonts

## Adding New Themes

To add a new theme:

1. Create new CSS files in `client/src/styles/themes/` (separate files for light/dark modes recommended)
2. Define theme variables using the appropriate class selectors (`.theme-name.light`, `.theme-name.dark`)
3. Update the `ThemeType` in `client/src/lib/theme.ts`
4. Add loading logic in `client/src/lib/theme-loader.ts`
5. Update the theme switcher component display names
6. Add the theme to the preload list and toggle order

## Customization

To customize theme mappings:
- **Solar Dusk/Notebook**: Edit individual CSS files for precise control
- **Atlas**: Edit `client/src/styles/themes/atlas.css` to update token mappings

All themes support the full range of CSS custom properties used by the application, including colors, typography, spacing, shadows, and borders.
