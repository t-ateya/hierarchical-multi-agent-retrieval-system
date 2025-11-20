# 🚨 PRIVATE: Dual-Repository Management Guide
# ⚠️ NEVER COMMIT THIS FILE TO PUBLIC REPOSITORY

---

## 🎯 Repository Setup

### Remote Configuration
```bash
origin  = PUBLIC repository (PhD applications - documentation only)
private = PRIVATE repository (full implementation - all code)
```

### Initial Setup Commands
```bash
cd /path/to/hierarchical-multi-agent-retrieval-system

# Add public repository as 'origin' (default)
git remote add origin git@github.com:t-ateya/hierarchical-multi-agent-retrieval-system.git

# Add private repository as 'private'
git remote add private git@github.com:t-ateya/hierarchical-multi-agent-retrieval-system-impl.git

# Verify configuration
git remote -v
```

---

## 📋 Quick Decision Matrix

| What I Changed | Which Remote? | Command |
|----------------|---------------|---------|
| Documentation (*.md) | PUBLIC | `git push origin main` |
| Diagrams/Research papers | PUBLIC | `git push origin main` |
| Python signatures only | PUBLIC | `git push origin main` |
| Implementation code | PRIVATE | `git push private main` |
| Tests (*_test.py) | PRIVATE | `git push private main` |
| requirements.txt | PRIVATE | `git push private main` |
| .env, credentials | PRIVATE | `git push private main` |

---

## ⚡ Most Common Workflows

### 1. Updated Documentation
```bash
# Modified: docs/academic/architecture.md or README.md
git add docs/ README.md
git commit -m "docs(architecture): expand multi-agent design"
git push origin main  # PUBLIC only
```

### 2. Fixed Implementation Bug
```bash
# Modified: backend_agent_api/agents/orchestrator.py (with code)
git add backend_agent_api/agents/orchestrator.py tests/
git commit -m "fix(orchestrator): resolve routing deadlock"
git push private main  # PRIVATE only
```

### 3. Added Research Paper
```bash
# Added: research_development/papers/coordination.pdf
git add research_development/papers/
git commit -m "research(papers): add coordination analysis"
git push origin main  # PUBLIC only
```

### 4. Updated Dependencies
```bash
# Modified: requirements.txt
git add requirements.txt
git commit -m "deps: update pydantic to 2.10"
git push private main  # PRIVATE only
```

### 5. Both Docs AND Code Changed
```bash
# Modified: docs/research.md + src/agents/orchestrator.py

# Option A: Separate commits (recommended)
git add docs/research.md
git commit -m "docs(research): update theoretical foundations"
git push origin main  # PUBLIC

git add src/agents/orchestrator.py
git commit -m "feat(orchestrator): implement new routing"
git push private main  # PRIVATE

# Option B: Single commit, separate pushes
git add .
git commit -m "refactor: update coordination system

- Update research documentation
- Implement improved routing
- Add benchmarks"

git push origin main   # PUBLIC (only gets docs via .gitignore)
git push private main  # PRIVATE (gets everything)
```

---

## 🛡️ Pre-Push Safety Checklist

### Before EVERY push:
```bash
# 1. Check which remote you're targeting
git remote -v

# 2. Review what files changed
git status
git diff --name-only

# 3. Verify the files are appropriate for the target repo
```

### Before pushing to PUBLIC (origin):
```
☐ No .env, .key, .pem files
☐ No *_test.py files
☐ No requirements.txt or lock files
☐ Python files have ONLY signatures (no implementations)
☐ Commit message is professional/academic
☐ Content explains architecture, not implementation
```

### Before pushing to PRIVATE (private):
```
☐ Tests pass locally (if applicable)
☐ No hardcoded credentials in code
☐ .env file is in .gitignore
```

---

## 📂 File Routing Reference

### PUBLIC Repository (origin) - Documentation Only

**Always Safe to Push:**
```
✅ docs/**/*.md               (all documentation)
✅ research_development/**    (papers, diagrams, benchmarks)
✅ README.md                  (overview version)
✅ *.png, *.jpg, *.svg        (diagrams)
✅ *.pdf                      (research papers)
✅ LICENSE, CONTRIBUTING.md
```

**Structure Files Only:**
```
✅ *.py with signatures       (class definitions with 'pass')
✅ *.yaml, *.json             (commented templates)
```

**Example of allowed Python:**
```python
class OrchestratorAgent:
    def __init__(self, config: Dict):
        """Initialize orchestrator."""
        pass
    
    def route_task(self, query: str) -> str:
        """Route task to sub-agent."""
        pass
```

### PRIVATE Repository (private) - Everything

**Must Push Here:**
```
❌ *.py with implementations   (actual code)
❌ *_test.py, conftest.py     (tests)
❌ requirements.txt, *.lock    (dependencies)
❌ .env.example (real structure)
❌ docker-compose.yml (full config)
❌ /tests/, /config/          (implementation details)
```

**Build Artifacts (Never Commit):**
```
❌ __pycache__/, *.pyc
❌ .pytest_cache/
❌ /dist/, /build/
```

---

## 🔧 Shell Aliases (Add to ~/.bashrc or ~/.zshrc)

```bash
# Quick remote check
alias git-check='git remote -v'

# Push to PUBLIC repository
alias push-public='echo "📤 Pushing to PUBLIC (origin)..." && git remote -v && git push origin $(git branch --show-current)'

# Push to PRIVATE repository  
alias push-private='echo "🔒 Pushing to PRIVATE (private)..." && git remote -v && git push private $(git branch --show-current)'

# Preview what will be pushed
alias push-preview='echo "=== PUBLIC (origin) ===" && git diff origin/$(git branch --show-current) --name-only && echo "\n=== PRIVATE (private) ===" && git diff private/$(git branch --show-current) --name-only'

# Safe push with confirmation
alias push-safe='git-check && echo "\nFiles changed:" && git diff --name-only && echo "\nPress Enter to continue or Ctrl+C to cancel" && read && echo "Push to which remote? (origin/private): " && read remote && git push $remote $(git branch --show-current)'
```

**Usage after adding:**
```bash
source ~/.bashrc  # or source ~/.zshrc
push-public      # Push to PUBLIC repo
push-private     # Push to PRIVATE repo
```

---

## 🚨 Emergency Recovery

### Accidentally Pushed to Wrong Repository

**Step 1: Delete the pushed branch immediately**
```bash
# If you pushed to wrong remote
git push [wrong-remote] --delete [branch-name]

# Example: Pushed private code to public repo
git push origin --delete feature/new-algorithm
```

**Step 2: Restore correct state**
```bash
# Fetch from correct remote
git fetch private

# Reset local branch
git reset --hard private/main

# Push to correct remote
git push origin main --force  # If public needs correction
```

### Exposed Credentials in Public Repo

**IMMEDIATE ACTIONS:**
```bash
# 1. Delete the exposed commit/branch
git push origin --delete [branch-name]

# 2. Rotate ALL exposed credentials
- Change API keys in provider dashboards
- Regenerate tokens
- Update .env file locally
- Update deployment configs

# 3. Audit entire repository history
git log -p | grep -i "api_key\|password\|secret\|token"

# 4. Check all files for sensitive patterns
git ls-tree -r HEAD --name-only | xargs grep -l "api_key\|password"
```

**Consider repository deletion if:**
- Credentials were exposed for >1 hour
- Repository was forked/cloned
- Sensitive user data was exposed

---

## 📊 Repository Status Check Script

Save as `check-repo.sh`:
```bash
#!/bin/bash

echo "🔍 Repository Status Check"
echo "=========================="
echo ""

echo "📍 Current Branch:"
git branch --show-current
echo ""

echo "🔗 Configured Remotes:"
git remote -v | grep -E "(origin|private)"
echo ""

echo "📝 Uncommitted Changes:"
git status --short
echo ""

echo "📦 Changed Files (staged):"
git diff --cached --name-only
echo ""

echo "📦 Changed Files (unstaged):"
git diff --name-only
echo ""

echo "🎯 Last Commit:"
git log -1 --oneline
echo ""

echo "✅ REMINDERS:"
echo "  - origin  = PUBLIC (docs only)"
echo "  - private = PRIVATE (full code)"
echo ""
```

**Make executable and use:**
```bash
chmod +x check-repo.sh
./check-repo.sh  # Run before any push
```

---

## 🎓 PhD Application Context

### What Goes in PUBLIC Repository (origin)

**Purpose:** Showcase for PhD admissions committees

**Target Audience:**
- Faculty at UT Austin, Texas A&M, Rice, UW-Madison, Georgia Tech
- PhD admissions committees
- Academic researchers

**Content Focus:**
- System architecture and design rationale
- Research contributions and novel approaches
- Theoretical foundations
- Performance metrics (1M+ docs, 10K+ users)
- Production lessons learned

**What They Should See:**
- Professional documentation
- Clear system design
- Research potential
- Production engineering maturity

**What They Should NOT See:**
- This workflow guide!
- Internal notes and TODOs
- Implementation details
- Test code
- Dependency files

### Private Repository Access

**For Academic Reviewers:**
- Email: ateyaterence@gmail.com
- Response time: <24 hours
- Method: GitHub collaborator invite
- Terms: Academic use only, no redistribution

---

## ✅ Pre-Submission Checklist

Before sharing PUBLIC repository with applications:

```
☐ All documentation is complete and professional
☐ Architecture diagrams are clear
☐ README explains system at high level
☐ No HUMAN_REPO_GUIDELINES.md in public repo
☐ No workflow notes or internal guides
☐ No credentials anywhere in history
☐ All Python files in public are structure-only
☐ Research papers and benchmarks included
☐ Commit history is clean (no "WIP", "temp" commits)
☐ Academic access email is in README
☐ Repository description mentions PhD application
```

---

## 💡 Tips & Best Practices

### Daily Workflow
1. Always start: `git remote -v` (know where you are)
2. Make changes
3. Check: `git status` and `git diff --name-only`
4. Stage: `git add [specific files]` (be selective!)
5. Commit: Use professional message format
6. Push: Double-check remote before pushing

### Commit Message Format
```
type(scope): brief description

- Detailed explanation
- Why this change matters
- References to related work (for docs)
```

**Examples:**
```bash
# For PUBLIC (origin)
git commit -m "docs(architecture): add hierarchical coordination design

- Explain orchestrator pattern and agent communication
- Include complexity analysis
- Reference related work in distributed systems"

# For PRIVATE (private)
git commit -m "feat(orchestrator): implement priority-based routing

- Add priority queue for task management
- Optimize for low-latency queries
- Include comprehensive tests"
```

### When in Doubt
- **Don't push yet**
- Run `git diff --name-only`
- Review each file's content
- Ask: "Would a PhD committee need to see this implementation?"
- If no → private repo only
- If yes but it's code → structure it (signatures only) for public

---

## 🎯 Common Scenarios Quick Reference

| Scenario | Command |
|----------|---------|
| Updated README with architecture | `git push origin main` |
| Added architecture diagram | `git push origin main` |
| Fixed bug in agent code | `git push private main` |
| Updated requirements.txt | `git push private main` |
| Added research paper | `git push origin main` |
| Created new test file | `git push private main` |
| Updated deployment docs | `git push origin main` |
| Modified .env.example | `git push private main` |

---

## 📞 Quick Reference Summary

**Public Repo (origin)**
- **URL**: git@github.com:t-ateya/hierarchical-multi-agent-retrieval-system.git
- **Purpose**: PhD applications showcase
- **Content**: Documentation, architecture, research
- **Command**: `git push origin main`

**Private Repo (private)**
- **URL**: git@github.com:t-ateya/hierarchical-multi-agent-retrieval-system-impl.git
- **Purpose**: Full implementation
- **Content**: All code, tests, configs
- **Command**: `git push private main`

**Critical Files to NEVER Commit to Public:**
- `HUMAN_REPO_GUIDELINES.md` (this file!)
- `*_WORKFLOW*.md`
- `PRIVATE_*.md`
- `.env`, `.key`, credentials

**Add to `.gitignore` in public repo:**
```gitignore
HUMAN_REPO_GUIDELINES.md
*_WORKFLOW*.md
PRIVATE_*.md
```

---

**Remember**: This file is YOUR reference. PhD committees should never see it.

**Last Updated**: November 2024 for Fall 2026 PhD Applications

