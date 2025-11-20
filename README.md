<div align="center">

# Hierarchical Multi-Agent Retrieval System

### **Research Portfolio for PhD Applications (Fall 2026)**

[![Status](https://img.shields.io/badge/Status-Academic%20Review-2563eb?style=for-the-badge)]()
[![Contact](https://img.shields.io/badge/Contact-tateya%40uco.edu-059669?style=for-the-badge)](mailto:tateya@uco.edu)
[![Research](https://img.shields.io/badge/Research-Multi--Agent%20Systems-ea580c?style=for-the-badge)](./docs/structure/ARCHITECTURE.md)

_A production-validated hierarchical multi-agent system demonstrating research capabilities in multi-agent coordination, retrieval-augmented generation, and production-scale ML systems engineering_

---

**Quick Navigation:** [📖 Architecture](./docs/structure/ARCHITECTURE.md) • [📂 Structure](./docs/structure/DIRECTORY_STRUCTURE.md) • [🚀 Deployment](./docs/deployment/guides/) • [📧 Contact](#-contact)

</div>

---

## 📑 Table of Contents

- [Quick Overview](#-quick-overview)
- [Abstract](#-abstract)
- [For Academic Reviewers](#-for-academic-reviewers)
- [Research Contributions](#-research-contributions)
- [System Architecture](#️-system-architecture)
- [Performance Metrics](#-performance-metrics)
- [Research Methodology](#-research-methodology)
- [Future Research Directions](#-future-research-directions)
- [Documentation Structure](#-documentation-structure)
- [Publications & Presentations](#-publications--presentations)
- [Contact](#-contact)
- [License & Usage](#️-license--usage)

---

## ⚡ Quick Overview

<div align="center">

|        Aspect         | Summary                                                                  |
| :-------------------: | :----------------------------------------------------------------------- |
| **🔬 Research Focus** | Hierarchical multi-agent coordination for scalable information retrieval |
| **💡 Key Innovation** | Hybrid RAG combining vector search, SQL generation, and vision analysis  |
|   **✅ Validation**   | Zero security incidents in production deployment                         |
|     **🏗️ Status**     | Production-validated system with full-stack deployment                   |
|     **🔒 Access**     | Architecture public; implementation available upon request               |

</div>

### 🎯 Key Highlights

<div align="center">

|     🏆 Achievement      |        🔬 Innovation        |
| :---------------------: | :-------------------------: |
|  Production Deployment  |  Hierarchical Multi-Agent   |
| Zero Security Incidents |   Hybrid RAG Architecture   |
|    Full-Stack System    | Episodic Memory Integration |

</div>

---

## 📋 Abstract

This repository presents a **hierarchical multi-agent system** for scalable information retrieval from heterogeneous document sources. The system addresses fundamental challenges in multi-agent coordination—specifically, **maintaining semantic coherence across distributed agent interactions** while preserving task decomposition efficiency.

Through hierarchical orchestration patterns and hybrid retrieval mechanisms, the system demonstrates practical solutions to theoretical problems in agent-based information retrieval, validated through production deployment with real users.

### Research Questions Addressed

|   #   | Research Question                                                                                              | Approach                                                                         |
| :---: | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **1** | How can hierarchical agent coordination preserve semantic coherence in task decomposition?                     | Hierarchical orchestration with context propagation mechanisms                   |
| **2** | What hybrid retrieval architectures balance semantic search, structured queries, and multimodal understanding? | Unified framework integrating vector search, SQL generation, and vision analysis |
| **3** | How do episodic memory systems enhance multi-session conversational coherence?                                 | Long-term memory with semantic indexing and temporal decay modeling              |

---

## 🎓 For Academic Reviewers

<table>
<tr>
<td width="40%">

### Applicant Information

**Name:** T Ateya

**Background:** AI Systems Engineer & Machine Learning Researcher (7+ yrs)

**Target:** PhD in CS/Data Science

**Timeline:** Fall 2026

**Focus:** Multi-agent systems, scalable information retrieval, ML engineering

</td>
<td width="60%">

### Documentation Quick Access

| Resource                                                           | Description                                   |
| ------------------------------------------------------------------ | --------------------------------------------- |
| **[System Architecture](./docs/structure/ARCHITECTURE.md)**        | High-level architecture with Mermaid diagrams |
| **[Directory Structure](./docs/structure/DIRECTORY_STRUCTURE.md)** | Complete project organization                 |
| **[Project Organization](./docs/structure/PROJECT_STRUCTURE.md)**  | Structure rationale and principles            |
| **[Deployment Guides](./docs/deployment/guides/)**                 | Platform-specific deployment docs             |

</td>
</tr>
</table>

### 🔒 Implementation Access Protocol

The complete implementation codebase is maintained in a **private repository** (`hierarchical-multi-agent-retrieval-system-impl`) for IP protection during applications.

**To request access**, email **tateya@uco.edu** with:

1. Academic affiliation and position
2. Purpose of review (e.g., PhD application evaluation)
3. Institutional email (for verification)
4. Preferred timeframe

**Subject:** `PhD Application - Multi-Agent Systems Research - Implementation Access`  
**Response time:** 24-48 hours

---

## 🔬 Research Contributions

### 1️⃣ Hierarchical Multi-Agent Coordination

<table>
<tr>
<td width="20%"><strong>Challenge</strong></td>
<td>Traditional flat multi-agent systems struggle with task decomposition complexity and semantic coherence preservation across distributed interactions.</td>
</tr>
<tr>
<td><strong>Contribution</strong></td>
<td>Hierarchical orchestration pattern where a primary agent delegates to specialized sub-agents while maintaining global context coherence through explicit context propagation mechanisms.</td>
</tr>
<tr>
<td><strong>Implementation</strong></td>
<td>
• Primary orchestrator coordinates specialized sub-agents for vision analysis, summarization, document retrieval, SQL query generation, and safe code execution<br>
• Context propagation mechanisms preserving semantic continuity across agent boundaries<br>
• Hierarchical delegation pattern maintaining global context coherence
</td>
</tr>
<tr>
<td><strong>Validation</strong></td>
<td>System maintains coherent responses across complex multi-hop queries in production environment.</td>
</tr>
</table>

### 2️⃣ Hybrid Retrieval Architecture

<table>
<tr>
<td width="20%"><strong>Challenge</strong></td>
<td>Single-modality retrieval systems fail to capture diverse information needs requiring conceptual understanding, precise facts, and visual comprehension across heterogeneous document types.</td>
</tr>
<tr>
<td><strong>Contribution</strong></td>
<td>Unified retrieval framework integrating three complementary modalities with intelligent query routing and coherent result fusion.</td>
</tr>
<tr>
<td><strong>Implementation</strong></td>
<td>
<strong>Semantic Search:</strong> Dense vector retrieval (pgvector) for conceptual similarity<br>
<strong>Structured Queries:</strong> Read-only SQL tools for structured data analysis<br>
<strong>Multimodal Understanding:</strong> Vision analysis for diagram/image comprehension<br>
• Hybrid retrieval pipeline over Supabase/PostgreSQL with pgvector<br>
• Multi-source document ingestion (Google Drive API, local filesystem)<br>
• Semantic chunking with configurable size
</td>
</tr>
<tr>
<td><strong>Validation</strong></td>
<td>Successfully processes diverse document types (text, tables, diagrams, images) from multiple sources (Google Drive, local filesystem) with unified retrieval framework.</td>
</tr>
</table>

### 3️⃣ Production-Scale Episodic Memory

<table>
<tr>
<td width="20%"><strong>Challenge</strong></td>
<td>Conversational AI systems lack persistent, queryable memory across sessions, limiting personalization and long-term context utilization.</td>
</tr>
<tr>
<td><strong>Contribution</strong></td>
<td>Long-term episodic memory system enabling cross-session context persistence and semantically-aware retrieval with privacy preservation.</td>
</tr>
<tr>
<td><strong>Implementation</strong></td>
<td>
• Mem0-based memory architecture with semantic indexing<br>
• Long-term, user-specific memory integrated into agent loop<br>
• Conversation context maintained across sessions while preserving user isolation<br>
• Privacy-preserving memory isolation per user (RLS policies)
</td>
</tr>
<tr>
<td><strong>Validation</strong></td>
<td>Supports coherent multi-session conversations in production deployment.</td>
</tr>
</table>

### 4️⃣ Safe Tool Orchestration

<table>
<tr>
<td width="20%"><strong>Challenge</strong></td>
<td>Agent-generated code execution poses significant security risks in production environments, particularly with user-facing applications requiring safe execution.</td>
</tr>
<tr>
<td><strong>Contribution</strong></td>
<td>Secure sandbox execution environment for agent-generated tools with multi-layered validation and resource constraints.</td>
</tr>
<tr>
<td><strong>Implementation</strong></td>
<td>
• RestrictedPython sandbox for Python code execution<br>
• SQL query validation and parameterization preventing injection attacks<br>
• Resource limitation and timeout mechanisms
</td>
</tr>
<tr>
<td><strong>Validation</strong></td>
<td><strong>Zero security incidents</strong> across full production deployment lifecycle.</td>
</tr>
</table>

### 5️⃣ Production ML Engineering

<table>
<tr>
<td width="20%"><strong>Contribution</strong></td>
<td>Full-stack deployment demonstrating scalable ML system engineering practices from prototype to production.</td>
</tr>
<tr>
<td><strong>Implementation</strong></td>
<td>
• JWT authentication (Supabase)<br>
• Stripe-based billing system<br>
• Server-Sent Events (SSE) streaming<br>
• Docker-based deployment<br>
• Observability using LangFuse<br>
• Modular architecture supporting independent component scaling
</td>
</tr>
<tr>
<td><strong>Validation</strong></td>
<td>Successfully deployed and operated at production scale with real-time performance and production-grade uptime.</td>
</tr>
</table>

---

## 🏗️ System Architecture

### Technology Stack

<table>
<tr>
<th width="15%">Layer</th>
<th width="25%">Technology</th>
<th width="25%">Purpose</th>
<th>Key Features</th>
</tr>
<tr>
<td><strong>Frontend</strong></td>
<td>React + TypeScript</td>
<td>User Interface</td>
<td>SSE streaming, real-time chat, admin dashboard</td>
</tr>
<tr>
<td><strong>Backend API</strong></td>
<td>FastAPI + Pydantic AI</td>
<td>Agent Orchestration</td>
<td>Async processing, hierarchical delegation, tool execution</td>
</tr>
<tr>
<td><strong>RAG Pipeline</strong></td>
<td>LangChain + Vector DB</td>
<td>Document Processing</td>
<td>Multi-modal retrieval, semantic search, SQL generation</td>
</tr>
<tr>
<td><strong>Database</strong></td>
<td>Supabase (PostgreSQL)</td>
<td>Data Persistence</td>
<td>Vector extensions, RLS policies, real-time subscriptions</td>
</tr>
<tr>
<td><strong>Memory</strong></td>
<td>Mem0</td>
<td>Episodic Memory</td>
<td>Long-term context, semantic indexing, temporal decay</td>
</tr>
<tr>
<td><strong>Payments</strong></td>
<td>Stripe</td>
<td>Billing</td>
<td>Token-based usage, subscription management</td>
</tr>
<tr>
<td><strong>Observability</strong></td>
<td>Langfuse</td>
<td>Monitoring</td>
<td>Distributed tracing, performance analytics</td>
</tr>
</table>

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Layer (React/TypeScript)             │
│          Real-time Streaming • Chat Interface • Admin            │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Server-Sent Events (SSE) / HTTP

┌───────────────────────────▼─────────────────────────────────────┐
│                 Backend API Layer (FastAPI)                      │
│                                                                   │
│         ┌───────────────────────────────────────┐               │
│         │   Primary Orchestrator Agent          │               │
│         │   • Task Decomposition                │               │
│         │   • Context Management                │               │
│         │   • Response Synthesis                │               │
│         └────┬─────────────────────────────┬────┘               │
│              │                             │                     │
│    ┌─────────▼────────┐         ┌─────────▼────────┐           │
│    │  Vision Agent    │         │  Language Agent  │           │
│    │  • Image Analysis│         │  • Text Process  │           │
│    │  • OCR           │         │  • Tool Execution│           │
│    └──────────────────┘         └──────────────────┘           │

└───────────────────────────┬─────────────────────────────────────┘
                            │

┌───────────────────────────▼─────────────────────────────────────┐
│                    RAG Pipeline Layer                            │
│                                                                   │
│   ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐      │
│   │   Vector    │  │     SQL      │  │    Document     │      │
│   │   Search    │  │  Generation  │  │   Processing    │      │
│   └─────────────┘  └──────────────┘  └─────────────────┘      │

└───────────────────────────┬─────────────────────────────────────┘
                            │

┌───────────────────────────▼─────────────────────────────────────┐
│                   Data Layer (Supabase + Mem0)                   │
│                                                                   │
│   Documents • Users • Memory • Conversations • Billing • Logs    │
└─────────────────────────────────────────────────────────────────┘
```

### Design Principles

| Principle           | Implementation                                              | Benefit                                |
| ------------------- | ----------------------------------------------------------- | -------------------------------------- |
| **Modularity**      | Independent component deployment with isolated dependencies | Maintainable and testable architecture |
| **Scalability**     | Horizontal scaling at component level                       | Handles growing computational demands  |
| **Observability**   | Comprehensive tracing and monitoring                        | Production debugging and optimization  |
| **Security**        | Multi-layered (RLS, sandboxing, validation)                 | Production-grade security posture      |
| **Maintainability** | Clear separation of concerns                                | Long-term code health and evolution    |

---

## 📊 Performance Metrics

<div align="center">

|          Metric           |        Value         |                            Context                             |
| :-----------------------: | :------------------: | :------------------------------------------------------------: |
|  **📚 Document Sources**  |   **Multi-source**   | Google Drive API and local filesystem (PDF, CSV, images, text) |
|  **⚡ Response Latency**  |    **Real-time**     |                  Server-Sent Events streaming                  |
|   **💰 Billing System**   |   **Token-based**    |             Stripe integration with usage tracking             |
| **🛡️ Security Incidents** |        **0**         |               Across full production deployment                |
| **📈 Deployment Status**  | **Production-ready** |             With authentication and observability              |

</div>

---

## 🧪 Research Methodology

This project follows a **research-through-building** methodology, validating theoretical approaches through production deployment:

```
Problem ID → Design → Implementation → Evaluation → Iteration
     ↓          ↓           ↓              ↓           ↓
Production   Hierarchical  Production    Real-world  Continuous
  needs      patterns      validation     metrics    refinement
```

### Methodology Steps

1. **Problem Identification** — Challenges in multi-agent coordination emerged from production needs in autonomous agent systems

2. **Architectural Design** — Hierarchical patterns designed to address semantic coherence preservation

3. **Implementation** — Production-scale validation of theoretical approaches

4. **Evaluation** — Real-world metrics (user engagement, query success rates, system performance)

5. **Iteration** — Continuous refinement based on production feedback

**Research artifacts available in private repository** — Contact for access to detailed methodology, development journals, and experimental results.

---

## 🔮 Future Research Directions

This project establishes foundations for research directions I aim to pursue in doctoral studies:

<table>
<tr>
<td width="50%" valign="top">

### Theoretical Foundations

- **Formal Analysis:** Can we prove semantic coherence bounds in hierarchical systems?
- **Complexity Theory:** What are the computational complexity limits of agent coordination?
- **Context Propagation:** Mathematical models for optimal context sharing across agents

</td>
<td width="50%" valign="top">

### Applied Systems

- **Scalability:** Practical approaches for agent coordination at scale (10K+ agents)
- **Memory Models:** Advanced episodic memory for long-context AI systems (100K+ tokens)
- **Evaluation:** Frameworks and metrics for assessing multi-agent coherence

</td>
</tr>
</table>

---

## 📚 Documentation Structure

<table>
<tr>
<td width="50%" valign="top">

### Public Repository (This Repo)

✅ **Architecture Documentation**

✅ **System Design & Research Contributions**

✅ **Deployment Guides** (architecture-focused)

✅ **Theoretical Foundations**

</td>
<td width="50%" valign="top">

### Private Repository

🔒 **Implementation Code** (`backend_agent_api/`, `frontend/`)

🔒 **Setup & Configuration** (`SETUP.md`, `.env` templates)

🔒 **Database Schemas** (SQL scripts, migrations)

🔒 **Research Development** (methodology, artifacts)

</td>
</tr>
</table>

**Core Documentation:**

- **[System Architecture](./docs/structure/ARCHITECTURE.md)** — High-level architecture with Mermaid diagrams, workflows, and design patterns

- **[Directory Structure](./docs/structure/DIRECTORY_STRUCTURE.md)** — Complete implementation structure and organization

- **[Project Organization](./docs/structure/PROJECT_STRUCTURE.md)** — Structure rationale and principles

- **[Deployment Guides](./docs/deployment/guides/)** — Platform-specific deployment documentation

---

## 📝 Publications & Presentations

This work is being prepared for submission to relevant venues in multi-agent systems and ML systems engineering. Academic reviewers are welcome to discuss:

- Publication plans and target venues

- Research directions and collaboration opportunities

- PhD research proposals building on this foundation

---

## 📧 Contact

<div align="center">

### Quick Contact

**T Ateya** | AI Systems Engineer & Machine Learning Researcher | PhD Applicant (Fall 2026)

[📧 Academic Email](mailto:tateya@uco.edu) • [📧 Company Email](mailto:softbrickstech@gmail.com) • [🔗 LinkedIn](https://linkedin.com/in/ateya-terence)

**Response Time:** 24-48 hours | **Subject:** `PhD Application - Multi-Agent Systems Research`

</div>

<table>
<tr>
<td width="50%" valign="top">

### Applicant Information

**T Ateya**

AI Systems Engineer & Machine Learning Researcher

PhD Applicant (Fall 2026)

📧 **Academic Email:** tateya@uco.edu

📧 **Company Email:** softbrickstech@gmail.com

📍 **Location:** Oklahoma City, OK, USA

🔗 **LinkedIn:** [View Profile](https://linkedin.com/in/ateya-terence)

</td>
<td width="50%" valign="top">

### Contact Guidelines

**For Academic Inquiries:**

Research methodology, implementation details, or PhD application materials

**Subject Line:**

`PhD Application - Multi-Agent Systems Research`

**Response Time:** 24-48 hours

**Implementation Access:** Include academic affiliation and review purpose

</td>
</tr>
</table>

---

## ⚖️ License & Usage

**Academic Review License** — This repository is maintained for academic review purposes in support of PhD applications.

- ✅ **Permitted:** Academic evaluation, recommendation letters, application review

- ✅ **Citation:** Contact for appropriate citation format if referencing academically

- ❌ **Restricted:** Commercial use, redistribution, derivative works without permission

The complete implementation is proprietary and maintained in a private repository during the application cycle.

---

## 🙏 Acknowledgments

This research was developed independently as part of PhD application portfolio development. The work builds upon and integrates several open-source frameworks and technologies:

**Core Technologies:** Pydantic AI, LangChain, FastAPI, React, Supabase, Mem0, Langfuse

**Special Thanks:** To the open-source communities and frameworks that enabled this research.

---

## 🚀 Next Steps

1. **Review Architecture** → Explore [System Architecture](./docs/structure/ARCHITECTURE.md) diagrams
2. **Request Access** → Email for private repository access
3. **Connect** → Reach out for collaboration or questions

---

<div align="center">

**Ready to explore?** [View Architecture](./docs/structure/ARCHITECTURE.md) • [Request Access](#-contact)

---

**Last Updated:** November 2025

**Version:** 1.0.0 (Academic Review)

**Status:** Archived for PhD Applications (Fall 2026)

---

_Building theoretical foundations for next-generation multi-agent information retrieval systems_

</div>
