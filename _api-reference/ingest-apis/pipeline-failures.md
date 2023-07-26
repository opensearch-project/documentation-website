---
layout: default
title: Handling pipeline failures
parent: Ingest pipelines
grand_parent: Ingest APIs
nav_order: 15
---

## Handling pipeline failures

Each ingest pipeline consists of a series of processors that are applied to the data in sequence. If a processor fails, the entire pipeline will fail. The are two ways to handle failures:

- **Fail the entire pipeline:** This is the default behavior. If a processor fails, the entire pipeline will fail and the document will not be indexed.
- **Fail the current processor and continue with the next processor:** This can be useful if you want to continue processing the document even if one of the processors fails.

To configure the failure handling behavior, you need to use the `<insert-parameter-name>` parameter. For example, the following JSON object configures the `set-pipeline` to fail the entire pipeline if a processor fails:

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
  "<parameter-name>" : "fail"
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
  "<parameter-name>" : "continue"
}
```

## Troubleshooting failures

The following are tips on troubleshooting ingest pipeline failures:

1. Check the logs: OpenSeach logs contain information about the ingest pipeline that failed, including the processor that failed and the reason for the failure.
2. Inspect the document: If the ingest pipeline failed, then the document that was being processed will be in the <insert-name> index. 
3. Check the processor configuration: It is possible the processor configuration is incorrect. To check this you can look at the processor configuration in the JSON object.
4. Try a different processor: You can try using a different processor. Some processors are better at handling certain types of data than others.
