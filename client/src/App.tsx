import { useState } from 'react'
import beaver from './assets/beaver.svg'
import { Button } from './components/ui/button'
import { helloGet } from '@/lib/api/hello/hello.get'

function App() {
  const [data, setData] = useState<Awaited<ReturnType<typeof helloGet>> | undefined>()

  async function sendRequest() {
    const data = await helloGet()
    setData(data)
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen">
      <a href="https://github.com/stevedylandev/bhvr" target="_blank">
        <img src={beaver} className="w-16 h-16 cursor-pointer" alt="beaver logo" />
      </a>
      <h1 className="text-5xl font-black">bhvr</h1>
      <h2 className="text-2xl font-bold">Bun + Hono + Vite + React</h2>
      <p>A typesafe fullstack monorepo</p>
      <div className="flex items-center gap-4">
        <Button onClick={sendRequest}>Call API</Button>
        <Button variant="secondary" asChild>
          <a target="_blank" href="https://bhvr.dev">
            Docs
          </a>
        </Button>
      </div>
      {data && (
        <pre className="bg-gray-100 p-4 rounded-md">
          <code>
            Message: {data.message} <br />
            Success: {data.success.toString()}
          </code>
        </pre>
      )}
    </div>
  )
}

export default App
