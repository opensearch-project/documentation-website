---
layout: default
title: Workload management user guide
nav_order: 20
parent: Workload management
grand_parent: Availability and recovery
---
# Workload management user guide

## Setup

#### Prerequisites
Workload management is available only in OpenSearch version 2.17 and later. Ensure your OpenSearch cluster is running version 2.17 or higher.

#### Initial Configuration
You need to install the workload-management plugin to enable workload management in OpenSearch. This plugin provides the necessary API features for the lifecycle of query groups.

Installation command (assuming your OpenSearch instance is set up):
```
./bin/opensearch-plugin install workload-management
```

#### User Permissions
Only admin users have the permissions to dynamically manage query groups using the Workload management APIs. This ensures that the creation and management of query groups are controlled and restricted to authorized personnel for better workload oversight.

## Tenant creation

In OpenSearch workload management, a tenant or query group is logical group of tasks with defined resource limits. This allows administrators to manage resources effectively and isolate workloads for better performance and control. For a successful creation, make sure that the sum of the resource limits for a single resource (memory or CPU) of all tenants does not exceed 1. You're able to create a query group using the following API endpoint.

#### Example Request
```json
PUT _wlm/query_group
{
  "name": "analytics",
  "resiliency_mode": "enforced",
  "resource_limits": {
    "cpu": 0.4,
    "memory": 0.2
  }
}
```
For more information on managing the lifecycle of query groups, please refer to [Query group lifecycle API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/workload-management/query-group-lifecycle-api).

## Making requests with queryGroupId

To ensure that workloads are properly managed and resources are allocated according to predefined limits, OpenSearch allows requests to be associated with a specific queryGroupId. This identifier helps in routing and tracking requests under the context of a designated query group, ensuring that resource quotas and task limits are enforced.

The query group id should be specified in the query header, under the field `queryGroupId`.

#### Example Request
```
GET testindex/_search
Host: localhost:9200
Content-Type: application/json
queryGroupId: preXpc67RbKKeCyka72_Gw

{
  "query": {
    "match": {
      "field_name": "value"
    }
  }
}
```

## Monitoring Using the Stats API
The Stats API in OpenSearch's workload management feature allows administrators to monitor and track the performance and usage of query groups. This is essential for understanding resource allocation, detecting potential issues, and optimizing query group performance.

#### Example request
```json
GET _wlm/stats
```

#### Example response

```json
{
  "_nodes": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "cluster_name": "XXXXXXYYYYYYYY",
  "A3L9EfBIQf2anrrUhh_goA": {
    "query_groups": {
      "16YGxFlPRdqIO7K4EACJlw": {
        "total_completions": 33570,
        "total_rejections": 0,
        "total_cancellations": 0,
        "cpu": {
          "current_usage": 0.03319935314357281,
          "cancellations": 0,
          "rejections": 0
        },
        "memory": {
          "current_usage": 0.002306486276211217,
          "cancellations": 0,
          "rejections": 0
        }
      },
      "DEFAULT_QUERY_GROUP": {
        "total_completions": 42572,
        "total_rejections": 0,
        "total_cancellations": 0,
        "cpu": {
          "current_usage": 0,
          "cancellations": 0,
          "rejections": 0
        },
        "memory": {
          "current_usage": 0,
          "cancellations": 0,
          "rejections": 0
        }
      }
    }
  }
}
```
