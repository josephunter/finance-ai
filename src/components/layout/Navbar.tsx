import { UserNav } from "./UserNav"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Wallet, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Navigation } from "./Navigation"
import { useState } from "react"

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-background md:hidden mr-2">
              <div className="absolute w-4 h-4">
                <Menu className="h-full w-full absolute top-0 left-0" />
              </div>
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Navigation onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="flex items-center">
          <Wallet className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-semibold">Asset Tracker</span>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </div>
  )
}