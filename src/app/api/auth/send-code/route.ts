import { NextRequest, NextResponse } from 'next/server'
import { send2FAEmail, generate2FACode, hashCode, getCodeExpiration, isValidEmail } from '@/lib/email'
import { db } from '@/lib/database'
import { useToastActions } from '@/contexts/ToastContext'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Валидиране на email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Невалиден email адрес' },
        { status: 400 }
      )
    }

    // Проверяване дали потребителят съществува или създаване на нов
    let user = await db.getUserByEmail(email)
    if (!user) {
      // Създаваме нов потребител ако не съществува
      user = await db.createUser({
        email,
        role: 'viewer',
        isEmailVerified: false,
        is2FAEnabled: true
      })
    }

    // Проверяване за съществуващ валиден код
    const existingCode = await db.get2FACode(email, 'login_2fa')
    if (existingCode) {
      return NextResponse.json(
        { error: 'Вече е изпратен код. Моля изчакайте да изтече или използвайте съществуващия.' },
        { status: 429 }
      )
    }

    // Генериране на нов 2FA код
    const code = generate2FACode()
    const hashedCode = await hashCode(code)
    const expiresAt = getCodeExpiration()

    // Запазване на кода в базата данни
    await db.create2FACode({
      userId: user.id,
      code: hashedCode,
      type: 'login_2fa',
      email,
      expiresAt,
      isUsed: false,
      attempts: 0,
      maxAttempts: 3
    })

    // Изпращане на email
    const emailResult = await send2FAEmail(email, code, user.name)
    
    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Грешка при изпращането на email. Моля опитайте отново.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Код за верификация е изпратен на вашия email адрес',
      userId: user.id,
      // За development показваме preview URL
      ...(process.env.NODE_ENV === 'development' && { 
        developmentNote: 'Проверете конзолата за preview URL на email-а' 
      })
    })

  } catch (error) {
    console.error('❌ Error in send-code API:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}