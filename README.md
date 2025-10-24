# Model Portfolio - Професионален модел портфолио сайт

Модерен Next.js 14 портфолио сайт с професионална система за управление на изображения, респонзив галерии и елегантен дизайн.

## 🚀 Функционалности

### 🖼️ **Професионално управление на изображения**
- **Drag & Drop Upload** с progress индикатори
- **Автоматично thumbnail generation** със Sharp библиотека
- **Image optimization** (90% качество, множество размери)
- **Persistent storage** със SQLite база данни
- **Category & Tag система** за организация
- **Featured photos** система за highlights

### 📱 **Респонзив дизайн**
- **Mobile-First** подход с оптимизирани layout-и
- **Adaptive Grid** (2-3-4-5 колони според размера на екрана)
- **Touch-Friendly** навигация и взаимодействия
- **Оптимизирани размери** на изображенията за различни устройства
- **Модерен UI** с плавни анимации

### 🚀 **Performance оптимизация**
- **Next.js 14** с App Router
- **TypeScript** за type safety
- **Tailwind CSS v4** за styling
- **Оптимизирани изображения** с Next.js Image компонент
- **Lazy loading** и progressive enhancement

### 🔧 **Admin функционалности**
- **Photo upload интерфейс** с drag & drop
- **Metadata management** (title, description, tags)
- **Category organization** система
- **Batch operations** за множество снимки
- **Activity tracking** и audit logs

### 📊 **Технически stack**
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.2
- **Styling:** Tailwind CSS v4
- **Database:** SQLite с better-sqlite3
- **Image Processing:** Sharp библиотека
- **Icons:** React Icons, Heroicons
- **Development:** ESLint, PostCSS, Autoprefixer

## 📋 Системни изисквания

- **Node.js** 18+ 
- **npm** или **yarn**
- **Git** за клониране на проекта
- **Docker** (опционално) за контейнеризация

## 🔧 Инсталация

### 1. Клониране на проекта

```bash
git clone <repository-url>
cd model-portfolio
```

### 2. Инсталиране на dependencies

```bash
npm install
# или
yarn install
```

### 3. Environment настройки

Създайте `.env.local` файл в root директорията:

```env
# Email настройки за 2FA
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# NextAuth настройки (ако се използва)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Database (ако се използва)
DATABASE_URL=your-database-url

# Redis за кеширане (опционално)
REDIS_URL=your-redis-url
```

### 4. Стартиране на development сървъра

```bash
npm run dev
# или
yarn dev
```

Отворете [http://localhost:3000](http://localhost:3000) в браузъра.

## 🐳 Docker Setup

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
    depends_on:
      - redis
      
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

### Стартиране с Docker

```bash
# Build и стартиране
docker-compose up --build

# В background режим
docker-compose up -d

# Спиране
docker-compose down
```

## 🛠️ Как се добавят нови UI тулове (компоненти)

### 1. Създаване на нов компонент

Създайте нов файл в `src/components/ui/`:

```tsx
// src/components/ui/NewComponent.tsx
'use client'

import { cn } from '@/lib/utils'

interface NewComponentProps {
  variant?: 'default' | 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

export function NewComponent({ 
  variant = 'default', 
  size = 'md', 
  children, 
  className 
}: NewComponentProps) {
  return (
    <div className={cn(
      'base-styles',
      {
        'variant-styles': variant === 'primary',
        'size-styles': size === 'lg'
      },
      className
    )}>
      {children}
    </div>
  )
}
```

### 2. Експортиране в index файла

Добавете в `src/components/ui/index.ts`:

```tsx
export { NewComponent } from './NewComponent'
```

### 3. Документация в AdminTools

Обновете масива `UI_COMPONENTS` в `src/components/admin/AdminTools.tsx`:

```tsx
{
  id: 'new-component',
  name: 'NewComponent',
  description: 'Описание на новия компонент',
  category: 'layout', // или друга категория
  status: 'stable',
  version: '1.0.0',
  props: [
    {
      name: 'variant',
      type: '"default" | "primary" | "secondary"',
      required: false,
      default: 'default',
      description: 'Стил на компонента'
    }
    // други props...
  ],
  examples: [
    {
      title: 'Основна употреба',
      code: '<NewComponent>Content</NewComponent>',
      preview: <NewComponent>Example</NewComponent>
    }
  ]
}
```

### 4. TypeScript типове

Добавете типовете в съответния файл или създайте нов `.d.ts` файл.

## 👥 Ролева система и права

### Роли в системата

#### 🔹 **Viewer (Зрител)**
```tsx
permissions: {
  read: ['content', 'portfolio']
}
```
- Преглед на публично съдържание
- Ограничен достъп до админ панела

#### 🔹 **Editor (Редактор)**
```tsx
permissions: {
  read: ['content', 'portfolio', 'suggestions'],
  write: ['content', 'portfolio'],
  manage: ['own_content']
}
```
- Създаване и редактиране на съдържание
- Управление на портфолио галерии
- Подаване на предложения

#### 🔹 **Admin (Администратор)**
```tsx
permissions: {
  read: ['*'],
  write: ['*'],
  delete: ['*'],
  manage: ['*']
}
```
- Пълен достъп до всички функции
- Управление на потребители и роли
- Системни настройки и конфигурация
- Преглед на audit логове

### Middleware за защита на routes

```tsx
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Защитени админ routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth_token')
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Проверка на роля
    if (pathname.startsWith('/admin/settings')) {
      // Само администратори
      const userRole = getUserRoleFromToken(token.value)
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
```

### Как се добавят нови роли

#### 1. Обновете типовете

```tsx
// src/lib/auth.ts
export type UserRole = 'viewer' | 'editor' | 'admin' | 'moderator' // добавете нова роля

export interface Permission {
  resource: string
  actions: ('read' | 'write' | 'delete' | 'manage')[]
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  moderator: [
    { resource: 'suggestions', actions: ['read', 'write', 'manage'] },
    { resource: 'content', actions: ['read', 'write'] }
  ]
  // други роли...
}
```

#### 2. Добавете проверки в компонентите

```tsx
// Използване в компоненти
import { useAuth } from '@/contexts/AuthContext'
import { hasPermission } from '@/lib/auth'

function MyComponent() {
  const { user } = useAuth()
  
  const canEdit = hasPermission(user?.role, 'content', 'write')
  
  return (
    <div>
      {canEdit && <Button>Редактирай</Button>}
    </div>
  )
}
```

#### 3. API endpoint защита

```tsx
// src/app/api/admin/route.ts
import { checkPermission } from '@/lib/auth'

export async function POST(request: Request) {
  const user = await getUserFromRequest(request)
  
  if (!checkPermission(user.role, 'admin', 'write')) {
    return new Response('Forbidden', { status: 403 })
  }
  
  // API логика...
}
```

## 📊 Activity Tracking & Audit Logs

### Автоматично логване

Системата автоматично логва:
- Login/Logout събития
- Промени в съдържание
- Настройки на системата
- Одобрение/отказ на предложения

### Ръчно логване

```tsx
import { auditLogger } from '@/lib/auditLog'

// Логване на custom събитие
await auditLogger.log({
  userId: user.id,
  userEmail: user.email,
  userRole: user.role,
  action: 'custom_action',
  resourceType: 'custom_resource',
  details: {
    description: 'Описание на действието',
    severity: 'medium',
    category: 'user_action'
  }
})
```

### API заявки за логове

```tsx
// Извличане на логове с филтри
const response = await fetch('/api/admin/audit-logs?' + new URLSearchParams({
  action: 'login',
  severity: 'high',
  dateFrom: '2024-01-01',
  page: '1'
}))

// Статистики
const stats = await fetch('/api/admin/audit-logs/stats')
```

## 🔧 Development команди

```bash
# Development сървър
npm run dev

# Production build
npm run build

# Стартиране на production
npm start

# Linting
npm run lint

# Type checking
npm run type-check

# Тестове (ако са налични)
npm test
```

## 📁 Структура на проекта

```
model-portfolio/
├── public/                 # Статични файлове
├── photos/                # Портфолио снимки
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── admin/         # Админ страници
│   │   ├── api/           # API routes
│   │   └── ...
│   ├── components/        # React компоненти
│   │   ├── ui/           # UI компоненти
│   │   ├── admin/        # Админ компоненти
│   │   └── auth/         # Auth компоненти
│   ├── contexts/         # React contexts
│   ├── lib/              # Utility функции
│   └── config/           # Конфигурация
├── .env.local           # Environment variables
├── package.json
└── README.md
```

## � AI Агенти и разработка

### GitHub Copilot интеграция

Този проект е оптимизиран за работа с AI асистенти като GitHub Copilot, Claude, ChatGPT и други. Включва специални инструкции и промтове за ефективна разработка.

### 📋 Copilot Instructions

Проектът включва `.github/copilot-instructions.md` с детайлни инструкции за AI агентите:

- **Архитектурни модели** - Next.js 14 App Router, TypeScript, Tailwind CSS v4
- **Компонентни конвенции** - File structure, naming patterns, styling
- **Булграски език** - Навигация и съдържание на български
- **Responsive дизайн** - Mobile-first подход с Tailwind breakpoints

### 🚀 Начални промтове за AI агенти

#### Промпт за нов AI развойски агент:

```markdown
# Model Portfolio - AI Развойски контекст

Работиш с Next.js 14 модел портфолио проект с българска локализация.

## Основна архитектура:
- Next.js 14 с App Router и TypeScript
- Tailwind CSS v4 с custom CSS variables
- 2FA автентификация с email верификация  
- Административен панел с 5 секции
- Activity tracking система с audit logs
- UI компонентна библиотека с документация

## Файлова структура:
```
src/
├── app/                  # Next.js страници (/, /admin, /login, etc.)
├── components/
│   ├── ui/              # UI компоненти (Button, Card, Modal, etc.)
│   ├── admin/           # Админ компоненти (AdminTools, ContentManager, etc.)
│   └── auth/            # Auth компоненти (LoginForm)
├── contexts/            # React contexts (AuthContext, ToastContext)
├── lib/                 # Utilities (auth.ts, auditLog.ts, email.ts, etc.)
└── config/              # Конфигурация (navigation.ts)
```

## Ключови компоненти:
- **AdminTools**: UI компонентна документация
- **ContentManager**: Управление на страници и портфолио
- **SettingsManager**: Системни настройки
- **ActivityTracker**: Audit logs и активност
- **SuggestionsManager**: Предложения с одобрение/отказ

## Стилизиране:
- Използвай `cn()` utility за class combining
- CSS variables: `--background`, `--foreground`, `--muted`, etc.
- Responsive: `sm:`, `md:`, `lg:` breakpoints
- Българска локализация навсякъде

## Patterns:
- 'use client' за интерактивни компоненти
- TypeScript интерфейси за всички props
- Audit logging за всички CRUD операции
- Toast notifications за user feedback

Винаги следвай съществуващите модели и конвенции.
```

#### Промпт за добавяне на нова функционалност:

```markdown
# Добавяне на нова функционалност

Добавям нова функционалност към Model Portfolio проекта.

## Контекст:
- Проектът използва Next.js 14, TypeScript, Tailwind CSS v4
- Има пълноценен админ панел с 5 секции  
- Activity tracking система логва всички действия
- Българска локализация е задължителна
- UI компонентите са документирани в AdminTools

## Изисквания:
1. Следвай съществуващата архитектура и file structure
2. Използвай TypeScript интерфейси
3. Добави audit logging за важни действия
4. Добави документация в AdminTools (ако е UI компонент)
5. Използвай съществуващите UI компоненти когато е възможно
6. Всички текстове на български език

## Нужни стъпки:
- [ ] Създай необходимите TypeScript интерфейси
- [ ] Имплементирай основната функционалност  
- [ ] Добави audit logging
- [ ] Създай UI компоненти (ако е нужно)
- [ ] Добави в админ панела (ако е admin функция)
- [ ] Тествай функционалността

Започни с [описание на функционалността].
```

#### Промпт за debugging и поправки:

```markdown
# Debug и поправки

Работя с Model Portfolio проект за поправка на проблем.

## Проектен контекст:
- Next.js 14 с TypeScript и Tailwind CSS v4
- 2FA автентификация с AuthContext
- Audit logging система
- UI компонентна библиотека
- Български език в целия интерфейс

## Текущ проблем:
[Опиши проблема тук]

## Файлове за проверка:
- Компоненти: `src/components/`
- API routes: `src/app/api/`
- Contexts: `src/contexts/`
- Utilities: `src/lib/`

## Debugging стъпки:
1. Провери console errors
2. Валидирай TypeScript типове
3. Провери API endpoints отговори
4. Тествай в development режим
5. Провери audit logs за грешки

Започни с анализ на проблема.
```

#### Промпт за code review:

```markdown
# Code Review - Model Portfolio

Правя code review на промени в Model Portfolio проекта.

## Review критерии:
- **TypeScript**: Правилни типове и интерфейси
- **Performance**: Оптимизация и best practices
- **UI/UX**: Consistent дизайн с Tailwind
- **Локализация**: Всички текстове на български
- **Security**: Правилна валидация и auth checks
- **Audit**: Логване на важни действия
- **Testing**: Функционалността работи правилно

## Архитектурни стандарти:
- Next.js App Router conventions
- Tailwind CSS v4 patterns
- TypeScript строги типове
- React patterns (hooks, contexts)
- Responsive mobile-first дизайн

## Специфични проверки:
- [ ] Props интерфейси дефинирани
- [ ] Audit logging добавен където е нужно
- [ ] Български текстове използвани
- [ ] UI компоненти правилно стилизирани
- [ ] Error handling имплементиран
- [ ] Loading states добавени

Анализирай промените и дай препоръки.
```

### 🔧 Development Workflow с AI

#### 1. **Стартиране на нова функция**
```bash
# Стартирай development server
npm run dev

# Отвори в браузър
http://localhost:3002
```

Използвай началния промпт за контекст на AI агента.

#### 2. **Тестване на промени**
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

#### 3. **Audit logging за нови функции**
```tsx
import { auditLogger } from '@/lib/auditLog'

// В края на функция
await auditLogger.log({
  userId: user.id,
  userEmail: user.email,
  userRole: user.role,
  action: 'create', // или update, delete, etc.
  resourceType: 'content', // или portfolio, settings, etc.
  resourceId: newItemId,
  resourceName: newItemName,
  details: {
    description: 'Описание на действието на български',
    severity: 'medium',
    category: 'content'
  }
})
```

#### 4. **UI компонент pattern**
```tsx
'use client'

import { cn } from '@/lib/utils'

interface ComponentProps {
  variant?: 'default' | 'primary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
}

export function Component({ 
  variant = 'default', 
  size = 'md', 
  className,
  children 
}: ComponentProps) {
  return (
    <div className={cn(
      'base-classes',
      {
        'variant-classes': variant === 'primary',
        'size-classes': size === 'lg'
      },
      className
    )}>
      {children}
    </div>
  )
}
```

### 📝 AI Code Generation Guidelines

#### **Dos:**
- ✅ Използвай TypeScript строго типизиране
- ✅ Добавяй audit logging за важни действия
- ✅ Пиши всички текстове на български
- ✅ Следвай съществуващите UI patterns
- ✅ Използвай `cn()` за CSS classes
- ✅ Добавяй loading и error states

#### **Don'ts:**
- ❌ Не създавай inline styles
- ❌ Не използвай English текстове
- ❌ Не пропускай TypeScript типове
- ❌ Не игнорирай audit logging
- ❌ Не нарушавай съществуващата архитектура

### 📚 AI Documentation Files

За по-детайлна информация вижте:

- **[Quick Reference](./docs/QUICK_REFERENCE.md)** - Бърза справка за AI агенти 🚀
- **[AI Development Guide](./docs/AI_DEVELOPMENT_GUIDE.md)** - Пълни patterns и conventions
- **[AI Starter Prompts](./docs/AI_STARTER_PROMPTS.md)** - Ready-to-use промптове за различни сценарии
- **[Copilot Instructions](./.github/copilot-instructions.md)** - GitHub Copilot специфични инструкции

### 🎯 AI Assisted Features

Проектът поддържа AI-assisted разработка за:

- **Автоматично генериране на UI компоненти**
- **TypeScript интерфейс генериране**
- **API endpoint създаване**
- **Audit log integration**
- **Българска локализация**
- **Responsive дизайн оптимизация**

## �🤝 Contributing

1. Fork проекта
2. Създайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit промените (`git commit -m 'Add amazing feature'`)
4. Push към branch (`git push origin feature/amazing-feature`)
5. Отворете Pull Request

## 📝 License

Този проект е под MIT лиценз. Вижте `LICENSE` файла за детайли.

## 🐛 Bug Reports & Feature Requests

За bug reports и feature requests, моля използвайте GitHub Issues или се свържете с развойния екип.

## 📞 Support

За въпроси и поддръжка:
- Email: support@modelportfolio.com
- GitHub Issues: [Repository Issues](https://github.com/your-repo/issues)

---

**Благодарим, че използвате Model Portfolio! 🎉**
