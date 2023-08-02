---
layout: default
title: Handling pipeline failures
parent: Ingest pipelines
grand_parent: Ingest APIs
nav_order: 15
---

## Handling pipeline failures

Each ingest pipeline consists of a series of processors that are applied to the data in sequence. If a processor fails, the entire pipeline will fail. You have two options for handling failures:

- **Fail the entire pipeline:** If a processor fails, the entire pipeline will fail and the document will not be indexed.
- **Fail the current processor and continue with the next processor:** This can be useful if you want to continue processing the document even if one of the processors fails.

By default, an ingest pipeline stops if one of its processors fails. If you want the pipeline to continue running when a processor fails, you can set the `ignore_failure` parameter for that processor to `true` when creating the pipeline:

```json
{
  "description" : "A simple ingest pipeline",
  "processors" : [
    {
      "set" : {
        "field": "name",
        "value": "user_id"
      }
    }
  ],
  "ignore_failure" : true
}
```

The following JSON object configures `set-pipeline` to fail the current processor and continue with the next processor:

```json
{
  "description" : "A simple ingest pipeline",
  "processors" : [
    {
      "set" : {
        "field": "name",
        "value": "user_id"
      }
    }
  ],
  "ignore_failure" : "continue"
}
```

If the processor fails, OpenSearch logs the failure and continues to run all remaining processors in the search pipeline. To check whether there were any failures, you can use [ingest pipeline metrics].

## Ingest pipeline metrics

To view ingest pipeline metrics, use the [Nodes Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/):

```
GET /_nodes/stats/ingest
```

## Troubleshooting failures

The following are tips on troubleshooting ingest pipeline failures:

1. Check the logs: OpenSeach logs contain information about the ingest pipeline that failed, including the processor that failed and the reason for the failure.
2. Inspect the document: If the ingest pipeline failed, then the document that was being processed will be in the <insert-name> index. 
3. Check the processor configuration: It is possible the processor configuration is incorrect. To check this you can look at the processor configuration in the JSON object.
4. Try a different processor: You can try using a different processor. Some processors are better at handling certain types of data than others.
