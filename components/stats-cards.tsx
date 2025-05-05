import { FileText, Users, AlertTriangle, Database } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const stats = [
  {
    title: "Intelligence Reports",
    value: "247",
    change: "+12%",
    trend: "up",
    icon: FileText,
    color: "blue",
    link: "/reports",
  },
  {
    title: "Monitored Subjects",
    value: "58",
    change: "+5%",
    trend: "up",
    icon: Users,
    color: "purple",
    link: "/map",
  },
  {
    title: "Active Alerts",
    value: "13",
    change: "-3",
    trend: "down",
    icon: AlertTriangle,
    color: "red",
    link: "/alerts",
  },
  {
    title: "Data Points",
    value: "2.4k",
    change: "+18%",
    trend: "up",
    icon: Database,
    color: "green",
    link: "/data-collection",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat) => (
        <Link key={stat.title} href={stat.link}>
          <Card className="bg-zinc-900 border-zinc-800 shadow-md transition-all hover:bg-zinc-800 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">{stat.title}</CardTitle>
              <div className={`text-${stat.color}-500`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.trend === "up" ? "text-emerald-500" : "text-red-500"}`}>
                {stat.change} {stat.trend === "up" ? "↑" : "↓"}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
