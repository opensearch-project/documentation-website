---
layout: default
title: Significant text
parent: Bucket aggregations
nav_order: 190
redirect_from:
  - /query-dsl/aggregations/bucket/significant-text/
---

# Significant text aggregation

The `significant_text` aggregation identifies unusual or interesting terms in free-text fields by comparing term frequencies in a foreground set (your query results) against a background set (the full index). Unlike [`significant_terms`]({{site.url}}{{site.baseurl}}/aggregations/bucket/significant-terms/), which operates on indexed keyword fields, `significant_text` re-analyzes the source text on the fly and can filter duplicate content that would otherwise skew results.

Use the `significant_text` aggregation in the following scenarios:

- Suggesting related terms that users can add to a search. For example, a search for "bird flu" might suggest "H5N1".
- Finding keywords that characterize a set of documents, for example, to build a document classifier.

The most common words in a set of search results are rarely interesting because they are common everywhere (for example, "and," "of," or "the"). A term is significant when its frequency changes noticeably between the foreground and the background. For example, a term that appears in 4 of the 100 documents in your results but in only 5 of 10 million documents in the index is strongly associated with your search.

Re-analyzing large result sets is CPU intensive. Use `significant_text` inside a [`sampler`]({{site.url}}{{site.baseurl}}/aggregations/bucket/sampler/) or [`diversified_sampler`]({{site.url}}{{site.baseurl}}/aggregations/bucket/diversified-sampler/) aggregation to limit analysis to a small selection of top-matching documents (for example, 100--200).
{: .note}

## Parameters

The `significant_text` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `field` | Required | String | The text field to analyze. |
| `size` | Optional | Integer | The number of term buckets to return. Default is `10`. |
| `shard_size` | Optional | Integer | The number of candidate terms collected from each shard. Higher values improve accuracy at the cost of performance. Default is `-1`, which sets the shard size based on `size`. For more information, see [Size and shard size](#size-and-shard-size). |
| `min_doc_count` | Optional | Integer | The minimum number of documents a term must appear in to be included. Default is `3`. Setting to `1` tends to return typos and misspellings. |
| `shard_min_doc_count` | Optional | Integer | The minimum local shard frequency for a term to be considered as a candidate. Default is `0`. |
| `background_filter` | Optional | Object | A query that narrows the background set used for comparison. By default, the entire index is used as the background. |
| `filter_duplicate_text` | Optional | Boolean | When `true`, filters out sequences of 6 or more tokens that have already been seen, reducing noise from cut-and-paste content. Default is `false`. For more information, see [Filtering duplicate text](#filtering-duplicate-text). |
| `source_fields` | Optional | Array | A list of JSON source field names from which text is analyzed. Use when the indexed field name differs from the source field (for example, with `copy_to`). For more information, see [Analyzing fields created using copy_to](#analyzing-fields-created-using-copy_to). |
| `include` | Optional | String or Array | A regular expression pattern or list of exact terms to include. |
| `exclude` | Optional | String or Array | A regular expression pattern or list of exact terms to exclude from results. |

## Example

The following example assumes a `shakespeare` index containing the complete works of Shakespeare with a `text_entry` text field. The query searches for documents containing "breathe," then uses `significant_text` inside a `sampler` to discover the terms that are most strongly associated with those passages compared to the full corpus:

```json
GET /shakespeare/_search
{
  "size": 0,
  "query": {
    "match": {
      "text_entry": "breathe"
    }
  },
  "aggs": {
    "sample": {
      "sampler": {
        "shard_size": 100
      },
      "aggs": {
        "keywords": {
          "significant_text": {
            "field": "text_entry",
            "min_doc_count": 4
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response identifies terms like "air," "dead," and "life" as significantly associated with passages about breathing:

```json
{
  ...
  "aggregations" : {
    "sample" : {
      "doc_count" : 59,
      "keywords" : {
        "doc_count" : 59,
        "bg_count" : 111396,
        "buckets" : [
          {
            "key" : "breathe",
            "doc_count" : 59,
            "score" : 1887.0677966101694,
            "bg_count" : 59
          },
          {
            "key" : "air",
            "doc_count" : 4,
            "score" : 2.641295376716233,
            "bg_count" : 189
          },
          {
            "key" : "dead",
            "doc_count" : 4,
            "score" : 0.9665839666414213,
            "bg_count" : 495
          },
          {
            "key" : "life",
            "doc_count" : 5,
            "score" : 0.9090787433467572,
            "bg_count" : 805
          }
        ]
      }
    }
  }
}
```

## Example: Narrowing the background with a filter

By default, term frequencies are compared against the entire index. The `background_filter` parameter narrows the comparison set, which can reveal terms that are significant within a specific context. The following example compares "breathe" passages from all plays against only the lines from "Henry IV" rather than the full corpus.

Most significance heuristics assume that the background set contains the foreground set. In this example, the foreground contains lines from every play, but the background contains only Henry IV, so the term `breathe` occurs in 59 foreground documents but only 6 background documents. To score terms correctly in this case, set `background_is_superset` to `false`. The `jlh` heuristic does not support this setting, so the following request uses `chi_square`. With `chi_square`, omitting `background_is_superset: false` causes the request to fail. With the default `jlh` heuristic, the request succeeds, but the scores are calculated incorrectly:

```json
GET /shakespeare/_search
{
  "size": 0,
  "query": {
    "match": {
      "text_entry": "breathe"
    }
  },
  "aggs": {
    "sample": {
      "sampler": {
        "shard_size": 100
      },
      "aggs": {
        "keywords": {
          "significant_text": {
            "field": "text_entry",
            "min_doc_count": 3,
            "background_filter": {
              "term": {
                "play_name": "Henry IV"
              }
            },
            "chi_square": {
              "background_is_superset": false
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

With the background narrowed to the 3,205 lines of Henry IV, the `bg_count` values are smaller, and terms such as `awhile` and `life` are also returned:

```json
{
  ...
  "aggregations": {
    "sample": {
      "doc_count": 59,
      "keywords": {
        "doc_count": 59,
        "bg_count": 3205,
        "buckets": [
          {
            "key": "breathe",
            "doc_count": 59,
            "score": 2957.161281651266,
            "bg_count": 6
          },
          {
            "key": "air",
            "doc_count": 4,
            "score": 121.01928476442328,
            "bg_count": 3
          },
          {
            "key": "dead",
            "doc_count": 4,
            "score": 45.42858478985534,
            "bg_count": 13
          },
          {
            "key": "awhile",
            "doc_count": 3,
            "score": 36.49997548041267,
            "bg_count": 9
          },
          {
            "key": "life",
            "doc_count": 5,
            "score": 29.934089933945792,
            "bg_count": 31
          }
        ]
      }
    }
  }
}
```

## Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `doc_count` | Integer | The number of documents in the sample (at the sampler level) or in the foreground set (at the significant_text level). |
| `bg_count` | Integer | The total number of documents in the background set used for comparison. |
| `buckets` | Array | The significant term buckets, sorted by `score` descending. |
| `buckets.key` | String | The significant term. |
| `buckets.doc_count` | Integer | The number of documents in the foreground set containing this term. |
| `buckets.score` | Double | The significance score representing how much more frequently this term appears in the foreground compared to the background. |
| `buckets.bg_count` | Integer | The number of documents in the background set containing this term. |

## Significance heuristics

By default, significance scores use the JLH heuristic. You can select an alternative scoring algorithm by adding its name as a parameter alongside the `field`. The following heuristics are supported.

| Heuristic | Parameter | Description |
| :--- | :--- | :--- |
| JLH | `jlh: {}` | The default. Measures the relative change in popularity between foreground and background. |
| Mutual information | `mutual_information: {}` | Measures how much information the presence of the term provides about belonging to the foreground set. Supports `include_negatives` and `background_is_superset` options. |
| Chi-square | `chi_square: {}` | A standard statistical test for independence between the term and the foreground set. Supports `include_negatives` and `background_is_superset` options. |
| GND | `gnd: {}` | Google Normalized Distance. Measures the statistical association using co-occurrence ratios. Supports `background_is_superset` option. |
| Percentage | `percentage: {}` | The ratio of foreground to background documents containing the term. Very rare terms can dominate, so consider increasing `min_doc_count`. |
| Scripted | `script_heuristic: {}` | A custom score calculated by a script. The script can use the `_subset_freq`, `_superset_freq`, `_subset_size`, and `_superset_size` parameters. |

For a comparison of how the heuristics differ, see [Choosing a heuristic]({{site.url}}{{site.baseurl}}/aggregations/bucket/significant-terms/#choosing-a-heuristic).

The following example uses chi-square scoring instead of the default JLH:

```json
GET /shakespeare/_search
{
  "size": 0,
  "query": {
    "match": {
      "text_entry": "breathe"
    }
  },
  "aggs": {
    "sample": {
      "sampler": {
        "shard_size": 100
      },
      "aggs": {
        "keywords": {
          "significant_text": {
            "field": "text_entry",
            "min_doc_count": 4,
            "chi_square": {}
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response shows that the same terms are identified but the score scale is different:

```json
{
  ...
  "aggregations" : {
    "sample" : {
      "doc_count" : 59,
      "keywords" : {
        "doc_count" : 59,
        "bg_count" : 111396,
        "buckets" : [
          {
            "key" : "breathe",
            "doc_count" : 59,
            "score" : 111396.0,
            "bg_count" : 59
          },
          {
            "key" : "air",
            "doc_count" : 4,
            "score" : 152.27540220402065,
            "bg_count" : 189
          },
          {
            "key" : "dead",
            "doc_count" : 4,
            "score" : 53.556852313941825,
            "bg_count" : 495
          },
          {
            "key" : "life",
            "doc_count" : 5,
            "score" : 49.44532193700098,
            "bg_count" : 805
          }
        ]
      }
    }
  }
}
```

## Filtering duplicate text

Free-text fields often contain copied text, such as press releases republished by several sites, email reply chains, boilerplate disclaimers, or navigation menus. Rare words in copied text, such as names or product codes, occur together with your search terms in every copy, so they can dominate the results even though they are not meaningful.

To remove this noise at query time, set `filter_duplicate_text` to `true`. As the aggregation analyzes the top-matching documents, it ignores any sequence of 6 or more tokens that it has already seen. Because similar documents tend to rank similarly, this removes most copied passages.

The following examples use a `tech_news` index in which several articles about observability contain the same boilerplate paragraph about an awards jury. Create the index. The `all_text` field is used in the [next section](#analyzing-fields-created-using-copy_to):

```json
PUT tech_news
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "copy_to": "all_text"
      },
      "content": {
        "type": "text",
        "copy_to": "all_text"
      },
      "all_text": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index the following documents:

```json
POST _bulk?refresh
{ "index": { "_index": "tech_news", "_id": "1" } }
{ "title": "Tracing comes to the edge", "content": "New observability agents collect traces from edge devices and forward spans to a central collector." }
{ "index": { "_index": "tech_news", "_id": "2" } }
{ "title": "Startup ships open telemetry pipeline", "content": "The observability startup released a pipeline that converts logs into metrics and traces for dashboards." }
{ "index": { "_index": "tech_news", "_id": "3" } }
{ "title": "Awards shortlist announced", "content": "The observability category of the cloud awards includes three tracing platforms. The awards jury includes Priya Ramaswamy, program director at Northwind Labs, and other industry experts." }
{ "index": { "_index": "tech_news", "_id": "4" } }
{ "title": "Finalists named for cloud awards", "content": "Judges selected observability finalists focused on traces and metrics. The awards jury includes Priya Ramaswamy, program director at Northwind Labs, and other industry experts." }
{ "index": { "_index": "tech_news", "_id": "5" } }
{ "title": "Cloud awards finalists revealed", "content": "Observability vendors with tracing dashboards lead the finalist list. The awards jury includes Priya Ramaswamy, program director at Northwind Labs, and other industry experts." }
{ "index": { "_index": "tech_news", "_id": "6" } }
{ "title": "Award nominees in observability", "content": "Several observability nominees offer metrics and tracing for containers. The awards jury includes Priya Ramaswamy, program director at Northwind Labs, and other industry experts." }
{ "index": { "_index": "tech_news", "_id": "7" } }
{ "title": "Metrics at scale", "content": "An observability team explains how it stores billions of metrics and traces per day." }
{ "index": { "_index": "tech_news", "_id": "8" } }
{ "title": "Quarterly earnings beat estimates", "content": "The retailer reported higher revenue and raised its forecast for the year." }
{ "index": { "_index": "tech_news", "_id": "9" } }
{ "title": "New phone launches", "content": "The manufacturer released a phone with a larger battery and a faster camera." }
{ "index": { "_index": "tech_news", "_id": "10" } }
{ "title": "City approves bike lanes", "content": "The council voted to add protected bike lanes downtown." }
{ "index": { "_index": "tech_news", "_id": "11" } }
{ "title": "Chip shortage eases", "content": "Suppliers report shorter lead times for processors and memory." }
{ "index": { "_index": "tech_news", "_id": "12" } }
{ "title": "Streaming service raises prices", "content": "Subscribers will pay more for the ad-free plan starting next month." }
{ "index": { "_index": "tech_news", "_id": "13" } }
{ "title": "Database release adds vector search", "content": "The new database version adds vector search and faster joins." }
{ "index": { "_index": "tech_news", "_id": "14" } }
{ "title": "Electric trucks enter service", "content": "A logistics company added electric trucks to its delivery fleet." }
{ "index": { "_index": "tech_news", "_id": "15" } }
{ "title": "Weather disrupts flights", "content": "Storms delayed hundreds of flights across the region." }
{ "index": { "_index": "tech_news", "_id": "16" } }
{ "title": "Robotics firm raises funding", "content": "The company will use the funding to expand warehouse automation." }
{ "index": { "_index": "tech_news", "_id": "17" } }
{ "title": "Programming language update", "content": "The release improves compile times and adds pattern matching." }
```
{% include copy-curl.html %}

The following request finds the significant terms in articles about observability without filtering duplicate text:

```json
GET tech_news/_search
{
  "size": 0,
  "query": {
    "match": {
      "content": "observability"
    }
  },
  "aggs": {
    "sample": {
      "sampler": {
        "shard_size": 100
      },
      "aggs": {
        "keywords": {
          "significant_text": {
            "field": "content"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Most of the returned terms, such as `priya`, `ramaswamy`, `labs`, and `director`, come from the copied jury paragraph:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "aggregations": {
    "sample": {
      "doc_count": 7,
      "keywords": {
        "doc_count": 7,
        "bg_count": 17,
        "buckets": [
          {
            "key": "observability",
            "doc_count": 7,
            "score": 1.4285714285714288,
            "bg_count": 7
          },
          {
            "key": "ramaswamy",
            "doc_count": 4,
            "score": 0.8163265306122448,
            "bg_count": 4
          },
          {
            "key": "priya",
            "doc_count": 4,
            "score": 0.8163265306122448,
            "bg_count": 4
          },
          {
            "key": "director",
            "doc_count": 4,
            "score": 0.8163265306122448,
            "bg_count": 4
          },
          {
            "key": "traces",
            "doc_count": 4,
            "score": 0.8163265306122448,
            "bg_count": 4
          },
          {
            "key": "includes",
            "doc_count": 4,
            "score": 0.8163265306122448,
            "bg_count": 4
          },
          {
            "key": "program",
            "doc_count": 4,
            "score": 0.8163265306122448,
            "bg_count": 4
          },
          {
            "key": "at",
            "doc_count": 4,
            "score": 0.8163265306122448,
            "bg_count": 4
          },
          {
            "key": "labs",
            "doc_count": 4,
            "score": 0.8163265306122448,
            "bg_count": 4
          },
          {
            "key": "metrics",
            "doc_count": 4,
            "score": 0.8163265306122448,
            "bg_count": 4
          }
        ]
      }
    }
  }
}
```
</details>

The following request sets `filter_duplicate_text` to `true`:

```json
GET tech_news/_search
{
  "size": 0,
  "query": {
    "match": {
      "content": "observability"
    }
  },
  "aggs": {
    "sample": {
      "sampler": {
        "shard_size": 100
      },
      "aggs": {
        "keywords": {
          "significant_text": {
            "field": "content",
            "filter_duplicate_text": true
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The copied paragraph is counted only once, so its terms no longer reach the default `min_doc_count` of `3`. The remaining terms, such as `traces`, `metrics`, and `tracing`, describe the topic of the articles:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "aggregations": {
    "sample": {
      "doc_count": 7,
      "keywords": {
        "doc_count": 7,
        "bg_count": 17,
        "buckets": [
          {
            "key": "observability",
            "doc_count": 7,
            "score": 1.4285714285714288,
            "bg_count": 7
          },
          {
            "key": "traces",
            "doc_count": 4,
            "score": 0.8163265306122448,
            "bg_count": 4
          },
          {
            "key": "metrics",
            "doc_count": 4,
            "score": 0.8163265306122448,
            "bg_count": 4
          },
          {
            "key": "tracing",
            "doc_count": 3,
            "score": 0.6122448979591836,
            "bg_count": 3
          },
          {
            "key": "and",
            "doc_count": 6,
            "score": 0.18367346938775497,
            "bg_count": 12
          }
        ]
      }
    }
  }
}
```
</details>

If you can identify duplicate documents using a single-valued field, such as a hash of the article text or the URL of an original press release, use a [`diversified_sampler`]({{site.url}}{{site.baseurl}}/aggregations/bucket/diversified-sampler/) parent aggregation to remove the duplicates from the sample instead. Removing duplicate documents before analysis is more efficient than filtering duplicate text during analysis.

## Analyzing fields created using copy_to

The `significant_text` aggregation reads text from the document `_source`. Usually, the indexed field and the source field have the same name. If the field is populated using [`copy_to`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/copy-to/), it does not exist in the `_source`, so the aggregation returns no buckets. To analyze such a field, list the source fields that contain its text in `source_fields`.

In the `tech_news` index, the `title` and `content` fields are copied to `all_text`. The following request searches `all_text` and analyzes the text of the `title` and `content` source fields:

```json
GET tech_news/_search
{
  "size": 0,
  "query": {
    "match": {
      "all_text": "observability"
    }
  },
  "aggs": {
    "sample": {
      "sampler": {
        "shard_size": 100
      },
      "aggs": {
        "keywords": {
          "significant_text": {
            "field": "all_text",
            "source_fields": [
              "title",
              "content"
            ]
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains significant terms from both the titles and the content:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "aggregations": {
    "sample": {
      "doc_count": 7,
      "keywords": {
        "doc_count": 7,
        "bg_count": 17,
        "buckets": [
          {
            "key": "observability",
            "doc_count": 7,
            "score": 1.4285714285714288,
            "bg_count": 7
          },
          {
            "key": "at",
            "doc_count": 5,
            "score": 1.0204081632653061,
            "bg_count": 5
          },
          {
            "key": "director",
            "doc_count": 4,
            "score": 0.8163265306122448,
            "bg_count": 4
          },
          {
            "key": "tracing",
            "doc_count": 4,
            "score": 0.8163265306122448,
            "bg_count": 4
          },
          {
            "key": "includes",
            "doc_count": 4,
            "score": 0.8163265306122448,
            "bg_count": 4
          },
          {
            "key": "traces",
            "doc_count": 4,
            "score": 0.8163265306122448,
            "bg_count": 4
          },
          {
            "key": "ramaswamy",
            "doc_count": 4,
            "score": 0.8163265306122448,
            "bg_count": 4
          },
          {
            "key": "priya",
            "doc_count": 4,
            "score": 0.8163265306122448,
            "bg_count": 4
          },
          {
            "key": "program",
            "doc_count": 4,
            "score": 0.8163265306122448,
            "bg_count": 4
          },
          {
            "key": "labs",
            "doc_count": 4,
            "score": 0.8163265306122448,
            "bg_count": 4
          }
        ]
      }
    }
  }
}
```
</details>

## Size and shard size

The `size` parameter controls how many buckets the aggregation returns. Each shard first selects candidate terms using local statistics, and the coordinating node merges the candidates into the final list. Because a shard cannot know the global frequency of a term, the merged list can miss terms or contain slightly inaccurate counts.

By default (`shard_size` is `-1`), each shard returns `2 * (size * 1.5 + 10)` candidate terms. Low-frequency terms can turn out to be the most significant once all results are combined, so setting `shard_size` much higher than `size` can improve the results, at the cost of more memory usage and network traffic.

## Minimum document count

The `min_doc_count` parameter excludes terms that occur in fewer than the specified number of foreground documents. The default value of `3` requires some evidence that a term is meaningful: a term found in only one document is often a typo or another one-time occurrence.

The `min_doc_count` threshold is applied only after the shard results are merged. Each shard selects candidates based on its local scores, so low-frequency terms with high local scores can take the place of terms that would have met `min_doc_count` globally. To return these terms, increase `shard_size`.

The `shard_min_doc_count` parameter filters candidates on each shard before they are sent to the coordinating node. Use it to discard terms, such as misspellings, that are unlikely to reach `min_doc_count`. Set `shard_min_doc_count` well below `min_doc_count` divided by the number of shards. Otherwise, significant terms can be filtered out on individual shards.

## Using significant text results

Significant terms from free text are often most useful as input to another query. The following patterns are common:

- Find miscategorized documents: Search a structured field for one category, run `significant_text` on a free-text field, and then search for documents that are not in that category but contain the significant terms. The results are documents that might belong in the original category.
- Rank the matching documents: Use the score of each significant term as a `boost` value when you search for the terms. To balance precision and recall, set `minimum_should_match` in the follow-up query. A high value returns fewer documents that contain many of the terms, while a value of `1` returns every document that contains any of the terms.
- Show the terms in context: Significant terms are easier to interpret when readers can see where they occur. Search for the terms in the same field and add a [`highlight`]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/highlight/) clause to return snippets that show each term with its surrounding text.

## Limitations

The `significant_text` aggregation has the following limitations:

- Does not support child aggregations because of high memory cost. To analyze specific terms further, run a separate query with a `terms` aggregation and an `include` clause containing the significant terms from the initial results.
- Does not support nested objects because it works with the document JSON source.
- Document counts are approximate. A `doc_count` value can be too low if some shards did not return the term among their candidates, and a `bg_count` value can be too high because background counts can include deleted documents. To improve accuracy, increase `shard_size`. For more information, see [Size and shard size](#size-and-shard-size).
