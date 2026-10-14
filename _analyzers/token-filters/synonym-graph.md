---
layout: default
title: Synonym graph
parent: Token filters
nav_order: 420
---

# Synonym graph token filter

The `synonym_graph` token filter is a more advanced version of the `synonym` token filter. It supports multiword synonyms and processes synonyms across multiple tokens, making it ideal for phrases or scenarios in which relationships between tokens are important.

Use the `synonym_graph` filter only in a [search analyzer]({{site.url}}{{site.baseurl}}/analyzers/search-analyzers/#specifying-a-search-analyzer-in-the-mappings). At index time, OpenSearch ignores the `positionLength` of each token, so a multiword synonym shifts the positions of the tokens that follow it. For example, if an index analyzer maps `ev` to `electric car`, then `charger` in the text `ev charger` is indexed at position 2, and a `match_phrase` query for `ev charger` no longer matches the document. To apply synonyms at index time, use the [`synonym`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/synonym/) token filter.
{: .note}

## Parameters

The `synonym_graph` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`synonyms` | Either `synonyms` or `synonyms_path` must be specified | String | A list of synonym rules defined directly in the configuration.
`synonyms_path` | Either `synonyms` or `synonyms_path` must be specified | String | The file path to a file containing synonym rules (either an absolute path or a path relative to the config directory).
`lenient` | Optional | Boolean | Whether to ignore exceptions when loading the rule configurations. If `true`, OpenSearch skips the synonym terms that cannot be parsed and keeps the rest of the rule. For more information, see [Synonym rules containing stop words](#synonym-rules-containing-stop-words). Default is `false`.
`format` | Optional | String | Specifies the format used to determine how OpenSearch defines and interprets synonyms. Valid values are:<br>- `solr` <br>- [`wordnet`](https://wordnet.princeton.edu/). <br> Default is `solr`.
`expand` | Optional | Boolean |  Whether to expand equivalent synonym rules. Default is `true`.<br><br>For example: <br>If `synonyms` are defined as `"quick, fast"` and `expand` is set to `true`, then the synonym rules are configured as follows:<br>- `quick => quick`<br>- `quick => fast`<br>- `fast => quick`<br>- `fast => fast`<br><br>If `expand` is set to `false`, the synonym rules are configured as follows:<br>- `quick => quick`<br>- `fast => quick`
`synonym_analyzer` | Optional | String | The name of the analyzer that parses the synonym rules. Specify any analyzer available to the index: a built-in analyzer (such as `standard`, `simple`, `stop`, `whitespace`, or `keyword`), a language analyzer, an analyzer registered by a plugin, or a custom analyzer defined in the same index. If the named analyzer cannot be resolved, OpenSearch parses the rules using the analysis chain in which this filter is defined and returns no error. By default, the analysis chain is used. For more information, see [Parsing synonym rules](#parsing-synonym-rules).

## Example: Solr format

The following example request creates a new index named `my-index` and configures an analyzer with a `synonym_graph` filter. The filter is configured with the default `solr` rule format:

```json
PUT /my-index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_synonym_graph_filter": {
          "type": "synonym_graph",
          "synonyms": [
            "sports car, race car",
            "fast car, speedy vehicle",
            "luxury car, premium vehicle",
            "electric car, EV"
          ]
        }
      },
      "analyzer": {
        "my_synonym_graph_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_synonym_graph_filter"
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
GET /my-index/_analyze
{
  "analyzer": "my_synonym_graph_analyzer",
  "text": "I just bought a sports car and it is a fast car."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "i","start_offset": 0,"end_offset": 1,"type": "<ALPHANUM>","position": 0},
    {"token": "just","start_offset": 2,"end_offset": 6,"type": "<ALPHANUM>","position": 1},
    {"token": "bought","start_offset": 7,"end_offset": 13,"type": "<ALPHANUM>","position": 2},
    {"token": "a","start_offset": 14,"end_offset": 15,"type": "<ALPHANUM>","position": 3},
    {"token": "race","start_offset": 16,"end_offset": 26,"type": "SYNONYM","position": 4},
    {"token": "sports","start_offset": 16,"end_offset": 22,"type": "<ALPHANUM>","position": 4,"positionLength": 2},
    {"token": "car","start_offset": 16,"end_offset": 26,"type": "SYNONYM","position": 5,"positionLength": 2},
    {"token": "car","start_offset": 23,"end_offset": 26,"type": "<ALPHANUM>","position": 6},
    {"token": "and","start_offset": 27,"end_offset": 30,"type": "<ALPHANUM>","position": 7},
    {"token": "it","start_offset": 31,"end_offset": 33,"type": "<ALPHANUM>","position": 8},
    {"token": "is","start_offset": 34,"end_offset": 36,"type": "<ALPHANUM>","position": 9},
    {"token": "a","start_offset": 37,"end_offset": 38,"type": "<ALPHANUM>","position": 10},
    {"token": "speedy","start_offset": 39,"end_offset": 47,"type": "SYNONYM","position": 11},
    {"token": "fast","start_offset": 39,"end_offset": 43,"type": "<ALPHANUM>","position": 11,"positionLength": 2},
    {"token": "vehicle","start_offset": 39,"end_offset": 47,"type": "SYNONYM","position": 12,"positionLength": 2},
    {"token": "car","start_offset": 44,"end_offset": 47,"type": "<ALPHANUM>","position": 13}
  ]
}
```

## Example: WordNet format

The following example request creates a new index named `my-wordnet-index` and configures an analyzer with a `synonym_graph` filter. The filter is configured with the [`wordnet`](https://wordnet.princeton.edu/) rule format:

```json
PUT /my-wordnet-index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_synonym_graph_filter": {
          "type": "synonym_graph",
          "format": "wordnet",
          "synonyms": [
            "s(100000001, 1, 'sports car', n, 1, 0).",
            "s(100000001, 2, 'race car', n, 1, 0).",
            "s(100000001, 3, 'fast car', n, 1, 0).",
            "s(100000001, 4, 'speedy vehicle', n, 1, 0)."
          ]
        }
      },
      "analyzer": {
        "my_synonym_graph_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_synonym_graph_filter"
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
  "analyzer": "my_synonym_graph_analyzer",
  "text": "I just bought a sports car and it is a fast car."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "i","start_offset": 0,"end_offset": 1,"type": "<ALPHANUM>","position": 0},
    {"token": "just","start_offset": 2,"end_offset": 6,"type": "<ALPHANUM>","position": 1},
    {"token": "bought","start_offset": 7,"end_offset": 13,"type": "<ALPHANUM>","position": 2},
    {"token": "a","start_offset": 14,"end_offset": 15,"type": "<ALPHANUM>","position": 3},
    {"token": "race","start_offset": 16,"end_offset": 26,"type": "SYNONYM","position": 4},
    {"token": "fast","start_offset": 16,"end_offset": 26,"type": "SYNONYM","position": 4,"positionLength": 2},
    {"token": "speedy","start_offset": 16,"end_offset": 26,"type": "SYNONYM","position": 4,"positionLength": 3},
    {"token": "sports","start_offset": 16,"end_offset": 22,"type": "<ALPHANUM>","position": 4,"positionLength": 4},
    {"token": "car","start_offset": 16,"end_offset": 26,"type": "SYNONYM","position": 5,"positionLength": 4},
    {"token": "car","start_offset": 16,"end_offset": 26,"type": "SYNONYM","position": 6,"positionLength": 3},
    {"token": "vehicle","start_offset": 16,"end_offset": 26,"type": "SYNONYM","position": 7,"positionLength": 2},
    {"token": "car","start_offset": 23,"end_offset": 26,"type": "<ALPHANUM>","position": 8},
    {"token": "and","start_offset": 27,"end_offset": 30,"type": "<ALPHANUM>","position": 9},
    {"token": "it","start_offset": 31,"end_offset": 33,"type": "<ALPHANUM>","position": 10},
    {"token": "is","start_offset": 34,"end_offset": 36,"type": "<ALPHANUM>","position": 11},
    {"token": "a","start_offset": 37,"end_offset": 38,"type": "<ALPHANUM>","position": 12},
    {"token": "sports","start_offset": 39,"end_offset": 47,"type": "SYNONYM","position": 13},
    {"token": "race","start_offset": 39,"end_offset": 47,"type": "SYNONYM","position": 13,"positionLength": 2},
    {"token": "speedy","start_offset": 39,"end_offset": 47,"type": "SYNONYM","position": 13,"positionLength": 3},
    {"token": "fast","start_offset": 39,"end_offset": 43,"type": "<ALPHANUM>","position": 13,"positionLength": 4},
    {"token": "car","start_offset": 39,"end_offset": 47,"type": "SYNONYM","position": 14,"positionLength": 4},
    {"token": "car","start_offset": 39,"end_offset": 47,"type": "SYNONYM","position": 15,"positionLength": 3},
    {"token": "vehicle","start_offset": 39,"end_offset": 47,"type": "SYNONYM","position": 16,"positionLength": 2},
    {"token": "car","start_offset": 44,"end_offset": 47,"type": "<ALPHANUM>","position": 17}
  ]
}
```

## Parsing synonym rules

Unless you specify a `synonym_analyzer`, OpenSearch parses synonym rules using the tokenizer and the token filters that precede `synonym_graph` in the analyzer. This applies the same processing to the rules as to the text. For example, if the `porter_stem` filter precedes `synonym_graph`, the rule `running shoes, trainers` is stored as `run shoe, trainer`. The rule then matches both `running shoes` and `run shoe`.

A synonym rule can contain only one token at each position, so token filters that produce several tokens at the same position are handled as follows when they precede `synonym_graph`:

- Some filters produce only one version of each token when parsing rules. For example, the [`asciifolding`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/asciifolding/) filter with `preserve_original` set to `true` produces only the folded token. Given the rule `café, coffee shop`, the text `coffee shop` produces the synonym `cafe`, not `café`.
- The [`word_delimiter_graph`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/word-delimiter-graph/), [`ngram`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/ngram/), [`edge_ngram`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/edge-ngram/), [`shingle`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/shingle/), and [`multiplexer`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/multiplexer/) filters cannot parse synonym rules. If one of them precedes `synonym_graph`, OpenSearch rejects the request to create the index.

To use one of these filters in the same analyzer as `synonym_graph`, set `synonym_analyzer` to an analyzer that does not contain the filter. OpenSearch then parses the rules using that analyzer and applies the filter only to the text.

## Synonym rules containing stop words

If a [`stop`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/stop/) filter precedes `synonym_graph`, it also removes stop words from the synonym rules. By default, OpenSearch rejects the request to create the index if a term in a rule contains a stop word. If you set `lenient` to `true`, OpenSearch skips each term that contains a stop word and keeps the rest of the rule.

The following example request creates an index containing a `stop` filter that removes `the` and a `synonym_graph` filter whose rule contains the term `the flask`:

```json
PUT /drinkware
{
  "settings": {
    "analysis": {
      "filter": {
        "my_stop_filter": {
          "type": "stop",
          "stopwords": ["the"]
        },
        "my_synonym_graph_filter": {
          "type": "synonym_graph",
          "lenient": true,
          "synonyms": ["flask, the flask, thermos"]
        }
      },
      "analyzer": {
        "my_synonym_graph_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_stop_filter",
            "my_synonym_graph_filter"
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
GET /drinkware/_analyze
{
  "analyzer": "my_synonym_graph_analyzer",
  "text": "thermos"
}
```
{% include copy-curl.html %}

The response contains the synonym `flask`:

```json
{
  "tokens": [
    {
      "token": "flask",
      "start_offset": 0,
      "end_offset": 7,
      "type": "SYNONYM",
      "position": 0
    },
    {
      "token": "thermos",
      "start_offset": 0,
      "end_offset": 7,
      "type": "<ALPHANUM>",
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

If a `stop` filter follows `synonym_graph`, the stop words are removed from the synonym graph after synonym matching, which breaks the graph. For example, given the rule `thermos, the flask` and a `stop` filter that follows `synonym_graph`, a `match` query for `the flask` searches only for `thermos` and does not match documents containing `flask`. Remove such words from the synonym rules, or place the `stop` filter before `synonym_graph`.
{: .warning}
