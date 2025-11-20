# =============================================================================
# Smart Push Script - Auto-detects remote and excludes code for public repo
# =============================================================================
# 
# Usage: .\smart-push.ps1 [remote] [branch]
#   - remote: 'origin' (public) or 'private' (default: 'origin')
#   - branch: branch name (default: 'main')
#
# Examples:
#   .\smart-push.ps1                    # Push to origin (public) - excludes code
#   .\smart-push.ps1 origin main        # Push to origin (public) - excludes code
#   .\smart-push.ps1 private main        # Push to private - includes everything
# =============================================================================

param(
    [string]$Remote = "origin",
    [string]$Branch = "main"
)

# Get current directory
$RepoRoot = Get-Location

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Not in a git repository" -ForegroundColor Red
    exit 1
}

# Verify remote exists
$RemoteUrl = git remote get-url $Remote 2>$null
if (-not $RemoteUrl) {
    Write-Host "❌ Error: Remote '$Remote' not found" -ForegroundColor Red
    Write-Host "Available remotes:" -ForegroundColor Yellow
    git remote -v
    exit 1
}

Write-Host "`n🔍 Detected remote: $Remote" -ForegroundColor Cyan
Write-Host "   URL: $RemoteUrl" -ForegroundColor Gray

# Determine if this is public (origin) or private
$IsPublic = $Remote -eq "origin"

if ($IsPublic) {
    Write-Host "`n📋 PUBLIC REPOSITORY MODE" -ForegroundColor Yellow
    Write-Host "   Will exclude implementation code directories" -ForegroundColor Gray
    
    # Directories to exclude from public repo
    $ExcludeDirs = @(
        "backend_agent_api",
        "backend_rag_pipeline", 
        "frontend",
        "sql",
        ".devcontainer",
        "PRPs",
        "docs/academic",
        "docs/project"
    )
    
    # Files to exclude from public repo
    $ExcludeFiles = @(
        ".cursorrules",
        "AGENTS.md",
        "CLAUDE.md",
        "AI_ASSISTANT_SETUP.md",
        "HUMAN_REPO_GUIDELINES.md",
        ".gitignore-public",
        "CLEAN_PUBLIC_REPO.bat",
        "REMOVE_CODE_FROM_PUBLIC.bat",
        "README-PUBLIC.md",
        "Caddyfile",
        "caddy-addon.conf",
        "deploy.py",
        "docker-compose.yml",
        "docker-compose.caddy.yml",
        "smart-push.ps1"
    )
    
    Write-Host "`n🧹 Removing implementation code from staging..." -ForegroundColor Cyan
    
    # Remove directories
    foreach ($Dir in $ExcludeDirs) {
        if (Test-Path $Dir) {
            $Tracked = git ls-files $Dir 2>$null
            if ($Tracked) {
                Write-Host "   Removing: $Dir/" -ForegroundColor Gray
                git rm -r --cached $Dir 2>$null | Out-Null
            }
        }
    }
    
    # Remove files
    foreach ($File in $ExcludeFiles) {
        if (Test-Path $File) {
            $Tracked = git ls-files $File 2>$null
            if ($Tracked) {
                Write-Host "   Removing: $File" -ForegroundColor Gray
                git rm --cached $File 2>$null | Out-Null
            }
        }
    }
    
    # Remove .claude directory if it exists
    if (Test-Path ".claude") {
        $Tracked = git ls-files .claude 2>$null
        if ($Tracked) {
            Write-Host "   Removing: .claude/" -ForegroundColor Gray
            git rm -r --cached .claude 2>$null | Out-Null
        }
    }
    
    Write-Host "`n✅ Public repo cleanup complete" -ForegroundColor Green
    
} else {
    Write-Host "`n📋 PRIVATE REPOSITORY MODE" -ForegroundColor Green
    Write-Host "   Will include all files (full implementation)" -ForegroundColor Gray
}

# Show what will be pushed
Write-Host "`n📦 Staged changes:" -ForegroundColor Cyan
git status --short

# Confirm before pushing
Write-Host "`n❓ Push to $Remote/$Branch? (y/N): " -ForegroundColor Yellow -NoNewline
$Confirm = Read-Host

if ($Confirm -ne "y" -and $Confirm -ne "Y") {
    Write-Host "`n❌ Push cancelled" -ForegroundColor Red
    exit 0
}

# Stage all remaining changes (in case of new files)
Write-Host "`n📝 Staging all changes..." -ForegroundColor Cyan
git add -A

# Commit if there are changes
$Status = git status --porcelain
if ($Status) {
    Write-Host "`n💾 Committing changes..." -ForegroundColor Cyan
    $CommitMsg = if ($IsPublic) { 
        "docs(public): update documentation and research materials" 
    } else { 
        "feat: update implementation code" 
    }
    git commit -m $CommitMsg
} else {
    Write-Host "`nℹ️  No changes to commit" -ForegroundColor Gray
}

# Push to remote
Write-Host "`n🚀 Pushing to $Remote/$Branch..." -ForegroundColor Cyan
git push $Remote $Branch

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully pushed to $Remote/$Branch" -ForegroundColor Green
} else {
    Write-Host "`n❌ Push failed" -ForegroundColor Red
    exit 1
}

