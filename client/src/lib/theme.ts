import { createContext, useContext } from 'react'

export type ThemeType = 'custom' | 'atlas'
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

export const applyTheme = (theme: ThemeState) => {
  const { type, mode } = theme
  const root = document.documentElement

  // Remove existing theme classes
  root.classList.remove('custom', 'atlas', 'light', 'dark')

  // Apply new theme classes
  root.classList.add(type, mode)
}