"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/contexts/user-context"
import { useLanguage } from "@/contexts/language-context"
import { Bell, LockKeyhole, Mail, MessageSquare, Shield, User } from "lucide-react"

export function UserProfile() {
  const { currentUser, updateUser } = useUser()
  const { t, language, setLanguage } = useLanguage()

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)

  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleUpdateProfile = () => {
    if (currentUser) {
      updateUser(currentUser.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      })
    }
  }

  const handleUpdatePassword = () => {
    // In a real app, this would make an API call to update the password
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleUpdateNotifications = () => {
    // In a real app, this would make an API call to update notification preferences
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-md">
      <Tabs defaultValue="personal" className="w-full">
        <div className="flex border-b border-zinc-800">
          <div className="px-4 py-2">
            <TabsList className="h-9 bg-zinc-800">
              <TabsTrigger value="personal" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{t("profile.personal")}</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">{t("profile.security")}</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">{t("profile.preferences")}</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="personal" className="p-4 md:p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentUser.avatar || "/military-officer.png"} alt={currentUser.firstName} />
              <AvatarFallback>
                {currentUser.firstName.charAt(0)}
                {currentUser.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">
                {currentUser.firstName} {currentUser.lastName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-emerald-600">{t(`role.${currentUser.role}`)}</Badge>
                <Badge variant="outline" className="border-amber-500 text-amber-500">
                  {t(`clearance.${currentUser.clearance}`)}
                </Badge>
              </div>
            </div>
          </div>

          <Separator className="bg-zinc-800" />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("users.name").split(" ")[0]}</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t("users.name").split(" ")[1] || "Last Name"}</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("users.email")}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">{t("users.role")}</Label>
              <Input id="role" value={t(`role.${currentUser.role}`)} disabled className="bg-zinc-800 border-zinc-700" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline">{t("common.cancel")}</Button>
            <Button onClick={handleUpdateProfile} className="bg-emerald-600 hover:bg-emerald-700">
              {t("common.save")}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="security" className="p-4 md:p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium">{t("profile.security")}</h3>
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
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline">{t("common.cancel")}</Button>
            <Button onClick={handleUpdatePassword} className="bg-emerald-600 hover:bg-emerald-700">
              Update Password
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="p-4 md:p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium">{t("profile.preferences")}</h3>
            <p className="text-sm text-zinc-400 mt-1">Manage your notification and display preferences</p>
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
            <Label htmlFor="language">{t("header.language")}</Label>
            <Select value={language} onValueChange={(value) => setLanguage(value as "en" | "fr" | "ru")}>
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
            <Button variant="outline">{t("common.cancel")}</Button>
            <Button onClick={handleUpdateNotifications} className="bg-emerald-600 hover:bg-emerald-700">
              {t("common.save")}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
