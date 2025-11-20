# Claude Code Rules - Hierarchical Multi-Agent Retrieval System

> **For Claude Code**: This file provides project-specific rules for Claude Code.
> **Cross-Platform**: See `AGENTS.md` for universal rules that work with all assistants.
> **Status**: PRIVATE REPOSITORY ONLY - Never commit to public repository

---

## Project Context

**Repository Type**: Dual-repository strategy (public for docs, private for code)
**Purpose**: PhD application research artifact (Fall 2026)
**Research Focus**: Hierarchical multi-agent systems with RAG

---

## Core Principles

- **Never modify existing code** without explicit approval
- **Always check repository context**: `git remote -v` before any operation
- **Public repo (origin)**: Documentation only, no implementations
- **Private repo (private)**: Full codebase with all implementations
- **Never delete**: `.cursorrules`, `AGENTS.md`, `CLAUDE.md`, `HUMAN_REPO_GUIDELINES.md`

---

## Repository Detection

Before ANY git operation:
```bash
git remote -v
```

- `origin` = Public repository (documentation only)
- `private` = Private repository (full implementation)

---

## File Routing

### Public Repository (origin)
- Push: `git push origin main`
- Content: Documentation, architecture, research papers
- Python files: Structure only (signatures with `pass`)

### Private Repository (private)
- Push: `git push private main`
- Content: Everything - implementations, tests, configs

---

## README Management

- `README-PUBLIC.md` → Copy to `README.md` for public repo
- `README.md` in private = Full setup instructions
- `SETUP.md` = Detailed setup (private only)

**When updating README:**
1. Check repository context
2. For public: Update `README-PUBLIC.md`, copy to `README.md`
3. For private: Update `README.md` or `SETUP.md`

---

## Protected Files

These files are PRIVATE REPOSITORY ONLY and should NEVER be deleted:
- `.cursorrules` - Cursor-specific rules
- `AGENTS.md` - Universal assistant rules
- `CLAUDE.md` - This file (Claude Code rules)
- `HUMAN_REPO_GUIDELINES.md` - Human workflow reference

---

## Quick Commands

Use slash commands (if configured in `.claude/commands/`) or reference these patterns:

### Check Repository
```bash
git remote -v
```

### Push Documentation (Public)
```bash
git push origin main
```

### Push Implementation (Private)
```bash
git push private main
```

---

## PhD Application Notes

- Target: UT Austin, Texas A&M, Rice, UW-Madison, Georgia Tech
- Metrics: 1M+ docs, 10K+ users
- Contact: ateyaterence@gmail.com for academic access

---

**See Also**: 
- `AGENTS.md` - Universal rules for all assistants
- `.cursorrules` - Detailed Cursor-specific rules
- `HUMAN_REPO_GUIDELINES.md` - Human workflow reference

