import { NextRequest, NextResponse } from 'next/server'
import { verifyCode } from '@/lib/email'
import { db } from '@/lib/database'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-dev-jwt-secret-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    // Валидиране на входните данни
    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email и код са задължителни' },
        { status: 400 }
      )
    }

    // Намиране на потребителя
    const user = await db.getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Потребителят не е намерен' },
        { status: 404 }
      )
    }

    // Намиране на активния 2FA код
    const codeRecord = await db.get2FACode(email, 'login_2fa')
    if (!codeRecord) {
      return NextResponse.json(
        { error: 'Невалиден или изтекъл код. Моля заявете нов код.' },
        { status: 400 }
      )
    }

    // Проверка за максимални опити
    if (codeRecord.attempts >= codeRecord.maxAttempts) {
      return NextResponse.json(
        { error: 'Превишен брой опити. Моля заявете нов код.' },
        { status: 429 }
      )
    }

    // Верификация на кода
    const isValidCode = await verifyCode(code, codeRecord.code)
    
    if (!isValidCode) {
      // Увеличаване на броя опити
      await db.incrementCodeAttempts(codeRecord.id)
      
      const remainingAttempts = codeRecord.maxAttempts - codeRecord.attempts - 1
      return NextResponse.json(
        { 
          error: `Невалиден код. Остават ${remainingAttempts} опита.` 
        },
        { status: 400 }
      )
    }

    // Маркиране на кода като използван
    await db.use2FACode(codeRecord.id)

    // Обновяване на потребителя
    await db.updateUser(user.id, {
      isEmailVerified: true,
      lastLoginAt: new Date()
    })

    // Създаване на сесия
    const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 часа
    const session = await db.createSession({
      userId: user.id,
      email: user.email,
      isAuthenticated: true,
      is2FAVerified: true,
      expiresAt: sessionExpiresAt,
      ipAddress: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    })

    // Създаване на JWT токен
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        sessionId: session.id,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Създаване на response с HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'Успешно влизане',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified
      },
      expiresAt: sessionExpiresAt.toISOString()
    })

    // Настройване на HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 часа в секунди
      path: '/'
    })

    return response

  } catch (error) {
    console.error('❌ Error in verify-code API:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}