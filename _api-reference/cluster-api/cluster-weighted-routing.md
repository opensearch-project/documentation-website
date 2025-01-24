---
layout: default
title: Cluster weighted routing
nav_order: 60
parent: Cluster APIs
---

# Cluster weighted routing
**Introduced 1.0**
{: .label .label-purple }

The Cluster weighted routing API updates and creates routing weights for shard allocation.

# Endpoints

The `GET` method fetches shard routing weights.

<!-- spec_insert_start
api: cluster.get_weighted_routing
component: endpoints
omit_header: true
-->
<!-- spec_insert_end -->

The `PUT` method updates shard routing weights.

<!-- spec_insert_start
api: cluster.put_voting_config_exclusions
component: endpoints
omit_header: true
-->
<!-- spec_insert_end -->

The `DELETE` method deletes shard routing weights.

<!-- spec_insert_start
api: cluster.delete_voting_config_exclusions
component: path_parameters
-->
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.post_voting_config_exclusions
component: query_parameters
-->
<!-- spec_insert_end -->