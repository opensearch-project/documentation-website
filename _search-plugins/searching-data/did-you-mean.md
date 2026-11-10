---
layout: default
title: Did-you-mean
parent: Customizing search results
nav_order: 90
redirect_from:
  - /opensearch/search/did-you-mean/
---

# Did-you-mean

Did-you-mean suggestions show corrections for misspelled search terms.

For example, if a user types `fliud`, OpenSearch suggests a corrected search term like `fluid`. You can then suggest the corrected term to the user or even automatically correct the search term.

You can implement did-you-mean suggestions using one of the following suggesters:

- Use a [term suggester](#term-suggester) to suggest corrections for individual words.
- Use a [phrase suggester](#phrase-suggester) to suggest corrections for phrases.

## Term suggester

Use the term suggester to suggest corrected spellings for individual words. The term suggester analyzes the input text into tokens and returns suggestions separately for each token. It uses only the suggestion settings: the `query` in the same search request does not affect the suggestions.

The term suggester uses an [_edit distance_](https://en.wikipedia.org/wiki/Edit_distance) to compute suggestions. The edit distance is the number of single-character insertions, deletions, or substitutions that need to be performed for a term to match another term. For example, to change the word "cat" to "hats", you need to substitute "h" for "c" and insert an "s", so the edit distance in this case is 2.

To use the term suggester, you don't need any special field mappings for your index. By default, string field types are mapped as `text`. A `text` field is analyzed, so the `title` in the following example is tokenized into individual words. Indexing the following documents creates a `books` index where `title` is a `text` field:

```json
PUT books/_doc/1
{
  "title": "Design Patterns (Object-Oriented Software)"
}
```
{% include copy-curl.html %}

```json
PUT books/_doc/2
{
  "title": "Software Architecture Patterns Explained"
}
```
{% include copy-curl.html %}

To check how a string is split into tokens, you can use the `_analyze` endpoint. To apply the same analyzer that the field uses, you can specify the field's name in the `field` parameter:

```json
GET books/_analyze
{
  "text": "Design Patterns (Object-Oriented Software)",
  "field": "title"
}
```
{% include copy-curl.html %}

The default analyzer (`standard`) splits a string at word boundaries, removes punctuation, and lowercases the tokens:

```json
{
  "tokens": [
    {
      "token": "design",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "patterns",
      "start_offset": 7,
      "end_offset": 15,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "object",
      "start_offset": 17,
      "end_offset": 23,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "oriented",
      "start_offset": 24,
      "end_offset": 32,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "software",
      "start_offset": 33,
      "end_offset": 41,
      "type": "<ALPHANUM>",
      "position": 4
    }
  ]
}
```

To get suggestions for a misspelled search term, use the term suggester. Specify the input text that needs suggestions in the `text` field, and specify the field from which to get suggestions in the `field` field: 

```json
GET books/_search
{
  "suggest": {
    "spell-check": {
      "text": "patern",
      "term": {
        "field": "title"
      }
    }
  }
}
```
{% include copy-curl.html %}

The term suggester returns a list of corrections for the input text in the `options` array:

```json
{
  "took": 2,
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
        "text": "patern",
        "offset": 0,
        "length": 6,
        "options": [
          {
            "text": "patterns",
            "score": 0.6666666,
            "freq": 2
          }
        ]
      }
    ]
  }
}
```

The `score` value is calculated based on the edit distance. The higher the score, the better the suggestion. The `freq` is the frequency that represents the number of times the term appears in the documents of the specified index.

You can include several suggestions in one request. The following example uses the term suggester for two different suggestions:

```json
GET books/_search
{
  "suggest": {
    "spell-check1": {
      "text": "patern",
      "term": {
        "field": "title"
      }
    },
    "spell-check2": {
      "text": "desing",
      "term": {
        "field": "title"
      }
    }
  }
}
```
{% include copy-curl.html %}

To run several suggesters on the same input text, define the text globally to avoid duplication. The following example returns suggestions for `patern` sorted in two different ways:

```json
GET books/_search
{
  "suggest": {
    "text": "patern",
    "by-score": {
      "term": {
        "field": "title",
        "sort": "score"
      }
    },
    "by-frequency": {
      "term": {
        "field": "title",
        "sort": "frequency"
      }
    }
  }
}
```
{% include copy-curl.html %}


### Term suggester options

You can specify the following options to the term suggester.

Option | Description
:--- | :---
`field` | The field from which to source suggestions. Required.
`text` | The input text for which to return suggestions. Required. Can be set for each suggestion or globally for all suggestions in the request. If specified at both levels, the suggestion-level value is used.
`analyzer` | The analyzer with which to analyze the input text. Defaults to the analyzer configured for the `field`.
`size` | The maximum number of suggestions to return for each token in the input text.
`sort` | Specifies how suggestions should be sorted in the response. Valid values are:<br>- `score`: Sort by similarity score, then document frequency, and then the term itself.<br>- `frequency`: Sort by document frequency, then similarity score, and then the term itself.
`suggest_mode` | The suggest mode specifies the terms for which suggestions should be included in the response. Valid values are:<br>- `missing`: Return suggestions only for input terms that have zero occurrences in the specified field of the index. This check is field specific: if a term appears in other fields but not in the targeted field, it is still considered missing. Note that this mode does not consider term frequency across the entire index---only the specified field. <br>- `popular`: Return suggestions only if they occur in the documents more frequently than in the original input text.<br> - `always`: Always return suggestions for each term in the input text.<br>Default is `missing`.
`max_edits` | The maximum edit distance for suggestions. Valid values are in the [1, 2] range. Default is 2.
`prefix_length` | An integer that specifies the minimum length the matched prefix must be to start returning suggestions. If the prefix of `prefix_length` is not matched, but the search term is still within the edit distance, no suggestions are returned. Default is 1. Higher values improve spellcheck performance because misspellings don’t tend to occur in the beginning of words.
`min_word_length` | The minimum length of an input term for which suggestions are returned. Shorter input terms receive no suggestions. Default is 4.
`shard_size` | The maximum number of candidate suggestions to obtain from each shard. The top `size` suggestions from all shards are returned in the response. Default is equal to the `size` value. Shard-level document frequencies may not be exact because terms may reside in different shards. If `shard_size` is larger than `size`, the document frequencies for suggestions are more accurate, at the cost of decreased performance. 
`max_inspections` | The multiplication factor for `shard_size`. The maximum number of candidate suggestions OpenSearch inspects to find suggestions is calculated as `shard_size` multiplied by `max_inspections`. May improve accuracy at the cost of decreased performance. Default is 5.
`min_doc_freq` | The minimum number or percentage of documents in which a suggestion should appear for it to be returned. May improve accuracy by returning only suggestions with high shard-level document frequencies. Valid values are integers that represent the document frequency or floats in the [0, 1] range that represent the percentage of documents. Default is 0 (feature disabled). 
`max_term_freq` | The maximum number of documents in which a suggestion should appear in order for it to be returned. Valid values are integers that represent the document frequency or floats in the [0, 1] range that represent the percentage of documents. Default is 0.01. Excluding high-frequency terms improves spellcheck performance because high-frequency terms are usually spelled correctly. Uses shard-level document frequencies.
`string_distance` | The edit distance algorithm to use to determine similarity. Valid values are:<br>- `internal`: The default algorithm that is based on the [Damerau-Levenshtein algorithm](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance) but is highly optimized for comparing edit distances for terms in the index.<br> - `damerau_levenshtein`: The edit distance algorithm based on the [Damerau-Levenshtein algorithm](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance). <br>- `levenshtein`: The edit distance algorithm based on the [Levenshtein edit distance algorithm](https://en.wikipedia.org/wiki/Levenshtein_distance).<br> - `jaro_winkler`: The edit distance algorithm based on the [Jaro-Winkler algorithm](https://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance).<br> - `ngram`: The edit distance algorithm based on character n-grams.

### Requesting term suggestions using query parameters

You can also request term suggestions using query parameters instead of a `suggest` object in the request body. Specify the field in `suggest_field`, the input text in `suggest_text`, and the suggest mode in `suggest_mode`. In this form, `suggest_mode` has no default value, so you must specify it. If you omit `suggest_text`, OpenSearch uses the value of the `q` parameter. For the full list of parameters, see [Search API query parameters]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/#query-parameters).

The following request returns suggestions for the misspelled term `patern` from the `title` field of the `books` index:

```json
GET /books/_search?suggest_field=title&suggest_text=patern&suggest_mode=missing&size=0
```
{% include copy-curl.html %}

The response contains the suggestions in a `suggest` object named after the field:

```json
{
  "took": 2,
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
    "title": [
      {
        "text": "patern",
        "offset": 0,
        "length": 6,
        "options": [
          {
            "text": "patterns",
            "score": 0.6666666,
            "freq": 2
          }
        ]
      }
    ]
  }
}
```

## Phrase suggester

The phrase suggester is similar to the term suggester, except it uses n-gram language models to suggest whole phrases instead of individual words.

To set up a phrase suggester, create a custom analyzer called `trigram` that uses a `shingle` filter and lowercases tokens. This filter is similar to the `edge_ngram` filter, but it applies to words instead of letters. Then configure the field from which you'll be sourcing suggestions with the custom analyzer you created:

```json
PUT books2
{
  "settings": {
    "index": {
      "analysis": {
        "analyzer": {
          "trigram": {
            "type": "custom",
            "tokenizer": "standard",
            "filter": ["lowercase", "shingle"]
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
      "title": {
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
{% include copy-curl.html %}

Index the documents into the new index:

```json
PUT books2/_doc/1
{
  "title": "Design Patterns"
}
```
{% include copy-curl.html %}

```json
PUT books2/_doc/2
{
  "title": "Software Architecture Patterns Explained"
}
```
{% include copy-curl.html %}

Suppose the user searches for an incorrect phrase:

```json
GET books2/_search
{
  "suggest": {
    "phrase-check": {
      "text": "design paterns",
      "phrase": {
        "field": "title.trigram"
      }
    }
  }
}
```
{% include copy-curl.html %}

The phrase suggester returns the corrected phrase:

```json
{
  "took": 4,
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
    "phrase-check": [
      {
        "text": "design paterns",
        "offset": 0,
        "length": 14,
        "options": [
          {
            "text": "design patterns",
            "score": 0.31666178
          }
        ]
      }
    ]
  }
}
```

To highlight suggestions, set up the [`highlight`]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/highlight/) field for the phrase suggester:

```json
GET books2/_search
{
  "suggest": {
    "phrase-check": {
      "text": "design paterns",
      "phrase": {
        "field": "title.trigram",
        "gram_size": 3,
        "highlight": {
          "pre_tag": "<em>",
          "post_tag": "</em>"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The results contain the highlighted text:

```json
{
  "took": 2,
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
    "phrase-check": [
      {
        "text": "design paterns",
        "offset": 0,
        "length": 14,
        "options": [
          {
            "text": "design patterns",
            "highlighted": "design <em>patterns</em>",
            "score": 0.31666178
          }
        ]
      }
    ]
  }
}
```

### Phrase suggester options

You can specify the following options to the phrase suggester.

Option | Description
:--- | :---
`field` | The field to use for n-gram lookups. The phrase suggester uses this field to calculate suggestion scores. Required.
`text` | The input text for which to return suggestions. Required. Can be set for each suggestion or globally for all suggestions in the request. If specified at both levels, the suggestion-level value is used.
`gram_size` | The maximum size `n` of the n-grams (shingles) in the field. If the field does not contain n-grams (shingles), omit this option or set it to 1. If the field uses a shingle filter, and `gram_size` is not set, `gram_size` is set to `max_shingle_size`.
`real_word_error_likelihood` | The probability that a term is misspelled, even if it exists in the dictionary. Default is 0.95 (5% of the words in the dictionary are misspelled).
`confidence` | The confidence level is a float factor that is multiplied by the input phrase's score to calculate a threshold score for other suggestions. Only suggestions with higher scores than the threshold are returned. A confidence level of 1.0 will only return suggestions that score higher than the input phrase. If `confidence` is set to 0, the top `size` candidates are returned. Default is 1.
`max_errors` | The maximum number or percentage of the terms that can be erroneous (spelled incorrectly) in order to return a suggestion. Valid values are integers that represent the number of terms or floats in the (0, 1) range that represent the percentage of the terms. Default is 0.5, which allows up to half of a query's terms to be treated as misspelled. Setting this value to a high number can decrease performance. We recommend setting `max_errors` to a low number like 1 or 2 to reduce the time spent in suggest calls relative to the time spent in query execution.
`separator` | The separator for the terms in the bigram field. Defaults to the space character.
`size` | The number of candidate suggestions to generate for each query term. Specifying a higher value can result in terms with higher edit distances being returned. Default is 5.
`analyzer` | The analyzer with which to analyze the suggestion text. Defaults to the analyzer configured for the `field`.
`shard_size` | The maximum number of candidate suggestions to obtain from each shard. The top `size` suggestions from all shards are returned in the response. Default is 5.
[`collate`](#collate-field) | Used to prune suggestions for which there are no matching documents in the index.
`collate.query` | Specifies a query against which suggestions are checked to prune the suggestions for which there are no matching documents in the index.
`collate.prune` | Specifies whether to return all suggestions. If `prune` is set to `false`, only those suggestions that have matching documents are returned. If `prune` is set to `true`, all suggestions are returned; each suggestion has an additional `collate_match` field that is `true` if the suggestion has matching documents and is `false` otherwise. Default is `false`.
`highlight` | Configures suggestion highlighting. Both `pre_tag` and `post_tag` values are required. The tags are placed around each changed token. If several consecutive tokens are changed, the tags are placed around the whole group, for example, `<em>design patterns</em>`.
`highlight.pre_tag` | The starting tag for highlighting. 
`highlight.post_tag` | The ending tag for highlighting.
[`smoothing`](#smoothing-models) | Smoothing model to balance the weight of the shingles that exist in the index frequently with the weight of the shingles that exist in the index infrequently.


### Collate field

To filter out spellchecked suggestions that will not return any results, you can use the `collate` field. This field contains a scripted query that is run for each returned suggestion. See [Search templates]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-template/) for information about constructing a templated query. You can specify the current suggestion using the `{% raw %}{{suggestion}}{% endraw %}` variable, or you can pass your own template parameters in the `params` field (the suggestion value will be added to the variables you specify).

The collate query for a suggestion is run only on the shard from which the suggestion was sourced. The query is required.  

Additionally, if the `prune` parameter is set to `true`, a `collate_match` field is added to each suggestion. If a query returns no results, the `collate_match` value is `false`. You can then filter out suggestions based on the `collate_match` field. The `prune` parameter's default value is `false`.

For example, the following query configures the `collate` field to run a `match_phrase` query matching the `title` field to the current suggestion:

```json
GET books2/_search
{
  "suggest": {
    "phrase-check": {
      "text": "design paterns",
      "phrase": {
        "field": "title.trigram",
        "collate": {
          "query": {
            "source": {
              "match_phrase": {
                "title": "{{suggestion}}"
              }
            }
          },
          "prune": "true"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The resulting suggestion contains the `collate_match` field set to `true`, which means the `match_phrase` query will return matching documents for the suggestion:

```json
{
  "took": 7,
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
    "phrase-check": [
      {
        "text": "design paterns",
        "offset": 0,
        "length": 14,
        "options": [
          {
            "text": "design patterns",
            "score": 0.56759655,
            "collate_match": true
          }
        ]
      }
    ]
  }
}
```


### Smoothing models

For most use cases, when calculating a suggestion's score, you want to take into account not only the frequency of a shingle but also the shingle's size. Smoothing models are used to calculate scores for shingles of different sizes, balancing the weight of frequent and infrequent shingles.

The following smoothing models are supported.

Model | Description
:--- | :---
`stupid_backoff` | Backs off to lower-order n-gram models if the higher-order n-gram count is 0 and multiplies the lower-order n-gram model by a constant factor (`discount`). This is the default smoothing model.
`stupid_backoff.discount` | The factor by which to multiply the lower-order n-gram model. Optional. Default is 0.4.
`laplace` | Uses additive smoothing, adding a constant `alpha` to all counts to balance weights.
`laplace.alpha` | The constant added to all counts to balance weights, typically 1.0 or smaller. Optional. Default is 0.5.
`linear` | Calculates the score as a weighted average of the trigram, bigram, and unigram scores. Specify the weights in `trigram_lambda`, `bigram_lambda`, and `unigram_lambda`. The weights must add up to 1. A weight that you omit is set to 0.
`linear.trigram_lambda` | The weight of trigrams.
`linear.bigram_lambda` | The weight of bigrams.
`linear.unigram_lambda` | The weight of unigrams.

By default, OpenSearch uses the Stupid Backoff model---a simple algorithm that starts with the shingles of the highest order and takes lower-order shingles if higher-order shingles are not found. For example, if you set up the phrase suggester to have 3-grams, 2-grams, and 1-grams, the Stupid Backoff model first inspects the 3-grams. If there are no 3-grams, it inspects 2-grams but multiplies the score by the `discount` factor. If there are no 2-grams, it inspects 1-grams but again multiplies the score by the `discount` factor. The Stupid Backoff model works well in most cases. If you need to choose the Laplace smoothing model, specify it in the `smoothing` parameter:

```json
GET books2/_search
{
  "suggest": {
    "phrase-check": {
      "text": "design paterns",
      "phrase": {
        "field": "title.trigram",
        "size": 1,
        "smoothing": {
          "laplace": {
            "alpha": 0.7
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Candidate generators

Candidate generators provide possible suggestion terms based on the terms in the input text. There is one candidate generator available&mdash;`direct_generator`. A direct generator functions similarly to a term suggester: It is also called for each term in the input text. The phrase suggester supports multiple candidate generators, where each generator is called for each term in the input text. It also lets you specify a pre-filter (an analyzer that analyzes the input text terms before they enter the spellcheck phase) and a post-filter (an analyzer that analyzes the generated suggestions before they are returned).

Set up a direct generator for a phrase suggester:

```json
GET books2/_search
{
  "suggest": {
    "text": "design paterns",
    "phrase-check": {
      "phrase": {
        "field": "title.trigram",
        "size": 1,
        "direct_generator": [
          {
            "field": "title.trigram",
            "suggest_mode": "always",
            "min_word_length": 3
          }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

Direct generators require a constant prefix: by default, the first character of a term must be spelled correctly for the generator to suggest a correction (`prefix_length` is `1`). To also correct misspellings at the beginning of a word, add a second generator that uses a field indexed with the `reverse` token filter. The `pre_filter` reverses the characters of each input term before the generator searches for candidates, so the generator compares terms starting from their last character. The `post_filter` then restores the original character order of each candidate.

Create a `books3` index that contains a `title.trigram` subfield for the phrase suggester and a `title.reverse` subfield indexed with a `reverse` analyzer:

```json
PUT books3
{
  "settings": {
    "index": {
      "analysis": {
        "analyzer": {
          "trigram": {
            "type": "custom",
            "tokenizer": "standard",
            "filter": ["lowercase", "shingle"]
          },
          "reverse": {
            "type": "custom",
            "tokenizer": "standard",
            "filter": ["lowercase", "reverse"]
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
      "title": {
        "type": "text",
        "fields": {
          "trigram": {
            "type": "text",
            "analyzer": "trigram"
          },
          "reverse": {
            "type": "text",
            "analyzer": "reverse"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Index the documents into the new index:

```json
PUT books3/_doc/1
{
  "title": "Design Patterns"
}
```
{% include copy-curl.html %}

```json
PUT books3/_doc/2?refresh=true
{
  "title": "Software Architecture Patterns Explained"
}
```
{% include copy-curl.html %}

The following request contains the misspelling `esign`, which is missing its first letter. A single generator on `title.trigram` returns no suggestions for this text. The second generator finds `design` by searching for the reversed term:

```json
GET books3/_search
{
  "suggest": {
    "text": "esign patterns",
    "phrase-check": {
      "phrase": {
        "field": "title.trigram",
        "size": 1,
        "direct_generator": [
          {
            "field": "title.trigram",
            "suggest_mode": "always"
          },
          {
            "field": "title.reverse",
            "suggest_mode": "always",
            "pre_filter": "reverse",
            "post_filter": "reverse"
          }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the corrected phrase:

```json
{
  ...
  "suggest": {
    "phrase-check": [
      {
        "text": "esign patterns",
        "offset": 0,
        "length": 14,
        "options": [
          {
            "text": "design patterns",
            "score": 0.33112788
          }
        ]
      }
    ]
  }
}
```

You can specify the following fields in the `direct_generator` object.

Field | Description
:--- | :---
`field` | The field from which to source suggestions. Required.
`size` | The maximum number of suggestions to return for each token in the input text.
`suggest_mode` | The suggest mode specifies the terms for which suggestions generated on each shard should be included. The suggest mode is applied to suggestions for each shard and is not checked when combining suggestions from different shards. Therefore, if the suggest mode is `missing`, suggestions will be returned if the term is missing from one shard but exists on another shard. Valid values are:<br>- `missing`: Return suggestions only for the input text terms that are not in the shard. <br>- `popular`: Return suggestions only if they occur in the documents more frequently than in the original input text on the shard.<br>- `always`: Always return suggestions.<br>Default is `missing`.
`max_edits` | The maximum edit distance for suggestions. Valid values are in the [1, 2] range. Default is 2.
`prefix_length` | An integer that specifies the minimum length the matched prefix must be to start returning suggestions. If the prefix of `prefix_length` is not matched but the search term is still within the edit distance, no suggestions are returned. Default is 1. Higher values improve spellcheck performance because misspellings don’t tend to occur in the beginning of words.
`min_word_length` | The minimum length of an input term for which candidates are generated. Default is 4.
`max_inspections` | The multiplication factor for `shard_size`. The maximum number of candidate suggestions OpenSearch inspects to find suggestions is calculated as `shard_size` multiplied by `max_inspections`. May improve accuracy at the cost of decreased performance. Default is 5.
`min_doc_freq` | The minimum number or percentage of documents in which a suggestion should appear in order for it to be returned. May improve accuracy by returning only suggestions with high shard-level document frequencies. Valid values are integers that represent the document frequency or floats in the [0, 1] range that represent the percentage of documents. Default is 0 (feature disabled). 
`max_term_freq` | The maximum number of documents in which a suggestion should appear in order for it to be returned. Valid values are integers that represent the document frequency or floats in the [0, 1] range that represent the percentage of documents. Default is 0.01. Excluding high-frequency terms improves spellcheck performance because high-frequency terms are usually spelled correctly. Uses shard-level document frequencies.
`pre_filter` | An analyzer that is applied to each input text token passed to the generator before a suggestion is generated. 
`post_filter` | An analyzer that is applied to each generated suggestion before it is passed to the phrase scorer. 

## Including suggester types in the response

By default, each suggestion in the response is identified only by the name that you give the suggester in the request. If your application needs to know which type of suggester produced a result, for example, to choose how to parse it, add the `typed_keys` query parameter to the request. OpenSearch then prefixes each suggestion name with the suggester type and a `#` separator.

The following request runs a term suggester and a phrase suggester on the same input text and includes the suggester types in the response:

```json
GET /books/_search?typed_keys=true
{
  "suggest": {
    "text": "desing paterns",
    "title-terms": {
      "term": {
        "field": "title"
      }
    },
    "title-phrase": {
      "phrase": {
        "field": "title"
      }
    }
  }
}
```
{% include copy-curl.html %}

In the response, the suggestions are named `term#title-terms` and `phrase#title-phrase`:

```json
{
  ...
  "suggest": {
    "phrase#title-phrase": [
      {
        "text": "desing paterns",
        "offset": 0,
        "length": 14,
        "options": [
          {
            "text": "desing patterns",
            "score": 0.13261011
          },
          {
            "text": "design paterns",
            "score": 0.109846905
          }
        ]
      }
    ],
    "term#title-terms": [
      {
        "text": "desing",
        "offset": 0,
        "length": 6,
        "options": [
          {
            "text": "design",
            "score": 0.8333333,
            "freq": 1
          }
        ]
      },
      {
        "text": "paterns",
        "offset": 7,
        "length": 7,
        "options": [
          {
            "text": "patterns",
            "score": 0.85714287,
            "freq": 2
          }
        ]
      }
    ]
  }
}
```

The `typed_keys` parameter also adds type prefixes to aggregation names in the response.
