"use client"

import { useState } from "react"
import { AlertTriangle, Bell, CheckCircle, ChevronDown, Clock, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const alerts = [
  {
    id: "ALT-20230721-001",
    title: "Unauthorized Access Attempt",
    description: "Multiple failed login attempts detected from Russian IP addresses targeting secure database.",
    timestamp: "2023-07-21T08:42:13Z",
    severity: "High",
    category: "Security",
    status: "Active",
  },
  {
    id: "ALT-20230721-002",
    title: "Movement Detected: Target Sierra",
    description:
      "Target Sierra has moved out of designated surveillance zone. Last spotted at coordinates 34.0522° N, 118.2437° W.",
    timestamp: "2023-07-21T10:15:05Z",
    severity: "Medium",
    category: "Surveillance",
    status: "Active",
  },
  {
    id: "ALT-20230720-003",
    title: "Communications Blackout: Eastern Sector",
    description: "Complete communications blackout detected in Eastern Sector. Investigating possible signal jamming.",
    timestamp: "2023-07-20T23:07:55Z",
    severity: "Critical",
    category: "Communications",
    status: "Active",
  },
  {
    id: "ALT-20230720-001",
    title: "Unusual Financial Activity",
    description: "Unusual financial transactions detected in monitored accounts connected to Subject Delta.",
    timestamp: "2023-07-20T14:32:18Z",
    severity: "Low",
    category: "Financial",
    status: "Resolved",
  },
  {
    id: "ALT-20230719-002",
    title: "Pattern Match: Operation Stonewall",
    description: "Activity patterns matching Operation Stonewall parameters detected in Northern Region.",
    timestamp: "2023-07-19T19:21:43Z",
    severity: "Medium",
    category: "Pattern Recognition",
    status: "Under Investigation",
  },
]

const getSeverityIcon = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "critical":
      return <AlertTriangle className="h-5 w-5 text-red-500" />
    case "high":
      return <AlertTriangle className="h-5 w-5 text-amber-500" />
    case "medium":
      return <Bell className="h-5 w-5 text-blue-500" />
    default:
      return <Bell className="h-5 w-5 text-zinc-400" />
  }
}

const getSeverityClass = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "critical":
      return "bg-red-500/20 text-red-500 border-red-500"
    case "high":
      return "bg-amber-500/20 text-amber-500 border-amber-500"
    case "medium":
      return "bg-blue-500/20 text-blue-500 border-blue-500"
    default:
      return "bg-zinc-500/20 text-zinc-500 border-zinc-500"
  }
}

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-red-500/20 text-red-500 border-red-500"
    case "under investigation":
      return "bg-amber-500/20 text-amber-500 border-amber-500"
    case "resolved":
      return "bg-green-500/20 text-green-500 border-green-500"
    default:
      return "bg-zinc-500/20 text-zinc-500 border-zinc-500"
  }
}

type AlertItemProps = {
  alert: (typeof alerts)[0]
}

function AlertItem({ alert }: AlertItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border border-zinc-800 rounded-lg mb-4">
      <div className="flex items-center p-4 bg-zinc-900">
        <div className="mr-4">{getSeverityIcon(alert.severity)}</div>
        <div className="flex-1">
          <div className="font-medium">{alert.title}</div>
          <div className="text-xs text-zinc-400 flex items-center mt-1">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(alert.timestamp).toLocaleString()}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`border ${getSeverityClass(alert.severity)}`}>{alert.severity}</Badge>
          <Badge className={`border ${getStatusClass(alert.status)}`}>{alert.status}</Badge>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent>
        <div className="p-4 border-t border-zinc-800 bg-zinc-950">
          <p className="text-sm text-zinc-300 mb-4">{alert.description}</p>
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="border-zinc-700 text-zinc-400">
              Category: {alert.category}
            </Badge>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-8">
                Investigate
              </Button>
              <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700">
                <CheckCircle className="h-4 w-4 mr-1" /> Mark Resolved
              </Button>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function AlertsPanel() {
  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <Shield className="h-5 w-5 mr-2 text-zinc-400" />
            Alert Management
          </CardTitle>
          <Button className="bg-emerald-600 hover:bg-emerald-700">Create Alert</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active">
          <TabsList className="mb-4 bg-zinc-800">
            <TabsTrigger value="active">Active (3)</TabsTrigger>
            <TabsTrigger value="investigating">Investigating (1)</TabsTrigger>
            <TabsTrigger value="resolved">Resolved (1)</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            {alerts
              .filter((a) => a.status === "Active")
              .map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
          </TabsContent>
          <TabsContent value="investigating">
            {alerts
              .filter((a) => a.status === "Under Investigation")
              .map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
          </TabsContent>
          <TabsContent value="resolved">
            {alerts
              .filter((a) => a.status === "Resolved")
              .map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
          </TabsContent>
          <TabsContent value="all">
            {alerts.map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
