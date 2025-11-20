# Hierarchical Multi-Agent Retrieval System

> **Research Portfolio for PhD Applications (Fall 2026)**
>
> _Demonstrating research capabilities in multi-agent coordination, retrieval-augmented generation, and production-scale ML systems_

[![Status](https://img.shields.io/badge/Status-Academic%20Review-blue)](https://github.com/t-ateya/hierarchical-multi-agent-retrieval-system)
[![Contact](https://img.shields.io/badge/Contact-ateyaterence%40gmail.com-green)](mailto:ateyaterence@gmail.com)

---

## Abstract

This repository presents a production-validated hierarchical multi-agent system for scalable information retrieval over educational curricula. The system addresses fundamental challenges in multi-agent coordination—specifically, maintaining semantic coherence across distributed agent interactions while preserving task decomposition efficiency. Through hierarchical orchestration patterns and hybrid retrieval mechanisms, the system demonstrates practical solutions to theoretical problems in agent-based information retrieval at scale (1M+ documents, 10,000+ users).

**Key Research Questions Addressed:**

1. How can hierarchical agent coordination preserve semantic coherence in task decomposition?
2. What hybrid retrieval architectures balance semantic search, structured queries, and multimodal understanding?
3. How do episodic memory systems enhance multi-session conversational coherence in production environments?

---

## 🎓 For Academic Reviewers

**Applicant:** Ateya Terence  
**Target Programs:** PhD in Computer Science/Data Science (Fall 2026)  
**Research Interests:** Multi-agent systems, scalable information retrieval, ML systems engineering

### Documentation Structure

- **Research Statement:** [`docs/structure/PROJECT_STRUCTURE.md`](./docs/structure/PROJECT_STRUCTURE.md) – Detailed technical analysis and research contributions
- **System Architecture:** [`docs/structure/DIRECTORY_STRUCTURE.md`](./docs/structure/DIRECTORY_STRUCTURE.md) – Complete implementation structure
- **Development Process:** [`research_development/`](./research_development/) – Research methodology and artifacts

### Implementation Access

The complete implementation is maintained in a private repository (`hierarchical-multi-agent-retrieval-system-impl`). Academic reviewers may request access by contacting **ateyaterence@gmail.com** with:

- Academic affiliation and position
- Purpose of review (e.g., PhD application evaluation)
- Preferred timeframe for review

---

## Research Contributions

### 1. Hierarchical Multi-Agent Coordination

**Challenge:** Traditional flat multi-agent systems struggle with task decomposition complexity and semantic coherence preservation.

**Contribution:** A hierarchical orchestration pattern where a primary agent delegates to specialized sub-agents while maintaining global context coherence.

**Implementation:**

- Primary orchestrator manages task decomposition and response synthesis
- Specialized sub-agents for vision analysis, language processing, and tool execution
- Context propagation mechanisms preserving semantic continuity across agent boundaries

**Validation:** System maintains coherent responses across complex multi-hop queries in production environment (10,000+ users).

### 2. Hybrid Retrieval Architecture

**Challenge:** Single-modality retrieval systems (pure vector search or SQL) fail to capture diverse information needs in educational contexts.

**Contribution:** Unified retrieval framework integrating three complementary modalities:

- **Semantic search:** Dense vector retrieval for conceptual similarity
- **Structured queries:** SQL generation for precise factual extraction
- **Multimodal understanding:** Vision analysis for diagram/image comprehension

**Implementation:**

- Unified query routing mechanism selecting optimal retrieval strategy
- Multi-source document ingestion (Google Drive, local filesystem)
- Coherent fusion of retrieval results across modalities

**Validation:** Successfully processes 1M+ educational documents with diverse content types (text, tables, diagrams).

### 3. Production-Scale Episodic Memory

**Challenge:** Conversational AI systems lack persistent, queryable memory across sessions, limiting personalization and context utilization.

**Contribution:** Long-term episodic memory system enabling cross-session context persistence and retrieval.

**Implementation:**

- Mem0-based memory architecture with semantic indexing
- Session-aware memory retrieval with temporal decay modeling
- Privacy-preserving memory isolation per user

**Validation:** Supports coherent multi-session conversations for 10,000+ users in production deployment.

### 4. Safe Tool Orchestration

**Challenge:** Agent-generated code execution poses security risks in production environments.

**Contribution:** Secure sandbox execution environment for agent-generated tools.

**Implementation:**

- RestrictedPython sandbox for Python code execution
- SQL query validation and parameterization preventing injection attacks
- Resource limitation and timeout mechanisms

**Validation:** Zero security incidents across 10,000+ users and production deployment.

### 5. Production ML Engineering

**Contribution:** Full-stack deployment demonstrating scalable ML system engineering.

**Implementation:**

- User authentication and authorization (Row-Level Security)
- Token-based billing system (Stripe integration)
- Real-time streaming with Server-Sent Events (SSE)
- Observability infrastructure (Langfuse monitoring)
- Modular architecture supporting independent component scaling

**Validation:** Successfully deployed and operated at production scale.

---

## System Architecture

### Technology Stack

| Component         | Technology            | Purpose                                     |
| ----------------- | --------------------- | ------------------------------------------- |
| **Frontend**      | React/TypeScript      | Real-time chat interface with SSE streaming |
| **Backend API**   | FastAPI + Pydantic AI | Multi-agent orchestration and delegation    |
| **RAG Pipeline**  | LangChain + Vector DB | Document processing and retrieval           |
| **Database**      | Supabase (PostgreSQL) | Persistent storage with RLS policies        |
| **Memory**        | Mem0                  | Long-term episodic memory                   |
| **Payments**      | Stripe                | Token-based billing system                  |
| **Observability** | Langfuse              | Tracing and performance monitoring          |

### Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React/TS)                      │
│              Real-time Streaming • Chat • Admin              │
└─────────────────────┬───────────────────────────────────────┘
                      │ SSE/HTTP
┌─────────────────────▼───────────────────────────────────────┐
│                  Backend API (FastAPI)                       │
│         ┌─────────────────────────────────────┐             │
│         │   Primary Orchestrator Agent         │             │
│         └───┬─────────────────────────────┬───┘             │
│             │                             │                  │
│    ┌────────▼────────┐         ┌─────────▼────────┐        │
│    │  Vision Agent   │         │  Language Agent  │        │
│    └─────────────────┘         └──────────────────┘        │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  RAG Pipeline                                │
│  Vector Search • SQL Generation • Document Processing        │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              Data Layer (Supabase + Mem0)                    │
│     Documents • Users • Memory • Conversations • Billing     │
└─────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Modularity:** Each component is independently deployable with isolated dependencies
2. **Scalability:** Horizontal scaling at component level
3. **Observability:** Comprehensive tracing and monitoring
4. **Security:** Multi-layered security (RLS, sandboxing, validation)
5. **Maintainability:** Clear separation of concerns with comprehensive documentation

---

## Performance Metrics

| Metric                  | Value            | Context                           |
| ----------------------- | ---------------- | --------------------------------- |
| **Documents Processed** | 1M+              | Educational curriculum materials  |
| **Active Users**        | 10,000+          | Production deployment             |
| **Response Latency**    | Real-time        | Server-Sent Events streaming      |
| **Uptime**              | Production-grade | With authentication and billing   |
| **Security Incidents**  | 0                | Across full production deployment |

---

## Research Methodology

This project follows a **research-through-building** methodology:

1. **Problem Identification:** Challenges in multi-agent coordination emerged from production needs in educational AI systems
2. **Architectural Design:** Hierarchical patterns designed to address semantic coherence preservation
3. **Implementation:** Production-scale validation of theoretical approaches
4. **Evaluation:** Real-world metrics (user engagement, query success rates, system performance)
5. **Iteration:** Continuous refinement based on production feedback

See [`research_development/`](./research_development/) for detailed research artifacts, development journals, and experimental results.

---

## Future Research Directions

This project establishes foundations for several research directions I aim to pursue in doctoral studies:

1. **Theoretical Foundations:** Formal analysis of semantic coherence preservation in hierarchical multi-agent systems
2. **Scalability:** Theoretical limits and practical approaches for scaling agent coordination
3. **Memory Architectures:** Advanced episodic memory models for long-context AI systems
4. **Evaluation Frameworks:** Metrics and methodologies for assessing multi-agent system coherence

---

## Documentation

### Core Documentation

- [**Project Structure**](./docs/structure/PROJECT_STRUCTURE.md) – System architecture and research contributions
- [**Directory Structure**](./docs/structure/DIRECTORY_STRUCTURE.md) – Complete codebase structure
- [**Research Development**](./research_development/) – Research methodology and artifacts

### Deployment Guides

- [**Deployment Guides**](./docs/deployment/guides/) – Platform-specific deployment instructions

---

## Publications & Presentations

This work is being prepared for submission to relevant venues in multi-agent systems and ML systems engineering. Academic reviewers are welcome to discuss publication plans and research directions.

---

## Contact

**Ateya Terence**  
Machine Learning Engineer | PhD Applicant (Fall 2026)  
Email: ateyaterence@gmail.com  
Location: Oklahoma City, Oklahoma, USA

**Academic Inquiry:** For questions about research methodology, implementation details, or PhD application materials, please contact via email with subject line "PhD Application - Multi-Agent Systems Research."

**Implementation Access:** To request access to the private implementation repository, include your academic affiliation and review purpose.

---

## License & Usage

This repository is maintained for academic review purposes. The documentation and architectural descriptions are provided to support PhD applications and demonstrate research capabilities. The complete implementation is proprietary and maintained separately.

**Academic Use:** Reviewers may reference this work in application evaluations and recommendation letters.  
**Citation:** If referencing this work academically, please contact for appropriate citation format.

---

## Acknowledgments

This research was developed independently as part of PhD application portfolio development. The work builds upon and integrates several open-source frameworks and technologies (Pydantic AI, LangChain, FastAPI, React), and I am grateful to their respective communities.

Special thanks to educators and students in Cameroon whose needs and feedback shaped the educational focus of this research.

---

**Last Updated:** November 2024  
**Version:** 1.0.0 (Academic Review)  
**Status:** Archived for PhD applications (Fall 2026)
