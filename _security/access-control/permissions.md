---
layout: default
title: Permissions
parent: Access control
nav_order: 110
redirect_from:
  - /security-plugin/access-control/permissions/
---

# Permissions

Each permission in the Security plugin controls access to some action that the OpenSearch cluster can perform, such as indexing a document or checking cluster health.

Most permissions are self-describing. For example, `cluster:admin/ingest/pipeline/get` lets you retrieve information about ingest pipelines. _In many cases_, a permission correlates to a specific REST API operation, such as `GET _ingest/pipeline`.

Despite this correlation, permissions do **not** directly map to REST API operations. Operations such as `POST _bulk` and `GET _msearch` can access many indexes and perform many actions in a single request. Even a simple request, such as `GET _cat/nodes`, performs several actions in order to generate its response.

In short, controlling access to the REST API is insufficient. Instead, the Security plugin controls access to the underlying OpenSearch actions.

For example, consider the following `_bulk` request:

```json
POST _bulk
{ "delete": { "_index": "test-index", "_id": "tt2229499" } }
{ "index": { "_index": "test-index", "_id": "tt1979320" } }
{ "title": "Rush", "year": 2013 }
{ "create": { "_index": "test-index", "_id": "tt1392214" } }
{ "title": "Prisoners", "year": 2013 }
{ "update": { "_index": "test-index", "_id": "tt0816711" } }
{ "doc" : { "title": "World War Z" } }

```

For this request to succeed, you must have the following permissions for `test-index`:

- indices:data/write/bulk*
- indices:data/write/delete
- indices:data/write/index
- indices:data/write/update

These permissions also allow you add, update, or delete documents (e.g. `PUT test-index/_doc/tt0816711`), because they govern the underlying OpenSearch actions of indexing and deleting documents rather than a specific API path and HTTP method.


## Test permissions

If you want a user to have the absolute minimum set of permissions necessary to perform some function—the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege)—the best way is to send representative requests to your cluster as a new test user. In the case of a permissions error, the Security plugin is very explicit about which permissions are missing. Consider this request and response:

```json
GET _cat/shards?v

{
  "error": {
    "root_cause": [{
      "type": "security_exception",
      "reason": "no permissions for [indices:monitor/stats] and User [name=test-user, backend_roles=[], requestedTenant=null]"
    }]
  },
  "status": 403
}
```

The preceding request runs the actual operation to test permissions. To simulate the check without executing the operation, set the `perform_permission_check` query parameter to `true`:

```json
PUT /my_index/_doc/1?perform_permission_check=true
{
   "title": "Test Document"
}
```
{% include copy-curl.html %}

The response indicates whether the user has sufficient permissions to perform the operation and lists any missing privileges. This option is particularly useful for safely testing operations such as `POST`, `PUT`, and `DELETE`.

When the user has sufficient permissions, the response appears similar to the following:

```json
{
   "accessAllowed": true,
   "missingPrivileges": []
}
```

When the user does not have sufficient permissions, the response lists the missing privileges:

```json
{
   "accessAllowed": false,
   "missingPrivileges": ["indices:data/write/index"]
}
```

[Create a user and a role]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/), map the role to the user, and start sending signed requests using curl, Postman, or any other client. Then gradually add permissions to the role as you encounter errors. Even after you resolve one permissions error, the same request might generate new errors; the plugin only returns the first error it encounters, so keep trying until the request succeeds.

Rather than individual permissions, you can often achieve your desired security posture using a combination of the default action groups. See [Default action groups]({{site.url}}{{site.baseurl}}/security/access-control/default-action-groups/) for descriptions of the permissions that each group grants.
{: .tip }


## System index permissions

System index permissions are unique among other permissions in that they extend some traditional admin-only accessibility to non-admin users. These permissions give normal users the ability to modify any system index specified in the role or roles to which they are mapped. The exception to this is the security system index, `.opendistro_security`, which is used to store the Security plugin's configuration YAML files and remains accessible only to admins with an admin certificate.

Along with standard index permissions, you specify system index permissions in the `roles.yml` configuration file under `index_permissions` (see [roles.yml]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#rolesyml)). This involves a two-step process: 1) adding the system index in the `index_patterns` section and 2) specifying `system:admin/system_index` in the role's `allowed_actions` section.

For example, the system index permission that gives a user permission to modify the system index that stores configurations for the Alerting plugin is defined by the index pattern `.opendistro-alerting-config`, and its allowed action is defined as `system:admin/system_index`. The following role shows how this system index permission is configured along with other attributes:

```yml
alerting-role:
  reserved: true
  hidden: false
  cluster_permissions:
    - 'cluster:admin/opendistro/alerting/alerts/ack'
    - 'cluster:admin/opendistro/alerting/alerts/get'
  index_permissions:
    - index_patterns:
        - .opendistro-alerting-config
    - allowed_actions:
        - 'system:admin/system_index'
```
{% include copy.html %}

System index permissions also work with the wildcard to include all variations of a partial system index name. This can be useful, but it should be used with caution to avoid giving unintentional access to system indexes. When specifying system indexes for roles, keep the following considerations in mind:

* Specifying the full name of a system index limits access to only that index: `.opendistro-alerting-config`.
* Specifying a partial name for a system index along with the wildcard provides access to all system indexes that begin with that name: `.opendistro-anomaly-detector*`.
* Although not recommended---given the wide-reaching access granted by this role definition---using `*` for the index pattern along with `system:admin/system_index` as an allowed action grants access to all system indexes.

  Entering the wildcard `*` by itself under `allowed_actions` does not automatically grant access to system indexes. The allowed action `system:admin/system_index` must be explicitly added.
  {: .note }

The following example shows a role that grants access to all system indexes:

```yml
index_permissions:
    - index_patterns:
        - '*'
    - allowed_actions:
        - 'system:admin/system_index'
```


### Verifying system index access

You can use the [CAT indices]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-indices/) operation to see all indexes associated with any index pattern in your permissions configuration and verify that the permissions provide the access you intended. For example, if you want to verify a permission that includes system indexes beginning with the prefix `.kibana`, you can run the `GET /_cat/indices/.kibana*` call to return all indexes associated with that prefix.

The following example response shows the three system indexes associated with the index pattern `.kibana*`:

```json
health | status | index | uuid | pri | rep | docs.count | docs.deleted | store.size | pri.store.size
green open .kibana_1 XmTePICFRoSNf5O5uLgwRw 1 1 220 0 468.3kb 232.1kb
green open .kibana_2 XmTePICFRoSNf5O5uLgwRw 1 1 220 0 468.3kb 232.1kb
green open .kibana_3 XmTePICFRoSNf5O5uLgwRw 1 1 220 0 468.3kb 232.1kb
```


### Enabling system index permissions

Users that have the permission [`restapi:admin/roles`]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api) are able to map system index permissions to all users in the same way they would for a cluster or index permission in the `roles.yml` file. However, to preserve some control over this permission, the `plugins.security.system_indices.permission.enabled` setting allows you to enable or disable the system index permissions feature. This setting is disabled by default. To enable the system index permissions feature, set `plugins.security.system_indices.permissions.enabled` to `true`. For more information about this setting, see [Enabling user access to system indexes]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#enabling-user-access-to-system-indexes).

Keep in mind that enabling this feature and mapping system index permissions to normal users gives those users access to indexes that may contain sensitive information and configurations essential to a cluster's health. We also recommend caution when mapping users to `restapi:admin/roles` because this permission gives a user not only the ability to assign the system index permission to another user but also the ability to self-assign access to any system index.
{: .warning }

### `do_not_fail_on_forbidden`

If a user attempts to query multiple indexes, some of which they lack permissions for, by default they get an `error` in the OpenSearch Dashboards UI or an `exception` when using `cURL` or an API. If you instead want the user to receive the search results for any of the indexes for which they _do_ have permissions, you can set the option `do_not_fail_on_forbidden` to `true` in `config.yml`. See the following example:

```
_meta:
  type: "config"
  config_version: 2
config:
  dynamic:
    http:
      anonymous_auth_enabled: false
      xff:
        enabled: false
        internalProxies: "192\\.168\\.0\\.10|192\\.168\\.0\\.11"
    do_not_fail_on_forbidden: true
    authc:
      basic_internal_auth_domain:
      ...
```
It is important to remember that if this option is set to `true`, then the user is served the data as if it is the complete dataset. There is no indication that some data may be omitted.
{: .warning }

### `do_not_fail_on_forbidden_empty`

When a user attempts to view a visualization for which they lack index permissions, they will see `error` in place of the visualization. To change this behavior to display `No results displayed because all values equal 0.`, you can set `do_not_fail_on_forbidden_empty` to `true` in `config.yml`. This option is only valid if `do_not_fail_on_forbidden` is also set to `true`. See the following example:

```
_meta:
  type: "config"
  config_version: 2
config:
  dynamic:
    http:
      anonymous_auth_enabled: false
      xff:
        enabled: false
        internalProxies: "192\\.168\\.0\\.10|192\\.168\\.0\\.11"
    do_not_fail_on_forbidden: true
    do_not_fail_on_forbidden_empty: true
    authc:
      basic_internal_auth_domain:
      ...
```

## Cluster permissions

These permissions are for the cluster and can't be applied granularly. For example, you either have permissions to take snapshots (`cluster:admin/snapshot/create`) or you don't. The cluster permission, therefore, cannot grant a user privileges to take snapshots of a select set of indexes while preventing the user from taking snapshots of others.

Cross-references to API documentation in the permissions that follow are only intended to provide an understanding of the permissions. As stated at the beginning of this section, permissions often correlate to APIs but do not map directly to them.
{: .note }


### Cluster wide index permissions

| **Permission** | **Description** |
| :--- | :--- |
| `indices:admin/template/delete` |  Permission to [delete index templates]({{site.url}}{{site.baseurl}}/im-plugin/index-templates/#delete-a-template). |
| `indices:admin/template/get` |  Permission to [get index templates]({{site.url}}{{site.baseurl}}/im-plugin/index-templates/#retrieve-a-template). |
| `indices:admin/template/put` |  Permission to [create index templates]({{site.url}}{{site.baseurl}}/im-plugin/index-templates/#create-a-template). |
| `indices:data/read/scroll` |  Permission to scroll through data. This setting must be configured as both a cluster- and index-level permission. |
| `indices:data/read/scroll/clear` | Permission to clear the scroll object. This setting must be configured as both a cluster- and index-level permission. |
| `indices:data/read/mget` |  Permission to run [multiple GET operations]({{site.url}}{{site.baseurl}}/api-reference/document-apis/multi-get/) in one request. |
| `indices:data/read/mget*` |  Permission to run multiple GET operations in one request. This setting must be configured as both a cluster- and index-level permission. |
| `indices:data/read/msearch` |  Permission to run [multiple search]({{site.url}}{{site.baseurl}}/api-reference/multi-search/) requests in a single API request. This setting must be configured as both a cluster- and index-level permission. |
| `indices:data/read/msearch/template` |  Permission to bundle [multiple search templates]({{site.url}}{{site.baseurl}}/api-reference/search-template/#multiple-search-templates) and send them to your OpenSearch cluster in a single request. This setting must be configured as both a cluster- and index-level permission. |
| `indices:data/read/mtv` |  Permission to retrieve multiple term vectors with a single request. This setting must be configured as both a cluster- and index-level permission. |
| `indices:data/read/mtv*` |  Permission to retrieve multiple term vectors with a single request. This setting must be configured as both a cluster- and index-level permission. |
| `indices:data/read/search/template/render` |  Permission to render search templates. This setting must be configured as both a cluster- and index-level permission. |
| `indices:data/write/bulk` |  Permission to run a [bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) request. This setting must be configured as both a cluster- and index-level permission. |
| `indices:data/write/bulk*` |  Permission to run a bulk request. This setting must be configured as both a cluster- and index-level permission. |
| `indices:data/write/reindex` |  Permission to run a [reindex]({{site.url}}{{site.baseurl}}/im-plugin/reindex-data/) operation. |

### Ingest API permissions

See [Ingest APIs]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/).

- cluster:admin/ingest/pipeline/delete
- cluster:admin/ingest/pipeline/get
- cluster:admin/ingest/pipeline/put
- cluster:admin/ingest/pipeline/simulate
- cluster:admin/ingest/processor/grok/get

### Anomaly detection permissions

See [Anomaly Detection API]({{site.url}}{{site.baseurl}}/observing-your-data/ad/api/).

- cluster:admin/opendistro/ad/detector/delete
- cluster:admin/opendistro/ad/detector/info
- cluster:admin/opendistro/ad/detector/jobmanagement
- cluster:admin/opendistro/ad/detector/preview
- cluster:admin/opendistro/ad/detector/run
- cluster:admin/opendistro/ad/detector/search
- cluster:admin/opendistro/ad/detector/stats
- cluster:admin/opendistro/ad/detector/write
- cluster:admin/opendistro/ad/detector/validate
- cluster:admin/opendistro/ad/detectors/get
- cluster:admin/opendistro/ad/result/search
- cluster:admin/opendistro/ad/result/topAnomalies
- cluster:admin/opendistro/ad/tasks/search

### Alerting permissions

See [Alerting API]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/api/).

- cluster:admin/opendistro/alerting/alerts/ack
- cluster:admin/opendistro/alerting/alerts/get
- cluster:admin/opendistro/alerting/destination/delete
- cluster:admin/opendistro/alerting/destination/email_account/delete
- cluster:admin/opendistro/alerting/destination/email_account/get
- cluster:admin/opendistro/alerting/destination/email_account/search
- cluster:admin/opendistro/alerting/destination/email_account/write
- cluster:admin/opendistro/alerting/destination/email_group/delete
- cluster:admin/opendistro/alerting/destination/email_group/get
- cluster:admin/opendistro/alerting/destination/email_group/search
- cluster:admin/opendistro/alerting/destination/email_group/write
- cluster:admin/opendistro/alerting/destination/get
- cluster:admin/opendistro/alerting/destination/write
- cluster:admin/opendistro/alerting/monitor/delete
- cluster:admin/opendistro/alerting/monitor/execute
- cluster:admin/opendistro/alerting/monitor/get
- cluster:admin/opendistro/alerting/monitor/search
- cluster:admin/opendistro/alerting/monitor/write
- cluster:admin/opensearch/alerting/remote/indexes/get

### Asynchronous Search permissions

See [Asynchronous search]({{site.url}}{{site.baseurl}}/search-plugins/async/index/).

- cluster:admin/opendistro/asynchronous_search/stats
- cluster:admin/opendistro/asynchronous_search/delete
- cluster:admin/opendistro/asynchronous_search/get
- cluster:admin/opendistro/asynchronous_search/submit

### Index State Management permissions

See [ISM API]({{site.url}}{{site.baseurl}}/im-plugin/ism/api/).

- cluster:indices:admin/opensearch/ism/managedindex
- cluster:admin/opendistro/ism/managedindex/add
- cluster:admin/opendistro/ism/managedindex/change
- cluster:admin/opendistro/ism/managedindex/remove
- cluster:admin/opendistro/ism/managedindex/explain
- cluster:admin/opendistro/ism/managedindex/retry
- cluster:admin/opendistro/ism/policy/write
- cluster:admin/opendistro/ism/policy/get
- cluster:admin/opendistro/ism/policy/search
- cluster:admin/opendistro/ism/policy/delete

### Index rollups permissions

See [Index rollups API]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/rollup-api/).

- cluster:admin/opendistro/rollup/index
- cluster:admin/opendistro/rollup/get
- cluster:admin/opendistro/rollup/search
- cluster:admin/opendistro/rollup/delete
- cluster:admin/opendistro/rollup/start
- cluster:admin/opendistro/rollup/stop
- cluster:admin/opendistro/rollup/explain

### Reporting permissions

See [Creating reports with the Dashboards interface]({{site.url}}{{site.baseurl}}/dashboards/reporting/).

- cluster:admin/opendistro/reports/definition/create
- cluster:admin/opendistro/reports/definition/update
- cluster:admin/opendistro/reports/definition/on_demand
- cluster:admin/opendistro/reports/definition/delete
- cluster:admin/opendistro/reports/definition/get
- cluster:admin/opendistro/reports/definition/list
- cluster:admin/opendistro/reports/instance/list
- cluster:admin/opendistro/reports/instance/get
- cluster:admin/opendistro/reports/menu/download

### Transform job permissions

See [Transforms APIs]({{site.url}}{{site.baseurl}}/im-plugin/index-transforms/transforms-apis/)

- cluster:admin/opendistro/transform/index
- cluster:admin/opendistro/transform/get
- cluster:admin/opendistro/transform/preview
- cluster:admin/opendistro/transform/delete
- cluster:admin/opendistro/transform/start
- cluster:admin/opendistro/transform/stop
- cluster:admin/opendistro/transform/explain

### Observability permissions

See [Observability security]({{site.url}}{{site.baseurl}}/observing-your-data/observability-security/).

- cluster:admin/opensearch/observability/create
- cluster:admin/opensearch/observability/update
- cluster:admin/opensearch/observability/delete
- cluster:admin/opensearch/observability/get

### Cross-cluster replication

See [Cross-cluster replication security]({{site.url}}{{site.baseurl}}/tuning-your-cluster/replication-plugin/permissions/).

- cluster:admin/plugins/replication/autofollow/update

### Reindex

See [Reindex document]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/).

- cluster:admin/reindex/rethrottle

### Snapshot repository permissions

See [Snapshot APIs]({{site.url}}{{site.baseurl}}/api-reference/snapshots/index/).

- cluster:admin/repository/delete
- cluster:admin/repository/get
- cluster:admin/repository/put
- cluster:admin/repository/verify

### Reroute

See [Cluster manager task throttling]({{site.url}}{{site.baseurl}}/tuning-your-cluster/cluster-manager-task-throttling/).

- cluster:admin/reroute

### Script permissions

See [Script APIs]({{site.url}}{{site.baseurl}}/api-reference/script-apis/index/).

- cluster:admin/script/delete
- cluster:admin/script/get
- cluster:admin/script/put

### Update settings permission

See [Update settings]({{site.url}}{{site.baseurl}}/api-reference/index-apis/update-settings/) on the Index APIs page.

- cluster:admin/settings/update

### Snapshot permissions

See [Snapshot APIs]({{site.url}}{{site.baseurl}}/api-reference/snapshots/index/).

- cluster:admin/snapshot/create
- cluster:admin/snapshot/delete
- cluster:admin/snapshot/get
- cluster:admin/snapshot/restore
- cluster:admin/snapshot/status
- cluster:admin/snapshot/status*

### Task permissions

See [Tasks]({{site.url}}{{site.baseurl}}/api-reference/tasks/) in the API Reference section.

- cluster:admin/tasks/cancel
- cluster:admin/tasks/test
- cluster:admin/tasks/testunblock

### Data source permissions

See [Data sources]({{site.url}}{{site.baseurl}}/dashboards/management/data-sources/)

- cluster:admin/opensearch/ql/datasources/create
- cluster:admin/opensearch/ql/datasources/read
- cluster:admin/opensearch/ql/datasources/update
- cluster:admin/opensearch/ql/datasources/delete
- cluster:admin/opensearch/ql/datasources/patch
- cluster:admin/opensearch/ql/async_query/create
- cluster:admin/opensearch/ql/async_query/result
- cluster:admin/opensearch/ql/async_query/delete

### Security Analytics permissions

See [API tools]({{site.url}}{{site.baseurl}}/security-analytics/api-tools/index/).

| **Permission** | **Description** |
| :--- | :--- |
| cluster:admin/opensearch/securityanalytics/alerts/get | Permission to get alerts |
| cluster:admin/opensearch/securityanalytics/alerts/ack | Permission to acknowledge alerts |
| cluster:admin/opensearch/securityanalytics/detector/get | Permission to get detectors |
| cluster:admin/opensearch/securityanalytics/detector/search | Permission to search detectors |
| cluster:admin/opensearch/securityanalytics/detector/write | Permission to create and update detectors |
| cluster:admin/opensearch/securityanalytics/detector/delete | Permission to delete detectors |
| cluster:admin/opensearch/securityanalytics/findings/get | Permission to get findings |
| cluster:admin/opensearch/securityanalytics/mapping/get | Permission to get field mappings by index |
| cluster:admin/opensearch/securityanalytics/mapping/view/get | Permission to get field mappings by index and view mapped and unmapped fields |
| cluster:admin/opensearch/securityanalytics/mapping/create | Permission to create field mappings |
| cluster:admin/opensearch/securityanalytics/mapping/update | Permission to update field mappings |
| cluster:admin/opensearch/securityanalytics/rules/categories | Permission to get all rule categories |
| cluster:admin/opensearch/securityanalytics/rule/write | Permission to create and update rules |
| cluster:admin/opensearch/securityanalytics/rule/search | Permission to search for rules |
| cluster:admin/opensearch/securityanalytics/rules/validate | Permission to validate rules |
| cluster:admin/opensearch/securityanalytics/rule/delete | Permission to delete rules |

### Monitoring permissions

Cluster permissions for monitoring the cluster apply to read-only operations, such as checking cluster health and getting information about usage on nodes or tasks running in the cluster.

See [REST API reference]({{site.url}}{{site.baseurl}}/api-reference/index/).

- cluster:monitor/allocation/explain
- cluster:monitor/health
- cluster:monitor/main
- cluster:monitor/nodes/hot_threads
- cluster:monitor/nodes/info
- cluster:monitor/nodes/liveness
- cluster:monitor/nodes/stats
- cluster:monitor/nodes/usage
- cluster:monitor/remote/info
- cluster:monitor/state
- cluster:monitor/stats
- cluster:monitor/task
- cluster:monitor/task/get
- cluster:monitor/tasks/lists

### Index templates

The index template permissions are for indexes but apply globally to the cluster.

See [Index templates]({{site.url}}{{site.baseurl}}/im-plugin/index-templates/).

- indices:admin/index_template/delete
- indices:admin/index_template/get
- indices:admin/index_template/put
- indices:admin/index_template/simulate
- indices:admin/index_template/simulate_index


## Index permissions

These permissions apply to an index or index pattern. You might want a user to have read access to all indexes (that is, `*`), but write access to only a few (for example, `web-logs` and `product-catalog`).

<!-- vale off -->

| **Permission** | **Description** |
| :--- | :--- |
| `indices:admin/aliases` |  Permissions for [index aliases]({{site.url}}{{site.baseurl}}/im-plugin/index-alias/). |
| `indices:admin/aliases/get` |  Permission to get [index aliases]({{site.url}}{{site.baseurl}}/im-plugin/index-alias/). |
| `indices:admin/analyze` |  Permission to use the [Analyze API]({{site.url}}{{site.baseurl}}/api-reference/analyze-apis/). |
| `indices:admin/cache/clear` |  Permission to [clear cache]({{site.url}}{{site.baseurl}}/api-reference/index-apis/clear-index-cache/). |
| `indices:admin/close` |  Permission to [close an index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/close-index/). |
| `indices:admin/close*` |  Permission to [close an index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/close-index/). |
| `indices:admin/create` |  Permission to [create indexes]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/). |
| `indices:admin/data_stream/create` |  Permission to create [data streams]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/datastream/#creating-a-data-stream). |
| `indices:admin/data_stream/delete` |  Permission to [delete data streams]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/datastream/#deleting-a-data-stream). |
| `indices:admin/data_stream/get` |  Permission to [get data streams]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/datastream/#viewing-a-data-stream). |
| `indices:admin/delete` |  Permission to [delete indexes]({{site.url}}{{site.baseurl}}/api-reference/index-apis/delete-index/). |
| `indices:admin/exists` |  Permission to use [exists query]({{site.url}}{{site.baseurl}}/query-dsl/term/exists/). |
| `indices:admin/flush` |  Permission to [flush an index]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index-management/#flushing-an-index). |
| `indices:admin/flush*` |  Permission to [flush an index]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index-management/#flushing-an-index). |
| `indices:admin/forcemerge` |  Permission to force merge indexes and data streams. |
| `indices:admin/get` |  Permission to get index and mapping. |
| `indices:admin/mapping/put` |  Permission to add new mappings and fields to an index. |
| `indices:admin/mappings/fields/get` |  Permission to get mappings fields. |
| `indices:admin/mappings/fields/get*` |  Permission to get mappings fields. |
| `indices:admin/mappings/get` |  Permission to [get mappings]({{site.url}}{{site.baseurl}}/security-analytics/api-tools/mappings-api/#get-mappings).  |
| `indices:admin/open` |  Permission to [open an index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/open-index/). |
| `indices:admin/plugins/replication/index/setup/validate` |  Permission to validate a connection to a [remote cluster]({{site.url}}{{site.baseurl}}/tuning-your-cluster/replication-plugin/getting-started/#set-up-a-cross-cluster-connection). |
| `indices:admin/plugins/replication/index/start` |  Permission to [start cross-cluster replication]({{site.url}}{{site.baseurl}}/tuning-your-cluster/replication-plugin/getting-started/#start-replication). |
| `indices:admin/plugins/replication/index/pause` |  Permission to pause cross-cluster replication. |
| `indices:admin/plugins/replication/index/resume` |  Permission to resume cross-cluster replication. |
| `indices:admin/plugins/replication/index/stop` |  Permission to stop cross-cluster replication. |
| `indices:admin/plugins/replication/index/update` |  Permission to update cross-cluster replication settings. |
| `indices:admin/plugins/replication/index/status_check` |  Permission to check the status of cross-cluster replication. |
| `indices:admin/refresh` |  Permission to use the [index refresh API]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index-management/#refreshing-an-index). |
| `indices:admin/refresh*` |  Permission to use the index refresh API. |
| `indices:admin/resolve/index` |  Permission to resolve index names, index aliases and data streams. |
| `indices:admin/rollover` |  Permission to perform [index rollover]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/rollover/). |
| `indices:admin/seq_no/global_checkpoint_sync` | Permission to perform a global checkpoint sync. |
| `indices:admin/settings/update` |  Permission to [update index settings]({{site.url}}{{site.baseurl}}/api-reference/index-apis/update-settings/). |
| `indices:admin/shards/search_shards` |  Permission to perform [cross cluster search]({{site.url}}{{site.baseurl}}/security/access-control/cross-cluster-search/). |
| `indices:admin/upgrade` | Permission for administrators to perform upgrades. |
| `indices:admin/validate/query` |  Permission to validate a specific query. |
| `indices:data/read/explain` |  Permission to run the [Explain API]({{site.url}}{{site.baseurl}}/api-reference/explain/). |
| `indices:data/read/field_caps` |  Permission to run the [Field Capabilities API]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/alias/#using-aliases-in-field-capabilities-api-operations). |
| `indices:data/read/field_caps*` |  Permission to run the Field Capabilities API. |
| `indices:data/read/get` |  Permission to read index data. |
| `indices:data/read/mget` |  Permission to run [multiple GET operations]({{site.url}}{{site.baseurl}}/api-reference/document-apis/multi-get/) in one request. |
| `indices:data/read/mget*` |  Permission to run multiple GET operations in one request. This setting must be configured as both a cluster- and index-level permission. |
| `indices:data/read/msearch` |  Permission to run [multiple search]({{site.url}}{{site.baseurl}}/api-reference/multi-search/)  requests in a single request. This setting must be configured as both a cluster- and index-level permission. |
| `indices:data/read/msearch/template` |  Permission to bundle [multiple search templates]({{site.url}}{{site.baseurl}}/api-reference/search-template/#multiple-search-templates) and send them to your OpenSearch cluster in a single request. This setting must be configured as both a cluster- and index-level permission. |
| `indices:data/read/mtv` |  Permission to retrieve multiple term vectors with a single request. This setting must be configured as both a cluster- and index-level permission. |
| `indices:data/read/mtv*` |  Permission to retrieve multiple term vectors with a single request. This setting must be configured as both a cluster- and index-level permission. |
| `indices:data/read/plugins/replication/file_chunk` | Permission to check files during segment replication. |
| `indices:data/read/plugins/replication/changes` | Permission to make changes to segment replication settings. |
| `indices:data/read/scroll` |  Permission to scroll through data. This setting must be configured as both a cluster- and index-level permission. |
| `indices:data/read/scroll/clear` | Permission to clear the scroll object. This setting must be configured as both a cluster- and index-level permission. |
| `indices:data/read/search` |  Permission to [search]({{site.url}}{{site.baseurl}}/api-reference/search/) data. |
| `indices:data/read/search*` |  Permission to search data. |
| `indices:data/read/search/template` |  Permission to read a search template. |
| `indices:data/read/tv` |  Permission to retrieve information and statistics for terms in the fields of a particular document. |
| `indices:data/write/delete` |  Permission to [delete documents]({{site.url}}{{site.baseurl}}/api-reference/document-apis/delete-document/). |
| `indices:data/write/delete/byquery` |  Permission to delete all documents that [match a query]({{site.url}}{{site.baseurl}}/api-reference/document-apis/delete-by-query/). |
| `indices:data/write/plugins/replication/changes` |  Permission to change data replication configurations and settings within indexes. |
| `indices:data/write/bulk` |  Permission to run a [bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) request. This setting must be configured as both a cluster- and index-level permission. |
| `indices:data/write/bulk*` |  Permission to run a bulk request. This setting must be configured as both a cluster- and index-level permission. |
| `indices:data/write/index` |  Permission to add documents to existing indexes. See also [Index document]( {{site.url}}{{site.baseurl}}/api-reference/document-apis/index-document/ ). |
| `indices:data/write/update` | Permission to update an index. |
| `indices:data/write/update/byquery` |  Permission to run the script to update all of the documents that [match the query]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-by-query/). |
| `indices:monitor/data_stream/stats` | Permission to stream stats.  |
| `indices:monitor/recovery` | Permission to access recovery stats. |
| `indices:monitor/segments` |  Permission to access segment stats. |
| `indices:monitor/settings/get` | Permission to get monitor settings.  |
| `indices:monitor/shard_stores` |  Permission to access shard store stats. |
| `indices:monitor/stats` | Permission to access monitoring stats.  |
| `indices:monitor/upgrade` | Permission to access upgrade stats.  |

<!-- vale on -->


## Security REST permissions

Allowing access to these endpoints has the potential to trigger operational changes in the cluster. Proceed with caution.
{: .warning }

The following REST API permissions control access to the endpoints. Granting access to any of these APIs allows a user to change fundamental operational components of the Security plugin:

- restapi:admin/actiongroups
- restapi:admin/allowlist
- restapi:admin/internalusers
- restapi:admin/nodesdn
- restapi:admin/roles
- restapi:admin/rolesmapping
- restapi:admin/ssl/certs/info
- restapi:admin/ssl/certs/reload
- restapi:admin/tenants
