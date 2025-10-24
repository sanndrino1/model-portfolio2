import { NextRequest, NextResponse } from 'next/server'
import { auditLogger } from '@/lib/auditLog'

export async function GET(request: NextRequest) {
  try {
    // Получаване на статистики за audit логовете
    const statistics = await auditLogger.getStatistics()

    return NextResponse.json(statistics)
  } catch (error) {
    console.error('Error fetching audit statistics:', error)
    return NextResponse.json(
      { error: 'Грешка при извличане на статистики' },
      { status: 500 }
    )
  }
}