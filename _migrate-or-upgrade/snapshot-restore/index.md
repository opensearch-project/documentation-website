---
layout: default
title: Snapshot and restore
nav_order: 10
has_toc: false
permalink: /migrate-or-upgrade/snapshot-restore/
redirect_from: 
---

# Snapshot and restore for migration

Snapshots are one of the most reliable methods for migrating data between OpenSearch clusters. This approach is particularly useful when you need to move data from one environment to another, such as migrating from a proof-of-concept cluster to a production environment, or when performing major version upgrades that require a fresh cluster deployment.

## When to use snapshot and restore for migration

Snapshot and restore is ideal for migration scenarios when:

- **Migrating between different OpenSearch versions** where in-place upgrades aren't supported
- **Moving to a different infrastructure** (on-premises to cloud, different cloud providers)
- **Changing cluster architecture** (different node configurations, shard strategies)
- **Zero-downtime requirements** aren't critical and you can afford some downtime
- **Large data volumes** where other migration methods might be impractical
- **Complete cluster migration** including indexes, settings, and metadata

## Migration workflow overview

A typical snapshot-based migration follows this workflow:

1. **Prepare the source cluster** - Ensure cluster health and configure snapshot repository
2. **Create snapshot repository** - Set up shared storage accessible by both clusters
3. **Take comprehensive snapshots** - Capture all necessary indexes and cluster state
4. **Set up target cluster** - Deploy and configure the destination OpenSearch cluster
5. **Register repository on target** - Connect the target cluster to the snapshot repository
6. **Restore snapshots** - Selectively restore indexes and configurations
7. **Validate and test** - Verify data integrity and application functionality
8. **Switch traffic** - Update applications to use the new cluster

## Key considerations for migration

### Data consistency
Snapshots capture data as it existed when the snapshot was initiated, but they're not instantaneous. For migration purposes, consider:
- **Stopping writes** to ensure data consistency during the final snapshot
- **Taking incremental snapshots** to minimize the final downtime window
- **Planning for data that changes** during the migration process

### Version compatibility
- Snapshots are **forward compatible by one major version**
- For larger version gaps, you may need to restore to an intermediate cluster, reindex, and take new snapshots
- Always verify compatibility between source and target OpenSearch versions

### Storage requirements
- **Incremental nature** means frequent snapshots don't significantly increase storage usage
- **Plan storage capacity** for the full dataset plus incremental changes
- **Consider network bandwidth** for cloud-based repositories

## Snapshot repository options for migration

Choose the appropriate repository type based on your migration requirements and infrastructure setup.

### Shared file systems
Best for migrations within the same infrastructure where both clusters can access shared storage.

### Amazon S3
Ideal for cloud migrations or when migrating between different environments. Provides durability and accessibility across regions.

### Azure blob storage
Suitable for Azure-based migrations or hybrid cloud scenarios.

### Cross-cloud considerations
When migrating between different cloud providers, consider:
- **Data transfer costs** and time requirements
- **Network connectivity** between source cluster, storage, and target cluster
- **Security and access controls** across different environments

## Migration-specific restore options

When restoring for migration purposes, you have several options to customize the process:

### Selective restoration
- **Choose specific indexes** rather than restoring everything
- **Exclude system indexes** that might conflict with target cluster configuration
- **Rename indexes** to avoid conflicts or implement new naming conventions

### Index settings modification
- **Update replica counts** to match target cluster capacity
- **Modify shard allocation** for different node configurations
- **Adjust refresh intervals** and other performance settings

### Remote snapshot restoration
For large datasets, consider using `storage_type: remote_snapshot` to:
- **Reduce initial restore time** by keeping data in the repository
- **Save local storage** on the target cluster
- **Enable faster access** to historical data

## Security considerations for migration

When migrating with snapshots:

- **Exclude security indexes** (`.opendistro_security`) from snapshots to avoid conflicts
- **Plan security configuration** separately from data migration
- **Use appropriate access controls** for snapshot repositories
- **Consider encryption** for sensitive data in transit and at rest

## Monitoring and validation

During migration:

- **Monitor snapshot progress** using the snapshot status API
- **Validate data integrity** after restoration
- **Test application functionality** before switching traffic
- **Keep source cluster available** until migration is fully validated

## Next steps

For detailed technical implementation:

- **Snapshot creation and management**: See [Take and restore snapshots]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/)
- **API reference**: See [Snapshot APIs]({{site.url}}{{site.baseurl}}/api-reference/snapshots/index/) for complete API documentation
- **Automated snapshots**: See [Snapshot management]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-management/) for scheduling and automation
- **Alternative migration methods**: Consider [Migration Assistant]({{site.url}}{{site.baseurl}}/migration-assistant/) for more complex migration scenarios

## Related migration approaches

- **[Migration Assistant]({{site.url}}{{site.baseurl}}/migration-assistant/)** - For zero-downtime migrations with live traffic capture
- **[Rolling upgrades]({{site.url}}{{site.baseurl}}/migrate-or-upgrade/rolling-upgrade/)** - For in-place version upgrades
- **Remote reindex** - For selective data migration between clusters
