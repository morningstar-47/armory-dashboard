"use client"

import { useState } from "react"
import { Eye, FileText, Filter, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const reports = [
  {
    id: "REP-2023-0721",
    title: "Border Surveillance Analysis",
    classification: "Top Secret",
    date: "2023-07-21",
    author: "Maj. K. Williams",
    status: "Verified",
    priority: "High",
    summary: "Comprehensive analysis of northern border surveillance data with satellite imagery correlation.",
  },
  {
    id: "REP-2023-0715",
    title: "Threat Assessment: Operation Blackout",
    classification: "Secret",
    date: "2023-07-15",
    author: "Capt. Sarah Chen",
    status: "Under Review",
    priority: "Critical",
    summary: "Assessment of potential threats related to Operation Blackout in the eastern region.",
  },
  {
    id: "REP-2023-0708",
    title: "Communications Intercept Summary",
    classification: "Confidential",
    date: "2023-07-08",
    author: "Lt. M. Rodriguez",
    status: "Verified",
    priority: "Medium",
    summary: "Summary of key communications intercepted between Target Alpha and known associates.",
  },
  {
    id: "REP-2023-0701",
    title: "Asset Deployment Recommendation",
    classification: "Secret",
    date: "2023-07-01",
    author: "Col. J. Blackwood",
    status: "Approved",
    priority: "High",
    summary: "Strategic recommendations for asset deployment in response to emerging threats.",
  },
  {
    id: "REP-2023-0625",
    title: "Intelligence Briefing: Southern Command",
    classification: "Secret",
    date: "2023-06-25",
    author: "Maj. K. Williams",
    status: "Verified",
    priority: "Medium",
    summary: "Intelligence briefing prepared for Southern Command leadership regarding regional stability.",
  },
]

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "critical":
      return "bg-red-500 hover:bg-red-600"
    case "high":
      return "bg-amber-500 hover:bg-amber-600"
    case "medium":
      return "bg-blue-500 hover:bg-blue-600"
    default:
      return "bg-slate-500 hover:bg-slate-600"
  }
}

const getClassificationColor = (classification: string) => {
  switch (classification.toLowerCase()) {
    case "top secret":
      return "border-red-500 text-red-500"
    case "secret":
      return "border-amber-500 text-amber-500"
    case "confidential":
      return "border-blue-500 text-blue-500"
    default:
      return "border-green-500 text-green-500"
  }
}

export function ReportsList() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-8 bg-zinc-800 border-zinc-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700">
              <SelectValue placeholder="Classification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classifications</SelectItem>
              <SelectItem value="top-secret">Top Secret</SelectItem>
              <SelectItem value="secret">Secret</SelectItem>
              <SelectItem value="confidential">Confidential</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="bg-zinc-900 border-zinc-800 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-zinc-400" />
                  <CardTitle className="text-md font-medium">{report.title}</CardTitle>
                </div>
                <div className="flex items-center mt-1 text-xs text-zinc-400">
                  <span>
                    {report.id} • {report.date} • {report.author}
                  </span>
                </div>
              </div>
              <Badge variant="outline" className={`border ${getClassificationColor(report.classification)}`}>
                {report.classification}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400 mb-4">{report.summary}</p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-zinc-800">
                  Status: {report.status}
                </Badge>
                <div className="flex items-center gap-2">
                  <Badge className={`${getPriorityColor(report.priority)}`}>{report.priority} Priority</Badge>
                  <Button size="sm" variant="ghost" className="gap-1">
                    <Eye className="h-4 w-4" /> View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
