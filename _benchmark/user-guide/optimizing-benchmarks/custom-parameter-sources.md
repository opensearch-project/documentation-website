---
layout: default
title: Custom parameter sources 
nav_order: 120
parent: Optimizing benchmarks
grand_parent: User guide
---

# Adding custom parameter sources 

A **parameter source** is a source outside of OpenSearch Benchmark that provides parameters to an operation. 

The `register_param_source` setting provides custom parameters for an operation. To use the `register_param_source` setting, use the following steps to modify `operations/default.json` and `workloads.py`.

Adding custom parameters sources and runners modifies performance critical paths in OpenSearch Benchmark and therefore can lead to performance bottlenecks during texting. Carefully consider these changes before making them.
{: .warning}


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

