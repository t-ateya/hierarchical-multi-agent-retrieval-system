# AI Assistant Configuration Guide

> **Purpose**: This guide explains how to use the project rules with different AI coding assistants.
> **Status**: PRIVATE REPOSITORY ONLY - Never commit to public repository

---

## Available Configuration Files

### Universal (Works with All Assistants)
- **`AGENTS.md`** - Universal standard format, works with Claude Code, Cursor, Windsurf, GitHub Copilot, Gemini CLI, and more

### Assistant-Specific
- **`.cursorrules`** - Cursor IDE (most detailed, comprehensive rules)
- **`CLAUDE.md`** - Claude Code (project-specific rules)
- **`.claude/commands/`** - Claude Code slash commands

---

## Setup by Assistant

### Claude Code

**Automatic Loading:**
- `AGENTS.md` is automatically loaded (universal standard)
- `CLAUDE.md` is automatically loaded (project-specific)
- Both files work together

**Slash Commands:**
The `.claude/commands/` directory contains ready-to-use commands:

- `/check-repo` - Verify which repository you're working with
- `/push-public` - Push documentation to public repository
- `/push-private` - Push implementation to private repository
- `/update-readme` - Update README for public or private repo

**Usage:**
1. Open Claude Code in this project
2. Type `/` to see available commands
3. Or type the command name directly: `/check-repo`

**File Hierarchy:**
Claude Code reads files in this order:
1. `./CLAUDE.md` (current directory)
2. `./AGENTS.md` (universal rules)
3. Parent directories (up to repository root)
4. `~/.claude/CLAUDE.md` (home directory - global rules)

### Cursor

**Automatic Loading:**
- `.cursorrules` is automatically loaded
- Most comprehensive rules file
- References `AGENTS.md` for cross-platform compatibility

**Usage:**
1. Open Cursor IDE in this project
2. Rules are automatically loaded
3. AI assistant follows all rules in `.cursorrules`

### Windsurf

**Automatic Loading:**
- `AGENTS.md` is automatically recognized
- Markdown format is readable by Windsurf

**Usage:**
1. Open Windsurf in this project
2. `AGENTS.md` is automatically loaded
3. AI assistant follows the rules

### GitHub Copilot

**Manual Setup:**
- `AGENTS.md` can be referenced
- Copilot reads markdown files in the repository

**Usage:**
1. Reference `AGENTS.md` in your prompts
2. Or ask Copilot to read the file: "Read AGENTS.md and follow the rules"

### Gemini CLI / Other Assistants

**Universal Format:**
- `AGENTS.md` uses standard markdown
- Any assistant that reads markdown can use it

**Usage:**
1. Reference `AGENTS.md` in your prompts
2. Or include it in context: "Follow the rules in AGENTS.md"

---

## Quick Reference

### Most Common Commands

```bash
# Check repository context (use in any assistant)
git remote -v

# Push to public repository
git push origin main

# Push to private repository
git push private main
```

### Claude Code Slash Commands

- `/check-repo` - Check which repository you're working with
- `/push-public` - Push documentation to public repo
- `/push-private` - Push implementation to private repo
- `/update-readme` - Update README file

---

## File Protection

**These files are PRIVATE REPOSITORY ONLY:**
- `.cursorrules`
- `AGENTS.md`
- `CLAUDE.md`
- `HUMAN_REPO_GUIDELINES.md`
- `.claude/commands/`
- `AI_ASSISTANT_SETUP.md` (this file)

**Never:**
- Delete these files
- Commit them to public repository
- Share them publicly

**They are automatically excluded** via `.gitignore-public`

---

## Which File to Use?

| Assistant | Primary File | Secondary File |
|-----------|-------------|----------------|
| **Claude Code** | `AGENTS.md` or `CLAUDE.md` | `.claude/commands/` for slash commands |
| **Cursor** | `.cursorrules` | `AGENTS.md` for reference |
| **Windsurf** | `AGENTS.md` | - |
| **GitHub Copilot** | `AGENTS.md` (reference) | - |
| **Other Assistants** | `AGENTS.md` | - |

---

## Adding New Slash Commands (Claude Code)

To add a new slash command:

1. Create a new `.md` file in `.claude/commands/`
2. Follow the format of existing commands
3. Include:
   - Purpose
   - Command name
   - Pre-flight checks
   - Action steps
   - Expected outcome

Example:
```markdown
# Your Command Name

**Purpose**: What this command does

**Command**: `/your-command` or ask: "..."

**Action**:
```bash
# Your commands here
```

**Expected Outcome**: What should happen
```

---

## Troubleshooting

### Claude Code Not Loading Rules

1. Check that `AGENTS.md` or `CLAUDE.md` exists in project root
2. Restart Claude Code
3. Check Claude Code settings for rules file location

### Slash Commands Not Working

1. Verify `.claude/commands/` directory exists
2. Check that command files are `.md` format
3. Restart Claude Code
4. Type `/` to see available commands

### Rules Not Being Followed

1. Verify the correct file is being used for your assistant
2. Check that the file is in the project root
3. Reference the file explicitly in your prompt
4. For Cursor: Check `.cursorrules` is present

---

**Last Updated**: November 2024
**Maintainer**: Ateya (ateyaterence@gmail.com)

