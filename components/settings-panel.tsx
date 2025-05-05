"use client"

import { useState } from "react"
import { Bell, LockKeyhole, Mail, MessageSquare, Shield, User, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export function SettingsPanel() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [username, setUsername] = useState("commander_ops")
  const [email, setEmail] = useState("commander@armory.gov")
  const [firstName, setFirstName] = useState("Alexander")
  const [lastName, setLastName] = useState("Mitchell")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-md">
      <Tabs defaultValue="account" className="w-full">
        <div className="flex border-b border-zinc-800">
          <div className="px-4 py-2">
            <TabsList className="h-9 bg-zinc-800">
              <TabsTrigger value="account" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="teams" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Teams</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="account" className="p-4 md:p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium">Account Settings</h3>
            <p className="text-sm text-zinc-400 mt-1">Manage your account information</p>
          </div>
          <Separator className="bg-zinc-800" />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value="Operations Commander" disabled className="bg-zinc-800 border-zinc-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clearance">Clearance Level</Label>
              <Input id="clearance" value="Top Secret/SCI" disabled className="bg-zinc-800 border-zinc-700" />
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <Label htmlFor="language">Interface Language</Label>
            <Select defaultValue="en">
              <SelectTrigger className="w-full md:w-[240px] bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="ru">Русский</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="security" className="p-4 md:p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium">Security Settings</h3>
            <p className="text-sm text-zinc-400 mt-1">Manage your security preferences</p>
          </div>
          <Separator className="bg-zinc-800" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <LockKeyhole className="h-4 w-4 text-zinc-400" />
                  <Label htmlFor="two-factor">Two-factor Authentication</Label>
                </div>
                <p className="text-sm text-zinc-400">Add an extra layer of security to your account</p>
              </div>
              <Switch id="two-factor" checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">Update Password</Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="p-4 md:p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium">Notification Settings</h3>
            <p className="text-sm text-zinc-400 mt-1">Manage how you receive notifications</p>
          </div>
          <Separator className="bg-zinc-800" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-zinc-400" />
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                </div>
                <p className="text-sm text-zinc-400">Receive notifications via email</p>
              </div>
              <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-zinc-400" />
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                </div>
                <p className="text-sm text-zinc-400">Receive critical alerts via SMS</p>
              </div>
              <Switch id="sms-notifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-zinc-400" />
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                </div>
                <p className="text-sm text-zinc-400">Receive in-app push notifications</p>
              </div>
              <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <Label htmlFor="alert-frequency">Alert Frequency</Label>
            <Select defaultValue="real-time">
              <SelectTrigger className="w-full md:w-[240px] bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="real-time">Real-time</SelectItem>
                <SelectItem value="hourly">Hourly Digest</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline">Reset to Defaults</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">Save Preferences</Button>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="p-4 md:p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium">Team Management</h3>
            <p className="text-sm text-zinc-400 mt-1">Manage your team and permissions</p>
          </div>
          <Separator className="bg-zinc-800" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Strategic Operations</div>
                <p className="text-sm text-zinc-400">Your primary team</p>
              </div>
              <Button variant="outline" size="sm">
                Manage Team
              </Button>
            </div>

            <Separator className="bg-zinc-800" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Intelligence Analysis</div>
                <p className="text-sm text-zinc-400">Collaborator</p>
              </div>
              <Button variant="outline" size="sm">
                View Team
              </Button>
            </div>

            <Separator className="bg-zinc-800" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Field Operations</div>
                <p className="text-sm text-zinc-400">Viewer</p>
              </div>
              <Button variant="outline" size="sm">
                View Team
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button className="gap-1">
              <Users className="h-4 w-4" />
              Create New Team
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
