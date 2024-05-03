---
layout: default
title: Autocomplete
parent: Searching data
nav_order: 24
redirect_from:
  - /opensearch/search/autocomplete/
---

# Autocomplete functionality

Autocomplete shows suggestions to users while they type.

For example, if a user types "pop," OpenSearch provides suggestions like "popcorn" or "popsicles." These suggestions preempt your user's intention and lead them to a possible search term more quickly.

OpenSearch lets you design autocomplete that updates with each keystroke, provides a few relevant suggestions, and tolerates typos.

Implement autocomplete using one of the following methods:

- [Prefix matching](#prefix-matching)
- [Edge n-gram matching](#edge-n-gram-matching)
- [Search as you type](#search-as-you-type)
- [Completion suggesters](#completion-suggester)

While prefix matching happens at query time, the other three methods happen at index time. All methods are described in the following sections.

## Prefix matching

Prefix matching finds documents that match the last term in a query string.

For example, assume that the user types “qui” into a search UI. To autocomplete this phrase, use the `match_phrase_prefix` query to search for all `text_entry` field values that begin with the prefix "qui":

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

To make the word order and relative positions flexible, specify a `slop` value. To learn about the `slop` option, see [Slop]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase#slop).

Prefix matching doesn’t require any special mappings. It works with your data as is.
However, it’s a fairly resource-intensive operation. A prefix of `a` could match hundreds of thousands of terms and not be useful to your user.
To limit the impact of prefix expansion, set `max_expansions` to a reasonable number:

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

The maximum number of terms to which the query can expand. Queries “expand” search terms to a number of matching terms that are within the distance specified in `fuzziness`. 

The ease of implementing query-time autocomplete comes at the cost of performance.
When implementing this feature on a large scale, we recommend an index-time solution. With an index-time solution, you might experience slower indexing, but it’s a price you pay only once and not for every query. The edge n-gram, search-as-you-type, and completion suggester methods are index-time solutions.

## Edge n-gram matching

During indexing, edge n-grams split a word into a sequence of n characters to support a faster lookup of partial search terms.

If you n-gram the word "quick," the results depend on the value of n.

n | Type | n-gram
:--- | :--- | :---
1 | Unigram | [ `q`, `u`, `i`, `c`, `k` ]
2 | Bigram | [ `qu`, `ui`, `ic`, `ck` ]
3 | Trigram | [ `qui`, `uic`, `ick` ]
4 | Four-gram | [ `quic`, `uick` ]
5 | Five-gram | [ `quick` ]

Autocomplete needs only the beginning n-grams of a search phrase, so OpenSearch uses a special type of n-gram called *edge n-gram*.

Edge n-gramming the word "quick" results in the following:

- `q`
- `qu`
- `qui`
- `quic`
- `quick`

This follows the same sequence the user types.

To configure a field to use edge n-grams, create an autocomplete analyzer with an `edge_ngram` filter:


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

This example creates the index and instantiates the edge n-gram filter and analyzer.

The `edge_ngram_filter` produces edge n-grams with a minimum n-gram length of 1 (a single letter) and a maximum length of 20. So it offers suggestions for words of up to 20 letters.

The `autocomplete` analyzer tokenizes a string into individual terms, lowercases the terms, and then produces edge n-grams for each term using the `edge_ngram_filter`.

Use the `analyze` operation to test this analyzer:

```json
POST shakespeare/_analyze
{
  "analyzer": "autocomplete",
  "text": "quick"
}
```

It returns edge n-grams as tokens:

* `q`
* `qu`
* `qui`
* `quic`
* `quick`

Use the `standard` analyzer at search time. Otherwise, the search query splits into edge n-grams and you get results for everything that matches `q`, `u`, and `i`.
This is one of the few occasions when you use different analyzers at index time and at query time:

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

The response contains the matching documents:

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
      ...
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

## Completion suggester

The completion suggester accepts a list of suggestions and builds them into a finite-state transducer (FST), an optimized data structure that is essentially a graph. This data structure lives in memory and is optimized for fast prefix lookups. To learn more about FSTs, see [Wikipedia](https://en.wikipedia.org/wiki/Finite-state_transducer).

As the user types, the completion suggester moves through the FST graph one character at a time along a matching path. After it runs out of user input, it examines the remaining endings to produce a list of suggestions.

The completion suggester makes your autocomplete solution as efficient as possible and lets you have explicit control over its suggestions.

Use a dedicated field type called [`completion`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/completion), which stores the FST-like data structures in the index:

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

To get suggestions, use the `search` endpoint with the `suggest` parameter:

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

The phrase "to be" is prefix matched with the FST of the `text_entry` field:

```json
{
  "took" : 29,
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
  },
  "suggest" : {
    "autocomplete" : [
      {
        "text" : "To be",
        "offset" : 0,
        "length" : 5,
        "options" : [
          {
            "text" : "To be a comrade with the wolf and owl,--",
            "_index" : "shakespeare",
            "_id" : "50652",
            "_score" : 1.0,
            "_source" : {
              "type" : "line",
              "line_id" : 50653,
              "play_name" : "King Lear",
              "speech_number" : 68,
              "line_number" : "2.4.230",
              "speaker" : "KING LEAR",
              "text_entry" : "To be a comrade with the wolf and owl,--"
            }
          },
          {
            "text" : "To be a make-peace shall become my age:",
            "_index" : "shakespeare",
            "_id" : "78566",
            "_score" : 1.0,
            "_source" : {
              "type" : "line",
              "line_id" : 78567,
              "play_name" : "Richard II",
              "speech_number" : 20,
              "line_number" : "1.1.160",
              "speaker" : "JOHN OF GAUNT",
              "text_entry" : "To be a make-peace shall become my age:"
            }
          },
          {
            "text" : "To be a party in this injury.",
            "_index" : "shakespeare",
            "_id" : "75259",
            "_score" : 1.0,
            "_source" : {
              "type" : "line",
              "line_id" : 75260,
              "play_name" : "Othello",
              "speech_number" : 57,
              "line_number" : "5.1.93",
              "speaker" : "IAGO",
              "text_entry" : "To be a party in this injury."
            }
          },
          {
            "text" : "To be a preparation gainst the Polack;",
            "_index" : "shakespeare",
            "_id" : "33591",
            "_score" : 1.0,
            "_source" : {
              "type" : "line",
              "line_id" : 33592,
              "play_name" : "Hamlet",
              "speech_number" : 17,
              "line_number" : "2.2.67",
              "speaker" : "VOLTIMAND",
              "text_entry" : "To be a preparation gainst the Polack;"
            }
          },
          {
            "text" : "To be a public spectacle to all:",
            "_index" : "shakespeare",
            "_id" : "3709",
            "_score" : 1.0,
            "_source" : {
              "type" : "line",
              "line_id" : 3710,
              "play_name" : "Henry VI Part 1",
              "speech_number" : 6,
              "line_number" : "1.4.41",
              "speaker" : "TALBOT",
              "text_entry" : "To be a public spectacle to all:"
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
      "prefix": "To n",
      "completion": {
        "field": "text_entry",
        "size": 3
      }
    }
  }
}
```

The maximum of three documents is returned:

```json
{
  "took" : 4109,
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
  },
  "suggest" : {
    "autocomplete" : [
      {
        "text" : "To n",
        "offset" : 0,
        "length" : 4,
        "options" : [
          {
            "text" : "To NESTOR",
            "_index" : "shakespeare",
            "_id" : "99707",
            "_score" : 1.0,
            "_source" : {
              "type" : "line",
              "line_id" : 99708,
              "play_name" : "Troilus and Cressida",
              "speech_number" : 3,
              "line_number" : "",
              "speaker" : "ULYSSES",
              "text_entry" : "To NESTOR"
            }
          },
          {
            "text" : "To name the bigger light, and how the less,",
            "_index" : "shakespeare",
            "_id" : "91884",
            "_score" : 1.0,
            "_source" : {
              "type" : "line",
              "line_id" : 91885,
              "play_name" : "The Tempest",
              "speech_number" : 91,
              "line_number" : "1.2.394",
              "speaker" : "CALIBAN",
              "text_entry" : "To name the bigger light, and how the less,"
            }
          },
          {
            "text" : "To nature none more bound; his training such,",
            "_index" : "shakespeare",
            "_id" : "40510",
            "_score" : 1.0,
            "_source" : {
              "type" : "line",
              "line_id" : 40511,
              "play_name" : "Henry VIII",
              "speech_number" : 18,
              "line_number" : "1.2.126",
              "speaker" : "KING HENRY VIII",
              "text_entry" : "To nature none more bound; his training such,"
            }
          }
        ]
      }
    ]
  }
}
```

The `suggest` parameter finds suggestions using only prefix matching.
For example, the document "To be, or not to be" is not part of the results. If you want specific documents returned as suggestions, you can manually add curated suggestions and add weights to prioritize your suggestions.

Index a document with input suggestions and assign a weight:

```json
PUT shakespeare/_doc/1?refresh=true
{
  "text_entry": {
    "input": [
      "To n", "To be, or not to be: that is the question:"
    ],
    "weight": 10
  }
}
```

Perform the same search:

```json
GET shakespeare/_search
{
  "suggest": {
    "autocomplete": {
      "prefix": "To n",
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
  "took" : 1,
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
  },
  "suggest" : {
    "autocomplete" : [
      {
        "text" : "To n",
        "offset" : 0,
        "length" : 4,
        "options" : [
          {
            "text" : "To n",
            "_index" : "shakespeare",
            "_id" : "1",
            "_score" : 10.0,
            "_source" : {
              "text_entry" : {
                "input" : [
                  "To n",
                  "To be, or not to be: that is the question:"
                ],
                "weight" : 10
              }
            }
          },
          {
            "text" : "To NESTOR",
            "_index" : "shakespeare",
            "_id" : "99707",
            "_score" : 1.0,
            "_source" : {
              "type" : "line",
              "line_id" : 99708,
              "play_name" : "Troilus and Cressida",
              "speech_number" : 3,
              "line_number" : "",
              "speaker" : "ULYSSES",
              "text_entry" : "To NESTOR"
            }
          },
          {
            "text" : "To name the bigger light, and how the less,",
            "_index" : "shakespeare",
            "_id" : "91884",
            "_score" : 1.0,
            "_source" : {
              "type" : "line",
              "line_id" : 91885,
              "play_name" : "The Tempest",
              "speech_number" : 91,
              "line_number" : "1.2.394",
              "speaker" : "CALIBAN",
              "text_entry" : "To name the bigger light, and how the less,"
            }
          }
        ]
      }
    ]
  }
}
```

You can also allow for misspellings in queries by specifying the `fuzzy` parameter:

```json
GET shakespeare/_search
{
  "suggest": {
    "autocomplete": {
      "prefix": "rosenkrantz",
      "completion": {
        "field": "text_entry",
        "size": 3,
        "fuzzy" : {
            "fuzziness" : "AUTO"
        }
      }
    }
  }
}
```

The result matches the correct spelling:

```json
{
  "took" : 1,
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
  },
  "suggest" : {
    "autocomplete" : [
      {
        "text" : "rosenkrantz",
        "offset" : 0,
        "length" : 11,
        "options" : [
          {
            "text" : "ROSENCRANTZ:",
            "_index" : "shakespeare",
            "_id" : "35196",
            "_score" : 5.0,
            "_source" : {
              "type" : "line",
              "line_id" : 35197,
              "play_name" : "Hamlet",
              "speech_number" : 2,
              "line_number" : "4.2.1",
              "speaker" : "HAMLET",
              "text_entry" : "ROSENCRANTZ:"
            }
          }
        ]
      }
    ]
  }
}
```

You can use a regular expression to define the prefix for the completion suggester query:

```json
GET shakespeare/_search
{
  "suggest": {
    "autocomplete": {
      "prefix": "rosen*",
      "completion": {
        "field": "text_entry",
        "size": 3
      }
    }
  }
}
```

For more information, see the [`completion` field type documentation]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/completion).

## Search as you type

OpenSearch has a dedicated [`search_as_you_type`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/search-as-you-type) field type that is optimized for search-as-you-type functionality and can match terms using both prefix and infix completion. The `search_as_you_type` field does not require you to set up a custom analyzer or index suggestions beforehand. 

First, map the field as `search_as_you_type`:

```json
PUT shakespeare
{
  "mappings": {
    "properties": {
      "text_entry": {
        "type": "search_as_you_type"
      }
    }
  }
}
```

After you index a document, OpenSearch automatically creates and stores its n-grams and edge n-grams. For example, consider the string `that is the question`. First, it is split into terms using the standard analyzer, and the terms are stored in the `text_entry` field:

```json
[
    "that",
    "is",
    "the",
    "question"
]
```

In addition to storing these terms, the following 2-grams for this field are stored in the field `text_entry._2gram`:

```json
[
    "that is",
    "is the",
    "the question"
]
```

The following 3-grams for this field are stored in the field `text_entry._3gram`:

```json
[
    "that is the",
    "is the question"
]
```

Finally, after an edge n-gram token filter is applied, the resulting terms are stored in the `text_entry._index_prefix` field:

```json
[
    "t", 
    "th", 
    "tha", 
    "that", 
    ...
]
```

You can then match terms in any order using the `bool_prefix` type of a `multi-match` query:

```json
GET shakespeare/_search
{
  "query": {
    "multi_match": {
      "query": "uncle what",
      "type": "bool_prefix",
      "fields": [
        "text_entry",
        "text_entry._2gram",
        "text_entry._3gram"
      ]
    }
  },
  "size": 3
}
```

The documents in which the words appear in the same order as in the query are ranked higher in the results:

```json
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 4759,
      "relation" : "eq"
    },
    "max_score" : 10.437667,
    "hits" : [
      {
        "_index" : "shakespeare",
        "_id" : "2817",
        "_score" : 10.437667,
        "_source" : {
          "type" : "line",
          "line_id" : 2818,
          "play_name" : "Henry IV",
          "speech_number" : 5,
          "line_number" : "5.2.31",
          "speaker" : "HOTSPUR",
          "text_entry" : "Uncle, what news?"
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "37085",
        "_score" : 9.437667,
        "_source" : {
          "type" : "line",
          "line_id" : 37086,
          "play_name" : "Henry V",
          "speech_number" : 26,
          "line_number" : "1.2.262",
          "speaker" : "KING HENRY V",
          "text_entry" : "What treasure, uncle?"
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "79274",
        "_score" : 9.358302,
        "_source" : {
          "type" : "line",
          "line_id" : 79275,
          "play_name" : "Richard II",
          "speech_number" : 29,
          "line_number" : "2.1.187",
          "speaker" : "KING RICHARD II",
          "text_entry" : "Why, uncle, whats the matter?"
        }
      }
    ]
  }
}
```

To match terms in order, you can use a `match_phrase_prefix` query:

```json
GET shakespeare/_search
{
  "query": {
    "match_phrase_prefix": {
      "text_entry": "uncle wha"
    }
  },
  "size": 3
}
```

The response contains documents that match the prefix:

```json
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 6,
      "relation" : "eq"
    },
    "max_score" : 16.37664,
    "hits" : [
      {
        "_index" : "shakespeare",
        "_id" : "2817",
        "_score" : 16.37664,
        "_source" : {
          "type" : "line",
          "line_id" : 2818,
          "play_name" : "Henry IV",
          "speech_number" : 5,
          "line_number" : "5.2.31",
          "speaker" : "HOTSPUR",
          "text_entry" : "Uncle, what news?"
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "6789",
        "_score" : 16.37664,
        "_source" : {
          "type" : "line",
          "line_id" : 6790,
          "play_name" : "Henry VI Part 2",
          "speech_number" : 60,
          "line_number" : "1.3.202",
          "speaker" : "KING HENRY VI",
          "text_entry" : "Uncle, what shall we say to this in law?"
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "7877",
        "_score" : 16.37664,
        "_source" : {
          "type" : "line",
          "line_id" : 7878,
          "play_name" : "Henry VI Part 2",
          "speech_number" : 13,
          "line_number" : "3.2.28",
          "speaker" : "KING HENRY VI",
          "text_entry" : "Where is our uncle? whats the matter, Suffolk?"
        }
      }
    ]
  }
}
```

Finally, to match the last term exactly and not as a prefix, you can use a `match_phrase` query:

```json
GET shakespeare/_search
{
  "query": {
    "match_phrase": {
      "text_entry": "uncle what"
    }
  },
  "size": 5
}
```

The response contains exact matches:

```json
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : 14.437452,
    "hits" : [
      {
        "_index" : "shakespeare",
        "_id" : "2817",
        "_score" : 14.437452,
        "_source" : {
          "type" : "line",
          "line_id" : 2818,
          "play_name" : "Henry IV",
          "speech_number" : 5,
          "line_number" : "5.2.31",
          "speaker" : "HOTSPUR",
          "text_entry" : "Uncle, what news?"
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "6789",
        "_score" : 9.461917,
        "_source" : {
          "type" : "line",
          "line_id" : 6790,
          "play_name" : "Henry VI Part 2",
          "speech_number" : 60,
          "line_number" : "1.3.202",
          "speaker" : "KING HENRY VI",
          "text_entry" : "Uncle, what shall we say to this in law?"
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "100955",
        "_score" : 8.947967,
        "_source" : {
          "type" : "line",
          "line_id" : 100956,
          "play_name" : "Troilus and Cressida",
          "speech_number" : 28,
          "line_number" : "3.2.98",
          "speaker" : "CRESSIDA",
          "text_entry" : "Well, uncle, what folly I commit, I dedicate to you."
        }
      }
    ]
  }
}
```

If you modify the text in the previous `match_phrase` query and omit the last letter, none of the documents in the previous response are returned:

```json
GET shakespeare/_search
{
  "query": {
    "match_phrase": {
      "text_entry": "uncle wha"
    }
  }
}
```

The result is empty:

```json
{
  "took" : 1,
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

For more information, see the [`search_as_you_type` field type documentation]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/search-as-you-type).