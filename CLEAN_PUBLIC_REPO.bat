@echo off
REM Script to clean public repository - remove all code and config files
cd /d D:\softbrickstech\hierarchical-multi-agent-retrieval-system

echo === Removing prohibited files from git tracking ===

git rm --cached .cursorrules
git rm --cached AGENTS.md
git rm --cached CLAUDE.md
git rm --cached AI_ASSISTANT_SETUP.md
git rm --cached HUMAN_REPO_GUIDELINES.md
git rm --cached .gitignore-public
git rm -r --cached .claude

echo === Removing implementation code directories ===
git rm -r --cached backend_agent_api
git rm -r --cached backend_rag_pipeline
git rm -r --cached frontend
git rm -r --cached sql
git rm -r --cached .devcontainer
git rm -r --cached PRPs

echo === Staging .gitignore and README.md ===
git add .gitignore README.md

echo === Committing changes ===
git commit -m "fix(public): remove all code and config files, documentation only"

echo === Files remaining in repository ===
git ls-files

echo.
echo === Ready to push. Run: git push origin main ===
pause

