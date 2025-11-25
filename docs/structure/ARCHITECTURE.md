# System Architecture

## Hierarchical Multi-Agent Retrieval System

This document presents the high-level architecture, workflows, and design patterns of the hierarchical multi-agent retrieval system using Mermaid diagrams.

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        UI[React Frontend<br/>TypeScript + Vite]
        SSE[Server-Sent Events<br/>Real-time Streaming]
    end

    subgraph "API Gateway Layer"
        API[FastAPI Backend<br/>Agent Orchestrator]
        AUTH[Authentication<br/>Supabase Auth]
        BILLING[Token Billing<br/>Stripe Integration]
    end

    subgraph "Agent Layer"
        MAIN[Main Orchestrator Agent<br/>Pydantic AI]
        VISION[Vision Sub-Agent<br/>GPT-4 Vision]
        LANG[Language Sub-Agent<br/>LLM Processing]
        TOOLS[Tool Orchestrator<br/>Safe Execution]
    end

    subgraph "RAG Pipeline Layer"
        RAG[RAG Pipeline<br/>LangChain]
        VECTOR[Vector Search<br/>pgvector]
        SQL[SQL Generator<br/>Structured Queries]
        DOCS[Document Processor<br/>Multi-modal]
    end

    subgraph "Data Layer"
        DB[(Supabase PostgreSQL<br/>Vector Extensions)]
        MEM0[Mem0<br/>Episodic Memory]
        FILES[Document Storage<br/>Google Drive + Local]
    end

    UI -->|HTTP/SSE| API
    API --> AUTH
    API --> BILLING
    API --> MAIN
    MAIN --> VISION
    MAIN --> LANG
    MAIN --> TOOLS
    MAIN --> RAG
    RAG --> VECTOR
    RAG --> SQL
    RAG --> DOCS
    VECTOR --> DB
    SQL --> DB
    DOCS --> FILES
    MAIN --> MEM0
    MEM0 --> DB
```

---

## 2. Hierarchical Multi-Agent Workflow

```mermaid
flowchart TD
    START([User Query]) --> ORCH[Main Orchestrator Agent]

    ORCH --> ANALYZE{Analyze Request}

    ANALYZE -->|Image Content| VISION_AGENT[Vision Sub-Agent<br/>Image Analysis]
    ANALYZE -->|Text Processing| LANG_AGENT[Language Sub-Agent<br/>Text Processing]
    ANALYZE -->|Tool Execution| TOOL_AGENT[Tool Orchestrator<br/>Safe Execution]
    ANALYZE -->|Information Retrieval| RAG_AGENT[RAG Pipeline<br/>Document Retrieval]

    VISION_AGENT --> VISION_RESULT[Vision Analysis Result]
    LANG_AGENT --> LANG_RESULT[Language Processing Result]
    TOOL_AGENT --> TOOL_RESULT[Tool Execution Result]
    RAG_AGENT --> RAG_RESULT[Retrieved Documents]

    VISION_RESULT --> SYNTHESIS[Response Synthesis]
    LANG_RESULT --> SYNTHESIS
    TOOL_RESULT --> SYNTHESIS
    RAG_RESULT --> SYNTHESIS

    SYNTHESIS --> MEMORY[Update Episodic Memory<br/>Mem0]
    MEMORY --> STREAM[Stream Response<br/>SSE]
    STREAM --> END([User Receives Response])

    style ORCH fill:#4A90E2
    style VISION_AGENT fill:#7ED321
    style LANG_AGENT fill:#7ED321
    style TOOL_AGENT fill:#7ED321
    style RAG_AGENT fill:#7ED321
    style SYNTHESIS fill:#F5A623
```

---

## 3. Sub-Agentic Workflow Detail

```mermaid
sequenceDiagram
    participant User
    participant Orchestrator as Main Orchestrator
    participant Vision as Vision Sub-Agent
    participant Language as Language Sub-Agent
    participant RAG as RAG Pipeline
    participant Memory as Mem0 Memory
    participant DB as Database

    User->>Orchestrator: Query with image/text
    Orchestrator->>Orchestrator: Analyze request type

    alt Image Content Detected
        Orchestrator->>Vision: Delegate image analysis
        Vision->>Vision: Process with GPT-4 Vision
        Vision-->>Orchestrator: Image analysis result
    end

    alt Text Processing Needed
        Orchestrator->>Language: Delegate text processing
        Language->>Language: Process with LLM
        Language-->>Orchestrator: Text processing result
    end

    alt Information Retrieval Needed
        Orchestrator->>RAG: Request document retrieval
        RAG->>DB: Vector search + SQL query
        DB-->>RAG: Retrieved documents
        RAG-->>Orchestrator: Contextual documents
    end

    Orchestrator->>Orchestrator: Synthesize all results
    Orchestrator->>Memory: Store conversation context
    Memory->>DB: Persist episodic memory
    Orchestrator-->>User: Stream final response (SSE)
```

---

## 4. RAG Pipeline Workflow

```mermaid
flowchart LR
    subgraph "Document Ingestion"
        DRIVE[Google Drive<br/>API Watcher]
        LOCAL[Local Filesystem<br/>File Watcher]
        INGEST[Document Ingestion<br/>Multi-format Support]
    end

    subgraph "Processing Pipeline"
        CHUNK[Text Chunking<br/>Semantic Segmentation]
        EMBED[Vector Embedding<br/>OpenAI/Local Models]
        METADATA[Metadata Extraction<br/>Title, Type, Source]
    end

    subgraph "Storage Layer"
        VECTOR_DB[(Vector Database<br/>pgvector)]
        SQL_DB[(Structured Data<br/>PostgreSQL)]
    end

    subgraph "Retrieval Layer"
        QUERY[User Query]
        VECTOR_SEARCH[Vector Similarity Search]
        SQL_GEN[SQL Query Generation]
        FUSION[Result Fusion<br/>Multi-modal]
    end

    DRIVE --> INGEST
    LOCAL --> INGEST
    INGEST --> CHUNK
    CHUNK --> EMBED
    CHUNK --> METADATA
    EMBED --> VECTOR_DB
    METADATA --> SQL_DB

    QUERY --> VECTOR_SEARCH
    QUERY --> SQL_GEN
    VECTOR_SEARCH --> VECTOR_DB
    SQL_GEN --> SQL_DB
    VECTOR_SEARCH --> FUSION
    SQL_GEN --> FUSION
    FUSION --> RESULT[Retrieved Context]
```

---

## 5. Multi-Agent Coordination Pattern

```mermaid
graph TD
    subgraph "Orchestration Layer"
        MAIN[Main Orchestrator<br/>Task Decomposition<br/>Context Management]
    end

    subgraph "Specialized Sub-Agents"
        VISION[Vision Agent<br/>Image Analysis<br/>Diagram Understanding]
        LANGUAGE[Language Agent<br/>Text Processing<br/>Conversation Management]
        TOOL[Tool Agent<br/>Code Execution<br/>SQL Generation]
        RAG[RAG Agent<br/>Document Retrieval<br/>Context Assembly]
    end

    subgraph "Shared Resources"
        MEMORY[Episodic Memory<br/>Mem0]
        STATE[Conversation State<br/>PostgreSQL]
        TOOLS[Tool Registry<br/>Safe Execution Sandbox]
    end

    MAIN -->|Delegates| VISION
    MAIN -->|Delegates| LANGUAGE
    MAIN -->|Delegates| TOOL
    MAIN -->|Delegates| RAG

    VISION -->|Updates| MEMORY
    LANGUAGE -->|Updates| MEMORY
    TOOL -->|Updates| MEMORY
    RAG -->|Updates| MEMORY

    VISION -->|Reads| STATE
    LANGUAGE -->|Reads| STATE
    TOOL -->|Reads| STATE
    RAG -->|Reads| STATE

    TOOL -->|Uses| TOOLS

    VISION -->|Returns| MAIN
    LANGUAGE -->|Returns| MAIN
    TOOL -->|Returns| MAIN
    RAG -->|Returns| MAIN

    MAIN -->|Synthesizes| RESPONSE[Final Response]

    style MAIN fill:#4A90E2
    style VISION fill:#7ED321
    style LANGUAGE fill:#7ED321
    style TOOL fill:#7ED321
    style RAG fill:#7ED321
    style MEMORY fill:#F5A623
```

---

## 6. End-to-End User Query Flow

```mermaid
flowchart TD
    START([User Submits Query]) --> AUTH{Authenticated?}
    AUTH -->|No| LOGIN[Redirect to Login]
    AUTH -->|Yes| TOKENS{Sufficient Tokens?}

    TOKENS -->|No| PURCHASE[Redirect to Purchase]
    TOKENS -->|Yes| DEDUCT[Deduct Tokens]

    DEDUCT --> ORCH[Main Orchestrator Receives Query]

    ORCH --> CLASSIFY{Classify Query Type}

    CLASSIFY -->|Image Query| IMAGE_FLOW[Vision Agent Flow]
    CLASSIFY -->|Text Query| TEXT_FLOW[Language Agent Flow]
    CLASSIFY -->|Information Query| RAG_FLOW[RAG Agent Flow]
    CLASSIFY -->|Tool Query| TOOL_FLOW[Tool Agent Flow]

    IMAGE_FLOW --> RETRIEVE_MEM[Retrieve Context from Memory]
    TEXT_FLOW --> RETRIEVE_MEM
    RAG_FLOW --> RETRIEVE_MEM
    TOOL_FLOW --> RETRIEVE_MEM

    RETRIEVE_MEM --> EXECUTE[Execute Sub-Agent Tasks]
    EXECUTE --> SYNTHESIZE[Synthesize Results]

    SYNTHESIZE --> UPDATE_MEM[Update Episodic Memory]
    UPDATE_MEM --> STREAM[Stream Response via SSE]

    STREAM --> LOG[Log Interaction]
    LOG --> END([User Receives Response])

    style ORCH fill:#4A90E2
    style IMAGE_FLOW fill:#7ED321
    style TEXT_FLOW fill:#7ED321
    style RAG_FLOW fill:#7ED321
    style TOOL_FLOW fill:#7ED321
    style RETRIEVE_MEM fill:#F5A623
    style UPDATE_MEM fill:#F5A623
```

---

## 7. Memory System Architecture

```mermaid
graph TB
    subgraph "Memory Components"
        EPISODIC[Episodic Memory<br/>Mem0]
        CONVERSATION[Conversation State<br/>PostgreSQL]
        USER_PREF[User Preferences<br/>Learning Patterns]
    end

    subgraph "Memory Operations"
        STORE[Store Interaction]
        RETRIEVE[Retrieve Context]
        UPDATE[Update Preferences]
        QUERY[Query Memory]
    end

    subgraph "Storage Backend"
        MEM0_DB[(Mem0 Database<br/>Semantic Index)]
        POSTGRES[(PostgreSQL<br/>Structured Storage)]
    end

    EPISODIC --> STORE
    EPISODIC --> RETRIEVE
    CONVERSATION --> STORE
    CONVERSATION --> RETRIEVE
    USER_PREF --> UPDATE
    USER_PREF --> QUERY

    STORE --> MEM0_DB
    STORE --> POSTGRES
    RETRIEVE --> MEM0_DB
    RETRIEVE --> POSTGRES
    UPDATE --> POSTGRES
    QUERY --> MEM0_DB
    QUERY --> POSTGRES
```

---

## 8. Security & Safety Architecture

```mermaid
flowchart TD
    REQUEST[User Request] --> VALIDATE[Input Validation]
    VALIDATE --> AUTH_CHECK[Authentication Check]
    AUTH_CHECK --> RLS[Row-Level Security<br/>Supabase RLS]

    RLS --> TOOL_CHECK{Tool Execution?}
    TOOL_CHECK -->|Yes| SANDBOX[RestrictedPython Sandbox]
    TOOL_CHECK -->|No| SQL_CHECK{SQL Query?}

    SQL_CHECK -->|Yes| SQL_VALIDATE[SQL Validation<br/>Parameterization]
    SQL_CHECK -->|No| PROCEED[Proceed with Request]

    SANDBOX --> RESOURCE_LIMIT[Resource Limits<br/>Timeout, Memory]
    SQL_VALIDATE --> RESOURCE_LIMIT
    PROCEED --> RESOURCE_LIMIT

    RESOURCE_LIMIT --> EXECUTE[Safe Execution]
    EXECUTE --> AUDIT[Audit Logging]
    AUDIT --> RESPONSE[Response to User]

    style SANDBOX fill:#FF6B6B
    style SQL_VALIDATE fill:#FF6B6B
    style RESOURCE_LIMIT fill:#FF6B6B
    style RLS fill:#4ECDC4
```

---

## Architecture Principles

### 1. **Hierarchical Delegation**

- Main orchestrator maintains global context
- Specialized sub-agents handle domain-specific tasks
- Clear separation of concerns

### 2. **Semantic Coherence**

- Episodic memory preserves conversation context
- State management across agent boundaries
- Context propagation mechanisms

### 3. **Multi-Modal Retrieval**

- Vector search for semantic similarity
- SQL generation for structured queries
- Vision capabilities for image understanding

### 4. **Production Safety**

- Sandboxed code execution
- Validated SQL queries
- Resource limitations and timeouts

### 5. **Scalability**

- Independent component deployment
- Horizontal scaling at component level
- Modular architecture

---

## Technology Stack

| Layer            | Technology                | Purpose                                 |
| ---------------- | ------------------------- | --------------------------------------- |
| **Frontend**     | React, TypeScript, Vite   | User interface with real-time streaming |
| **Backend API**  | FastAPI, Pydantic AI      | Agent orchestration and API endpoints   |
| **Agents**       | Pydantic AI, GPT-4 Vision | Multi-agent coordination                |
| **RAG Pipeline** | LangChain, pgvector       | Document retrieval and processing       |
| **Database**     | Supabase (PostgreSQL)     | Data persistence with vector extensions |
| **Memory**       | Mem0                      | Episodic memory and context management  |
| **Security**     | RestrictedPython, RLS     | Safe execution and data isolation       |
| **Deployment**   | Docker, Caddy             | Containerization and reverse proxy      |

---

## Contact for Implementation Details

This architecture document provides high-level design patterns and workflows. For complete implementation code, test suites, and deployment configurations, please contact:

**Email**: ateyaterence@gmail.com  
**Subject**: PhD Application - Multi-Agent Systems Research - Implementation Access Request

The private repository (`hierarchical-multi-agent-retrieval-system-impl`) contains:

- Complete source code for all components
- Detailed setup instructions (`SETUP.md`)
- Database schemas and migration scripts
- Deployment configurations
- Test suites and validation frameworks
