---
layout: default
title: Scripted metric
parent: Metric aggregations
nav_order: 100
redirect_from:
  - /query-dsl/aggregations/metric/scripted-metric/
---

# Scripted metric aggregation

The `scripted_metric` aggregation is a multi-value metric aggregation that returns metrics calculated by scripts that you provide. The aggregation runs four scripts, one for each of its phases: `init`, `map`, `combine`, and `reduce`. The phases run in order and together combine results from your documents. The scripts are written in [Painless]({{site.url}}{{site.baseurl}}/scripting/painless/), and you can provide each one inline or as a [stored script]({{site.url}}{{site.baseurl}}/api-reference/script-apis/create-stored-script/).

All four scripts share a mutable object called `state` that is defined by you. The `state` is local to each shard during the `init`, `map`, and `combine` phases. The result is passed into the `states` array for the `reduce` phase. Therefore, each shard's `state` is independent until the shards are combined in the `reduce` step. Each script can be specified as a string containing the script source or a script object. For more information about specifying scripts, see [How to use scripts]({{site.url}}{{site.baseurl}}/scripting/using-scripts/).

## Parameters

The `scripted_metric` aggregation takes the following parameters.

| Parameter        | Data type | Required/Optional | Description                                                                                        |
| ---------------- | --------- | ----------------- | -------------------------------------------------------------------------------------------------- |
| `init_script`    | String or object | Optional          | A script that executes once per shard before any documents are processed. Used to set up an initial `state` (for example, initialize counters or lists in a `state` object). If not provided, the `state` starts as an empty object on each shard. |
| `map_script`     | String or object | Required          | A script that executes for each document collected by the aggregation. This script updates the `state` based on the document's data. For example, you might check the field's value and then increment a counter or calculate a running sum in the `state`.                                                  |
| `combine_script` | String or object | Required          | A script that executes once per shard after all documents on that shard have been processed by the `map_script`. This script aggregates the shard's `state` into a single result to be sent back to the coordinating node. This script is used to finalize the computation for one shard (for example, summing up counters or totals stored in the `state`). The script should return the consolidated value or structure for its shard.  |
| `reduce_script`  | String or object | Required          | A script that executes once on the coordinating node after receiving combined results from all shards. This script receives a special variable `states`, which is an array containing each shard's output from the `combine_script`. The `reduce_script` iterates over states and produces the final aggregation output (for example, adding shard sums or merging maps of counts). The value returned by the `reduce_script` is the value reported in the aggregation results. |
| `params`         | Object    | Optional          | User-defined parameters accessible from all four scripts.                        |

## Allowed return types

Scripts can use any valid operation and object internally. However, the data you store in `state` or return from any script must be of one of the allowed types. This restriction exists because the intermediate `state` needs to be sent between nodes. The following types are allowed:

- Primitive types: `int`, `long`, `float`, `double`, `boolean`
- String
- Map (with keys and values of only allowed types: primitive types, string, map, or array)
- Array (containing only allowed types: primitive types, string, map, or array)

The `state` can be a number, a string, a `map` (object) or an array (list), or a combination of these. For example, you can use a `map` to accumulate multiple counters, an array to collect values, or a single number to keep a running sum. If you need to return multiple metrics, you can store them in a `map` or array. If you return a `map` as the final value from the `reduce_script`, the aggregation result contains an object. If you return a single number or string, the result is a single value.

## Using parameters in scripts

You can optionally pass custom parameters to your scripts using the `params` field. This is a user-defined object whose contents are available in all four scripts as `params`. If you do not specify any `params`, the `params` object is empty. You can also define `params` on an individual script object, for example, `"reduce_script": {"source": "...", "params": {...}}`. OpenSearch merges these parameters with the top-level `params`. A parameter name can't appear in both places; if it does, the request fails. 

For example, you can supply a `threshold` or `field` name in `params` and then reference `params.threshold` or `params.field` in your scripts:

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

## Examples

The following examples demonstrate different ways to use `scripted_metric`.

### Calculating net profit from transactions

The following example demonstrates the use of the `scripted_metric` aggregation to compute a custom metric that is not directly supported by built-in aggregations. The dataset represents financial transactions, in which each document is classified as either a `sale` (income) or a `cost` (expense) and includes an `amount` field. The objective is to calculate the total net profit by subtracting the total cost from the total sales across all documents. 

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

Index four transactions, two sales (amounts `80` and `130`), and two costs (`10` and `30`):

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

To run a search with a `scripted_metric` aggregation to calculate the profit, use the following scripts:

- The `init_script` creates an empty list used to store transaction values for each shard. 
- The `map_script` adds each document's amount to the `state.transactions` list as a positive number if the type is `sale` or as a negative number if the type is `cost`. By the end of the `map` phase, each shard has a `state.transactions` list representing its income and expenses. 
- The `combine_script` processes the `state.transactions` list and computes a single `shardProfit` value for the shard. The `shardProfit` is then returned as the shard's output. 
- The `reduce_script` runs on the coordinating node, receiving the `states` array, which holds the `shardProfit` value from each shard. It checks for null entries, adds these values to compute the overall profit, and returns the final result.

The following request contains all described scripts:

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


The response returns the `total_profit`:

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
      "value": 170.0
    }
  }
}
```

### Shard-by-shard walkthrough

To see how the four phases process the data, run the net profit calculation on an index with two shards. Create the index:

```json
PUT transactions_2shards
{
  "settings": {
    "number_of_shards": 2
  },
  "mappings": {
    "properties": {
      "type":   { "type": "keyword" },
      "amount": { "type": "double" }
    }
  }
}
```
{% include copy-curl.html %}

Index the four transactions. The `routing` values place documents 1 and 3 on shard 0 and documents 2 and 4 on shard 1:

```json
POST transactions_2shards/_bulk?refresh
{ "index": { "_id": "1", "routing": "a" } }
{ "type": "sale", "amount": 80 }
{ "index": { "_id": "2", "routing": "b" } }
{ "type": "cost", "amount": 10 }
{ "index": { "_id": "3", "routing": "a" } }
{ "type": "cost", "amount": 30 }
{ "index": { "_id": "4", "routing": "b" } }
{ "type": "sale", "amount": 130 }
```
{% include copy-curl.html %}

The following table shows the result of each phase of the net profit calculation on each shard.

| Phase | Shard 0 (documents 1 and 3) | Shard 1 (documents 2 and 4) |
| :--- | :--- | :--- |
| Before `init_script` | `{}` | `{}` |
| After `init_script` | `{"transactions": []}` | `{"transactions": []}` |
| After `map_script` | `{"transactions": [80.0, -30.0]}` | `{"transactions": [-10.0, 130.0]}` |
| After `combine_script` | `50.0` | `120.0` |

The `reduce_script` then runs once on the coordinating node. It receives the `states` array `[50.0, 120.0]` and returns their sum, `170.0`.

The order of the entries in `states` isn't guaranteed, so you might see `[120.0, 50.0]` instead. Write the `reduce_script` so that its result doesn't depend on the order of the shard results.
{: .note}

To inspect the intermediate results yourself, make the later scripts return their input unchanged. For example, the following request returns each shard's `state` after the `map_script` by returning `state` from the `combine_script` and `states` from the `reduce_script`:

```json
GET transactions_2shards/_search
{
  "size": 0,
  "aggs": {
    "profit": {
      "scripted_metric": {
        "init_script": "state.transactions = []",
        "map_script": "state.transactions.add(doc['type'].value == 'sale' ? doc['amount'].value : -1 * doc['amount'].value)",
        "combine_script": "return state",
        "reduce_script": "return states"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains one `state` object for each shard:

```json
{
  ...
  "aggregations": {
    "profit": {
      "value": [
        {
          "transactions": [
            80.0,
            -30.0
          ]
        },
        {
          "transactions": [
            -10.0,
            130.0
          ]
        }
      ]
    }
  }
}
```

Similarly, to see the result of the `combine_script` on each shard, keep the original `combine_script` and return `states` from the `reduce_script`:

```json
GET transactions_2shards/_search
{
  "size": 0,
  "aggs": {
    "profit": {
      "scripted_metric": {
        "init_script": "state.transactions = []",
        "map_script": "state.transactions.add(doc['type'].value == 'sale' ? doc['amount'].value : -1 * doc['amount'].value)",
        "combine_script": "double p = 0; for (t in state.transactions) { p += t } return p",
        "reduce_script": "return states"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the profit calculated on each shard:

```json
{
  ...
  "aggregations": {
    "profit": {
      "value": [
        50.0,
        120.0
      ]
    }
  }
}
```


### Using stored scripts

You can store each script using the [Create or Update Stored Script API]({{site.url}}{{site.baseurl}}/api-reference/script-apis/create-stored-script/) and reference it by `id`. The following requests store the four scripts from the preceding example. The `map_script` reads the name of the amount field from `params.field`:

```json
PUT _scripts/profit_init
{
  "script": {
    "lang": "painless",
    "source": "state.transactions = []"
  }
}
```
{% include copy-curl.html %}

```json
PUT _scripts/profit_map
{
  "script": {
    "lang": "painless",
    "source": "double v = doc[params.field].value; state.transactions.add(doc['type'].value == 'sale' ? v : -1 * v)"
  }
}
```
{% include copy-curl.html %}

```json
PUT _scripts/profit_combine
{
  "script": {
    "lang": "painless",
    "source": "double p = 0; for (t in state.transactions) { p += t } return p"
  }
}
```
{% include copy-curl.html %}

```json
PUT _scripts/profit_reduce
{
  "script": {
    "lang": "painless",
    "source": "double p = 0; for (s in states) { if (s != null) { p += s } } return p"
  }
}
```
{% include copy-curl.html %}

The following request references the stored scripts by `id`. Define the parameters in the top-level `params` object so that they are available to all of the scripts:

```json
GET transactions/_search
{
  "size": 0,
  "aggs": {
    "total_profit": {
      "scripted_metric": {
        "init_script": { "id": "profit_init" },
        "map_script": { "id": "profit_map" },
        "combine_script": { "id": "profit_combine" },
        "reduce_script": { "id": "profit_reduce" },
        "params": {
          "field": "amount"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the same `total_profit` as the preceding example:

```json
{
  ...
  "aggregations": {
    "total_profit": {
      "value": 170.0
    }
  }
}
```

### Categorizing HTTP response codes

The following example demonstrates a more advanced use of the `scripted_metric` aggregation for returning multiple values within a single aggregation. The dataset consists of web server log entries, each containing an HTTP response code. The goal is to classify the responses into three categories: successful responses (2xx status codes), client or server errors (4xx or 5xx status codes), and other responses (1xx or 3xx status codes). This classification is implemented by maintaining counters within a map-based aggregation `state`. 

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

The `state` (on each shard) is a `map` with three counters: `error`, `success`, and `other`. 

To run a scripted metric aggregation that counts the categories, use the following scripts:

- The `init_script` initializes counters for `error`, `success`, and `other` to `0`. 
- The `map_script` examines each document's response code and increments the relevant counter based on the response code. 
- The `combine_script` returns the `state.responses` map for that shard.
- The `reduce_script` merges the array of maps (`states`) from all shards. Thus, it creates a new combined `map` and adds the `error`, `success`, and `other` counts from each shard's `map`. This combined `map` is returned as the final result.

The following request contains all described scripts:

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


The response returns three values in the `value` object, demonstrating how a scripted metric can return multiple metrics at once by using a `map` in the `state`:

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

## Managing empty buckets

A shard that has no matching documents still runs the `init_script` and `combine_script`, so it contributes the result of the `combine_script` to the `states` array. However, some bucket aggregations create empty buckets that are not collected on any shard. For example, a `histogram` or `date_histogram` aggregation returns empty buckets between the first and last buckets that contain documents. For these buckets, the `states` array contains `null`.

The following request groups the transactions into histogram buckets of 25 and calculates the profit in each bucket. The transactions have amounts of 10, 30, 80, and 130, so the buckets for 50 and 100 are empty. The `reduce_script` checks for `null` before adding each state:

```json
GET transactions/_search
{
  "size": 0,
  "aggs": {
    "by_amount": {
      "histogram": {
        "field": "amount",
        "interval": 25
      },
      "aggs": {
        "profit": {
          "scripted_metric": {
            "init_script": "state.transactions = []",
            "map_script": "state.transactions.add(doc['type'].value == 'sale' ? doc['amount'].value : -1 * doc['amount'].value)",
            "combine_script": "double s = 0; for (t in state.transactions) { s += t } return s",
            "reduce_script": "double total = 0; for (s in states) { if (s != null) { total += s } } return total"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The empty buckets report a profit of `0`:

```json
{
  ...
  "aggregations": {
    "by_amount": {
      "buckets": [
        {
          "key": 0.0,
          "doc_count": 1,
          "profit": {
            "value": -10.0
          }
        },
        {
          "key": 25.0,
          "doc_count": 1,
          "profit": {
            "value": -30.0
          }
        },
        {
          "key": 50.0,
          "doc_count": 0,
          "profit": {
            "value": 0.0
          }
        },
        {
          "key": 75.0,
          "doc_count": 1,
          "profit": {
            "value": 80.0
          }
        },
        {
          "key": 100.0,
          "doc_count": 0,
          "profit": {
            "value": 0.0
          }
        },
        {
          "key": 125.0,
          "doc_count": 1,
          "profit": {
            "value": 130.0
          }
        }
      ]
    }
  }
}
```

Without the `if (s != null)` check, the `reduce_script` fails with a `null_pointer_exception` for the empty buckets. Always check for `null` entries in the `states` array.
{: .important}

## Performance considerations

Because scripted metrics run custom code for every document and therefore potentially accumulate a large in-memory `state`, they can be slower than built-in aggregations. The intermediate `state` from each shard must be serialized in order to send it to the coordinating node. Therefore if your `state` is very large, it can consume a lot of memory and network bandwidth. To keep your searches efficient, make your scripts as lightweight as possible and avoid accumulating unnecessary data in the `state`. Use the combine stage to shrink `state` data before sending, as demonstrated in [Calculating net profit from transactions](#calculating-net-profit-from-transactions), and only collect the values that you truly need to produce the final metric.

