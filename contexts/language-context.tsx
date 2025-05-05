"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "en" | "fr" | "ru"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Dashboard
    "dashboard.title": "Dashboard Overview",
    "dashboard.stats": "Key Statistics",
    "dashboard.activity": "Activity Feed",

    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.reports": "Reports",
    "nav.alerts": "Alerts",
    "nav.map": "Map",
    "nav.data": "Data Collection",
    "nav.settings": "Settings",
    "nav.users": "User Management",
    "nav.audit": "Audit Logs",

    // User Management
    "users.title": "User Management",
    "users.add": "Add User",
    "users.edit": "Edit User",
    "users.delete": "Delete User",
    "users.search": "Search users...",
    "users.name": "Name",
    "users.email": "Email",
    "users.role": "Role",
    "users.status": "Status",
    "users.clearance": "Clearance",
    "users.lastActive": "Last Active",
    "users.actions": "Actions",

    // Roles
    "role.admin": "Administrator",
    "role.analyst": "Intelligence Analyst",
    "role.field": "Field Operative",
    "role.commander": "Operations Commander",

    // Status
    "status.active": "Active",
    "status.inactive": "Inactive",
    "status.suspended": "Suspended",

    // Clearance
    "clearance.topsecret": "Top Secret/SCI",
    "clearance.secret": "Secret",
    "clearance.confidential": "Confidential",

    // Profile
    "profile.title": "User Profile",
    "profile.personal": "Personal Information",
    "profile.security": "Security Settings",
    "profile.preferences": "Preferences",

    // Permissions
    "permissions.title": "Role Permissions",
    "permissions.role": "Role",
    "permissions.resource": "Resource",
    "permissions.action": "Action",
    "permissions.granted": "Granted",
    "permissions.accessDenied": "Access Denied",
    "permissions.noAccess": "You don't have permission to access this resource.",
    "permissions.goBack": "Go Back",
    "permissions.dashboard": "Go to Dashboard",
    "permissions.viewPermissions": "View Permissions",

    // Audit
    "audit.title": "Audit Logs",
    "audit.user": "User",
    "audit.action": "Action",
    "audit.resource": "Resource",
    "audit.timestamp": "Timestamp",
    "audit.ipAddress": "IP Address",
    "audit.details": "Details",
    "audit.export": "Export Logs",
    "audit.filter": "Filter Logs",

    // Authentication
    "auth.login": "Login",
    "auth.loginDescription": "Enter your credentials to access your account",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.forgotPassword": "Forgot Password?",
    "auth.rememberMe": "Remember me",
    "auth.loggingIn": "Logging in...",
    "auth.noAccount": "Don't have an account?",
    "auth.register": "Register",
    "auth.createAccount": "Create Account",
    "auth.registerDescription": "Enter your information to create an account",
    "auth.firstName": "First Name",
    "auth.lastName": "Last Name",
    "auth.confirmPassword": "Confirm Password",
    "auth.registering": "Registering...",
    "auth.alreadyHaveAccount": "Already have an account?",
    "auth.registrationSuccess": "Registration Successful",
    "auth.checkEmail": "Please check your email to verify your account",
    "auth.verificationSent":
      "A verification link has been sent to your email address. Please click on the link to verify your account.",
    "auth.backToLogin": "Back to Login",
    "auth.forgotPasswordDescription": "Enter your email and we'll send you a link to reset your password",
    "auth.sendResetLink": "Send Reset Link",
    "auth.sending": "Sending...",
    "auth.resetLinkSent": "Reset link sent successfully",
    "auth.checkEmailForReset": "Please check your email for a link to reset your password",
    "auth.resetPassword": "Reset Password",
    "auth.resetPasswordDescription": "Enter your new password",
    "auth.newPassword": "New Password",
    "auth.resetting": "Resetting...",
    "auth.passwordResetSuccess": "Password reset successful",
    "auth.redirectingToLogin": "Redirecting to login page...",
    "auth.passwordsDoNotMatch": "Passwords do not match",
    "auth.logout": "Logout",
    "auth.sessionExpired": "Your session has expired. Please log in again.",

    // Common
    "common.save": "Save Changes",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.view": "View",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.status": "System Status: Online",

    // Header
    "header.language": "Language",
    "header.profile": "Profile",
    "header.settings": "Settings",
    "header.logout": "Log out",
  },
  fr: {
    // Dashboard
    "dashboard.title": "Aperçu du Tableau de Bord",
    "dashboard.stats": "Statistiques Clés",
    "dashboard.activity": "Flux d'Activité",

    // Navigation
    "nav.dashboard": "Tableau de Bord",
    "nav.reports": "Rapports",
    "nav.alerts": "Alertes",
    "nav.map": "Carte",
    "nav.data": "Collecte de Données",
    "nav.settings": "Paramètres",
    "nav.users": "Gestion des Utilisateurs",
    "nav.audit": "Journaux d'Audit",

    // User Management
    "users.title": "Gestion des Utilisateurs",
    "users.add": "Ajouter un Utilisateur",
    "users.edit": "Modifier l'Utilisateur",
    "users.delete": "Supprimer l'Utilisateur",
    "users.search": "Rechercher des utilisateurs...",
    "users.name": "Nom",
    "users.email": "Email",
    "users.role": "Rôle",
    "users.status": "Statut",
    "users.clearance": "Habilitation",
    "users.lastActive": "Dernière Activité",
    "users.actions": "Actions",

    // Roles
    "role.admin": "Administrateur",
    "role.analyst": "Analyste de Renseignement",
    "role.field": "Agent de Terrain",
    "role.commander": "Commandant des Opérations",

    // Status
    "status.active": "Actif",
    "status.inactive": "Inactif",
    "status.suspended": "Suspendu",

    // Clearance
    "clearance.topsecret": "Très Secret/SCI",
    "clearance.secret": "Secret",
    "clearance.confidential": "Confidentiel",

    // Profile
    "profile.title": "Profil Utilisateur",
    "profile.personal": "Informations Personnelles",
    "profile.security": "Paramètres de Sécurité",
    "profile.preferences": "Préférences",

    // Permissions
    "permissions.title": "Permissions des Rôles",
    "permissions.role": "Rôle",
    "permissions.resource": "Ressource",
    "permissions.action": "Action",
    "permissions.granted": "Accordé",
    "permissions.accessDenied": "Accès Refusé",
    "permissions.noAccess": "Vous n'avez pas la permission d'accéder à cette ressource.",
    "permissions.goBack": "Retour",
    "permissions.dashboard": "Aller au Tableau de Bord",
    "permissions.viewPermissions": "Voir les Permissions",

    // Audit
    "audit.title": "Journaux d'Audit",
    "audit.user": "Utilisateur",
    "audit.action": "Action",
    "audit.resource": "Ressource",
    "audit.timestamp": "Horodatage",
    "audit.ipAddress": "Adresse IP",
    "audit.details": "Détails",
    "audit.export": "Exporter les Journaux",
    "audit.filter": "Filtrer les Journaux",

    // Authentication
    "auth.login": "Connexion",
    "auth.loginDescription": "Entrez vos identifiants pour accéder à votre compte",
    "auth.email": "Email",
    "auth.password": "Mot de passe",
    "auth.forgotPassword": "Mot de passe oublié ?",
    "auth.rememberMe": "Se souvenir de moi",
    "auth.loggingIn": "Connexion en cours...",
    "auth.noAccount": "Vous n'avez pas de compte ?",
    "auth.register": "S'inscrire",
    "auth.createAccount": "Créer un Compte",
    "auth.registerDescription": "Entrez vos informations pour créer un compte",
    "auth.firstName": "Prénom",
    "auth.lastName": "Nom",
    "auth.confirmPassword": "Confirmer le mot de passe",
    "auth.registering": "Inscription en cours...",
    "auth.alreadyHaveAccount": "Vous avez déjà un compte ?",
    "auth.registrationSuccess": "Inscription Réussie",
    "auth.checkEmail": "Veuillez vérifier votre email pour confirmer votre compte",
    "auth.verificationSent":
      "Un lien de vérification a été envoyé à votre adresse email. Veuillez cliquer sur le lien pour vérifier votre compte.",
    "auth.backToLogin": "Retour à la Connexion",
    "auth.forgotPasswordDescription":
      "Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe",
    "auth.sendResetLink": "Envoyer le Lien de Réinitialisation",
    "auth.sending": "Envoi en cours...",
    "auth.resetLinkSent": "Lien de réinitialisation envoyé avec succès",
    "auth.checkEmailForReset": "Veuillez vérifier votre email pour un lien de réinitialisation de mot de passe",
    "auth.resetPassword": "Réinitialiser le Mot de Passe",
    "auth.resetPasswordDescription": "Entrez votre nouveau mot de passe",
    "auth.newPassword": "Nouveau Mot de Passe",
    "auth.resetting": "Réinitialisation en cours...",
    "auth.passwordResetSuccess": "Réinitialisation du mot de passe réussie",
    "auth.redirectingToLogin": "Redirection vers la page de connexion...",
    "auth.passwordsDoNotMatch": "Les mots de passe ne correspondent pas",
    "auth.logout": "Déconnexion",
    "auth.sessionExpired": "Votre session a expiré. Veuillez vous reconnecter.",

    // Common
    "common.save": "Enregistrer les Modifications",
    "common.cancel": "Annuler",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.view": "Voir",
    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.status": "État du Système: En Ligne",

    // Header
    "header.language": "Langue",
    "header.profile": "Profil",
    "header.settings": "Paramètres",
    "header.logout": "Déconnexion",
  },
  ru: {
    // Dashboard
    "dashboard.title": "Обзор Панели Управления",
    "dashboard.stats": "Ключевые Показатели",
    "dashboard.activity": "Лента Активности",

    // Navigation
    "nav.dashboard": "Панель Управления",
    "nav.reports": "Отчеты",
    "nav.alerts": "Оповещения",
    "nav.map": "Карта",
    "nav.data": "Сбор Данных",
    "nav.settings": "Настройки",
    "nav.users": "Управление Пользователями",
    "nav.audit": "Журналы Аудита",

    // User Management
    "users.title": "Управление Пользователями",
    "users.add": "Добавить Пользователя",
    "users.edit": "Редактировать Пользователя",
    "users.delete": "Удалить Пользователя",
    "users.search": "Поиск пользователей...",
    "users.name": "Имя",
    "users.email": "Эл. почта",
    "users.role": "Роль",
    "users.status": "Статус",
    "users.clearance": "Уровень Доступа",
    "users.lastActive": "Последняя Активность",
    "users.actions": "Действия",

    // Roles
    "role.admin": "Администратор",
    "role.analyst": "Аналитик Разведки",
    "role.field": "Полевой Оперативник",
    "role.commander": "Командир Операций",

    // Status
    "status.active": "Активен",
    "status.inactive": "Неактивен",
    "status.suspended": "Приостановлен",

    // Clearance
    "clearance.topsecret": "Совершенно Секретно/SCI",
    "clearance.secret": "Секретно",
    "clearance.confidential": "Конфиденциально",

    // Profile
    "profile.title": "Профиль Пользователя",
    "profile.personal": "Личная Информация",
    "profile.security": "Настройки Безопасности",
    "profile.preferences": "Предпочтения",

    // Permissions
    "permissions.title": "Разрешения Ролей",
    "permissions.role": "Роль",
    "permissions.resource": "Ресурс",
    "permissions.action": "Действие",
    "permissions.granted": "Предоставлено",
    "permissions.accessDenied": "Доступ Запрещен",
    "permissions.noAccess": "У вас нет разрешения на доступ к этому ресурсу.",
    "permissions.goBack": "Назад",
    "permissions.dashboard": "К Панели Управления",
    "permissions.viewPermissions": "Просмотр Разрешений",

    // Audit
    "audit.title": "Журналы Аудита",
    "audit.user": "Пользователь",
    "audit.action": "Действие",
    "audit.resource": "Ресурс",
    "audit.timestamp": "Время",
    "audit.ipAddress": "IP-адрес",
    "audit.details": "Детали",
    "audit.export": "Экспорт Журналов",
    "audit.filter": "Фильтр Журналов",

    // Authentication
    "auth.login": "Вход",
    "auth.loginDescription": "Введите ваши учетные данные для доступа к аккаунту",
    "auth.email": "Эл. почта",
    "auth.password": "Пароль",
    "auth.forgotPassword": "Забыли пароль?",
    "auth.rememberMe": "Запомнить меня",
    "auth.loggingIn": "Вход...",
    "auth.noAccount": "Нет аккаунта?",
    "auth.register": "Регистрация",
    "auth.createAccount": "Создать Аккаунт",
    "auth.registerDescription": "Введите ваши данные для создания аккаунта",
    "auth.firstName": "Имя",
    "auth.lastName": "Фамилия",
    "auth.confirmPassword": "Подтвердите пароль",
    "auth.registering": "Регистрация...",
    "auth.alreadyHaveAccount": "Уже есть аккаунт?",
    "auth.registrationSuccess": "Регистрация Успешна",
    "auth.checkEmail": "Пожалуйста, проверьте вашу электронную почту для подтверждения аккаунта",
    "auth.verificationSent":
      "Ссылка для подтверждения была отправлена на вашу электронную почту. Пожалуйста, нажмите на ссылку для подтверждения вашего аккаунта.",
    "auth.backToLogin": "Вернуться к Входу",
    "auth.forgotPasswordDescription": "Введите вашу электронную почту, и мы отправим вам ссылку для сброса пароля",
    "auth.sendResetLink": "Отправить Ссылку для Сброса",
    "auth.sending": "Отправка...",
    "auth.resetLinkSent": "Ссылка для сброса успешно отправлена",
    "auth.checkEmailForReset": "Пожалуйста, проверьте вашу электронную почту для сброса пароля",
    "auth.resetPassword": "Сбросить Пароль",
    "auth.resetPasswordDescription": "Введите ваш новый пароль",
    "auth.newPassword": "Новый Пароль",
    "auth.resetting": "Сброс...",
    "auth.passwordResetSuccess": "Пароль успешно сброшен",
    "auth.redirectingToLogin": "Перенаправление на страницу входа...",
    "auth.passwordsDoNotMatch": "Пароли не совпадают",
    "auth.logout": "Выход",
    "auth.sessionExpired": "Ваша сессия истекла. Пожалуйста, войдите снова.",

    // Common
    "common.save": "Сохранить Изменения",
    "common.cancel": "Отмена",
    "common.delete": "Удалить",
    "common.edit": "Редактировать",
    "common.view": "Просмотр",
    "common.search": "Поиск",
    "common.filter": "Фильтр",
    "common.status": "Статус Системы: В Сети",

    // Header
    "header.language": "Язык",
    "header.profile": "Профиль",
    "header.settings": "Настройки",
    "header.logout": "Выйти",
  },
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
