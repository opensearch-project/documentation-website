---
layout: default
title: Cluster voting configuration
nav_order: 55
parent: Cluster APIs
---

# Cluster voting configuration
**Introduced 1.0**
{: .label .label-purple }

The Cluster voting configuration API updates and clears voting configurations.

# Endpoints

The `POST` method updates the cluster voting configuration by excluding certain node IDs or names.

<!-- spec_insert_start
api: cluster.post_voting_config_exclusions
component: endpoints
omit_header: true
-->
<!-- spec_insert_end -->

The `DELETE` method clears any cluster voting configuration exclusions.

<!-- spec_insert_start
api: cluster.delete_voting_config_exclusions
component: endpoints
omit_header: true
-->
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.post_voting_config_exclusions
component: path_parameters
-->
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.post_voting_config_exclusions
component: query_parameters
-->
<!-- spec_insert_end -->