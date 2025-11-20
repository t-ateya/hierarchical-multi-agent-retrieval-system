**📚 PhD APPLICATION PORTFOLIO PROJECT**

> **Purpose**: This repository demonstrates research capabilities in multi-agent systems, retrieval-augmented generation, and production ML engineering for PhD applications (Fall 2026).

> **Status**: Archived for academic review | Not actively maintained

> **Architecture**: Hierarchical multi-agent system with specialized sub-agents, long-term memory (Mem0), and hybrid RAG (vector + SQL + vision)

**📄 For Academic Reviewers**:

- **Research Statement**: See [`docs/academic/research.md`](./docs/academic/research.md) for detailed technical analysis and research contributions
- **Key Files**:
  - [`backend_agent_api/agent.py`](./backend_agent_api/agent.py) - Agent orchestration with sub-agent delegation (structure only)
  - [`backend_agent_api/tools.py`](./backend_agent_api/tools.py) - Tool implementations (structure only)
  - [`backend_agent_api/agent_api.py`](./backend_agent_api/agent_api.py) - Production API structure
  - [`backend_rag_pipeline/`](./backend_rag_pipeline/) - Document processing pipeline structure

**🎓 Research Contributions**:

1. Hierarchical multi-agent coordination with specialized sub-agents
2. Hybrid RAG system (semantic search + SQL generation + image analysis)
3. Production-scale long-term memory with episodic recall
4. Safe tool orchestration (RestrictedPython sandbox, validated SQL)
5. Full-stack deployment (authentication, billing, observability)

**📧 Academic Contact**: ateyaterence@gmail.com | CS PhD Applications Fall 2026

**🔒 Full Implementation**: Available upon request for academic reviewers. Contact ateyaterence@gmail.com for access to the complete codebase.

---

# Hierarchical Multi-Agent Retrieval System

## 🎯 Project Overview

This repository contains a production-ready hierarchical multi-agent system with retrieval-augmented generation capabilities. The system demonstrates advanced multi-agent coordination, scalable RAG architecture, and production engineering practices.

**Production Metrics**:

- 1M+ documents processed
- 10,000+ users served
- Real-time streaming with Server-Sent Events (SSE)
- Token-based billing system with Stripe integration

## 📚 Documentation Navigation

### Quick Links

- **[Research Overview](./docs/academic/research.md)** - Main research document and technical analysis
- **[Getting Started](./docs/project/START_HERE.md)** - Project overview and navigation guide
- **[Project Structure](./docs/structure/DIRECTORY_STRUCTURE.md)** - Complete directory structure
- **[Agent Architecture](./docs/academic/AGENTS.md)** - Multi-agent system architecture
- **[Deployment Guides](./docs/deployment/guides/)** - Platform-specific deployment instructions

### Documentation Structure

- **Academic Documentation** (`docs/academic/`) - Research methodology, architecture, and development processes
- **Project Documentation** (`docs/project/`) - Setup guides, project overview, and submission materials
- **Structure Documentation** (`docs/structure/`) - Directory structure and organization
- **Deployment Documentation** (`docs/deployment/`) - Deployment guides for various platforms

For complete documentation structure, see [DIRECTORY_STRUCTURE.md](./docs/structure/DIRECTORY_STRUCTURE.md).

## 🏗️ System Architecture

### Core Components

1. **Hierarchical Agent Orchestrator**

   - Main orchestrator agent coordinates specialized sub-agents
   - Sub-agents handle specific domains (code, research, analysis)
   - Semantic coherence preservation across agent interactions

2. **Hybrid RAG Pipeline**

   - Vector search for semantic similarity
   - SQL generation for structured queries
   - Vision capabilities for image analysis
   - Multi-modal document processing

3. **Long-Term Memory System**

   - Mem0 integration for episodic memory
   - Conversation context preservation
   - User preference learning

4. **Production Infrastructure**
   - FastAPI backend with async support
   - React/TypeScript frontend
   - Supabase (PostgreSQL) for data persistence
   - Docker containerization
   - Caddy reverse proxy

### Technology Stack

- **Backend**: FastAPI, Python 3.11+, LangChain, Mem0
- **Frontend**: React, TypeScript, Vite
- **Database**: Supabase (PostgreSQL) with vector extensions
- **Deployment**: Docker, Docker Compose, Caddy
- **Observability**: Optional LangFuse integration

## 🎓 Research Contributions

This project demonstrates several key research contributions:

1. **Multi-Agent Coordination**: Hierarchical architecture with specialized sub-agents and semantic coherence preservation
2. **Hybrid RAG**: Combining vector search, SQL generation, and vision capabilities
3. **Production Engineering**: Full-stack implementation with authentication, billing, and observability
4. **Memory Systems**: Long-term episodic memory integration for context preservation

## 📧 Academic Contact

For questions about this research project or to request access to the full implementation:

**Email**: ateyaterence@gmail.com  
**Purpose**: CS PhD Applications Fall 2026  
**Institutions**: UT Austin, Texas A&M, Rice, UW-Madison, Georgia Tech

## 🔒 Full Implementation Access

The complete codebase with full implementation details, test suites, and deployment configurations is available in a private repository. Academic reviewers can request access by contacting ateyaterence@gmail.com.

## 📄 License

This repository is for academic review purposes. All rights reserved.

**Note**: This is a research project portfolio for PhD applications. The public repository contains architecture documentation and research materials. Full implementation details are available upon request for academic reviewers.
