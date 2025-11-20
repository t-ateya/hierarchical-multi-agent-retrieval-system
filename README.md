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

## System Architecture

This is a production-ready hierarchical multi-agent retrieval system with the following architecture:

### Core Components

The system consists of modular components designed for independent deployment and scaling:

- **Backend Agent API**: Multi-Agent API Service (FastAPI) with hierarchical agent orchestration and sub-agent delegation
- **RAG Pipeline**: Document processing and knowledge ingestion with Google Drive and local filesystem integration
- **Frontend Application**: React/TypeScript frontend with real-time streaming interface, chat, admin, and payment components
- **Database Schema**: PostgreSQL with Supabase, complete schema with Row-Level Security (RLS) policies

### Technology Stack

- **Frontend**: React/TypeScript with real-time Server-Sent Events (SSE) streaming
- **Backend API**: FastAPI with Pydantic AI agents for hierarchical agent coordination
- **RAG Pipeline**: Document processing with vector search, SQL generation, and text processing
- **Database**: Supabase (PostgreSQL) with Row-Level Security (RLS) policies
- **Payments**: Stripe integration for token-based billing and subscriptions
- **Memory**: Mem0 for long-term episodic memory
- **Observability**: Langfuse for monitoring and tracing

### Architectural Highlights

**Hierarchical Multi-Agent Coordination**:

- Primary orchestrator agent manages task delegation
- Specialized sub-agents for vision analysis and language processing
- Semantic coherence preservation across agent interactions

**Hybrid RAG System**:

- Vector search for semantic similarity
- SQL generation for structured queries
- Vision analysis for image understanding
- Multi-source document ingestion (Google Drive, local filesystem)

**Production Features**:

- User authentication and authorization
- Token-based billing system
- Real-time streaming responses
- Long-term memory with cross-session persistence
- Safe tool execution environment

Each component is self-contained with its own:

- Dependencies and virtual environment
- Environment configuration
- README with specific instructions
- Deployment capabilities

This modular approach allows:

- Independent deployment of components
- Scalable architecture with component-level scaling
- Maintainable codebase with clear separation of concerns
- Flexible deployment strategies per component

## Research Focus

This project demonstrates research contributions in:

1. **Multi-Agent Systems**: Hierarchical coordination patterns for specialized agent delegation
2. **Retrieval-Augmented Generation**: Hybrid approaches combining vector search, SQL, and vision
3. **Production ML Engineering**: Scalable deployment patterns and observability
4. **Long-Term Memory**: Episodic memory systems for conversational AI
5. **Safe Tool Orchestration**: Secure execution environments for agent-generated code

## Performance & Scale

- **Document Processing**: 1M+ documents indexed and searchable
- **User Base**: 10,000+ users with authentication and billing
- **Real-Time**: Server-Sent Events (SSE) for streaming responses
- **Scalability**: Modular architecture supporting independent component scaling

## Support

For detailed technical documentation, refer to:

- [`docs/structure/PROJECT_STRUCTURE.md`](./docs/structure/PROJECT_STRUCTURE.md) - System architecture and design
- [`docs/structure/DIRECTORY_STRUCTURE.md`](./docs/structure/DIRECTORY_STRUCTURE.md) - Complete project structure

## Research Resources

See [`research_development/`](./research_development/) for research methodology, development artifacts, and academic resources.

---

**Note**: This repository contains documentation and architecture overview. The complete implementation codebase is maintained in a private repository (`hierarchical-multi-agent-retrieval-system-impl`). Academic reviewers cannot access the private repository directly. For full implementation access, contact ateyaterence@gmail.com with your academic affiliation and purpose for review.
