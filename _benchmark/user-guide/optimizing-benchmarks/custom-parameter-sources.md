---
layout: default
title: Adding parameter sources and custom runners
nav_order: 120
parent: Optimizing benchmarks
grand_parent: User guide
---

# Adding parameter sources and custom runners

A **parameter source** is a source outside of OpenSearch Benchmark that provides parameters to an operation. **Runners** are operation types performed on an OpenSearch cluster. When used in conjunction, these two components allow you to further customize OpenSearch Benchmark with custom APIs, making a workload more specific to your use case. 

To add custom parameter sources and runners, use the following steps to modify your `workload.py` file.

Adding custom parameters sources and runners modifies performance critical paths in OpenSearch Benchmark and therefore can lead to performance bottlenecks during texting. Carefully consider these changes before making them.
{: .warning}

## Registering a custom parameter source

The `register_param_source` setting provides custom parameters for an operation. To use the `register_param_source` setting, use the following steps to modify `operations/default.json` and `workloads.py`:


1. Make sure that operation you want to modify exists in both `test_procedures/default.json` and `operations/default.json`.
2. In both fields, add a `param-source` field to the operation, specifying the name of the parameter source. Add any additional fields which contain your custom parameters. For example, if you want to modify a term query operation that searches for a profession like “physician” to support a variety of professions supply a parameter source field called “custom-term-professions”. Then, add the additional professions as a list of strings ["mechanic", "physician", "nurse"], as shown in the following example:

    ```json
    {
        "name": "term",
        "operation-type": "search",
        "param-source": "my-custom-term-param-source"
        "professions": ["mechanic", "physician", "nurse"]
    }
    ```

3. In `workload.py` add the method or function for your custom parameter sources. The runner expects the parameter sources provided in step 2. The following example makes the workload use the `random_profession()` function for each operation that uses the parameter source `my-custom-term-param-source`. The function requires a `workload`, `params`, and `**kwargs`, a representation of the workload, as shown in the following example:


    ```py
    # In workload.py
    import random

    def random_profession(workload, params, **kwargs):
        # Choose a suitable index. if there is only one defined for this workload.
        # If there is only one defined for this workload, choose that index, but let the user always override index and type.
        if len(workload.indices) == 1:
            default_index = workload.indices[0].name
            if len(worklaod.indices[0].types) == 1:
                default_type = workload.indices[0].types[0].name
            else:
                default_type = None
        else:
            default_index = "_all"
            default_type = None

        index_name = params.get("index", default_index)
        type_name = params.get("type", default_type)

        # Provide all of the parameters the runner expects.
        return {
            "body": {
                "query": {
                    "term": {
                        "body": "%s" % random.choice(params["professions"])
                    }
                }
            },
            "index": index_name,
            "type": type_name,
            "cache": params.get("cache", False)
        }

    def register(registry):
        registry.register_param_source("my-custom-term-param-source", random_profession)
    ```   

4. (Optional) If you want more control over the function, you can add an additional class to `workload.py`, as shown in the following example:

    ```py
    # In workload.py
    import random


    class TermParamSource:
        def __init__(self, workload, params, **kwargs):
            # Choose a suitable index. if there is only one defined for this workload.
            # If there is only one defined for this workload, choose that index, but let the user always override index and type.
            if len(workload.indices) == 1:
                default_index = workload.indices[0].name
                if len(workload.indices[0].types) == 1:
                    default_type = workload.indices[0].types[0].name
                else:
                    default_type = None
            else:
                default_index = "_all"
                default_type = None

            # Resolve these parameters already in the constructor...
            self._index_name = params.get("index", default_index)
            self._type_name = params.get("type", default_type)
            self._cache = params.get("cache", False)
            # ...and also resolve "profession" lazily on each invocation later.
            self._params = params
            # Determines whether this parameter source will be "exhausted" at some point or if Benchmark can infinitely draw values.
            self.infinite = True

        # If multiple clients are using this operation.
        def partition(self, partition_index, total_partitions):
            return self

        def params(self):
            # Provide all parameters the runner expects.
            return {
                "body": {
                    "query": {
                        "term": {
                            "body": "%s" % random.choice(self._params["professions"])
                        }
                    }
                },
                "index": self._index_name,
                "type": self._type_name,
                "cache": self._cache
            }


        def register(registry):
            registry.register_param_source("my-custom-term-param-source", TermParamSource)
    ```

## Registering a custom runner

Use the following steps to register a custom runner.

1. In `operations/default.json`, set the `operation-type` field to a custom runner name. The following example implements the percolator API to an OpenSearch instance:

    ```json
    # In operations/default.json
    {
    "name": "percolator_with_content_google",
    "operation-type": "percolate", # custom runner name
    "body": {
        "doc": {
        "body": "google"
        },
        "track_scores": true
    }
    }
    ```

2. In `workload.py`, add functions that give the runner the ability to perform an OpenSearch API request, providing the parameters that a typical request would use, as shown in the following example:

    ```py
    # In workload.py
    async def percolate(os, params): # os is the OpenSearch python client
        await os.percolate(
                index="queries",
                doc_type="content",
                body=params["body"]
            )

    def register(registry):
        registry.register_runner("percolate", percolate, async_runner=True)
    ```

3. Add the responses that the function can return.  Depending on the cluster status, this runner can return any of the following: 
   -  No response with an assumed `weight` of `1` and assumed `units` as `ops`.
   -  A tuple of weight and units in addition to bulk size and units for bulk operations.
   -  A `dict` with arbitrary keys. When the `dict` contains `weight` and `units`, their definition is assumed to be the same as other options. Any other keys will be placed in the `meta` section of service time and latency metric records.

    ```py
    async def pending_tasks(os, params):
        response = await os.cluster.pending_tasks()
        return {
            "weight": 1,
            "unit": "ops",
            "pending-tasks-count": len(response["tasks"])
        }

    def register(registry):
        registry.register_runner("pending-tasks", pending_tasks, async_runner=True)
    ```    

4. (Optional) If you want more control over the runner, you can add an additional class to `workload.py`, as shown in the following example:

    ```py
    class PercolateRunner:
        async def __call__(self, os, params):
            await os.percolate(
                index="queries",
                doc_type="content",
                body=params["body"]
            )

        def __repr__(self, *args, **kwargs):
            return "percolate"

    def register(registry):
        registry.register_runner("percolate", PercolateRunner(), async_runner=True)
    ```    

