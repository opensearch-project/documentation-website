---
layout: default
title: Authorization basics
parent: Access control
nav_order: 74
redirect_from:
  - /security-plugin/access-control/authorization-basics/
---

# Authorization basics

After a user is authenticated, the Security plugin authorizes every OpenSearch action that the user performs. Authorization is based on the combined permissions of all roles mapped to the user. Permissions control underlying OpenSearch actions, not HTTP methods or REST API paths. A single REST request can therefore require several permissions.

## Permission types

Roles can grant the following kinds of permissions:

- **Cluster permissions** grant actions that apply to the cluster as a whole, such as viewing cluster health or managing snapshots. They are not scoped to particular indexes.
- **Index permissions** grant an action or action group for indexes that match one or more index patterns. For example, a role can grant the `read` action group for `logs-*` without granting it for other indexes. Index permissions also apply when the target is an alias or data stream. As a further restriction on read access, [document-level security (DLS)]({{site.url}}{{site.baseurl}}/security/access-control/document-level-security/) limits the documents returned and [field-level security (FLS)]({{site.url}}{{site.baseurl}}/security/access-control/field-level-security/) limits the fields returned. DLS and FLS restrict data that an index permission makes accessible.
- **Tenant permissions** grant read or write access to OpenSearch Dashboards tenants. Tenants control saved objects, such as dashboards and visualizations; they do not grant access to the indexes from which a visualization reads data.

For the available action groups and individual action names, see [Default action groups]({{site.url}}{{site.baseurl}}/security/access-control/default-action-groups/) and [Permissions]({{site.url}}{{site.baseurl}}/security/access-control/permissions/). For examples of assigning all three permission types to a role, see [Defining users and roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/).

## Default behavior

By default, a request that targets indexes succeeds only when the user has the required privilege for **every** index that the request resolves to. A request that names concrete indexes, such as `GET /logs-2026-01,logs-2026-02/_search`, therefore requires access to both indexes.

Index expressions can match indexes that the user did not intend to query or is not allowed to access. For example, `GET /logs-*/_search` and `GET /_search` can resolve to unauthorized indexes. In the default behavior, a match to even one unauthorized index causes the entire request to fail with a permissions error. The same principle applies to many requests that use aliases, data streams, or index expressions, not only to searches.

This fail-fast behavior is not suitable for OpenSearch Dashboards when non-admin users have access to only a subset of indexes. Dashboards commonly sends broad index requests to discover data and populate visualizations. Configure either [`do_not_fail_on_forbidden`](#donotfailonforbidden) or [the `v4` mode](#the-v4-authorization-mode) for these users.

## `do_not_fail_on_forbidden`

Enable an alternative index-authorization mode by setting `do_not_fail_on_forbidden` to `true` under `config.dynamic` in the Security plugin's `config.yml`. This cluster-wide setting is `false` by default. When it is `false`, requests that resolve to an unauthorized index fail. When it is `true`, the Security plugin removes unauthorized indexes from supported requests and executes the request against the remaining authorized indexes.

```yml
_meta:
  type: "config"
  config_version: 2
config:
  dynamic:
    do_not_fail_on_forbidden: true
```

`do_not_fail_on_forbidden_empty` is available only with `do_not_fail_on_forbidden: true`. For search requests with no remaining authorized index, it controls whether the request returns an empty result or an error.

This setting supports broad requests from users with limited index access, but it has important limitations:

- It is a global choice: applications cannot choose fail-fast or reduced-results behavior for an individual request.
- It applies only to a predefined set of actions, so its behavior is not consistent for every index-related API or third-party plugin action.
- It omits unauthorized indexes without marking the result as incomplete. This can hide insufficient role permissions and index-name typos.

### Alias handling with `do_not_fail_on_forbidden`

When this setting is enabled and a user has privileges for only some backing indexes, the Security plugin can resolve an alias or data stream to those backing indexes. This changes the request target. Replacing a filtered alias with an unfiltered backing index bypasses the alias filter. Do not enable this setting for clients that rely on filtered aliases to restrict the documents returned.

Use this setting only when its reduced-results behavior is acceptable for all affected clients. The `v4` mode provides the replacement behavior.

## The `v4` authorization mode

The `v4` authorization mode was introduced in OpenSearch 3.7 to simplify the use and configuration of OpenSearch index authorization. It is opt-in and the current authorization implementation remains the default. The `v4` mode is intended to replace the current implementation in a later release. Enable it in the Security plugin configuration:

```yml
_meta:
  type: "config"
  config_version: 2
config:
  dynamic:
    privileges_evaluation_type: v4
```

The `v4` mode shifts index resolution to the OpenSearch actions that understand the request. It uses the request's index expression and index options to distinguish a deliberate request for a concrete index from a broad discovery request. It also applies refined index handling to requests from third-party plugins that use replaceable index requests.

### Wildcards and index options

The following behavior applies to requests that support index expressions and index options, such as search, count, delete by query, update by query, many CAT APIs, and index-level APIs. Operations that address an individual document by ID, such as `get`, `mget`, document delete, and document update, do not use this expression-resolution behavior.

| Request target | Index options | `v4` behavior |
| --- | --- | --- |
| Concrete names, such as `logs-a,logs-b` | `ignore_unavailable=false` (default) | The request is denied if the user lacks the required privilege for any named index. |
| Concrete names | `ignore_unavailable=true` | Unauthorized names are ignored and the request proceeds with authorized indexes. If none remain, `allow_no_indices` determines whether the result is empty or the request fails. |
| A wildcard expression, such as `logs-*` | `allow_no_indices=true` (default) | The wildcard resolves only to indexes for which the user has the required privilege. If no authorized index matches, the request returns an empty result. `ignore_unavailable` does not change wildcard behavior. |
| A wildcard expression | `allow_no_indices=false` | The wildcard still resolves only to authorized indexes, but the request fails when no authorized index matches. |
| A mixture of concrete names and wildcards | Both options | The preceding rules are combined. An unauthorized concrete name with `ignore_unavailable=false` makes the entire request fail; otherwise, wildcard matches are limited to authorized indexes. |

Use wildcards for broad discovery requests without granting access to every index in the cluster. Concrete names remain fail-fast by default, so an explicitly requested but inaccessible index is not silently ignored. Use `ignore_unavailable=true` only when an application accepts partial results. Use `allow_no_indices=false` when an empty wildcard result is an error.

### Alias handling in the `v4` mode

The `v4` mode does not split aliases or data streams into backing indexes. A user must have privileges on an alias or data stream to access it by name; privileges on all of its backing indexes are not sufficient. This preserves the behavior of filtered aliases because the alias remains in the request and its filter continues to apply.

For alias administration, the user must also have `indices:admin/aliases` for every alias to which an action applies. The same requirement applies to actions that create an alias implicitly, such as index creation with an alias option. System and protected indexes participate in the same filtering behavior.

### Configuration options not used by the `v4` mode

The `v4` mode uses its own index resolution and request-level behavior. The following settings are not used when `privileges_evaluation_type: v4` is enabled:

- `config.dynamic.do_not_fail_on_forbidden`: The `v4` mode filters unauthorized wildcard matches and uses request index options to control the handling of concrete index names. See [Wildcards and index options](#wildcards-and-index-options).
- `config.dynamic.do_not_fail_on_forbidden_empty`: The `v4` mode uses `allow_no_indices` to determine whether a request with no authorized matches is empty or fails. See [the Security configuration API request fields]({{site.url}}{{site.baseurl}}/security/api/configuration/update-configuration/#request-body-fields).
- `config.dynamic.filtered_alias_mode`: The `v4` mode preserves filtered aliases instead of splitting them into backing indexes. See [Alias handling in the `v4` mode](#alias-handling-in-the-v4-mode).
- `config.dynamic.respect_request_indices_options`: The `v4` mode resolves index expressions in the OpenSearch action and always uses the relevant request index options. See [Wildcards and index options](#wildcards-and-index-options).
- `plugins.security.filter_securityindex_from_all_requests`: The `v4` mode always filters the Security plugin configuration index. See [Security plugin protection]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/#security-plugin-protection).
- `plugins.security.system_indices.enabled` and `plugins.security.system_indices.permission.enabled`: The `v4` mode always enables system-index privilege handling. See [System indexes]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/) and [Enabling user access to system indexes]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#enabling-user-access-to-system-indexes).
- `plugins.security.unsupported.restore.securityindex.enabled`: The `v4` mode always protects the Security plugin configuration index during restore operations. See [Security plugin protection]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/#security-plugin-protection).
- `plugins.security.enable_snapshot_restore_privilege`: The `v4` mode replaces this setting with `plugins.security.privileges_evaluation.actions.universally_denied_actions`. See [Security settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/#expert-level-settings).
- `plugins.security.check_snapshot_restore_write_privileges`: The `v4` mode always checks write privileges for restore operations. See [Security settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/#expert-level-settings).

## Migrating roles and clients to the `v4` mode

Before enabling the `v4` mode in production, test representative requests with the roles used by each client. The following examples show the configuration and request changes that commonly accompany the migration.

### Replace global result reduction

Replace the global settings with the `v4` mode. In this mode, clients choose partial-results behavior for a concrete index list with `ignore_unavailable`; no role change can make that request-level choice.

**Before**

```yml
config:
  dynamic:
    do_not_fail_on_forbidden: true
```

**After**

```yml
config:
  dynamic:
    privileges_evaluation_type: v4
```

### Remove settings that the `v4` mode does not use

Remove index-authorization settings that the `v4` mode ignores so that the active configuration reflects the behavior in use. The `privileges_evaluation_type: v4` setting remains in place.

**Before**

```yml
config:
  dynamic:
    privileges_evaluation_type: v4
    do_not_fail_on_forbidden_empty: true
    filtered_alias_mode: warn
    respect_request_indices_options: false
```

**After**

```yml
config:
  dynamic:
    privileges_evaluation_type: v4
```

Remove the `opensearch.yml` settings listed in [Configuration options not used by the `v4` mode](#configuration-options-not-used-by-the-v4-mode) after confirming that the `v4` behavior meets the cluster's requirements.

### Grant aliases and data streams directly

When you access an alias or data stream by name, add that name to its `index_patterns`. Permissions on only the backing indexes are not sufficient in the `v4` mode.

**Before**

```yml
report_reader:
  index_permissions:
    - index_patterns:
        - .ds-reports-2026.10.01-000001
        - .ds-reports-2026.10.02-000002
      allowed_actions:
        - read
```

**After**

```yml
report_reader:
  index_permissions:
    - index_patterns:
        - reports
      allowed_actions:
        - read
```

The `.ds-reports-*` indexes are backing indexes for the `reports` data stream. The updated role grants access to the data stream only, rather than to its backing indexes.

### Grant alias-administration permissions on alias names

Roles that manage aliases need `indices:admin/aliases` for the alias name itself, including aliases created as part of index creation. In the following example, `reports-backing-*` matches backing indexes and `reports-alias` is the alias.

**Before**

```yml
report_manager:
  index_permissions:
    - index_patterns:
        - reports-backing-*
      allowed_actions:
        - indices:admin/aliases
```

**After**

```yml
report_manager:
  index_permissions:
    - index_patterns:
        - reports-backing-*
        - reports-alias
      allowed_actions:
        - indices:admin/aliases
```

### Add permissions for unscoped Analyze API requests

An unscoped [Analyze API]({{site.url}}{{site.baseurl}}/api-reference/analyze-apis/) request requires `indices:admin/analyze` on at least one index.

```yml
diagnostics:
  index_permissions:
    - index_patterns:
        - diagnostics-*
      allowed_actions:
        - indices:admin/analyze
```

### Add permissions for all-session point-in-time operations

The [List all PITs API]({{site.url}}{{site.baseurl}}/api-reference/search-apis/point-in-time-api/#list-all-pits) requires the dedicated `indices:data/read/point_in_time/readall` cluster permission. The [CAT PIT segments API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-pit-segments/) with the `_all` path requires `cluster:monitor/point_in_time/segments/_all`. Grant the permission for each operation that you use.

```yml
pit_read_all:
  cluster_permissions:
    - indices:data/read/point_in_time/readall
```

```yml
pit_segments_all:
  cluster_permissions:
    - cluster:monitor/point_in_time/segments/_all
```

Use a non-production cluster and a test user with the same mapped roles to validate searches, multi-searches, CAT requests, aliases, data streams, and plugin APIs before enabling the `v4` mode cluster-wide.
