---
layout: default
title: "Install: IDE agent"
nav_order: 1
parent: Migration Companion
permalink: /migration-assistant/migration-companion/ide-agent/
---

# Install Migration Companion in your IDE

Use your IDE's built-in AI agent (Cursor, VS Code + Cline, Kiro, Windsurf, or any MCP-compatible agent) as the Migration Companion. The opensearch-migrations repository contains steering docs, knowledge bases, and tool definitions that turn any capable AI agent into a migration expert.

## Prerequisites

- An AI-enabled IDE with agent/chat capabilities
- Git
- AWS CLI (for EKS deployments)
- kubectl and Helm (installed automatically by the bootstrap script on EKS)

## Step 1: Clone the repository

```bash
git clone https://github.com/opensearch-project/opensearch-migrations.git
cd opensearch-migrations
```
{% include copy.html %}

The repository IS the companion. It contains:

| Directory | Purpose |
|:----------|:--------|
| `agent-sops/` | Standard operating procedures that guide the AI through each migration phase |
| `kiro-cli/kiro-cli-config/steering/` | Steering docs with migration best practices, safety guardrails, and domain knowledge |
| `orchestrationSpecs/` | Workflow schema and config processor — the AI uses these to generate valid workflow configs |
| `deployment/k8s/` | Helm charts and bootstrap scripts for deployment |

## Step 2: Open in your IDE

Open the `opensearch-migrations` directory in your IDE. The AI agent will automatically discover the steering docs and SOPs.

### Agent configuration

Most AI agents will work out of the box by reading the repository's steering files. For agents that support explicit configuration:

- **MCP tools**: The companion exposes tools via the Model Context Protocol for cluster analysis, sizing estimation, and workflow management. Check your agent's MCP configuration docs.
- **Context files**: Point your agent at `agent-sops/` and `kiro-cli/kiro-cli-config/steering/` for migration-specific knowledge.
- **System prompts**: The steering docs in `kiro-cli/kiro-cli-config/steering/product.md` describe the migration domain and supported paths.

## Step 3: Start the conversation

Open your IDE's AI chat and describe your migration goal:

```
I need to migrate from Elasticsearch 7.10 to OpenSearch. My source cluster 
is running on EC2 at https://my-es-cluster:9200. I want to deploy the 
migration infrastructure on EKS in us-east-2.
```

The companion will:
1. Ask clarifying questions (authentication, target preferences, downtime tolerance)
2. Assess your source cluster
3. Recommend a migration strategy
4. Guide you through deployment and execution

## Step 4: Provide credentials

The companion needs access to your source cluster and AWS account. Provide credentials as you normally would for your environment:

- **AWS**: Configure via `aws configure`, environment variables, or IAM role
- **Source cluster**: Basic auth credentials, SigV4, or mTLS as appropriate

The companion will create Kubernetes secrets for cluster authentication as part of the deployment flow.

## What the companion can do

| Capability | How it works |
|:-----------|:-------------|
| Assess source cluster | Connects via REST API, analyzes version, schemas, and compatibility |
| Estimate target sizing | Uses the sizing calculator MCP tool (Elasticsearch/OpenSearch sources) |
| Deploy on EKS | Runs `aws-bootstrap.sh` with appropriate flags |
| Deploy on K8s | Runs `helm install` with appropriate values |
| Generate workflow config | Produces valid YAML from the current `workflowMigration.schema.json` |
| Submit and monitor | Runs `workflow submit`, `workflow status`, `workflow manage` |
| Validate results | Compares document counts and runs test queries |

## What the companion cannot do yet

The following capabilities are planned but not yet available:

Sizing estimation for Solr sources is not yet implemented. The companion will note this gap and ask you to provide target sizing manually.
{: .warning }

Workflow API endpoints for programmatic `configure`, `submit`, `status`, and `approve` are not yet available. The companion currently drives these operations by executing CLI commands on the migration console pod.
{: .warning }

A persistent migration session that carries assessment results, sizing recommendations, deployment state, and workflow IDs across conversations is not yet implemented. Each conversation starts fresh, though the companion can read existing cluster and workflow state.
{: .warning }

## Next steps

Once the companion has deployed Migration Assistant and submitted a workflow, you can:

- Monitor progress via `workflow manage` (interactive TUI)
- Review the [architecture]({{site.url}}{{site.baseurl}}/migration-assistant/architecture/) to understand what's running
- Check [troubleshooting]({{site.url}}{{site.baseurl}}/migration-assistant/troubleshooting/) if issues arise
