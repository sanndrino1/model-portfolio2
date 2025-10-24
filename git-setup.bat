@echo off
echo ========================================
echo   Model Portfolio - Git Setup Script
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    echo Then run this script again.
    pause
    exit /b 1
)

echo Git is installed. Proceeding with setup...
echo.

REM Initialize git repository
echo Initializing git repository...
git init

REM Add remote repository (replace with your GitHub URL)
echo.
echo IMPORTANT: Replace YOUR_USERNAME with your actual GitHub username
echo Example: https://github.com/john123/model-portfolio.git
set /p REPO_URL="Enter your GitHub repository URL: "

if "%REPO_URL%"=="" (
    echo ERROR: Repository URL is required!
    pause
    exit /b 1
)

echo Adding remote repository...
git remote add origin %REPO_URL%

REM Add all files
echo Adding all files to staging...
git add .

REM Create initial commit
echo Creating initial commit...
git commit -m "🚀 Initial commit: Professional model portfolio with image management

✨ Features:
- Next.js 14 with TypeScript and App Router
- Responsive photo gallery with lightbox navigation
- Professional image upload with Sharp processing
- SQLite database with persistent storage
- Admin panel for comprehensive photo management
- Drag & drop file upload with progress indicators
- Automatic thumbnail generation and optimization
- Category and tag system for organization
- Mobile-optimized responsive design
- RESTful API endpoints for photo CRUD operations

🛠️ Tech Stack:
- Framework: Next.js 14 (App Router)
- Language: TypeScript 5.2
- Styling: Tailwind CSS v4
- Database: SQLite with better-sqlite3
- Image Processing: Sharp library
- Icons: React Icons, Heroicons
- Development: ESLint, PostCSS, Autoprefixer

📱 Features:
- Responsive grid (2-3-4-5 columns based on screen size)
- Advanced lightbox with navigation
- Drag & drop photo upload
- Real-time image processing
- Metadata management (title, description, tags)
- Category organization system
- Featured photos highlighting
- Mobile-first responsive design
- Touch-friendly navigation
- Audit logging for all operations

🏗️ Architecture:
- Service layer pattern (PhotoManager, PhotoDatabase, ImageProcessor)
- Type-safe database operations
- Async-first design
- Error-resilient implementation
- Clean separation of concerns
- RESTful API design
- Comprehensive error handling

Ready for production deployment!"

REM Set main branch and push
echo Setting main branch and pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo   SUCCESS! Project uploaded to GitHub
echo ========================================
echo.
echo Your portfolio is now available at: %REPO_URL%
echo.
echo Next steps:
echo 1. Visit your GitHub repository to verify files
echo 2. Deploy to Vercel: https://vercel.com
echo 3. Connect your GitHub repo to Vercel for auto-deployment
echo.
pause