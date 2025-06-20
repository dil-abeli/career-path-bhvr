import { Link } from '@tanstack/react-router'
import { ThemeSwitcher } from './theme-switcher'

type TNavItem = {
  label: string
  to: string
}

const navItems: TNavItem[] = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Paths',
    to: '/career-paths',
  },
  {
    label: 'My Progress',
    to: '/my-progress',
  },
  {
    label: 'Profile',
    to: '/profile',
  },
  {
    label: 'About',
    to: '/about',
  },
]

const NavItem = ({ label, to }: TNavItem) => {
  return (
    <Link to={to} className="hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground transition-colors">
      {label}
    </Link>
  )
}

export const Navbar = () => {
  return (
    <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
      <div className="container mx-auto flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden sm:inline-block">CareerPath</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => (
              <NavItem key={item.label} {...item} />
            ))}
          </nav>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  )
}
