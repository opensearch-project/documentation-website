---
layout: default
title: Forecasting security
nav_order: 10
parent: Forecasting
has_children: false
---

# Forecasting security

The **Forecasting** feature re-uses the same security framework that protects Anomaly Detection (AD).  
This page explains how to grant users the minimum permissions they need to create, run, and view forecasters, how to keep the plugin's system indices private, and how to isolate results between teams.


In every example below, replace credentials, index names, and role names with values that make sense for your own environment.
{: .note}

---

## Indices created by Forecasting

| Index pattern | Purpose | Visible to normal users? |
|---------------|---------|---------------------------|
| `.opensearch-forecasters` | Forecaster configuration | **No** – system index |
| `.opensearch-forecast-checkpoints` | Model snapshots (checkpoints) | **No** – system index |
| `.opensearch-forecast-state` | Real-time & run-once task metadata | **No** – system index |
| `opensearch-forecast-result*` | Forecast results (test & real-time) | **Yes** |


Users never need direct access to `.opensearch-forecast-checkpoints`; the plugin handles it internally. To view `.opensearch-forecasters`, use the [Get forecaster]({{site.url}}{{site.baseurl}}/observing-your-data/forecast/api/#get-forecaster) and [Search forecasters]({{site.url}}{{site.baseurl}}/observing-your-data/forecast/api/#search-forecasters) APIs. To inspect `.opensearch-forecast-state`, call [Get forecaster]({{site.url}}{{site.baseurl}}/observing-your-data/forecast/api/#get-forecaster) with `?task=true` or the [Search tasks]({{site.url}}{{site.baseurl}}/observing-your-data/forecast/api/#search-tasks) API.
{: .note}


---

## Cluster permissions

Each REST API maps to an explicit cluster permission:

| REST route                                                                                                              | Permission                                                         |
|-------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------|
| `POST /_plugins/_forecast/forecasters`                                                                                  | `cluster:admin/plugin/forecast/forecaster/write`                   |
| `PUT  /_plugins/_forecast/forecasters/{id}`                                                                             | `cluster:admin/plugin/forecast/forecaster/write`                   |
| `POST /_plugins/_forecast/forecasters/_validate`                                                                        | `cluster:admin/plugin/forecast/forecaster/validate`                |
| `POST /_plugins/_forecast/forecasters/_suggest/{types}`                                                                 | `cluster:admin/plugin/forecast/forecaster/suggest`                 |
| `GET  /_plugins/_forecast/forecasters/{id}`<br>`GET  /_plugins/_forecast/forecasters/{id}?task=true`                    | `cluster:admin/plugin/forecast/forecaster/get`                     |
| `DELETE /_plugins/_forecast/forecasters/{id}`                                                                           | `cluster:admin/plugin/forecast/forecaster/delete`                  |
| `POST /_plugins/_forecast/forecasters/{id}/_start`                                                                      | `cluster:admin/plugin/forecast/forecaster/jobmanagement`           |
| `POST /_plugins/_forecast/forecasters/{id}/_stop`                                                                       | `cluster:admin/plugin/forecast/forecaster/jobmanagement`           |
| `POST /_plugins/_forecast/forecasters/{id}/_run_once`                                                                   | `cluster:admin/plugin/forecast/forecaster/runOnce`                 |
| `POST /_plugins/_forecast/forecasters/_search`<br>`GET  /_plugins/_forecast/forecasters/_search`                        | `cluster:admin/plugin/forecast/forecaster/search`                  |
| `GET  /_plugins/_forecast/forecasters/tasks/_search`                                                                    | `cluster:admin/plugin/forecast/tasks/search`                       |
| `POST /_plugins/_forecast/forecasters/{id}/results/_topForecasts`                                                       | `cluster:admin/plugin/forecast/result/topForecasts`                |
| `GET  /_plugins/_forecast/forecasters/{id}/_profile`                                                                    | `cluster:admin/plugin/forecast/forecasters/profile`                |
| `GET  /_plugins/_forecast/stats`                                                                                        | `cluster:admin/plugin/forecast/forecaster/stats`                   |
| `GET  /_plugins/_forecast/forecasters/count`                                                                            | `cluster:admin/plugin/forecast/forecaster/info`                    |
| `GET  /_plugins/_forecast/forecasters/match`                                                                            | `cluster:admin/plugin/forecast/forecaster/info`                    |

---

## Required roles

A forecasting user needs **three distinct kinds of privileges**.  
Think of them as *who can touch the job*, *where the data comes from*, and *where the predictions go*:

| Layer | What it controls | Typical role |
| :--- | :--- | :--- |
| **Forecaster control** | Create, edit, start, stop, delete, or simply _view_ a forecaster's configuration. | `forecast_full_access` <br>*(manage lifecycle)*<br>or<br>`forecast_read_access` <br>*(view‑only)* |
| **Data‑source read** | Grant the forecaster permission to query the raw metrics index it models. | Custom role, e.g. `data_source_read` |
| **Result read** | Allow users (and Alerting monitors) to read documents in `opensearch‑forecast‑result*`. | Custom role, e.g. `forecast_result_read` |

The built‑in roles **`forecast_full_access`** and **`forecast_read_access`** focus solely on the *forecasting* APIs.  They do **not** guarantee access to the source index **or** to the result indices—​those must be added separately.
{: .note}

### Forecaster‑control roles

The plugin includes two built-in roles that you can use out of the box or treat as blueprints for custom roles:

* **`forecast_read_access`** – for analysts who only need to look at existing forecasters. Holders of this role cannot create, start, stop, or delete a forecaster.

* **`forecast_full_access`** – for operators who manage the lifecycle of forecasters (create, edit, start, stop, delete). `forecast_full_access` **does not** grant access to the source data itself. To create a forecaster, the user must also have an index-level role that includes at least the `search` action on every index, alias, or pattern that the forecaster will read.

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

Neither role contains `index_permissions`—​that's deliberate so that you can plug in your own source‑ and result‑access patterns.

### Data-source read role

Every forecaster queries its **source index** using the creating user's credentials.  
Grant that user a minimal read role on **your own data index**. For example, the following role provides read access to the `network-metrics` index:

```json
PUT _plugins/_security/api/roles/data_source_read
{
  "index_permissions": [{
    "index_patterns": ["network-metrics"],
    "allowed_actions": ["read"]
  }]
}
```

### Result‑read role

The result-read role lets users inspect forecasts and create Alerting monitors. For example, the following role grants read access to the index pattern `opensearch-forecast-result*`:

```json
PUT _plugins/_security/api/roles/forecast_result_read
{
  "index_permissions": [{
    "index_patterns": ["opensearch-forecast-result*"],
    "allowed_actions": ["read"]
  }]
}
```

You can enrich this role with DLS to filter by backend role (see below) if you need per‑team data isolation.

### Putting it together  

The following example creates a **devOpsEngineer** user and assigns the three required roles:

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

* **devOpsEngineer** can manage forecasters (`forecast_full_access`).  
* Forecasters run successfully (`data_source_read`).  
* The user (and their monitors) can query prediction docs (`forecast_result_read`).

Swap `forecast_full_access` for `forecast_read_access` if the user should be read‑only on configs.

---

## (Advanced) Limit access by backend role

Backend roles let you create **team‑specific silos** for forecasting. The pattern has three layers:

1. **Config isolation** – forecaster APIs are gated by backend‑role matching.  
2. **Result isolation** – a DLS role restricts access to `opensearch‑forecast‑result*`.  
3. **Source‑data access** – a minimal read‑only role grants the forecaster permission to scan its index.

The following sections demonstrate how to set up each of these layers.

### Assign backend roles to users

Backend roles usually arrive from LDAP or SAML, but if you use the internal user database you can add them manually:

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

### Turn on backend‑role filtering for *configs*

```bash
PUT _cluster/settings
{
  "persistent": {
    "plugins.forecast.filter_by_backend_roles": true
  }
}
```

When enabled, OpenSearch writes the creator's backend roles into every forecaster document.

### Create a result‑access role per team

Forecaster results live in separate indices, so lock them down with Document‑Level Security (DLS).

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

Create a corresponding role, `forecast_human_resources_result_access`, for the `human-resources` backend role by updating the term value accordingly.

### Define data‑source read access

`data_source_read` role is defined similarly as above.

### Map a user to **three** roles

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

With the above setup, Alice can:

* Create, start, stop, and delete only **analyst** forecasters.  
* Query only result docs tagged `analyst`.  
* Read the `network-metrics` index to feed her model.

Bob gets the symmetrical setup with `forecast_human_resources_result_access`. Bob sees only those tagged `human-resources`.

### What if users lack backend roles?

If a user has `forecast_read_access` but **no** backend roles, they cannot see other forecasters.  

---

## Selecting remote indexes with fine-grained access control

To use a remote index as a data source for a forecaster, see the setup steps in [Authentication flow]({{site.url}}{{site.baseurl}}/search-plugins/cross-cluster-search/#authentication-flow) in [Cross-cluster search]({{site.url}}{{site.baseurl}}/search-plugins/cross-cluster-search/). You must use a role that exists in both the remote and local clusters. The remote cluster must map the chosen role to the same username as in the local cluster.

### Example: Create a new user on the local cluster

Create a new user on the local cluster to use for forecaster creation:

```
curl -XPUT -k -u 'admin:<custom-admin-password>' \
  'https://localhost:9200/_plugins/_security/api/internalusers/forecastuser' \
  -H 'Content-Type: application/json' \
  -d '{"password":"password"}'
```
{% include copy-curl.html %}

Map the new user to the `forecast_full_access` role:

```
curl -XPUT -k -u 'admin:<custom-admin-password>' \
  'https://localhost:9200/_plugins/_security/api/rolesmapping/forecast_full_access' \
  -H 'Content-Type: application/json' \
  -d '{"users":["forecastuser"]}'
```
{% include copy-curl.html %}

On the remote cluster, create the same user and map `forecast_full_access` to that role:

```
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

To create a forecaster, the user must have an index-level role that grants at least the `search` or `read` [action group]({{site.url}}{{site.baseurl}}/security/access-control/default-action-groups/) on every source index, alias, or pattern the forecaster reads. If any of those indices live in a **remote** cluster, create the same role in that cluster and map the same user to it—the permission check runs in both the local and remote clusters during cross-cluster searches. The example below uses the minimal `search` action on the `network-requests` index. Define the same role—and mapping—in both clusters.


local cluster:
```
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

remote cluster:

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

The final step is to tell the **local** cluster where it can reach the **remote** one.  
In OpenSearch terms, you add the remote cluster as a *follower* by defining its seed node(s) under `cluster.remote.<alias>.seeds`.

Assuming the remote cluster is listening on transport port `9350`, run the command below **on the local cluster**:

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

Note:
* Replace 127.0.0.1 with the transport-layer IP of the remote node if it's on a different host.
* The alias follower can be any name you choose; you'll use the same alias when creating cross-cluster index patterns or replication jobs.
{: .note}

---

## Custom result index Permissions

We allow users to use custom result index instead of default result index. If the custom index you specify does not exist, we will create it when you create the forecaster and start your real-time analysis or test run.

If the custom index already exists, the plugin will verify that the index mapping matches the required structure for forecast results. In this case, ensure that the custom index has a valid mapping as defined in the [`forecast-results.json`](https://github.com/opensearch-project/anomaly-detection/blob/main/src/main/resources/mappings/forecast-results.json) file.

When a user attempts to create a forecaster—either through the Dashboards interface or by invoking the create forecaster API—the system verifies that the user's identity has the following permissions:

- `indices:admin/create` -- The `create` permission is required in order to create and roll over the custom index.
- `indices:admin/aliases` -- The `aliases` permission is required in order to create and manage an alias for the custom index.
- `indices:data/write/index` -- The `write` permission is required in order to write results into the custom index for a single-stream forecaster.
- `indices:data/read/search` -- The `search` permission is required in order to search custom results indexes to show results on the forecasting result page.
- `indices:data/write/delete` -- The forecaster may generate many forecaster results. The `delete` permission is required in order to delete old data and save disk space.
- `indices:data/write/bulk*` -- The `bulk*` permission is required because the plugin uses the Bulk API to write results into the custom index.

---

That's all you need to secure Forecasting.  
For general OpenSearch Security guidance (TLS certificates, authentication back-ends, tenants, audit logs) see the [Security plugin documentation]({{site.url}}{{site.baseurl}}/security).
