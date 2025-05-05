import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const activities = [
  {
    id: 1,
    time: "09:42 AM",
    title: "Surveillance Report Filed",
    description: "Agent 47 submitted surveillance report on Target Alpha.",
    severity: "normal",
  },
  {
    id: 2,
    time: "08:15 AM",
    title: "New Intelligence Alert",
    description: "Unusual activity detected in Sector 7. Requires immediate attention.",
    severity: "high",
  },
  {
    id: 3,
    time: "Yesterday",
    title: "Target Location Updated",
    description: "Target Bravo's location has been updated to new coordinates.",
    severity: "normal",
  },
  {
    id: 4,
    time: "Yesterday",
    title: "Security Breach Attempt",
    description: "Failed login attempts detected from unauthorized IP address.",
    severity: "critical",
  },
  {
    id: 5,
    time: "2 days ago",
    title: "Mission Report Approved",
    description: "Operation Nightfall report approved by Command.",
    severity: "normal",
  },
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-amber-500"
    case "critical":
      return "bg-red-500"
    default:
      return "bg-blue-500"
  }
}

export function ActivityFeed() {
  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-md">
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex">
              <div className="mr-4 flex flex-col items-center">
                <div className={`h-2 w-2 rounded-full ${getSeverityColor(activity.severity)}`} />
                <div className="h-full w-px bg-zinc-800" />
              </div>
              <div className="flex flex-col space-y-1 pb-4">
                <div className="flex items-center">
                  <p className="text-sm text-zinc-400">{activity.time}</p>
                </div>
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-sm text-zinc-400">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
