---
layout: default
title: Hybrid Search Optimizer
nav_order: 65
parent: Using Search Relevance Workbench
grand_parent: Search relevance
has_children: false
has_toc: false
---

# Optimizing hybrid search

The primary question for a user of hybrid search in OpenSearch is how to best combine the results from lexical and vector-based search. OpenSearch offers different techniques which gives users different parameters to experiment with to find the best setup for their application. However, what is best depends strongly on the corpus, on user behavior, and on the application domain—there is no one-size-fits-all solution.

The Search Relevance Workbench offers a way to systematically identify the ideal set of parameters.

## Requirements

Under the hood, optimizing hybrid search is running multiple searc quality evaluation experiments. Similar to those you need a query set, judgments and a search configuration.
Currently, hybrid search optimization with the Search Relevance Workbench is restricted to two query clauses. Technically, it is possible to run this optimization process with a hybrid search query consisting of two lexical query clauses. For such an experiment, the only requirement for the search configuration is to contain a hybrid search query with two lexical query clauses, for example:

```json
PUT _plugins/_search_relevance/search_configurations
{
  "name": "hybrid_query_lexical",
  "query": "{\"query\":{\"hybrid\":{\"queries\":[{\"match\":{\"title\":\"%SearchText%\"}},{\"match\":{\"category\":\"%SearchText%\"}}]}}}",
  "index": "ecommerce"
}'
```

However, we assume hybrid search optimization to add most value when combining of lexical and vector-based search results. The requirement for your search configuration is to contain a hybrid search query with two query clauses: one textual query clause and one neural query clause. The search pipeline that deals with the combination of results is handled by the hybrid search optimization process itself. Here is an example how a suitable search configuration for a hybrid search optimization experiment looks like:

```bash
curl -s -X PUT "http://localhost:9200/_plugins/_search_relevance/search_configurations" \
-H "Content-type: application/json" \
-d"{
      \"name\": \"hybrid_query33\",
      \"query\": \"{\\\"query\\\":{\\\"hybrid\\\":{\\\"queries\\\":[{\\\"multi_match\\\":{\\\"query\\\":\\\"%SearchText%\\\",\\\"fields\\\":[\\\"id\\\",\\\"title\\\",\\\"category\\\",\\\"bullets\\\",\\\"description\\\",\\\"attrs.Brand\\\",\\\"attrs.Color\\\"]}},{\\\"neural\\\":{\\\"title_embedding\\\":{\\\"query_text\\\":\\\"%SearchText%\\\",\\\"k\\\":100,\\\"model_id\\\":\\\"6-LzaJcB85oVKiByPr0F\\\"}}}]}},\\\"size\\\":10}\",
      \"index\": \"ecommerce\"
}"
```

The specified model ID in the `query` has to be valid and point to a model available in OpenSearch. The corresponding field containing the embeddings for the neural search part (`title_embedding` in this example) has to be populated with embeddings prior to running this experiment. The [`search-relevance` repository](https://github.com/opensearch-project/user-behavior-insights) contains an end-to-end example guiding you in case you need more information on how to get started and meet the requirements for this experiment type.

## Running a hybrid search optimzation experiment

A hybrid search optimization experiment can be created with the experiments endpoint of the Search Relevance Workbench.

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

The hybrid search optimization experiment runs different evaluations based on the search configuration. The following parametrs and parameter values are taken into account:

* Two normalization techniques: `l2` and `min_max`.
* Three combination techniques: `arithmetic_mean`, `harmonic_mean`, `geometric_mean`.
* The lexical and neural search weights, which are values ranging from `0.0` to `1.0` in 0.1 increments.

Every query in the query set will be executed for all different parameter combinations and the results evaluated by using the judgment list.

## Evaluating the results

The results for each evaluation are stored and can be viewed in the frontend by selecting the corresponding experiment in the overview of past experiments:

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/experiment_overview_hybrid_search_optimization.png" alt="Compare search results"/>{: .img-fluid }

This leads to the detailed view for all executed queries with their calculated search metrics:

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/hybrid_search_optimization_query_overview.png" alt="Compare search results"/>{: .img-fluid }

Selecting one of the queries leads you to the variants:

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/hybrid_search_optimization_variant_parameters.png" alt="Compare search results"/>{: .img-fluid }

Programatically, you can achieve a similar view by using the following SQL search statement and using your experimentId:

```json
POST _plugins/_sql
{
  "query": "SELECT ev.parameters.normalization, ev.parameters.combination, ev.parameters.weights, ev.results.evaluationResultId, ev.experimentId, er.id, er.metrics, er.searchText FROM search-relevance-experiment-variant ev JOIN search-relevance-evaluation-result er ON ev.results.evaluationResultId = er.id WHERE ev.experimentId = '814e2378-901c-4273-9873-9b758a33089d'"
}
```
