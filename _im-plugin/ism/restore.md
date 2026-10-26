---
layout: default
title: Restoring ISM from a snapshot
parent: Index State Management
nav_order: 60
---

# Restoring ISM from a snapshot
**Introduced 3.10**
{: .label .label-purple }

Index State Management (ISM) stores its policies, and each index's progress through its policy, in the `.opendistro-ism-config` system index. When you restore `.opendistro-ism-config` from a snapshot using the [Restore Snapshot API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/restore-snapshot/), for example, onto another cluster, each index continues its policy from where it was in the snapshot. This works only if you restore the data indexes before `.opendistro-ism-config`, as described in [Restore order](#restore-order).

## Restore order

ISM can match an index to its saved progress only if the index already exists when `.opendistro-ism-config` is restored. Restore in the following order:

1. Restore the data indexes, meaning the indexes that your policies manage, and wait for the restore to finish:

   ```json
   POST /_snapshot/my-repository/snapshot-1/_restore?wait_for_completion=true
   {
     "indices": "my-index-*",
     "include_global_state": false
   }
   ```
   {% include copy-curl.html %}

1. Restore `.opendistro-ism-config` in a separate request:

   ```json
   POST /_snapshot/my-repository/snapshot-1/_restore
   {
     "indices": ".opendistro-ism-config",
     "include_global_state": false
   }
   ```
   {% include copy-curl.html %}

If you restore `.opendistro-ism-config` first, or in the same request as the data indexes, ISM can't match the data indexes to their saved progress. Data indexes that an ISM template attached to a policy start the policy from the beginning, and data indexes attached using the Add Policy API are no longer managed.

## How ISM matches data indexes

ISM matches saved progress to a data index using the index's name and creation date. A data index that was deleted and recreated under the same name has a new creation date, so ISM doesn't match it, and the index starts its policy from the beginning.

## Permissions

If the Security plugin is enabled, restoring `.opendistro-ism-config` requires permission to restore system indexes. For more information, see [Take and restore snapshots]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/).
