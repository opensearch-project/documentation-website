---
layout: default
title: Plugin as a service
nav_order: 5
has_children: false
has_toc: false
redirect_from: 
  - /developer-documentation/plugin-as-a-service/
canonical_url: https://docs.opensearch.org/latest/developer-documentation/plugin-as-a-service/index/
---

# Plugin as a service 
Introduced 2.19
{: .label .label-purple }

To extend core features, OpenSearch uses plugins, which have several limitations:
- They operate in the same JVM as a cluster, sharing storage, memory, and state.
- They require strict version compatibility.
- They are restricted to a single tenant.

To address these challenges, you can use a _remote metadata SDK client_, which enables stateless OpenSearch plugins using external data stores, such as a remote OpenSearch cluster or cloud storage services. Using the client improves scalability and makes plugins more adaptable for large workloads. For more information about the client, see [SDK Client Repository](https://github.com/opensearch-project/opensearch-remote-metadata-sdk).

## Remote metadata storage

Remote metadata storage allows OpenSearch plugins to operate in a stateless manner, without relying on local JVM or cluster resources, by using external storage solutions. Instead of storing metadata within the OpenSearch cluster, plugins can save it in remote locations such as other OpenSearch clusters or cloud storage services. This approach improves scalability, reduces resource contention, and enables plugins to function independently of the core OpenSearch cluster.  

Remote metadata storage offers the following benefits:

- **Scalability**: Offloading metadata storage to an external system reduces OpenSearch cluster memory and CPU usage.  
- **Multi-tenancy support**: Tenant-based storage separation enables cloud providers to offer more flexible plugin solutions, logically separating resources using tenant IDs. 

### Supported storage backends

Remote metadata storage can be configured to use the following external backends:

- Remote OpenSearch clusters
- Amazon DynamoDB

## Enabling multi-tenancy
 
To enable multi-tenancy in a plugin, update the following static settings. After the update, restart the cluster in order for the changes to take effect. For more information about ways to update the settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/).

###  Multi-tenancy setting

The following table lists the multi-tenancy setting.

| Setting | Data type | Description |
|:---|:---|:---|
| `multi_tenancy_enabled` | Boolean | Enables multi-tenancy for the plugin. |

###  Remote metadata storage settings

The following table lists settings related to remote metadata storage configuration.

| Setting | Data type | Description |
|:---|:---|:---|
| `remote_metadata_type` | String | The remote metadata storage type. Valid values are: <br> - `RemoteOpenSearch`: A remote OpenSearch cluster compatible with OpenSearch Java Client. <br> - `AWSDynamoDB` : Amazon DynamoDB with zero-ETL replication to OpenSearch. <br> - `AWSOpenSearchService`: Amazon OpenSearch Service using AWS SDK v2. |
| `remote_metadata_endpoint` | String | The remote metadata endpoint URL. |
| `remote_metadata_region` | String | The AWS region in which metadata is stored. |
| `remote_metadata_service_name` | String | The remote metadata service name. |

## Example

The following configuration enables multi-tenancy using a remote OpenSearch cluster:

```yaml
plugins.<plugin_name>.multi_tenancy_enabled: true
plugins.<plugin_name>.remote_metadata_type: "opensearch"
plugins.<plugin_name>.remote_metadata_endpoint: "https://remote-store.example.com"
plugins.<plugin_name>.remote_metadata_region: "us-west-2"
plugins.<plugin_name>.remote_metadata_service_name: "remote-store-service"
```
{% include copy.html %}

## Supported plugins

OpenSearch supports multi-tenancy for the following plugins.

### ML Commons 

The ML Commons plugin supports multi-tenancy for the following components:

- [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/)
- [Model groups]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/#model-groups)
- [Models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/) (externally hosted only)
- [Agents]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/index/#agents)
- [Tasks]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/index/)

The following example configures multi-tenancy for the ML Commons plugin:

```yaml
plugins.ml_commons.multi_tenancy_enabled: true
plugins.ml_commons.remote_metadata_type: AWSDynamoDB
plugins.ml_commons.remote_metadata_endpoint: <REMOTE_ENDPOINT>
plugins.ml_commons.remote_metadata_region: <AWS_REGION>
plugins.ml_commons.remote_metadata_service_name: <SERVICE_NAME>
```
{% include copy.html %}

### Flow Framework

The following example configures multi-tenancy for the Flow Framework plugin:

```yaml
plugins.flow_framework.multi_tenancy_enabled: true
plugins.flow_framework.remote_metadata_type: AWSDynamoDB
plugins.flow_framework.remote_metadata_endpoint: <REMOTE_ENDPOINT>
plugins.flow_framework.remote_metadata_region: <AWS_REGION>
plugins.flow_framework.remote_metadata_service_name: <SERVICE_NAME>
```
{% include copy.html %}