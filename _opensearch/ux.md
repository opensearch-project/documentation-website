---
layout: default
title: Search experience
nav_order: 55
canonical_url: https://docs.opensearch.org/latest/search-plugins/searching-data/index/
---

# Search experience

Expectations from search engines have evolved over the years. Just returning relevant results quickly is no longer enough for most users. OpenSearch includes many features that enhance the user’s search experience as follows:

Feature | Description
:--- | :---
Autocomplete queries | Suggest phrases as the user types.
Paginate results |  Rather than a single, long list, break search results into pages.
Scroll search | Return a large number of results in batches.
Sort results | Allow sorting results by different criteria.
Highlight query matches | Highlight the search term in the results.

---

## Autocomplete queries

Autocomplete shows suggestions to users while they type.

For example, if a user types "pop," OpenSearch provides suggestions like "popcorn" or "popsicles." These suggestions preempt your user's intention and lead them to a possible search term more quickly.

OpenSearch lets you design autocomplete that updates with each keystroke, provides a few relevant suggestions, and tolerates typos.

Implement autocomplete using one of three methods:

- Prefix matching
- Edge N-gram matching
- Completion suggesters

These methods are described in the following sections.

### Prefix matching

Prefix matching finds documents that matches the last term in the query string.

For example, assume that the user types “qui” into a search UI. To autocomplete this phrase, use the `match_phrase_prefix` query to search all `text_entry` fields that begin with the prefix "qui."
To make the word order and relative positions flexible, specify a `slop` value. To learn about the `slop` option, see [Options]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text#options).

#### Sample Request

```json
GET shakespeare/_search
{
  "query": {
    "match_phrase_prefix": {
      "text_entry": {
        "query": "qui",
        "slop": 3
      }
    }
  }
}
```

Prefix matching doesn’t require any special mappings. It works with your data as-is.
However, it’s a fairly resource-intensive operation. A prefix of `a` could match hundreds of thousands of terms and not be useful to your user.
To limit the impact of prefix expansion, set `max_expansions` to a reasonable number. To learn about the `max_expansions` option, see [Options]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text#options).

#### Sample Request

```json
GET shakespeare/_search
{
  "query": {
    "match_phrase_prefix": {
      "text_entry": {
        "query": "qui",
        "slop": 3,
        "max_expansions": 10
      }
    }
  }
}
```

The ease of implementing query-time autocomplete comes at the cost of performance.
When implementing this feature on a large scale, we recommend an index-time solution. With an index-time solution, you might experience slower indexing, but it’s a price you pay only once and not for every query. The edge N-gram and completion suggester methods are index time.

### Edge N-gram matching

During indexing, edge N-grams chop up a word into a sequence of N characters to support a faster lookup of partial search terms.

If you N-gram the word "quick," the results depend on the value of N.

N | Type | N-gram
:--- | :--- | :---
1 | Unigram | [ `q`, `u`, `i`, `c`, `k` ]
2 | Bigram | [ `qu`, `ui`, `ic`, `ck` ]
3 | Trigram | [ `qui`, `uic`, `ick` ]
4 | Four-gram | [ `quic`, `uick` ]
5 | Five-gram | [ `quick` ]

Autocomplete needs only the beginning N-grams of a search phrase, so OpenSearch uses a special type of N-gram called edge N-gram.

Edge N-gramming the word "quick" results in the following:

- `q`
- `qu`
- `qui`
- `quic`
- `quick`

This follows the same sequence the user types.

To configure a field to use edge N-grams, create an autocomplete analyzer with an `edge_ngram` filter:

#### Sample Request

```json
PUT shakespeare
{
  "mappings": {
    "properties": {
      "text_entry": {
        "type": "text",
        "analyzer": "autocomplete"
      }
    }
  },
  "settings": {
    "analysis": {
      "filter": {
        "edge_ngram_filter": {
          "type": "edge_ngram",
          "min_gram": 1,
          "max_gram": 20
        }
      },
      "analyzer": {
        "autocomplete": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "edge_ngram_filter"
          ]
        }
      }
    }
  }
}
```

This example creates the index and instantiates the edge N-gram filter and analyzer.

The `edge_ngram_filter` produces edge N-grams with a minimum N-gram length of 1 (a single letter) and a maximum length of 20. So it offers suggestions for words of up to 20 letters.

The `autocomplete` analyzer tokenizes a string into individual terms, lowercases the terms, and then produces edge N-grams for each term using the `edge_ngram_filter`.

Use the `analyze` operation to test this analyzer:

```json
POST shakespeare/_analyze
{
  "analyzer": "autocomplete",
  "text": "quick"
}
```

It returns edge N-grams as tokens:

* `q`
* `qu`
* `qui`
* `quic`
* `quick`

Use the `standard` analyzer at search time. Otherwise, the search query splits into edge N-grams and you get results for everything that matches `q`, `u`, and `i`.
This is one of the few occasions where you use a different analyzer on the index and query side.

#### Sample Request

```json
GET shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": {
        "query": "qui",
        "analyzer": "standard"
      }
    }
  }
}
```

#### Sample Response

```json
{
  "took": 5,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 533,
      "relation": "eq"
    },
    "max_score": 9.712725,
    "hits": [
      {
        "_index": "shakespeare",
        "_type": "_doc",
        "_id": "22006",
        "_score": 9.712725,
        "_source": {
          "type": "line",
          "line_id": 22007,
          "play_name": "Antony and Cleopatra",
          "speech_number": 12,
          "line_number": "5.2.44",
          "speaker": "CLEOPATRA",
          "text_entry": "Quick, quick, good hands."
        }
      },
      {
        "_index": "shakespeare",
        "_type": "_doc",
        "_id": "54665",
        "_score": 9.712725,
        "_source": {
          "type": "line",
          "line_id": 54666,
          "play_name": "Loves Labours Lost",
          "speech_number": 21,
          "line_number": "5.1.52",
          "speaker": "HOLOFERNES",
          "text_entry": "Quis, quis, thou consonant?"
        }
      }
    ]
  }
}
```

Alternatively, specify the `search_analyzer` in the mapping itself:

```json
"mappings": {
  "properties": {
    "text_entry": {
      "type": "text",
      "analyzer": "autocomplete",
      "search_analyzer": "standard"
    }
  }
}
```

### Completion suggester

The completion suggester accepts a list of suggestions and builds them into a finite-state transducer (FST), an optimized data structure that’s essentially a graph. This data structure lives in memory and is optimized for fast prefix lookups. To learn more about FSTs, see [Wikipedia](https://en.wikipedia.org/wiki/Finite-state_transducer).

As the user types, the completion suggester moves through the FST graph one character at a time along a matching path. After it runs out of user input, it examines the remaining endings to produce a list of suggestions.

The completion suggester makes your autocomplete solution as efficient as possible and lets you have explicit control over its suggestions.

Use a dedicated field type called `completion`, which stores the FST-like data structures in the index:

```json
PUT shakespeare
{
  "mappings": {
    "properties": {
      "text_entry": {
        "type": "completion"
      }
    }
  }
}
```

To get back suggestions, use the `search` endpoint with the `suggest` parameter:

```json
GET shakespeare/_search
{
  "suggest": {
    "autocomplete": {
      "prefix": "To be",
      "completion": {
        "field": "text_entry"
      }
    }
  }
}
```

The phrase "to be" is prefix matched with the FST of the `text_entry` field.

#### Sample Response

```json
{
  "took": 9,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 0,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "suggest": {
    "text_entry": [
      {
        "text": "To be",
        "offset": 0,
        "length": 5,
        "options": [
          {
            "text": "To be a comrade with the wolf and owl,--",
            "_index": "shakespeare",
            "_type": "_doc",
            "_id": "50652",
            "_score": 1,
            "_source": {
              "type": "line",
              "line_id": 50653,
              "play_name": "King Lear",
              "speech_number": 68,
              "line_number": "2.4.230",
              "speaker": "KING LEAR",
              "text_entry": "To be a comrade with the wolf and owl,--"
            }
          },
          {
            "text": "To be a make-peace shall become my age:",
            "_index": "shakespeare",
            "_type": "_doc",
            "_id": "78566",
            "_score": 1,
            "_source": {
              "type": "line",
              "line_id": 78567,
              "play_name": "Richard II",
              "speech_number": 20,
              "line_number": "1.1.160",
              "speaker": "JOHN OF GAUNT",
              "text_entry": "To be a make-peace shall become my age:"
            }
          }
        ]
      }
    ]
  }
}
```

To specify the number of suggestions that you want to return, use the `size` parameter:

```json
GET shakespeare/_search
{
  "suggest": {
    "autocomplete": {
      "prefix": "To m",
      "completion": {
        "field": "text_entry",
        "size": 3
      }
    }
  }
}
```

#### Sample Response

```json
{
  "took": 3,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 0,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "suggest": {
    "text_entry": [
      {
        "text": "To m",
        "offset": 0,
        "length": 5,
        "options": [
          {
            "text": "To make a bastard and a slave of me!",
            "_index": "shakespeare",
            "_type": "_doc",
            "_id": "5369",
            "_score": 4,
            "_source": {
              "type": "line",
              "line_id": 5370,
              "play_name": "Henry VI Part 1",
              "speech_number": 2,
              "line_number": "4.5.15",
              "speaker": "JOHN TALBOT",
              "text_entry": "To make a bastard and a slave of me!"
            }
          },
          {
            "text": "To make a bloody supper in the Tower.",
            "_index": "shakespeare",
            "_type": "_doc",
            "_id": "12504",
            "_score": 4,
            "_source": {
              "type": "line",
              "line_id": 12505,
              "play_name": "Henry VI Part 3",
              "speech_number": 40,
              "line_number": "5.5.85",
              "speaker": "CLARENCE",
              "text_entry": "To make a bloody supper in the Tower."
            }
          }
        ]
      }
    ]
  }
}
```

The `suggest` parameter finds suggestions using only prefix matching.
For example, you don't get back "To be, or not to be," which you might want as a suggestion.
To work around this issue, manually add curated suggestions and add weights to prioritize your suggestions.

Index a document with an input suggestion and assign a weight:

```json
PUT shakespeare/_doc/1
{
  "text": "To m",
  "text_entry": {
    "input": [
      "To be, or not to be: that is the question:"
    ],
    "weight": 10
  }
}
```

Perform the same search as before:

```json
GET shakespeare/_search
{
  "suggest": {
    "autocomplete": {
      "prefix": "To m",
      "completion": {
        "field": "text_entry",
        "size": 3
      }
    }
  }
}
```

You see the indexed document as the first result:

```json
{
  "took": 1021,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 0,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "suggest": {
    "autocomplete": [
      {
        "text": "To m",
        "offset": 0,
        "length": 5,
        "options": [
          {
            "text": "To be, or not to be: that is the question:",
            "_index": "shakespeare",
            "_type": "_doc",
            "_id": "1",
            "_score": 30,
            "_source": {
              "text": "To me",
              "text_entry": {
                "input": [
                  "To be, or not to be: that is the question:"
                ],
                "weight": 10
              }
            }
          },
          {
            "text": "To make a bastard and a slave of me!",
            "_index": "shakespeare",
            "_type": "_doc",
            "_id": "5369",
            "_score": 4,
            "_source": {
              "type": "line",
              "line_id": 5370,
              "play_name": "Henry VI Part 1",
              "speech_number": 2,
              "line_number": "4.5.15",
              "speaker": "JOHN TALBOT",
              "text_entry": "To make a bastard and a slave of me!"
            }
          }
        ]
      }
    ]
  }
}
```

Use the `term` suggester to suggest corrected spellings for individual words.
The `term` suggester uses an edit distance to compute suggestions. Edit distance is the number of characters that need to be changed for a term to match.

In this example, the user misspells a search term:

```json
GET shakespeare/_search
{
  "suggest": {
    "spell-check": {
      "text": "lief",
      "term": {
        "field": "text_entry"
      }
    }
  }
}
```

The `term` suggester returns a list of corrections:

```json
{
  "took": 48,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 0,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "suggest": {
    "spell-check": [
      {
        "text": "lief",
        "offset": 0,
        "length": 4,
        "options": [
          {
            "text": "lifes",
            "score": 0.8,
            "freq": 21
          },
          {
            "text": "life",
            "score": 0.75,
            "freq": 805
          },
          {
            "text": "lives",
            "score": 0.6,
            "freq": 187
          },
          {
            "text": "liege",
            "score": 0.6,
            "freq": 138
          },
          {
            "text": "lived",
            "score": 0.6,
            "freq": 80
          }
        ]
      }
    ]
  }
}
```

The higher the score, the better the suggestion is. The frequency represents the number of times the term appears in the documents of that index.

To implement a "Did you mean `suggestion`?" feature, use a `phrase` suggester.
The `phrase` suggester is similar to the `term` suggester, except that it uses N-gram language models to suggest whole phrases instead of individual words.

Create a custom analyzer called `trigram` that uses a `shingle` filter. This filter is similar to the `edge_ngram` filter, but it applies to words instead of letters:

```json
PUT shakespeare
{
  "settings": {
    "index": {
      "analysis": {
        "analyzer": {
          "trigram": {
            "type": "custom",
            "tokenizer": "standard",
            "filter": [
              "lowercase",
              "shingle"
            ]
          }
        },
        "filter": {
          "shingle": {
            "type": "shingle",
            "min_shingle_size": 2,
            "max_shingle_size": 3
          }
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "text_entry": {
        "type": "text",
        "fields": {
          "trigram": {
            "type": "text",
            "analyzer": "trigram"
          }
        }
      }
    }
  }
}
```

This example includes as incorrect phrase:

```json
POST shakespeare/_search
{
  "suggest": {
    "text": "That the qution",
    "simple_phrase": {
      "phrase": {
        "field": "text_entry.trigram"
      }
    }
  }
}
```

You get back the corrected phrase:

```json
{
  "took": 3,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 0,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "suggest": {
    "simple_phrase": [
      {
        "text": "That the qution",
        "offset": 0,
        "length": 18,
        "options": [
          {
            "text": "that is the question",
            "score": 0.0015543294
          }
        ]
      }
    ]
  }
}
```


## Paginate results

The `from` and `size` parameters return results to your users one page at a time.

The `from` parameter is the document number that you want to start showing the results from. The `size` parameter is the number of results that you want to show. Together, they let you return a subset of the search results.

For example, if the value of `size` is 10 and the value of `from` is 0, you see the first 10 results. If you change the value of `from` to 10, you see the next 10 results (because the results are zero-indexed). So, if you want to see results starting from result 11, `from` must be 10.

```json
GET shakespeare/_search
{
  "from": 0,
  "size": 10,
  "query": {
    "match": {
      "play_name": "Hamlet"
    }
  }
}
```

To calculate the `from` parameter relative to the page number:

```json
from = size * (page_number - 1)
```

Each time the user chooses the next page of the results, your application needs to make the same search query with an incremented `from` value.

You can also specify the `from` and `size` parameters in the search URI:

```json
GET shakespeare/_search?from=0&size=10
```

If you only specify the `size` parameter, the `from` parameter defaults to 0.

Querying for pages deep in your results can have a significant performance impact, so OpenSearch limits this approach to 10,000 results.

The `from` and `size` parameters are stateless, so the results are based on the latest available data.
This can cause inconsistent pagination.
For example, assume a user stays on the first page of the results for a minute and then navigates to the second page; in that time, a new document is indexed in the background which is relevant enough to show up on the first page. In this scenario, the last result of the first page is pushed to the second page, so the user ends up seeing a result on the second page that they already saw on the first page.

Use the `scroll` operation for consistent pagination. The `scroll` operation keeps a search context open for a certain period of time. Any data changes do not affect the results during this time.

## Scroll search

The `from` and `size` parameters allow you to paginate your search results, but with a limit of 10,000 results at a time.

If you need to request massive volumes of data from, for example, a machine learning job, use the `scroll` operation instead. The `scroll` operation allows you to request an unlimited number of results.

To use the scroll operation, add a `scroll` parameter to the request header with a search context to tell OpenSearch how long you need to keep scrolling. This search context needs to be long enough to process a single batch of results.

To set the number of results that you want returned for each batch, use the `size` parameter:

```json
GET shakespeare/_search?scroll=10m
{
  "size": 10000
}
```

OpenSearch caches the results and returns a scroll ID to access them in batches:

```json
"_scroll_id" : "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAUWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ=="
```

Pass this scroll ID to the `scroll` operation to get back the next batch of results:

```json
GET _search/scroll
{
  "scroll": "10m",
  "scroll_id": "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAUWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ=="
}
```

Using this scroll ID, you get results in batches of 10,000 as long as the search context is still open. Typically, the scroll ID does not change between requests, but it *can* change, so make sure to always use the latest scroll ID. If you don't send the next scroll request within the set search context, the `scroll` operation does not return any results.

If you expect billions of results, use a sliced scroll. Slicing allows you to perform multiple scroll operations for the same request, but in parallel.
Set the ID and the maximum number of slices for the scroll:

```json
GET shakespeare/_search?scroll=10m
{
  "slice": {
    "id": 0,
    "max": 10
  },
  "query": {
    "match_all": {}
  }
}
```

With a single scroll ID, you get back 10 results.
You can have up to 10 IDs.
Perform the same command with ID equal to 1:

```json
GET shakespeare/_search?scroll=10m
{
  "slice": {
    "id": 1,
    "max": 10
  },
  "query": {
    "match_all": {}
  }
}
```

Close the search context when you’re done scrolling, because it continues to consume computing resources until the timeout:

```json
DELETE _search/scroll/DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAcWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ==
```

#### Sample Response

```json
{
  "succeeded": true,
  "num_freed": 1
}
```

To close all open scroll contexts:

```json
DELETE _search/scroll/_all
```

The `scroll` operation corresponds to a specific timestamp. It doesn't consider documents added after that timestamp as potential results.

Because open search contexts consume a lot of memory, we suggest you don't use the `scroll` operation for frequent user queries that don't need the search context open. Instead, use the `sort` parameter with the `search_after` parameter to scroll responses for user queries.

## Sort results

Sorting allows your users to sort the results in a way that’s most meaningful to them.

By default, full-text queries sort results by the relevance score.
You can choose to sort the results by any field value in either ascending or descending order.

For example, to sort results by descending order of a `line_id` value:

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "play_name": {
        "value": "Henry IV"
      }
    }
  },
  "sort": [
    {
      "line_id": {
        "order": "desc"
      }
    }
  ]
}
```

The sort parameter is an array, so you can specify multiple field values in the order of their priority.

If you have two fields with the same value for `line_id`, OpenSearch uses `speech_number`, which is the second option for sorting.

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "play_name": {
        "value": "Henry IV"
      }
    }
  },
  "sort": [
    {
      "line_id": {
        "order": "desc"
      }
    },
    {
      "speech_number": {
        "order": "desc"
      }
    }
  ]
}
```

You can continue to sort by any number of field values to get the results in just the right order. It doesn’t have to be a numerical value---you can also sort by date or timestamp fields:

```json
"sort": [
    {
      "date": {
        "order": "desc"
      }
    }
  ]
```

For numeric fields that contain an array of numbers, you can sort by `avg`, `sum`, and `median` modes:

```json
"sort": [
  {
    "price": {
      "order": "asc",
      "mode": "avg"
    }
  }
]
```

To sort by the minimum or maximum values, use the `min` or `max` modes. These modes work for both numeric and string data types.

A text field that’s analyzed cannot be used to sort documents, because the inverted index only contains the individual tokenized terms and not the entire string. So, you cannot sort by the `play_name`, for example.

One workaround is map a raw version of the text field as a keyword type, so it won’t be analyzed and you have a copy of the full original version for sorting purposes.

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "play_name": {
        "value": "Henry IV"
      }
    }
  },
  "sort": [
    {
      "play_name.keyword": {
        "order": "desc"
      }
    }
  ]
}
```

You get back results sorted by the `play_name` field in alphabetic order.

Use `sort` with `search_after` parameter for more efficient scrolling.
You get back results after the values you specify in the `search_after` array.

Make sure you have the same number of values in the `search_after` array as in the `sort` array, also ordered in the same way.
In this case, you get back results after `line_id = 3202` and `speech_number = 8`.

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "play_name": {
        "value": "Henry IV"
      }
    }
  },
  "sort": [
    {
      "line_id": {
        "order": "desc"
      }
    },
    {
      "speech_number": {
        "order": "desc"
      }
    }
  ],
  "search_after": [
    "3202",
    "8"
  ]
}
```

## Highlight query matches

Highlighting emphasizes the search term(s) in the results.

To highlight the search terms, add a `highlight` parameter outside of the query block:

```json
GET shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": "life"
    }
  },
  "highlight": {
    "fields": {
      "text_entry": {}
    }
  }
}
```

For each document in the results, you get back a `highlight` object that shows your search term wrapped in an `em` tag:

```json
"highlight": {
   "text_entry": [
       "my <em>life</em>, except my <em>life</em>."
   ]
}
```

Design your application code to parse the results from the `highlight` object and perform some action on the search terms, such as changing their color, bolding, italicizing, and so on.

To change the default `em` tags, use the `pretag` and `posttag` parameters:

```json
GET shakespeare/_search?format=yaml
{
  "query": {
    "match": {
      "play_name": "Henry IV"
    }
  },
  "highlight": {
    "pre_tags": [
      "<strong>"
    ],
    "post_tags": [
      "</strong>"
    ],
    "fields": {
      "play_name": {}
    }
  }
}
```

The `highlight` parameter highlights the original terms even when using synonyms or stemming for the search itself.
