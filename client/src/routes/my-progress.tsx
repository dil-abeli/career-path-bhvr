import { createFileRoute } from '@tanstack/react-router'

const MyProgress = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Progress</h1>
      <p className="text-muted-foreground">
        Track your learning progress and achievements.
      </p>
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">JavaScript Fundamentals</h3>
            <span className="text-sm text-muted-foreground">75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">React Development</h3>
            <span className="text-sm text-muted-foreground">45%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/my-progress')({
  component: () => <MyProgress />,
})