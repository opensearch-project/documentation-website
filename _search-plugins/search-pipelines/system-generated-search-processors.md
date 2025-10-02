---
layout: default
title: System generated search processors
nav_order: 50
has_children: false
parent: Search pipelines
---

# System generated search processors

System generated search processors are search processors that can be systematically generated based on the search request. 

To enable the processors, you must set the `cluster.search.enabled_system_generated_factories` setting to either `*` or explicitly include the required factories.

Example:
```json
PUT _cluster/settings
{
  "persistent": {
    "cluster.search.enabled_system_generated_factories": [
      "mmr_over_sample_factory",
      "mmr_rerank_factory"
    ]
  }
}
```
{% include copy-curl.html %}



Search processors can be of the following types:

- [System generated search request processors](#system-generated-search-request-processors)
- [System generated search response processors](#system-generated-search-response-processors)
- [System generated search phase results processors](#system-generated-search-phase-results-processors)

# System generated search request processors

| Processor name    | Processor factory name    | Execution stage     | Trigger condition                                           | Description                                                                                                                                                                |
|-------------------|---------------------------| ------------------- |-------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `mmr_over_sample` | `mmr_over_sample_factory` | `POST_USER_DEFINED` | Triggered when a search request includes the mmr extension  | Modifies the query size and `k` value of the k-NN query to oversample candidates for MMR re-ranking. This processor runs after any user-defined search request processors. |

The execution stage determines whether a system-generated processor runs before or after user-defined processors of the same type.

# System generated search response processors

| Processor name | Processor factory name | Execution stage     | Trigger condition                                          | Description                                                                                                                                                     |
|----------------|------------------------|---------------------|------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `mmr_rerank`   | `mmr_rerank_factory`   | `PRE_USER_DEFINED`  | Triggered when a search request includes the mmr extension | Re-ranks the oversampled results using MMR and reduces them to the original query size. This processor runs before any user-defined search response processors. |

The execution stage determines whether a system-generated processor runs before or after user-defined processors of the same type.

# System generated search phase results processors

We don't have any for now.

# Limitation

## One processor per type and execution stage
For each processor type and execution stage, OpenSearch currently supports only one system-generated processor for a search request. For example, only one search request processor can run at the `POST_USER_DEFINED` stage, and only one search response processor can run at the `PRE_USER_DEFINED` stage.