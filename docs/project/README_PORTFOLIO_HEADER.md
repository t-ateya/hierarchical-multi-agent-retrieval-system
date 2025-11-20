# Portfolio Header for README

Copy and paste this section at the **very top** of your `README.md` file, before all other content:

---

```markdown
---
**📚 PhD APPLICATION PORTFOLIO PROJECT**

> **Purpose**: This repository demonstrates research capabilities in multi-agent systems, retrieval-augmented generation, and production ML engineering for PhD applications (Fall 2026).

> **Status**: Archived for academic review | Not actively maintained

> **Architecture**: Hierarchical multi-agent system with specialized sub-agents, long-term memory (Mem0), and hybrid RAG (vector + SQL + vision)

**📄 For Academic Reviewers**:
- **Research Statement**: See [`research.md`](../academic/research.md) for detailed technical analysis and research contributions
- **Key Files**:
  - [`backend_agent_api/agent.py`](./backend_agent_api/agent.py) - Agent orchestration with sub-agent delegation
  - [`backend_agent_api/tools.py`](./backend_agent_api/tools.py) - Tool implementations (vision sub-agent: line 284)
  - [`backend_agent_api/agent_api.py`](./backend_agent_api/agent_api.py) - Production API with SSE streaming
  - [`backend_rag_pipeline/`](./backend_rag_pipeline/) - Document processing pipeline

**🎓 Research Contributions**:
1. Hierarchical multi-agent coordination with specialized sub-agents
2. Hybrid RAG system (semantic search + SQL generation + image analysis)
3. Production-scale long-term memory with episodic recall
4. Safe tool orchestration (RestrictedPython sandbox, validated SQL)
5. Full-stack deployment (authentication, billing, observability)

**📧 Academic Contact**: [your-email] | CS PhD Applications Fall 2026

---
```

## Instructions:

1. Open your `README.md` file
2. Paste the section above at the **very top** (before the existing title)
3. Replace placeholders:
   - `[your-email]` → Your email address
   - `[your-university]` → Your current institution (if applicable)
4. Commit and push:
   ```bash
   git add README.md
   git commit -m "Add PhD portfolio context to README"
   git push origin main
   ```

## Visual Effect:

This will make your repository immediately identifiable as a PhD application portfolio, which:
- ✅ Sets proper expectations for visitors
- ✅ Highlights research contributions upfront
- ✅ Directs reviewers to key files and research.md
- ✅ Shows professionalism and clear communication
- ✅ Discourages commercial use by clarifying purpose

## Example of What Reviewers Will See:

When someone visits your repository, they'll immediately see:

```
┌─────────────────────────────────────────────────────┐
│ 📚 PhD APPLICATION PORTFOLIO PROJECT                │
│                                                      │
│ Purpose: Research capabilities in multi-agent       │
│ systems for PhD applications (Fall 2026)            │
│                                                      │
│ Status: Archived for academic review                │
│                                                      │
│ For Academic Reviewers:                             │
│ • Research Statement: research.md                   │
│ • Key architecture: Hierarchical multi-agent        │
│ • Contact: [your-email]                             │
└─────────────────────────────────────────────────────┘

# Hierarchical Multi-Agent Retrieval System
[Your existing README continues below...]
```

This immediately frames the context before they read any technical details.
