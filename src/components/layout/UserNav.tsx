import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { CurrencySelect } from "@/components/currency/CurrencySelect"
import { Settings, User, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function UserNav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-background">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.email?.split('@')[0]}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
            <div className="relative w-4 h-4 mr-2">
              <Settings className="h-full w-full absolute top-0 left-0" />
            </div>
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="relative w-4 h-4 mr-2">
              <User className="h-full w-full absolute top-0 left-0" />
            </div>
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex items-center w-full">
              <span className="mr-2">Currency</span>
              <div className="ml-auto">
                <CurrencySelect />
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <div className="relative w-4 h-4 mr-2">
            <LogOut className="h-full w-full absolute top-0 left-0" />
          </div>
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 