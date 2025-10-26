import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { ModeToggle } from "@/components/mode-toggle"

export function DashboardHeader() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="font-bold text-lg flex items-center gap-2">
          <span className="text-primary">Health</span>Monitor
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
