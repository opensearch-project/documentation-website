---
layout: default
title: Using Search Relevance Workbench
nav_order: 10
parent: Search relevance
has_children: true
has_toc: false
---



# Using search relevance workbench

In search applications, tuning relevance is a constant, iterative exercise to bring the right search results to your end users. The tooling in Search Relevance Workbench helps search relevance engineers and business users create the best search experience possible for application users. It does this without hiding internal details, enabling engineers to experiment and go into details when needed.

The Search Relevance Workbench consists of a [frontend component](https://github.com/opensearch-project/dashboards-search-relevance) that simplifies the process of evaluating search quality.
Behind the scenes, the frontend uses the [Search Relevance OpenSearch plugin](https://github.com/opensearch-project/search-relevance) to manage the resources for each tool provided. For example, most use cases involve creating and using search configurations, query sets, and judgment lists. All of these resources are created, updated, deleted, and maintained by the Search Relevance plugin. When users are satisfied with the improvements to relevancy then they take the output of the experimentation and manually deploy the changes into their search application.

## Key concepts for relevancy

The Search Relevance Workbench relies on different components for the different kinds of experiments that it offers:

* [Query Sets]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/query-sets/): A query set is a collection of queries. These queries are used in experiments for search relevance evaluation.
* [Search Configurations]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/search-configurations/): A search configuration describes the pattern to use to run queries for experiments.
* [Judgment Lists]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/judgments/): A judgment is a rating that describes the relevance of one particular document for a given query. Multiple judgments are grouped together to judgment lists.

## Available search result quality experiments

The Search Relevance Workbench ships with three types of experiments:

* [Search result comparison]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/comparing-search-results/): compare results of two search configurations to assess how results change when applying them.
* [Search quality evaluation]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/evaluate-search-quality/): evaluate the retrieval quality for one particular search configuration by calculating search quality metrics based on retrieved results and a judgment list.
* [Hybrid search optimization]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/optimize-hybrid-search/): identify the best parameter set for your hybrid search query.

## Activating the Search Relevance Workbench

The Search Relevance Workbench is an opt-in feature. This means you need to activate the plugin in the frontend and the backend.
{: .important}

### Activating the Search Relevance Workbench frontend plugin

To activate the frontend plugin navigate to Management > Dashboards Management > Advanced Settings and switch the toggle to on:

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/activate_frontend_plugin.png" alt="Activate frontend plugin in OpenSearch Dashboards settings"/>{: .img-fluid }

### Activating the Search Relevance Workbench backend plugin

```json
PUT _cluster/settings
{
  "persistent" : {
    "plugins.search_relevance.workbench_enabled" : true
  }
}
```

## Running your first experiment

To start your experimenation journey with the Search Relevance Workbench, create a query set and a list of 2 search configurations to compare side-by-side to assess the change they cause on your search results.

## Creating a query set

The first step to get started with comparing search configurations is to create a set of queries to run the search. If you have access to search behavior data, adhering to the UBI standard, one way of doing this is by making a POST request to the endpoint `_plugins/search_relevance/query_sets/create`.

We'll use a manually defined query set now and upload that to the Search Relevance Workbench:

### Example: Manually uploading a query set

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

### Example response: Manually uploading a query set

As a response of either one of those requests, you will gain a `query_set_id` which will be used later on when expermenting with this query set.

```json
{
  "query_set_id": "1856093f-9245-449c-b54d-9aae7650551a",
  "query_set_result": "CREATED"
}
```

## Creating search configurations

Search configurations decide how each query of the query set is run. To create a search configuration, you can create a search request by using the endpoint `_plugins/search_relevance/search_configurations`.
Every search configuration has a `search_configuration_name` and a `query_body`.

### Example: Creating two search configurations

For our first experiment we want to explore how adding a weight of 10 to the title field in our prodeuction search configuration. We first upload our current search configuration:

```json
PUT _plugins/_search_relevance/search_configurations
{
  "name": "my_production_config",
  "query": "{\"query\":{\"multi_match\":{\"query\":\"%SearchText%\",\"fields\":[\"id\",\"title\",\"category\",\"bullets\",\"description\",\"attrs.Brand\",\"attrs.Color\"]}}}",
  "index": "ecommerce"
}
```
#### Response

```json
{
  "search_configuration_id": "122fbde8-d593-4d71-96d4-cbe3b4977468",
  "search_configuration_result": "CREATED"
}
```

Next, we create another search configuration with an applied search field weight of 10:

```json
{
  "name": "title_boost",
  "query": "{\"query\":{\"multi_match\":{\"query\":\"%SearchText%\",\"fields\":[\"id\",\"title^10\",\"category\",\"bullets\",\"description\",\"attrs.Brand\",\"attrs.Color\"]}}}",
  "index": "ecommerce"
}
```

#### Response
```json
{
  "search_configuration_id": "0d687614-df5b-4b6b-8110-9d8c6d407963",
  "search_configuration_result": "CREATED"
}
```

## Running the search result list comparison experiment

A query set and two search configurations (and a corresponding index, of course) are all we need to run our first experiment, a search result list comparison experiment. By comparing search results, you can gauge how modifying the search configurations impacts their search results. We first use the endpoint `_plugins/search_relevance/experiments`, you create an experiment.

### Example: Creating an experiment

```json
POST _plugins/_search_relevance/experiments
{
 "querySetId": "1856093f-9245-449c-b54d-9aae7650551a",
 "searchConfigurationList": ["122fbde8-d593-4d71-96d4-cbe3b4977468", "0d687614-df5b-4b6b-8110-9d8c6d407963"],
 "size": 10,
 "type": "PAIRWISE_COMPARISON"
}
```
### Response

```json
{
  "experiment_id": "dbae9786-6ea0-413d-a500-a14ef69ef7e1",
  "experiment_result": "CREATED"
}
```

We can retrieve the results of the experiment with the returned `experiment_id`:

### Example: Retrieving experiment results

```json
GET _plugins/_search_relevance/experiments/dbae9786-6ea0-413d-a500-a14ef69ef7e1
```

### Response

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

However, the Search Relevance Workbench is not only a backend tool. You can create all the previously mentioned in the frontend and eventually visualize the experiment results.
Let's create the same experiment in the frontend and review the results.

In the left navigation go to "Search Relevance" in the OpenSearch Plugins section. Now click on Query Set Comparison:

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/select_query_set_comparison.png" alt="Select Query Set Comparison Experiment"/>{: .img-fluid }

Now select the query set you created ("TVs") and the search confiogurations ("my_production_config", "title_boost") and click on the button "Start Evaluation":

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/query_set_comparison_experiment_definition.png" alt="Define Query Set Comparison Experiment"/>{: .img-fluid }

You are automatically directed to the experiment overview table:

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/experiment_table_overview.png" alt="Experiment Overview Table"/>{: .img-fluid }

Select the top experiment (the latest one) and you are accessing the results. The experiment view page shows three elements:
1. The experiment parameters
2. The aggregate metrics resulting from the experiment:
<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/aggregate_metrics_comparison_experiment.png" alt="Aggregate Metrics for Comparison Experiment"/>{: .img-fluid }
3. The individual metrics per query. Clicking on a query event lets you assess the change between two result sets visually.
