import { createFileRoute } from '@tanstack/react-router'
import { Button } from '../components/ui/button'

const Profile = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-muted-foreground">John Doe</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-muted-foreground">john.doe@example.com</p>
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <p className="text-muted-foreground">Software Developer</p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Career Goals</h2>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium">Current Focus</label>
                <p className="text-muted-foreground">Full-Stack Development</p>
              </div>
              <div>
                <label className="text-sm font-medium">Target Role</label>
                <p className="text-muted-foreground">Senior Software Engineer</p>
              </div>
              <div>
                <label className="text-sm font-medium">Timeline</label>
                <p className="text-muted-foreground">12 months</p>
              </div>
            </div>
            <Button className="mt-4">Edit Goals</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/profile')({
  component: () => <Profile />,
})