---
layout: default
title: Ingest pipelines
parent: Ingest APIs
has_children: true
nav_order: 5
---

# Ingest pipelines

Before you index your data, OpenSearch's ingest APIs help transform your data by creating and managing _ingest pipelines_. An ingest pipeline is a sequence of steps that are applied to data as it is being ingested into a system. Benefits of using ingest pipelines include:

- Improving the quality of data by filtering out irrelevant data and transforming data into a format that is easy to understand and analyze.
- Improving the performance of data analysis by reducing the amount of data that needs to be analyzed.
- Improving the security of data by filtering out sensitive data. 

Ingest pipelines consist of _processors_. Processors are customizable tasks that run in a sequential order as they appear in the request body. This order is important, as each processor depends on the output of the previous processor. The transformed data appears in your index after each of the processor completes.

Ingest pipelines in OpenSearch can only be managed using ingest API operations. When using ingest in production environments, your cluster should contain at least one node with the node roles permission set to `ingest`. For information about setting up node roles within a cluster, see [Cluster Formation]({{site.url}}{{site.baseurl}}/opensearch/cluster/).


