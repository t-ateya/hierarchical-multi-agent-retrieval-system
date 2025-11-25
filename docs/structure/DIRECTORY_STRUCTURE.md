# Project Directory Structure

## Hierarchical Multi-Agent Retrieval System

This document presents the complete directory structure of the research project, organized for scientific reproducibility and academic review.

```
hierarchical-multi-agent-retrieval-system/
│
├── README.md                          # Project overview and setup instructions
├── LICENSE                            # License information
│
├── research_development/              # Research methodology and development artifacts
│   ├── README.md                      # Research documentation
│   ├── AGENTS.md                      # Agent architecture documentation
│   ├── CLAUDE.md                      # Development methodology
│   ├── PRPs/                          # Pattern Recognition Protocols
│   │   ├── INITIAL-EXAMPLE.md
│   │   └── templates/
│   ├── challenge/                     # Challenge scenarios and prompts
│   │   ├── challenge.md
│   │   ├── prompt.md
│   │   └── bad_prompt.md
│   ├── images/                        # Research diagrams and visualizations
│   │   ├── ai-coding-logos/
│   │   ├── AICoding3Steps.png
│   │   ├── ContextEngineering.png
│   │   └── PRPSteps.png
│   └── copy_research_prompts.py       # Research tooling
│
├── backend_agent_api/                 # Multi-Agent API Service
│   ├── agent_api.py                   # FastAPI application entry point
│   ├── agent.py                       # Core agent implementation
│   ├── clients.py                     # External service clients
│   ├── tools.py                       # Agent tool definitions
│   ├── prompt.py                      # Prompt engineering modules
│   ├── db_utils.py                    # Database utilities
│   ├── configure_langfuse.py          # Observability configuration
│   ├── requirements.txt               # Python dependencies
│   ├── Dockerfile                     # Containerization configuration
│   ├── README.md                      # Service documentation
│   └── tests/                         # Unit and integration tests
│       ├── conftest.py
│       ├── test_clients.py
│       ├── test_tools.py
│       ├── test_stripe_integration.py
│       └── test_stripe_endpoints_integration.py
│
├── backend_rag_pipeline/             # Retrieval-Augmented Generation Pipeline
│   ├── common/                        # Shared utilities
│   │   ├── db_handler.py              # Database operations
│   │   ├── state_manager.py          # State management
│   │   └── text_processor.py         # Text processing utilities
│   ├── Google_Drive/                 # Google Drive integration
│   │   ├── main.py
│   │   ├── drive_watcher.py
│   │   ├── config.json
│   │   └── tests/
│   │       ├── conftest.py
│   │       └── test_drive_watcher.py
│   ├── Local_Files/                   # Local file system integration
│   │   ├── main.py
│   │   ├── file_watcher.py
│   │   ├── config.json
│   │   └── tests/
│   │       ├── conftest.py
│   │       └── test_file_watcher.py
│   ├── docker_entrypoint.py           # Container entry point
│   ├── Dockerfile                     # Containerization configuration
│   ├── requirements.txt               # Python dependencies
│   ├── README.md                      # Pipeline documentation
│   └── tests/                         # Unit and integration tests
│       ├── conftest.py
│       ├── test_db_handler.py
│       ├── test_text_processor.py
│       └── test_docker_entrypoint.py
│
├── frontend/                          # React TypeScript Frontend Application
│   ├── src/
│   │   ├── components/                # React components
│   │   │   ├── admin/                 # Administration interface
│   │   │   │   ├── ConversationsTable.tsx
│   │   │   │   ├── UsersTable.tsx
│   │   │   │   └── conversations/
│   │   │   ├── auth/                  # Authentication components
│   │   │   │   ├── AuthForm.tsx
│   │   │   │   └── AuthCallback.tsx
│   │   │   ├── chat/                  # Chat interface components
│   │   │   │   ├── ChatLayout.tsx
│   │   │   │   ├── ChatInput.tsx
│   │   │   │   ├── MessageList.tsx
│   │   │   │   ├── MessageItem.tsx
│   │   │   │   ├── MessageHandling.tsx
│   │   │   │   └── ConversationManagement.tsx
│   │   │   ├── payments/              # Payment processing components
│   │   │   ├── profile/               # User profile components
│   │   │   │   ├── TokenBalance.tsx
│   │   │   │   ├── TokenHistory.tsx
│   │   │   │   └── __tests__/
│   │   │   ├── purchase/              # Purchase flow components
│   │   │   │   ├── PurchasePage.tsx
│   │   │   │   ├── PaymentSuccess.tsx
│   │   │   │   ├── PaymentFailure.tsx
│   │   │   │   └── __tests__/
│   │   │   ├── sidebar/               # Sidebar components
│   │   │   │   ├── ChatSidebar.tsx
│   │   │   │   └── SettingsModal.tsx
│   │   │   ├── ui/                    # Reusable UI components (shadcn/ui)
│   │   │   │   └── [50+ component files]
│   │   │   ├── util/                  # Utility components
│   │   │   │   └── TruncatedText.tsx
│   │   │   └── theme-provider.tsx     # Theme management
│   │   ├── pages/                     # Page components
│   │   │   ├── Index.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Chat.tsx
│   │   │   ├── Admin.tsx
│   │   │   └── NotFound.tsx
│   │   ├── hooks/                     # Custom React hooks
│   │   │   ├── useAuth.tsx
│   │   │   ├── useTokens.ts
│   │   │   ├── useAdmin.ts
│   │   │   ├── use-mobile.tsx
│   │   │   ├── use-toast.ts
│   │   │   └── __tests__/
│   │   ├── lib/                       # Library utilities
│   │   │   ├── api.ts                 # API client
│   │   │   ├── supabase.ts            # Supabase client
│   │   │   └── utils.ts               # General utilities
│   │   ├── types/                     # TypeScript type definitions
│   │   │   └── database.types.ts      # Database schema types
│   │   ├── App.tsx                    # Main application component
│   │   ├── App.css                    # Application styles
│   │   ├── main.tsx                   # Application entry point
│   │   └── index.css                  # Global styles
│   ├── tests/                         # End-to-end tests (Playwright)
│   │   ├── auth.spec.ts
│   │   ├── chat.spec.ts
│   │   ├── stripe-payment-flow.spec.ts
│   │   ├── example.spec.ts
│   │   └── mocks.ts
│   ├── public/                        # Static assets
│   ├── dist/                          # Production build output
│   ├── package.json                   # Node.js dependencies
│   ├── vite.config.ts                 # Vite configuration
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── tailwind.config.ts             # Tailwind CSS configuration
│   ├── Dockerfile                     # Containerization configuration
│   ├── nginx.conf                     # Nginx configuration
│   └── README.md                      # Frontend documentation
│
├── sql/                               # Database Schema and Migrations
│   ├── 0-all-tables.sql               # Complete schema overview
│   ├── 1-user_profiles_requests.sql   # User profiles and requests
│   ├── 2-user_profiles_requests_rls.sql # Row-level security policies
│   ├── 3-conversations_messages.sql   # Conversations and messages
│   ├── 4-conversations_messages_rls.sql # RLS for conversations
│   ├── 5-document_metadata.sql        # Document metadata schema
│   ├── 6-document_rows.sql            # Document row storage
│   ├── 7-documents.sql                # Document management
│   ├── 8-execute_sql_rpc.sql         # SQL execution functions
│   ├── 9-rag_pipeline_state.sql       # RAG pipeline state management
│   ├── 10-transactions-table.sql      # Transaction tracking
│   ├── 11-transactions-rls.sql        # Transaction security
│   └── 12-token-migration.sql         # Token system migration
│
├── PRPs/                              # Pattern Recognition Protocols
│   ├── INITIAL.md                     # Initial project analysis
│   ├── stripe-payment-integration.md  # Payment integration protocol
│   ├── ai_docs/                       # AI development patterns
│   │   ├── backend_patterns.md
│   │   ├── frontend_patterns.md
│   │   ├── rag_patterns.md
│   │   └── testing_patterns.md
│   ├── planning/                      # Research and planning documents
│   │   ├── stripe-integration-analysis.md
│   │   ├── stripe-research.md
│   │   └── supabase-research.md
│   └── templates/                     # PRP templates
│       ├── prp_base.md
│       └── prp_story_task.md
│
├── deployment/                        # Deployment Configuration
│   ├── docker-compose.yml             # Main Docker Compose configuration
│   ├── docker-compose.caddy.yml       # Caddy reverse proxy configuration
│   ├── Caddyfile                      # Caddy server configuration
│   ├── caddy-addon.conf               # Caddy addon configuration
│   ├── deploy.py                      # Deployment automation script
│   └── guides/                        # Deployment guides
│       ├── cloud-ai-digitalocean.md
│       ├── gcp-deployment.md
│       ├── local-ai-digitalocean.md
│       └── render-deployment.md
│
├── documentation/                     # Project Documentation
│   ├── AGENTS.md                      # Agent architecture documentation
│   ├── APPLICATION_STRATEGY.md       # Application strategy
│   ├── FILES_OVERVIEW.md              # File structure overview
│   ├── GITHUB_SETUP.md                # GitHub setup guide
│   ├── START_HERE.md                  # Getting started guide
│   ├── SUBMISSION_CHECKLIST.md        # Submission checklist
│   ├── research.md                    # Research documentation
│   └── research_readme.md             # Research overview
│
├── data/                              # Data Storage
│   ├── rag-documents/                 # RAG document storage
│   ├── google-credentials/            # Google API credentials (gitignored)
│   └── planning/                      # Planning artifacts
│
└── .gitignore                         # Git ignore rules
```

## Directory Organization Principles

### 1. **Research & Development** (`research_development/`)
Contains all research methodology, development artifacts, and experimental protocols. This demonstrates the systematic approach to problem-solving and innovation.

### 2. **Implementation** (`backend_*`, `frontend/`)
Clear separation of backend services and frontend application, following microservices architecture principles.

### 3. **Data Management** (`sql/`, `data/`)
Database schema, migrations, and data storage organized for reproducibility and version control.

### 4. **Documentation** (`documentation/`, `PRPs/`)
Comprehensive documentation including architectural decisions, research protocols, and deployment guides.

### 5. **Deployment** (`deployment/`)
Infrastructure as code and deployment automation for reproducibility across environments.

## Key Features for Academic Review

- **Reproducibility**: Complete schema, dependencies, and configuration files
- **Test Coverage**: Comprehensive test suites across all components
- **Documentation**: Extensive documentation of architecture and methodology
- **Modularity**: Clear separation of concerns and modular design
- **Research Methodology**: Documented research and development process

