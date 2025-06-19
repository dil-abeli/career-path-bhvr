import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="min-h-screen bg-background">
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-14 items-center">
            <div className="mr-4 hidden md:flex">
              <Link to="/" className="mr-6 flex items-center space-x-2">
                <span className="hidden font-bold sm:inline-block">
                  Career Path Tracker
                </span>
              </Link>
            </div>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <nav className="flex items-center space-x-6">
                <Link
                  to="/"
                  className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
                  activeProps={{
                    className: 'text-foreground'
                  }}
                >
                  Home
                </Link>
                <Link
                  to="/career-paths"
                  className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
                  activeProps={{
                    className: 'text-foreground'
                  }}
                >
                  Career Paths
                </Link>
                <Link
                  to="/my-progress"
                  className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
                  activeProps={{
                    className: 'text-foreground'
                  }}
                >
                  My Progress
                </Link>
                <Link
                  to="/profile"
                  className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
                  activeProps={{
                    className: 'text-foreground'
                  }}
                >
                  Profile
                </Link>
                <Link
                  to="/about"
                  className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
                  activeProps={{
                    className: 'text-foreground'
                  }}
                >
                  About
                </Link>
              </nav>
            </div>
          </div>
        </nav>
        <main className="container mx-auto py-6">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </>
  ),
})