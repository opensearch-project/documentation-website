---
layout: default
title: Index authorization
parent: Access control
nav_order: 76
---

# Index authorization

**Introduced 3.7**

The Security plugin offers an opt-in index authorization engine, called `v4`. It uses the index information supplied by OpenSearch transport actions to evaluate permissions. Compared with legacy authorization, this reduces duplicate index resolution and provides more consistent handling of aliases, data streams, and requests that match both authorized and unauthorized indexes.

Legacy authorization remains the default. Enabling `v4` changes authorization behavior for the entire cluster. Review the differences on this page and test your roles and application requests before enabling it in production.
{: .warning }

## Enable v4 authorization

Set the following properties under `config.dynamic` in your existing Security plugin `config.yml`:

```yaml
config:
  dynamic:
    privileges_evaluation_type: v4
    privileges_evaluation_ignore_unauthorized_indices: true
```

This is a configuration fragment, not a replacement for your complete `config.yml`. Preserve your authentication, authorization, and other existing settings. Apply the updated configuration using [securityadmin.sh]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/) or the [Security configuration API]({{site.url}}{{site.baseurl}}/security/api/configuration/update-configuration/). Editing the file alone does not update the running cluster. These settings belong to the Security configuration, not `opensearch.yml` or the Cluster Settings API.

| Setting | Description |
| :--- | :--- |
| `privileges_evaluation_type` | Selects the authorization engine. Set to `v4` to enable the revised behavior or `legacy` to use legacy authorization. When omitted, legacy authorization is used. |
| `privileges_evaluation_ignore_unauthorized_indices` | In `v4` mode, allows eligible requests to omit indexes on which the user lacks the required permissions. Default is `true`. This does not grant additional permissions. The setting is not used by legacy authorization. |

To return to legacy authorization, set `privileges_evaluation_type: legacy` and apply the configuration again. Keep any legacy settings you need for rollback; their behavior resumes when you switch back.

## Requests that include unauthorized indexes

With `privileges_evaluation_ignore_unauthorized_indices: true`, v4 can reduce an eligible request to the indexes that the user is authorized to access. This requires an action that supports replacing its requested index list. It is not a general mechanism for suppressing authorization errors from every API.

For example, suppose `logs-public` and `logs-private` exist, but a user has search permission only for `logs-public`:

| Request | Behavior in v4 |
| :--- | :--- |
| `GET logs-*/_search` | With the default open-index wildcard expansion, searches only the authorized matching indexes. |
| `GET logs-public,logs-private/_search` | Fails authorization because the explicit list includes an unauthorized index. |
| `GET logs-public,logs-private/_search?ignore_unavailable=true` | Omits the unauthorized index and searches `logs-public`. |

Index reduction is eligible when the request uses wildcard patterns with open-index expansion enabled, or when `ignore_unavailable=true` is set. For a request to be reduced to an empty index set, `allow_no_indices=true` must also be effective and the action must support an empty set. For example, creating a point in time requires at least one authorized index.

System and protected index restrictions participate in the same checks: eligible requests can omit indexes whose special access requirements the user does not meet. Index reduction does not bypass those protections.

If you set `privileges_evaluation_ignore_unauthorized_indices: false`, v4 does not perform this authorization-based reduction. Broad wildcard requests can then fail when they include unauthorized indexes, including system indexes.

## Aliases and data streams

When accessing an alias or data stream by name, grant the required permissions on that name. Having permissions only on all of its member or backing indexes is no longer sufficient to access the alias or data stream by name. Direct access to a concrete index is still evaluated using the applicable index permissions.

V4 does not split an alias or data stream into a subset of its underlying indexes to make a partially authorized request succeed. In particular, it does not replace a filtered alias with unfiltered concrete index names during authorization.

Alias-management requests also require permissions on the alias name, in addition to the applicable index permissions. Review roles that use `indices:admin/aliases`, as well as requests that create an index and an alias together using `indices:admin/create`.

Filtered aliases are not a replacement for [document-level security]({{site.url}}{{site.baseurl}}/security/access-control/document-level-security/). Preserving an alias filter during a request does not make that filter an authorization boundary for other ways of accessing the underlying index.
{: .note }

## Other permission changes

- **Analyze without an index:** An indexless `_analyze` request requires `indices:admin/analyze` permission on at least one index pattern in the user's roles.
- **List all points in time:** `GET /_search/point_in_time/_all` requires `indices:data/read/point_in_time/readall` as a cluster permission.
- **List segments for all points in time:** `GET /_cat/pit_segments/_all` requires `cluster:monitor/point_in_time/segments/_all` as a cluster permission.
- **Restore snapshots:** Write permissions for the target indexes are always checked. Granting a snapshot restore action alone does not bypass these checks.

## Legacy settings that v4 does not use

The following settings retain their legacy meaning only when legacy authorization is selected.

| Location | Setting | Behavior in v4 |
| :--- | :--- | :--- |
| `config.dynamic` | `do_not_fail_on_forbidden` | Replaced by `privileges_evaluation_ignore_unauthorized_indices` and the request-level rules described above. |
| `config.dynamic` | `do_not_fail_on_forbidden_empty` | Empty results depend on index-reduction eligibility, `allow_no_indices`, and support for an empty index set in the action. |
| `config.dynamic` | `filtered_alias_mode` | Legacy filtered-alias checks are not used. Aliases are not split into subsets of member indexes during authorization. |
| `config.dynamic` | `respect_request_indices_options` | Index resolution uses the information supplied by OpenSearch transport actions. |
| `opensearch.yml` | `plugins.security.filter_securityindex_from_all_requests` | Security index protection is integrated into authorization-based index filtering. |
| `opensearch.yml` | `plugins.security.system_indices.enabled` | System index authorization is always enabled. |
| `opensearch.yml` | `plugins.security.system_indices.permission.enabled` | Explicit system index permission handling is always enabled. |
| `opensearch.yml` | `plugins.security.check_snapshot_restore_write_privileges` | Target-index write permissions are always checked during restore. |
| `opensearch.yml` | `plugins.security.enable_snapshot_restore_privilege` | Use `plugins.security.privileges_evaluation.actions.universally_denied_actions` to deny the restore action to non-super-admin users. |
| `opensearch.yml` | `plugins.security.unsupported.restore.securityindex.enabled` | Does not allow non-super-admin users to restore the Security configuration index. |

## Advanced action configuration

V4 provides the following static settings in `opensearch.yml`. These are intended for specialized compatibility or troubleshooting needs, not routine role configuration. Changing them requires restarting the affected nodes. Configure them consistently across the cluster.

| Setting | Description |
| :--- | :--- |
| `plugins.security.privileges_evaluation.actions.force_as_cluster_actions` | A list of action names to evaluate as cluster permissions instead of index permissions. |
| `plugins.security.privileges_evaluation.actions.universally_denied_actions` | A list of action names denied to all users except super admins authenticated with an admin certificate, regardless of their role permissions. |
| `plugins.security.privileges_evaluation.actions.map_action_names` | A list of `action_name>permission_name` entries that map action names to the permission names used for authorization. |

These lists use exact action names, not wildcard patterns. All three lists default to empty; built-in action classifications and mappings still apply.

## Migration checklist

Before enabling v4 in production:

1. Back up the current Security configuration and record the legacy settings needed for rollback.
2. Test representative requests using restricted users, not only an admin account. Include OpenSearch Dashboards requests and requests that use wildcards, explicit index lists, aliases, and data streams.
3. Check alias and data stream name permissions, alias creation, snapshot restores, and point-in-time operations.
4. Decide whether applications should fail on explicitly named unauthorized indexes or use `ignore_unavailable=true` where supported.
5. Verify which results clients expect when no authorized indexes remain. Check both request options and whether the action supports an empty set.

Switching engines does not replace your role definitions or grant users access to unauthorized indexes.
