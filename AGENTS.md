# AI Assistant Rules - Hierarchical Multi-Agent Retrieval System

> **Universal Configuration**: This file works with Claude Code, Cursor, Windsurf, GitHub Copilot, Gemini CLI, and other AI coding assistants.
> 
> **Source**: This is the cross-platform version. For Cursor-specific rules, see `.cursorrules`.
> **Status**: PRIVATE REPOSITORY ONLY - Never commit to public repository

---

## Quick Reference

### Repository Context
```bash
# Always check repository context first
git remote -v

# Public repository (origin) = Documentation only
# Private repository (private) = Full implementation
```

### Critical Rules

1. **Never modify existing code** without explicit user approval
2. **Always check repository** before push: `git remote -v`
3. **Public repo = Documentation only** (no implementations)
4. **Private repo = Full code** (everything)
5. **No credentials ever** in any repository
6. **NEVER delete `.cursorrules` or `AGENTS.md`** - Protected configuration files
7. **These files are PRIVATE ONLY** - Never commit to public repository

---

## Repository Strategy

### Public Repository (origin)
- **Purpose**: PhD application showcase, academic review
- **Content**: Documentation, architecture, research papers, structure-only Python files
- **Command**: `git push origin main`

### Private Repository (private)
- **Purpose**: Full implementation with complete codebase
- **Content**: Everything - implementations, tests, configs, credentials
- **Command**: `git push private main`
- **Access**: Available to academic reviewers at ateyaterence@gmail.com

---

## File Organization

### README Files
- `README-PUBLIC.md` → Copy to `README.md` for public repo (architecture-focused)
- `README.md` in private repo = Full setup instructions
- `SETUP.md` = Detailed setup guide (private repo only)

### Protected Files (Never Delete, Private Only)
- `.cursorrules` - Cursor-specific rules
- `AGENTS.md` - This file (universal rules)
- `HUMAN_REPO_GUIDELINES.md` - Human workflow reference
- `.gitignore-public` - Public repository exclusion template

---

## Content Validation

### Public Repository Allowed
- ✅ Documentation (`*.md`, `*.pdf`)
- ✅ Architecture diagrams (`*.png`, `*.svg`)
- ✅ Python structure files (signatures with `pass` only)
- ✅ Research papers and benchmarks

### Public Repository Prohibited
- ❌ Implementation code
- ❌ Test files (`*_test.py`)
- ❌ Dependencies (`requirements.txt`, `*.lock`)
- ❌ Credentials (`.env`, `*.key`)
- ❌ Setup instructions
- ❌ `.cursorrules`, `AGENTS.md`, `HUMAN_REPO_GUIDELINES.md`

---

## Common Workflows

### Update Documentation (Public)
```bash
git remote -v  # Verify: origin = public
git add docs/ README.md
git commit -m "docs(architecture): update design overview"
git push origin main
```

### Update Implementation (Private)
```bash
git remote -v  # Verify: private = private repo
git add .
git commit -m "feat(agents): implement new routing"
git push private main
```

### Update README for Public
```bash
# Update README-PUBLIC.md, then copy to README.md
cp README-PUBLIC.md README.md
git add README.md
git commit -m "docs(readme): update architecture for PhD review"
git push origin main
```

---

## PhD Application Context

**Target Programs**: UT Austin, Texas A&M, Rice, UW-Madison, Georgia Tech

**Research Focus**: Multi-agent systems, scalable information retrieval, distributed AI coordination

**Key Metrics**: 1M+ documents processed, 10,000+ users served

**For Academic Reviewers**: Contact ateyaterence@gmail.com for full implementation access

---

## Assistant-Specific Notes

### Claude Code
- This file (`AGENTS.md`) is automatically loaded
- Can also use `CLAUDE.md` (see below)
- Supports slash commands in `.claude/commands/` directory

### Cursor
- Uses `.cursorrules` file (more detailed)
- This `AGENTS.md` provides cross-platform compatibility

### Windsurf / Other Assistants
- This `AGENTS.md` file works universally
- Markdown format is readable by all assistants

---

**Last Updated**: November 2024 for Fall 2026 PhD Applications
**Maintainer**: Ateya (ateyaterence@gmail.com)

