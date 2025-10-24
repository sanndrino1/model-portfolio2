import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-dev-jwt-secret-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Не сте влезли в профила си' },
        { status: 401 }
      )
    }

    // Верификация на JWT токена
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    // Проверка на сесията
    const session = await db.getSession(decoded.sessionId)
    if (!session || !session.isAuthenticated) {
      return NextResponse.json(
        { error: 'Невалидна сесия' },
        { status: 401 }
      )
    }

    // Изтриване на сесията от базата данни
    await db.deleteSession(session.id)

    // Създаване на response
    const response = NextResponse.json({
      success: true,
      message: 'Успешно излизане от профила'
    })

    // Изтриване на cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    })

    return response

  } catch (error) {
    console.error('❌ Error in logout API:', error)
    
    // Дори при грешка изтриваме cookie
    const response = NextResponse.json({
      success: true,
      message: 'Излизане от профила'
    })
    
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    })

    return response
  }
}