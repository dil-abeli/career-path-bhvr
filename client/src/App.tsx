import { createRouter, RouterProvider } from '@tanstack/react-router'
import { useEffect } from 'react'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return <RouterProvider router={router} />
}

export default App
