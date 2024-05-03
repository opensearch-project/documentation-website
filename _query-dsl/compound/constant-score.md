---
layout: default
title: Constant score
parent: Compound queries
grand_parent: Query DSL
nav_order: 40
redirect_from:
  - /query-dsl/query-dsl/compound/constant-score/
---

# Constant score query

If you need to return documents that contain a certain word regardless of how many times the word appears, you can use a `constant_score` query. A `constant_score` query wraps a filter query and assigns all documents in the results a relevance score equal to the value of the `boost` parameter. Thus, all returned documents have an equal relevance score, and term frequency/inverse document frequency (TF/IDF) is not considered. Filter queries do not calculate relevance scores. Further, OpenSearch caches frequently used filter queries to improve performance. 

## Example

Use the following query to return documents that contain the word "Hamlet" in the `shakespeare` index:

```json
GET shakespeare/_search
{
  "query": {
    "constant_score": {
      "filter": {
        "match": {
          "text_entry": "Hamlet"
        }
      },
      "boost": 1.2
    }
  }
}
```
{% include copy-curl.html %}

All documents in the results are assigned a relevance score of 1.2:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta }

```json
{
  "took": 8,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 96,
      "relation": "eq"
    },
    "max_score": 1.2,
    "hits": [
      {
        "_index": "shakespeare",
        "_id": "32535",
        "_score": 1.2,
        "_source": {
          "type": "line",
          "line_id": 32536,
          "play_name": "Hamlet",
          "speech_number": 48,
          "line_number": "1.1.97",
          "speaker": "HORATIO",
          "text_entry": "Dared to the combat; in which our valiant Hamlet--"
        }
      },
      {
        "_index": "shakespeare",
        "_id": "32546",
        "_score": 1.2,
        "_source": {
          "type": "line",
          "line_id": 32547,
          "play_name": "Hamlet",
          "speech_number": 48,
          "line_number": "1.1.108",
          "speaker": "HORATIO",
          "text_entry": "His fell to Hamlet. Now, sir, young Fortinbras,"
        }
      },
      {
        "_index": "shakespeare",
        "_id": "32625",
        "_score": 1.2,
        "_source": {
          "type": "line",
          "line_id": 32626,
          "play_name": "Hamlet",
          "speech_number": 59,
          "line_number": "1.1.184",
          "speaker": "HORATIO",
          "text_entry": "Unto young Hamlet; for, upon my life,"
        }
      },
      {
        "_index": "shakespeare",
        "_id": "32633",
        "_score": 1.2,
        "_source": {
          "type": "line",
          "line_id": 32634,
          "play_name": "Hamlet",
          "speech_number": 60,
          "line_number": "",
          "speaker": "MARCELLUS",
          "text_entry": "Enter KING CLAUDIUS, QUEEN GERTRUDE, HAMLET,  POLONIUS, LAERTES, VOLTIMAND, CORNELIUS, Lords, and Attendants"
        }
      },
      {
        "_index": "shakespeare",
        "_id": "32634",
        "_score": 1.2,
        "_source": {
          "type": "line",
          "line_id": 32635,
          "play_name": "Hamlet",
          "speech_number": 1,
          "line_number": "1.2.1",
          "speaker": "KING CLAUDIUS",
          "text_entry": "Though yet of Hamlet our dear brothers death"
        }
      },
      {
        "_index": "shakespeare",
        "_id": "32699",
        "_score": 1.2,
        "_source": {
          "type": "line",
          "line_id": 32700,
          "play_name": "Hamlet",
          "speech_number": 8,
          "line_number": "1.2.65",
          "speaker": "KING CLAUDIUS",
          "text_entry": "But now, my cousin Hamlet, and my son,--"
        }
      },
      {
        "_index": "shakespeare",
        "_id": "32703",
        "_score": 1.2,
        "_source": {
          "type": "line",
          "line_id": 32704,
          "play_name": "Hamlet",
          "speech_number": 12,
          "line_number": "1.2.69",
          "speaker": "QUEEN GERTRUDE",
          "text_entry": "Good Hamlet, cast thy nighted colour off,"
        }
      },
      {
        "_index": "shakespeare",
        "_id": "32723",
        "_score": 1.2,
        "_source": {
          "type": "line",
          "line_id": 32724,
          "play_name": "Hamlet",
          "speech_number": 16,
          "line_number": "1.2.89",
          "speaker": "KING CLAUDIUS",
          "text_entry": "Tis sweet and commendable in your nature, Hamlet,"
        }
      },
      {
        "_index": "shakespeare",
        "_id": "32754",
        "_score": 1.2,
        "_source": {
          "type": "line",
          "line_id": 32755,
          "play_name": "Hamlet",
          "speech_number": 17,
          "line_number": "1.2.120",
          "speaker": "QUEEN GERTRUDE",
          "text_entry": "Let not thy mother lose her prayers, Hamlet:"
        }
      },
      {
        "_index": "shakespeare",
        "_id": "32759",
        "_score": 1.2,
        "_source": {
          "type": "line",
          "line_id": 32760,
          "play_name": "Hamlet",
          "speech_number": 19,
          "line_number": "1.2.125",
          "speaker": "KING CLAUDIUS",
          "text_entry": "This gentle and unforced accord of Hamlet"
        }
      }
    ]
  }
}
```
</details>

## Parameters

The following table lists all top-level parameters supported by `constant_score `queries.

Parameter | Description
:--- | :---
`filter` | The filter query that a document must match to be returned in the results. Required.
`boost` | A floating-point value that is assigned as the relevance score to all returned documents. Optional. Default is 1.0.