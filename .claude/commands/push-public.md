# Push to Public Repository

**Purpose**: Push documentation and architecture updates to public repository for PhD applications.

**Command**: `/push-public` or ask: "Push documentation to public repo"

**Pre-Flight Checks**:
```bash
# 1. Verify repository context
git remote -v  # Should show origin = public repo

# 2. Check what will be pushed
git diff --name-only

# 3. Verify no implementation files
# Should NOT see: *_test.py, requirements.txt, .env, implementation code
```

**Allowed Content**:
- ✅ Documentation (`*.md`, `*.pdf`)
- ✅ Architecture diagrams
- ✅ Research papers
- ✅ Python structure files (signatures only)
- ✅ README.md (from README-PUBLIC.md)

**Prohibited Content**:
- ❌ Implementation code
- ❌ Test files
- ❌ Dependencies
- ❌ Credentials
- ❌ Setup instructions

**Command**:
```bash
git add docs/ README.md *.md
git commit -m "docs(scope): brief description"
git push origin main
```

