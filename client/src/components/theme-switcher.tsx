import { useTheme } from '@/lib/theme'
import ModeToggle from '@/components/mode-toggle'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (value: string) => {
    setTheme({ type: value as 'solar-dusk' | 'notebook' | 'atlas' })
  }

  return (
    <div className="flex items-center gap-2">
      <ModeToggle />
      <Select value={theme.type} onValueChange={handleThemeChange}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="solar-dusk">Solar Dusk</SelectItem>
          <SelectItem value="notebook">Notebook</SelectItem>
          <SelectItem value="atlas">Atlas</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}