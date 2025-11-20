# GitHub Setup Guide for PhD Applications

## Goal
Make this codebase viewable for PhD application committees while discouraging public cloning/distribution.

---

## Recommended Approach: Archive + Clear Documentation

### Step 1: Archive the Repository

1. Go to your GitHub repository
2. Click **Settings** (top navigation)
3. Scroll to **Danger Zone** section
4. Click **"Archive this repository"**
5. Type the repository name to confirm
6. Click **"I understand the consequences, archive this repository"**

**Result:**
- Repository shows "This repository is archived by the owner" banner
- No new issues, PRs, or commits allowed
- Code remains publicly viewable
- Can be unarchived later if needed
- Signals this is a portfolio/reference piece

### Step 2: Add Portfolio Notice to README

Add this section to the top of your main `README.md`:

```markdown
---
**📚 PORTFOLIO PROJECT FOR ACADEMIC REVIEW**

This repository contains a production-scale multi-agent RAG system developed as part of my PhD application portfolio.

**Purpose**: Demonstration of research capabilities in multi-agent systems, RAG architectures, and production ML engineering.

**Status**: Archived for academic review. Not actively maintained.

**Research Context**: See [`research.md`](../academic/research.md) for detailed technical analysis and research contributions.

**For Academic Reviewers**: This codebase demonstrates practical implementation of hierarchical agent coordination, long-term memory systems, and safe tool orchestration. Key files for review:
- `backend_agent_api/agent.py` - Main agent orchestration
- `backend_agent_api/tools.py` - Tool implementations including sub-agents
- `backend_agent_api/agent_api.py` - Production API with streaming
- `research.md` - Research statement and technical analysis

---
```

### Step 3: Create a Landing Page (Optional but Recommended)

Create a simple portfolio page that links to the repository:

**File: `docs/index.html` (can use GitHub Pages)**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PhD Portfolio - Multi-Agent RAG System</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            max-width: 900px;
            margin: 50px auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        .header {
            border-bottom: 2px solid #0366d6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .notice {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
        }
        .cta-button {
            display: inline-block;
            background: #0366d6;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 10px 10px 0;
        }
        .cta-button:hover {
            background: #0256b8;
        }
        .secondary-button {
            background: #6c757d;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Hierarchical Multi-Agent RAG System</h1>
        <p><strong>PhD Application Portfolio</strong> | Applied AI Systems Research</p>
    </div>

    <div class="notice">
        <strong>📚 Academic Portfolio Project</strong><br>
        This project is part of my PhD application portfolio for Fall 2026 admissions.
        It demonstrates practical implementation of multi-agent coordination, retrieval-augmented generation,
        and production ML systems.
    </div>

    <h2>Research Contributions</h2>
    <ul>
        <li><strong>Hierarchical Multi-Agent Architecture</strong> - Orchestrator with specialized sub-agents</li>
        <li><strong>Hybrid RAG System</strong> - Vector search + SQL generation + vision analysis</li>
        <li><strong>Long-Term Memory</strong> - Episodic memory with user isolation (Mem0)</li>
        <li><strong>Safe Tool Orchestration</strong> - Sandboxed code execution and validated queries</li>
        <li><strong>Production Deployment</strong> - Full authentication, billing, and monitoring</li>
    </ul>

    <h2>Technical Stack</h2>
    <p>
        <strong>Backend:</strong> Python, Pydantic AI, FastAPI, PostgreSQL (pgvector)<br>
        <strong>Frontend:</strong> React 18, TypeScript, Vite, Shadcn UI<br>
        <strong>Infrastructure:</strong> Docker, Supabase, Stripe, LangFuse<br>
        <strong>Agent Tools:</strong> Web search, RAG, vision analysis, SQL generation, code execution
    </p>

    <h2>Documentation</h2>
    <a href="https://github.com/[your-username]/[repo-name]" class="cta-button">View Repository →</a>
    <a href="https://github.com/[your-username]/[repo-name]/blob/main/research.md" class="cta-button secondary-button">Read Research Statement →</a>

    <h2>For Academic Reviewers</h2>
    <p>
        This codebase is provided as evidence of research capability in autonomous agent systems.
        Key files for technical evaluation:
    </p>
    <ul>
        <li><code>research.md</code> - Detailed research statement and contributions</li>
        <li><code>backend_agent_api/agent.py</code> - Agent orchestration logic</li>
        <li><code>backend_agent_api/tools.py</code> - Tool implementations and sub-agents</li>
        <li><code>backend_agent_api/agent_api.py</code> - Production API with streaming</li>
    </ul>

    <p style="margin-top: 40px; color: #666; font-size: 14px;">
        © 2025 [Your Name] | For PhD Application Review | Contact: [your-email]
    </p>
</body>
</html>
```

Then enable GitHub Pages:
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main`, Folder: `/docs`
4. Save

### Step 4: Add LICENSE for Academic Use

Create a `LICENSE` file to clarify usage:

```markdown
# Academic Portfolio License

Copyright (c) 2025 [Your Name]

This code is provided as part of a PhD application portfolio for academic review purposes.

## Permitted Use:
- Viewing and evaluating as part of graduate school admissions review
- Reference for educational purposes with proper attribution

## Prohibited Use:
- Commercial use or deployment
- Redistribution or sublicensing
- Removing this license or attribution

For any other use, please contact [your-email].
```

---

## Alternative: Completely Private Repository

If you want maximum control:

### Setup:
1. Make repository **Private**
2. Share code via one of these methods:

**Method A: PDF Documentation**
- Generate code documentation as PDF
- Include in application materials
- Reference GitHub for committee members who want live code

**Method B: Invite Reviewers**
- Ask departments for reviewer GitHub usernames
- Invite with "Read" access
- They can view but not fork (while private)

**Method C: Create Private Gist**
- Upload key files to GitHub Gist (set to secret)
- Share gist link in application
- Harder to discover than public repo

---

## Recommended Final Configuration

### ✅ Best Setup for PhD Applications:

1. **Archive the public repository** (signals "portfolio piece")
2. **Add portfolio notice to README** (clarifies purpose)
3. **Include research.md** (provides academic context)
4. **Add academic license** (discourages commercial use)
5. **Optional: GitHub Pages landing page** (professional presentation)
6. **Share direct links in applications** (e.g., to research.md)

### Why This Works:
- ✅ Code is viewable by anyone (convenient for committees)
- ✅ Archived status signals "reference work, not active project"
- ✅ License discourages unauthorized commercial use
- ✅ Professional presentation shows attention to detail
- ❌ Cannot prevent determined users from cloning, but discourages casual copying

---

## For Your Application Materials

### In Your CV/Resume:
```
Technical Portfolio: Multi-Agent RAG System
• Hierarchical multi-agent architecture with specialized sub-agents (vision, language)
• Production-scale RAG pipeline with vector embeddings and long-term memory
• Full-stack implementation: Python (FastAPI), React, PostgreSQL, Docker
• View project: https://github.com/[your-username]/[repo-name]
• Research statement: https://github.com/[your-username]/[repo-name]/blob/main/research.md
```

### In Your SOP:
```
For a detailed technical portfolio demonstrating my experience with multi-agent
systems and RAG architectures, please see:
https://github.com/[your-username]/[repo-name]/blob/main/research.md
```

### In Application Portals:
```
Technical Portfolio URL: https://github.com/[your-username]/[repo-name]
```

---

## Important Notes

1. **GitHub Cannot Prevent Cloning**: Any public repository can be cloned. Archiving and licensing are signals, not technical barriers.

2. **Academic Integrity**: Most academic reviewers will respect your license and purpose statement.

3. **Private Alternatives**: If you're concerned about public access, use a private repo and invite specific reviewers. However, this may be less convenient for admissions committees.

4. **Best Practice**: Archive + Clear Documentation is the standard approach for portfolio projects in academic applications.

---

## Quick Commands

```bash
# After archiving on GitHub, update your local repo:
git remote update

# To unarchive later (via GitHub web UI only):
# Settings → Danger Zone → Unarchive this repository

# Check repository status:
git remote show origin
```

---

## Questions?

This setup balances visibility (for academic review) with signaling that this is a portfolio piece, not a free-for-all code resource. Most academics will understand and respect this context.
