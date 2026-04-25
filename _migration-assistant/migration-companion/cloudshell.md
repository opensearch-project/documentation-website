---
layout: default
title: "Install: AWS CloudShell"
nav_order: 2
parent: Migration Companion
permalink: /migration-assistant/migration-companion/cloudshell/
---

# Install Migration Companion in AWS CloudShell

This install modality is not yet available. The following describes the intended experience.
{: .warning }

AWS CloudShell provides a browser-based terminal with AWS credentials pre-configured. The Migration Companion bootstrap script installs the companion tooling and connects to Amazon Bedrock for AI capabilities — no separate API key needed.

## Intended experience

### Step 1: Open CloudShell

Open [AWS CloudShell](https://console.aws.amazon.com/cloudshell/) from the AWS Console in the region where you want to deploy.

### Step 2: Bootstrap the companion

```bash
curl -sSL https://releases.opensearch.org/migration-companion/bootstrap.sh | bash
```

This script will:
- Clone the opensearch-migrations repository
- Install required tools (kubectl, Helm)
- Configure the AI CLI to use Amazon Bedrock
- Start the companion session

### Step 3: Start the conversation

The companion opens an interactive session. Describe your migration:

```
I need to migrate my Amazon Elasticsearch Service 7.10 domain to 
Amazon OpenSearch Service 2.19. The domain is in us-east-1.
```

The companion uses your CloudShell AWS credentials automatically — no additional credential setup needed for AWS resources.

## How it differs from the IDE modality

| Aspect | CloudShell | IDE agent |
|:-------|:-----------|:----------|
| AI provider | Amazon Bedrock (automatic) | Your IDE's AI (Cursor, Cline, Kiro, etc.) |
| AWS credentials | Pre-configured in CloudShell | You configure via `aws configure` or env vars |
| Session persistence | CloudShell home directory (1 GB, persists across sessions) | Local filesystem |
| Best for | Quick start from the AWS Console, no local setup | Developers who want full IDE integration |

## Current status

The CloudShell bootstrap script is not yet published. Today, you can use CloudShell as a terminal to run the [EKS deployment]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/) manually, or use the [IDE agent]({{site.url}}{{site.baseurl}}/migration-assistant/migration-companion/ide-agent/) modality instead.
