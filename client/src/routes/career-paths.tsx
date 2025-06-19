import { createFileRoute } from '@tanstack/react-router'

const CareerPaths = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Career Paths</h1>
      <p className="text-muted-foreground">
        Explore different career paths and find the one that fits your goals.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Software Engineering</h3>
          <p className="text-sm text-muted-foreground">
            Build applications and systems that power the digital world.
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Data Science</h3>
          <p className="text-sm text-muted-foreground">
            Extract insights from data to drive business decisions.
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Product Management</h3>
          <p className="text-sm text-muted-foreground">
            Guide product development from conception to launch.
          </p>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/career-paths')({
  component: () => <CareerPaths />,
})