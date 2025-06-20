import { createContext, useContext } from 'react'
import { themeLoader } from './theme-loader'

export type ThemeType = 'solar-dusk' | 'notebook' | 'atlas'
export type ThemeMode = 'light' | 'dark'

export interface ThemeState {
  type: ThemeType
  mode: ThemeMode
}

export interface ThemeContextValue {
  theme: ThemeState
  setTheme: (theme: Partial<ThemeState>) => void
  toggleTheme: () => void
  toggleMode: () => void
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const applyTheme = async (theme: ThemeState) => {
  const { type, mode } = theme
  const root = document.documentElement

  // Remove existing theme classes
  root.classList.remove('solar-dusk', 'notebook', 'atlas', 'light', 'dark')

  // Apply new theme classes
  root.classList.add(type, mode)

  // Load theme CSS dynamically
  try {
    await themeLoader.loadTheme(theme)
  } catch (error) {
    console.error('Failed to load theme:', error)
  }
}