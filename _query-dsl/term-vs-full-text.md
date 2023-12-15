---
layout: default
title: Term-level and full-text queries compared
nav_order: 10
redirect_from:
- /query-dsl/query-dsl/term-vs-full-text
---

# Term-level and full-text queries compared

You can use both term-level and full-text queries to search text, but while term-level queries are usually used to search structured data, full-text queries are used for full-text search. The main difference between term-level and full-text queries is that term-level queries search documents for an exact specified term, while full-text queries analyze the query string. The following table summarizes the differences between term-level and full-text queries.

| | Term-level queries | Full-text queries
:--- | :--- | :---
*Description* | Term-level queries answer which documents match a query. | Full-text queries answer how well the documents match a query.
*Analyzer* | The search term isn't analyzed. This means that the term query searches for your search term as it is.  | The search term is analyzed by the same analyzer that was used for the specific document field at the time it was indexed. This means that your search term goes through the same analysis process as the document's field.
*Relevance* | Term-level queries simply return documents that match without sorting them based on the relevance score. They still calculate the relevance score, but this score is the same for all the documents that are returned. | Full-text queries calculate a relevance score for each match and sort the results by decreasing order of relevance.
*Use Case* | Use term-level queries when you want to match exact values such as numbers, dates, or tags and don't need the matches to be sorted by relevance. | Use full-text queries to match text fields and sort by relevance after taking into account factors like casing and stemming variants.

OpenSearch uses the BM25 ranking algorithm to calculate relevance scores. To learn more, see [Okapi BM25](https://en.wikipedia.org/wiki/Okapi_BM25).
{: .note }

## Should I use a full-text or a term-level query?

To clarify the difference between full-text and term-level queries, consider the following two examples that search for a specific text phrase. The complete works of Shakespeare are indexed in an OpenSearch cluster.

### Example: Phrase search

In this example, you'll search the complete works of Shakespeare for the phrase "To be, or not to be" in the `text_entry` field. 

First, use a **term-level query** for this search:

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "text_entry": "To be, or not to be"
    }
  }
}
```

The response contains no matches, indicated by zero `hits`:

```json
{
  "took" : 3,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 0,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  }
}
```

This is because the term “To be, or not to be” is searched literally in the inverted index, where only the analyzed values of the text fields are stored. Term-level queries aren’t suited for searching analyzed text fields because they often yield unexpected results. When working with text data, use term-level queries only for fields mapped as `keyword`.

Now search for the same phrase using a **full-text query**:

```json
GET shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": "To be, or not to be"
    }
  }
}
```

The search query “To be, or not to be” is analyzed and tokenized into an array of tokens just like the `text_entry` field of the documents. The full-text query takes an intersection of tokens between the search query and the `text_entry` fields for all the documents, and then sorts the results by relevance score:

```json
{
  "took" : 19,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 10000,
      "relation" : "gte"
    },
    "max_score" : 17.419369,
    "hits" : [
      {
        "_index" : "shakespeare",
        "_id" : "34229",
        "_score" : 17.419369,
        "_source" : {
          "type" : "line",
          "line_id" : 34230,
          "play_name" : "Hamlet",
          "speech_number" : 19,
          "line_number" : "3.1.64",
          "speaker" : "HAMLET",
          "text_entry" : "To be, or not to be: that is the question:"
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "109930",
        "_score" : 14.883024,
        "_source" : {
          "type" : "line",
          "line_id" : 109931,
          "play_name" : "A Winters Tale",
          "speech_number" : 23,
          "line_number" : "4.4.153",
          "speaker" : "PERDITA",
          "text_entry" : "Not like a corse; or if, not to be buried,"
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "103117",
        "_score" : 14.782743,
        "_source" : {
          "type" : "line",
          "line_id" : 103118,
          "play_name" : "Twelfth Night",
          "speech_number" : 53,
          "line_number" : "1.3.95",
          "speaker" : "SIR ANDREW",
          "text_entry" : "will not be seen; or if she be, its four to one"
        }
      }
    ]
  }
}
...
```

For a list of all full-text queries, see [Full-text queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text/index).

### Example: Exact term search

If you want to search for an exact term like “HAMLET” in the `speaker` field and don't need the results to be sorted by relevance score, a term-level query is more efficient:

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "speaker": "HAMLET"
    }
  }
}
```

The response contains document matches:

```json
{
  "took" : 5,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1582,
      "relation" : "eq"
    },
    "max_score" : 4.2540946,
    "hits" : [
      {
        "_index" : "shakespeare",
        "_id" : "32700",
        "_score" : 4.2540946,
        "_source" : {
          "type" : "line",
          "line_id" : 32701,
          "play_name" : "Hamlet",
          "speech_number" : 9,
          "line_number" : "1.2.66",
          "speaker" : "HAMLET",
          "text_entry" : "[Aside]  A little more than kin, and less than kind."
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "32702",
        "_score" : 4.2540946,
        "_source" : {
          "type" : "line",
          "line_id" : 32703,
          "play_name" : "Hamlet",
          "speech_number" : 11,
          "line_number" : "1.2.68",
          "speaker" : "HAMLET",
          "text_entry" : "Not so, my lord; I am too much i' the sun."
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "32709",
        "_score" : 4.2540946,
        "_source" : {
          "type" : "line",
          "line_id" : 32710,
          "play_name" : "Hamlet",
          "speech_number" : 13,
          "line_number" : "1.2.75",
          "speaker" : "HAMLET",
          "text_entry" : "Ay, madam, it is common."
        }
      }
    ]
  }
}
...
```

The term-level queries provide exact matches. So if you search for “Hamlet”, you don’t receive any matches, because “HAMLET” is a keyword field and is stored in OpenSearch literally and not in an analyzed form.
The search query “HAMLET” is also searched literally. So to get a match for this field, we need to enter the exact same characters.
