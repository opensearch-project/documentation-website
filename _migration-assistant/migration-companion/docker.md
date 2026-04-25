---
layout: default
title: "Install: Docker"
nav_order: 3
parent: Migration Companion
permalink: /migration-assistant/migration-companion/docker/
---

# Install Migration Companion with Docker

This install modality is not yet available. The following describes the intended experience.
{: .warning }

The Docker modality packages the Migration Companion as a container image with a built-in AI CLI. State persists across sessions via a mounted volume. This is ideal for local environments, air-gapped networks, and CI/CD pipelines.

## Intended experience

### Step 1: Pull and run

```bash
docker run -it \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  -v ~/.migration-companion:/workspace/state \
  public.ecr.aws/opensearchproject/opensearch-migrations-migration-companion:latest
```

The container includes:
- The opensearch-migrations repository with all steering docs and SOPs
- A built-in AI CLI (Claude by default)
- kubectl, Helm, AWS CLI, and all required tools
- The sizing calculator and workflow schema

### Step 2: Start the conversation

The companion opens an interactive terminal session:

```
Welcome to OpenSearch Migration Companion.

I can help you migrate from Elasticsearch, OpenSearch, or Apache Solr 
to OpenSearch. Tell me about your source cluster and I'll guide you 
through the entire process.

> I have an Elasticsearch 6.8 cluster with 500GB of data running on 
  EC2. I need to migrate to OpenSearch 3.x on EKS.
```

### Step 3: Provide credentials

Mount your AWS credentials or pass them as environment variables:

```bash
docker run -it \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  -e AWS_ACCESS_KEY_ID=... \
  -e AWS_SECRET_ACCESS_KEY=... \
  -e AWS_SESSION_TOKEN=... \
  -v ~/.migration-companion:/workspace/state \
  public.ecr.aws/opensearchproject/opensearch-migrations-migration-companion:latest
```

Or mount your AWS config:

```bash
docker run -it \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  -v ~/.aws:/root/.aws:ro \
  -v ~/.migration-companion:/workspace/state \
  public.ecr.aws/opensearchproject/opensearch-migrations-migration-companion:latest
```

## AI provider configuration

The Docker image ships with Claude as the default AI provider. To use a different provider:

| Provider | Configuration |
|:---------|:-------------|
| Claude (default) | Set `ANTHROPIC_API_KEY` environment variable |
| Amazon Bedrock | Set `AWS_REGION` and ensure IAM role has Bedrock access |
| Bring your own | Mount a custom AI CLI configuration |

The AI provider configuration is not yet finalized. Details will be updated when the Docker modality is released.
{: .warning }

## How it differs from other modalities

| Aspect | Docker | CloudShell | IDE agent |
|:-------|:-------|:-----------|:----------|
| AI provider | Configurable (Claude default) | Amazon Bedrock | Your IDE's AI |
| Requires internet | For AI API calls and AWS access | Yes (CloudShell) | For AI and AWS |
| Session persistence | Mounted volume | CloudShell home dir | Local filesystem |
| Best for | Local/air-gapped, CI/CD, no IDE | Quick AWS start | Full IDE integration |

## Current status

The companion Docker image (`opensearch-migrations-migration-companion`) exists in ECR but does not yet provide the full interactive companion experience described above. Today, use the [IDE agent]({{site.url}}{{site.baseurl}}/migration-assistant/migration-companion/ide-agent/) modality for the most complete experience.
