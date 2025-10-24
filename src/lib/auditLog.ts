// Audit Log System - Проследяване на активност и одит логове

export interface AuditLogEntry {
  id: string
  userId: string
  userEmail: string
  userRole: 'admin' | 'editor' | 'viewer'
  action: AuditAction
  resourceType: AuditResourceType
  resourceId?: string
  resourceName?: string
  details: AuditDetails
  ipAddress?: string
  userAgent?: string
  timestamp: string
  changes?: AuditChanges
}

export type AuditAction = 
  | 'create' | 'update' | 'delete' | 'view' | 'export' | 'import'
  | 'login' | 'logout' | 'login_failed' | 'password_change'
  | 'approve' | 'reject' | 'publish' | 'unpublish'
  | 'upload' | 'download' | 'backup' | 'restore'
  | 'rate' | 'comment' | 'reply' | 'like' | 'flag'

export type AuditResourceType = 
  | 'user' | 'content' | 'portfolio' | 'gallery' | 'image'
  | 'settings' | 'suggestion' | 'comment' | 'category'
  | 'page' | 'blog_post' | 'media_file' | 'backup'
  | 'tool_rating' | 'tool_comment' | 'comment_reply'

export interface AuditDetails {
  description: string
  metadata?: Record<string, any>
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'security' | 'content' | 'system' | 'user_action'
}

export interface AuditChanges {
  before?: Record<string, any>
  after?: Record<string, any>
  fields_changed?: string[]
}

export interface AuditLogFilters {
  userId?: string
  action?: AuditAction
  resourceType?: AuditResourceType
  severity?: AuditDetails['severity']
  category?: AuditDetails['category']
  dateFrom?: string
  dateTo?: string
  ipAddress?: string
  searchTerm?: string
}

export interface AuditLogResponse {
  logs: AuditLogEntry[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export class AuditLogger {
  private static instance: AuditLogger
  private logs: AuditLogEntry[] = []

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger()
    }
    return AuditLogger.instance
  }

  async log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    const auditEntry: AuditLogEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: new Date().toISOString()
    }

    // В реална имплементация би се записвало в база данни
    this.logs.unshift(auditEntry)
    
    // Ограничаваме броя логове в паметта
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000)
    }

    // Console log за debugging
    console.log('Audit Log:', auditEntry)
  }

  async getLogs(
    filters: AuditLogFilters = {},
    page: number = 1,
    pageSize: number = 50
  ): Promise<AuditLogResponse> {
    let filteredLogs = [...this.logs]

    // Прилагане на филтри
    if (filters.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId)
    }
    if (filters.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filters.action)
    }
    if (filters.resourceType) {
      filteredLogs = filteredLogs.filter(log => log.resourceType === filters.resourceType)
    }
    if (filters.severity) {
      filteredLogs = filteredLogs.filter(log => log.details.severity === filters.severity)
    }
    if (filters.category) {
      filteredLogs = filteredLogs.filter(log => log.details.category === filters.category)
    }
    if (filters.dateFrom) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.dateFrom!)
    }
    if (filters.dateTo) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.dateTo!)
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      filteredLogs = filteredLogs.filter(log => 
        log.details.description.toLowerCase().includes(term) ||
        log.userEmail.toLowerCase().includes(term) ||
        log.resourceName?.toLowerCase().includes(term)
      )
    }

    const total = filteredLogs.length
    const totalPages = Math.ceil(total / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex)

    return {
      logs: paginatedLogs,
      total,
      page,
      pageSize,
      totalPages
    }
  }

  async getStatistics(): Promise<{
    totalLogs: number
    logsByAction: Record<AuditAction, number>
    logsByResourceType: Record<AuditResourceType, number>
    logsBySeverity: Record<AuditDetails['severity'], number>
    recentActivity: AuditLogEntry[]
    topUsers: { userId: string; userEmail: string; count: number }[]
  }> {
    const totalLogs = this.logs.length
    
    // Статистики по действия
    const logsByAction = this.logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1
      return acc
    }, {} as Record<AuditAction, number>)

    // Статистики по тип ресурс
    const logsByResourceType = this.logs.reduce((acc, log) => {
      acc[log.resourceType] = (acc[log.resourceType] || 0) + 1
      return acc
    }, {} as Record<AuditResourceType, number>)

    // Статистики по тежест
    const logsBySeverity = this.logs.reduce((acc, log) => {
      acc[log.details.severity] = (acc[log.details.severity] || 0) + 1
      return acc
    }, {} as Record<AuditDetails['severity'], number>)

    // Последна активност (последните 10)
    const recentActivity = this.logs.slice(0, 10)

    // Най-активни потребители
    const userCounts = this.logs.reduce((acc, log) => {
      const key = `${log.userId}:${log.userEmail}`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topUsers = Object.entries(userCounts)
      .map(([key, count]) => {
        const [userId, userEmail] = key.split(':')
        return { userId, userEmail, count }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      totalLogs,
      logsByAction,
      logsByResourceType,
      logsBySeverity,
      recentActivity,
      topUsers
    }
  }

  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Методи за специфични действия
  async logLogin(userId: string, userEmail: string, userRole: any, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      userEmail,
      userRole,
      action: 'login',
      resourceType: 'user',
      details: {
        description: `Потребител ${userEmail} влезе в системата`,
        severity: 'low',
        category: 'security'
      },
      ipAddress,
      userAgent
    })
  }

  async logLogout(userId: string, userEmail: string, userRole: any): Promise<void> {
    await this.log({
      userId,
      userEmail,
      userRole,
      action: 'logout',
      resourceType: 'user',
      details: {
        description: `Потребител ${userEmail} излезе от системата`,
        severity: 'low',
        category: 'security'
      }
    })
  }

  async logFailedLogin(email: string, ipAddress?: string): Promise<void> {
    await this.log({
      userId: 'unknown',
      userEmail: email,
      userRole: 'viewer',
      action: 'login_failed',
      resourceType: 'user',
      details: {
        description: `Неуспешен опит за вход с email ${email}`,
        severity: 'medium',
        category: 'security'
      },
      ipAddress
    })
  }

  async logContentCreate(
    userId: string, 
    userEmail: string, 
    userRole: any,
    resourceType: AuditResourceType,
    resourceId: string,
    resourceName: string,
    details?: any
  ): Promise<void> {
    await this.log({
      userId,
      userEmail,
      userRole,
      action: 'create',
      resourceType,
      resourceId,
      resourceName,
      details: {
        description: `Създадено ново ${resourceType}: ${resourceName}`,
        severity: 'low',
        category: 'content',
        metadata: details
      }
    })
  }

  async logContentUpdate(
    userId: string,
    userEmail: string,
    userRole: any,
    resourceType: AuditResourceType,
    resourceId: string,
    resourceName: string,
    changes: AuditChanges
  ): Promise<void> {
    await this.log({
      userId,
      userEmail,
      userRole,
      action: 'update',
      resourceType,
      resourceId,
      resourceName,
      details: {
        description: `Обновено ${resourceType}: ${resourceName}`,
        severity: 'low',
        category: 'content'
      },
      changes
    })
  }

  async logContentDelete(
    userId: string,
    userEmail: string,
    userRole: any,
    resourceType: AuditResourceType,
    resourceId: string,
    resourceName: string
  ): Promise<void> {
    await this.log({
      userId,
      userEmail,
      userRole,
      action: 'delete',
      resourceType,
      resourceId,
      resourceName,
      details: {
        description: `Изтрито ${resourceType}: ${resourceName}`,
        severity: 'medium',
        category: 'content'
      }
    })
  }

  async logSettingsChange(
    userId: string,
    userEmail: string,
    userRole: any,
    settingKey: string,
    oldValue: any,
    newValue: any
  ): Promise<void> {
    await this.log({
      userId,
      userEmail,
      userRole,
      action: 'update',
      resourceType: 'settings',
      resourceId: settingKey,
      resourceName: settingKey,
      details: {
        description: `Променена настройка: ${settingKey}`,
        severity: 'medium',
        category: 'system'
      },
      changes: {
        before: { [settingKey]: oldValue },
        after: { [settingKey]: newValue },
        fields_changed: [settingKey]
      }
    })
  }
}

// Singleton instance
export const auditLogger = AuditLogger.getInstance()

// Utility functions
export function getActionDisplayName(action: AuditAction): string {
  const names: Record<AuditAction, string> = {
    create: 'Създаване',
    update: 'Обновяване',
    delete: 'Изтриване',
    view: 'Преглед',
    export: 'Експорт',
    import: 'Импорт',
    login: 'Вход',
    logout: 'Изход',
    login_failed: 'Неуспешен вход',
    password_change: 'Смяна на парола',
    approve: 'Одобрение',
    reject: 'Отказ',
    publish: 'Публикуване',
    unpublish: 'Отпубликуване',
    upload: 'Качване',
    download: 'Изтегляне',
    backup: 'Резервно копие',
    restore: 'Възстановяване',
    rate: 'Оценяване',
    comment: 'Коментиране', 
    reply: 'Отговор',
    like: 'Харесване',
    flag: 'Сигнализиране'
  }
  return names[action] || action
}

export function getResourceTypeDisplayName(resourceType: AuditResourceType): string {
  const names: Record<AuditResourceType, string> = {
    user: 'Потребител',
    content: 'Съдържание',
    portfolio: 'Портфолио',
    gallery: 'Галерия',
    image: 'Изображение',
    settings: 'Настройки',
    suggestion: 'Предложение',
    comment: 'Коментар',
    tool_rating: 'Рейтинг на тул',
    tool_comment: 'Коментар за тул',
    comment_reply: 'Отговор на коментар',
    category: 'Категория',
    page: 'Страница',
    blog_post: 'Блог статия',
    media_file: 'Медиен файл',
    backup: 'Резервно копие'
  }
  return names[resourceType] || resourceType
}

export function getSeverityColor(severity: AuditDetails['severity']): string {
  const colors = {
    low: 'text-success bg-success/10',
    medium: 'text-warning bg-warning/10',
    high: 'text-error bg-error/10',
    critical: 'text-error bg-error/20 font-bold'
  }
  return colors[severity]
}

export function getSeverityDisplayName(severity: AuditDetails['severity']): string {
  const names = {
    low: 'Ниска',
    medium: 'Средна',
    high: 'Висока',
    critical: 'Критична'
  }
  return names[severity]
}