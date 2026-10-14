---
layout: default
title: Synonym
parent: Token filters
nav_order: 415
---

# Synonym token filter

The `synonym` token filter allows you to map multiple terms to a single term or create equivalence groups between words, improving search flexibility.

## Parameters

The `synonym` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`synonyms` | Either `synonyms` or `synonyms_path` must be specified | String | A list of synonym rules defined directly in the configuration.
`synonyms_path` | Either `synonyms` or `synonyms_path` must be specified | String |  The file path to a file containing synonym rules (either an absolute path or a path relative to the config directory).
`lenient` | Optional | Boolean | Whether to ignore exceptions when loading the rule configurations. If `true`, OpenSearch skips the synonym terms that cannot be parsed and keeps the rest of the rule. For more information, see [Synonym rules containing stop words](#synonym-rules-containing-stop-words). Default is `false`.
`format` | Optional | String | Specifies the format used to determine how OpenSearch defines and interprets synonyms. Valid values are:<br>- `solr` <br>- [`wordnet`](https://wordnet.princeton.edu/). <br> Default is `solr`.
`expand` | Optional | Boolean |  Whether to expand equivalent synonym rules. Default is `true`.<br><br>For example: <br>If `synonyms` are defined as `"quick, fast"` and `expand` is set to `true`, then the synonym rules are configured as follows:<br>- `quick => quick`<br>- `quick => fast`<br>- `fast => quick`<br>- `fast => fast`<br><br>If `expand` is set to `false`, the synonym rules are configured as follows:<br>- `quick => quick`<br>- `fast => quick`
`synonym_analyzer` | Optional | String | The name of the analyzer that parses the synonym rules. Specify any analyzer available to the index: a built-in analyzer (such as `standard`, `simple`, `stop`, `whitespace`, or `keyword`), a language analyzer, an analyzer registered by a plugin, or a custom analyzer defined in the same index. If the named analyzer cannot be resolved, OpenSearch parses the rules using the analysis chain in which this filter is defined and returns no error. By default, the analysis chain is used. For more information, see [Parsing synonym rules](#parsing-synonym-rules).

## Example: Solr format

The following example request creates a new index named `my-synonym-index` and configures an analyzer with a `synonym` filter. The filter is configured with the default `solr` rule format:

```json
PUT /my-synonym-index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_synonym_filter": {
          "type": "synonym",
          "synonyms": [
            "car, automobile",
            "quick, fast, speedy",
            "laptop => computer"
          ]
        }
      },
      "analyzer": {
        "my_synonym_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_synonym_filter"
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
GET /my-synonym-index/_analyze
{
  "analyzer": "my_synonym_analyzer",
  "text": "The quick dog jumps into the car with a laptop"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "the",
      "start_offset": 0,
      "end_offset": 3,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "quick",
      "start_offset": 4,
      "end_offset": 9,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "fast",
      "start_offset": 4,
      "end_offset": 9,
      "type": "SYNONYM",
      "position": 1
    },
    {
      "token": "speedy",
      "start_offset": 4,
      "end_offset": 9,
      "type": "SYNONYM",
      "position": 1
    },
    {
      "token": "dog",
      "start_offset": 10,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "jumps",
      "start_offset": 14,
      "end_offset": 19,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "into",
      "start_offset": 20,
      "end_offset": 24,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "the",
      "start_offset": 25,
      "end_offset": 28,
      "type": "<ALPHANUM>",
      "position": 5
    },
    {
      "token": "car",
      "start_offset": 29,
      "end_offset": 32,
      "type": "<ALPHANUM>",
      "position": 6
    },
    {
      "token": "automobile",
      "start_offset": 29,
      "end_offset": 32,
      "type": "SYNONYM",
      "position": 6
    },
    {
      "token": "with",
      "start_offset": 33,
      "end_offset": 37,
      "type": "<ALPHANUM>",
      "position": 7
    },
    {
      "token": "a",
      "start_offset": 38,
      "end_offset": 39,
      "type": "<ALPHANUM>",
      "position": 8
    },
    {
      "token": "computer",
      "start_offset": 40,
      "end_offset": 46,
      "type": "SYNONYM",
      "position": 9
    }
  ]
}
```

## Example: WordNet format

The following example request creates a new index named `my-wordnet-index` and configures an analyzer with a `synonym` filter. The filter is configured with the [`wordnet`](https://wordnet.princeton.edu/) rule format:

```json
PUT /my-wordnet-index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_wordnet_synonym_filter": {
          "type": "synonym",
          "format": "wordnet",
          "synonyms": [
            "s(100000001,1,'fast',v,1,0).",
            "s(100000001,2,'quick',v,1,0).",
            "s(100000001,3,'swift',v,1,0)."
          ]
        }
      },
      "analyzer": {
        "my_wordnet_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_wordnet_synonym_filter"
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
GET /my-wordnet-index/_analyze
{
  "analyzer": "my_wordnet_analyzer",
  "text": "I have a fast car"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "i",
      "start_offset": 0,
      "end_offset": 1,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "have",
      "start_offset": 2,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "a",
      "start_offset": 7,
      "end_offset": 8,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "fast",
      "start_offset": 9,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "quick",
      "start_offset": 9,
      "end_offset": 13,
      "type": "SYNONYM",
      "position": 3
    },
    {
      "token": "swift",
      "start_offset": 9,
      "end_offset": 13,
      "type": "SYNONYM",
      "position": 3
    },
    {
      "token": "car",
      "start_offset": 14,
      "end_offset": 17,
      "type": "<ALPHANUM>",
      "position": 4
    }
  ]
}
```

## Parsing synonym rules

Unless you specify a `synonym_analyzer`, OpenSearch parses synonym rules using the tokenizer and the token filters that precede `synonym` in the analyzer. This applies the same processing to the rules as to the text. For example, if the `porter_stem` filter precedes `synonym`, the rule `running shoes, trainers` is stored as `run shoe, trainer`. The rule then matches both `running shoes` and `run shoe`.

A synonym rule can contain only one token at each position, so token filters that produce several tokens at the same position are handled as follows when they precede `synonym`:

- Some filters produce only one version of each token when parsing rules. For example, the [`asciifolding`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/asciifolding/) filter with `preserve_original` set to `true` produces only the folded token. Given the rule `café, coffee shop`, the text `coffee shop` produces the synonym `cafe`, not `café`.
- The [`word_delimiter`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/word-delimiter/), [`word_delimiter_graph`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/word-delimiter-graph/), [`ngram`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/ngram/), [`edge_ngram`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/edge-ngram/), [`shingle`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/shingle/), and [`multiplexer`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/multiplexer/) filters cannot parse synonym rules. If one of them precedes `synonym`, OpenSearch rejects the request to create the index.

To use one of these filters in the same analyzer as `synonym`, set `synonym_analyzer` to an analyzer that does not contain the filter. OpenSearch then parses the rules using that analyzer and applies the filter only to the text.

## Synonym rules containing stop words

If a [`stop`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/stop/) filter precedes `synonym`, it also removes stop words from the synonym rules. By default, OpenSearch rejects the request to create the index if a term in a rule contains a stop word. If you set `lenient` to `true`, OpenSearch skips each term that contains a stop word and keeps the rest of the rule.

The following example request creates an index containing a `stop` filter that removes `the` and a `synonym` filter whose rule contains the term `the flask`:

```json
PUT /kitchenware
{
  "settings": {
    "analysis": {
      "filter": {
        "my_stop_filter": {
          "type": "stop",
          "stopwords": ["the"]
        },
        "my_synonym_filter": {
          "type": "synonym",
          "lenient": true,
          "synonyms": ["flask, the flask, thermos"]
        }
      },
      "analyzer": {
        "my_synonym_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_stop_filter",
            "my_synonym_filter"
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

OpenSearch skips `the flask` and keeps `flask` and `thermos` as synonyms. Use the following request to analyze the text `thermos`:

```json
GET /kitchenware/_analyze
{
  "analyzer": "my_synonym_analyzer",
  "text": "thermos"
}
```
{% include copy-curl.html %}

The response contains the synonym `flask`:

```json
{
  "tokens": [
    {
      "token": "thermos",
      "start_offset": 0,
      "end_offset": 7,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "flask",
      "start_offset": 0,
      "end_offset": 7,
      "type": "SYNONYM",
      "position": 0
    }
  ]
}
```

If the skipped term is the one that other terms map to, the rule adds no synonyms. The following table shows how OpenSearch handles other rules when `lenient` is `true` and `the` is a stop word.

Rule | `expand` | Result
:--- | :--- | :---
`flask, thermos => the flask` | `true` | No synonyms are added because the replacement term contains a stop word.
`the flask, flask, thermos` | `false` | No synonyms are added because, when `expand` is `false`, all terms map to the first term, which contains a stop word.
`flask, the flask, thermos` | `false` | `thermos` maps to `flask`.
