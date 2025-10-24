# Git Setup Script for Model Portfolio
# PowerShell version for better error handling

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Model Portfolio - Git Setup Script" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version 2>$null
    Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Initialize git repository
Write-Host "Initializing git repository..." -ForegroundColor Yellow
git init

# Add remote repository
Write-Host ""
Write-Host "IMPORTANT: Replace YOUR_USERNAME with your actual GitHub username" -ForegroundColor Magenta
Write-Host "Example: https://github.com/john123/model-portfolio.git" -ForegroundColor Gray

do {
    $repoUrl = Read-Host "Enter your GitHub repository URL"
    if ([string]::IsNullOrWhiteSpace($repoUrl)) {
        Write-Host "❌ Repository URL is required!" -ForegroundColor Red
    }
} while ([string]::IsNullOrWhiteSpace($repoUrl))

Write-Host "Adding remote repository..." -ForegroundColor Yellow
git remote add origin $repoUrl

# Add all files
Write-Host "Adding all files to staging..." -ForegroundColor Yellow
git add .

# Create initial commit
Write-Host "Creating initial commit with comprehensive message..." -ForegroundColor Yellow

$commitMessage = @"
🚀 Initial commit: Professional model portfolio with image management

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

📱 Responsive Features:
- Responsive grid (2-3-4-5 columns based on screen size)
- Advanced lightbox with navigation arrows
- Drag & drop photo upload interface
- Real-time image processing with Sharp
- Metadata management (title, description, tags)
- Category organization system
- Featured photos highlighting system
- Mobile-first responsive design approach
- Touch-friendly navigation controls
- Comprehensive audit logging for all operations

🏗️ Architecture:
- Service layer pattern (PhotoManager, PhotoDatabase, ImageProcessor)
- Type-safe database operations with better-sqlite3
- Async-first design for file processing
- Error-resilient implementation throughout
- Clean separation of concerns
- RESTful API design with proper HTTP status codes
- Comprehensive error handling and user feedback

📊 Performance:
- Automatic thumbnail generation (300px width)
- Image optimization (90% quality)
- Lazy loading with Next.js Image component
- Responsive image sizes for different devices
- Efficient SQLite database queries with indexes
- Mobile-optimized asset delivery

Ready for production deployment on Vercel or similar platforms!
"@

git commit -m $commitMessage

# Set main branch and push
Write-Host "Setting main branch and pushing to GitHub..." -ForegroundColor Yellow
git branch -M main

try {
    git push -u origin main
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   SUCCESS! Project uploaded to GitHub" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ Your portfolio is now available at: $repoUrl" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Visit your GitHub repository to verify all files are uploaded" -ForegroundColor White
    Write-Host "2. Deploy to Vercel: https://vercel.com" -ForegroundColor White
    Write-Host "3. Connect your GitHub repo to Vercel for automatic deployment" -ForegroundColor White
    Write-Host "4. Configure environment variables if needed" -ForegroundColor White
    Write-Host "5. Test the live deployment" -ForegroundColor White
} catch {
    Write-Host "❌ Error pushing to GitHub: $_" -ForegroundColor Red
    Write-Host "Please check your repository URL and try again." -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to continue"