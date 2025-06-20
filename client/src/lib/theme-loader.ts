import { ThemeState } from './theme'

type ThemeStylesheet = {
  id: string
  href: string
  element?: HTMLLinkElement
}

class ThemeLoader {
  private loadedThemes = new Map<string, ThemeStylesheet>()
  private baseThemesLoaded = false

  private getThemeKey(theme: ThemeState): string {
    return `${theme.type}-${theme.mode}`
  }

  private createStylesheet(id: string, href: string): HTMLLinkElement {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.id = id
    link.setAttribute('data-theme-css', 'true')
    return link
  }

  private async loadStylesheet(stylesheet: ThemeStylesheet): Promise<void> {
    return new Promise((resolve, reject) => {
      if (stylesheet.element && document.head.contains(stylesheet.element)) {
        resolve()
        return
      }

      const link = this.createStylesheet(stylesheet.id, stylesheet.href)

      link.onload = () => {
        stylesheet.element = link
        resolve()
      }

      link.onerror = () => {
        reject(new Error(`Failed to load theme: ${stylesheet.href}`))
      }

      document.head.appendChild(link)
    })
  }

  private removeUnusedThemes(currentThemeKey: string): void {
    this.loadedThemes.forEach((stylesheet, key) => {
      if (key !== currentThemeKey && key !== 'fallback-theme' && key !== 'atlas-theme' && stylesheet.element) {
        document.head.removeChild(stylesheet.element)
        stylesheet.element = undefined
      }
    })
  }

  private async loadBaseThemes(): Promise<void> {
    if (this.baseThemesLoaded) return

    const baseThemes = [
      { id: 'fallback-theme', href: '/src/styles/themes/fallback.css' },
      { id: 'atlas-theme', href: '/src/styles/themes/atlas.css' }
    ]

    await Promise.all(
      baseThemes.map(async (theme) => {
        const stylesheet: ThemeStylesheet = {
          id: theme.id,
          href: theme.href
        }
        await this.loadStylesheet(stylesheet)
        this.loadedThemes.set(theme.id, stylesheet)
      })
    )

    this.baseThemesLoaded = true
  }

  async loadTheme(theme: ThemeState): Promise<void> {
    await this.loadBaseThemes()

    const themeKey = this.getThemeKey(theme)
    let stylesheet = this.loadedThemes.get(themeKey)

    if (!stylesheet) {
      let href: string

      if (theme.type === 'solar-dusk') {
        href = theme.mode === 'light'
          ? '/src/styles/themes/solar-dusk-light.css'
          : '/src/styles/themes/solar-dusk-dark.css'
      } else if (theme.type === 'notebook') {
        href = theme.mode === 'light'
          ? '/src/styles/themes/notebook-light.css'
          : '/src/styles/themes/notebook-dark.css'
      } else {
        return
      }

      stylesheet = {
        id: `theme-${themeKey}`,
        href
      }

      this.loadedThemes.set(themeKey, stylesheet)
    }

    await this.loadStylesheet(stylesheet)
    this.removeUnusedThemes(themeKey)
  }

  preloadAllThemes(): void {
    const themes = [
      { type: 'solar-dusk' as const, mode: 'light' as const },
      { type: 'solar-dusk' as const, mode: 'dark' as const },
      { type: 'notebook' as const, mode: 'light' as const },
      { type: 'notebook' as const, mode: 'dark' as const }
    ]

    themes.forEach(theme => {
      const themeKey = this.getThemeKey(theme)
      if (!this.loadedThemes.has(themeKey)) {
        this.loadTheme(theme).catch(console.error)
      }
    })
  }
}

export const themeLoader = new ThemeLoader()