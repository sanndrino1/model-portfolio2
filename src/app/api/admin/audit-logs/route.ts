import { NextRequest, NextResponse } from 'next/server'
import { auditLogger, AuditLogFilters } from '@/lib/auditLog'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Извличане на параметрите за филтриране
    const filters: AuditLogFilters = {
      userId: searchParams.get('userId') || undefined,
      action: searchParams.get('action') as any || undefined,
      resourceType: searchParams.get('resourceType') as any || undefined,
      severity: searchParams.get('severity') as any || undefined,
      category: searchParams.get('category') as any || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      ipAddress: searchParams.get('ipAddress') || undefined,
      searchTerm: searchParams.get('searchTerm') || undefined
    }

    // Параметри за пагинация
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '50', 10)

    // Валидация на параметрите
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { error: 'Невалидни параметри за пагинация' },
        { status: 400 }
      )
    }

    // Получаване на audit логовете
    const result = await auditLogger.getLogs(filters, page, pageSize)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { error: 'Грешка при извличане на audit логове' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Валидация на задължителните полета
    if (!body.userId || !body.userEmail || !body.action || !body.resourceType) {
      return NextResponse.json(
        { error: 'Липсват задължителни полета' },
        { status: 400 }
      )
    }

    // Получаване на IP адреса и User Agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Логване на активността
    await auditLogger.log({
      userId: body.userId,
      userEmail: body.userEmail,
      userRole: body.userRole || 'viewer',
      action: body.action,
      resourceType: body.resourceType,
      resourceId: body.resourceId,
      resourceName: body.resourceName,
      details: {
        description: body.description || `${body.action} ${body.resourceType}`,
        severity: body.severity || 'low',
        category: body.category || 'user_action',
        metadata: body.metadata
      },
      changes: body.changes,
      ipAddress,
      userAgent
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging audit entry:', error)
    return NextResponse.json(
      { error: 'Грешка при записване на audit лог' },
      { status: 500 }
    )
  }
}