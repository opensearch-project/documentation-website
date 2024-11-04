---
layout: default
title: Custom runners
nav_order: 130
parent: Optimizing benchmarks
grand_parent: User guide
---

# Adding custom runners

**Runners** are operation types performed on an OpenSearch cluster. You can add customer runners for operations that don't already exist in a workload.

To add custom runners, use the following steps.

Adding custom runners modifies performance critical paths in OpenSearch Benchmark and therefore can lead to performance bottlenecks during texting. Carefully consider these changes before making them.
{: .warning}

1. In `operations/default.json`, set the `operation-type` field to a custom runner name. The following example implements the percolator API to an OpenSearch instance:

    ```json
    # In operations/default.json
    {
    "name": "terms_for_movie_titles",
    "operation-type": "terms", # custom runner name
    "body": {
        "doc": {
        "body": "movies"
        },
        "track_scores": true
    }
    }
    ```

2. In `workload.py`, add functions that give the runner the ability to perform an OpenSearch API request, providing the parameters that a typical request would use, as shown in the following example:

    ```py
    # In workload.py
    async def terms(os, params): # os is the OpenSearch python client
        await os.terms(
                index="queries",
                doc_type="content",
                body=params["body"]
            )

    def register(registry):
        registry.register_runner("terms", terms, async_runner=True)
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
    class TermsRunner:
        async def __call__(self, os, params):
            await os.terms(
                index="queries",
                doc_type="content",
                body=params["body"]
            )

        def __repr__(self, *args, **movies):
            return "terms"

    def register(registry):
        registry.register_runner("terms", TermsRunner(), async_runner=True)
    ```    

