import { ReactNode, useEffect, useState } from 'react'
import { ThemeContext, ThemeState, applyTheme, ThemeType, ThemeMode } from '@/lib/theme'
import { themeLoader } from '@/lib/theme-loader'

const THEME_STORAGE_KEY = 'career-path-theme'

const defaultTheme: ThemeState = {
  type: 'solar-dusk',
  mode: 'dark'
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<ThemeState>(defaultTheme)
  const [isLoading, setIsLoading] = useState(true)

  // Load theme from localStorage on mount
  useEffect(() => {
    const initializeTheme = async () => {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      let initialTheme = defaultTheme

      if (stored) {
        try {
          const parsedTheme = JSON.parse(stored) as ThemeState
          // Handle legacy 'custom' theme name
          if ((parsedTheme as { type: string }).type === 'custom') {
            parsedTheme.type = 'solar-dusk'
          }
          initialTheme = parsedTheme
        } catch {
          // Fall back to default theme if parsing fails
        }
      }

      setThemeState(initialTheme)

      try {
        await applyTheme(initialTheme)
        // Preload other themes for faster switching
        themeLoader.preloadAllThemes()
      } catch (error) {
        console.error('Failed to initialize theme:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeTheme()
  }, [])

  const setTheme = async (newTheme: Partial<ThemeState>) => {
    const updatedTheme = { ...theme, ...newTheme }
    setThemeState(updatedTheme)

    try {
      await applyTheme(updatedTheme)
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(updatedTheme))
    } catch (error) {
      console.error('Failed to apply theme:', error)
    }
  }

  const toggleTheme = () => {
    const themeOrder: ThemeType[] = ['solar-dusk', 'notebook', 'atlas']
    const currentIndex = themeOrder.indexOf(theme.type)
    const nextIndex = (currentIndex + 1) % themeOrder.length
    const newType = themeOrder[nextIndex]
    setTheme({ type: newType })
  }

  const toggleMode = () => {
    const newMode: ThemeMode = theme.mode === 'light' ? 'dark' : 'light'
    setTheme({ mode: newMode })
  }

  // Show loading state until theme is initialized
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}