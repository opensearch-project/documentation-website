---
layout: default
title: Agent skills
nav_order: 20
---

# Agent skills

Building applications using OpenSearch typically involves multiple steps: starting a cluster, designing an index mapping, choosing a search strategy, ingesting data, writing queries, and evaluating results. Without guidance, an AI assistant must infer each step independently, which can lead to inconsistent results and repeated requests for clarification.

[OpenSearch agent skills](https://github.com/opensearch-project/opensearch-agent-skills) are packaged workflows that teach AI coding assistants how to work with OpenSearch. Each skill bundles instructions, reference material, and executable scripts. You can ask a natural-language question (for example, *"build a semantic search app with OpenSearch"*) and receive working code, configured indexes, and runnable tests.

Skills follow the [Agent Skills specification](https://agentskills.io/specification) and work with any compatible client, including Claude Code, Cursor, and Kiro.

Agent skills have the following characteristics:

- Skills provide structured workflows that include embedding model selection, search pipeline configuration, and testing procedures.
- Each skill follows a consistent implementation pattern, producing the same index mappings, search pipeline processors, and query templates.
- Skills run inside the AI client. The assistant reads the skill instructions and executes bundled scripts on your local machine.
- Skills can be used alongside the [OpenSearch MCP Server]({{site.url}}{{site.baseurl}}/ai-agent-integrations/mcp-server/). When both are configured, the assistant can follow the skill workflow and make direct API calls to inspect cluster state or verify configurations.
- Skills are Markdown files that can be modified or extended for custom workflows.

## Available skills

The following table lists the available skills.

| Category | Skill | Function |
|----------|-------|--------------|
| Search | [`opensearch-launchpad`](https://github.com/opensearch-project/opensearch-agent-skills/tree/main/skills/opensearch-skills/search/opensearch-launchpad) | Builds search applications, such as BM25, semantic, hybrid, and agentic search. |
| Observability | [`log-analytics`](https://github.com/opensearch-project/opensearch-agent-skills/tree/main/skills/opensearch-skills/observability/log-analytics) | Uses PPL to query and analyze logs, identify error patterns, and detect anomalies. |
| Observability | [`trace-analytics`](https://github.com/opensearch-project/opensearch-agent-skills/tree/main/skills/opensearch-skills/observability/trace-analytics) | Investigates distributed traces, including slow spans, service maps, and agent invocations. |
| Cloud | [`aws-setup`](https://github.com/opensearch-project/opensearch-agent-skills/tree/main/skills/opensearch-skills/cloud/aws-setup) | Deploys OpenSearch to Amazon OpenSearch Service or Amazon OpenSearch Serverless. |

For a complete skill list, see the [skills repository](https://github.com/opensearch-project/opensearch-agent-skills).

## Prerequisites

Before using agent skills, ensure that you have the following components:

- Python 3.11 or later.
- [`uv`](https://docs.astral.sh/uv/getting-started/installation/).
- Docker installed and running locally. Skills use Docker to launch OpenSearch for local experimentation.
- AWS credentials, if you plan to use `aws-setup` to deploy OpenSearch to Amazon OpenSearch Service or Amazon OpenSearch Serverless.

## Installing skills

Use the [`npx skills`](https://agentskills.io) command to install skills. 

To install all skills, run the following command:

```bash
npx skills add opensearch-project/opensearch-agent-skills
```
{% include copy.html %}

To install a single skill, run the following command:

```bash
npx skills add opensearch-project/opensearch-agent-skills@opensearch-launchpad --full-depth
npx skills add opensearch-project/opensearch-agent-skills@log-analytics --full-depth
npx skills add opensearch-project/opensearch-agent-skills@trace-analytics --full-depth
npx skills add opensearch-project/opensearch-agent-skills@aws-setup --full-depth
```
{% include copy.html %}

### Installation options

The following table lists the available installation options.

| Option | Description | Example |
| :--- | :--- | :--- |
| `-a <agent>` | Installs skills for a specific agent. For a list of supported agents, see [agentskills.io](https://agentskills.io/). | `npx skills add opensearch-project/opensearch-agent-skills -a claude-code` |
| `-g` | Installs skills globally so they are available for every project. | `npx skills add opensearch-project/opensearch-agent-skills -g` |
| `--all` | Installs skills for every detected agent. | `npx skills add opensearch-project/opensearch-agent-skills --all` |
| `--list` | Lists the available skills before installing. | `npx skills add opensearch-project/opensearch-agent-skills --list` |

## Using a skill

After installing a skill, start a conversation with your AI assistant and describe your request. The assistant loads the skill's `SKILL.md` instructions and follows them. An MCP server is not required; the skill runs entirely inside the client.

### Example: Building a semantic search application

The following walkthrough demonstrates a session using the `opensearch-launchpad` skill.

**User**: I want to build a semantic search app with OpenSearch.

**Assistant**: I'll help you build a semantic search application. Let me start by checking if you have a running OpenSearch cluster.

```bash
uv run python scripts/opensearch_ops.py preflight-check
```

No cluster found. Starting one with Docker:

```bash
bash scripts/start_opensearch.sh
```

OpenSearch is running at `http://localhost:9200`. What data do you want to search? You can provide a CSV, JSON, or PDF file, or I can load a sample dataset.

---

**User**: Use the sample e-commerce dataset.

**Assistant**: Loading the sample dataset:

```bash
uv run python scripts/opensearch_ops.py load-sample --dataset ecommerce
```

Loaded 4,675 documents into the `ecommerce` index. Now, which search strategy would you like?

1. BM25 — keyword search, fast, no ML required
2. Dense vector — semantic search using text embeddings
3. Neural sparse — semantic search using learned sparse representations
4. Hybrid — combines keyword and semantic scoring
5. Agentic — LLM-driven multi-step retrieval (requires OpenSearch 3.2+)

---

**User**: Hybrid search.

**Assistant**: Good choice for e-commerce — hybrid search balances exact keyword matches (product names, SKUs) with semantic understanding (intent, synonyms). Here's the plan:

- Embedding model: `amazon/titan-embed-text-v1` (using ML Commons)
- Index: `ecommerce-hybrid` with both `text` and `embedding` fields
- Search pipeline: normalization processor combining BM25 and k-NN scores

Shall I proceed?

---

**User**: Yes.

**Assistant**: Setting up the hybrid search pipeline:

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

The following examples demonstrate other available skills:

- Log analytics: *"Find the top 5 error patterns in my logs over the last 24 hours."* The `log-analytics` skill generates PPL queries, runs them against your logs index, and summarizes the patterns.
- Trace analytics: *"Show me the slowest spans for the checkout service."* The `trace-analytics` skill queries the traces index for high-latency spans and renders a service map summary.

### Using skills with the MCP server

Skills are designed to work in conjunction with the MCP server. When using a skill with the MCP server configured, the assistant can follow the skill's structured workflow and make live API calls to inspect index state, run test queries, or verify mappings without leaving the conversation.

The `opensearch-launchpad` skill's `SKILL.md` includes an optional MCP server configuration block. You can add this block to your client configuration in order to provide the assistant with direct API access during the session:

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

## Related documentation

- [`opensearch-agent-skills`](https://github.com/opensearch-project/opensearch-agent-skills) -- Agent skills repository on GitHub.
- [Agent Skills specification](https://agentskills.io/specification) -- Specification documentation.
- [OpenSearch MCP Server]({{site.url}}{{site.baseurl}}/ai-agent-integrations/mcp-server/) -- Direct API access from an AI client.
- [Using MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/mcp/) -- External MCP server integration from OpenSearch agents.
