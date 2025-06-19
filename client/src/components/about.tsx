import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { req } from '@/lib/api/req'
import beaver from '@/assets/beaver.svg'

export const About = () => {
  const [data, setData] = useState<Awaited<ReturnType<typeof req>> | undefined>()

  const fetchData = async (useCase: string) => {
    const data = await req(useCase)
    setData(data)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6">
      <a href="https://github.com/stevedylandev/bhvr" target="_blank">
        <img src={beaver} className="h-16 w-16 cursor-pointer" alt="beaver logo" />
      </a>
      <p className="text-sm text-muted-foreground">The application is built with:</p>
      <h1 className="text-5xl text-foreground font-medium">bhvr</h1>
      <h2 className="text-2xl font-semibold">Bun + Hono + Vite + React</h2>
      <p className="text-sm text-muted-foreground">A typesafe fullstack monorepo</p>
      <div className="flex items-center gap-4">
        <Button onClick={() => fetchData('hello')}>Call API</Button>
        <Button variant="secondary" asChild>
          <a target="_blank" href="https://bhvr.dev">
            Docs
          </a>
        </Button>
      </div>
      {data && (
        <pre className="rounded-md bg-muted p-4">
          <code className="text-muted-foreground">
            Message: {data.message} <br />
            Success: {data.success.toString()}
          </code>
        </pre>
      )}
    </div>
  )
}
