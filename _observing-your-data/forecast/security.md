---
layout: default
title: Forecasting security
nav_order: 10
parent: Forecasting
has_children: false
---

# Forecasting security

Forecasting uses the same security framework as anomaly detection. This page explains how to configure permissions for users to create, run, and view forecasters; how to restrict access to system indexes; and how to isolate forecast results across teams.

In all examples, replace credentials, index names, and role names with values appropriate for your environment.
{: .note}

## Indexes created by forecasting

The following table describes the indexes used by the Forecasting API and their visibility to regular users.

| Index pattern | Purpose | Visible to regular users? |
|---------------|---------|---------------------------|
| `.opensearch-forecasters` | Stores forecaster configuration. | **No** – system index |
| `.opensearch-forecast-checkpoints` | Stores model snapshots (checkpoints). | **No** – system index |
| `.opensearch-forecast-state` | Stores task metadata for real-time and run-once forecasting. | **No** – system index |
| `opensearch-forecast-result*` | Stores forecast results from both backtests and real-time forecasting. | **Yes** |

Users do not need direct access to `.opensearch-forecast-checkpoints`; it is used internally by the plugin.  

To view `.opensearch-forecasters`, use the [Get forecaster]({{site.url}}{{site.baseurl}}/observing-your-data/forecast/api/#get-forecaster) or [Search forecasters]({{site.url}}{{site.baseurl}}/observing-your-data/forecast/api/#search-forecasters) APIs.

To view `.opensearch-forecast-state`, use the [Get forecaster]({{site.url}}{{site.baseurl}}/observing-your-data/forecast/api/#get-forecaster) API with the `?task=true` query parameter or call the [Search tasks]({{site.url}}{{site.baseurl}}/observing-your-data/forecast/api/#search-tasks) API directly.


## Cluster permissions

Each Forecasting API route maps to a specific cluster-level permission, as shown in the following table. You must grant these permissions to roles that manage or interact with forecasters.

| Route | Required permission |
|:------------|:---------------------|
| `POST /_plugins/_forecast/forecasters` | `cluster:admin/plugin/forecast/forecaster/write` |
| `PUT /_plugins/_forecast/forecasters/{id}` | `cluster:admin/plugin/forecast/forecaster/write` |
| `POST /_plugins/_forecast/forecasters/_validate` | `cluster:admin/plugin/forecast/forecaster/validate` |
| `POST /_plugins/_forecast/forecasters/_suggest/{types}` | `cluster:admin/plugin/forecast/forecaster/suggest` |
| `GET /_plugins/_forecast/forecasters/{id}` <br>`GET /_plugins/_forecast/forecasters/{id}?task=true` | `cluster:admin/plugin/forecast/forecaster/get` |
| `DELETE /_plugins/_forecast/forecasters/{id}` | `cluster:admin/plugin/forecast/forecaster/delete` |
| `POST /_plugins/_forecast/forecasters/{id}/_start` <br>`POST /_plugins/_forecast/forecasters/{id}/_stop` | `cluster:admin/plugin/forecast/forecaster/jobmanagement` |
| `POST /_plugins/_forecast/forecasters/{id}/_run_once` | `cluster:admin/plugin/forecast/forecaster/runOnce` |
| `POST /_plugins/_forecast/forecasters/_search` <br>`GET /_plugins/_forecast/forecasters/_search` | `cluster:admin/plugin/forecast/forecaster/search` |
| `GET /_plugins/_forecast/forecasters/tasks/_search` | `cluster:admin/plugin/forecast/tasks/search` |
| `POST /_plugins/_forecast/forecasters/{id}/results/_topForecasts` | `cluster:admin/plugin/forecast/result/topForecasts` |
| `GET /_plugins/_forecast/forecasters/{id}/_profile` | `cluster:admin/plugin/forecast/forecasters/profile` |
| `GET /_plugins/_forecast/stats` | `cluster:admin/plugin/forecast/forecaster/stats` |
| `GET /_plugins/_forecast/forecasters/count` <br>`GET /_plugins/_forecast/forecasters/match` | `cluster:admin/plugin/forecast/forecaster/info` |

## Required roles

A forecasting user needs three types of privileges, based on the following responsibilities:

- Managing the forecasting job
- Reading the source data
- Accessing the forecast results

These responsibilities correspond to three distinct security layers, as shown in the following table.

| Layer | What it controls | Typical role |
|-------|------------------|--------------|
| **Forecaster control** | Permissions to create, edit, start, stop, delete, or view a forecaster's configuration. | `forecast_full_access` <br>(manage lifecycle)<br>or<br>`forecast_read_access` <br>(view only) |
| **Data-source read** | Grants the forecaster permission to query the raw metrics index it uses for training and prediction. | Custom role, such as `data_source_read` |
| **Result read** | Grants users and Alerting monitors access to documents in `opensearch-forecast-result*`. | Custom role, such as `forecast_result_read` |


The built-in roles `forecast_full_access` and `forecast_read_access` apply only to Forecasting APIs. They do **not** include permissions for source or result indexes—those must be granted separately.
{: .note}


### Forecaster control roles

The Forecasting API includes two built-in roles that you can use as is or use as templates for creating custom roles:

- `forecast_read_access` – For analysts who need read-only access to forecasters. This role allows users to view forecaster details and results but not create, modify, start, stop, or delete forecasters.


- `forecast_full_access` – For users responsible for managing the full lifecycle of forecasters, including creating, editing, starting, stopping, and deleting them. This role does **not** grant access to the source index. To create a forecaster, users must also have index-level permissions that include the `search` action on any index or alias the forecaster reads from.

The following example shows how these roles are defined:

```yaml
forecast_read_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/plugin/forecast/forecaster/info'
    - 'cluster:admin/plugin/forecast/forecaster/stats'
    - 'cluster:admin/plugin/forecast/forecaster/suggest'
    - 'cluster:admin/plugin/forecast/forecaster/validate'
    - 'cluster:admin/plugin/forecast/forecasters/get'
    - 'cluster:admin/plugin/forecast/forecasters/info'
    - 'cluster:admin/plugin/forecast/forecasters/search'
    - 'cluster:admin/plugin/forecast/result/topForecasts'
    - 'cluster:admin/plugin/forecast/tasks/search'
  index_permissions:
    - index_patterns:
        - 'opensearch-forecast-result*'
      allowed_actions:
        - 'indices:admin/mappings/fields/get*'
        - 'indices:admin/resolve/index'
        - 'indices:data/read*'

forecast_full_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/plugin/forecast/*'
    - 'cluster:admin/settings/update'
    - 'cluster_monitor'
  index_permissions:
    - index_patterns:
        - '*'
      allowed_actions:
        - 'indices:admin/aliases/get'
        - 'indices:admin/mapping/get'
        - 'indices:admin/mapping/put'
        - 'indices:admin/mappings/fields/get*'
        - 'indices:admin/mappings/get'
        - 'indices:admin/resolve/index'
        - 'indices:data/read*'
        - 'indices:data/read/field_caps*'
        - 'indices:data/read/search'
        - 'indices:data/write*'
        - 'indices_monitor'
```
{% include copy.html %}

These roles do not include default `index_permissions` for specific source or result indexes. This is intentional, allowing you to add your own patterns based on your data access requirements.

### Data-source read role

Each forecaster uses the creating user's credentials to query the source index. To enable this, you must grant that user read permissions for your own data index.

The following example request creates a minimal role that allows read access to the `network-metrics` index:

```json
PUT _plugins/_security/api/roles/data_source_read
{
  "index_permissions": [{
    "index_patterns": ["network-metrics"],
    "allowed_actions": ["read"]
  }]
}
```

You can modify the `index_patterns` to match your actual data source.

### `Result‑read` role

The `forecast_result_read` role allows users to view forecast results and configure Alerting monitors that query those results.

The following example request defines a role that grants read access to all indexes matching the `opensearch-forecast-result*` pattern:

```json
PUT _plugins/_security/api/roles/forecast_result_read
{
  "index_permissions": [{
    "index_patterns": ["opensearch-forecast-result*"],
    "allowed_actions": ["read"]
  }]
}
```

If you need to isolate result data between teams, you can enhance this role using document-level security (DLS) with a backend role filter, as shown in the following section.

### Example security role configuration

The following example request creates a `devOpsEngineer` user and assigns all three required roles for forecasting:

```json
PUT _plugins/_security/api/internalusers/devOpsEngineer
{
  "password": "DevOps2024!",
  "opendistro_security_roles": [
    "forecast_full_access",
    "data_source_read",
    "forecast_result_read"
  ]
}
```

This configuration enables the following:

- `devOpsEngineer` can manage forecasters (`forecast_full_access`).
- Forecasters can query the source index successfully (`data_source_read`).
- The user and any configured monitors can read forecast results (`forecast_result_read`).

To grant read-only access to forecaster configurations, replace `forecast_full_access` with `forecast_read_access`.

---

## (Advanced) Limit access by backend role

You can use backend roles to enforce **team-specific isolation**. This pattern allows different teams to operate forecasters independently while separating configurations and results.

The model includes three layers:

1. **Configuration isolation** – Forecasting APIs are restricted to users with a matching backend role.
2. **Result isolation** – DLS limits access to forecast results in `opensearch-forecast-result*`.
3. **Source data access** – A minimal read-only role enables each forecaster to scan its own index.

The following sections explain how to configure each layer.

### Assign backend roles to users

In most environments, backend roles are assigned through LDAP or SAML. However, if you are using the internal user database, you can set them manually, as shown in the following example:

```json
# Analyst
PUT _plugins/_security/api/internalusers/alice
{
  "password": "alice",
  "backend_roles": ["analyst"]
}

# HR staff
PUT _plugins/_security/api/internalusers/bob
{
  "password": "bob",
  "backend_roles": ["human-resources"]
}
```

These backend roles can then be used to control access to forecasters and forecast results on a per-team basis.

### Enable backend-role filtering for configuration access

To isolate forecaster configurations by team, enable backend-role filtering at the cluster level:


```bash
PUT _cluster/settings
{
  "persistent": {
    "plugins.forecast.filter_by_backend_roles": true
  }
}
```

When this setting is enabled, OpenSearch records the creator's backend roles in each forecaster document. Only users with a matching backend role can view, edit, or delete that forecaster.

### Create a `result‑access` role per team

Forecast results are stored in shared indexes, so use DLS to restrict access by backend role.

The following example creates a role that allows users with the `analyst` backend role to read and write only their team’s forecast results:


```json
PUT _plugins/_security/api/roles/forecast_analyst_result_access
{
  "index_permissions": [{
    "index_patterns": ["opensearch-forecast-result*"],
    "dls": """
    {
      "bool": {
        "filter": [{
          "nested": {
            "path": "user",
            "query": {
              "term": {
                "user.backend_roles.keyword": "analyst"
              }
            },
            "score_mode": "none"
          }
        }]
      }
    }""",
    "allowed_actions": ["read","write"]
  }]
}
```

To isolate results for another team, such as `human-resources`, create a separate role (for example, `forecast_human_resources_result_access`) and update the term value to match the appropriate backend role.

### Define `data-source` read access

The `data_source_read` role is defined in the same way as in earlier examples. It grants minimal read access to the metrics index that each forecaster uses for training and prediction.

You can reuse this role across teams or create separate versions if you need per-index restrictions.

### Map a user to three roles

The following example maps the user `alice` to all three required roles—`full_access`, `result_access`, and `data_source_read`—using the `analyst` backend role:

```json
PUT _plugins/_security/api/internalusers/alice
{
  "password": "alice",
  "backend_roles": ["analyst"],
  "opendistro_security_roles": [
    "forecast_full_access",
    "forecast_analyst_result_access",
    "data_source_read"
  ]
}
```

With this configuration, Alice can:

- Create, start, stop, and delete only forecasters tagged with the `analyst` backend role.
- View only forecast results tagged with the `analyst` backend role.
- Read the `network-metrics` index as the source for her forecasters.

To configure a second user, such as `bob` from the HR team, use a parallel setup with the `human-resources` backend role and `forecast_human_resources_result_access`.

### Users without backend roles

If a user has the `forecast_read_access` role but no backend roles, they cannot view any forecasters. Backend-role filtering enforces strict matching and prevents access to configurations that do not align with the user's roles.

---

## Selecting remote indexes with fine-grained access control

To use a remote index as a data source for a forecaster, follow the steps outlined in the [Authentication flow]({{site.url}}{{site.baseurl}}/search-plugins/cross-cluster-search/#authentication-flow) section of the [Cross-cluster search]({{site.url}}{{site.baseurl}}/search-plugins/cross-cluster-search/) documentation.

To succeed, the user must:

- Use a security role that exists in both the local and remote clusters.
- Have that role mapped to the same username in both clusters.

### Example: Create a new user in the local cluster

Using the following command, create a new user in the local cluster who can create the forecaster:

```bash
curl -XPUT -k -u 'admin:<custom-admin-password>' \
  'https://localhost:9200/_plugins/_security/api/internalusers/forecastuser' \
  -H 'Content-Type: application/json' \
  -d '{"password":"password"}'
```
{% include copy-curl.html %}

Using the following command, map the new user to the `forecast_full_access` role:

```
curl -XPUT -k -u 'admin:<custom-admin-password>' \
  'https://localhost:9200/_plugins/_security/api/rolesmapping/forecast_full_access' \
  -H 'Content-Type: application/json' \
  -d '{"users":["forecastuser"]}'
```
{% include copy-curl.html %}

In the remote cluster, create the same user and map `forecast_full_access` to that role, as shown in the following command:

```bash
# Create the user
curl -XPUT -k -u 'admin:<custom-admin-password>' \
  'https://localhost:9250/_plugins/_security/api/internalusers/forecastuser' \
  -H 'Content-Type: application/json' \
  -d '{"password":"password"}'

# Map the role
curl -XPUT -k -u 'admin:<custom-admin-password>' \
  'https://localhost:9250/_plugins/_security/api/rolesmapping/forecast_full_access' \
  -H 'Content-Type: application/json' \
  -d '{"users":["forecastuser"]}'
```
{% include copy-curl.html %}

### Grant source index read access in both clusters

To create a forecaster, the user also needs index-level permissions for the `search` or `read` [action groups]({{site.url}}{{site.baseurl}}/security/access-control/default-action-groups/) on every source index, alias, or pattern that the forecaster reads. The permission check occurs in both clusters when reading a remote index. Define and map the same role in both locations.


In the local cluster, define a read role that grants access to the source index and map it to the forecasting user, as shown in the following:

```bash
# Create a role that can search the data
curl -XPUT -k -u 'admin:<custom-admin-password>' \
  'https://localhost:9200/_plugins/_security/api/roles/data_source_read' \
  -H 'Content-Type: application/json' \
  -d '{
        "index_permissions":[{
          "index_patterns":["network-requests"],
          "allowed_actions":["search"]
        }]
      }'

# Map the role to forecastuser
curl -XPUT -k -u 'admin:<custom-admin-password>' \
  'https://localhost:9200/_plugins/_security/api/rolesmapping/data_source_read' \
  -H 'Content-Type: application/json' \
  -d '{"users":["forecastuser"]}'
```
{% include copy-curl.html %}

In the remote cluster, define the same role and map it to the same user to ensure that permissions are mirrored across clusters, as shown in the following command:

```
# Create the identical role
curl -XPUT -k -u 'admin:<custom-admin-password>' \
  'https://localhost:9250/_plugins/_security/api/roles/data_source_read' \
  -H 'Content-Type: application/json' \
  -d '{
        "index_permissions":[{
          "index_patterns":["network-requests"],
          "allowed_actions":["search"]
        }]
      }'

# Map the role to the same user
curl -XPUT -k -u 'admin:<custom-admin-password>' \
  'https://localhost:9250/_plugins/_security/api/rolesmapping/data_source_read' \
  -H 'Content-Type: application/json' \
  -d '{"users":["forecastuser"]}'
```
{% include copy-curl.html %}


### Register the remote cluster with the local cluster

Register the remote cluster with the local cluster using a seed node under the `cluster.remote.<alias>.seeds` setting. In OpenSearch, this is called adding a `follower` cluster.

Assuming that the remote cluster is listening on transport port `9350`, run the following command in the local cluster:

```
curl -X PUT "https://localhost:9200/_cluster/settings" \
  -H "Content-Type: application/json" \
  -u "admin:<custom-admin-password>" \
  -d '{
    "persistent": {
      "cluster.remote": {
        "follower": {
          "seeds": [ "127.0.0.1:9350" ]
        }
      }
    }
  }'
```
{% include copy-curl.html %}


- Replace `127.0.0.1` with the remote node's transport layer IP if it's located on a different host.
- The alias `follower` can be any name you choose and will be used when referencing remote indexes or configuring cross-cluster replication.
{: .note}

---

## Custom result index permissions

You can specify a custom index for forecast results instead of using the default result index. If the custom index does not already exist, it will be created automatically when you create a forecaster and start a real-time analysis or test run.

If the custom index already exists, the Forecasting API checks that the index mapping matches the expected forecast result structure. To ensure compatibility, the index must conform to the schema defined in the [`forecast-results.json`](https://github.com/opensearch-project/anomaly-detection/blob/main/src/main/resources/mappings/forecast-results.json) file.

When a user creates a forecaster—either in OpenSearch Dashboards or by calling the Forecasting API—the system verifies that the user has the following index-level permissions for the custom index:

- `indices:admin/create` – Required to create and roll over the custom result index.
- `indices:admin/aliases` – Required to create and manage the index alias.
- `indices:data/write/index` – Required to write forecast results to the index (single-stream forecasters).
- `indices:data/read/search` – Required to search the custom index when displaying forecast results.
- `indices:data/write/delete` – Required to delete older forecast results and manage disk usage.
- `indices:data/write/bulk*` – Required because the plugin writes results using the Bulk API.

## Next step

For more information about TLS, authentication backends, tenant isolation, and audit logging, see the [Security plugin documentation]({{site.url}}{{site.baseurl}}/security/).
