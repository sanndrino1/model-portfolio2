# ✅ Pre-Upload Checklist

## Преди quality на GitHub, провери:

### 🔧 **Technical Requirements**
- [ ] **Git инсталиран** - `git --version` работи
- [ ] **Node.js работи** - `npm --version` работи  
- [ ] **Проектът се build-ва** - `npm run build` успешен
- [ ] **Dev server стартира** - `npm run dev` работи на localhost:3000
- [ ] **No console errors** в browser developer tools

### 📁 **File Structure Check**
- [ ] **src/app/** - Pages и layout files
- [ ] **src/components/** - UI components
- [ ] **src/lib/** - Core utilities (photoManager, database, etc.)
- [ ] **database/migrations/** - SQL schema files
- [ ] **package.json** - Dependencies и scripts
- [ ] **README.md** - Updated documentation
- [ ] **tailwind.config.ts** - Styling configuration

### 🚫 **Files to EXCLUDE (должни да са в .gitignore)**
- [ ] **node_modules/** - Не се качва (много голям)
- [ ] **uploads/** - User files (не се качват)
- [ ] **.next/** - Build artifacts (регенерират се)
- [ ] ***.db, *.sqlite** - Database files (не се качват)
- [ ] **.env*** - Environment variables (security risk)

### 🔐 **Security Check**
- [ ] **No API keys** в source код
- [ ] **No passwords** в файлове
- [ ] **No personal data** в sample data
- [ ] **.env files excluded** от git

### 📝 **Documentation Status**
- [ ] **README.md updated** с current features
- [ ] **Package.json description** accurate
- [ ] **Comments в code** за complex logic
- [ ] **TypeScript types** documented

### 🌐 **GitHub Repository Setup**
- [ ] **Repository created** на GitHub
- [ ] **Repository е празен** (no initial files)
- [ ] **Repository URL copied** (https://github.com/USERNAME/model-portfolio.git)
- [ ] **Public/Private chosen** appropriately

### 💻 **Functionality Test**
- [ ] **Gallery loads** photos correctly
- [ ] **Photo upload works** в admin panel
- [ ] **Responsive design** тества на мобилен
- [ ] **Lightbox navigation** работи
- [ ] **Category filtering** functional
- [ ] **No broken links** в navigation

## Upload Process

### 1. **Run Upload Script**
```bash
# PowerShell (preferred)
.\git-setup.ps1

# или Command Prompt
git-setup.bat
```

### 2. **Provide Repository URL**
When prompted, enter your GitHub repository URL:
```
https://github.com/YOUR_USERNAME/model-portfolio.git
```

### 3. **Verify Upload**
Check GitHub repository за:
- [ ] **All source files** present
- [ ] **README.md renders** properly
- [ ] **File structure** is correct
- [ ] **Commit message** is descriptive

### 4. **Deploy to Vercel** (Optional)
- [ ] **Connect GitHub** repository to Vercel
- [ ] **Deploy successfully** 
- [ ] **Live site works** properly
- [ ] **No build errors** in deployment logs

## Post-Upload

### ✅ **Success Indicators**
- [ ] **GitHub repository** shows all files
- [ ] **README renders** with proper formatting
- [ ] **Clone and run** works на нова машина
- [ ] **Build succeeds** на deployment platform
- [ ] **Live site functional** (if deployed)

### 📊 **Repository Quality**
- [ ] **Professional README** с screenshots
- [ ] **Clear project description**
- [ ] **Proper tech stack listed**
- [ ] **Installation instructions** clear
- [ ] **License file** added (if open source)

### 🚀 **Ready for Portfolio**
- [ ] **GitHub link** готов за споделяне
- [ ] **Live demo link** (if deployed)
- [ ] **Professional presentation**
- [ ] **Code quality** демонстрирана

---

## Troubleshooting

### ❌ **Common Issues:**

**Git not recognized:**
```bash
# Install Git from https://git-scm.com/download/win
# Restart terminal after installation
```

**Authentication failed:**
```bash
# Use Personal Access Token instead of password
# GitHub Settings → Developer settings → PAT
```

**Upload too large:**
```bash
# Verify .gitignore excludes:
# - node_modules/
# - uploads/
# - .next/
```

**Build fails:**
```bash
# Test locally first:
npm install
npm run build
```

Ready? ✅ След като всички checklist-и са marked, стартирай upload script-а!