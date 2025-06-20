import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Navbar } from '../components/navbar'



export const Route = createRootRoute({
  component: () => (
    <>
      <div className="bg-background min-h-screen">
        <Navbar />
        <main className="container mx-auto py-6">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </>
  ),
})
