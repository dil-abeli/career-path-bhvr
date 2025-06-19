import { About } from './components/about'
import { Home } from './components/home'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <div>
      <Home />
      <About />
    </div>
  )
}

export default App
