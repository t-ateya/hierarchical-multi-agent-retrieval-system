@echo off
REM Script to remove ALL implementation code from public repository
cd /d D:\softbrickstech\hierarchical-multi-agent-retrieval-system

echo ========================================
echo REMOVING ALL IMPLEMENTATION CODE FROM PUBLIC REPO
echo ========================================
echo.

echo Step 1: Removing implementation code directories...
git rm -r --cached backend_agent_api 2>nul
git rm -r --cached backend_rag_pipeline 2>nul
git rm -r --cached frontend 2>nul
git rm -r --cached sql 2>nul

echo Step 2: Removing other implementation-related directories...
git rm -r --cached .devcontainer 2>nul
git rm -r --cached PRPs 2>nul

echo Step 3: Removing AI assistant config files...
git rm --cached .cursorrules 2>nul
git rm --cached AGENTS.md 2>nul
git rm --cached CLAUDE.md 2>nul
git rm --cached AI_ASSISTANT_SETUP.md 2>nul
git rm --cached HUMAN_REPO_GUIDELINES.md 2>nul
git rm --cached .gitignore-public 2>nul
git rm -r --cached .claude 2>nul

echo Step 4: Staging updated files...
git add .cursorrules .gitignore README.md

echo.
echo Step 5: Current status...
git status --short

echo.
echo Step 6: Committing changes...
git commit -m "fix(public): remove all implementation code, documentation only

- Remove backend_agent_api/, backend_rag_pipeline/, frontend/, sql/ (implementation code)
- Remove .devcontainer/, PRPs/ (implementation-related)
- Remove .cursorrules, AGENTS.md, CLAUDE.md, .claude/ (AI assistant configs)
- Remove AI_ASSISTANT_SETUP.md, HUMAN_REPO_GUIDELINES.md (internal docs)
- Update .cursorrules to explicitly forbid code directories in public repo
- Public repo now contains ONLY: docs/, research_development/, README.md, .gitignore"

echo.
echo ========================================
echo VERIFICATION: Files remaining in public repo
echo ========================================
git ls-files | findstr /i "docs research_development README .gitignore .env.example .gitattributes"

echo.
echo ========================================
echo READY TO PUSH
echo ========================================
echo Run: git push origin main
echo.
pause

