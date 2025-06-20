import { Palette, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/theme'

export const ThemeSwitcher = () => {
  const { theme, toggleTheme, toggleMode } = useTheme()

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMode}
        title={`Switch to ${theme.mode === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme.mode === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        title={`Switch to ${theme.type === 'custom' ? 'Atlas' : 'custom'} theme`}
      >
        <Palette className="h-4 w-4" />
      </Button>
      <span className="text-xs text-muted-foreground">
        {theme.type === 'custom' ? 'Custom' : 'Atlas'}
      </span>
    </div>
  )
}