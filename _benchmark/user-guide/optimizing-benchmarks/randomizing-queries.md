---
layout: default
title: Running randomized workloads
nav_order: 160
parent: Optimizing benchmarks
grand_parent: User guide
---

# Randomizing queries

By default, OpenSearch Benchmark runs identical queries for some number of iterations. But this isn't suitable for all tests. For example, when testing caching behavior, running many iterations of the same query would cause 1 miss and many hits, which doesn't approximate real usage very well.

OSB lets you randomize queries in a configurable way.

## Overview

Randomization works by changing the values in an operation's query. For example in this nyc_taxis operation:

```
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

We can change the values for `"gte"` and `"lt"` to get distinct queries, which become different entries in the request cache.

To get cache hits, we can't completely randomize this; we have to reuse the same values some of the time. To achieve this we generate some number `N` of value pairs for each randomized operation at the beginning of the benchmark. Each pair gets an index from 1 to `N`. 

Every time a query is sent to OpenSearch, some fraction `rf` (short for "repeat-frequency") of the time, we draw a pair from this saved list. This pair may have been seen before, so it could cause a cache hit. For example, if `rf` = 0.7, the cache hit ratio could be up to 70%. In practice, this may or may not be a hit, depending on benchmark duration and cache size. 

We draw saved pairs based on the Zipf distribution, which empirically matches usage traces for many real caches. Pair `i` is drawn with probability proportional to `1 / i^alpha`, where `alpha` is another parameter controlling how spread out the distribution is. So, pairs with small indexes are drawn much more often than ones with large indexes. 

Otherwise, the other `1-rf` fraction of the time, we generate a totally new random pair of values. This will not have been seen before, so it should be a cache miss. 

## Usage

To use this feature on a workload you must make some changes to your workload's `workload.py` and supply some flags when running OSB. 

### CLI flags

`--randomization-enabled` turns randomization on and off. 

`--randomization-repeat-frequency` or `-rf` sets the fraction of pairs drawn from the saved value pairs generated at the start of the benchmark. Should be between `0.0` and `1.0`. Has no effect if randomization is disabled. Defaults to `0.3`. 

`--randomization-n` sets the number `N` of value pairs generated for each operation. Has no effect if randomization is disabled. Defaults to `5000`. 

`--randomization-alpha` sets the parameter `alpha` controlling the shape of the Zipf distribution. Should be `>=0`. Lower values spread out the distribution more. Has no effect if randomization is disabled. Defaults to `1.0`. 

### Changes in workload.py

You specify how to generate the saved value pairs for each operation by registering a "standard value source" for that operation. This is a Python function that takes no arguments and returns a dict with keys matching the keys in the query which should be randomized. Usually this function would have randomness in it. Finally, you modify the `register()` method to register this function with the operation name and field name which is randomized. 

For example, to randomize the `"total_amount"` field in the `"range"` operation from earlier, a standard value source might look like: 

```
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

And the registration looks like: 

```
def register(registry):
    registry.register_standard_value_source("range", "total_amount", range_query_standard_value_source)
```

There may already be code in this function. Leave it there if so. If `workload.py` does not exist or lacks a `register(registry)` function, you can create them. 

#### Randomizing non-range queries

By default, OSB assumes the query to be randomized is a `"range"` query with values `"gte"`/`"gt"`, `"lte"`/`"lt"`, and optionally `"format"`. If this isn't the case you can configure it to use a different query type name and different values. 

For example to randomize the operation: 

```
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

You would register the following in `workload.py`: 

```
registry.register_query_randomization_info("bbox", "geo_bounding_box", [["top_left"], ["bottom_right"]], [])
```

The first argument, `"bbox"`, is the operation name. The second argument, `"geo_bounding_box"`, is the query type name.

The third argument is a list of lists: `[["top_left"], ["bottom_right"]]`. Each entry in the outer list represents one parameter name that will be randomized. It's a list because we may have multiple different versions of the same name that represent roughly the same thing. For example, `"gte"` or `"gt"`. In this case there's only one option for each parameter name. At least one version of each parameter name must be present in the original query for it to be randomized.

The last argument is a list of optional parameters. If an optional parameter is present in the random standard value source, it will be put into the randomized version of the query. If it's not in the source, it's ignored. There are no optional parameters in this example, but the typical use case would be `"format"` in a range query.

If nothing is registered, it falls back to the default; equivalent to registering `registry.register_query_randomization_info(<operation_name>, "range", [["gte", "gt"], ["lte", "lt"]], ["format"])`.

The dict returned by the standard value source should match the parameter names you are trying to randomize. For example the standard value source for the earlier example is:

```
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