'use client'

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Dropdown } from "@/components/ui/Dropdown"
import { Modal } from "@/components/ui/Modal"
import { cn } from "@/lib/utils"
import type { 
  AuditLogEntry, 
  AuditLogResponse, 
  AuditLogFilters
} from "@/lib/auditLog"
import { 
  getActionDisplayName,
  getResourceTypeDisplayName,
  getSeverityColor,
  getSeverityDisplayName
} from "@/lib/auditLog"

interface ActivityTrackerProps {
  className?: string
}

export function ActivityTracker({ className }: ActivityTrackerProps) {
  const [logs, setLogs] = React.useState<AuditLogEntry[]>([])
  const [loading, setLoading] = React.useState(false)
  const [selectedLog, setSelectedLog] = React.useState<AuditLogEntry | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false)
  const [statistics, setStatistics] = React.useState<any>(null)

  // Филтри
  const [filters, setFilters] = React.useState<AuditLogFilters>({})
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedAction, setSelectedAction] = React.useState<string>('all')
  const [selectedResourceType, setSelectedResourceType] = React.useState<string>('all')
  const [selectedSeverity, setSelectedSeverity] = React.useState<string>('all')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [dateFrom, setDateFrom] = React.useState('')
  const [dateTo, setDateTo] = React.useState('')

  // Пагинация
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalLogs, setTotalLogs] = React.useState(0)
  const pageSize = 25

  // Опции за филтри
  const actionOptions = [
    { value: 'all', label: 'Всички действия' },
    { value: 'create', label: 'Създаване' },
    { value: 'update', label: 'Обновяване' },
    { value: 'delete', label: 'Изтриване' },
    { value: 'login', label: 'Вход' },
    { value: 'logout', label: 'Изход' },
    { value: 'approve', label: 'Одобрение' },
    { value: 'reject', label: 'Отказ' }
  ]

  const resourceTypeOptions = [
    { value: 'all', label: 'Всички ресурси' },
    { value: 'user', label: 'Потребители' },
    { value: 'content', label: 'Съдържание' },
    { value: 'portfolio', label: 'Портфолио' },
    { value: 'settings', label: 'Настройки' },
    { value: 'suggestion', label: 'Предложения' }
  ]

  const severityOptions = [
    { value: 'all', label: 'Всички нива' },
    { value: 'low', label: 'Ниска' },
    { value: 'medium', label: 'Средна' },
    { value: 'high', label: 'Висока' },
    { value: 'critical', label: 'Критична' }
  ]

  const categoryOptions = [
    { value: 'all', label: 'Всички категории' },
    { value: 'security', label: 'Сигурност' },
    { value: 'content', label: 'Съдържание' },
    { value: 'system', label: 'Система' },
    { value: 'user_action', label: 'Потребителски действия' }
  ]

  // Зареждане на логове
  const fetchLogs = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString()
      })

      // Добавяне на филтри
      if (searchTerm) params.append('searchTerm', searchTerm)
      if (selectedAction !== 'all') params.append('action', selectedAction)
      if (selectedResourceType !== 'all') params.append('resourceType', selectedResourceType)
      if (selectedSeverity !== 'all') params.append('severity', selectedSeverity)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (dateFrom) params.append('dateFrom', dateFrom)
      if (dateTo) params.append('dateTo', dateTo)

      const response = await fetch(`/api/admin/audit-logs?${params}`)
      if (response.ok) {
        const data: AuditLogResponse = await response.json()
        setLogs(data.logs)
        setTotalPages(data.totalPages)
        setTotalLogs(data.total)
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, selectedAction, selectedResourceType, selectedSeverity, selectedCategory, dateFrom, dateTo])

  // Зареждане на статистики
  const fetchStatistics = React.useCallback(async () => {
    try {
      const response = await fetch('/api/admin/audit-logs/stats')
      if (response.ok) {
        const data = await response.json()
        setStatistics(data)
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }, [])

  React.useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  React.useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  const handleLogClick = (log: AuditLogEntry) => {
    setSelectedLog(log)
    setIsDetailModalOpen(true)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('bg-BG', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
    fetchLogs()
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedAction('all')
    setSelectedResourceType('all')
    setSelectedSeverity('all')
    setSelectedCategory('all')
    setDateFrom('')
    setDateTo('')
    setCurrentPage(1)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-elegant font-semibold text-foreground">
            Проследяване на активност
          </h1>
          <p className="text-muted-foreground">
            Одит логове и история на потребителските действия
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchStatistics}>
            📊 Обнови статистики
          </Button>
          <Button variant="outline" size="sm" onClick={fetchLogs}>
            🔄 Обнови
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-2xl font-bold text-foreground">{statistics.totalLogs}</div>
            <div className="text-sm text-muted-foreground">Общо логове</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-foreground">{statistics.topUsers?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Активни потребители</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-foreground">{statistics.recentActivity?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Последна активност</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-foreground">
              {Object.keys(statistics.logsByAction || {}).length}
            </div>
            <div className="text-sm text-muted-foreground">Различни действия</div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Филтри</h3>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-1">Търсене</label>
            <Input
              placeholder="Търси в описания, потребители..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Action Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Действие</label>
            <Dropdown
              trigger={
                <Button variant="outline" size="sm" className="w-full justify-between">
                  {actionOptions.find(opt => opt.value === selectedAction)?.label || 'Избери действие'} ▼
                </Button>
              }
              items={actionOptions}
              onSelect={(value) => setSelectedAction(value)}
            />
          </div>

          {/* Resource Type Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Тип ресурс</label>
            <Dropdown
              trigger={
                <Button variant="outline" size="sm" className="w-full justify-between">
                  {resourceTypeOptions.find(opt => opt.value === selectedResourceType)?.label || 'Избери ресурс'} ▼
                </Button>
              }
              items={resourceTypeOptions}
              onSelect={(value) => setSelectedResourceType(value)}
            />
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Тежест</label>
            <Dropdown
              trigger={
                <Button variant="outline" size="sm" className="w-full justify-between">
                  {severityOptions.find(opt => opt.value === selectedSeverity)?.label || 'Избери тежест'} ▼
                </Button>
              }
              items={severityOptions}
              onSelect={(value) => setSelectedSeverity(value)}
            />
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium mb-1">От дата</label>
            <Input
              type="datetime-local"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium mb-1">До дата</label>
            <Input
              type="datetime-local"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button variant="primary" onClick={handleFilterChange}>
            Приложи филтри
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Изчисти всички
          </Button>
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Време</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Потребител</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Действие</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Ресурс</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Описание</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Тежест</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">IP</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Зареждане...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Няма намерени логове
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr 
                    key={log.id} 
                    className="border-t border-muted hover:bg-muted/20 cursor-pointer"
                    onClick={() => handleLogClick(log)}
                  >
                    <td className="px-4 py-3 text-sm">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <div className="font-medium">{log.userEmail}</div>
                        <div className="text-xs text-muted-foreground">{log.userRole}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {getActionDisplayName(log.action)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <div className="font-medium">{getResourceTypeDisplayName(log.resourceType)}</div>
                        {log.resourceName && (
                          <div className="text-xs text-muted-foreground truncate max-w-32">
                            {log.resourceName}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm max-w-64">
                      <div className="truncate">{log.details.description}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs',
                        getSeverityColor(log.details.severity)
                      )}>
                        {getSeverityDisplayName(log.details.severity)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {log.ipAddress || 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-muted">
            <div className="text-sm text-muted-foreground">
              Показани {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalLogs)} от {totalLogs} лога
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Предишна
              </Button>
              
              <span className="text-sm text-muted-foreground">
                Страница {currentPage} от {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Следваща
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Детайли на одит лог"
        size="lg"
      >
        {selectedLog && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Време:</span>
                <p className="mt-1">{formatTimestamp(selectedLog.timestamp)}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">ID:</span>
                <p className="mt-1 font-mono text-xs">{selectedLog.id}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Потребител:</span>
                <p className="mt-1">{selectedLog.userEmail}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Роля:</span>
                <p className="mt-1">{selectedLog.userRole}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Действие:</span>
                <p className="mt-1">{getActionDisplayName(selectedLog.action)}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Ресурс:</span>
                <p className="mt-1">{getResourceTypeDisplayName(selectedLog.resourceType)}</p>
              </div>
              {selectedLog.resourceName && (
                <div className="col-span-2">
                  <span className="font-medium text-muted-foreground">Име на ресурса:</span>
                  <p className="mt-1">{selectedLog.resourceName}</p>
                </div>
              )}
              <div>
                <span className="font-medium text-muted-foreground">IP адрес:</span>
                <p className="mt-1">{selectedLog.ipAddress || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">User Agent:</span>
                <p className="mt-1 text-xs break-all">{selectedLog.userAgent || 'N/A'}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <span className="font-medium text-muted-foreground">Описание:</span>
              <p className="mt-1 p-3 bg-muted/30 rounded-lg">{selectedLog.details.description}</p>
            </div>

            {/* Changes */}
            {selectedLog.changes && (
              <div>
                <span className="font-medium text-muted-foreground">Промени:</span>
                <div className="mt-2 space-y-2">
                  {selectedLog.changes.before && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Преди:</p>
                      <pre className="p-2 bg-muted/30 rounded text-xs overflow-auto">
                        {JSON.stringify(selectedLog.changes.before, null, 2)}
                      </pre>
                    </div>
                  )}
                  {selectedLog.changes.after && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">След:</p>
                      <pre className="p-2 bg-muted/30 rounded text-xs overflow-auto">
                        {JSON.stringify(selectedLog.changes.after, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Metadata */}
            {selectedLog.details.metadata && (
              <div>
                <span className="font-medium text-muted-foreground">Metadata:</span>
                <pre className="mt-1 p-3 bg-muted/30 rounded-lg text-xs overflow-auto">
                  {JSON.stringify(selectedLog.details.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ActivityTracker