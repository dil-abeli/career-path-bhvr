# Theme System

This application supports two theme systems that can be switched dynamically:

## Available Themes

### 1. Custom Theme
- Uses custom OKLCH color values and unique fonts (Oxanium, Merriweather, Fira Code)
- Provides a distinctive visual identity with carefully crafted colors and typography
- Available in both light and dark modes

### 2. Atlas Theme
- Uses your company's design tokens from `@diligentcorp/atlas-design-tokens`
- Ensures consistency with other company applications
- Automatically inherits updates when the design system is updated
- Available in both light and dark modes

## How to Use

### Theme Switcher Component
The app includes a theme switcher in the navigation bar with:
- **Sun/Moon icon**: Toggle between light and dark modes
- **Palette icon**: Switch between Custom and Atlas themes
- **Theme label**: Shows current theme (Custom/Atlas)

### Programmatic Usage

```tsx
import { useTheme } from '@/lib/theme'

function MyComponent() {
  const { theme, setTheme, toggleTheme, toggleMode } = useTheme()

  // Current theme state
  console.log(theme) // { type: 'custom' | 'atlas', mode: 'light' | 'dark' }

  // Change theme type
  setTheme({ type: 'atlas' })

  // Change mode
  setTheme({ mode: 'light' })

  // Toggle between themes
  toggleTheme()

  // Toggle between light/dark
  toggleMode()
}
```

## Theme Persistence

Theme preferences are automatically saved to `localStorage` and restored on app reload.

## Technical Implementation

### CSS Structure
- **Custom theme**: Uses `.custom.light` and `.custom.dark` class selectors
- **Atlas theme**: Uses `.atlas.light` and `.atlas.dark` class selectors
- **Fallback**: `:root` provides default custom theme values

### Theme Provider
The `ThemeProvider` component:
- Manages theme state
- Applies theme classes to document root
- Handles localStorage persistence
- Provides context for theme switching

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

## Customization

To customize the Atlas theme mapping, edit the CSS in `src/index.css`:
- Update token mappings to use different Lens semantic tokens
- The Lens design system automatically handles light/dark mode switching
- All typography, colors, and spacing come directly from the design system