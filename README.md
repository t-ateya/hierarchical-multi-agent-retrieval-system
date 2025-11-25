<div align="center">

# Hierarchical Multi-Agent Retrieval System

### Research Artifact for PhD Applications in Multi-Agent Systems (Target: Fall 2026)

[![Status](https://img.shields.io/badge/Status-Academic%20Review-2563eb?style=for-the-badge)]()
[![Contact](https://img.shields.io/badge/Contact-tateya%40uco.edu-059669?style=for-the-badge)](mailto:tateya@uco.edu)
[![Research](https://img.shields.io/badge/Research-Multi--Agent%20Retrieval-ea580c?style=for-the-badge)](./docs/structure/ARCHITECTURE.md)

_A hierarchical multi-agent retrieval system demonstrating research capabilities in multi-agent coordination, retrieval-augmented generation, and production-scale ML systems engineering._

> **Academic note:** This repository exposes the **architecture**, **research framing**, and **documentation** of the system. The **full implementation codebase** is maintained in a private companion repository and is available **exclusively for academic review** upon request (see [Implementation Access Protocol](#implementation-access-protocol)).

---

**Quick Navigation:**  
[Overview](#quick-overview) • [Abstract](#abstract) • [Research Questions](#research-questions-addressed) • [Architecture](./docs/structure/ARCHITECTURE.md) • [Directory Structure](./docs/structure/DIRECTORY_STRUCTURE.md) • [Research Contributions](#research-contributions) • [Contact](#contact)

</div>

---

## For Busy Academic Reviewers

If you have limited time, a suggested review path is:

1. Read the **[System Architecture](./docs/structure/ARCHITECTURE.md)** (2–3 minutes).
2. Skim **[Project Directory Structure](./docs/structure/DIRECTORY_STRUCTURE.md)** to gauge implementation scope.
3. Email me if you would like **temporary read access** to the private implementation repository for deeper technical review.

---

## Quick Overview

<div align="center">

| Aspect                | Summary                                                                      |
| --------------------- | ---------------------------------------------------------------------------- |
| 🔬 **Research Focus** | Hierarchical multi-agent coordination for scalable information retrieval     |
| 💡 **Key Idea**       | Hybrid RAG combining vector search, SQL generation, and vision analysis      |
| ✅ **Validation**     | Deployed with real users, monitored with observability tooling               |
| 🏗️ **Status**         | Production-validated system with full-stack implementation                   |
| 🔒 **Access**         | Architecture and documentation public; implementation available upon request |

</div>

### Key Highlights

<div align="center">

| 🏆 Deployment Aspect      | 🔬 Research Capability             |
| ------------------------- | ---------------------------------- |
| Production deployment     | Hierarchical multi-agent control   |
| Safe tool execution       | Hybrid RAG over heterogeneous data |
| Full-stack implementation | Episodic memory integration        |

</div>

---

## Abstract

This repository documents a **hierarchical multi-agent system** for scalable information retrieval from heterogeneous document sources. The system is designed to address challenges in multi-agent coordination, particularly **maintaining semantic coherence across agent boundaries** while preserving efficiency in task decomposition and retrieval.

Through hierarchical orchestration and hybrid retrieval mechanisms (semantic search, structured queries, and multimodal analysis), the system provides a **practical platform for investigating theoretically motivated questions** in:

- multi-agent coordination,
- retrieval-augmented generation, and
- long-term episodic memory in interactive systems.

This system serves as the empirical and engineering foundation for my PhD research agenda across multiple institutions. The core research questions addressed by this system are detailed in the [Research Questions Addressed](#research-questions-addressed) section below.

(Note: The precise wording of these questions may vary by program to align with specific research priorities, but they represent the core theoretical challenges investigated through this system.)

---

## Research Questions Addressed

This system provides an empirical foundation for investigating the following research questions:

**RQ1: Semantic Preservation in Hierarchical Retrieval**

How can hierarchical multi-agent systems maintain semantic coherence across agent boundaries while performing hybrid retrieval over heterogeneous document sources?

**RQ2: Communication-Efficient Multi-Agent Coordination**

What coordination mechanisms enable efficient task decomposition and context propagation in hierarchical agent architectures without excessive communication overhead?

**RQ3: Episodic Memory Integration for Multi-Session Coherence**

How can long-term episodic memory be integrated into retrieval-augmented agent systems to support consistent, personalized behavior across extended user interactions?

---

**Note:** The precise formulation of these questions may vary by program to align with specific research priorities, but they represent the core theoretical challenges addressed by this system.

---

## For Academic Reviewers

This repository is intended to allow academic reviewers to **verify the technical depth and scope** of the system referenced in my Statement(s) of Purpose and CV.

<table>
<tr>
<td width="40%">

### Applicant Information

**Name:** Terence Ateya

**Role:** AI Systems Engineer and Machine Learning Researcher

**PhD Target:** Computer Science / Data Science, Fall 2026

**Research Interests:**  
Multi-agent systems, scalable information retrieval, retrieval-augmented generation, production ML systems

</td>
<td width="60%">

### Documentation Quick Access

| Resource                                                           | Description                                   |
| ------------------------------------------------------------------ | --------------------------------------------- |
| **[System Architecture](./docs/structure/ARCHITECTURE.md)**        | High-level architecture and workflows         |
| **[Project Structure](./docs/structure/PROJECT_STRUCTURE.md)**     | Organizational rationale for research context |
| **[Directory Structure](./docs/structure/DIRECTORY_STRUCTURE.md)** | Full implementation layout                    |
| **[Deployment Guides](./docs/deployment/guides/)**                 | Platform-specific deployment documentation    |

</td>
</tr>
</table>

---

## Implementation Access Protocol

The complete implementation is maintained in a **private companion repository**  
`hierarchical-multi-agent-retrieval-system-impl`  
for intellectual property protection during the PhD application cycle.

Academic reviewers may request access for evaluation.

**To request access, please email:** `tateya@uco.edu` with:

1. Academic affiliation and position
2. Purpose of review (for example, PhD application evaluation)
3. Institutional email address (for verification)
4. Preferred timeframe (if time-sensitive)

**Suggested subject line:**  
`PhD Application - Multi-Agent Retrieval System - Implementation Access`

---

## Research Contributions

### 1. Hierarchical Multi-Agent Coordination

**Challenge:**  
Flat multi-agent systems struggle with complex task decomposition and maintaining semantic coherence across multiple agents.

**Contribution:**  
A hierarchical orchestration pattern where a **primary orchestrator** delegates to specialized sub-agents (vision, language, retrieval, tools) while preserving global context through **explicit context propagation**.

**Implementation Highlights:**

- Main orchestrator coordinates sub-agents for:
  - vision analysis
  - summarization
  - document retrieval
  - SQL query generation
  - safe code execution
- Context propagation strategies for maintaining coherent multi-step reasoning
- Hierarchical delegation with clear separation of concerns

**Validation:**  
Demonstrated coherent responses to multi-hop, multi-modal user queries in real usage scenarios.

---

### 2. Hybrid Retrieval Architecture

**Challenge:**  
Single-modality retrieval (for example, pure vector search) is insufficient for workloads that require **conceptual understanding**, **precise structured queries**, and **visual reasoning** across diverse content types.

**Contribution:**  
A **hybrid retrieval framework** that integrates:

- dense vector retrieval (semantic similarity),
- read-only SQL tools (structured data access), and
- vision-based analysis (diagrams and images),

with **intelligent query routing** and **result fusion**.

**Implementation Highlights:**

- Supabase/PostgreSQL with `pgvector`
- Document ingestion from Google Drive and local file systems
- Semantic chunking with configurable granularity
- Hybrid retrieval pipeline that merges vector and SQL results into unified context

---

### 3. Production-Scale Episodic Memory

**Challenge:**  
Most conversational systems do not support **persistent, queryable memory** across sessions, limiting personalization and long-horizon coherence.

**Contribution:**  
A **long-term episodic memory layer** enabling cross-session context persistence and semantically aware retrieval.

**Implementation Highlights:**

- Mem0-based memory with semantic indexing
- User-specific memory integrated directly into the agent loop
- Conversation context preserved across sessions with privacy-preserving user isolation (for example, RLS policies)

**Validation:**  
Empirically supports consistent multi-session behavior across returning users.

---

### 4. Safe Tool Orchestration

**Challenge:**  
Agent-generated code and arbitrary tool calls pose substantial security risks in real deployments.

**Contribution:**  
A **secure tool orchestration layer** with sandboxing, validation, and resource constraints.

**Implementation Highlights:**

- `RestrictedPython` sandbox for controlled Python execution
- SQL query validation and parameterization to reduce injection risk
- Timeouts and resource limits on tool executions

**Validation:**  
No security incidents were observed during the production deployment period.

---

### 5. Production ML Engineering

**Contribution:**  
A full-stack deployment that demonstrates the end-to-end path from research prototype to production system.

**Implementation Highlights:**

- JWT-based authentication (Supabase)
- Stripe-based token billing
- Server-Sent Events (SSE) streaming for real-time responses
- Docker-based deployment and reverse proxy configuration
- Observability with Langfuse

---

## System Architecture

For full architectural detail, see **[System Architecture](./docs/structure/ARCHITECTURE.md)**.

That document includes:

- High-level system diagram
- Multi-agent workflow
- RAG pipeline design
- Memory architecture
- Security and safety layer

---

## Research Methodology

The project follows a **research-through-building** approach:

```text
Problem identification → Architecture design → Implementation → Real-world evaluation → Iteration
```

- Problems emerged from realistic, production-style requirements.

- Architectural patterns were evaluated empirically through deployment.

- Results and failure modes (performance, coordination, memory behavior) inform my ongoing and future research questions.

This repository, together with the private implementation, forms the main **empirical foundation** for the multi-agent retrieval research program described in my PhD applications.

---

## Documentation Structure

Key high-level docs:

- **[ARCHITECTURE.md](./docs/structure/ARCHITECTURE.md)**

  High-level design, workflows, and diagrams

- **[PROJECT_STRUCTURE.md](./docs/structure/PROJECT_STRUCTURE.md)**

  Design rationale for research-oriented organization

- **[DIRECTORY_STRUCTURE.md](./docs/structure/DIRECTORY_STRUCTURE.md)**

  Full, concrete file tree of the implementation

---

## Publications and Future Work

This work is currently being developed into **research manuscripts** on:

- semantic preservation in distributed retrieval systems, and

- coordination complexity in multi-agent retrieval architectures.

These manuscripts build directly on the empirical behavior of this system and will form the core of my doctoral research trajectory.

---

## Contact

<div align="center">

**Terence Ateya**

AI Systems Engineer and Machine Learning Researcher

PhD Applicant (Target: Fall 2026)

📧 **Academic Email:** [tateya@uco.edu](mailto:tateya@uco.edu)

📧 **Alternate Email:** [softbrickstech@gmail.com](mailto:softbrickstech@gmail.com)

🔗 **LinkedIn:** [linkedin.com/in/ateya-terence](https://linkedin.com/in/ateya-terence)

**Suggested Subject Line:**

`PhD Application - Multi-Agent Retrieval System Review`

**Typical Response Time:** 24–48 hours

</div>

---

## License and Usage

This repository is provided under an **Academic Review License** for the purpose of **PhD application evaluation and academic review**.

- ✅ Academic evaluation, reference in recommendation letters, and application review are permitted.

- ❌ Commercial use, redistribution, or derivative works require explicit permission.

The full implementation code remains proprietary in a private repository during the application cycle.

---

_Last Updated: November 2025_

_Version: 1.0.0 (Academic Review Snapshot)_
