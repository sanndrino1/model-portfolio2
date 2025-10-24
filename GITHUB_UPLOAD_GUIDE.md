# 🚀 GitHub Upload Instructions

## Преди да започнеш - създай GitHub repository

### 1️⃣ **Създай GitHub акаунт** (ако нямаш)
- Отиди на https://github.com
- Натисни "Sign up"
- Попълни данните и потвърди email-а

### 2️⃣ **Създай нов repository**
1. **Логни се в GitHub**
2. **Натисни зеленият бутон "New"** (горе вляво)
3. **Попълни данните:**
   - **Repository name:** `model-portfolio`
   - **Description:** `Professional model portfolio website built with Next.js 14`
   - **Visibility:** Избери Public или Private
   - **НЕ чеквай:** Initialize this repository with README, .gitignore, или license
   - **Натисни "Create repository"**

### 3️⃣ **Копирай repository URL**
След създаването ще видиш URL от вида:
```
https://github.com/YOUR_USERNAME/model-portfolio.git
```
**Копирай този URL** - ще ти трябва за script-а!

## Качване на файловете

### 4️⃣ **Инсталирай Git** (ако нямаш)
- Отиди на https://git-scm.com/download/win
- Изтегли и инсталирай Git for Windows
- Рестартирай компютъра

### 5️⃣ **Стартирай upload script**

#### **Опция A: PowerShell (препоръчително)**
1. Отвори PowerShell като администратор
2. Навигирай до проекта:
   ```powershell
   cd "C:\Users\ThinkPad T430\Documents\model-portfolio"
   ```
3. Стартирай script-а:
   ```powershell
   .\git-setup.ps1
   ```

#### **Опция B: Command Prompt**
1. Отвори Command Prompt
2. Навигирай до проекта:
   ```cmd
   cd "C:\Users\ThinkPad T430\Documents\model-portfolio"
   ```
3. Стартирай script-а:
   ```cmd
   git-setup.bat
   ```

### 6️⃣ **Следвай инструкциите**
Script-ът ще ти подскаже:
1. Да въведеш GitHub repository URL-а
2. Автоматично ще качи всички файлове
3. Ще създаде професионален commit message
4. Ще push-не всичко към GitHub

## Deployment на Vercel

### 7️⃣ **Deploy на живо** (опционално)
1. **Отиди на https://vercel.com**
2. **Логни се с GitHub акаунта**
3. **Натисни "New Project"**
4. **Избери `model-portfolio` repository**
5. **Натисни "Deploy"**
6. **Готово!** Сайтът ще е live на `https://your-project.vercel.app`

## Файлове които ще се качат

### ✅ **Основни файлове:**
- `src/` - Целия source код
- `database/` - Database migrations
- `public/` - Static assets
- `package.json` - Dependencies
- `README.md` - Документация
- `tailwind.config.ts` - Styling config
- `next.config.mjs` - Next.js config

### ❌ **Файлове които НЕ се качват** (.gitignore):
- `node_modules/` - Dependencies (ще се инсталират автоматично)
- `uploads/` - User uploaded files
- `.next/` - Build artifacts
- `*.db` - Database files
- `.env*` - Environment variables

## Troubleshooting

### **Ако git command не се разпознава:**
```bash
# Провери дали Git е инсталиран
git --version
```
Ако дава грешка - инсталирай Git отново.

### **Ако authentication fail:**
GitHub може да изисква:
- **Personal Access Token** вместо password
- Отиди на GitHub → Settings → Developer settings → Personal access tokens
- Създай token с "repo" permissions

### **Ако upload fail:**
1. Провери repository URL-а
2. Увери се че repository е празен (no README)
3. Провери internet connection

## След успешното качване

### 🎉 **Готово!** Проектът ще е на GitHub с:
- ✅ Всички source файлове
- ✅ Професионална документация
- ✅ Comprehensive commit history
- ✅ Ready за collaboration
- ✅ Ready за deployment

### 📱 **Споделяне:**
- GitHub URL: `https://github.com/YOUR_USERNAME/model-portfolio`
- Live site (ако deploy-наш): `https://your-project.vercel.app`

---

**💡 Tip:** Запази GitHub URL-а - ще ти трябва за бъдещи updates на проекта!