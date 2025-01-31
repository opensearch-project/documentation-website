---
layout: default
title: Plugin as a Service
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
permalink: /plugin-as-service/
redirect_from: 
  - /plugin-as-service/index/
---

# Plugin as a Service 

## Introduction
OpenSearch allows users to extend core features using **plugins**, but traditional plugins have several **limitations**:
- They operate in the **same JVM as a cluster**, sharing **storage, memory, and state**.
- They require **strict version compatibility**.
- They are **restricted to a single tenant**.

To address these challenges, we introduced a **remote metadata SDK client**:

> **[SDK Client Repository](https://github.com/opensearch-project/opensearch-remote-metadata-sdk)**  
> Enables **stateless** OpenSearch plugins using **external data stores** like a remote OpenSearch cluster or cloud provider storage.

This enhancement **improves scalability** and makes plugins more **adaptable** for large-scale workloads.
---

## Remote Metadata Store

The Remote Metadata Store enables OpenSearch plugins to operate in a stateless manner by leveraging external storage solutions. Instead of relying on the same JVM and cluster resources, plugins can now store their metadata in remote locations such as OpenSearch clusters or cloud storage services. This approach enhances scalability, reduces resource contention, and allows plugins to function independently of the core OpenSearch cluster.

### **Benefits of Remote Metadata Storage**
- **Scalability**: Offloading metadata storage to an external system reduces memory and CPU usage on the OpenSearch cluster.
- **Multi-Tenancy Support**: By leveraging tenant-based storage separation, cloud providers can offer more flexible plugin solutions.

### **Supported Storage Backends**
The Remote Metadata Store can be configured to use multiple external backends, such as:
- Remote OpenSearch clusters
- AWS Dynamo DB

## Multi-Tenancy Support
To **increase flexibility**, OpenSearch now supports **multi-tenancy** in key plugins:
- **[ML-Commons](https://github.com/opensearch-project/ml-commons)** (for machine learning workloads)
- **[Flow Framework](https://github.com/opensearch-project/flow-framework/)** (for workflow automation)
- **[Machine Learning](https://opensearch.org/docs/latest/ml-commons-plugin/)
- **[Automatic Configurations](https://opensearch.org/docs/latest/automating-configurations/index/)

>  **Impact**: Multi-tenancy enables cloud providers to **logically separate resources** using **tenant IDs**, unlocking **multi-tenant ML solutions** on OpenSearch.

By **conceptualizing "Plugin as a Service"**, users can **deploy and manage plugins** with greater **scalability and flexibility**.

---

## ⚙️ Configuration: Enabling Multi-Tenancy
 To enable **multi-tenancy** in a plugin, update the following settings:

### ** General Multi-Tenancy Settings**
| Setting | Description |
|---------|------------|
| `multi_tenancy_enabled` | Enable multi-tenancy in the plugin |

More details about this settings [here](https://github.com/opensearch-project/ml-commons/blob/main/plugin/src/main/java/org/opensearch/ml/settings/MLCommonsSettings.java#L287-L316)


### ** Remote Metadata Storage Configuration**
| Setting | Description |
|---------|------------|
| `remote_metadata_type` | Type of remote metadata store |
| `remote_metadata_endpoint` | URL for the remote metadata store |
| `remote_metadata_region` | Region where metadata is stored |
| `remote_metadata_service_name` | Name of the remote metadata service |

**Example Configuration (YAML):**
```yaml
multi_tenancy_enabled: true
remote_metadata_type: "opensearch"
remote_metadata_endpoint: "https://remote-store.example.com"
remote_metadata_region: "us-west-2"
remote_metadata_service_name: "remote-store-service"

