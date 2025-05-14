---
layout: default
title: Replication APIs
has_children: true
nav_order: 83
---

# Replication APIs
**Introduced 1.0**
{: .label .label-purple }

The Replication APIs enable you to configure, manage, and monitor replication between OpenSearch indexes. Replication establishes a primary-replica relationship where changes made to a leader index are automatically propagated to one or more follower indexes. This capability provides resilience, improves read scalability, and enables disaster recovery across multiple OpenSearch clusters.

## What is replication?

Replication in OpenSearch creates a one-way relationship between indexes where:

- A **leader index** serves as the primary source of truth
- One or more **follower indexes** maintain consistent copies of the leader
- Changes to the leader are automatically replicated to followers
- Followers can exist within the same cluster or on remote clusters

This mechanism allows for maintaining synchronized copies of data across different locations or environments, supporting various resilience and scaling strategies.

## Use cases for replication

Replication supports numerous operational scenarios:

- **Disaster recovery**: Maintain backup copies of indexes in separate geographical regions
- **Read scaling**: Distribute query load across multiple followers for high-traffic indexes
- **Data locality**: Place replicas closer to users in different geographical regions to reduce latency
- **Blue/green deployments**: Facilitate non-disruptive upgrades by maintaining parallel environments
- **Analytics offloading**: Create replicas specifically for running intensive analytical workloads without impacting production performance

## Available APIs

The Replication APIs include:

- [Start Replication API]({{site.url}}{{site.baseurl}}/api-reference/replication-apis/start-replication/): Establish a new replication relationship between indexes
- [Pause Replication API]({{site.url}}{{site.baseurl}}/api-reference/replication-apis/stop-replication/): Temporarily suspend replication activities
- [Resume Replication API]({{site.url}}{{site.baseurl}}/api-reference/replication-apis/resume-replication/): Restart previously paused replication
- [Stop Replication API]({{site.url}}{{site.baseurl}}/api-reference/replication-apis/stop-replication/): Permanently end a replication relationship
- [Get Replication Status API]({{site.url}}{{site.baseurl}}/api-reference/replication-apis/get-replication-status/): Check the current status of replication for an index
- [Get Leader Stats API]({{site.url}}{{site.baseurl}}/api-reference/replication-apis/get-leader-stats/): Retrieve performance metrics for leader indexes
- [Get Follower Stats API]({{site.url}}{{site.baseurl}}/api-reference/replication-apis/get-follower-stats/): Retrieve performance metrics for follower indexes
- [Update Replication Settings API]({{site.url}}{{site.baseurl}}/api-reference/replication-apis/update-replication-settings/): Modify configuration parameters for replication
- [Create Replication Rule API]({{site.url}}{{site.baseurl}}/api-reference/replication-apis/create-replication-rule/): Establish automatic replication patterns for new indexes
- [Delete Replication Rule API]({{site.url}}{{site.baseurl}}/api-reference/replication-apis/delete-replication-rule/): Remove an existing automatic replication rule
- [Get Auto-follow Stats API]({{site.url}}{{site.baseurl}}/api-reference/replication-apis/get-autofollow-stats/): Retrieve statistics about automatic replication rules

## Security considerations

Replication involves data transfer between indexes and potentially between clusters, requiring careful security planning:

- Use appropriate roles and permissions to control who can configure and manage replication
- When replicating between clusters, ensure secure cross-cluster communication
- Consider encrypting data in transit between clusters
- Set up proper authentication between leader and follower clusters
- Regularly audit replication configurations and activities


## Best practices

For optimal replication management, remember the following best practices:

- **Capacity planning**: Make sure you have sufficient resources on both leader and follower clusters.
- **Monitoring**: Set up alerts for replication delays or failures.
- **Connection resilience**: Plan for network issues between clusters
- **Index compatibility**: Maintain consistent mappings between leader and follower indexes.
- **Performance tuning**: Adjust replication settings based on network conditions and data volume.
- **Testing**: Validate failover procedures before relying on replication for disaster recovery.
