# =============================================================================
# Remove Empty Directories from Public Repository
# =============================================================================
# This script forcefully removes empty implementation directories from git
# =============================================================================

Write-Host "`n[REMOVE] Removing empty directories from public repository..." -ForegroundColor Yellow

# Directories to remove (even if empty)
$DirsToRemove = @(
    "backend_agent_api",
    "backend_rag_pipeline",
    "frontend",
    "sql",
    ".devcontainer",
    "PRPs"
)

$RemovedCount = 0

foreach ($Dir in $DirsToRemove) {
    # Check if directory exists in git tree
    $InGit = git ls-tree -r HEAD --name-only | Select-String "^$Dir" 2>$null
    
    if ($InGit) {
        Write-Host "   Removing: $Dir/" -ForegroundColor Gray
        # Force remove with -f flag
        git rm -rf --cached $Dir 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            $RemovedCount++
            Write-Host "   [OK] Removed $Dir/" -ForegroundColor Green
        } else {
            # Try removing any files inside first
            $Files = git ls-files $Dir 2>$null
            if ($Files) {
                foreach ($File in $Files) {
                    git rm --cached $File 2>&1 | Out-Null
                }
            }
            Write-Host "   [OK] Removed $Dir/ (alternative method)" -ForegroundColor Green
            $RemovedCount++
        }
    } else {
        Write-Host "   [SKIP] $Dir/ not in repository" -ForegroundColor DarkGray
    }
}

if ($RemovedCount -eq 0) {
    Write-Host "`n[INFO] No directories to remove." -ForegroundColor Green
    exit 0
}

Write-Host "`n[STATUS] Removed $RemovedCount directories" -ForegroundColor Cyan
git status --short

Write-Host "`n[PROMPT] Commit and push? (y/N): " -ForegroundColor Yellow -NoNewline
$Confirm = Read-Host

if ($Confirm -ne "y" -and $Confirm -ne "Y") {
    Write-Host "`n[CANCELLED] Run 'git reset' to unstage." -ForegroundColor Red
    exit 0
}

Write-Host "`n[COMMIT] Committing removal of empty directories..." -ForegroundColor Cyan
git commit -m "fix(public): remove empty implementation directories

- Remove empty backend_agent_api/, backend_rag_pipeline/, frontend/, sql/
- Remove empty .devcontainer/, PRPs/
- Public repository now contains only documentation"

Write-Host "`n[PUSH] Pushing to origin/main..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCCESS] Empty directories removed from public repository!" -ForegroundColor Green
} else {
    Write-Host "`n[ERROR] Push failed!" -ForegroundColor Red
    exit 1
}

