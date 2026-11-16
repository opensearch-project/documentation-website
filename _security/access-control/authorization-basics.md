---
layout: default
title: Authorization basics
parent: Access control
nav_order: 74
---

# Authorization basics

After a user is authenticated, the Security plugin authorizes every OpenSearch action that the user performs. Authorization is based on the combined permissions of all roles mapped to the user. Permissions control underlying OpenSearch actions, not HTTP methods or REST API paths. A single REST request can therefore require several permissions.

For definitions of permissions, roles, and role mappings, see [Access control]({{site.url}}{{site.baseurl}}/security/access-control/index/#concepts).

## Permission types

Roles can grant the following kinds of permissions:

- **Cluster permissions** grant actions that apply to the cluster as a whole, such as viewing cluster health or managing snapshots. They are not scoped to particular indexes.
- **Index permissions** grant an action or action group for indexes that match one or more index patterns. For example, a role can grant the `read` action group for `logs-*` without granting it for other indexes. Index permissions also apply when the target is an alias or data stream. As a further restriction on read access, [document-level security (DLS)]({{site.url}}{{site.baseurl}}/security/access-control/document-level-security/) limits the documents returned and [field-level security (FLS)]({{site.url}}{{site.baseurl}}/security/access-control/field-level-security/) limits the fields returned.
- **Tenant permissions** grant read or write access to OpenSearch Dashboards tenants. Tenants control saved objects, such as dashboards and visualizations; they do not grant access to the indexes from which a visualization reads data.

For the available action groups and individual action names, see [Default action groups]({{site.url}}{{site.baseurl}}/security/access-control/default-action-groups/) and [Permissions]({{site.url}}{{site.baseurl}}/security/access-control/permissions/). For examples of assigning all three permission types to a role, see [Defining users and roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/).

## Default index authorization

By default, a request that targets indexes succeeds only when the user has the required privilege for every index that the request resolves to. A request that names concrete indexes, such as `GET /logs-2026-01,logs-2026-02/_search`, requires access to both indexes.

Wildcard expressions and requests that don't specify an index can match indexes that the user did not intend to query or is not allowed to access. For example, `GET /logs-*/_search` matches every index name that starts with `logs-`, and `GET /_search` targets all indexes in the cluster. Both can resolve to unauthorized indexes. By default, a match to even one unauthorized index causes the entire request to fail with a permissions error. Requests other than searches, such as delete by query and CAT requests, also fail when an alias, data stream, or index expression in the request resolves to at least one unauthorized index.

Failing the entire request is not suitable for OpenSearch Dashboards users who can access only some indexes. OpenSearch Dashboards commonly sends broad index requests to discover data and populate visualizations, and by default these requests fail if they match any index that the user cannot access. To return results from the indexes that a user can access, use one of the following approaches:

- [Remove unauthorized indexes from requests](#the-do_not_fail_on_forbidden-setting) by setting `do_not_fail_on_forbidden` to `true`.
- [Enable the `v4` authorization mode](#the-v4-authorization-mode), which resolves wildcard expressions only to indexes that the user is authorized to access.

## The `do_not_fail_on_forbidden` setting

To remove unauthorized indexes from requests for all users and client applications in the cluster, set the `do_not_fail_on_forbidden` setting to `true` under `config.dynamic` in `config/opensearch-security/config.yml`:

```yml
_meta:
  type: "config"
  config_version: 2
config:
  dynamic:
    do_not_fail_on_forbidden: true
```
{% include copy.html %}

Changes to `config.yml` take effect only after you apply them to the cluster. For more information, see [Applying changes to configuration files]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/).

When this setting is `true`, the Security plugin removes unauthorized indexes from supported requests and executes the request against the remaining authorized indexes.

If no authorized indexes remain after the unauthorized indexes are removed, a search request fails by default. To return an empty result, also set `do_not_fail_on_forbidden_empty` to `true`. This setting has no effect unless `do_not_fail_on_forbidden` is `true`.

### Alias handling

If a user has privileges for only some backing indexes of an alias or data stream, the Security plugin replaces the alias or data stream in the request with those backing indexes. The backing indexes are not filtered, so the alias filter no longer applies. Do not enable this setting if any client application relies on filtered aliases to restrict the returned documents.

### Limitations

The `do_not_fail_on_forbidden` setting supports broad requests from users with limited index access, but it has important limitations:

- A client application cannot choose, for a particular request, whether the request fails or returns results only from authorized indexes.
- It applies only to a predefined set of actions, so it does not apply consistently to every API that targets indexes or to every third-party plugin action.
- The response does not indicate that any indexes were removed from the request, so the results can be incomplete without warning. For example, if a role is missing a required permission or a request contains a misspelled index name, the request returns partial or empty results and no error.
- It can bypass filtered aliases. For more information, see [Alias handling](#alias-handling).

Use `do_not_fail_on_forbidden` only when partial results are acceptable for all client applications in the cluster. To avoid these limitations, use the [`v4` mode](#the-v4-authorization-mode).
{: .note}

## The `v4` authorization mode
**Introduced 3.7**
{: .label .label-purple }

The `v4` authorization mode simplifies the configuration of OpenSearch index authorization. By default, this mode is disabled. The `v4` mode is intended to replace the default authorization mode in a future release. To enable it, set `privileges_evaluation_type` to `v4` under `config.dynamic` in `config/opensearch-security/config.yml`:

```yml
_meta:
  type: "config"
  config_version: 2
config:
  dynamic:
    privileges_evaluation_type: v4
```
{% include copy.html %}

To apply the change to the cluster, see [Applying changes to configuration files]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/).

In the `v4` mode, the result of a request depends on how the request specifies its indexes:

- A wildcard expression resolves only to indexes that the user is authorized to access.
- A request that names an index that the user is not authorized to access fails, unless the request sets the `ignore_unavailable` parameter to `true`.
- Aliases and data streams are authorized by name, so filtered aliases continue to apply.

For more information, see [Wildcards and query parameters](#wildcards-and-query-parameters) and [Alias handling in the `v4` mode](#alias-handling-in-the-v4-mode).

### Wildcards and query parameters

The following rules apply to requests that support index expressions and the `ignore_unavailable` and `allow_no_indices` query parameters, such as the Search, Count, Delete by Query, and Update by Query APIs, many CAT APIs, and many other APIs that target indexes. These rules do not apply to APIs that target an individual document by ID, such as the Get Document, Multi-get Documents, Delete Document, and Update Document APIs.

| Request target | Query parameter | Result in the `v4` mode |
| --- | --- | --- |
| Concrete names, such as `logs-a,logs-b` | `ignore_unavailable=false` (default) | The request is denied if the user lacks the required privilege for any named index. |
| Concrete names | `ignore_unavailable=true` | Unauthorized names are ignored and the request proceeds with authorized indexes. If none remain, `allow_no_indices` determines whether the result is empty or the request fails. |
| A wildcard expression, such as `logs-*` | `allow_no_indices=true` (default) | The wildcard resolves only to indexes for which the user has the required privilege. If no authorized index matches, the request returns an empty result. `ignore_unavailable` does not change wildcard resolution. |
| A wildcard expression | `allow_no_indices=false` | The wildcard still resolves only to authorized indexes, but the request fails when no authorized index matches. |
| A mixture of concrete names and wildcards | `ignore_unavailable` and `allow_no_indices` | Concrete names follow the `ignore_unavailable` rules, and wildcards follow the `allow_no_indices` rules. Wildcard matches are always limited to authorized indexes. If `ignore_unavailable` is `false`, an unauthorized concrete name makes the entire request fail. |

Use wildcards for broad discovery requests without granting access to every index in the cluster. By default, a request that names an unauthorized concrete index still fails, so the index is not silently ignored. Set the `ignore_unavailable` parameter to `true` only when partial results are acceptable for the client application. Set the `allow_no_indices` parameter to `false` when an empty wildcard result is an error.

These rules also apply to system and protected indexes. A wildcard expression does not resolve to a system or protected index that the user is not authorized to access.

### Alias handling in the `v4` mode

In the `v4` mode, aliases and data streams are authorized by name. To access an alias or data stream by name, a user must have privileges for that alias or data stream; privileges for all of its backing indexes are not sufficient. The alias is not replaced with its backing indexes, so the filter of a filtered alias continues to apply.

For alias administration, the user must also have the `indices:admin/aliases` permission for every alias to which an action applies. The same requirement applies to actions that create an alias implicitly, such as a Create Index request that defines aliases in the `aliases` field.

### Analyze API requests that don't specify an index

In the `v4` mode, an [Analyze API]({{site.url}}{{site.baseurl}}/api-reference/analyze-apis/) request that doesn't specify an index requires the `indices:admin/analyze` permission for at least one index. The default mode requires the permission for all indexes, so roles that work in the default mode also work in the `v4` mode.

### Settings not used in the `v4` mode

The `v4` mode uses its own index resolution and ignores the following settings:

- `config.dynamic.do_not_fail_on_forbidden`: The `v4` mode filters unauthorized wildcard matches and uses the `ignore_unavailable` and `allow_no_indices` query parameters to control the handling of concrete index names. For more information, see [Wildcards and query parameters](#wildcards-and-query-parameters).
- `config.dynamic.do_not_fail_on_forbidden_empty`: The `v4` mode uses `allow_no_indices` to determine whether a request with no authorized matches is empty or fails. For more information, see [Wildcards and query parameters](#wildcards-and-query-parameters).
- `config.dynamic.filtered_alias_mode`: The `v4` mode always applies the filter of a filtered alias. For more information, see [Alias handling in the `v4` mode](#alias-handling-in-the-v4-mode).
- `config.dynamic.respect_request_indices_options`: The `v4` mode always applies the `ignore_unavailable` and `allow_no_indices` query parameters. For more information, see [Wildcards and query parameters](#wildcards-and-query-parameters).
- `plugins.security.filter_securityindex_from_all_requests`: The `v4` mode handles the Security plugin configuration index in the same way as any other index that the user is not authorized to access. The index is excluded from wildcard matches and from requests that set the `ignore_unavailable` parameter to `true`. Other requests that name the index fail.
- `plugins.security.system_indices.enabled`: The `v4` mode always protects system indexes. Regular users cannot access system indexes unless their role includes the `system:admin/system_index` permission. For more information, see [System indexes]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/).
- `plugins.security.system_indices.permission.enabled`: The `v4` mode always enables the `system:admin/system_index` permission for roles. When `privileges_evaluation_type` is not set to `v4`, this setting is `false` by default. A role must include both the system-index permission and the required index action permissions. For more information, see [Enabling user access to system indexes]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#enabling-user-access-to-system-indexes).
- `plugins.security.unsupported.restore.securityindex.enabled`: The `v4` mode always protects the Security plugin configuration index during restore operations. For more information, see [Security plugin protection]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/#security-plugin-protection).
- `plugins.security.enable_snapshot_restore_privilege`: The `v4` mode allows regular users to restore snapshots when they have the required privileges. When `privileges_evaluation_type` is not set to `v4`, regular users can restore snapshots only if this setting is `true`, which is its default. To deny snapshot restore actions to all regular users, use the expert-level `plugins.security.privileges_evaluation.actions.universally_denied_actions` setting. For more information, see [Security settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/#expert-level-settings).
- `plugins.security.check_snapshot_restore_write_privileges`: The `v4` mode always checks write privileges for restore operations. This is also the default when `privileges_evaluation_type` is not set to `v4`. For more information, see [Security settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/#expert-level-settings).

## Migrating to the `v4` mode

To migrate to the `v4` mode, follow these steps.

### Step 1: Update roles

Update each role that matches one of the following cases. Make these changes before you enable the `v4` mode so that users keep their access when you switch.

#### Roles that access aliases or data streams by name

If users access an alias or data stream by name, add that name to the role's `index_patterns`. In the `v4` mode, permissions for only the backing indexes are not sufficient. The default mode also accepts data stream names in `index_patterns`, so the updated role in the following example works in both modes.

The following role grants access to the backing indexes of the `reports` data stream:

```yml
report_reader:
  index_permissions:
    - index_patterns:
        - .ds-reports-2026.10.01-000001
        - .ds-reports-2026.10.02-000002
      allowed_actions:
        - read
```

In the `v4` mode, grant access to the data stream name:

```yml
report_reader:
  index_permissions:
    - index_patterns:
        - reports
      allowed_actions:
        - read
```
{% include copy.html %}

#### Roles that manage aliases

Roles that manage aliases need `indices:admin/aliases` for the alias name itself, including aliases created as part of index creation. For example, the following role grants `indices:admin/aliases` only for the `reports-backing-*` backing indexes:

```yml
report_manager:
  index_permissions:
    - index_patterns:
        - reports-backing-*
      allowed_actions:
        - indices:admin/aliases
```

In the `v4` mode, also grant the permission for the `reports-alias` alias:

```yml
report_manager:
  index_permissions:
    - index_patterns:
        - reports-backing-*
        - reports-alias
      allowed_actions:
        - indices:admin/aliases
```
{% include copy.html %}

#### Roles that list all PITs

In the `v4` mode, the [List all PITs API]({{site.url}}{{site.baseurl}}/api-reference/search-apis/point-in-time-api/#list-all-pits) requires the dedicated `indices:data/read/point_in_time/readall` cluster permission. The [CAT PIT segments API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-pit-segments/) with the `_all` path requires `cluster:monitor/point_in_time/segments/_all`. Grant the permission for each operation that you use, as shown in the following roles:

```yml
pit_read_all:
  cluster_permissions:
    - indices:data/read/point_in_time/readall
```
{% include copy.html %}

```yml
pit_segments_all:
  cluster_permissions:
    - cluster:monitor/point_in_time/segments/_all
```
{% include copy.html %}

### Step 2: Update client applications that expect partial results

Client applications that rely on `do_not_fail_on_forbidden` to receive partial results for a list of concrete indexes must set the `ignore_unavailable` parameter to `true`. Roles cannot control this parameter. Client applications that treat an empty wildcard result as an error must set the `allow_no_indices` parameter to `false`. For more information, see [Wildcards and query parameters](#wildcards-and-query-parameters).

### Step 3: Test on a non-production cluster

Enable the `v4` mode on a non-production cluster, as described in [Step 4](#step-4-enable-the-v4-mode). Using a test user mapped to the same roles, validate searches, multi-searches, CAT requests, aliases, data streams, and plugin APIs.

### Step 4: Enable the `v4` mode

In `config.yml`, enable the `v4` mode and remove the index authorization settings that it ignores. For example, a `config.yml` file that uses `do_not_fail_on_forbidden` might contain the following settings:

```yml
config:
  dynamic:
    do_not_fail_on_forbidden: true
    do_not_fail_on_forbidden_empty: true
    filtered_alias_mode: warn
    respect_request_indices_options: false
```

Replace these settings with `privileges_evaluation_type: v4`:

```yml
config:
  dynamic:
    privileges_evaluation_type: v4
```
{% include copy.html %}

Apply the updated `config.yml` to the cluster. For more information, see [Applying changes to configuration files]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/).

In `opensearch.yml`, remove the settings listed in [Settings not used in the `v4` mode](#settings-not-used-in-the-v4-mode). Changes to `opensearch.yml` take effect after you restart each node.

## Advanced settings for the `v4` mode

The `v4` mode provides the following advanced settings for compatibility and troubleshooting. They are not required for normal operation. We don't recommend using them because they override the standard authorization of the `v4` mode:

- `config.dynamic.privileges_evaluation_ignore_unauthorized_indices` (in `config.yml`): Controls automatic filtering of unauthorized indexes. When it is `false`, requests that resolve to any unauthorized index, including a system index, fail. When it is `true`, the request runs against the authorized indexes only. Default is `true`.
- `plugins.security.privileges_evaluation.actions.force_as_cluster_actions` (in `opensearch.yml`): Treats the listed actions as cluster privileges even when they are normally index privileges.
- `plugins.security.privileges_evaluation.actions.universally_denied_actions` (in `opensearch.yml`): Denies the listed actions to all regular users, regardless of their roles. Only super admin users can perform these actions.
- `plugins.security.privileges_evaluation.actions.map_action_names` (in `opensearch.yml`): Maps an action name to a different privilege name before evaluating authorization. Specify each mapping as `action_name>privilege_name`.
