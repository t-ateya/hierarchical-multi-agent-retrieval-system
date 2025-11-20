# Push to Private Repository

**Purpose**: Push full implementation code to private repository.

**Command**: `/push-private` or ask: "Push implementation to private repo"

**Pre-Flight Checks**:
```bash
# 1. Verify repository context
git remote -v  # Should show private = private repo

# 2. Check what will be pushed
git diff --name-only

# 3. Verify no credentials in code
# Check for hardcoded API keys, passwords, secrets
```

**Allowed Content**:
- ✅ Everything - full codebase
- ✅ Implementation code
- ✅ Test files
- ✅ Dependencies
- ✅ Configuration files (but not .env with real values)
- ✅ Setup instructions

**Command**:
```bash
git add .
git commit -m "feat(scope): brief description"
git push private main
```

