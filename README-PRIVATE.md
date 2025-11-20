**📚 PhD APPLICATION PORTFOLIO PROJECT**

> **Purpose**: This repository demonstrates research capabilities in multi-agent systems, retrieval-augmented generation, and production ML engineering for PhD applications (Fall 2026).

> **Status**: Archived for academic review | Not actively maintained

> **Architecture**: Hierarchical multi-agent system with specialized sub-agents, long-term memory (Mem0), and hybrid RAG (vector + SQL + vision)

**📄 For Academic Reviewers**:

- **Research Statement**: See [`docs/structure/PROJECT_STRUCTURE.md`](./docs/structure/PROJECT_STRUCTURE.md) for detailed technical analysis and research contributions
- **Key Documentation**:
  - [`docs/structure/DIRECTORY_STRUCTURE.md`](./docs/structure/DIRECTORY_STRUCTURE.md) - Complete project structure
  - [`docs/structure/PROJECT_STRUCTURE.md`](./docs/structure/PROJECT_STRUCTURE.md) - System architecture and design

**🎓 Research Contributions**:

1. Hierarchical multi-agent coordination with specialized sub-agents
2. Hybrid RAG system (semantic search + SQL generation + image analysis)
3. Production-scale long-term memory with episodic recall
4. Safe tool orchestration (RestrictedPython sandbox, validated SQL)
5. Full-stack deployment (authentication, billing, observability)

**📧 Academic Contact**: ateyaterence@gmail.com | CS PhD Applications Fall 2026

**🔒 Full Implementation**: The complete implementation codebase is maintained in a private repository (`hierarchical-multi-agent-retrieval-system-impl`). Academic reviewers cannot access this repository directly. To request access to the full implementation, contact ateyaterence@gmail.com.

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

- **[Project Structure](./docs/structure/DIRECTORY_STRUCTURE.md)** - Complete directory structure
- **[System Architecture](./docs/structure/PROJECT_STRUCTURE.md)** - System architecture and design
- **[Deployment Guides](./docs/deployment/guides/)** - Platform-specific deployment instructions

### Documentation Structure

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

The complete codebase with full implementation details, test suites, and deployment configurations is maintained in a **private repository** (`hierarchical-multi-agent-retrieval-system-impl`).

**Note**: Academic reviewers cannot access this private repository directly. To request access to the full implementation code, test suites, and deployment configurations, please contact ateyaterence@gmail.com with your academic affiliation and purpose for review.

## 📄 License

This repository is for academic review purposes. All rights reserved.

**Note**: This is a research project portfolio for PhD applications. The public repository contains architecture documentation and research materials. Full implementation details are available upon request for academic reviewers.
