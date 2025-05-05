"use client"

import { useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Layers,
  MapPin,
  Target,
  AlertTriangle,
  Users,
  Radio,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Compass,
  Search,
  X,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

// Sample intelligence data with geographic coordinates
const intelligenceData = [
  {
    id: 1,
    type: "target",
    name: "Target Alpha",
    coordinates: [-74.006, 40.7128], // New York
    location: "New York City",
    status: "active",
    lastUpdated: "10 minutes ago",
    threatLevel: "high",
    description: "High-value target with confirmed location",
    notes: "Subject is believed to be armed and dangerous. Approach with caution.",
    x: 65, // Percentage position on the map (x-axis)
    y: 40, // Percentage position on the map (y-axis)
  },
  {
    id: 2,
    type: "asset",
    name: "Field Team Bravo",
    coordinates: [-73.95, 40.65], // Brooklyn
    location: "Brooklyn, NY",
    status: "deployed",
    lastUpdated: "25 minutes ago",
    assetType: "surveillance",
    description: "Surveillance team monitoring Target Alpha",
    x: 66,
    y: 41,
  },
  {
    id: 3,
    type: "incident",
    name: "Unauthorized Access",
    coordinates: [-73.97, 40.78], // Upper Manhattan
    location: "Upper Manhattan",
    status: "active",
    lastUpdated: "1 hour ago",
    severity: "medium",
    description: "Unauthorized access to secure facility detected",
    x: 65.5,
    y: 39,
  },
  {
    id: 4,
    type: "target",
    name: "Target Bravo",
    coordinates: [-118.2437, 34.0522], // Los Angeles
    location: "Los Angeles",
    status: "monitoring",
    lastUpdated: "2 hours ago",
    threatLevel: "medium",
    description: "Person of interest under remote surveillance",
    x: 20,
    y: 42,
  },
  {
    id: 5,
    type: "asset",
    name: "Drone Charlie",
    coordinates: [-118.35, 34.06], // West LA
    location: "West Los Angeles",
    status: "active",
    lastUpdated: "15 minutes ago",
    assetType: "aerial",
    description: "Aerial surveillance drone monitoring western sector",
    x: 19,
    y: 41.5,
  },
  {
    id: 6,
    type: "incident",
    name: "Communications Disruption",
    coordinates: [-118.4, 34.05], // Santa Monica
    location: "Santa Monica",
    status: "investigating",
    lastUpdated: "45 minutes ago",
    severity: "high",
    description: "Signal jamming detected in this area",
    x: 18,
    y: 42,
  },
  {
    id: 7,
    type: "target",
    name: "Target Delta",
    coordinates: [2.3522, 48.8566], // Paris
    location: "Paris, France",
    status: "lost",
    lastUpdated: "5 hours ago",
    threatLevel: "critical",
    description: "High-priority target, last known location",
    x: 48,
    y: 30,
  },
  {
    id: 8,
    type: "asset",
    name: "Field Team Echo",
    coordinates: [2.3, 48.87], // Near Paris
    location: "Northern Paris",
    status: "deployed",
    lastUpdated: "30 minutes ago",
    assetType: "ground",
    description: "Search team attempting to locate Target Delta",
    x: 47.5,
    y: 29.5,
  },
  {
    id: 9,
    type: "incident",
    name: "Data Breach",
    coordinates: [2.29, 48.86], // Paris area
    location: "Paris Financial District",
    status: "contained",
    lastUpdated: "3 hours ago",
    severity: "critical",
    description: "Secure server compromised, containment protocols active",
    x: 48.2,
    y: 30.2,
  },
  {
    id: 10,
    type: "asset",
    name: "Surveillance Post Foxtrot",
    coordinates: [13.405, 52.52], // Berlin
    location: "Berlin, Germany",
    status: "active",
    lastUpdated: "1 hour ago",
    assetType: "stationary",
    description: "Fixed surveillance post monitoring diplomatic activities",
    x: 52,
    y: 32,
  },
  {
    id: 11,
    type: "target",
    name: "Target Echo",
    coordinates: [139.6917, 35.6895], // Tokyo
    location: "Tokyo, Japan",
    status: "active",
    lastUpdated: "3 hours ago",
    threatLevel: "medium",
    description: "Foreign operative with suspected intelligence connections",
    x: 82,
    y: 42,
  },
  {
    id: 12,
    type: "incident",
    name: "Cyber Attack",
    coordinates: [37.6173, 55.7558], // Moscow
    location: "Moscow, Russia",
    status: "active",
    lastUpdated: "30 minutes ago",
    severity: "critical",
    description: "Ongoing cyber attack targeting secure networks",
    x: 58,
    y: 28,
  },
]

// Helper function to get marker color based on type and status
const getMarkerColor = (type: string, status: string) => {
  if (type === "target") {
    if (status === "active") return "#ef4444" // red-500
    if (status === "monitoring") return "#f59e0b" // amber-500
    return "#6b7280" // gray-500
  }
  if (type === "asset") {
    if (status === "deployed" || status === "active") return "#10b981" // emerald-500
    return "#6b7280" // gray-500
  }
  if (type === "incident") {
    if (status === "active") return "#ef4444" // red-500
    if (status === "investigating") return "#f59e0b" // amber-500
    return "#3b82f6" // blue-500
  }
  return "#6b7280" // gray-500
}

// Helper function to get icon based on type
const getMarkerIcon = (type: string) => {
  if (type === "target") return <Target className="h-4 w-4" />
  if (type === "asset") return <Users className="h-4 w-4" />
  if (type === "incident") return <AlertTriangle className="h-4 w-4" />
  return <MapPin className="h-4 w-4" />
}

export function IntelligenceMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [selectedPoint, setSelectedPoint] = useState<(typeof intelligenceData)[0] | null>(null)
  const [visibleLayers, setVisibleLayers] = useState({
    targets: true,
    assets: true,
    incidents: true,
  })
  const [timeRange, setTimeRange] = useState([24]) // Hours
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState({ x: 50, y: 50 }) // Center of the map as percentage
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof intelligenceData>([])
  const [highlightedResult, setHighlightedResult] = useState<number | null>(null)

  // Toggle layer visibility
  const toggleLayer = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }))
  }

  // Zoom in/out
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1))
  }

  // Reset view
  const resetView = () => {
    setZoom(1)
    setCenter({ x: 50, y: 50 })
    setSelectedPoint(null)
    setHighlightedResult(null)
  }

  // Fly to a specific location
  const flyTo = (x: number, y: number) => {
    setCenter({ x, y })
    setZoom(2.5)
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const lowerQuery = query.toLowerCase()
    const results = intelligenceData.filter((item) => {
      return (
        item.name.toLowerCase().includes(lowerQuery) ||
        (item.location && item.location.toLowerCase().includes(lowerQuery)) ||
        item.type.toLowerCase().includes(lowerQuery) ||
        item.status.toLowerCase().includes(lowerQuery) ||
        (item.threatLevel && item.threatLevel.toLowerCase().includes(lowerQuery)) ||
        (item.assetType && item.assetType.toLowerCase().includes(lowerQuery)) ||
        (item.severity && item.severity.toLowerCase().includes(lowerQuery))
      )
    })

    setSearchResults(results)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setHighlightedResult(null)
  }

  // Select search result
  const selectSearchResult = (item: (typeof intelligenceData)[0]) => {
    setSelectedPoint(item)
    flyTo(item.x, item.y)
    setHighlightedResult(item.id)
  }

  // Filter data based on visible layers
  const filteredData = intelligenceData.filter((point) => {
    // Filter by type
    if (point.type === "target" && !visibleLayers.targets) return false
    if (point.type === "asset" && !visibleLayers.assets) return false
    if (point.type === "incident" && !visibleLayers.incidents) return false

    // For demo purposes, we're not actually filtering by time
    return true
  })

  // Calculate marker positions based on zoom and center
  const getMarkerStyle = (x: number, y: number, isHighlighted = false) => {
    const offsetX = (x - center.x) * zoom + 50
    const offsetY = (y - center.y) * zoom + 50

    return {
      left: `${offsetX}%`,
      top: `${offsetY}%`,
      transform: "translate(-50%, -50%)",
      position: "absolute" as const,
      zIndex: isHighlighted ? 20 : 10,
      filter: isHighlighted ? "drop-shadow(0 0 8px rgba(255, 255, 255, 0.7))" : "none",
    }
  }

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Map Controls */}
      <Card className="lg:col-span-1 bg-zinc-900 border-zinc-800 shadow-md overflow-auto">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-zinc-800">
            <TabsTrigger value="search" className="flex items-center gap-1">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </TabsTrigger>
            <TabsTrigger value="layers" className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Layers</span>
            </TabsTrigger>
            <TabsTrigger value="filters" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-1">
              <Radio className="h-4 w-4" />
              <span className="hidden sm:inline">Details</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="p-4 space-y-4">
            <h3 className="font-medium">Search Intelligence Data</h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, location, type..."
                className="pl-8 bg-zinc-800 border-zinc-700"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchQuery && (
                <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-7 w-7" onClick={clearSearch}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {searchResults.length > 0 ? (
              <div className="space-y-1">
                <div className="text-xs text-zinc-400 mb-2">
                  {searchResults.length} {searchResults.length === 1 ? "result" : "results"} found
                </div>
                <ScrollArea className="h-[calc(100vh-280px)] pr-4">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className={`p-2 rounded-md mb-2 cursor-pointer transition-colors ${
                        highlightedResult === result.id ? "bg-zinc-700" : "bg-zinc-800 hover:bg-zinc-700"
                      }`}
                      onClick={() => selectSearchResult(result)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getMarkerColor(result.type, result.status) }}
                          ></div>
                          <span className="font-medium">{result.name}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            result.type === "target"
                              ? "border-red-500 text-red-500"
                              : result.type === "asset"
                                ? "border-emerald-500 text-emerald-500"
                                : "border-amber-500 text-amber-500"
                          }`}
                        >
                          {result.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-zinc-400 mt-1">
                        <div className="flex justify-between">
                          <span>{result.location}</span>
                          <span className="capitalize">{result.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            ) : searchQuery ? (
              <div className="text-center py-8 text-zinc-400">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No results found for "{searchQuery}"</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-400">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Search for assets, targets, or locations</p>
                <p className="text-xs mt-1">Example: "Paris", "Target", "Active"</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="layers" className="p-4 space-y-4">
            <h3 className="font-medium">Map Layers</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="targets" checked={visibleLayers.targets} onCheckedChange={() => toggleLayer("targets")} />
                <Label htmlFor="targets" className="flex items-center gap-2">
                  <Badge className="bg-red-500">
                    <Target className="h-3 w-3 mr-1" /> Targets
                  </Badge>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="assets" checked={visibleLayers.assets} onCheckedChange={() => toggleLayer("assets")} />
                <Label htmlFor="assets" className="flex items-center gap-2">
                  <Badge className="bg-emerald-500">
                    <Users className="h-3 w-3 mr-1" /> Assets
                  </Badge>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="incidents"
                  checked={visibleLayers.incidents}
                  onCheckedChange={() => toggleLayer("incidents")}
                />
                <Label htmlFor="incidents" className="flex items-center gap-2">
                  <Badge className="bg-amber-500">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Incidents
                  </Badge>
                </Label>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="font-medium mb-2">Time Range</h3>
              <div className="space-y-2">
                <Slider value={timeRange} min={1} max={72} step={1} onValueChange={setTimeRange} className="w-full" />
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Last {timeRange[0]} hours</span>
                  <span>{timeRange[0] === 72 ? "All data" : ""}</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={resetView} variant="outline" className="w-full">
                Reset View
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="filters" className="p-4 space-y-4">
            <h3 className="font-medium">Filter Options</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Threat Level</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="threat-critical" />
                    <Label htmlFor="threat-critical">Critical</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="threat-high" defaultChecked />
                    <Label htmlFor="threat-high">High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="threat-medium" defaultChecked />
                    <Label htmlFor="threat-medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="threat-low" defaultChecked />
                    <Label htmlFor="threat-low">Low</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-medium">Status</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="status-active" defaultChecked />
                    <Label htmlFor="status-active">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="status-monitoring" defaultChecked />
                    <Label htmlFor="status-monitoring">Monitoring</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="status-investigating" defaultChecked />
                    <Label htmlFor="status-investigating">Investigating</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="status-contained" />
                    <Label htmlFor="status-contained">Contained</Label>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  Apply Filters
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="p-4">
            {selectedPoint ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <Badge
                      className={`${
                        selectedPoint.type === "target"
                          ? "bg-red-500"
                          : selectedPoint.type === "asset"
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                      }`}
                    >
                      {selectedPoint.type.charAt(0).toUpperCase() + selectedPoint.type.slice(1)}
                    </Badge>
                    {selectedPoint.name}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPoint(null)}>
                    <EyeOff className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-zinc-400">Status:</span>
                    <span className="col-span-2 capitalize">{selectedPoint.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-zinc-400">Location:</span>
                    <span className="col-span-2">{selectedPoint.location}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-zinc-400">Updated:</span>
                    <span className="col-span-2">{selectedPoint.lastUpdated}</span>
                  </div>
                  {selectedPoint.threatLevel && (
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-zinc-400">Threat:</span>
                      <span className="col-span-2 capitalize">{selectedPoint.threatLevel}</span>
                    </div>
                  )}
                  {selectedPoint.assetType && (
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-zinc-400">Type:</span>
                      <span className="col-span-2 capitalize">{selectedPoint.assetType}</span>
                    </div>
                  )}
                  {selectedPoint.severity && (
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-zinc-400">Severity:</span>
                      <span className="col-span-2 capitalize">{selectedPoint.severity}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-zinc-400">Coordinates:</span>
                    <span className="col-span-2">
                      {selectedPoint.coordinates[1].toFixed(4)}, {selectedPoint.coordinates[0].toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-zinc-300">{selectedPoint.description}</p>
                </div>

                {selectedPoint.notes && (
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-1">Notes</h4>
                    <p className="text-sm text-zinc-300">{selectedPoint.notes}</p>
                  </div>
                )}

                <div className="pt-4 flex gap-2">
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => flyTo(selectedPoint.x, selectedPoint.y)}
                  >
                    Zoom To Location
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-400">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Select a point on the map to view details</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Map Container */}
      <Card className="lg:col-span-3 bg-zinc-900 border-zinc-800 shadow-md overflow-hidden">
        <div className="relative h-full w-full bg-zinc-950 overflow-hidden">
          {/* Map background with grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
              backgroundPosition: `${-center.x % 20}px ${-center.y % 20}px`,
            }}
          />

          {/* Map controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={resetView}>
              <Compass className="h-4 w-4" />
            </Button>
          </div>

          {/* Map markers */}
          {filteredData.map((point) => (
            <div
              key={point.id}
              className={`absolute cursor-pointer transition-all duration-300 ease-in-out`}
              style={getMarkerStyle(point.x, point.y, highlightedResult === point.id)}
              onClick={() => {
                setSelectedPoint(point)
                setHighlightedResult(point.id)
              }}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  highlightedResult === point.id ? "ring-2 ring-white" : ""
                }`}
                style={{ backgroundColor: getMarkerColor(point.type, point.status) }}
              >
                {point.type === "target" ? (
                  <Target className="h-4 w-4 text-white" />
                ) : point.type === "asset" ? (
                  <Users className="h-4 w-4 text-white" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-white" />
                )}
              </div>
              {(zoom > 1.5 || highlightedResult === point.id) && (
                <div
                  className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap bg-zinc-800 px-2 py-0.5 rounded text-xs ${
                    highlightedResult === point.id ? "font-bold text-white" : ""
                  }`}
                >
                  {point.name}
                </div>
              )}
            </div>
          ))}

          {/* Map regions - simplified representation */}
          <div className="absolute inset-0 pointer-events-none">
            {/* North America */}
            <div
              className="absolute"
              style={{
                left: "20%",
                top: "40%",
                width: "15%",
                height: "10%",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "40%",
              }}
            ></div>

            {/* Europe */}
            <div
              className="absolute"
              style={{
                left: "48%",
                top: "30%",
                width: "8%",
                height: "6%",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "40%",
              }}
            ></div>

            {/* Asia */}
            <div
              className="absolute"
              style={{
                left: "65%",
                top: "40%",
                width: "20%",
                height: "15%",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "40%",
              }}
            ></div>
          </div>
        </div>
      </Card>
    </div>
  )
}
