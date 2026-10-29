---
layout: default
title: Restoring ISM from a snapshot
parent: Index State Management
nav_order: 60
---

# Restoring ISM from a snapshot
**Introduced 3.10**
{: .label .label-purple }

Index State Management (ISM) stores policies and the policy progress of each [managed index]({{site.url}}{{site.baseurl}}/im-plugin/ism/managedindexes/) in the `.opendistro-ism-config` system index. If you restore `.opendistro-ism-config` from a snapshot, such as when migrating to another cluster, each managed index resumes its policy from the state recorded in the snapshot. For managed indexes to resume their policies, you must restore them before you restore `.opendistro-ism-config`.

## Restoration order

ISM can match an index to its saved progress only if the index already exists when `.opendistro-ism-config` is restored. ISM matches saved progress to an index using the index name and creation date. If an index was deleted and then recreated under the same name, it has a new creation date. ISM doesn't match the recreated index to its saved progress, so the index starts its policy from the beginning.

Using the [Restore Snapshot API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/restore-snapshot/), restore indexes in the following order:

1. Restore the managed indexes and wait for the restore operation to finish:

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

If you restore `.opendistro-ism-config` first or in the same request as the managed indexes, ISM can't match the managed indexes to their saved progress. Indexes that were attached to a policy by an ISM template restart the policy from the beginning. ISM stops managing indexes that were attached using the [Add Policy API]({{site.url}}{{site.baseurl}}/im-plugin/ism/api/#add-policy).

## Permissions

If the Security plugin protects system indexes in your cluster, restoring `.opendistro-ism-config` requires write access to a protected system index. For more information, see [Write protection]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/#write-protection).
