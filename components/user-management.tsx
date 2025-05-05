"use client"

import { useState } from "react"
import { Search, MoreHorizontal, UserPlus, Edit, Trash2, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  useUser,
  type User as UserType,
  type UserRole,
  type UserStatus,
  type ClearanceLevel,
} from "@/contexts/user-context"
import { useLanguage } from "@/contexts/language-context"
import { usePermissions } from "@/contexts/permissions-context"
import { useAuth } from "@/contexts/auth-context"

export function UserManagement() {
  const { users, addUser, updateUser, deleteUser } = useUser()
  const { t } = useLanguage()
  const { can } = usePermissions()
  const { createUser } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false)
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state for adding/editing users
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "analyst" as UserRole,
    status: "active" as UserStatus,
    clearance: "confidential" as ClearanceLevel,
  })

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
    const query = searchQuery.toLowerCase()
    return (
      fullName.includes(query) ||
      user.email.toLowerCase().includes(query) ||
      t(`role.${user.role}`).toLowerCase().includes(query) ||
      t(`status.${user.status}`).toLowerCase().includes(query)
    )
  })

  // Handle opening the edit dialog
  const handleEditUser = (user: UserType) => {
    setSelectedUser(user)
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "",
      confirmPassword: "",
      role: user.role,
      status: user.status,
      clearance: user.clearance,
    })
    setIsEditUserDialogOpen(true)
  }

  // Handle opening the delete dialog
  const handleDeleteUser = (user: UserType) => {
    setSelectedUser(user)
    setIsDeleteUserDialogOpen(true)
  }

  // Handle form submission for adding a new user
  const handleAddUser = async () => {
    setError(null)
    setIsSubmitting(true)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t("users.passwordMismatch"))
      setIsSubmitting(false)
      return
    }

    try {
      // Create user in auth system
      const { success, error, userId } = await createUser(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        clearance: formData.clearance,
        status: formData.status,
      })

      if (!success || !userId) {
        setError(error || t("users.createError"))
        setIsSubmitting(false)
        return
      }

      setIsAddUserDialogOpen(false)
      resetForm()
    } catch (err) {
      console.error("Error creating user:", err)
      setError(t("users.createError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form submission for editing a user
  const handleUpdateUser = async () => {
    if (selectedUser) {
      setIsSubmitting(true)
      setError(null)

      try {
        const result = await updateUser(selectedUser.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role,
          status: formData.status,
          clearance: formData.clearance,
        })

        if (!result) {
          setError(t("users.updateError"))
          setIsSubmitting(false)
          return
        }

        setIsEditUserDialogOpen(false)
        resetForm()
      } catch (err) {
        console.error("Error updating user:", err)
        setError(t("users.updateError"))
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // Handle confirming user deletion
  const handleConfirmDelete = async () => {
    if (selectedUser) {
      setIsSubmitting(true)
      setError(null)

      try {
        const result = await deleteUser(selectedUser.id)

        if (!result) {
          setError(t("users.deleteError"))
          setIsSubmitting(false)
          return
        }

        setIsDeleteUserDialogOpen(false)
        setSelectedUser(null)
      } catch (err) {
        console.error("Error deleting user:", err)
        setError(t("users.deleteError"))
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // Reset form data
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "analyst",
      status: "active",
      clearance: "confidential",
    })
    setSelectedUser(null)
    setError(null)
  }

  // Helper function to get status badge color
  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case "active":
        return "bg-emerald-500 hover:bg-emerald-600"
      case "inactive":
        return "bg-zinc-500 hover:bg-zinc-600"
      case "suspended":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-zinc-500 hover:bg-zinc-600"
    }
  }

  // Helper function to get clearance badge color
  const getClearanceColor = (clearance: ClearanceLevel) => {
    switch (clearance) {
      case "topsecret":
        return "border-red-500 text-red-500"
      case "secret":
        return "border-amber-500 text-amber-500"
      case "confidential":
        return "border-blue-500 text-blue-500"
      default:
        return "border-zinc-500 text-zinc-500"
    }
  }

  // Helper function to get user initials
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("users.search")}
            className="pl-8 bg-zinc-800 border-zinc-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {can("users:create") && (
          <Button onClick={() => setIsAddUserDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <UserPlus className="h-4 w-4 mr-2" />
            {t("users.add")}
          </Button>
        )}
      </div>

      <Card className="bg-zinc-900 border-zinc-800 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">{t("users.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 px-4 font-medium text-zinc-400">{t("users.name")}</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-400">{t("users.email")}</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-400">{t("users.role")}</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-400">{t("users.status")}</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-400">{t("users.clearance")}</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-400">{t("users.lastActive")}</th>
                  <th className="text-right py-3 px-4 font-medium text-zinc-400">{t("users.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-zinc-800">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                            alt={`${user.firstName} ${user.lastName}`}
                          />
                          <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                        </Avatar>
                        <span>
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{t(`role.${user.role}`)}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(user.status)}>{t(`status.${user.status}`)}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={getClearanceColor(user.clearance)}>
                        {t(`clearance.${user.clearance}`)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 text-sm">{formatDate(user.lastActive)}</td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {can("users:edit") && (
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4 mr-2" />
                              {t("common.edit")}
                            </DropdownMenuItem>
                          )}
                          {can("users:delete") && (
                            <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-red-500">
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t("common.delete")}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle>{t("users.add")}</DialogTitle>
            <DialogDescription>Add a new user to the system.</DialogDescription>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">{t("users.role")}</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                >
                  <SelectTrigger id="role" className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder={t("users.role")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{t("role.admin")}</SelectItem>
                    <SelectItem value="analyst">{t("role.analyst")}</SelectItem>
                    <SelectItem value="field">{t("role.field")}</SelectItem>
                    <SelectItem value="commander">{t("role.commander")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">{t("users.status")}</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as UserStatus })}
                >
                  <SelectTrigger id="status" className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder={t("users.status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t("status.active")}</SelectItem>
                    <SelectItem value="inactive">{t("status.inactive")}</SelectItem>
                    <SelectItem value="suspended">{t("status.suspended")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clearance">{t("users.clearance")}</Label>
              <Select
                value={formData.clearance}
                onValueChange={(value) => setFormData({ ...formData, clearance: value as ClearanceLevel })}
              >
                <SelectTrigger id="clearance" className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder={t("users.clearance")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="topsecret">{t("clearance.topsecret")}</SelectItem>
                  <SelectItem value="secret">{t("clearance.secret")}</SelectItem>
                  <SelectItem value="confidential">{t("clearance.confidential")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)} disabled={isSubmitting}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleAddUser} className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.processing")}
                </>
              ) : (
                t("users.add")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle>{t("users.edit")}</DialogTitle>
            <DialogDescription>Edit user information.</DialogDescription>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">{t("users.name").split(" ")[0]}</Label>
                <Input
                  id="edit-firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">{t("users.name").split(" ")[1] || "Last Name"}</Label>
                <Input
                  id="edit-lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">{t("users.email")}</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">{t("users.role")}</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                >
                  <SelectTrigger id="edit-role" className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder={t("users.role")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{t("role.admin")}</SelectItem>
                    <SelectItem value="analyst">{t("role.analyst")}</SelectItem>
                    <SelectItem value="field">{t("role.field")}</SelectItem>
                    <SelectItem value="commander">{t("role.commander")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">{t("users.status")}</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as UserStatus })}
                >
                  <SelectTrigger id="edit-status" className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder={t("users.status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t("status.active")}</SelectItem>
                    <SelectItem value="inactive">{t("status.inactive")}</SelectItem>
                    <SelectItem value="suspended">{t("status.suspended")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-clearance">{t("users.clearance")}</Label>
              <Select
                value={formData.clearance}
                onValueChange={(value) => setFormData({ ...formData, clearance: value as ClearanceLevel })}
              >
                <SelectTrigger id="edit-clearance" className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder={t("users.clearance")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="topsecret">{t("clearance.topsecret")}</SelectItem>
                  <SelectItem value="secret">{t("clearance.secret")}</SelectItem>
                  <SelectItem value="confidential">{t("clearance.confidential")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)} disabled={isSubmitting}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleUpdateUser} className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.processing")}
                </>
              ) : (
                t("common.save")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle>{t("users.delete")}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedUser.avatar || "/placeholder.svg"}
                    alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                  />
                  <AvatarFallback>{getInitials(selectedUser.firstName, selectedUser.lastName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="text-sm text-zinc-400">{selectedUser.email}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserDialogOpen(false)} disabled={isSubmitting}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleConfirmDelete} variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.processing")}
                </>
              ) : (
                t("common.delete")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
