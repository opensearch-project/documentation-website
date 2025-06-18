---
layout: default
title: Optimizing hybrid search
nav_order: 60
parent: Using Search Relevance Workbench
grand_parent: Search relevance
has_children: false
has_toc: false
---

# Optimizing hybrid search

When you use hybrid search in OpenSearch, a key question is how to combine results from lexical and vector-based search effectively. OpenSearch provides different techniques with various parameters you can experiment with to find the best setup for your application. What works best, however, depends heavily on your data, user behavior, and application domain—there is no one-size-fits-all solution.

The Search Relevance Workbench helps you systematically find the ideal set of parameters for your needs.

## Requirements

Internally, optimizing hybrid search involves running multiple search quality evaluation experiments. For these experiments, you need a query set, judgments, and a search configuration.
Currently, the Search Relevance Workbench supports hybrid search optimization with up to two query clauses. While hybrid search typically combines vector and lexical queries, you can run hybrid search optimization with two lexical query clauses:

```json
PUT _plugins/_search_relevance/search_configurations
{
  "name": "hybrid_query_lexical",
  "query": "{\"query\":{\"hybrid\":{\"queries\":[{\"match\":{\"title\":\"%SearchText%\"}},{\"match\":{\"category\":\"%SearchText%\"}}]}}}",
  "index": "ecommerce"
}'
```

Hybrid search optimization is most valuable when combining lexical and vector-based search results. For optimal results, configure your hybrid search query with two clauses: one textual query clause and one neural query clause. You don't need to configure the search pipeline for combining results because the hybrid search optimization process handles this automatically. The following is an example of a search configuration suitable for hybrid search optimization:

```json
PUT _plugins/_search_relevance/search_configurations
{
  "name": "hybrid_query_text",
  "query": "{\"query\":{\"hybrid\":{\"queries\":[{\"multi_match\":{\"query\":\"%SearchText%\",\"fields\":[\"id\",\"title\",\"category\",\"bullets\",\"description\",\"attrs.Brand\\\",\"attrs.Color\"]}},{\"neural\":{\"title_embedding\":{\"query_text\":\"%SearchText%\",\"k\":100,\"model_id\":\"lRFFb5cBHkapxdNcFFkP\"}}}]}},\"size\":10}",
  "index": "ecommerce"
}
```

The model ID specified in the `query` must be a valid model ID for a model deployed in OpenSearch. The target index must contain the field for neural search embeddings (in this example, `title_embedding`). 

For an end-to-end example, see the [`search-relevance` repository](https://github.com/opensearch-project/search-relevance).

## Running a hybrid search optimzation experiment

You can create a hybrid search optimization experiment by calling the `experiments` endpoint of the Search Relevance Workbench.

### Endpoint

```json
PUT _plugins/_search_relevance/experiments
```

### Example request

```json
PUT _plugins/_search_relevance/experiments
{
  "querySetId": "b16a6a2b-ed6e-49af-bb2b-fc739dcf24e6",
  "searchConfigurationList": ["508a8812-27c9-45fc-999a-05f859f9b210"],
  "judgmentList": ["1b944d40-e95a-43f6-9e92-9ce00f70de79"],
  "size": 10,
  "type": "HYBRID_OPTIMIZER"
}
```

### Example response

```json
{
  "experiment_id": "0f4eff05-fd14-4e85-ab5e-e8e484cdac73",
  "experiment_result": "CREATED"
}
```

## Experimentation process

The hybrid search optimization experiment runs different evaluations based on the search configuration. The following parameters and parameter values are taken into account:

* Two normalization techniques: `l2` and `min_max`.
* Three combination techniques: `arithmetic_mean`, `harmonic_mean`, `geometric_mean`.
* The lexical and neural search weights, which are values ranging from `0.0` to `1.0` in 0.1 increments.

Every query in the query set is executed for all different parameter combinations, and the results evaluated by using the judgment list.

## Evaluating the results

The results for each evaluation are stored, You can view the results in OpenSearch Dashboards by selecting the corresponding experiment in the overview of past experiments, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/experiment_overview_hybrid_search_optimization.png" alt="Compare search results"/>{: .img-fluid }

All executed queries with their calculated search metrics are displayed, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/hybrid_search_optimization_query_overview.png" alt="Compare search results"/>{: .img-fluid }

To view query variants, select one of the queries, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/hybrid_search_optimization_variant_parameters.png" alt="Compare search results"/>{: .img-fluid }

You can also retrieve this information by using the following SQL search statement and providing your `experimentId`:

```json
POST _plugins/_sql
{
  "query": "SELECT ev.parameters.normalization, ev.parameters.combination, ev.parameters.weights, ev.results.evaluationResultId, ev.experimentId, er.id, er.metrics, er.searchText FROM search-relevance-experiment-variant ev JOIN search-relevance-evaluation-result er ON ev.results.evaluationResultId = er.id WHERE ev.experimentId = '814e2378-901c-4273-9873-9b758a33089d'"
}
```
