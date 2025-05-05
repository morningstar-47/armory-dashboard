"use client"

import { Menu, Globe, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"
import { useLanguage } from "@/contexts/language-context"
import { useUser } from "@/contexts/user-context"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const languages = {
  en: "English",
  fr: "Français",
  ru: "Русский",
}

export function Header() {
  const { language, setLanguage, t } = useLanguage()
  const { currentUser } = useUser()
  const { signOut } = useAuth()

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 md:px-6">
      <div className="flex items-center md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-zinc-900 border-zinc-800">
            <Sidebar />
          </SheetContent>
        </Sheet>
        <span className="text-lg font-bold md:hidden">ARMORY</span>
      </div>

      <div className="flex items-center ml-auto space-x-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
                3
              </Badge>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2 font-medium border-b border-zinc-800">Notifications</div>
            <div className="py-2 px-3 text-sm border-b border-zinc-800">
              <div className="font-medium">New alert detected</div>
              <div className="text-zinc-400 text-xs">10 minutes ago</div>
            </div>
            <div className="py-2 px-3 text-sm border-b border-zinc-800">
              <div className="font-medium">Report approved</div>
              <div className="text-zinc-400 text-xs">1 hour ago</div>
            </div>
            <div className="py-2 px-3 text-sm">
              <div className="font-medium">System update completed</div>
              <div className="text-zinc-400 text-xs">2 hours ago</div>
            </div>
            <div className="p-2 border-t border-zinc-800 text-center">
              <Link href="/notifications" className="text-xs text-emerald-500 hover:text-emerald-400">
                View all notifications
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Globe className="h-4 w-4 mr-1" />
              {languages[language as keyof typeof languages]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("fr")}>Français</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("ru")}>Русский</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={currentUser?.avatar || "/military-officer.png"}
                  alt={currentUser?.firstName || "User"}
                />
                <AvatarFallback>
                  {currentUser ? getInitials(currentUser.firstName, currentUser.lastName) : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/profile">{t("header.profile")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">{t("header.settings")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={signOut}>{t("header.logout")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
