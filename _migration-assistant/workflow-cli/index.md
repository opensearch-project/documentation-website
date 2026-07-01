---
layout: default
title: Workflow CLI
nav_order: 50
has_children: true
has_toc: false
permalink: /migration-assistant/workflow-cli/
---

# Workflow CLI

The Workflow CLI is the operator interface for Migration Assistant. It provides a repeatable way to run migrations without manually chaining individual infrastructure commands.

Migration Assistant runs each migration as an [Argo Workflows](https://argo-workflows.readthedocs.io/en/latest/) job. Argo is a Kubernetes-native workflow engine that schedules each step (snapshot, metadata migration, backfill, replay, validation) as a pod and tracks its status. You don't need to know Argo to operate Migration Assistant; the Workflow CLI is the layer you interact with.

## Design principles

Migration Assistant uses Kubernetes and workflows to achieve the following:

- Describe the migration once instead of typing one-time commands.
- Let the platform orchestrate long-running steps.
- Make progress visible.
- Pause at approval gates when human validation matters.
- Resubmit the workflow safely after configuration changes without rebuilding the environment.

## Standard operator workflow

Most migrations follow the same pattern:

1. Open the Migration Console.
2. Verify the installed version by running `console --version`.
3. Load the version-matched sample config by running `workflow configure sample --load`.
4. Edit only the fields that describe your environment and migration path.
5. Validate connectivity by running `console clusters connection-check`.
6. Submit a pilot workflow.
7. Watch progress and approvals by running `workflow manage`.
8. Validate the pilot, then run the full migration.

## Core commands

The Workflow CLI groups commands into the following sections.

### Console commands

The `console` CLI groups operations by component. The `workflow` CLI orchestrates a full migration; the `console` CLI is what you use to inspect or manually drive a single component during validation and troubleshooting.

#### Cluster inspection commands

<table>
<thead>
<tr><th>Command</th><th>Description</th></tr>
</thead>
<tbody>
<tr><td><code>console --version</code></td><td>Confirms which schema and behavior your console is running.</td></tr>
<tr><td><code>console clusters connection-check</code></td><td>Verifies the console can reach and authenticate to source and target clusters.</td></tr>
<tr><td><code>console clusters connection-check --cluster source|target|proxy</code></td><td>Restricts the check to one cluster.</td></tr>
<tr><td><code>console clusters cat-indices [--refresh] [--cluster source|target|proxy]</code></td><td>Lists indexes on one or both clusters.</td></tr>
<tr><td><code>console clusters curl source /_cat/indices?v</code></td><td>Issues a direct API request against the named cluster (path is positional).</td></tr>
<tr><td><code>console clusters curl target /_search -X POST --json '{"query":{"match_all":{}}}'</code></td><td>Sends a <code>POST</code> request with a JSON body.</td></tr>
<tr><td><code>console clusters clear-indexes --cluster target --acknowledge-risk</code></td><td><strong>Destructive</strong>. Deletes all indexes on the named cluster.</td></tr>
</tbody>
</table>

#### Metrics and Apache Kafka commands

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
| `workflow configure edit --stdin` | Reads YAML from `stdin` instead of opening an editor---useful in scripts and CI |
| `workflow configure view` | Prints the current config |
| `workflow configure clear` | Clears the current config and lets you start over |

### Execution and monitoring commands

<table>
<thead>
<tr><th>Command</th><th>Description</th></tr>
</thead>
<tbody>
<tr><td><code>workflow submit</code></td><td>Starts the migration workflow (auto-stops and replaces an existing one with the same name).</td></tr>
<tr><td><code>workflow submit --wait --timeout 300</code></td><td>Submits and blocks until the workflow completes or the timeout is reached.</td></tr>
<tr><td><code>workflow manage</code></td><td>Primary interface for monitoring, approvals, and logs (interactive TUI).</td></tr>
<tr><td><code>workflow status</code></td><td>Shows the current workflow tree in a non-interactive form.</td></tr>
<tr><td><code>workflow status --all</code></td><td>Shows running and completed workflows.</td></tr>
<tr><td><code>workflow status --live-status</code></td><td>Adds live snapshot/backfill status checks per node.</td></tr>
<tr><td><code>workflow log all</code></td><td>Shows logs across workflow pods (uses pod labels to find them).</td></tr>
<tr><td><code>workflow log all --follow</code></td><td>Streams logs live (uses <code>stern</code> internally).</td></tr>
<tr><td><code>workflow log filter -l source=src,target=tgt</code></td><td>Filters by label selector.</td></tr>
<tr><td><code>workflow approve step &lt;PATTERN&gt; [&lt;PATTERN&gt; ...]</code></td><td>Approves pending gates that match exact names or globs (for example, <code>*.evaluateMetadata</code>).</td></tr>
<tr><td><code>workflow reset</code></td><td>Lists migration CRDs and lets you delete them safely. Use this instead of <code>kubectl delete workflow ...</code>.</td></tr>
<tr><td><code>workflow reset --all</code></td><td>Deletes all migration CRDs (capture proxies are protected by default; add <code>--include-proxies</code> to remove them).</td></tr>
<tr><td><code>workflow reset &lt;NAME&gt; --cascade</code></td><td>Deletes a specific resource and its dependents.</td></tr>
<tr><td><code>workflow util completions &lt;bash|zsh|fish&gt;</code></td><td>Generates a shell completion script.</td></tr>
</tbody>
</table>

## The workflow manage command

The `workflow manage` command opens a full-screen terminal user interface (TUI) for monitoring and managing workflow execution. It provides the following capabilities:

- Viewing step-by-step workflow status (waiting, running, or failed).
- Opening logs without switching tools.
- Approving gated steps when they are ready.

## Approval gates

Not every migration step should run without human review. Approval gates let the workflow stop at meaningful checkpoints so you can validate before continuing.

Typical approval points include transitions after metadata migration, backfill milestones, and cutover-sensitive steps. To view and approve gates, run the following commands:

```bash
workflow manage
workflow approve step <STEP_NAME>
```
{% include copy.html %}

## Status symbols

The following table describes the symbols displayed in workflow status output.

| Symbol | Meaning |
|:-------|:--------|
| `✓` | Succeeded |
| `▶` | Running |
| `○` | Pending |
| `✗` | Failed |
| `⟳` | Waiting for approval |

## Version-matched sample configuration

The workflow schema changes between releases. Always load the sample configuration that matches your installed version rather than writing the configuration manually. To load the sample and edit it, run the following commands:

```bash
console --version
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}


## Schema-aware editing

Each release publishes a `workflowMigration.schema.json` asset. The console also keeps the active schema locally so your editor and validation can stay aligned with the installed version.

On the Migration Console, the schema is available at:

```text
/root/.workflowUser.schema.json
```

The CLI uses this schema automatically when editing and validating configurations, so no separate download is required.

For an interactive reference of all available fields, their types, defaults, and descriptions, see the [Migration Assistant Schema Viewer](https://opensearch-project.github.io/opensearch-migrations/).

## Related documentation

| Topic | Link |
|:------|:-----|
| First workflow | [Using the Workflow CLI]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/) |
| Deployment choice | [Choose your deployment]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/) |
| Elasticsearch 6.8 to OpenSearch 3.5 | [Playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-elasticsearch-6-8-to-opensearch-3/) |
| Amazon OpenSearch Service to Serverless | [Playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-amazon-opensearch-service-to-serverless/) |
| Interactive schema reference | [Migration Assistant Schema Viewer](https://opensearch-project.github.io/opensearch-migrations/) |
