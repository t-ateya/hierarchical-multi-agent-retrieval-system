# =============================================================================
# Remove Empty Implementation Directories from Public Repository
# =============================================================================

Write-Host "`n[REMOVE] Removing empty implementation directories..." -ForegroundColor Yellow

# Directories to remove
$DirsToRemove = @(
    "backend_agent_api",
    "backend_rag_pipeline",
    "frontend",
    "sql",
    ".devcontainer",
    "PRPs"
)

$RemovedCount = 0
$Errors = @()

foreach ($Dir in $DirsToRemove) {
    # Check if directory exists in git
    $InGit = git ls-tree -r HEAD --name-only 2>$null | Select-String "^$Dir"
    
    if ($InGit) {
        Write-Host "   Removing: $Dir/" -ForegroundColor Gray
        # Try multiple methods to ensure removal
        git rm -r --cached $Dir 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) {
            # Try with force flag
            git rm -rf --cached $Dir 2>&1 | Out-Null
        }
        if ($LASTEXITCODE -eq 0) {
            $RemovedCount++
            Write-Host "   [OK] Removed $Dir/" -ForegroundColor Green
        } else {
            $Errors += $Dir
            Write-Host "   [ERROR] Failed to remove $Dir/" -ForegroundColor Red
        }
    } else {
        Write-Host "   [SKIP] $Dir/ not in repository" -ForegroundColor DarkGray
    }
}

if ($RemovedCount -eq 0 -and $Errors.Count -eq 0) {
    Write-Host "`n[INFO] No directories to remove. Repository is clean." -ForegroundColor Green
    exit 0
}

Write-Host "`n[STATUS] Removed $RemovedCount directories" -ForegroundColor Cyan
if ($Errors.Count -gt 0) {
    Write-Host "[WARNING] Failed to remove: $($Errors -join ', ')" -ForegroundColor Yellow
}

git status --short

Write-Host "`n[PROMPT] Commit and push these changes? (y/N): " -ForegroundColor Yellow -NoNewline
$Confirm = Read-Host

if ($Confirm -ne "y" -and $Confirm -ne "Y") {
    Write-Host "`n[CANCELLED] Run 'git reset' to unstage changes." -ForegroundColor Red
    exit 0
}

Write-Host "`n[COMMIT] Committing removal..." -ForegroundColor Cyan
git commit -m "fix(public): remove empty implementation directories

- Remove empty backend_agent_api/, backend_rag_pipeline/, frontend/, sql/
- Remove empty .devcontainer/, PRPs/
- Public repository now contains only documentation"

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Commit failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n[PUSH] Pushing to origin/main..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCCESS] Empty directories removed from public repository!" -ForegroundColor Green
} else {
    Write-Host "`n[ERROR] Push failed!" -ForegroundColor Red
    exit 1
}
