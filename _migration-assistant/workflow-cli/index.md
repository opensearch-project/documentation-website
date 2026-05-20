---
layout: default
title: Workflow CLI
nav_order: 50
has_children: true
has_toc: true
permalink: /migration-assistant/workflow-cli/
---

# Workflow CLI

The Workflow CLI is the operator interface for Migration Assistant. It gives you a simple, repeatable way to run migrations without manually stitching together individual infrastructure commands.

Under the hood, Migration Assistant runs each migration as an [Argo Workflows](https://argo-workflows.readthedocs.io/en/latest/) job — Argo is a Kubernetes-native workflow engine that schedules each step (snapshot, metadata migration, backfill, replay, validation) as a pod and tracks its status. You don't need to know Argo to operate Migration Assistant; the Workflow CLI is the layer you actually interact with.

## Why this model exists

Migration Assistant is designed around a Kubernetes and workflow-based philosophy:

- describe the migration once instead of typing one-off commands
- let the platform orchestrate long-running steps
- make progress visible
- pause at approval gates when human validation matters
- rerun safely after changes instead of rebuilding the whole environment

This is the main shift from the older deployment model. The tooling is trying to reduce operator guesswork.

## The normal operator loop

Most migrations follow the same pattern:

1. Open the Migration Console.
2. Check the installed version with `console --version`.
3. Load the version-matched sample config with `workflow configure sample --load`.
4. Edit only the fields that describe your environment and migration path.
5. Validate connectivity with `console clusters connection-check`.
6. Submit a pilot workflow.
7. Watch progress and approvals with `workflow manage`.
8. Validate the pilot, then run the real migration.

## Core commands

The Workflow CLI groups commands into the following sections.

### Console commands

The `console` CLI groups operations by component. The `workflow` CLI orchestrates a full migration; the `console` CLI is what you use to inspect or manually drive a single component during validation and troubleshooting.

#### Cluster inspection

<table>
<thead>
<tr><th>Command</th><th>Why you use it</th></tr>
</thead>
<tbody>
<tr><td><code>console --version</code></td><td>Confirms which schema and behavior your console is running</td></tr>
<tr><td><code>console clusters connection-check</code></td><td>Verifies the console can reach and authenticate to source and target clusters</td></tr>
<tr><td><code>console clusters connection-check --cluster source|target|proxy</code></td><td>Restricts the check to one cluster</td></tr>
<tr><td><code>console clusters cat-indices [--refresh] [--cluster source|target|proxy]</code></td><td>Lists indexes on one or both clusters</td></tr>
<tr><td><code>console clusters curl source /_cat/indexes?v</code></td><td>Issues a direct API request against the named cluster (path is positional)</td></tr>
<tr><td><code>console clusters curl target /_search -X POST --json '{"query":{"match_all":{}}}'</code></td><td>POST with a JSON body</td></tr>
<tr><td><code>console clusters clear-indexes --cluster target --acknowledge-risk</code></td><td><strong>Destructive</strong> — deletes all indexes on the named cluster</td></tr>
</tbody>
</table>

#### Metrics and Kafka

| Group | Commands |
|:------|:---------|
| `console metrics` | `list`, `get-data` |
| `console kafka` | `create-topic`, `list-topics`, `delete-topic`, `describe-consumer-group`, `list-consumer-groups`, `describe-topic-records` |

### Configuration commands

| Command | Why you use it |
|:--------|:---------------|
| `workflow configure sample` | Shows the sample schema for your installed version |
| `workflow configure sample --load` | Loads that sample as your starting point |
| `workflow configure edit` | Opens the workflow config in your editor (`$EDITOR`, defaults to `vi`) |
| `workflow configure edit --stdin` | Reads YAML from stdin instead of opening an editor — useful in scripts and CI |
| `workflow configure view` | Prints the current config |
| `workflow configure clear` | Clears the current config and lets you start over |

### Execution and monitoring commands

<table>
<thead>
<tr><th>Command</th><th>Why you use it</th></tr>
</thead>
<tbody>
<tr><td><code>workflow submit</code></td><td>Starts the migration workflow (auto-stops and replaces an existing one with the same name)</td></tr>
<tr><td><code>workflow submit --wait --timeout 300</code></td><td>Submits and blocks until the workflow completes or the timeout is reached</td></tr>
<tr><td><code>workflow manage</code></td><td>Primary day-to-day interface for monitoring, approvals, and logs (interactive TUI)</td></tr>
<tr><td><code>workflow status</code></td><td>Shows the current workflow tree in a non-interactive form</td></tr>
<tr><td><code>workflow status --all</code></td><td>Shows running and completed workflows</td></tr>
<tr><td><code>workflow status --live-status</code></td><td>Adds live snapshot/backfill status checks per node</td></tr>
<tr><td><code>workflow log all</code></td><td>Shows logs across workflow pods (uses pod labels to find them)</td></tr>
<tr><td><code>workflow log all --follow</code></td><td>Streams logs live (uses <code>stern</code> under the hood)</td></tr>
<tr><td><code>workflow log filter -l source=src,target=tgt</code></td><td>Filters by label selector</td></tr>
<tr><td><code>workflow approve step &lt;PATTERN&gt; [&lt;PATTERN&gt; ...]</code></td><td>Approves pending gates that match exact names or globs (for example <code>*.evaluateMetadata</code>)</td></tr>
<tr><td><code>workflow reset</code></td><td>Lists migration CRDs and lets you delete them safely. Use this instead of <code>kubectl delete workflow ...</code></td></tr>
<tr><td><code>workflow reset --all</code></td><td>Deletes all migration CRDs (capture proxies are protected by default — add <code>--include-proxies</code> to remove them too)</td></tr>
<tr><td><code>workflow reset &lt;NAME&gt; --cascade</code></td><td>Deletes a specific resource and its dependents</td></tr>
<tr><td><code>workflow util completions &lt;bash|zsh|fish&gt;</code></td><td>Generates a shell completion script</td></tr>
</tbody>
</table>

## Use the workflow manage command as the primary interface

`workflow manage` is a **terminal user interface (TUI)** — a full-screen interactive console that runs in your shell. Use it whenever possible. It is the easiest way to understand what the workflow is doing.

It lets you:

- see step-by-step status in one place
- open logs without switching tools
- approve gated steps when they are ready
- understand whether a workflow is waiting, running, or failed

## Approval gates

Not every migration step should run without human review. Approval gates let the workflow stop at meaningful checkpoints so you can validate before continuing.

Typical approval points include transitions after metadata work, backfill milestones, and cutover-sensitive steps.

```bash
workflow manage
workflow approve step <STEP_NAME>
```
{% include copy.html %}

## Status symbols

| Symbol | Meaning |
|:-------|:--------|
| `✓` | Succeeded |
| `▶` | Running |
| `○` | Pending |
| `✗` | Failed |
| `⟳` | Waiting for approval |

## Always start from the version-matched sample

Do not build workflow JSON from memory or from an old doc example. The schema evolves by release.

```bash
console --version
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}

That is the safest way to get a valid configuration for the exact console version you are running.

## Schema-aware editing

Each release publishes a `workflowMigration.schema.json` asset. The console also keeps the active schema locally so your editor and validation can stay aligned with the installed version.

On the Migration Console, the schema is available at:

```text
/root/.workflowUser.schema.json
```

The CLI already uses that schema when editing and validating configurations, so most users do not need to download anything separately.

## Related guides

| Topic | Link |
|:------|:-----|
| First workflow | [Getting started]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/) |
| Deployment choice | [Choose your deployment]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/) |
| Elasticsearch 6.8 to OpenSearch 3.5 | [Playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-elasticsearch-6-8-to-opensearch-3/) |
| Amazon OpenSearch Service to Serverless | [Playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-amazon-opensearch-service-to-serverless/) |
