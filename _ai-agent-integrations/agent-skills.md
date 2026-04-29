---
layout: default
title: Agent skills
nav_order: 20
has_children: true
redirect_from:
  - /ml-commons-plugin/agents-tools/agent-skills/
---

# Agent skills

[OpenSearch Agent Skills](https://github.com/opensearch-project/opensearch-agent-skills) are packaged workflows that teach AI coding assistants how to work with OpenSearch. Each skill bundles instructions, reference material, and executable scripts so that a single natural-language request — for example, *"build a semantic search app with OpenSearch"* — produces working code, configured indexes, and runnable tests.

Skills follow the [Agent Skills specification](https://agentskills.io/specification) and work with any compatible client, including Claude Code, Cursor, and Kiro.

## Why use agent skills

Building with OpenSearch typically involves multiple steps: starting a cluster, designing an index mapping, choosing a search strategy, ingesting data, writing queries, and evaluating results. Without guidance, an AI assistant has to figure out each step from scratch, which leads to inconsistent results and back-and-forth clarification.

Agent skills solve this by giving the assistant a proven, opinionated workflow for each task. Instead of generating ad-hoc commands, the assistant follows a structured sequence — asking the right questions, running the right scripts, and producing a working result. The benefits include:

- **Faster time to working code.** A skill compresses hours of trial-and-error into a single conversation. The assistant knows which embedding models work well with OpenSearch, how to set up a hybrid search pipeline, and how to launch a UI to test results — without you having to explain any of it.
- **Consistent, repeatable outcomes.** Skills encode best practices directly. Every run of `opensearch-launchpad` produces an index with the right mappings, a search pipeline with the right processors, and sample queries that actually work.
- **No server required.** Skills run entirely inside the AI client. There is no MCP server to deploy or maintain — the assistant reads the skill's instructions and executes the bundled scripts directly on your machine.
- **Works alongside the MCP server.** If you also have the [OpenSearch MCP Server]({{site.url}}{{site.baseurl}}/ai-agent-integrations/mcp-server/) configured, the assistant can follow the skill's workflow *and* make live API calls to inspect cluster state, verify mappings, or run test queries — all in the same session.
- **Extensible.** Skills are plain Markdown files. You can fork the repository, add your own skill for a custom workflow, and share it with your team.

## Available skills

| Category | Skill | What it does |
|----------|-------|--------------|
| Search | [`opensearch-launchpad`](https://github.com/opensearch-project/opensearch-agent-skills/tree/main/skills/opensearch-skills/search/opensearch-launchpad) | Builds search apps from scratch — BM25, semantic, hybrid, and agentic search |
| Observability | [`log-analytics`](https://github.com/opensearch-project/opensearch-agent-skills/tree/main/skills/opensearch-skills/observability/log-analytics) | Queries and analyzes logs with PPL, including error patterns and anomaly detection |
| Observability | [`trace-analytics`](https://github.com/opensearch-project/opensearch-agent-skills/tree/main/skills/opensearch-skills/observability/trace-analytics) | Investigates distributed traces — slow spans, service maps, agent invocations |
| Cloud | [`aws-setup`](https://github.com/opensearch-project/opensearch-agent-skills/tree/main/skills/opensearch-skills/cloud/aws-setup) | Deploys to Amazon OpenSearch Service or OpenSearch Serverless |

New skills are added over time. See the [source repository](https://github.com/opensearch-project/opensearch-agent-skills) for the current list.

## Prerequisites

- Python 3.11 or later and [`uv`](https://docs.astral.sh/uv/getting-started/installation/).
- Docker, running locally. Skills use Docker to spin up OpenSearch for local experimentation.
- AWS credentials, if you plan to use `aws-setup` to deploy to Amazon OpenSearch Service or Serverless.

## Install

Skills are installed with the [`npx skills`](https://agentskills.io) CLI. Install the full collection:

```bash
npx skills add opensearch-project/opensearch-agent-skills
```
{% include copy.html %}

Or install a single skill:

```bash
npx skills add opensearch-project/opensearch-agent-skills@opensearch-launchpad --full-depth
npx skills add opensearch-project/opensearch-agent-skills@log-analytics --full-depth
npx skills add opensearch-project/opensearch-agent-skills@trace-analytics --full-depth
npx skills add opensearch-project/opensearch-agent-skills@aws-setup --full-depth
```
{% include copy.html %}

### Install options

```bash
# Install to a specific agent
npx skills add opensearch-project/opensearch-agent-skills -a claude-code

# Install globally, so the skill is available to every project
npx skills add opensearch-project/opensearch-agent-skills -g

# Install to every detected agent
npx skills add opensearch-project/opensearch-agent-skills --all

# List the available skills before choosing what to install
npx skills add opensearch-project/opensearch-agent-skills --list
```
{% include copy.html %}

## Use a skill

After installing, start a conversation with your AI assistant and describe what you want. The assistant loads the skill's `SKILL.md` instructions and follows them. An MCP server is not required — the skill runs entirely inside the client.

### Example: building a semantic search app

The following walkthrough shows what a session with the `opensearch-launchpad` skill looks like.

**You:** I want to build a semantic search app with OpenSearch.

**Assistant:** I'll help you build a semantic search application. Let me start by checking if you have a running OpenSearch cluster.

```bash
uv run python scripts/opensearch_ops.py preflight-check
```

No cluster found. Starting one with Docker:

```bash
bash scripts/start_opensearch.sh
```

OpenSearch is running at `http://localhost:9200`. What data do you want to search? You can provide a CSV, JSON, or PDF file, or I can load a sample dataset.

---

**You:** Use the sample e-commerce dataset.

**Assistant:** Loading the sample dataset:

```bash
uv run python scripts/opensearch_ops.py load-sample --dataset ecommerce
```

Loaded 4,675 documents into the `ecommerce` index. Now, which search strategy would you like?

1. **BM25** — keyword search, fast, no ML required
2. **Dense vector** — semantic search using text embeddings
3. **Neural sparse** — semantic search using learned sparse representations
4. **Hybrid** — combines keyword and semantic scoring
5. **Agentic** — LLM-driven multi-step retrieval (requires OpenSearch 3.2+)

---

**You:** Hybrid search.

**Assistant:** Good choice for e-commerce — hybrid search balances exact keyword matches (product names, SKUs) with semantic understanding (intent, synonyms). Here's the plan:

- Embedding model: `amazon/titan-embed-text-v1` (via ML Commons)
- Index: `ecommerce-hybrid` with both `text` and `embedding` fields
- Search pipeline: normalization processor combining BM25 and k-NN scores

Shall I proceed?

---

**You:** Yes.

**Assistant:** Setting up the hybrid search pipeline:

```bash
uv run python scripts/opensearch_ops.py setup-index \
  --strategy hybrid \
  --index ecommerce-hybrid \
  --source-index ecommerce
```

Done. Launching the Search Builder UI:

```bash
uv run python scripts/opensearch_ops.py launch-ui --index ecommerce-hybrid
```

Your search app is live at `http://127.0.0.1:8765`. Try a query like *"comfortable running shoes under $100"* to see hybrid scoring in action.

---

### Other skill examples

- **Log analytics** — *"Find the top 5 error patterns in my logs over the last 24 hours."* The `log-analytics` skill generates PPL queries, runs them against your logs index, and summarizes the patterns.
- **Trace analytics** — *"Show me the slowest spans for the checkout service."* The `trace-analytics` skill queries the traces index for high-latency spans and renders a service map summary.

### Using skills alongside the MCP server

Skills and the MCP server work well together. The `opensearch-launchpad` skill's `SKILL.md` includes an optional MCP server config block that you can add to your client to give the assistant direct API access during the session:

```json
{
  "mcpServers": {
    "opensearch": {
      "command": "uvx",
      "args": ["opensearch-mcp-server-py"],
      "env": {
        "OPENSEARCH_URL": "http://localhost:9200",
        "OPENSEARCH_USERNAME": "admin",
        "OPENSEARCH_PASSWORD": "admin",
        "OPENSEARCH_SSL_VERIFY": "false"
      }
    }
  }
}
```
{% include copy.html %}

With both active, the assistant can follow the skill's structured workflow *and* make live API calls to inspect index state, run test queries, or verify mappings without leaving the conversation.

## Next steps

- [opensearch-agent-skills on GitHub](https://github.com/opensearch-project/opensearch-agent-skills)
- [Agent Skills specification](https://agentskills.io/specification)
- [OpenSearch MCP Server]({{site.url}}{{site.baseurl}}/ai-agent-integrations/mcp-server/) — for direct API access from an AI client
- [Using MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/mcp/) — to call external MCP servers from an OpenSearch agent
