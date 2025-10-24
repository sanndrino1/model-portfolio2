// Database schema за 2FA система
// Този файл дефинира типовете данни за потребители и 2FA кодове

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  role: 'admin' | 'editor' | 'viewer'
  isEmailVerified: boolean
  is2FAEnabled: boolean
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

export interface TwoFactorCode {
  id: string
  userId: string
  code: string // hashed
  type: 'email_verification' | 'login_2fa' | 'password_reset'
  email: string
  expiresAt: Date
  isUsed: boolean
  createdAt: Date
  attempts: number
  maxAttempts: number
}

export interface AuthSession {
  id: string
  userId: string
  email: string
  isAuthenticated: boolean
  is2FAVerified: boolean
  createdAt: Date
  expiresAt: Date
  ipAddress?: string
  userAgent?: string
}

// In-memory storage за development (заменя се с база данни в production)
class MemoryStorage {
  private users: Map<string, User> = new Map()
  private codes: Map<string, TwoFactorCode> = new Map()
  private sessions: Map<string, AuthSession> = new Map()

  // User operations
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userData
    }
    this.users.set(user.id, user)
    return user
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user
      }
    }
    return null
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id)
    if (!user) return null
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() }
    this.users.set(id, updatedUser)
    return updatedUser
  }

  // 2FA Code operations
  async create2FACode(codeData: Omit<TwoFactorCode, 'id' | 'createdAt'>): Promise<TwoFactorCode> {
    const code: TwoFactorCode = {
      id: this.generateId(),
      createdAt: new Date(),
      ...codeData
    }
    this.codes.set(code.id, code)
    return code
  }

  async get2FACode(email: string, type: TwoFactorCode['type']): Promise<TwoFactorCode | null> {
    for (const code of this.codes.values()) {
      if (code.email === email && 
          code.type === type && 
          !code.isUsed && 
          code.expiresAt > new Date()) {
        return code
      }
    }
    return null
  }

  async use2FACode(codeId: string): Promise<boolean> {
    const code = this.codes.get(codeId)
    if (!code) return false
    
    code.isUsed = true
    this.codes.set(codeId, code)
    return true
  }

  async incrementCodeAttempts(codeId: string): Promise<TwoFactorCode | null> {
    const code = this.codes.get(codeId)
    if (!code) return null
    
    code.attempts += 1
    this.codes.set(codeId, code)
    return code
  }

  // Session operations
  async createSession(sessionData: Omit<AuthSession, 'id' | 'createdAt'>): Promise<AuthSession> {
    const session: AuthSession = {
      id: this.generateId(),
      createdAt: new Date(),
      ...sessionData
    }
    this.sessions.set(session.id, session)
    return session
  }

  async getSession(sessionId: string): Promise<AuthSession | null> {
    const session = this.sessions.get(sessionId)
    if (!session || session.expiresAt < new Date()) {
      return null
    }
    return session
  }

  async updateSession(sessionId: string, updates: Partial<AuthSession>): Promise<AuthSession | null> {
    const session = this.sessions.get(sessionId)
    if (!session) return null
    
    const updatedSession = { ...session, ...updates }
    this.sessions.set(sessionId, updatedSession)
    return updatedSession
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    return this.sessions.delete(sessionId)
  }

  // Cleanup expired codes and sessions
  cleanup(): void {
    const now = new Date()
    
    // Remove expired codes
    for (const [id, code] of this.codes.entries()) {
      if (code.expiresAt < now) {
        this.codes.delete(id)
      }
    }
    
    // Remove expired sessions
    for (const [id, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(id)
      }
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  }
}

// Singleton instance
export const db = new MemoryStorage()

// Периодично изчистване на изтекли записи (всеки час)
if (typeof window === 'undefined') { // само на сървъра
  setInterval(() => {
    db.cleanup()
  }, 60 * 60 * 1000) // 1 час
}