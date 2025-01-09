---
layout: default
title: Running randomized workloads
nav_order: 160
parent: Optimizing benchmarks
grand_parent: User guide
---

# Randomizing queries

By default, OpenSearch Benchmark runs identical queries for multiple benchmark iterations. However, running the same queries repeatedly isn’t ideal for every test. For example, simulating real-world caching with many iterations of the same query isn’t accurate, as it results in one cache miss, followed by many hits. OpenSearch Benchmark lets you randomize queries in a configurable way. 

For example, changing `"gte"` and `"lt"` in the following `nyc_taxis` operation creates distinct queries, resulting in unique cache entries:

```json
{
    "name": "range",
    "operation-type": "search",
    "body": {
    "query": {
        "range": {
        "total_amount": {
            "gte": 5,
            "lte": 15
        }
        }
    }
    }
}
```


You can’t completely randomize the values, as then the cache would not get any hits. To get cache hits, the cache must sometimes see the same values. To account for the same values while randomizing, OpenSearch Benchmark generates a number `N` of value pairs for each randomized operation at the beginning of the benchmark. OpenSearch Benchmark stores these values in a saved list where each pair gets an index from `1` to `N`.

Every time OpenSearch sends a query, OpenSearch Benchmark decides whether to use a pair of values from this saved list in the query. It does this a configurable fraction of the time, called repeat frequency (`rf`). If OpenSearch pair has encountered the value pair before, this might cause for a cache hit. For example, if `rf` = 0.7, the cache hit ratio could be up to 70%. This ratio could cause a hit, depending on the benchmark’s duration and cache size. 

Saved value pairs are based on the `Zipf` distribution, which empirically matches usage traces for many real caches. For example, if the benchmark draws pair `i` with a probability proportional to `1 / i^alpha`, `alpha` is another parameter controlling how spread out the distribution is. Pairs with low indexes appear with a much higher frequency than those with high indexes.

Otherwise, the other `1-rf` fraction of the time, we generate a totally new random pair of values. Because OpenSearch Benchmark has not seen these value pairs before, the pairs should miss the cache.


## Usage

To use this feature on a workload you must make some changes to your workload's `workload.py` and supply some CLI flags when running OSB.

### Modifying `workload.py`

Specify how to generate the saved value pairs for each operation by registering a “standard value source” for that operation. This Python function accepts no arguments and returns a dictionary. The keys mirror those in the input query, but are randomized. Finally, change the `register()` method to register this function with the operation name and field name, which is randomized.

For example, to randomize the `"total_amount"` field in the `"range"` operation from earlier, a standard value source might look like the following function: 

```py
def random_money_values(max_value):
    gte_cents = random.randrange(0, max_value*100)
    lte_cents = random.randrange(gte_cents, max_value*100)
    return {
        "gte":gte_cents/100,
        "lte":lte_cents/100
    }

def range_query_standard_value_source():
    return random_money_values(120.00)
```

Similarly, you can randomize the registration behavior with the following function:

```py
def register(registry):
    registry.register_standard_value_source("range", "total_amount", range_query_standard_value_source)
```

There may already be code in this function. Leave it there if so. If `workload.py` does not exist or lacks a `register(registry)` function, you can create them. 

#### Randomizing non-range queries

By default, OSB assumes the query to be randomized is a `"range"` query with values `"gte"`/`"gt"`, `"lte"`/`"lt"`, and optionally `"format"`. If this isn’t the case, you can configure it to use a different query type name and different values. 

For example, to randomize the following workload operation: 

```json
{
  "name": "bbox", 
  "operation-type": "search", 
  "index": "nyc_taxis",
  "body": { 
    "size": 0,
    "query": {
      "geo_bounding_box": {
        "pickup_location": {
          "top_left": [-74.27, 40.92],
          "bottom_right": [-73.68, 40.49]
        }
      }
    }
  }
}
```

You would register the following function in `workload.py`: 

```py
registry.register_query_randomization_info("bbox", "geo_bounding_box", [["top_left"], ["bottom_right"]], [])
```

The first argument, `"bbox"`, is the operation's name. 

The second argument, `"geo_bounding_box"`, is the query type name.

The third argument is a list of lists: `[[“top_left”], [“bottom_right”]]`. The outer list’s entries specify parameters for randomization, because there might be different versions of the same name that represent roughly the same parameters, for example, `"gte"` or `"gt"`. Here, there’s only one option for each parameter name. At least one version of each parameter's name must be present in the original query for it to be randomized.

The last argument is a list of optional parameters. If an optional parameter is present in the random standard value source, OpenSearch Benchmark puts the parameter into the randomized version of the query. If it’s not in the source, it’s ignored. There are no optional parameters in the following example, but the typical use case would be `"format"` in a range query.

If there’s no registration, it uses the default; equivalent to registering `registry.register_query_randomization_info(<operation_name>, “range”, [[“gte”, “gt”], [“lte”, “lt”]], [“format”])`.

The `dict` returned by the standard value source should match the parameter names you are randomizing. For example, the standard value source for the earlier example is:

The `dict` returned by the standard value source should match the parameter names you are randomizing. For example, the standard value source for the earlier example is:

```py
def bounding_box_source(): 
    top_longitude = random.uniform(-74.27, -73.68)
    top_latitude = random.uniform(40.49, 40.92)

    bottom_longitude = random.uniform(top_longitude, -73.68)
    bottom_latitude = random.uniform(40.49, top_latitude)

    return { 
        "top_left":[top_longitude, top_latitude],
        "bottom_right":[bottom_longitude, bottom_latitude]
    }
```



### CLI flags

Use the following CLI flags to customize randomization:

- `--randomization-enabled` turns randomization on and off. If randomization is not enabled, none of the randomization flags will have an effect.

- `--randomization-repeat-frequency` or `-rf` sets the fraction of pairs drawn from the saved value pairs generated at the start of the benchmark. The value should be between `0.0` and `1.0`.  Default is `0.3`. 

- `--randomization-n` sets the number `N` of value pairs generated for each operation. Default is `5000`. 

- `--randomization-alpha` sets the parameter `alpha` controlling the shape of the `Zipf` distribution. The value should be `>=0`. Lower values spread out the distribution more. Default is `1.0`. 
