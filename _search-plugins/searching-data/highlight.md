---
layout: default
title: Highlight query matches
parent: Searching data
nav_order: 23
redirect_from:
  - /opensearch/search/highlight/
---

# Highlight query matches

Highlighting emphasizes the search term(s) in the results so you can emphasize the query matches.

To highlight the search terms, add a `highlight` parameter outside of the query block:

```json
GET shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": "life"
    }
  },
  "size": 3,
  "highlight": {
    "fields": {
      "text_entry": {}
    }
  }
}
```

Each document in the results contains a `highlight` object that shows your search term wrapped in an `em` tag:

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
      "value" : 805,
      "relation" : "eq"
    },
    "max_score" : 7.450247,
    "hits" : [
      {
        "_index" : "shakespeare",
        "_id" : "33765",
        "_score" : 7.450247,
        "_source" : {
          "type" : "line",
          "line_id" : 33766,
          "play_name" : "Hamlet",
          "speech_number" : 60,
          "line_number" : "2.2.233",
          "speaker" : "HAMLET",
          "text_entry" : "my life, except my life."
        },
        "highlight" : {
          "text_entry" : [
            "my <em>life</em>, except my <em>life</em>."
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "51877",
        "_score" : 6.873042,
        "_source" : {
          "type" : "line",
          "line_id" : 51878,
          "play_name" : "King Lear",
          "speech_number" : 18,
          "line_number" : "4.6.52",
          "speaker" : "EDGAR",
          "text_entry" : "The treasury of life, when life itself"
        },
        "highlight" : {
          "text_entry" : [
            "The treasury of <em>life</em>, when <em>life</em> itself"
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "39245",
        "_score" : 6.6167283,
        "_source" : {
          "type" : "line",
          "line_id" : 39246,
          "play_name" : "Henry V",
          "speech_number" : 7,
          "line_number" : "4.7.31",
          "speaker" : "FLUELLEN",
          "text_entry" : "mark Alexanders life well, Harry of Monmouths life"
        },
        "highlight" : {
          "text_entry" : [
            "mark Alexanders <em>life</em> well, Harry of Monmouths <em>life</em>"
          ]
        }
      }
    ]
  }
}
```

The highlight function works on the actual field contents. OpenSearch retrieves these contents either from the stored field (the field for which the mapping is to be set to `true`) or from the `_source` field if the field is not stored. You can force the retrieval of field contents from the `_source` field by setting the `force_source` parameter to `true`.

The `highlight` parameter highlights the original terms even when using synonyms or stemming for the search itself.
{: .note}

## Methods of obtaining offsets

To highlight the search terms, the highlighter needs the start and end character offsets of each term. The offsets mark the term's position in the original text. The highlighter can obtain the offsets from the following sources:

- **Postings**: When documents are indexed, OpenSearch creates an inverted search index&mdash;a core data structure used to search for documents. Postings represent the inverted search index and store the mapping of each analyzed term to the list of documents in which it occurs. If you set the `index_options` parameter to `offsets` when mapping a [text field]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/text), OpenSearch adds each term's start and end character offsets to the inverted index. During highlighting, the highlighter reruns the original query directly on the postings to locate each term. Thus, storing offsets makes highlighting more efficient for large fields because it does not require reanalyzing the text. Storing term offsets requires additional disk space, but uses less disk space than storing term vectors.

- [**Term vectors**]: If you set the [`term_vector` parameter]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/text#term-vector-parameter) to  `with_positions_offsets` when mapping a text field, the highlighter uses the `term_vector` to highlight the field. Storing term vectors requires the most disk space. However, it makes highlighting faster for fields larger than 1 MB and for multi-term queries like prefix or wildcard because term vectors provide access to the dictionary of terms for each document.

- **Text reanalysis**: In the absence of both postings and term vectors, the highlighter reanalyzes text in order to highlight it. For every document and every field that needs highlighting, the highlighter creates a small in-memory index and reruns the original query through Lucene’s query execution planner to access low-level match information for the current document. Reanalyzing the text works well in most use cases. However, this method is more memory and time intensive for large fields.

## Highlighter types

OpenSearch supports three highlighter implementations: `plain`, `unified`, and `fvh` (Fast Vector Highlighter). 

The following table lists the methods of obtaining the offsets for each highlighter.

Highlighter | Method of obtaining offsets
:--- | :---
[`unified`](#the-unified-highlighter) | Term vectors if `term_vector` is set to `with_positions_offsets`,<br> postings if `index_options` is set to `offsets`, <br> text reanalysis otherwise.
[`fvh`](#the-fvh-highlighter) | Term vectors.
[`plain`](#the-plain-highlighter) | Text reanalysis.

### Setting the highlighter type

To set the highlighter type, specify it in the `type` field:

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
      "text_entry": { "type": "plain"}
    }
  }
}
```

### The `unified` highlighter

The `unified` highlighter is based on the Lucene Unified Highlighter and is the default highlighter for OpenSearch. It divides the text into sentences and treats those sentences as individual documents, scoring them in terms of similarity using the BM25 algorithm. The `unified` highlighter supports both exact phrase and multi-term highlighting, including fuzzy, prefix, and regex. If you're using complex queries to highlight multiple fields in multiple documents, we recommend using the `unified` highlighter on `postings` or `term_vector` fields.

### The `fvh` highlighter

The `fvh` highlighter is based on the Lucene Fast Vector Highlighter. To use this highlighter, you need to store term vectors with positions offsets, which increases the index size. The `fvh` highlighter can combine matched terms from multiple fields into one result. It can also assign weights to matches depending on their positions; thus, you can sort phrase matches above term matches when highlighting a query that boosts phrase matches over term matches. Additionally, you can configure the `fvh` highlighter to select the boundaries of a returned text fragment, and you can highlight multiple words with different tags.

### The `plain` highlighter

The `plain` highlighter is based on the standard Lucene highlighter. It requires the highlighted fields to be stored either individually or in the `_source` field. The `plain` highlighter mirrors the query matching logic, in particular word importance and positions in phrase queries. It works for most use cases but may be slow for large fields because it has to reanalyze the text to be highlighted. 

## Highlighting options

The following table describes the highlighting options you can specify on a global or field level. Field-level settings override global settings.

Option | Description
:--- | :---
type | Specifies the highlighter to use. Valid values are `unified`, `fvh`, and `plain`. Default is `unified`.
fields | Specifies the fields to search for text to be highlighted. Supports wildcard expressions. If you use wildcards, only `text` and `keyword` fields are highlighted. For example, you can set `fields` to `my_field*` to include all `text` and `keyword` fields that start with the prefix `my_field`. 
force_source | Specifies that field values for highlighting should be obtained from the `_source` field rather than from stored field values. Default is `false`.
require_field_match | Specifies whether to highlight only fields that contain a search query match. Default is `true`. To highlight all fields, set this option to `false`.
pre_tags | Specifies the HTML start tags for the highlighted text as an array of strings.
post_tags | Specifies the HTML end tags for the highlighted text as an array of strings.
tags_schema | If you set this option to `styled`, OpenSearch uses the built-in tag schema. In this schema, the `pre_tags` are `<em class="hlt1">`, `<em class="hlt2">`, `<em class="hlt3">`, `<em class="hlt4">`, `<em class="hlt5">`, `<em class="hlt6">`, `<em class="hlt7">`, `<em class="hlt8">`, `<em class="hlt9">`, and `<em class="hlt10">`, and the `post_tags` is `</em>`.
boundary_chars | All boundary characters combined in a string.<br> Default is `".,!? \t\n"`.
boundary_scanner | Valid only for the `unified` and `fvh` highlighters. Specifies whether to split the highlighted fragments into sentences, words, or characters. Valid values are the following:<br>- `sentence`: Split highlighted fragments at sentence boundaries, as defined by the [BreakIterator](https://docs.oracle.com/javase/8/docs/api/java/text/BreakIterator.html). You can specify the BreakIterator's locale in the `boundary_scanner_locale` option. <br>- `word`: Split highlighted fragments at word boundaries, as defined by the [BreakIterator](https://docs.oracle.com/javase/8/docs/api/java/text/BreakIterator.html). You can specify the BreakIterator's locale in the `boundary_scanner_locale` option.<br>- `chars`: Split highlighted fragments at any character listed in `boundary_chars`. Valid only for the `fvh` highlighter. 
boundary_scanner_locale | Provides a [locale](https://docs.oracle.com/javase/8/docs/api/java/util/Locale.html) for the `boundary_scanner`. Valid values are language tags (for example, `"en-US"`). Default is [Locale.ROOT](https://docs.oracle.com/javase/8/docs/api/java/util/Locale.html#ROOT).
boundary_max_scan | Controls how far to scan for boundary characters when the `boundary_scanner` parameter for the `fvh` highlighter is set to `chars`. Default is 20.
encoder | Specifies whether the highlighted fragment should be HTML encoded before it is returned. Valid values are `default` (no encoding) or `html` (first escape the HTML text and then insert the highlighting tags). For example, if the field text is `<h3>Hamlet</h3>` and the `encoder` is set to `html`, the highlighted text is `"&lt;h3&gt;<em>Hamlet</em>&lt;&#x2F;h3&gt;"`. 
fragmenter | Specifies how to split text into highlighted fragments. Valid only for the `plain` highlighter. Valid values are the following:<br>- `span` (default): Splits text into fragments of the same size but tries not to split text between highlighted terms. <br>- `simple`: Splits text into fragments of the same size.
fragment_offset | Specifies the character offset from which you want to start highlighting. Valid for the `fvh` highlighter only.
fragment_size | The size of a highlighted fragment, specified as the number of characters. If `number_of_fragments` is set to 0, `fragment_size` is ignored. Default is 100.
number_of_fragments| The maximum number of returned fragments. If `number_of_fragments` is set to 0, OpenSearch returns the highlighted contents of the entire field. Default is 5.
order | The sort order for the highlighted fragments. Set `order` to `score` to sort fragments by relevance. Each highlighter has a different algorithm for calculating relevance scores. Default is `none`.
highlight_query | Specifies that matches for a query other than the search query should be highlighted. The `highlight_query` option is useful when you use a faster query to get document matches and a slower query (for example, `rescore_query`) to refine the results. We recommend to include the search query as part of the `highlight_query`.
matched_fields | Combines matches from different fields to highlight one field. The most common use case for this functionality is highlighting text that is analyzed in different ways and kept in multi-fields. All fields in the `matched_fields` list must have the `term_vector` field set to `with_positions_offsets`. The field in which the matches are combined is the only loaded field, so it is beneficial to set its `store` option to `yes`.  Valid only for the `fvh` highlighter.
no_match_size | Specifies the number of characters, starting from the beginning of the field, to return if there are no matching fragments to highlight. Default is 0.
phrase_limit | The number of matching phrases in a document that are considered. Limits the number of phrases to analyze by the `fvh` highlighter to avoid consuming a lot of memory. If `matched_fields` are used, `phrase_limit` specifies the number of phrases for each matched field. A higher `phrase_limit` leads to increased query time and more memory consumption. Valid only for the `fvh` highlighter. Default is 256.
max_analyzer_offset | Specifies the maximum number of characters to be analyzed by a highlight request. The remaining text will not be processed. If the text to be highlighted exceeds this offset, then an empty highlight is returned. The maximum number of characters that will be analyzed for a highlight request is defined by `index.highlight.max_analyzed_offset`. When this limit is reached, an error is returned. Set the `max_analyzer_offset` to a lower value than `index.highlight.max_analyzed_offset` to avoid the error.

The unified highlighter's sentence scanner splits sentences larger than `fragment_size` at the first word boundary after `fragment_size` is reached. To return whole sentences without splitting them, set `fragment_size` to 0.
{: .note}

## Changing the highlighting tags

Design your application code to parse the results from the `highlight` object and perform an action on the search terms, such as changing their color, bolding, italicizing, and so on.

To change the default `em` tags, specify the new tags in the `pretag` and `posttag` parameters:

```json
GET shakespeare/_search
{
  "query": {
    "match": {
      "play_name": "Henry IV"
    }
  },
  "size": 3,
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

The play name is highlighted by the new tags in the response:

```json
{
  "took" : 2,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3205,
      "relation" : "eq"
    },
    "max_score" : 3.548232,
    "hits" : [
      {
        "_index" : "shakespeare",
        "_id" : "0",
        "_score" : 3.548232,
        "_source" : {
          "type" : "act",
          "line_id" : 1,
          "play_name" : "Henry IV",
          "speech_number" : "",
          "line_number" : "",
          "speaker" : "",
          "text_entry" : "ACT I"
        },
        "highlight" : {
          "play_name" : [
            "<strong>Henry IV</strong>"
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "1",
        "_score" : 3.548232,
        "_source" : {
          "type" : "scene",
          "line_id" : 2,
          "play_name" : "Henry IV",
          "speech_number" : "",
          "line_number" : "",
          "speaker" : "",
          "text_entry" : "SCENE I. London. The palace."
        },
        "highlight" : {
          "play_name" : [
            "<strong>Henry IV</strong>"
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "2",
        "_score" : 3.548232,
        "_source" : {
          "type" : "line",
          "line_id" : 3,
          "play_name" : "Henry IV",
          "speech_number" : "",
          "line_number" : "",
          "speaker" : "",
          "text_entry" : "Enter KING HENRY, LORD JOHN OF LANCASTER, the EARL of WESTMORELAND, SIR WALTER BLUNT, and others"
        },
        "highlight" : {
          "play_name" : [
            "<strong>Henry IV</strong>"
          ]
        }
      }
    ]
  }
}
```

## Specifying a highlight query

By default, OpenSearch only considers the search query for highlighting. If you use a fast query to get document matches and a slower query like `rescore_query` to refine the results, it is useful to highlight the refined results. You can do this by adding a `highlight_query`:

```json
GET shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": {
        "query": "thats my name"
      }
    }
  },
  "rescore": {
    "window_size": 20,
    "query": {
      "rescore_query": {
        "match_phrase": {
          "text_entry": {
            "query": "thats my name",
            "slop": 1
          }
        }
      },
      "rescore_query_weight": 5
    }
  },
  "_source": false,
  "highlight": {
    "order": "score",
    "fields": {
      "text_entry": {
        "highlight_query": {
          "bool": {
            "must": {
              "match": {
                "text_entry": {
                  "query": "thats my name"
                }
              }
            },
            "should": {
              "match_phrase": {
                "text_entry": {
                  "query": "that is my name",
                  "slop": 1,
                  "boost": 10.0
                }
              }
            },
            "minimum_should_match": 0
          }
        }
      }
    }
  }
}
```

## Combining matches from different fields to highlight one field

You can combine matches from different fields to highlight one field with the `fvh` highlighter. The most common use case for this functionality is highlighting text that is analyzed in different ways and kept in multi-fields. All fields in the `matched_fields` list must have the `term_vector` field set to `with_positions_offsets`. The field in which the matches are combined is the only loaded field, so it is beneficial to set its `store` option to `yes`. 

### Example

Create a mapping for the `shakespeare` index where the `text_entry` field is analyzed with the `standard` analyzer and has an `english` subfield that is analyzed with the `english` analyzer:

```json
PUT shakespeare
{
  "mappings" : {
    "properties" : {
      "text_entry" : {
        "type" :  "text",
        "term_vector": "with_positions_offsets",
        "fields": {
          "english": { 
            "type":     "text",
            "analyzer": "english",
            "term_vector": "with_positions_offsets"
          }
        }
      }
    }
  }
}
```

The `standard` analyzer splits the `text_entry` fields into individual words. You can confirm this by using the analyze API operation:

```json
GET shakespeare/_analyze
{
  "text": "bragging of thine",
  "field": "text_entry"
}
```

The response contains the original string split on white space:

```json
{
  "tokens" : [
    {
      "token" : "bragging",
      "start_offset" : 0,
      "end_offset" : 8,
      "type" : "<ALPHANUM>",
      "position" : 0
    },
    {
      "token" : "of",
      "start_offset" : 9,
      "end_offset" : 11,
      "type" : "<ALPHANUM>",
      "position" : 1
    },
    {
      "token" : "thine",
      "start_offset" : 12,
      "end_offset" : 17,
      "type" : "<ALPHANUM>",
      "position" : 2
    }
  ]
}
```

The `english` analyzer not only splits the string into words but also stems the tokens and removes stopwords. You can confirm this by using the analyze API operation with the `text_entry.english` field:

```json
GET shakespeare/_analyze
{
  "text": "bragging of thine",
  "field": "text_entry.english"
}
```

The response contains the stemmed words:

```json
{
  "tokens" : [
    {
      "token" : "brag",
      "start_offset" : 0,
      "end_offset" : 8,
      "type" : "<ALPHANUM>",
      "position" : 0
    },
    {
      "token" : "thine",
      "start_offset" : 12,
      "end_offset" : 17,
      "type" : "<ALPHANUM>",
      "position" : 2
    }
  ]
}
```

To search for all forms of the word `bragging`, use the following query:

```json
GET shakespeare/_search
{
  "query": {
    "query_string": {
      "query": "text_entry.english:bragging",
      "fields": [
        "text_entry"
      ]
    }
  },
  "highlight": {
    "order": "score",
    "fields": {
      "text_entry": {
        "matched_fields": [
          "text_entry",
          "text_entry.english"
        ],
        "type": "fvh"
      }
    }
  }
}
```

The response highlights all versions of the word "bragging" in the `text_entry` field:

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
      "value" : 26,
      "relation" : "eq"
    },
    "max_score" : 10.153671,
    "hits" : [
      {
        "_index" : "shakespeare",
        "_id" : "56666",
        "_score" : 10.153671,
        "_source" : {
          "type" : "line",
          "line_id" : 56667,
          "play_name" : "macbeth",
          "speech_number" : 34,
          "line_number" : "2.3.118",
          "speaker" : "MACBETH",
          "text_entry" : "Is left this vault to brag of."
        },
        "highlight" : {
          "text_entry" : [
            "Is left this vault to <em>brag</em> of."
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "71445",
        "_score" : 9.284528,
        "_source" : {
          "type" : "line",
          "line_id" : 71446,
          "play_name" : "Much Ado about nothing",
          "speech_number" : 18,
          "line_number" : "5.1.65",
          "speaker" : "LEONATO",
          "text_entry" : "As under privilege of age to brag"
        },
        "highlight" : {
          "text_entry" : [
            "As under privilege of age to <em>brag</em>"
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "86782",
        "_score" : 9.284528,
        "_source" : {
          "type" : "line",
          "line_id" : 86783,
          "play_name" : "Romeo and Juliet",
          "speech_number" : 8,
          "line_number" : "2.6.31",
          "speaker" : "JULIET",
          "text_entry" : "Brags of his substance, not of ornament:"
        },
        "highlight" : {
          "text_entry" : [
            "<em>Brags</em> of his substance, not of ornament:"
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "44531",
        "_score" : 8.552448,
        "_source" : {
          "type" : "line",
          "line_id" : 44532,
          "play_name" : "King John",
          "speech_number" : 15,
          "line_number" : "3.1.124",
          "speaker" : "CONSTANCE",
          "text_entry" : "A ramping fool, to brag and stamp and swear"
        },
        "highlight" : {
          "text_entry" : [
            "A ramping fool, to <em>brag</em> and stamp and swear"
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "63208",
        "_score" : 8.552448,
        "_source" : {
          "type" : "line",
          "line_id" : 63209,
          "play_name" : "Merchant of Venice",
          "speech_number" : 11,
          "line_number" : "3.4.79",
          "speaker" : "PORTIA",
          "text_entry" : "A thousand raw tricks of these bragging Jacks,"
        },
        "highlight" : {
          "text_entry" : [
            "A thousand raw tricks of these <em>bragging</em> Jacks,"
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "73026",
        "_score" : 8.552448,
        "_source" : {
          "type" : "line",
          "line_id" : 73027,
          "play_name" : "Othello",
          "speech_number" : 75,
          "line_number" : "2.1.242",
          "speaker" : "IAGO",
          "text_entry" : "but for bragging and telling her fantastical lies:"
        },
        "highlight" : {
          "text_entry" : [
            "but for <em>bragging</em> and telling her fantastical lies:"
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "85974",
        "_score" : 8.552448,
        "_source" : {
          "type" : "line",
          "line_id" : 85975,
          "play_name" : "Romeo and Juliet",
          "speech_number" : 20,
          "line_number" : "1.5.70",
          "speaker" : "CAPULET",
          "text_entry" : "And, to say truth, Verona brags of him"
        },
        "highlight" : {
          "text_entry" : [
            "And, to say truth, Verona <em>brags</em> of him"
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "96800",
        "_score" : 8.552448,
        "_source" : {
          "type" : "line",
          "line_id" : 96801,
          "play_name" : "Titus Andronicus",
          "speech_number" : 60,
          "line_number" : "1.1.311",
          "speaker" : "SATURNINUS",
          "text_entry" : "Agree these deeds with that proud brag of thine,"
        },
        "highlight" : {
          "text_entry" : [
            "Agree these deeds with that proud <em>brag</em> of thine,"
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "18189",
        "_score" : 7.9273787,
        "_source" : {
          "type" : "line",
          "line_id" : 18190,
          "play_name" : "As you like it",
          "speech_number" : 12,
          "line_number" : "5.2.30",
          "speaker" : "ROSALIND",
          "text_entry" : "and Caesars thrasonical brag of I came, saw, and"
        },
        "highlight" : {
          "text_entry" : [
            "and Caesars thrasonical <em>brag</em> of I came, saw, and"
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "32054",
        "_score" : 7.9273787,
        "_source" : {
          "type" : "line",
          "line_id" : 32055,
          "play_name" : "Cymbeline",
          "speech_number" : 52,
          "line_number" : "5.5.211",
          "speaker" : "IACHIMO",
          "text_entry" : "And then a mind put int, either our brags"
        },
        "highlight" : {
          "text_entry" : [
            "And then a mind put int, either our <em>brags</em>"
          ]
        }
      }
    ]
  }
}
```

To score the original form of the word "bragging" higher, you can boost the `text_entry` field:

```json
GET shakespeare/_search
{
  "query": {
    "query_string": {
      "query": "bragging",
      "fields": [
        "text_entry^5",
        "text_entry.english"
      ]
    }
  },
  "highlight": {
    "order": "score",
    "fields": {
      "text_entry": {
        "matched_fields": [
          "text_entry",
          "text_entry.english"
        ],
        "type": "fvh"
      }
    }
  }
}
```

The response lists documents that contain the word "bragging" first:

```json
{
  "took" : 17,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 26,
      "relation" : "eq"
    },
    "max_score" : 49.746853,
    "hits" : [
      {
        "_index" : "shakespeare",
        "_id" : "45739",
        "_score" : 49.746853,
        "_source" : {
          "type" : "line",
          "line_id" : 45740,
          "play_name" : "King John",
          "speech_number" : 10,
          "line_number" : "5.1.51",
          "speaker" : "BASTARD",
          "text_entry" : "Of bragging horror: so shall inferior eyes,"
        },
        "highlight" : {
          "text_entry" : [
            "Of <em>bragging</em> horror: so shall inferior eyes,"
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "63208",
        "_score" : 47.077244,
        "_source" : {
          "type" : "line",
          "line_id" : 63209,
          "play_name" : "Merchant of Venice",
          "speech_number" : 11,
          "line_number" : "3.4.79",
          "speaker" : "PORTIA",
          "text_entry" : "A thousand raw tricks of these bragging Jacks,"
        },
        "highlight" : {
          "text_entry" : [
            "A thousand raw tricks of these <em>bragging</em> Jacks,"
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "68474",
        "_score" : 47.077244,
        "_source" : {
          "type" : "line",
          "line_id" : 68475,
          "play_name" : "A Midsummer nights dream",
          "speech_number" : 101,
          "line_number" : "3.2.427",
          "speaker" : "PUCK",
          "text_entry" : "Thou coward, art thou bragging to the stars,"
        },
        "highlight" : {
          "text_entry" : [
            "Thou coward, art thou <em>bragging</em> to the stars,"
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "73026",
        "_score" : 47.077244,
        "_source" : {
          "type" : "line",
          "line_id" : 73027,
          "play_name" : "Othello",
          "speech_number" : 75,
          "line_number" : "2.1.242",
          "speaker" : "IAGO",
          "text_entry" : "but for bragging and telling her fantastical lies:"
        },
        "highlight" : {
          "text_entry" : [
            "but for <em>bragging</em> and telling her fantastical lies:"
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "39816",
        "_score" : 44.679565,
        "_source" : {
          "type" : "line",
          "line_id" : 39817,
          "play_name" : "Henry V",
          "speech_number" : 28,
          "line_number" : "5.2.138",
          "speaker" : "KING HENRY V",
          "text_entry" : "armour on my back, under the correction of bragging"
        },
        "highlight" : {
          "text_entry" : [
            "armour on my back, under the correction of <em>bragging</em>"
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "63200",
        "_score" : 44.679565,
        "_source" : {
          "type" : "line",
          "line_id" : 63201,
          "play_name" : "Merchant of Venice",
          "speech_number" : 11,
          "line_number" : "3.4.71",
          "speaker" : "PORTIA",
          "text_entry" : "Like a fine bragging youth, and tell quaint lies,"
        },
        "highlight" : {
          "text_entry" : [
            "Like a fine <em>bragging</em> youth, and tell quaint lies,"
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "56666",
        "_score" : 10.153671,
        "_source" : {
          "type" : "line",
          "line_id" : 56667,
          "play_name" : "macbeth",
          "speech_number" : 34,
          "line_number" : "2.3.118",
          "speaker" : "MACBETH",
          "text_entry" : "Is left this vault to brag of."
        },
        "highlight" : {
          "text_entry" : [
            "Is left this vault to <em>brag</em> of."
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "71445",
        "_score" : 9.284528,
        "_source" : {
          "type" : "line",
          "line_id" : 71446,
          "play_name" : "Much Ado about nothing",
          "speech_number" : 18,
          "line_number" : "5.1.65",
          "speaker" : "LEONATO",
          "text_entry" : "As under privilege of age to brag"
        },
        "highlight" : {
          "text_entry" : [
            "As under privilege of age to <em>brag</em>"
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "86782",
        "_score" : 9.284528,
        "_source" : {
          "type" : "line",
          "line_id" : 86783,
          "play_name" : "Romeo and Juliet",
          "speech_number" : 8,
          "line_number" : "2.6.31",
          "speaker" : "JULIET",
          "text_entry" : "Brags of his substance, not of ornament:"
        },
        "highlight" : {
          "text_entry" : [
            "<em>Brags</em> of his substance, not of ornament:"
          ]
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "44531",
        "_score" : 8.552448,
        "_source" : {
          "type" : "line",
          "line_id" : 44532,
          "play_name" : "King John",
          "speech_number" : 15,
          "line_number" : "3.1.124",
          "speaker" : "CONSTANCE",
          "text_entry" : "A ramping fool, to brag and stamp and swear"
        },
        "highlight" : {
          "text_entry" : [
            "A ramping fool, to <em>brag</em> and stamp and swear"
          ]
        }
      }
    ]
  }
}
```

## Query limitations

Note the following limitations:

- When extracting terms to highlight, highlighters don’t reflect the Boolean logic of a query. Therefore, for some complex Boolean queries, such as nested Boolean queries and queries using `minimum_should_match`, OpenSearch may highlight terms that don’t correspond to query matches.
- The `fvh` highlighter does not support span queries.