---
layout: default
title: Agentic memory retention
parent: Memory and context
nav_order: 30
---

# Agentic memory retention
**Introduced 3.8**
{: .label .label-purple }

When AI agents use memory containers to store conversations (sessions), distilled knowledge (long-term memory), and audit trails (history), that data grows without bound. Without lifecycle management, storage costs increase continuously, agents retrieve stale or contradictory memories that degrade response quality, and larger context windows drive up inference costs.

A memory retention policy solves this by letting you define rules that automatically delete old or excess memories on a schedule. You set the rules, and a background job enforces them. This page explains how to configure retention on your [memory containers]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agentic-memory/).

Retention is opt-in. The feature is gated by a primary switch, `plugins.ml_commons.memory.retention_enabled`, which defaults to `false`. Until an administrator enables it, the memory container APIs reject any `retention_policy` or `pinned` input with a 403 error, and the background job short-circuits without deleting anything. For more information, see [Feature flags and administrator controls](#feature-flags-and-administrator-controls).
{: .note}

## Memory types at a glance

A memory container holds four types of memory. The retention policy you configure on a container applies to three of them: `sessions`, `long-term`, and `history`. The fourth type, `working` memory, is never configured directly in the retention policy.

| Memory type | What it stores | Configured in the retention policy? | Supports `retention_days` | Supports `max_count` | Supports `pinned` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sessions` | Conversation sessions between a user and an agent | Yes | Yes | Yes | Yes |
| `long-term` | Distilled knowledge extracted from conversations | Yes | Yes | Yes | Yes |
| `history` | Immutable audit trail of all interactions | Yes | No | Yes | No |
| `working` | Individual messages within a session | No | Not directly configurable | Not directly configurable | No |

The retention policy is the primary way to control retention, and it covers the first three types only. Working memory is not part of it: it has no `retention_days`, `max_count`, or `pinned` rule of its own. In normal use, working memory is deleted automatically when its parent session expires, so to control how long messages live, you configure retention on `sessions`.

Working memory is managed separately in two cases that the retention policy does not cover. Two cluster-level administrator settings act as safety nets rather than per-container policy fields:

- `working_memory_ttl_days` ages out working memory in session-less containers (those created with `disable_session: true`), which have no parent session to cascade from. It is off by default.
- `orphan_ttl_days` sweeps working memory in session-enabled containers whose parent session no longer exists, for example after a session is manually deleted.

Both are cluster-wide admin controls, not knobs on an individual container's retention policy. Most users never touch them. For details, see [Working memory time-to-live](#working-memory-time-to-live) and [Orphan sweep](#orphan-sweep).

## Quick start

First, an administrator enables retention (it is off by default):

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.memory.retention_enabled": true
  }
}
```
{% include copy-curl.html %}

Then create a memory container with a retention policy that keeps sessions for 90 days (at most 5,000), caps long-term memories at 2,000, and caps history at 100,000:

```json
POST /_plugins/_ml/memory_containers/_create
{
  "name": "my-agent-memory",
  "configuration": {
    "retention_policy": {
      "sessions": {
        "retention_days": 90,
        "max_count": 5000
      },
      "long-term": {
        "max_count": 2000
      },
      "history": {
        "max_count": 100000
      }
    }
  }
}
```
{% include copy-curl.html %}

The background job (which runs every 24 hours by default) enforces these rules automatically.

## Retention policy structure

A retention policy is a JSON object nested inside `configuration.retention_policy` on the memory container. It contains up to three keys, one per eligible memory type:

```json
{
  "configuration": {
    "retention_policy": {
      "sessions": {
        "retention_days": <positive integer or null>,
        "max_count": <positive integer or null>
      },
      "long-term": {
        "retention_days": <positive integer or null>,
        "max_count": <positive integer or null>
      },
      "history": {
        "max_count": <positive integer or null>
      }
    }
  }
}
```
{% include copy.html %}

### Field reference

The following table lists the retention policy fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `retention_days` | Integer or null | Deletes memories older than this many days. Age is measured from the memory's `last_updated_time`. |
| `max_count` | Integer or null | Keeps at most this many memories. When the count is exceeded, the oldest are deleted first. Sessions and long-term memory are ordered by `last_updated_time`; history is ordered by `created_time`. |

Both fields are optional and independent. You can set one, both, or neither for each memory type. When both are set, they act as a logical OR: a memory is deleted if it violates either rule.

### Constraints

- Both `retention_days` and `max_count` must be positive integers (greater than zero) when provided.
- `retention_days` is not supported for the `history` type. The API returns a 400 error if you try to set it.
- The `working` key is not allowed. The API returns a 400 error with guidance to configure sessions instead.
- You only need to include the memory types that you want to manage. Omitted types have no retention enforcement.

## Set a retention policy on a container

You can set a policy when you create a container or update it later.

### At creation time

Include `retention_policy` in the create request:

```json
POST /_plugins/_ml/memory_containers/_create
{
  "name": "customer-support-agent",
  "configuration": {
    "retention_policy": {
      "sessions": {
        "retention_days": 60,
        "max_count": 500
      },
      "long-term": {
        "max_count": 5000
      }
    }
  }
}
```
{% include copy-curl.html %}

### When you do not provide a policy

When no `retention_policy` is specified at creation, no retention enforcement occurs by default. Nothing is automatically deleted.

The only exception applies when retention is enabled (`retention_enabled` is `true`) and your cluster administrator has explicitly configured default retention settings (see [Cluster-level settings for administrators](#cluster-level-settings-for-administrators)). In that case, those values are applied to the container at creation time. Both conditions are required: while retention is disabled, no policy is ever stamped. These administrator defaults are completely optional and are all disabled out of the box. If your administrator has not set them up, a container without an explicit policy simply has no retention, and its data grows without limit until you add a policy yourself.

## Update a retention policy

Use a PUT request to modify the policy on an existing container:

```json
PUT /_plugins/_ml/memory_containers/{memory_container_id}
{
  "configuration": {
    "retention_policy": {
      "sessions": {
        "max_count": 200
      }
    }
  }
}
```
{% include copy-curl.html %}

### Merge behavior

Updates use field-level merge, which means the following:

- Memory types that you include are merged into the existing policy. Fields that you specify are updated; fields that you omit within that type are unchanged.
- Memory types that you omit are left untouched.
- To remove a single field, send it explicitly as `null`. The following request removes `retention_days` from sessions while preserving `max_count`:

  ```json
  { "configuration": { "retention_policy": { "sessions": { "retention_days": null } } } }
  ```
  {% include copy.html %}

### Examples of merge behavior

Consider the following starting policy:

```json
{
  "sessions": { "retention_days": 30, "max_count": 100 },
  "long-term": { "max_count": 5000 }
}
```
{% include copy.html %}

The following table shows how different update requests merge into the starting policy.

| Update request | Resulting policy |
| :--- | :--- |
| `{"sessions": {"max_count": 50}}` | sessions: days=30, count=50; long-term: count=5000 |
| `{"sessions": {"retention_days": null}}` | sessions: count=100 (days removed); long-term: count=5000 |
| `{"history": {"max_count": 10000}}` | sessions: days=30, count=100; long-term: count=5000; history: count=10000 |

## Opt out of retention

To disable all retention enforcement for a container, set the policy to `null`:

```json
PUT /_plugins/_ml/memory_containers/{memory_container_id}
{
  "configuration": {
    "retention_policy": null
  }
}
```
{% include copy-curl.html %}

This is an explicit opt-out. The retention job skips this container entirely, even if cluster-level defaults are configured. This is distinct from simply not having a policy (which allows defaults to be backfilled).

To opt back in later, provide a new concrete policy in a subsequent update.

## Pin memories

Pinning a memory exempts it from all retention enforcement. The retention job never deletes a pinned memory, regardless of its age or the current count.

### Pin a session

Pinning a session preserves the entire conversation, including all of its working memory messages:

```json
PUT /_plugins/_ml/memory_containers/{id}/memories/sessions/{session_id}
{
  "pinned": true
}
```
{% include copy-curl.html %}

### Pin a long-term memory

```json
PUT /_plugins/_ml/memory_containers/{id}/memories/long-term/{memory_id}
{
  "pinned": true
}
```
{% include copy-curl.html %}

### Unpin a memory

Set `pinned` to `false`:

```json
PUT /_plugins/_ml/memory_containers/{id}/memories/sessions/{session_id}
{
  "pinned": false
}
```
{% include copy-curl.html %}

The `pinned` value is sent as a top-level field in the update body, not wrapped in an `update_content` object. Setting `pinned` requires `retention_enabled` to be `true`; otherwise, the update is rejected with a 403 error (the flag is inactive metadata when the job is not running).
{: .note}

### Pinning rules

- Sessions can be pinned. Pinning protects the session and all of its working memory from deletion.
- Long-term memories can be pinned. Pinning protects that specific memory from deletion.
- Working memory cannot be pinned. Pin the parent session instead.
- History cannot be pinned.
- Pinned memories do not count toward `max_count`. If you have `max_count: 100` and 120 sessions, of which 30 are pinned, the job sees 90 non-pinned sessions and keeps the 100 newest non-pinned ones (no deletions in this case).
- Pinning does not reset the memory's age. Only content changes (adding messages to a session or updating memory content) extend lifetime by advancing `last_updated_time`.

## How the retention job works

A background job runs on a schedule (every 24 hours by default) and processes all memory containers. Understanding what it does helps you predict its behavior.

### Execution order

For each container with a retention policy, the job runs these phases in order:

1. Session retention (time-based, then count-based)
1. Long-term memory retention (time-based, then count-based)
1. History retention (count-based only)
1. Working memory time-to-live (only for session-disabled containers)
1. Orphan sweep (runs after all containers are processed)

### Session retention in detail

When `retention_days` is set, sessions whose `last_updated_time` is older than the threshold are deleted. Active conversations (those messaged recently) are safe because adding messages advances `last_updated_time`.

When `max_count` is set, and the number of non-pinned sessions exceeds the cap, the oldest sessions (by `last_updated_time`) are removed until the count is within bounds.

When a session is deleted, all of its working memory messages are deleted first, and then the session document itself is deleted. Conversations are never left with gaps.

### Long-term memory retention in detail

Long-term memory retention works identically to session retention: time-based deletion on `last_updated_time`, then count-based deletion on `last_updated_time`, oldest first. Pinned memories are excluded from both.

On very large backlogs, each count-based (`max_count`) pass evicts at most 50,000 documents per type per run (the oldest first). A larger backlog converges over successive runs.
{: .note}

### History retention in detail

History retention is count-based only. The oldest entries (by `created_time`) are deleted when the non-pinned count exceeds `max_count`.

### Working memory time-to-live

This phase applies only to containers with `disable_session: true` (session-less containers). In these containers, working memory has no parent session to cascade from, so a cluster-level time-to-live (TTL) setting, `plugins.ml_commons.memory.working_memory_ttl_days`, governs when orphaned messages are cleaned up. This TTL defaults to `-1` (disabled), so session-less working memory is kept indefinitely; the pass short-circuits whenever the value is less than or equal to zero. An administrator must set a positive value (from 1 to 365 days) to age it out.

### Orphan sweep

The orphan sweep removes two kinds of working memory documents: those whose parent session no longer exists (for example, if a session was manually deleted) and completely unattributable documents. In both cases, only documents whose `created_time` is older than `plugins.ml_commons.memory.orphan_ttl_days` (7 days by default) are removed. Recently orphaned working memory therefore survives until it ages past that cutoff, even when its parent session is already gone. This prevents accumulation of unreachable data.

The sweep has two safeguards against removing legitimate data:

- **First-observation grace period.** The first time the sweep sees a container, it stamps a baseline timestamp (write-once) and deletes nothing. It defers all orphan deletion for that container until `baseline + orphan_ttl_days` has elapsed. This gives pre-existing working memory a full window to acquire a backing session before it can be swept.
- **Lazy session creation.** When a client adds working memory under its own `session_id` without first calling create-session, the add-memory path idempotently creates a minimal backing session document. The sweep then sees a live session and does not treat that working memory as orphaned. The system deliberately does not backfill sessions for old pre-existing data, because on old data it cannot distinguish "never created a session" from "the user deleted the session."

Distinct `session_id` enumeration is capped at 50,000 per run; larger sets converge over multiple runs.

### Staleness window

Because the job runs periodically rather than in real time, there is a window between when a memory becomes eligible for deletion and when it is actually removed. This window is at most one job interval (24 hours by default). Expired memories may still appear in queries during this window.

## Feature flags and administrator controls

Memory retention is governed by two independent cluster settings that act as on/off switches at different levels. Understanding what each one does prevents confusion when behavior is unexpected.

### The two switches

`plugins.ml_commons.agentic_memory_enabled` (default `true`) controls all agentic memory APIs, including creating, updating, retrieving, and deleting containers and memories. If it is `false`, every memory API returns a 403 error, the retention job is never registered, and nothing memory-related works.

`plugins.ml_commons.memory.retention_enabled` (default `false`) is the primary opt-in switch for the retention feature. It controls the background retention job and the acceptance of `retention_policy` input on the container APIs and `pinned` input on the memory update API. While it is `false`, any request that carries a `retention_policy` or a `pinned` field is rejected with a 403 error, and the job short-circuits and deletes nothing. Other memory APIs (creating containers, adding messages, retrieving, and searching) still work normally. Set it to `true` to accept policies and pins and to have the job enforce them on schedule.

### What each combination means

The following table describes the behavior of each setting combination.

| `agentic_memory_enabled` | `retention_enabled` | What happens |
| :--- | :--- | :--- |
| `true` | `false` | This is the default. All memory APIs work normally: creating containers, adding messages, retrieving, and searching. However, `retention_policy` and `pinned` input is rejected with a 403 error, and the job deletes nothing. |
| `true` | `true` | The retention feature is on. Policies and pins are accepted, and the job enforces them on schedule. |
| `false` | (irrelevant) | All memory APIs return a 403 error. The retention job never registers. The entire agentic memory feature is off. |

### Deciding whether to change these settings

The `agentic_memory_enabled` setting defaults to `true`, so the memory APIs work out of the box. The `retention_enabled` setting defaults to `false`, so the retention feature is opt-in: you must explicitly enable it before you can set any policy or pin any memory. Change these settings in the following situations:

- **You want to use retention at all.** An administrator must set `retention_enabled` to `true` first. Until then, create and update requests that carry a `retention_policy` (or a `pinned` field on a memory) return a 403 error.
- **You are an administrator who wants to pause retention enforcement** after enabling it. For example, you suspect the job is deleting something it should not, or you are performing a migration and want to freeze all data in place temporarily. Set `retention_enabled` back to `false`.
- **Your organization does not use agentic memory** and wants to disable the feature entirely. Set `agentic_memory_enabled` to `false`.

### Pause retention

If something is being deleted that should not be, immediately run the following request:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.memory.retention_enabled": false
  }
}
```
{% include copy-curl.html %}

This takes effect immediately (it is a dynamic setting and requires no restart). The next time the job fires, it logs a message and exits without touching any data. All of your container policies remain saved; they simply stop being enforced.

### Resume retention

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.memory.retention_enabled": true
  }
}
```
{% include copy-curl.html %}

On the next scheduled run (within one job interval), the job resumes enforcing all policies as normal.

### Disable agentic memory entirely

If your cluster does not use memory containers at all and you want to turn off the feature, run the following request:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.agentic_memory_enabled": false
  }
}
```
{% include copy-curl.html %}

After this, any API call to `/_plugins/_ml/memory_containers/...` returns the following response:

```json
{
  "error": {
    "type": "status_exception",
    "reason": "The Agentic Memory APIs are not enabled. To enable, please update the setting plugins.ml_commons.agentic_memory_enabled"
  },
  "status": 403
}
```

### Common mistakes

The following table lists common mistakes and how to resolve them.

| Mistake | What actually happens | Fix |
| :--- | :--- | :--- |
| Setting `retention_enabled` to `false` and expecting policies to still be enforced | No deletions occur anywhere. The setting is a global pause, not a per-container control. | Use `"retention_policy": null` on specific containers to opt them out individually, or leave the global setting at `true`. |
| Setting `agentic_memory_enabled` to `false`, thinking it only disables retention | All memory APIs break with a 403 error. Agents can no longer read or write memories. | Use `retention_enabled: false` instead, because it only stops deletions. |
| Changing `retention_enabled` and expecting immediate deletions | The job runs every 24 hours. Changes take effect on the next run. | Wait for the next cycle. To run more frequently, set `retention_job_interval_hours` in `opensearch.yml` during initial cluster setup; changing it on a running cluster is not yet supported. |

## Cluster-level settings for administrators

Cluster administrators can configure retention behavior using dynamic cluster settings. All settings use the prefix `plugins.ml_commons.memory.` and can be updated at runtime without a restart, with one exception: `retention_job_interval_hours` is configured in `opensearch.yml` during initial setup and is applied once, when the retention job is first scheduled. The ability to change it on a running cluster is planned for a future release.

### Primary switch

The following table describes the primary opt-in switch.

| Setting | Default | Description |
| :--- | :--- | :--- |
| `retention_enabled` | `false` | The primary opt-in switch for the retention feature. When it is `false` (the default), the container APIs reject `retention_policy` input and the memory update API rejects `pinned` input, both with a 403 error, and the job deletes nothing. Set it to `true` to enable retention cluster-wide. |

### Job schedule and throttling

The following table describes the job schedule and throttling settings.

| Setting | Default | Range | Description |
| :--- | :--- | :--- | :--- |
| `retention_job_interval_hours` | 24 | 1--168 | How often the retention job runs, in hours. Configure this value in `opensearch.yml` during initial setup; it is applied once, when the job is first scheduled. Unlike the other settings in this section, changing it on a running cluster is not yet supported. |
| `retention_job_throttle_seconds` | 5 | 1--60 | The pause between containers during job execution, used to reduce cluster load. |

### Cleanup time-to-live settings

The following table describes the cleanup time-to-live settings.

| Setting | Default | Range | Description |
| :--- | :--- | :--- | :--- |
| `working_memory_ttl_days` | -1 (off) | `-1` (off), or 1--365 | The TTL for working memory in session-disabled containers. Defaults to `-1` (disabled), so session-less working memory is kept indefinitely unless an administrator sets a value greater than 0. |
| `orphan_ttl_days` | 7 | 1--365 | The TTL for unattributable orphaned working memory documents. |

### Cluster-level default retention policy

These settings are all disabled by default (`-1`). Out of the box, no retention policy is applied to any container unless the user explicitly provides one at creation time. The retention job does nothing to containers that have no policy.

An administrator can optionally configure these settings to establish organization-wide baseline retention rules. If retention is enabled (`retention_enabled` is `true`) and any of these settings are set to a value greater than zero, then containers that (a) have no explicit policy and (b) have not explicitly opted out receive a policy built from these values, either at creation time or on the next job run through backfill. While `retention_enabled` is `false`, defaults are never stamped.

If you do not set these settings, nothing happens automatically. There is no built-in retention behavior without explicit configuration.

The following table describes the default retention policy settings.

| Setting | Default | Range | Effect when set to a value greater than 0 |
| :--- | :--- | :--- | :--- |
| `default_session_retention_days` | -1 (off) | `-1` (off), or 1--3650 | Applies `retention_days` to sessions on new containers |
| `default_session_max_count` | -1 (off) | `-1` (off), or 1--1,000,000 | Applies `max_count` to sessions on new containers |
| `default_long_term_max_count` | -1 (off) | `-1` (off), or 1--1,000,000 | Applies `max_count` to long-term memory on new containers |
| `default_history_max_count` | -1 (off) | `-1` (off), or 1--10,000,000 | Applies `max_count` to history on new containers |

### Configure cluster defaults

If your organization wants all containers to have a baseline retention policy without requiring every user to set one manually, an administrator can configure these settings.

There are no built-in default values; every setting ships as `-1` (off), and nothing is applied unless an administrator sets it. The numbers in the following example are offered only as a possible starting point: they represent a reasonable middle ground drawn from analysis of typical usage, not a recommendation that fits every deployment. Memory consumption varies drastically between organizations and workloads, so these figures will not be right for everyone. Treat them as a place to begin, then review your own data—storage footprint, retention and compliance requirements, and how quickly memory accumulates—to decide what is best for you and your organization.
{: .important}

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.memory.default_session_retention_days": 90,
    "plugins.ml_commons.memory.default_session_max_count": 5000,
    "plugins.ml_commons.memory.default_long_term_max_count": 2000,
    "plugins.ml_commons.memory.default_history_max_count": 100000
  }
}
```
{% include copy-curl.html %}

After these settings are configured, the following behavior applies:

- Newly created containers that do not specify their own policy inherit these values at creation time.
- Existing containers that have no policy and have not opted out receive these values on the next job run through backfill.
- Containers that already have an explicit policy (or that explicitly opted out with `"retention_policy": null`) are never affected.

Defaults are baked into the container at the time they are applied. If you change cluster defaults later, previously created containers are not retroactively updated. To change a specific container's policy, use the update API.
{: .note}

### Remove cluster defaults

To return to having no automatic policy, reset the settings to `-1`:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.memory.default_session_retention_days": -1,
    "plugins.ml_commons.memory.default_session_max_count": -1,
    "plugins.ml_commons.memory.default_long_term_max_count": -1,
    "plugins.ml_commons.memory.default_history_max_count": -1
  }
}
```
{% include copy-curl.html %}

After this, no new containers receive automatic policies, and the backfill stops applying to existing containers without policies.

## Validation rules and error messages

The following table lists the validation rules that the container and memory APIs enforce.

| Condition | HTTP status | Error message |
| :--- | :--- | :--- |
| `retention_days` set to 0 or a negative value | 400 | `retention_days must be a positive integer or null` |
| `max_count` set to 0 or a negative value | 400 | `max_count must be a positive integer or null` |
| `retention_days` specified for history | 400 | `retention_days is not supported for history memory type` |
| `working` key included in the policy | 400 | `Working memory retention cannot be configured directly. Working memory is deleted when its parent session expires. To control message lifetime, configure retention on "sessions" instead.` |
| Unrecognized memory type key | 400 | `unknown memory type: <key>` |
| `pinned` set when adding working memory | 400 | `pinned field is not supported for working memory type. To preserve a conversation, pin the session instead.` |
| `retention_policy` supplied on create or update while `retention_enabled` is `false` | 403 | `Cannot set retention_policy: the memory retention feature is not enabled. To enable it, please update the cluster setting plugins.ml_commons.memory.retention_enabled` |
| `pinned` field present in a memory request while `retention_enabled` is `false` | 403 | `Cannot set pinned: the memory retention feature is not enabled. To enable it, please update the cluster setting plugins.ml_commons.memory.retention_enabled` |

An explicit `"retention_policy": null` (opt-out) is still accepted while the feature is disabled, because clearing retention is consistent with the feature being off.
{: .note}

## Worked examples

The following examples show common retention configurations.

### Example 1: Customer support agent with aggressive cleanup

This is a high-volume support agent that processes thousands of conversations daily. You want to keep only recent sessions and a moderate knowledge base:

```json
POST /_plugins/_ml/memory_containers/_create
{
  "name": "high-volume-support-agent",
  "configuration": {
    "retention_policy": {
      "sessions": {
        "retention_days": 7,
        "max_count": 1000
      },
      "long-term": {
        "retention_days": 180,
        "max_count": 10000
      },
      "history": {
        "max_count": 100000
      }
    }
  }
}
```
{% include copy-curl.html %}

In this example, sessions older than 7 days are deleted. If more than 1,000 non-pinned sessions exist before 7 days have passed, the oldest are evicted early. Long-term memories are kept for 180 days or until 10,000 accumulate. History keeps the most recent 100,000 entries.

### Example 2: Research assistant with long memory

This is a knowledge-heavy agent for which long-term memory is critical and conversations are secondary:

```json
POST /_plugins/_ml/memory_containers/_create
{
  "name": "research-assistant",
  "configuration": {
    "retention_policy": {
      "sessions": {
        "retention_days": 14,
        "max_count": 200
      },
      "long-term": {
        "max_count": 50000
      }
    }
  }
}
```
{% include copy-curl.html %}

In this example, sessions expire after 14 days. Long-term memory grows up to 50,000 entries with no time-based expiry (knowledge is only evicted when the count is exceeded, oldest first). History has no policy, so no history cleanup occurs.

### Example 3: Protecting important conversations

Pin a session that contains an important troubleshooting thread so that it is never deleted, regardless of retention rules:

```json
PUT /_plugins/_ml/memory_containers/{id}/memories/sessions/{session_id}
{
  "pinned": true
}
```
{% include copy-curl.html %}

The pinned session and all of its messages persist indefinitely. It does not count against `max_count`, so it does not block other sessions from being kept.

### Example 4: Understanding logical OR between retention_days and max_count

When a memory type has both `retention_days` and `max_count`, the two rules combine as a logical OR: a session is deleted if it violates *either* rule. Understanding how the job applies them helps you predict exactly what will be removed.

For each container, the job builds a single set of sessions to delete, in this order:

1. **Time-based rule first.** It adds every non-pinned session whose `last_updated_time` is older than `retention_days`.
2. **Count-based rule second.** It counts *all* non-pinned sessions in the container (not just the ones left after step 1). If that total exceeds `max_count`, it adds the oldest sessions—ordered by `last_updated_time`, oldest first—until only `max_count` would remain.
3. **Deduplication.** Because both rules add to the same set, any session selected by both is listed only once and therefore deleted only once. The two rules never combine to delete more than their union.

The result is that a session is kept only if it satisfies *both* conditions: it is newer than `retention_days` **and** it is among the most-recently-active `max_count` sessions. Whichever rule is stricter for your data is the one that governs how much is deleted. Pinned sessions are excluded from both steps and never count toward `max_count`.

The following scenarios all use `sessions: { retention_days: 30, max_count: 100 }`:

- **Scenario A, only the time rule fires:** You have 50 sessions, one of which is 31 days old. The 31-day-old session is deleted (it violates `retention_days`). The count rule does nothing because 50 is below `max_count`. 49 remain.
- **Scenario B, only the count rule fires:** You have 110 sessions, all less than 30 days old. The time rule finds nothing, but the count rule deletes the 10 oldest to bring the total down to `max_count`. 100 remain.
- **Scenario C, neither rule fires:** You have 80 sessions, all less than 30 days old. No deletions occur, because neither rule is violated.
- **Scenario D, both rules fire and overlap (deduplication):** You have 130 sessions, 40 of which are older than 30 days. The time rule selects those 40. The count rule computes an excess of 30 (130 minus 100) and selects the 30 oldest sessions, which are already inside that set of 40. The union is still 40, so 40 sessions are deleted (not 70) and 90 remain. This is why the two rules never double-count.
- **Scenario E, both rules fire without full overlap:** You have 130 sessions, only 10 of which are older than 30 days. The time rule selects those 10. The count rule selects the 30 oldest, which includes those 10 plus 20 more that are still within `retention_days`. The union is 30, so 30 sessions are deleted and 100 remain. Note that 20 sessions younger than `retention_days` were still removed, because `max_count` alone required it.

### Example 5: Disabling only time-based retention

To apply count-based limits only, with no time-based expiry, set `retention_days` to `null`:

```json
{
  "configuration": {
    "retention_policy": {
      "sessions": {
        "retention_days": null,
        "max_count": 500
      },
      "long-term": {
        "retention_days": null,
        "max_count": 10000
      }
    }
  }
}
```
{% include copy.html %}

### Example 6: Completely opting out

```json
PUT /_plugins/_ml/memory_containers/{memory_container_id}
{
  "configuration": {
    "retention_policy": null
  }
}
```
{% include copy-curl.html %}

No retention enforcement of any kind applies to this container, even if cluster defaults are configured.

## Frequently asked questions

**Does the retention job delete data immediately when a rule is violated?**

No. The job runs on a schedule (every 24 hours by default). There is a staleness window of up to one job interval during which expired memories may still be visible in query results.

**What happens to working memory when a session is deleted?**

All working memory (messages) belonging to that session is deleted first, and then the session itself is removed. Conversations are never left in a partial state.

**Can I set retention rules on working memory directly?**

No. The working memory lifecycle is tied to its parent session. Configure `sessions` retention to control how long messages live.

**Does pinning a session reset its age?**

No. Pinning is a metadata operation and does not change `last_updated_time`. Adding messages to a session or updating its summary extends its lifetime. However, this does not matter for retention, because pinned sessions are never deleted regardless of age.

**What if I have more pinned sessions than `max_count`?**

The job never deletes pinned items. It logs a warning that the container is growing beyond the cap because of pins, but enforcement applies only to non-pinned items. To bring the container back under control, review and unpin sessions that no longer need protection.

**Do cluster default changes affect existing containers?**

No. Defaults are applied to a container once (at creation time or on first backfill). Changing cluster defaults later does not update containers that already have a policy. Use the update API to modify individual containers.

**What is the difference between "no policy" and "opted out"?**

With "no policy" (the field is absent), the container may receive cluster defaults through backfill on the next job run. With "opted out" (`"retention_policy": null`), the container is permanently skipped by the retention job, and defaults are never backfilled. This is an active choice.

**Can I trigger the retention job on demand?**

Not in this version. The job runs on a fixed schedule of every 24 hours. To use a different interval, set `retention_job_interval_hours` in each node's `opensearch.yml` before the node first starts, as part of your initial cluster setup:

```yaml
plugins.ml_commons.memory.retention_job_interval_hours: 1
```

The interval is applied once, when the retention job is first scheduled, so it must be in place before agentic memory is first used on the cluster. Changing it afterward has no effect on the current schedule. Support for adjusting the interval on a running cluster is planned for a future release.

**What OpenSearch version is required?**

Memory retention policies require OpenSearch 3.8.0 or later.

**Does this work with multi-tenancy?**

Not in this version. The retention job is disabled when multi-tenancy is active. Multi-tenant support is planned for a future release.

**My memory APIs are returning a 403 error. What is wrong?**

There are two distinct causes:

- Every memory API returns a 403 error (including create container, add message, retrieve, and search). This means `plugins.ml_commons.agentic_memory_enabled` is `false`. Set it back to `true` to restore API access.
- Only requests that carry `retention_policy` or `pinned` return a 403 error, while other memory APIs work. This means `plugins.ml_commons.memory.retention_enabled` is `false` (its default). This is expected, because retention is opt-in. Enable it before setting policies or pinning memories. (An explicit `"retention_policy": null` is still accepted while the feature is disabled.)

Check both settings:

```json
GET /_cluster/settings?include_defaults=true&filter_path=*.plugins.ml_commons.agentic_memory_enabled,*.plugins.ml_commons.memory.retention_enabled
```
{% include copy-curl.html %}

**I set a retention policy, but nothing is being deleted. What should I check?**

Walk through this checklist in order:

1. Is `plugins.ml_commons.memory.retention_enabled` set to `true`? It defaults to `false`. If it is `false`, the job does nothing, and you would not have been able to set a policy in the first place (the API returns a 403 error). Enable it first.
1. Is `plugins.ml_commons.agentic_memory_enabled` set to `true`? If it is `false`, the job was never registered.
1. Has enough time passed? The job runs every `retention_job_interval_hours` (24 hours by default). Your policy is not enforced until the next run.
1. Is your container's policy actually set? Check it with `GET /_plugins/_ml/memory_containers/{id}` and inspect `configuration.retention_policy`.
1. Are the memories pinned? Pinned memories are exempt from all retention rules.
1. Is multi-tenancy enabled? The retention job is disabled when multi-tenancy is active.

## API reference summary

The following table summarizes the operations used to configure retention.

| Operation | Method | Endpoint | Body |
| :--- | :--- | :--- | :--- |
| Create a container with a policy | POST | `/_plugins/_ml/memory_containers/_create` | `{"configuration": {"retention_policy": {...}}}` |
| Update a container policy | PUT | `/_plugins/_ml/memory_containers/{id}` | `{"configuration": {"retention_policy": {...}}}` |
| Opt out of retention | PUT | `/_plugins/_ml/memory_containers/{id}` | `{"configuration": {"retention_policy": null}}` |
| Pin a session | PUT | `/_plugins/_ml/memory_containers/{id}/memories/sessions/{session_id}` | `{"pinned": true}` |
| Unpin a session | PUT | `/_plugins/_ml/memory_containers/{id}/memories/sessions/{session_id}` | `{"pinned": false}` |
| Pin a long-term memory | PUT | `/_plugins/_ml/memory_containers/{id}/memories/long-term/{memory_id}` | `{"pinned": true}` |
| Enable retention (administrator) | PUT | `/_cluster/settings` | `{"persistent": {"plugins.ml_commons.memory.retention_enabled": true}}` |
| Set cluster defaults | PUT | `/_cluster/settings` | `{"persistent": {"plugins.ml_commons.memory.default_session_retention_days": 90, ...}}` |
| Disable retention cluster-wide | PUT | `/_cluster/settings` | `{"persistent": {"plugins.ml_commons.memory.retention_enabled": false}}` |

## Next steps

- For more information about memory containers and agent memory, see [Agentic memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agentic-memory/).
- For the container creation API reference, see [Create a memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container/).
