---
layout: default
title: ML-Commons Plugin as a Service
has_children: false
nav_order: 10
---

# ML-Commons Plugin as a Service

## Multi-Tenancy Enhancements
We have introduced **multi-tenancy** support for:
- **Connectors**
- **Model Groups**
- **Models** [Remote models only]
- **Agents**
- **Tasks**
- **Config APIs**

>  **Upcoming Updates:** We will continue expanding multi-tenancy to additional APIs incrementally.

---

## ML Commons Multi-Tenancy Settings
To enable **multi-tenancy** in ML Commons, set the following cluster setting:

```yaml
plugins.ml_commons.multi_tenancy_enabled: true
```

### ** Values**
| Setting | Default Value | Allowed Values |
|---------|--------------|----------------|
| `plugins.ml_commons.multi_tenancy_enabled` | `true` | `true` or `false` |

---

## ML Commons Remote Metadata Store Settings
To use a **Remote Metadata Store**, configure the following settings:

### **1️⃣ Remote Metadata Type**
```yaml
plugins.ml_commons.remote_metadata_type: AWSDynamoDB
```

#### ** Values**
| Value | Description |
|-------|-------------|
| `RemoteOpenSearch` | Uses a remote OpenSearch cluster compatible with OpenSearch Java Client. |
| `AWSDynamoDB` | Uses AWS DynamoDB with **Zero-ETL replication** to OpenSearch. |
| `AWSOpenSearchService` | Uses AWS OpenSearch Service via **AWS SDK v2**. |

---

### **2️⃣ Remote Metadata Endpoint**
```yaml
plugins.ml_commons.remote_metadata_endpoint: <REMOTE_ENDPOINT>
```

#### ** Values**
| Setting | Description |
|---------|-------------|
| `remote_metadata_endpoint` | A string containing the remote metadata endpoint URL. |

---

### **3️⃣ Remote Metadata Region**
```yaml
plugins.ml_commons.remote_metadata_region: <AWS_REGION>
```

#### ** Values**
| Setting | Description |
|---------|-------------|
| `remote_metadata_region` | A string containing the **AWS region** where metadata is stored. |

---

### **4️⃣ Remote Metadata Service Name**
```yaml
plugins.ml_commons.remote_metadata_service_name: <SERVICE_NAME>
```

#### ** Values**
| Setting | Description |
|---------|-------------|
| `remote_metadata_service_name` | A string containing the **remote metadata service name**. |

---

### 🔗 **Learn More**
- 📖 [ML Commons Repository](https://github.com/opensearch-project/ml-commons)
- 📖 [OpenSearch Documentation](https://opensearch.org/docs/)