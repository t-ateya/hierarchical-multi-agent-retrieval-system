# Setup Guide - Hierarchical Multi-Agent Retrieval System

> **Note**: This file contains detailed setup instructions for the full implementation. This is for the private repository with complete codebase.

## Prerequisites & Setup

**Note:** Setting up the full AI agent is optional. However, if you want to run the actual AI agent locally and see it in action, follow the setup guide below.

### Prerequisites

- Docker/Docker Desktop (recommended) OR Python 3.11+ and Node.js 18+ with npm
- Supabase account (or self-hosted instance)
- LLM provider account (OpenAI, OpenRouter, or local Ollama)
- Stripe account for payment processing
- Optional: Brave API key for web search (or local SearXNG)
- Optional: Google Drive API credentials for Google Drive RAG

### **📚 Complete Setup Guide**

## Database Setup

The database is the foundation for all components. Set it up first:

1. **Create a Supabase project:**

   - **Cloud**: Create a project at [https://supabase.com](https://supabase.com)
   - **Local**: Navigate to http://localhost:8000 (default Supabase dashboard)

2. **Navigate to the SQL Editor** in your Supabase dashboard

3. **Run the complete database setup:**

   ```sql
   -- Copy and paste the contents of sql/0-all-tables.sql
   -- This creates all tables, functions, triggers, and security policies
   ```

   **⚠️ Important**: The `0-all-tables.sql` script will DROP and recreate the agent tables (user_profiles, conversations, messages, documents, etc.). This resets the agent data to a blank slate - existing agent data will be lost, but other tables in your Supabase project remain untouched.

**Alternative**: You can run the individual scripts (`1-user_profiles_requests.sql` through `9-rag_pipeline_state.sql`) if you prefer granular control.

**Ollama Configuration**: For local Ollama implementations using models like nomic-embed-text, modify the vector dimensions from 1536 to 768 in `0-all-tables.sql` (lines 133 and 149).

## Stripe Payment Setup

The platform includes token-based billing where users purchase token packages to interact with the AI agent.

### Stripe Configuration

1. **Create a Stripe account** at [https://stripe.com](https://stripe.com)

2. **Get your API keys** from the Stripe Dashboard:

   - Navigate to Developers → API keys
   - Copy your **Publishable key** and **Secret key**

3. **Install Stripe CLI** for local webhook testing:

   **macOS (Homebrew):**

   ```bash
   brew install stripe/stripe-cli/stripe
   ```

   **Windows (Scoop):**

   ```bash
   scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
   scoop install stripe
   ```

   **Linux:**

   ```bash
   # Download from https://github.com/stripe/stripe-cli/releases/latest
   # Extract and add to PATH
   ```

4. **Login to Stripe CLI:**

   ```bash
   stripe login
   ```

5. **Start webhook forwarding** (keep this running in a separate terminal):

   ```bash
   stripe listen --forward-to localhost:8001/api/webhook/stripe
   ```

   The command will output a webhook signing secret like:

   ```
   Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
   ```

6. **Add Stripe environment variables** to your `.env`:

   ```env
   # Stripe Payment Configuration
   STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
   STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx  # From stripe listen command

   # Frontend Stripe key
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
   ```

### Testing Payments Locally

1. Start the Stripe webhook listener (as shown above)
2. Start your backend and frontend services
3. Use Stripe's test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - More test cards: [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

### Token Packages

The system includes three token packages:

- **Basic**: 100 tokens for $5
- **Standard**: 250 tokens for $10 (Most Popular)
- **Premium**: 600 tokens for $20

Each AI agent interaction deducts one token from the user's balance.

## Environment Configuration

Configure your environment variables:

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# LLM Configuration
LLM_PROVIDER=openai
LLM_API_KEY=your_openai_api_key_here
LLM_CHOICE=gpt-4o-mini

# Embedding Configuration
EMBEDDING_API_KEY=your_openai_api_key_here
EMBEDDING_MODEL_CHOICE=text-embedding-3-small

# Database Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_key_here

# Frontend Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_AGENT_ENDPOINT=http://localhost:8001/api/pydantic-agent

# Optional: LangFuse integration
VITE_LANGFUSE_HOST_WITH_PROJECT=http://localhost:3000/project/your-project-id

# Stripe Payment Configuration
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

# RAG Pipeline Configuration
RAG_PIPELINE_TYPE=local  # or google_drive
RUN_MODE=continuous      # or single for scheduled runs
RAG_PIPELINE_ID=dev-local-pipeline  # Required for single-run mode

# Optional: Google Drive Configuration
GOOGLE_DRIVE_CREDENTIALS_JSON=  # Service account JSON for Google Drive if using a Service Account
RAG_WATCH_FOLDER_ID=           # Specific Google Drive folder ID

# Optional: Local Files Configuration
RAG_WATCH_DIRECTORY=           # Override container path (default: /app/Local_Files/data)

# Optional Langfuse agent monitoring configuration
LANGFUSE_PUBLIC_KEY=
LANGFUSE_SECRET_KEY=
LANGFUSE_HOST=https://cloud.langfuse.com

# Hostnames for Caddy reverse proxy routes
# Leave these commented if you aren't deploying to production
AGENT_API_HOSTNAME=agent.yourdomain.com
FRONTEND_HOSTNAME=chat.yourdomain.com
```

### Complete Environment Variables Reference

#### Agent API & RAG Pipeline

```env
# LLM Configuration
LLM_PROVIDER=openai
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=your_api_key
LLM_CHOICE=gpt-4o-mini
VISION_LLM_CHOICE=gpt-4o-mini

# Embedding Configuration
EMBEDDING_PROVIDER=openai
EMBEDDING_BASE_URL=https://api.openai.com/v1
EMBEDDING_API_KEY=your_api_key
EMBEDDING_MODEL_CHOICE=text-embedding-3-small

# Database
DATABASE_URL=postgresql://user:pass@host:port/db
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key

# Web Search
BRAVE_API_KEY=your_brave_key
SEARXNG_BASE_URL=http://localhost:8080

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# RAG Pipeline Configuration
RAG_PIPELINE_TYPE=local          # local or google_drive
RUN_MODE=continuous              # continuous or single
RAG_PIPELINE_ID=my-pipeline      # Required for single-run mode

# Google Drive (for RAG Pipeline)
GOOGLE_DRIVE_CREDENTIALS_JSON=   # Service account JSON string
RAG_WATCH_FOLDER_ID=            # Specific folder ID to watch

# Local Files (for RAG Pipeline)
RAG_WATCH_DIRECTORY=            # Container path override
```

#### Frontend

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_AGENT_ENDPOINT=http://localhost:8001/api/pydantic-agent
VITE_ENABLE_STREAMING=true
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

# Optional: LangFuse integration for admin dashboard
VITE_LANGFUSE_HOST_WITH_PROJECT=http://localhost:3000/project/your-project-id

# Reverse Proxy Configuration (for Caddy deployments)
AGENT_API_HOSTNAME=agent.yourdomain.com
FRONTEND_HOSTNAME=chat.yourdomain.com
```

## Deployment Methods

### Method 1: Development Mode (Manual Components)

For development without Docker or to run individual containers separately, see the component-specific READMEs:

- [Backend Agent API](./backend_agent_api/README.md) - Python agent with FastAPI
- [Backend RAG Pipeline](./backend_rag_pipeline/README.md) - Document processing pipeline
- [Frontend](./frontend/README.md) - React application

### Method 2: Smart Deployment Script (Recommended)

The easiest way to deploy the stack is using the included Python deployment script, which automatically handles both local and cloud deployment scenarios.

#### Deploy with Script

##### Cloud Deployment (Standalone with Caddy)

Deploy as a self-contained stack with built-in reverse proxy:

```bash
# Deploy to cloud (includes Caddy reverse proxy)
python deploy.py --type cloud

# Stop cloud deployment
python deploy.py --down --type cloud
```

##### Local Deployment (Integrate with the Local AI Package)

Deploy to work alongside your existing Local AI Package with shared Caddy:

```bash
# Deploy alongside the Local AI Package (uses existing Caddy)
python deploy.py --type local --project localai

# Stop local deployment
python deploy.py --down --type local --project localai
```

**To enable reverse proxy routes in your Local AI Package**:

1. **Copy and configure** the addon file:

   ```bash
   # Copy caddy-addon.conf to your Local AI Package's caddy-addon folder
   cp caddy-addon.conf /path/to/local-ai-package/caddy-addon/

   # Edit lines 2 and 21 to set your desired subdomains:
   # Line 2: subdomain.yourdomain.com (for agent API)
   # Line 21: subdomain2.yourdomain.com (for frontend)
   ```

2. **Restart Caddy in the Local AI Package** to load the new configuration:
   ```bash
   docker compose -p localai restart caddy
   ```

**Note:** Don't forget to run the SQL scripts first (see Database Setup above) and configure each `.env` file with your credentials.

## Deployment Guide

**Note:** This section provides comprehensive deployment options for production environments.

### Option 1: DigitalOcean with Docker Compose (Simplest)

Deploy the entire stack on a single DigitalOcean Droplet using Docker Compose:

- **Pros**: Simple setup, everything in one place, easy to manage
- **Cons**: All components scale together, single point of failure
- **Best for**: Small teams, prototypes, and getting started quickly
- **Setup Guide**: See [`docs/deployment/guides/cloud-ai-digitalocean.md`](docs/deployment/guides/cloud-ai-digitalocean.md) for step-by-step instructions
- **Alternative**: For integration with Local AI Package, see [`docs/deployment/guides/local-ai-digitalocean.md`](docs/deployment/guides/local-ai-digitalocean.md)

### Option 2: Render Platform (Recommended)

Deploy each component separately on Render for better scalability:

- **Agent API**: Deploy as a Docker container with autoscaling
- **RAG Pipeline**: Set up as a scheduled job (cron)
- **Frontend**: Deploy as a static site from the build output
- **Pros**: Automatic scaling, managed infrastructure, good free tier
- **Cons**: Requires configuring each service separately
- **Best for**: Production applications with moderate traffic
- **Setup Guide**: See [`docs/deployment/guides/render-deployment.md`](docs/deployment/guides/render-deployment.md) for detailed instructions

### Option 3: Google Cloud Platform (Enterprise)

For enterprise deployments with maximum flexibility:

- **Agent API**: Cloud Run for serverless, auto-scaling containers
- **RAG Pipeline**: Cloud Scheduler + Cloud Run for scheduled processing
- **Frontend**: Cloud Storage + Cloud CDN for global static hosting
- **Database**: Consider Cloud SQL for Postgres instead of Supabase
- **Pros**: Enterprise features, global scale, fine-grained control
- **Cons**: More complex setup, requires GCP knowledge
- **Best for**: Large-scale production deployments
- **Setup Guide**: See [`docs/deployment/guides/gcp-deployment.md`](docs/deployment/guides/gcp-deployment.md) for comprehensive setup

### Deployment Decision Matrix

| Feature                 | DigitalOcean            | Render                    | Google Cloud      |
| ----------------------- | ----------------------- | ------------------------- | ----------------- |
| Setup Complexity        | ⭐ (Easiest)            | ⭐⭐ (Still Pretty Easy)  | ⭐⭐⭐ (Moderate) |
| Cost for Small Apps     | $$                      | $ (Free tier)             | $ (Free tier)     |
| Scalability             | Manual                  | Automatic                 | Automatic         |
| Geographic Distribution | Single region           | Multi-region              | Global            |
| Best For                | Quick start or Local AI | Most cloud based projects | Enterprise        |

## Agent Observability with LangFuse (Optional)

This deployment includes optional LangFuse integration for comprehensive agent observability. LangFuse provides detailed insights into agent conversations, performance metrics, and debugging capabilities - particularly valuable for production deployments.

### What LangFuse Provides

- **Conversation Tracking**: Complete agent interaction histories with user and session context
- **Performance Metrics**: Response times, token usage, and cost tracking
- **Debugging Tools**: Detailed execution traces for troubleshooting agent behavior
- **User Analytics**: Insights into user patterns and agent effectiveness

### Setup (Completely Optional)

**To enable LangFuse observability:**

1. **Create a LangFuse account** at [https://cloud.langfuse.com/](https://cloud.langfuse.com/) (free tier available)

2. **Create a new project** and obtain your credentials

3. **Add LangFuse environment variables** to your agent API `.env` file:

   ```env
   # Agent observability (optional - leave empty to disable)
   LANGFUSE_PUBLIC_KEY=your_langfuse_public_key
   LANGFUSE_SECRET_KEY=your_langfuse_secret_key
   LANGFUSE_HOST=https://cloud.langfuse.com
   ```

4. **Optional: Enable frontend integration** by setting in your frontend `.env`:
   ```env
   # Add clickable LangFuse links in the admin dashboard
   VITE_LANGFUSE_HOST_WITH_PROJECT=https://cloud.langfuse.com/project/your-project-id
   ```

**To disable LangFuse (default behavior):**

- Simply leave the `LANGFUSE_PUBLIC_KEY` and `LANGFUSE_SECRET_KEY` empty
- The agent runs normally with no observability overhead

### Benefits for Different Use Cases

- **Development**: Debug agent behavior and optimize conversation flows
- **Production**: Monitor performance, track usage costs, and identify issues
- **Analytics**: Understand user interactions and improve agent effectiveness
- **Team Collaboration**: Share conversation traces and debugging information

The LangFuse integration is designed to be zero-impact when disabled, making it perfect for development environments where observability isn't needed.

## Troubleshooting

### Docker Compose Issues

1. **Services won't start**:

   ```bash
   # Check service logs
   docker compose logs -f

   # Rebuild images
   docker compose build --no-cache
   ```

2. **Port conflicts**:

   ```bash
   # Check what's using ports
   netstat -tlnp | grep :8001

   # Stop conflicting services or change ports in docker-compose.yml
   ```

3. **Environment variables not loading**:

   ```bash
   # Verify .env file exists and has correct format
   cat .env

   # Check environment in container
   docker compose exec agent-api env | grep LLM_
   ```

### Common Issues

1. **Database connection**: Verify Supabase credentials and network access
2. **Vector dimensions**: Ensure embedding model dimensions match database schema
3. **CORS errors**: Check API endpoint configuration in frontend `.env`
4. **Memory issues**: Increase Docker memory limits for large models

### Verification Steps

1. **Database**: Check Supabase dashboard for table creation
2. **Agent API Health**: Visit http://localhost:8001/health
3. **API Documentation**: Visit http://localhost:8001/docs
4. **RAG Pipeline**: Check logs with `docker compose logs rag-pipeline`
5. **Frontend**: Open browser console for any errors

### Health Checks

Monitor service health:

```bash
# Check all service health
docker compose ps

# Check specific service logs
docker compose logs -f agent-api

# Test API health endpoint
curl http://localhost:8001/health

# Test frontend
curl http://localhost:8082/health
```

## Testing

### Frontend Testing with Playwright

The frontend includes Playwright tests for end-to-end testing with mocked Supabase and agent API calls.

```bash
cd frontend

# Make sure Playwright is installed
npx playwright install --with-deps

# Run all tests
npm run test

# Run tests with interactive UI
npm run test:ui

# Run tests in headed browser mode (see the browser)
npm run test:headed

# Run specific test file
npx playwright test auth.spec.ts

# Debug tests
npx playwright test --debug
```

**Test Features:**

- ✅ **Complete mocking** - No database or API calls
- ✅ **Authentication flow** - Login, signup, logout
- ✅ **Chat interface** - Send messages, receive responses
- ✅ **Conversation management** - New chats, conversation history
- ✅ **Loading states** - UI feedback during operations

The tests use comprehensive mocks for:

- Supabase authentication and database
- Agent API streaming responses
- User sessions and conversation data

## Support

For detailed instructions on each component, refer to their individual README files:

- `backend_agent_api/README.md` - Agent API specifics
- `backend_rag_pipeline/README.md` - RAG pipeline details
- `frontend/README.md` - Frontend development guide

Remember: The modular structure allows you to start with local deployment and gradually move components to the cloud as needed!

