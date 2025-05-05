import { User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface FallbackAvatarProps {
  name?: string | null
  className?: string
}

export function FallbackAvatar({ name, className }: FallbackAvatarProps) {
  // Get initials from name
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : ""

  return (
    <Avatar className={className}>
      <AvatarFallback className="bg-zinc-800 text-zinc-200">{initials || <User className="h-4 w-4" />}</AvatarFallback>
    </Avatar>
  )
}
