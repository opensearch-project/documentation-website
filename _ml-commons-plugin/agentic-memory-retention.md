---
layout: default
title: Agentic memory retention
parent: Agentic memory
grand_parent: Memory and context
nav_order: 30
---

# Agentic memory retention
**Introduced 3.8**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

By default, agentic memories accumulate indefinitely, which increases storage use and can cause agents to retrieve outdated memories. To automatically delete old or excess memories, define a _retention policy_ for a [memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agentic-memory/#memory-containers). The retention policy specifies an age limit, a count limit, or both for each memory type. A background job enforces the policy on a schedule. It deletes `sessions`, `long-term`, and `history` memories that exceed a count limit, or `sessions` and `long-term` memories that exceed an age limit. In contrast, `working` memory is not subject to the retention policy and is deleted when its parent session no longer exists. To control the amount of time that `working` memories are retained, configure retention for `sessions`.

You can exclude `sessions` and `long-term` memories from the retention policy by pinning them. For more information, see [Pinning memories](#pinning-memories).

## Enabling memory retention

Retention is disabled by default. To enable it cluster-wide, configure the following dynamic cluster setting:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.memory.retention_enabled": true
  }
}
```
{% include copy-curl.html %}

## Defining a retention policy

The `retention_policy` object is specified in the container's `configuration` object and maps each memory type to the retention limits for that type. Replace `{memory_type}` with `sessions`, `long-term`, or `history`:

```json
"configuration": {
  "retention_policy": {
    "{memory_type}": {
      "retention_days": 90,
      "max_count": 5000
    }
  }
}
```

Each `{memory_type}` object accepts the following optional fields. When both fields are set, a memory is deleted if it violates either rule.

Field | Data type | Supported memory types | Description
:--- | :--- | :--- | :---
`retention_days` | Integer | `sessions`, `long-term` | Deletes memories older than this many days, measured from the memory's `last_updated_time`.
`max_count` | Integer | `sessions`, `long-term`, `history` | Keeps at most this many memories, deleting the oldest first. Sessions and long-term memory are ordered by `last_updated_time`; history is ordered by `created_time`.

A retention rule takes effect only if the container stores that memory type. For `long-term` and `history` memories to be stored, you must configure `strategies`; otherwise, retention rules for those types have no effect. For more information, see [The created indexes]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container/#the-created-indexes).
{: .note}

### Configuring a retention policy

To configure a policy when you create a memory container, include the `retention_policy` field in the create request. The following example creates a container with session tracking, a strategy, and a retention policy that retains up to 5,000 sessions for 90 days and limits long-term memory to 2,000 entries:

```json
POST /_plugins/_ml/memory_containers/_create
{
  "name": "my-agent-memory",
  "configuration": {
    "embedding_model_type": "TEXT_EMBEDDING",
    "embedding_model_id": "your-embedding-model-id",
    "embedding_dimension": 1024,
    "llm_id": "your-llm-model-id",
    "strategies": [
      {
        "type": "SEMANTIC",
        "namespace": ["user_id"]
      }
    ],
    "retention_policy": {
      "sessions": {
        "retention_days": 90,
        "max_count": 5000
      },
      "long-term": {
        "max_count": 2000
      }
    }
  }
}
```
{% include copy-curl.html %}

You can also add a retention policy for an existing container at any time by sending the `retention_policy` object in an update request:

```json
PUT /_plugins/_ml/memory_containers/{memory_container_id}
{
  "configuration": {
    "retention_policy": {
      "sessions": {
        "retention_days": 90,
        "max_count": 5000
      },
      "long-term": {
        "max_count": 2000
      }
    }
  }
}
```
{% include copy-curl.html %}

A policy applies to all memories in the container, including those created before you added the policy. For example, adding a `max_count` of 100 to a container that holds 10,000 sessions deletes the 9,900 least recently updated sessions. To preserve specific memories, [pin](#pinning-memories) them before adding the policy.
{: .warning}

### Viewing a retention policy

To view the stored policy, retrieve the container using the [Get Memory Container API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/get-memory-container/):

```json
GET /_plugins/_ml/memory_containers/{memory_container_id}
```
{% include copy-curl.html %}

### Updating a retention policy

Updating a `retention_policy` merges your changes into the existing policy rather than replacing it. Memory types and fields that you omit are left unchanged.

To remove a single field, set it to `null`. For example, the following request updates the policy in the [Configuring a retention policy](#configuring-a-retention-policy) example by removing `retention_days` from `sessions` while keeping the `max_count` of 5,000:

```json
PUT /_plugins/_ml/memory_containers/{memory_container_id}
{
  "configuration": {
    "retention_policy": {
      "sessions": {
        "retention_days": null
      }
    }
  }
}
```
{% include copy-curl.html %}

### Disabling retention for a container

To disable retention for the entire container, set `retention_policy` to `null`:

```json
PUT /_plugins/_ml/memory_containers/{memory_container_id}
{
  "configuration": {
    "retention_policy": null
  }
}
```
{% include copy-curl.html %}

Setting `retention_policy` to `null` differs from omitting it. Omitting the policy leaves the container eligible for [cluster-level default settings](#default-settings); setting it to `null` exempts the container from those defaults. You can send this request even when retention is disabled cluster-wide.

## Pinning memories

Pinning a memory exempts it from deletion under a container's [retention policy](#defining-a-retention-policy). You can pin `sessions` and `long-term` memories. Pinning `sessions` retains all of their `working` memories. Because pinned memories are never deleted, they can accumulate over time. To reduce the container size, unpin `sessions` that no longer require protection.

Pinning protects a memory from deletion but does not change its age. A memory's age is measured from its `last_updated_time`, which advances only when its content changes, such as when a `working` memory is added to a session or a `long-term` memory is updated. Pinning does not update this timestamp, so if you later unpin the memory, its age still reflects its last content change and it may become immediately eligible for deletion.

Use the following request field to pin a memory.

Field | Data type | Description
:--- | :--- | :---
`pinned` | Boolean | Set to `true` to pin a memory or `false` to unpin it. Valid for `sessions` and `long-term` memories.

The following example pins a memory (specify either `sessions` or `long-term` as `memory_type`):

```json
PUT /_plugins/_ml/memory_containers/{memory_container_id}/memories/{memory_type}/{memory_id}
{
  "pinned": true
}
```
{% include copy-curl.html %}

## Retention job

A background job enforces retention policies on a [schedule](#retention-job-schedule) (by default, every 24 hours). Because enforcement is scheduled rather than continuous, a memory that has passed its age or count limit is still returned in search results until the job next runs and deletes it.

Memories are evaluated against the following limits:

- `retention_days` is measured from a memory's `last_updated_time`. Adding a `working` memory to a session advances the session's timestamp, so active conversations are retained. Pinning a memory does not advance it.
- `max_count` applies regardless of age. If a container holds more than `max_count` non-pinned memories of a type, the oldest are deleted until `max_count` remain, even if they are newer than `retention_days`.
- When a memory type sets both limits, a memory is deleted if it exceeds either one.

When enforcing `max_count`, each run deletes at most 50,000 memories in a container for each memory type. A larger backlog is reduced over successive runs, so a container that far exceeds its `max_count` may take several runs to reach the limit. Deletions based on `retention_days` are not capped.

When the job evicts a `sessions` memory, its `working` memories are deleted first so that no orphans are created. Manually deleting a `sessions` memory does not delete its `working` memories, leaving them orphaned. After enforcing the policies, the job removes orphaned `working` memories whose `created_time` is older than `orphan_ttl_days`. The first time the job checks a container for orphans, it records a baseline and deletes nothing, so orphan deletion in that container begins `orphan_ttl_days` after the baseline.

Orphan cleanup runs only for containers that have a retention policy and that were created with `disable_session` set to `false` (the default). In a container with no retention policy, orphaned `working` memories are retained indefinitely.

A container created with `disable_session` set to `true` stores no `sessions` memories, so neither of the preceding mechanisms applies to it. Its `working` memories are deleted only by the `plugins.ml_commons.memory.working_memory_ttl_days` setting, which is disabled by default. Until you set it to a positive value, these containers retain `working` memories indefinitely. For more information, see [Memory retention settings](#memory-retention-settings).

The job is disabled when multi-tenancy is active. In this case, no retention is enforced, even for containers that have a policy.

## Pausing retention

To pause retention while preserving configured retention policies, set `plugins.ml_commons.memory.retention_enabled` to `false`. Setting it back to `true` resumes enforcement.

## Memory retention settings

You can customize retention behavior using the following dynamic cluster settings:

- `plugins.ml_commons.memory.retention_enabled` (Boolean): Enables retention cluster-wide. While this setting is `false`, the retention job deletes nothing and the container APIs reject a `retention_policy`. Default is `false`.

- `plugins.ml_commons.memory.retention_job_throttle_seconds` (Integer): Specifies how long the retention job pauses after processing a container in which it deleted memories, before it moves on to the next container. Increase this value to reduce cluster load. Valid values are in the `[1, 60]` range. Default is `5`.

- `plugins.ml_commons.memory.working_memory_ttl_days` (Integer): Deletes a `working` memory this many days after it is created. Applicable only to containers created with `disable_session` set to `true`. Because those containers store no `sessions` memories, this setting is the only mechanism that deletes their `working` memories. Valid values are in the `[1, 365]` range. Default is `-1` (disabled).

- `plugins.ml_commons.memory.orphan_ttl_days` (Integer): Deletes a `working` memory whose parent `sessions` memory no longer exists, measured from the `working` memory's `created_time`. For more information, see [Retention job](#retention-job). Valid values are in the `[1, 365]` range. Default is `7`.

### Default settings

The default settings apply to any container that has not set its own retention policy. They take effect only after [retention is enabled for the cluster](#enabling-memory-retention); until then, they are stored but have no effect. Once retention is enabled, the next scheduled job applies them to containers that have no policy and deletes any memories that exceed the default values, including memories that were created before you set the defaults.

Defaults are applied to a container only once; changing these settings later does not update containers to which they were already applied. To exempt a container from the defaults, set its `retention_policy` to `null`. To update a container's policy after the defaults are applied, use the [Update Memory Container API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/update-memory-container/).

Each of the following dynamic settings provides the default for one field of a [retention policy](#defining-a-retention-policy). The default `-1` applies no default for that field:

- `plugins.ml_commons.memory.default_session_retention_days` (Integer): Sets the default `retention_days` for `sessions` memories. Valid values are in the `[1, 3650]` range. Default is `-1`.

- `plugins.ml_commons.memory.default_session_max_count` (Integer): Sets the default `max_count` for `sessions` memories. Valid values are in the `[1, 1000000]` range. Default is `-1`.

- `plugins.ml_commons.memory.default_long_term_max_count` (Integer): Sets the default `max_count` for `long-term` memories. Valid values are in the `[1, 1000000]` range. Default is `-1`.

- `plugins.ml_commons.memory.default_history_max_count` (Integer): Sets the default `max_count` for `history` memories. Valid values are in the `[1, 10000000]` range. Default is `-1`.

### Retention job schedule

<!-- TODO: When this feature goes GA, revisit the retention_job_interval_hours behavior (currently static-like; dynamic interval updates are planned for a future release). -->

The following setting controls the retention job schedule. Set it in `opensearch.yml` before starting the cluster. The job reads it once, when it is first scheduled at startup; updating it through the Cluster Settings API on a running cluster has no effect:

- `plugins.ml_commons.memory.retention_job_interval_hours` (Integer): Specifies how often the retention job runs, in hours. Valid values are in the `[1, 168]` range. Default is `24`.

## Next steps

- For more information about memory containers and agentic memory, see [Agentic memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agentic-memory/).
- For the container creation API reference, see [Create Memory Container API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container/).
