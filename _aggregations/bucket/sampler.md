---
layout: default
title: Sampler
parent: Bucket aggregations
nav_order: 170
redirect_from:
  - /query-dsl/aggregations/bucket/sampler/
---

# Sampler aggregation

The `sampler` aggregation limits subaggregation processing to the top-scoring documents on each shard. This narrows the focus to the most relevant matches rather than processing the entire result set, which reduces computation time and can improve the quality of aggregation results by excluding low-relevance documents from the long tail.

Sampling is particularly valuable with subaggregations like `significant_terms`. Without a sampler, the full result set includes a long tail of marginally relevant documents whose generic terms dominate by volume, obscuring the truly distinctive terms found in top-scoring matches.

For diversity-based sampling that prevents any single field value from dominating the sample, see the [`diversified_sampler` aggregation]({{site.url}}{{site.baseurl}}/aggregations/bucket/diversified-sampler/).

## Parameters

The `sampler` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `shard_size` | Optional | Integer | The maximum number of top-scoring documents collected from each shard. Default is `100`. |

The `sampler` aggregation can be nested under a `terms` aggregation. If the `terms` aggregation uses the `breadth_first` collect mode, OpenSearch replays the relevance scores of the deferred documents, so the sample is still based on the top-scoring documents.
{: .note}

## Example: Sampling the top-scoring documents

The following examples use a `shakespeare` index containing the complete works of Shakespeare, in which each document is one line of a play. The `text_entry` field contains the text of the line, and the `play_name` field is a `keyword` field.

A query for `king falstaff` matches 1,545 lines. Most of them contain only the common word `king`, but the lines that also contain the rarer word `falstaff` receive the highest scores. The following request samples the 100 top-scoring lines on each shard and runs a `significant_terms` subaggregation to find the plays that are most associated with the sample:

```json
GET /shakespeare/_search
{
  "size": 0,
  "query": {
    "match": {
      "text_entry": "king falstaff"
    }
  },
  "aggs": {
    "sample": {
      "sampler": {
        "shard_size": 100
      },
      "aggs": {
        "plays": {
          "significant_terms": {
            "field": "play_name",
            "size": 3
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The sample contains 100 lines, and the most significant plays are *The Merry Wives of Windsor* and *Henry IV*, the plays in which Falstaff appears:

```json
{
  ...
  "aggregations": {
    "sample": {
      "doc_count": 100,
      "plays": {
        "doc_count": 100,
        "bg_count": 111396,
        "buckets": [
          {
            "key": "Merry Wives of Windsor",
            "doc_count": 41,
            "score": 6.2045063935005285,
            "bg_count": 2831
          },
          {
            "key": "Henry IV",
            "doc_count": 31,
            "score": 3.0301421528861154,
            "bg_count": 3205
          },
          {
            "key": "Hamlet",
            "doc_count": 6,
            "score": 0.03449236569274269,
            "bg_count": 4244
          }
        ]
      }
    }
  }
}
```

## Example: Running the aggregation without a sampler

The following request runs the same `significant_terms` aggregation on all 1,545 matching lines, without a sampler:

```json
GET /shakespeare/_search
{
  "size": 0,
  "query": {
    "match": {
      "text_entry": "king falstaff"
    }
  },
  "aggs": {
    "plays": {
      "significant_terms": {
        "field": "play_name",
        "size": 3
      }
    }
  }
}
```
{% include copy-curl.html %}

Because the long tail of lines that contain only `king` outweighs the Falstaff lines, the most significant plays are the history plays about kings, such as *Henry VI, Part 3* and *Richard II*. The aggregation also processes all 1,545 matching documents instead of 100:

```json
{
  ...
  "aggregations": {
    "plays": {
      "doc_count": 1545,
      "bg_count": 111396,
      "buckets": [
        {
          "key": "Henry VI Part 3",
          "doc_count": 168,
          "score": 0.31100010146873747,
          "bg_count": 3138
        },
        {
          "key": "Richard II",
          "doc_count": 143,
          "score": 0.23236659237692917,
          "bg_count": 2937
        },
        {
          "key": "Henry VI Part 2",
          "doc_count": 125,
          "score": 0.13780305490414782,
          "bg_count": 3334
        }
      ]
    }
  }
}
```

## Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `doc_count` | Integer | The total number of documents in the sample across all shards. |
