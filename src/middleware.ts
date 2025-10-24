import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'

// Дефинираме ролите и техните права
export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  EDITOR: 'editor',
  USER: 'user',
  GUEST: 'guest'
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

// Права за всяка роля
const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    '/admin',
    '/admin/*', 
    '/api/admin/*',
    '/api/auth/*',
    '/api/users/*',
    '/api/suggestions/*',
    '/api/content/*',
    '/api/settings/*'
  ],
  [USER_ROLES.MODERATOR]: [
    '/admin/suggestions',
    '/admin/content',
    '/api/suggestions/*',
    '/api/content/*'
  ],
  [USER_ROLES.EDITOR]: [
    '/admin/content',
    '/api/content/*'
  ],
  [USER_ROLES.USER]: [
    '/profile',
    '/api/profile/*'
  ],
  [USER_ROLES.GUEST]: []
}

// Защитени route-ове с минимални права
const PROTECTED_ROUTES = {
  // Административни страници
  '/admin': USER_ROLES.ADMIN,
  '/admin/tools': USER_ROLES.ADMIN,
  '/admin/settings': USER_ROLES.ADMIN,
  '/admin/suggestions': USER_ROLES.MODERATOR,
  '/admin/content': USER_ROLES.EDITOR,
  '/admin/analytics': USER_ROLES.MODERATOR,
  '/admin/security': USER_ROLES.ADMIN,
  
  // API endpoints
  '/api/admin': USER_ROLES.ADMIN,
  '/api/settings': USER_ROLES.ADMIN,
  '/api/users': USER_ROLES.ADMIN,
  '/api/suggestions': USER_ROLES.MODERATOR,
  '/api/content': USER_ROLES.EDITOR,
  '/api/auth/logout': USER_ROLES.USER,
  '/api/auth/me': USER_ROLES.USER
}

// Функция за извличане на JWT токен
function getTokenFromRequest(request: NextRequest): string | null {
  // Проверяваме в cookies
  const tokenFromCookie = request.cookies.get('auth-token')?.value
  if (tokenFromCookie) return tokenFromCookie

  // Проверяваме в Authorization header
  const authHeader = request.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return null
}

// Функция за верификация на токен
function verifyToken(token: string): { email: string; role: UserRole } | null {
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key'
    const decoded = verify(token, secret) as any
    
    return {
      email: decoded.email,
      role: decoded.role || USER_ROLES.USER
    }
  } catch {
    return null
  }
}

// Функция за проверка на права
function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    [USER_ROLES.GUEST]: 0,
    [USER_ROLES.USER]: 1,
    [USER_ROLES.EDITOR]: 2,
    [USER_ROLES.MODERATOR]: 3,
    [USER_ROLES.ADMIN]: 4
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

// Функция за проверка дали path-ът съвпада с pattern
function matchesPattern(path: string, pattern: string): boolean {
  // Ако pattern завършва с *, значи е wildcard
  if (pattern.endsWith('*')) {
    const basePattern = pattern.slice(0, -1)
    return path.startsWith(basePattern)
  }
  
  return path === pattern
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Публични route-ове (не се проверяват)
  const publicRoutes = [
    '/',
    '/login',
    '/portfolio', 
    '/about',
    '/contact',
    '/api/auth/send-code',
    '/api/auth/verify-code',
    '/_next',
    '/favicon.ico',
    '/photos',
    '/public'
  ]

  // Проверяваме дали е публичен route
  const isPublicRoute = publicRoutes.some(route => 
    route === pathname || 
    (route.endsWith('*') && pathname.startsWith(route.slice(0, -1))) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/photos') ||
    pathname.startsWith('/public')
  )

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Извличаме токена
  const token = getTokenFromRequest(request)
  
  if (!token) {
    // Няма токен - пренасочваме към login
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' }, 
        { status: 401 }
      )
    }
    
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Верифицираме токена
  const user = verifyToken(token)
  
  if (!user) {
    // Невалиден токен - пренасочваме към login
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' }, 
        { status: 401 }
      )
    }
    
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth-token')
    return response
  }

  // Проверяваме правата за достъп
  let requiredRole: UserRole | null = null

  // Търсим точно съвпадение
  for (const [route, role] of Object.entries(PROTECTED_ROUTES)) {
    if (matchesPattern(pathname, route)) {
      requiredRole = role as UserRole
      break
    }
  }

  // Ако не е намерен конкретен route, но е в админ секция, изисква админ права
  if (!requiredRole && pathname.startsWith('/admin')) {
    requiredRole = USER_ROLES.ADMIN
  }

  // Ако не е намерен конкретен route, но е API endpoint, изисква потребител
  if (!requiredRole && pathname.startsWith('/api/')) {
    requiredRole = USER_ROLES.USER
  }

  // Проверяваме правата
  if (requiredRole && !hasPermission(user.role, requiredRole)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { 
          error: 'Forbidden - Insufficient permissions',
          required: requiredRole,
          current: user.role
        }, 
        { status: 403 }
      )
    }
    
    // За уеб страници пренасочваме към подходяща страница
    if (user.role === USER_ROLES.GUEST || user.role === USER_ROLES.USER) {
      return NextResponse.redirect(new URL('/login', request.url))
    } else {
      // Пренасочваме към достъпна админ страница според ролята
      const redirectMap = {
        [USER_ROLES.EDITOR]: '/admin/content',
        [USER_ROLES.MODERATOR]: '/admin/suggestions',
        [USER_ROLES.ADMIN]: '/admin'
      }
      
      const redirectUrl = redirectMap[user.role] || '/'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
  }

  // Добавяме информация за потребителя в headers за последващо използване
  const response = NextResponse.next()
  response.headers.set('x-user-email', user.email)
  response.headers.set('x-user-role', user.role)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}