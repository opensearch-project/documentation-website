---
layout: default
title: System-generated search processors
nav_order: 50
has_children: false
parent: Search pipelines
---

# System-generated search processors
**Introduced 3.3**
{: .label .label-purple }

System-generated search processors are processors that OpenSearch creates automatically based on the search request. Unlike [user-defined processors]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/search-processors/) that you manually configure in pipelines, system-generated processors are triggered automatically when certain features are used, eliminating the need for manual processor configuration.

## Enabling system-generated search processors

To enable system-generated search processor creation, set the `cluster.search.enabled_system_generated_factories` cluster setting to `*` (all factories) or explicitly list the factories you want to enable. The following example enables `mmr_over_sample_factory` and `mmr_rerank_factory`:

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

## Processor types

OpenSearch supports the following types of system-generated processors:

* [Search request processors](#system-generated-search-request-processors)
* [Search response processors](#system-generated-search-response-processors)

The execution stage determines whether a system-generated processor runs before or after user-defined processors of the same type.
{: .note}

### System-generated search request processors

The following table lists the available system-generated search request processors.

| Processor name    | Processor factory name    | Execution stage     | Trigger condition                                          | Description                                                                                                                                         |
| ----------------- | ------------------------- | ------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mmr_over_sample` | `mmr_over_sample_factory` | Runs after any user-defined request processors. | Triggered when a search request includes the `mmr` parameter in the `ext` object. See [Vector search with MMR reranking]({{site.url}}{{site.baseurl}}/vector-search/specialized-operations/vector-search-mmr/). | Adjusts the query size and `k` value of the `knn` query to oversample candidates for maximal marginal relevance (MMR) reranking. |

### System-generated search response processors

The following table lists the available system-generated search response processors.

| Processor name | Processor factory name | Execution stage    | Trigger condition                                          | Description                                                                                                                               |
| -------------- | ---------------------- | ------------------ | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `mmr_rerank`   | `mmr_rerank_factory`   | Runs before any user-defined response processors. | Triggered when a search request includes the `mmr` parameter in the `ext` object. See [Vector search with MMR reranking]({{site.url}}{{site.baseurl}}/vector-search/specialized-operations/vector-search-mmr/). | Reranks the oversampled results using maximal marginal relevance (MMR) and reduces them to the original query size.  |

## Limitations

The following limitations apply to system-generated processors:

- OpenSearch supports only **one system-generated processor per type and execution stage** for a given search request. For example, only one search request processor can run before any user-defined request processors and only one search response processor can run after any user-defined response processors.

## Related articles

- [Vector search with MMR reranking]({{site.url}}{{site.baseurl}}/vector-search/specialized-operations/vector-search-mmr/)