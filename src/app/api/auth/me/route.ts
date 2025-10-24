import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-dev-jwt-secret-change-in-production'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({
        isAuthenticated: false,
        user: null
      })
    }

    // Верификация на JWT токена
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    // Проверка на сесията
    const session = await db.getSession(decoded.sessionId)
    if (!session || !session.isAuthenticated) {
      return NextResponse.json({
        isAuthenticated: false,
        user: null
      })
    }

    // Намиране на потребителя
    const user = await db.getUserById(decoded.userId)
    if (!user) {
      return NextResponse.json({
        isAuthenticated: false,
        user: null
      })
    }

    return NextResponse.json({
      isAuthenticated: true,
      is2FAVerified: session.is2FAVerified,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        is2FAEnabled: user.is2FAEnabled
      },
      session: {
        expiresAt: session.expiresAt.toISOString(),
        createdAt: session.createdAt.toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Error in me API:', error)
    return NextResponse.json({
      isAuthenticated: false,
      user: null
    })
  }
}