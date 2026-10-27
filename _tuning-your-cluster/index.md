---
layout: default
title: Managing your cluster
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
permalink: /tuning-your-cluster/
redirect_from: 
  - /tuning-your-cluster/index/
setup_steps:
  - heading: "Install OpenSearch"
    description: "Install and configure OpenSearch on each node using Docker, a tarball, a package manager, or Kubernetes."
    link: "/install-and-configure/install-opensearch/index/"
  - heading: "Configure OpenSearch"
    description: "Learn how to specify settings in `opensearch.yml`, at startup, or using the Cluster Settings API, and whether you can change each setting while the cluster is running."
    link: "/install-and-configure/configuring-opensearch/index/"
  - heading: "Create a cluster"
    description: "Choose node types, assign node roles, and configure the nodes in `opensearch.yml` to form a multi-node cluster."
    link: "/tuning-your-cluster/creating-a-cluster/"
  - heading: "Configure discovery and cluster formation"
    description: "Configure seed hosts, cluster bootstrapping, and voting so that nodes can find each other and elect a cluster manager."
    link: "/tuning-your-cluster/discovery-cluster-formation/"
  - heading: "Configure security"
    description: "Set up TLS certificates, users, and roles before you send production traffic to the cluster."
    link: "/security/configuration/index/"
data_protection:
  - heading: "Snapshots"
    description: "Back up indexes and cluster state to a repository and restore them to the same or a different cluster."
    link: "/tuning-your-cluster/availability-and-recovery/snapshots/index/"
  - heading: "Remote-backed storage"
    description: "Send every index transaction to remote storage so that you can restore data after a node or cluster failure."
    link: "/tuning-your-cluster/availability-and-recovery/remote-store/index/"
  - heading: "Segment replication"
    description: "Copy segment files from primary shards to replicas instead of indexing each document on every shard copy."
    link: "/tuning-your-cluster/availability-and-recovery/segment-replication/index/"
  - heading: "Cross-cluster replication"
    description: "Replicate indexes from a leader cluster to one or more follower clusters."
    link: "/tuning-your-cluster/replication-plugin/index/"
---

# Managing your cluster

Create an OpenSearch cluster, protect its data, and control how it handles indexing and search workloads.

## Set up a cluster

Follow these steps to set up a production cluster.

{% include list.html list_items=page.setup_steps %}

## Back up and replicate data

Back up your data to remote storage and keep copies of it on other nodes and clusters.

{% include cards.html cards=page.data_protection %}

## Control resource usage

When nodes receive more requests than they can complete, OpenSearch can limit, reject, or cancel requests. The following table lists the features that control resource usage.

Feature | Effect
:--- | :---
[Workload management]({{site.url}}{{site.baseurl}}/tuning-your-cluster/workload-management/wlm-feature-overview/) | Groups search requests into workload groups and limits the CPU and memory that each group can use.
[Search backpressure]({{site.url}}{{site.baseurl}}/tuning-your-cluster/load-protection/search-backpressure/) | Cancels resource-intensive search requests when a node is under duress.
[Shard indexing backpressure]({{site.url}}{{site.baseurl}}/tuning-your-cluster/load-protection/shard-indexing-backpressure/) | Rejects indexing requests on overloaded shards.
[Concurrency limits]({{site.url}}{{site.baseurl}}/tuning-your-cluster/load-protection/concurrency-limits/) | Caps the number of requests that an action processes at the same time.
[Cluster manager task throttling]({{site.url}}{{site.baseurl}}/tuning-your-cluster/load-protection/cluster-manager-task-throttling/) | Limits the number of tasks that nodes can submit to the cluster manager.

## Tune performance

To increase indexing throughput, see [Tuning for indexing speed]({{site.url}}{{site.baseurl}}/tuning-your-cluster/performance-tuning/indexing-speed/). To run indexing and search on different nodes, see [Separating index and search workloads]({{site.url}}{{site.baseurl}}/tuning-your-cluster/performance-tuning/separate-index-and-search-workloads/).

## Manage scheduled jobs

OpenSearch plugins such as Index State Management, snapshot management, and anomaly detection run tasks on a schedule. To view the state of these tasks and tune how they are scheduled, see [Scheduled jobs]({{site.url}}{{site.baseurl}}/tuning-your-cluster/scheduled-jobs/index/).

## Monitor your cluster

OpenSearch can generate metrics and traces about its own operation and export them using OpenTelemetry. For more information, see [Telemetry]({{site.url}}{{site.baseurl}}/tuning-your-cluster/telemetry/index/).
