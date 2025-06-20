import { ReactNode, useEffect, useState } from 'react'
import { ThemeContext, ThemeState, applyTheme, ThemeType, ThemeMode } from '@/lib/theme'

const THEME_STORAGE_KEY = 'career-path-theme'

const defaultTheme: ThemeState = {
  type: 'custom',
  mode: 'dark'
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<ThemeState>(defaultTheme)

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored) {
      try {
        const parsedTheme = JSON.parse(stored) as ThemeState
        setThemeState(parsedTheme)
        applyTheme(parsedTheme)
      } catch {
        applyTheme(defaultTheme)
      }
    } else {
      applyTheme(defaultTheme)
    }
  }, [])

  const setTheme = (newTheme: Partial<ThemeState>) => {
    const updatedTheme = { ...theme, ...newTheme }
    setThemeState(updatedTheme)
    applyTheme(updatedTheme)
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(updatedTheme))
  }

  const toggleTheme = () => {
    const newType: ThemeType = theme.type === 'custom' ? 'atlas' : 'custom'
    setTheme({ type: newType })
  }

  const toggleMode = () => {
    const newMode: ThemeMode = theme.mode === 'light' ? 'dark' : 'light'
    setTheme({ mode: newMode })
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}