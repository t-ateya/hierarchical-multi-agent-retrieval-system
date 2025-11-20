# =============================================================================
# One-time cleanup script to remove ALL implementation code from public repository
# =============================================================================
# This script will:
# 1. Remove all implementation directories from git tracking
# 2. Remove all prohibited files
# 3. Commit the changes
# 4. Push to origin (public repository)
# =============================================================================

Write-Host "`n[CLEANUP] Starting public repository cleanup..." -ForegroundColor Yellow
Write-Host "This will remove ALL implementation code from the public repository.`n" -ForegroundColor Yellow

# Verify we're pushing to origin
$CurrentRemote = git remote get-url origin 2>$null
if (-not $CurrentRemote) {
    Write-Host "[ERROR] 'origin' remote not found!" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Target remote: origin" -ForegroundColor Cyan
Write-Host "       URL: $CurrentRemote`n" -ForegroundColor Gray

# Directories to remove
$DirsToRemove = @(
    "backend_agent_api",
    "backend_rag_pipeline",
    "frontend",
    "sql",
    ".devcontainer",
    "PRPs",
    "docs/academic",
    "docs/project"
)

# Files to remove
$FilesToRemove = @(
    ".cursorrules",
    "AGENTS.md",
    "CLAUDE.md",
    "AI_ASSISTANT_SETUP.md",
    "HUMAN_REPO_GUIDELINES.md",
    ".gitignore-public",
    "README-PUBLIC.md",
    "SETUP.md",
    "Caddyfile",
    "caddy-addon.conf",
    "deploy.py",
    "docker-compose.yml",
    "docker-compose.caddy.yml",
    "smart-push.ps1"
)

Write-Host "[STEP 1] Removing directories from git tracking..." -ForegroundColor Cyan
$RemovedDirs = @()
foreach ($Dir in $DirsToRemove) {
    # Check if directory exists in git (even if empty)
    $InGit = git ls-tree -r HEAD --name-only | Select-String "^$Dir/" 2>$null
    $Tracked = git ls-files $Dir 2>$null
    
    if ($InGit -or $Tracked) {
        Write-Host "   Removing: $Dir/" -ForegroundColor Gray
        # Force remove even if it appears empty
        git rm -r --cached $Dir 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            $RemovedDirs += $Dir
        } else {
            # Try alternative method for empty directories
            git rm -r --cached $Dir/* 2>&1 | Out-Null
            git rm -r --cached $Dir/**/* 2>&1 | Out-Null
        }
    } else {
        Write-Host "   Skipping: $Dir/ (not in repository)" -ForegroundColor DarkGray
    }
}

Write-Host "`n[STEP 2] Removing files from git tracking..." -ForegroundColor Cyan
$RemovedFiles = @()
foreach ($File in $FilesToRemove) {
    if (Test-Path $File) {
        $Tracked = git ls-files $File 2>$null
        if ($Tracked) {
            Write-Host "   Removing: $File" -ForegroundColor Gray
            git rm --cached $File 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                $RemovedFiles += $File
            }
        } else {
            Write-Host "   Skipping: $File (not tracked)" -ForegroundColor DarkGray
        }
    }
}

# Remove .claude directory
if (Test-Path ".claude") {
    $Tracked = git ls-files .claude 2>$null
    if ($Tracked) {
        Write-Host "   Removing: .claude/" -ForegroundColor Gray
        git rm -r --cached .claude 2>&1 | Out-Null
    }
}

Write-Host "`n[STEP 3] Checking status..." -ForegroundColor Cyan
git status --short

$TotalRemoved = $RemovedDirs.Count + $RemovedFiles.Count
if ($TotalRemoved -eq 0) {
    Write-Host "`n[INFO] No files to remove. Repository is already clean." -ForegroundColor Green
    exit 0
}

Write-Host "`n[SUMMARY] Removed $TotalRemoved items:" -ForegroundColor Yellow
Write-Host "   Directories: $($RemovedDirs.Count)" -ForegroundColor Gray
Write-Host "   Files: $($RemovedFiles.Count)" -ForegroundColor Gray

Write-Host "`n[PROMPT] Commit and push these changes to origin? (y/N): " -ForegroundColor Yellow -NoNewline
$Confirm = Read-Host

if ($Confirm -ne "y" -and $Confirm -ne "Y") {
    Write-Host "`n[CANCELLED] Changes staged but not committed. Run 'git reset' to unstage." -ForegroundColor Red
    exit 0
}

Write-Host "`n[STEP 4] Committing changes..." -ForegroundColor Cyan
git commit -m "fix(public): remove all implementation code and private documents

- Remove implementation directories: backend_agent_api/, backend_rag_pipeline/, frontend/, sql/
- Remove development configs: .devcontainer/, PRPs/
- Remove private docs: docs/academic/, docs/project/
- Remove AI assistant configs and internal files
- Public repository now contains only: docs/structure/, research_development/, README.md"

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Commit failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n[STEP 5] Pushing to origin/main..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCCESS] Public repository cleanup complete!" -ForegroundColor Green
    Write-Host "The public repository now contains only documentation." -ForegroundColor Green
} else {
    Write-Host "`n[ERROR] Push failed!" -ForegroundColor Red
    exit 1
}

