---
layout: default
title: Scripted metric
parent: Metric aggregations
grand_parent: Aggregations
nav_order: 100
redirect_from:
  - /query-dsl/aggregations/metric/scripted-metric/
---

# Scripted metric aggregations

The `scripted_metric` metric is a multi-value metric aggregation that returns metrics calculated from a specified script.

A script has four stages: the initial stage, the map stage, the combine stage, and the reduce stage.

* `init_script`: (OPTIONAL) Sets the initial state and executes before any collection of documents.
* `map_script`: Checks the value of the `type` field and executes the aggregation on the collected documents.
* `combine_script`: Aggregates the state returned from every shard. The aggregated value is returned to the coordinating node.
* `reduce_script`: Provides access to the variable states; this variable combines the results from the `combine_script` on each shard into an array.

The following example aggregates the different HTTP response types in web log data:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggregations": {
    "responses.counts": {
      "scripted_metric": {
        "init_script": "state.responses = ['error':0L,'success':0L,'other':0L]",
        "map_script": """
              def code = doc['response.keyword'].value;
                 if (code.startsWith('5') || code.startsWith('4')) {
                  state.responses.error += 1 ;
                  } else if(code.startsWith('2')) {
                   state.responses.success += 1;
                  } else {
                  state.responses.other += 1;
                }
             """,
        "combine_script": "state.responses",
        "reduce_script": """
            def counts = ['error': 0L, 'success': 0L, 'other': 0L];
                for (responses in states) {
                 counts.error += responses['error'];
                  counts.success += responses['success'];
                counts.other += responses['other'];
        }
        return counts;
        """
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
...
"aggregations" : {
  "responses.counts" : {
    "value" : {
      "other" : 0,
      "success" : 12832,
      "error" : 1242
    }
  }
 }
}
```
