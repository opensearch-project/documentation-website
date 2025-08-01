---
layout: default
title: Scripted metric
parent: Metric aggregations
nav_order: 100
redirect_from:
  - /query-dsl/aggregations/metric/scripted-metric/
---

# Scripted metric aggregations

The `scripted_metric` aggregation is a multi-value metric aggregation that returns metrics calculated from a specified script. A script has four stages: `init`, `map`, `combine`, and `reduce`, which are run in order by each aggregation, and allow you to combine results from your documents.

All four scripts share a mutable object called `state` that is defined by you. The `state` is local to each shard during the `init`, `map`, and `combine` phases. The result is passed into the states array for the `reduce` phase. Therefore each shard’s `state` is independent until they are combined in the `reduce` step.

## Parameters

The `scripted_metric` aggregation takes the following parameters:

| Parameter        | Data type | Required/Optional | Description                                                                                        |
| ---------------- | --------- | ----------------- | -------------------------------------------------------------------------------------------------- |
| `init_script`    | String    | Optional          | The script executes once per shard before any documents are processed. Used to set up an initial state. For example, initialize counters or lists in a state object. If not provided, the state starts as an empty object on each shard.       |
| `map_script`     | String    | Required          | The script executes for each document collected by the aggregation. This script updates the state based on the document’s data. For example, you might check the field's value and then increment a counter or sum a running total in the state.                                                  |
| `combine_script` | String    | Required          | The script executes once per shard after all documents on that shard have been processed by the `map_script`. This script aggregates the shard’s state into a single result to be sent back to the coordinating node. This script is used to finalize the computation for one shard. For example, summing up counters or totals stored in state. The script should return the consolidated value or structure for its shard.  |
| `reduce_script`  | String    | Required          | The script executes once on the coordinating node after receiving combined results from all shards. This script receives a special variable states, which is an array containing each shard’s output from the combine script. The `reduce_script` iterates over states and produces the final aggregation output. For example, summing shard sums, or merging maps of counts. The value returned by the reduce script will be the value reported in the aggregation results. |
| `params`         | Object    | Optional          | User-defined parameters accessible from all scripts except `reduce_script`.                        |

## Allowed return types

Scripts can use any valid operations and objects internally, however the data you store in `state`, or return from any script, must be of permitted types. This restriction exists because the intermediate state needs to be sent between nodes. The allowed types are:

- Primitive types: `int`, `long`, `float`, `double`, `boolean`
- String
- Map (with keys and values only of allowed types: Primitive types, String, Map, Array)
- Array (containing only allowed types: Primitive types, String, Map, Array)

Therefore your `state` can be a number, a string, a map (object) or an array (list), or a combination of these. For example, you can use a map to accumulate multiple counters, an array to collect values, or a single number to keep a running total. If you need to return multiple metrics, you can store them in a map or array. If you return a map as the final value from the reduce script, the aggregation result will contain an object. If you return a single number or string, the result will be a single value.

## Using parameters in scripts

You can optionally pass custom parameters to your scripts using the `params` field. This is a user-defined object whose contents become variables available in your `init_script`, `map_script`, and `combine_script`. The `reduce_script` does not directly receive `params`, because by the `reduce` phase you all needed data should be in the `states` array. If you need a constant in the `reduce` phase, you can include it as part of each shard’s state or use a stored script. All parameters must be defined inside the global `params` object, this ensures that they are shared across the different script stages. If you do not specify any `params`, it will default to an empty object. 

For example, you can supply a `threshold` or `field` name via `params` and reference `params.threshold` or `params.field` inside your scripts, see following example:

```json
"scripted_metric": {
  "params": {
    "threshold": 100,
    "field": "amount"
  },
  "init_script": "...",
  "map_script": "...",
  "combine_script": "...",
  "reduce_script": "..."
}
```

## Example

The following are two separate examples demonstrating different ways to use `scripted_metric`.

### Calculating net profit from transactions

The following example demonstrates the use of the `scripted_metric` aggregation to compute a custom metric that is not directly supported by built-in aggregations. The dataset represents financial transactions, where each document is classified as either a sale (income) or a cost (expense) and includes an amount field. The objective is to calculate the total net profit by subtracting the total cost from the total sales across all documents. 

Create an index:

```json
PUT transactions
{
  "mappings": {
    "properties": {
      "type":   { "type": "keyword" }, 
      "amount": { "type": "double" }
    }
  }
}
```
{% include copy-curl.html %}

Index four transactions, two sales (amounts `80` and `130`) and two costs (`10` and `30`):

```json
PUT transactions/_bulk?refresh=true
{ "index": {} }
{ "type": "sale", "amount": 80 }
{ "index": {} }
{ "type": "cost", "amount": 10 }
{ "index": {} }
{ "type": "cost", "amount": 30 }
{ "index": {} }
{ "type": "sale", "amount": 130 }
```
{% include copy-curl.html %}

In order to run a search with a scripted metric aggregation to calculate the profit, use the following scripts:

- The `init_script` sets up an empty list to hold transaction values for each shard. 
- The `map_script` for each document adds the document’s amount to the `state.transactions` list as a positive number if the type is `sale`, or as a negative number if the type is `cost`. By the end of the map phase, each shard will have a `state.transactions` list representing its income and expenses. 
- The `combine_script` processes the `state.transactions` list and computes a single `shardProfit` value for the shard. This `shardProfit` number is then returned as the shard's output. 
- The `reduce_script` runs on the coordinating node, receiving the array `states`, which holds the `shardProfit` value from each shard. It checks for null entries and sums these values to compute the overall profit, and returns the final result.

See following example:

```json
GET transactions/_search
{
  "size": 0, 
  "aggs": {
    "total_profit": {
      "scripted_metric": {
        "init_script": "state.transactions = []",
        "map_script": "state.transactions.add(doc['type'].value == 'sale' ? doc['amount'].value : -1 * doc['amount'].value)",
        "combine_script": "double shardProfit = 0; for (t in state.transactions) { shardProfit += t; } return shardProfit;",
        "reduce_script": "double totalProfit = 0; for (p in states) { if (p != null) { totalProfit += p; }} return totalProfit;"
      }
    }
  }
}
```
{% include copy-curl.html %}

Example response

The response returns the `total_profit` as `170`:

```json
{
  ...
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "total_profit": {
      "value": 170
    }
  }
}
```

### Categorizing HTTP response codes

The following example demonstrates a more advanced use of the `scripted_metric` aggregation to return multiple values within a single aggregation. The dataset consists of web server log entries, each containing an HTTP response code. The goal is to classify the responses into three categories: successful responses (2xx status codes), client or server errors (4xx or 5xx status codes), and other responses (1xx or 3xx status codes). This classification is implemented by maintaining counters within a map-based aggregation state. 

Create a sample index:

```json
PUT logs
{
  "mappings": {
    "properties": {
      "response": { "type": "keyword" }
    }
  }
}
```
{% include copy-curl.html %}

Add sample documents with a variety of response codes:

```json
PUT logs/_bulk?refresh=true
{ "index": {} }
{ "response": "200" }
{ "index": {} }
{ "response": "201" }
{ "index": {} }
{ "response": "404" }
{ "index": {} }
{ "response": "500" }
{ "index": {} }
{ "response": "304" }
```
{% include copy-curl.html %}

To run a scripted metric aggregation which counts the categories, using the following scripts:

Explanation: Here our state (on each shard) is a map with three counters: error, success, and other. 
- The `init_script` initializes counters for `error`, `success`, and `other` to 0. 
- The `map_script` examines each document’s response code and increments the relevant counter based on the response code. 
- The `combine_script` returns the `state.responses` map for that shard.
- The `reduce_script` takes the array of maps (`states`) from all shards and merges them. In doing so it creates a new combined map and adds up the `error`, `success`, and `other` counts from each shard’s map. This combined map is returned as the final result.

See the following example:

```json
GET logs/_search
{
  "size": 0,
  "aggs": {
    "responses_by_type": {
      "scripted_metric": {
        "init_script": "state.responses = new HashMap(); state.responses.put('success', 0); state.responses.put('error', 0); state.responses.put('other', 0);",
        "map_script": """
          String code = doc['response'].value;
          if (code.startsWith("5") || code.startsWith("4")) {
            // 4xx or 5xx -> count as error
            state.responses.error += 1;
          } else if (code.startsWith("2")) {
            // 2xx -> count as success
            state.responses.success += 1;
          } else {
            // anything else (e.g., 1xx, 3xx, etc.) -> count as other
            state.responses.other += 1;
          }
        """,
        "combine_script": "return state.responses;",
        "reduce_script": """
          Map combined = new HashMap();
          combined.error = 0;
          combined.success = 0;
          combined.other = 0;
          for (state in states) {
            if (state != null) {
              combined.error += state.error;
              combined.success += state.success;
              combined.other += state.other;
            }
          }
          return combined;
        """
      }
    }
  }
}
```
{% include copy-curl.html %}

Example response

The response returns three values together under the `value` object. This demonstrates how a scripted metric can return multiple metrics at once by using a map in the state:

```json
{
  ...
  "hits": {
    "total": {
      "value": 5,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "responses_by_type": {
      "value": {
        "other": 1,
        "success": 2,
        "error": 2
      }
    }
  }
}
```

## Handling empty buckets (no documents scenario)

When using a `scripted_metric` aggregation as a sub-aggregation within a bucket aggregation (such as terms), it is important to account for buckets that contain no documents on certain shards. In such cases, those shards return a `null` value for the aggregation state. During the `reduce_script` phase, the states array may therefore include `null` entries corresponding to these shards. To ensure reliable execution, the `reduce_script` must be designed to handle `null` values gracefully. A common approach is to include a conditional check, such as `if (state != null)`, before accessing or operating on each state. Failure to implement such checks can result in runtime errors when processing empty buckets across shards.


## Performance considerations

Because scripted metrics run custom code for every document and possibly accumulate large in-memory state, they can be slower than built-in aggregations. The intermediate state from each shard has to be serialized to send it to the coordinating node. Therefore if your state is very large, it can consume a lot of memory and network bandwidth. To keep your searches efficient, make your scripts as lightweight as possible and avoid accumulating unnecessary data in the state. Use the combine stage to shrink state data before sending, as demonstrated in [calculating net profit from transactions](#calculating-net-profit-from-transactions) example, and only collect what you truly need to produce the final metric.

