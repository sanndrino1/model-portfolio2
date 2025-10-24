import nodemailer from 'nodemailer'

// Email транспорт конфигурация
export const createEmailTransporter = () => {
  // За development използваме Ethereal Email (test email service)
  // За production трябва да се използва реален email provider (Gmail, SendGrid, etc.)
  
  if (process.env.NODE_ENV === 'development') {
    // За development - Ethereal Email
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
        pass: process.env.EMAIL_PASS || 'ethereal.pass'
      }
    })
  }
  
  // За production - Gmail configuration
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Gmail App Password
    }
  })
}

// Генериране на 6-цифрен код
export const generate2FACode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Изпращане на 2FA код по email
export const send2FAEmail = async (email: string, code: string, userName?: string) => {
  const transporter = createEmailTransporter()
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Model Portfolio" <noreply@modelportfolio.com>',
    to: email,
    subject: 'Код за двуфакторна автентификация',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #b8860b; margin: 0;">Model Portfolio</h1>
          <p style="color: #6b6b6b; margin: 5px 0;">Професионално портфолио</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #b8860b 0%, #7d8471 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h2 style="color: white; margin: 0 0 10px 0;">Код за верификация</h2>
          <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 20px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: white; letter-spacing: 5px;">${code}</span>
          </div>
          <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">Този код е валиден 10 минути</p>
        </div>
        
        <div style="background: #f8f7f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0 0 10px 0; color: #2c2c2c;">
            ${userName ? `Здравей ${userName},` : 'Здравейте,'}
          </p>
          <p style="margin: 0 0 10px 0; color: #6b6b6b;">
            Използвайте кода по-горе за да завършите влизането във вашия Model Portfolio акаунт.
          </p>
          <p style="margin: 0; color: #6b6b6b; font-size: 14px;">
            Ако не сте заявявали този код, моля игнорирайте този email.
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e8e6e3;">
          <p style="color: #a8a39a; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Model Portfolio. Всички права запазени.
          </p>
        </div>
      </div>
    `
  }
  
  try {
    const info = await transporter.sendMail(mailOptions)
    
    // За development показваме preview URL
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 2FA Email sent successfully!')
      console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info))
    }
    
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error sending 2FA email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Валидиране на email формат
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Хеширане на код за съхранение в базата данни
export const hashCode = async (code: string): Promise<string> => {
  const bcrypt = await import('bcryptjs')
  return bcrypt.hash(code, 12)
}

// Верификация на код
export const verifyCode = async (code: string, hashedCode: string): Promise<boolean> => {
  const bcrypt = await import('bcryptjs')
  return bcrypt.compare(code, hashedCode)
}

// Изчисляване на изтичане на код (10 минути)
export const getCodeExpiration = (): Date => {
  return new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
}