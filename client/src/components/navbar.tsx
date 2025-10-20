import { Link, useNavigate } from '@tanstack/react-router'
import { ThemeSwitcher } from './theme-switcher'
import { useAuth } from '@/lib/auth-context'
import { Button } from './ui/button'

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
    label: 'Dashboard',
    to: '/dashboard',
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
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

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
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
}
