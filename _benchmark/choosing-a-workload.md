---
layout: default
title: Choosing a workload
nav_order: 15
redirect_from:
  - /benchmark/user-guide/understanding-workloads/choosing-a-workload/
---

# Choosing a workload

The [`opensearch-benchmark-workloads`](https://github.com/opensearch-project/opensearch-benchmark-workloads) repository contains a list of workloads that you can use to run your benchmarks. Using a workload similar to your cluster's use cases can save you time and effort when assessing your cluster's performance. 

For example, say you're a system architect at a ride share company. As a ride share company, you collect and store data based on trip times, locations, and other data related to each ride share. Instead of building a custom workload and using your own data, which requires additional time, effort, and cost, you can use the [nyc_taxis](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/nyc_taxis) workload to benchmark your cluster because the data inside the workload is similar to the data that you collect. 

## Criteria for choosing a workload

Consider the following criteria when deciding which workload would work best for benchmarking your cluster:

- The cluster's use case and the size of the cluster. Small clusters usually contain 1--10 nodes and are suitable for development environments. Medium clusters usually contain 11--50 nodes and are used for testing environments that more closely resemble a production cluster. 
- The data types that your cluster uses compared to the data structure of the documents contained in the workload. Each workload contains an example document so that you can compare data types, or you can view the index mappings and data types in the `index.json` file.
- The query types most commonly used inside your cluster. The `operations/default.json` file contains information about the query types and workload operations. For a list of common operations, see [Common operations]({{site.url}}{{site.baseurl}}/benchmark/common-operations/).

## Next steps

- For the data, cluster requirements, and query types of each prepackaged workload, see [Workload types]({{site.url}}{{site.baseurl}}/benchmark/workload-types/).
- If you can't find an official workload that suits your needs, you can create a custom workload. For more information, see [Creating custom workloads]({{site.url}}{{site.baseurl}}/benchmark/creating-custom-workloads/).
