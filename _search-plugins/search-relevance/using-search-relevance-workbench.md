---
layout: default
title: Search Relevance Workbench
nav_order: 10
parent: Search relevance
has_children: true
has_toc: false
---

# Search Relevance Workbench
Introduced 3.1
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/17735).    
{: .warning}

In search applications, tuning relevance is a constant, iterative exercise intended to provide the right search results to your end users. The tooling in Search Relevance Workbench helps search relevance engineers and business users create the best search experience possible for application users. It does this without hiding internal information, enabling engineers to experiment and investigate details as necessary.

Search Relevance Workbench consists of a [frontend component](https://github.com/opensearch-project/dashboards-search-relevance) that simplifies the process of evaluating search quality.
The frontend uses the [OpenSearch Search Relevance plugin](https://github.com/opensearch-project/search-relevance) as a backend to manage the resources for each tool provided. For example, most use cases involve creating and using search configurations, query sets, and judgment lists. All of these resources are created, updated, deleted, and maintained by the Search Relevance plugin. When you are satisfied with the relevance improvements, you can take the output of the experimentation and manually deploy the changes into your search application.

## Key relevance concepts

Search Relevance Workbench relies on different components for the different kinds of experiments that it offers:

* [Query set]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/query-sets/): A _query set_ is a collection of queries. These queries are used in experiments for search relevance evaluation.
* [Search configuration]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/search-configurations/): A _search configuration_ describes the pattern to use to run queries for experiments.
* [Judgment list]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/judgments/): A _judgment_ is a rating that describes the relevance of one particular document for a given query. Multiple judgments are grouped together into judgment lists.

## Available search result quality experiments

Search Relevance Workbench offers three types of experiments:

* [Search result comparison]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/comparing-search-results/): Compare results of two search configurations.
* [Search quality evaluation]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/evaluate-search-quality/): Evaluate the retrieval quality for one particular search configuration by calculating search quality metrics based on retrieved results and a judgment list.
* [Hybrid search optimization]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/optimize-hybrid-search/): Identify the best parameter set for your hybrid search query.

## Enabling Search Relevance Workbench

To enable Search Relevance Workbench, you must first enable the frontend and backend plugins.

### Enabling the Search Relevance Workbench frontend plugin

To activate the frontend plugin, in OpenSearch Dashboards, go to **Management** > **Dashboards Management** > **Advanced Settings** and turn on the toggle, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/activate_frontend_plugin.png" alt="Activate frontend plugin in OpenSearch Dashboards settings"/>{: .img-fluid }

### Enabling the Search Relevance Workbench backend plugin

To enable the Search Relevance Workbench backend plugin, send the following request:

```json
PUT _cluster/settings
{
  "persistent" : {
    "plugins.search_relevance.workbench_enabled" : true
  }
}
```
{% include copy-curl.html %}

## Creating a query set

To compare search configurations, create a set of queries to run the search. If you have access to search behavior data adhering to the User Behavior Insights (UBI) specification, you can send a request to the `_plugins/search_relevance/query_sets/create` endpoint.

The following example request uploads a manually defined query set to Search Relevance Workbench:


```json
PUT _plugins/_search_relevance/query_sets
{
  "name": "TVs",
  "description": "TV queries",
  "sampling": "manual",
  "querySetQueries": [
    {
      "queryText": "tv"
    },
    {
      "queryText": "led tv"
    }
  ]
}
```
{% include copy-curl.html %}


The response contains the `query_set_id` of the query set with which you'll experiment:

```json
{
  "query_set_id": "1856093f-9245-449c-b54d-9aae7650551a",
  "query_set_result": "CREATED"
}
```

## Creating search configurations

Search configurations specify how each query of the query set is run. To create a search configuration, you can send a search request to the `_plugins/search_relevance/search_configurations` endpoint.
Every search configuration contains a `search_configuration_name` and a `query_body`.

### Example: Creating two search configurations

For your first experiment, you'll explore how adding a weight of `10` to the `title` field affects your search configuration. First, upload your current search configuration to OpenSearch:

```json
PUT _plugins/_search_relevance/search_configurations
{
  "name": "my_production_config",
  "query": "{\"query\":{\"multi_match\":{\"query\":\"%SearchText%\",\"fields\":[\"id\",\"title\",\"category\",\"bullets\",\"description\",\"attrs.Brand\",\"attrs.Color\"]}}}",
  "index": "ecommerce"
}
```
{% include copy-curl.html %}

The response contains the search configuration ID:

```json
{
  "search_configuration_id": "122fbde8-d593-4d71-96d4-cbe3b4977468",
  "search_configuration_result": "CREATED"
}
```

Next, create another search configuration and apply a weight of `10` to the `title` field:

```json
PUT _plugins/_search_relevance/search_configurations
{
  "name": "title_boost",
  "query": "{\"query\":{\"multi_match\":{\"query\":\"%SearchText%\",\"fields\":[\"id\",\"title^10\",\"category\",\"bullets\",\"description\",\"attrs.Brand\",\"attrs.Color\"]}}}",
  "index": "ecommerce"
}
```
{% include copy-curl.html %}

The response contains the ID of the boosted search configuration and indicates whether it was created successfully:

```json
{
  "search_configuration_id": "0d687614-df5b-4b6b-8110-9d8c6d407963",
  "search_configuration_result": "CREATED"
}
```

## Running the search result list comparison experiment

To run your first experiment, you need a query set and two search configurations (and a corresponding index). By comparing search results, you can gauge how modifying the search configurations affects the search results. To create an experiment, send a request to the  `_plugins/search_relevance/experiments` endpoint:


```json
POST _plugins/_search_relevance/experiments
{
 "querySetId": "1856093f-9245-449c-b54d-9aae7650551a",
 "searchConfigurationList": ["122fbde8-d593-4d71-96d4-cbe3b4977468", "0d687614-df5b-4b6b-8110-9d8c6d407963"],
 "size": 10,
 "type": "PAIRWISE_COMPARISON"
}
```
{% include copy-curl.html %}

The response contains the experiment ID:

```json
{
  "experiment_id": "dbae9786-6ea0-413d-a500-a14ef69ef7e1",
  "experiment_result": "CREATED"
}
```

To retrieve the experiment results, use the returned `experiment_id`:

```json
GET _plugins/_search_relevance/experiments/dbae9786-6ea0-413d-a500-a14ef69ef7e1
```
{% include copy-curl.html %}

The response provides the detailed experiment results:

<details open markdown="block">
  <summary>
    Response
  </summary>

```json
{
  "took": 3,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": ".plugins-search-relevance-experiment",
        "_id": "dbae9786-6ea0-413d-a500-a14ef69ef7e1",
        "_score": 1,
        "_source": {
          "id": "dbae9786-6ea0-413d-a500-a14ef69ef7e1",
          "timestamp": "2025-06-14T14:02:17.347Z",
          "type": "PAIRWISE_COMPARISON",
          "status": "COMPLETED",
          "querySetId": "1856093f-9245-449c-b54d-9aae7650551a",
          "searchConfigurationList": [
            "122fbde8-d593-4d71-96d4-cbe3b4977468",
            "0d687614-df5b-4b6b-8110-9d8c6d407963"
          ],
          "judgmentList": [],
          "size": 10,
          "results": [
            {
              "snapshots": [
                {
                  "searchConfigurationId": "0d687614-df5b-4b6b-8110-9d8c6d407963",
                  "docIds": [
                    "B01M1D0KL1",
                    "B07YSMD3Z9",
                    "B07V4CY9GZ",
                    "B074KFP426",
                    "B07S8XNWWF",
                    "B07XBJR7GY",
                    "B075FDWSHT",
                    "B01N2Z17MS",
                    "B07F1T4JFB",
                    "B07S658ZLH"
                  ]
                },
                {
                  "searchConfigurationId": "122fbde8-d593-4d71-96d4-cbe3b4977468",
                  "docIds": [
                    "B07Q45SP9P",
                    "B074KFP426",
                    "B07JKVKZX8",
                    "B07THVCJK3",
                    "B0874XJYW8",
                    "B08LVPWQQP",
                    "B07V4CY9GZ",
                    "B07X3BS3DF",
                    "B074PDYLCZ",
                    "B08CD9MKLZ"
                  ]
                }
              ],
              "queryText": "led tv",
              "metrics": [
                {
                  "metric": "jaccard",
                  "value": 0.11
                },
                {
                  "metric": "rbo50",
                  "value": 0.03
                },
                {
                  "metric": "rbo90",
                  "value": 0.13
                },
                {
                  "metric": "frequencyWeighted",
                  "value": 0.2
                }
              ]
            },
            {
              "snapshots": [
                {
                  "searchConfigurationId": "0d687614-df5b-4b6b-8110-9d8c6d407963",
                  "docIds": [
                    "B07X3S9RTZ",
                    "B07WVZFKLQ",
                    "B00GXD4NWE",
                    "B07ZKCV5K5",
                    "B07ZKDVHFB",
                    "B086VKT9R8",
                    "B08XLM8YK1",
                    "B07FPP6TB5",
                    "B07N1TMNHB",
                    "B09CDHM8W7"
                  ]
                },
                {
                  "searchConfigurationId": "122fbde8-d593-4d71-96d4-cbe3b4977468",
                  "docIds": [
                    "B07Q7VGW4Q",
                    "B00GXD4NWE",
                    "B07VML1CY1",
                    "B07THVCJK3",
                    "B07RKSV7SW",
                    "B010EAW8UK",
                    "B07FPP6TB5",
                    "B073G9ZD33",
                    "B07VXRXRJX",
                    "B07Q45SP9P"
                  ]
                }
              ],
              "queryText": "tv",
              "metrics": [
                {
                  "metric": "jaccard",
                  "value": 0.11
                },
                {
                  "metric": "rbo50",
                  "value": 0.07
                },
                {
                  "metric": "rbo90",
                  "value": 0.16
                },
                {
                  "metric": "frequencyWeighted",
                  "value": 0.2
                }
              ]
            }
          ]
        }
      }
    ]
  }
}
```

</details>

## Using Search Relevance Workbench in OpenSearch Dashboards

You can create all Search Relevance Workbench components and visualize the experiment results in OpenSearch Dashboards.
In this example, you'll create the same experiment and review its results.

In the left navigation pane, select **OpenSearch Plugins** > **Search Relevance** and then select **Query Set Comparison**, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/select_query_set_comparison.png" alt="Select Query Set Comparison Experiment"/>{: .img-fluid }

Select the query set you created (`TVs`) and the search configurations (`my_production_config`, `title_boost`), and then select **Start Evaluation**, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/query_set_comparison_experiment_definition.png" alt="Define Query Set Comparison Experiment"/>{: .img-fluid }

You are automatically directed to the experiment overview table, shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/experiment_table_overview.png" alt="Experiment Overview Table"/>{: .img-fluid }

To review the results, select the topmost (most recent) experiment. The experiment view page shows three elements:
1. The experiment parameters.
2. The aggregate metrics resulting from the experiment, shown in the following image.
<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/aggregate_metrics_comparison_experiment.png" alt="Aggregate Metrics for Comparison Experiment"/>{: .img-fluid }
3. The individual metrics per query.

To visually assess the differences between two result sets, select a query event.
