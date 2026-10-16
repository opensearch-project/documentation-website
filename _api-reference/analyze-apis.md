---
layout: default
title: Analyze API
nav_order: 5
redirect_from:
  - /api-reference/analyze-apis/perform-text-analysis/
  - /opensearch/rest-api/analyze-apis/
  - /api-reference/analyze-apis/terminology/
  - /api-reference/analyze-apis/index/
---

# Analyze API
**Introduced 1.0**
{: .label .label-purple }

The Analyze API allows you to perform [text analysis]({{site.url}}{{site.baseurl}}/analyzers/), which is the process of converting unstructured text into individual tokens (usually words) that are optimized for search. For more information about common analysis components such as character filters, tokenizers, token filters, and normalizers, see [Analyzers]({{site.url}}{{site.baseurl}}/analyzers/#analyzers).

The Analyze API analyzes a text string and returns the resulting tokens.

## Endpoints

```json
GET /_analyze
GET /{index}/_analyze
POST /_analyze
POST /{index}/_analyze
```

## Path parameter

You can include the following optional path parameter in your request.

Parameter | Data type | Description
:--- | :--- | :---
`index` | String | Index that is used to derive the analyzer.

## Query parameters

You can include the following optional query parameter in your request.

Parameter | Data type | Description
:--- | :--- | :---
`index` | String | Index that is used to derive the analyzer. Use this parameter as an alternative to the `index` path parameter.

## Request body fields

The following table lists the available request body fields.

Field | Data type | Description
:--- | :--- | :---
`text` | String or Array of Strings | The text to analyze. If you provide an array of strings, the text is analyzed as a multi-value field. Required.
`analyzer` | String | The name of the analyzer to apply to the `text` field. The analyzer can be built or configured in the index.<br /><br />If `analyzer` is not specified, the Analyze API uses the analyzer defined in the mapping of the `field` field.<br /><br />If the `field` field is not specified, the Analyze API uses the default analyzer for the index.<br /><br /> If no index is specified or the index does not have a default analyzer, the Analyze API uses the [standard analyzer]({{site.url}}{{site.baseurl}}/analyzers/supported-analyzers/standard/). Optional. See [Analyzers]({{site.url}}{{site.baseurl}}/analyzers/supported-analyzers/index/).
`attributes` | Array of Strings | An array of token attributes to include in the `detail` output. Applies only when `explain` is `true`.
`char_filter` | Array of strings or objects | An array of character filters for preprocessing characters before the `tokenizer` field. Each array element is either the name of a character filter or an inline character filter definition. Optional. See [Character filters]({{site.url}}{{site.baseurl}}/analyzers/character-filters/index/).
`explain` | Boolean | If `true`, causes the response to include token attributes and additional details. Optional. Default is `false`.
`field` | String | The field for deriving the analyzer. <br /><br /> If you specify `field`, you must also specify the `index` path parameter. <br /><br /> If you specify the `analyzer` field, it overrides the value of `field`. <br /><br /> If the field is not mapped, the Analyze API uses the default analyzer for the index. Optional.
`filter` | Array of strings or objects | Array of token filters to apply after the `tokenizer` field. Each array element is either the name of a token filter or an inline token filter definition. Optional. See [Token filters]({{site.url}}{{site.baseurl}}/analyzers/token-filters/index/).
`normalizer` | String | A normalizer for converting text into a single token. If you specify `normalizer`, you must also specify the `index` path parameter. Optional. See [Normalizers]({{site.url}}{{site.baseurl}}/analyzers/normalizers/). 
`tokenizer` | String or Object | A tokenizer for converting the `text` field into tokens. Specify either the name of a tokenizer or an inline tokenizer definition. Optional. See [Tokenizers]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/index/).

The `analyzer`, `normalizer`, and `field` fields cannot be combined with the `tokenizer`, `filter`, or `char_filter` fields. The `analyzer` and `normalizer` fields cannot be combined with each other. If you specify `filter` or `char_filter` without `tokenizer`, the Analyze API builds a custom normalizer from the filters, so you can only use filters that are supported in normalizers.

## Example requests

[Analyze array of text strings](#analyze-array-of-text-strings)

[Apply a built-in analyzer](#apply-a-built-in-analyzer)

[Apply a custom analyzer](#apply-a-custom-analyzer)

[Apply a custom transient analyzer](#apply-a-custom-transient-analyzer)

[Specify an index](#specify-an-index)

[Derive the analyzer from an index field](#derive-the-analyzer-from-an-index-field)

[Specify a normalizer](#specify-a-normalizer)

[Get token details](#get-token-details)

[Set a token limit](#set-a-token-limit)

Some of the following examples use the `books` and `books2` indexes. To run these examples, first create the `books` index using the default settings:

```json
PUT /books
```
{% include copy-curl.html %}

Then create the `books2` index. The index defines a custom analyzer named `lowercase_ascii_folding` and a custom normalizer named `to_lower_fold_ascii`, both of which convert text to lowercase and convert non-ASCII characters to ASCII. The index also maps the `name` field as a `text` field:

```json
PUT /books2
{
  "settings": {
    "analysis": {
      "analyzer": {
        "lowercase_ascii_folding": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "asciifolding"]
        }
      },
      "normalizer": {
        "to_lower_fold_ascii": {
          "type": "custom",
          "filter": ["lowercase", "asciifolding"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

### Analyze array of text strings

When you pass an array of strings to the `text` field, it is analyzed as a multi-value field.

<!-- spec_insert_start
component: example_code
rest: GET /_analyze
body: |
{
  "analyzer" : "standard",
  "text" : ["first array element", "second array element"]
}
-->
{% capture step1_rest %}
GET /_analyze
{
  "analyzer": "standard",
  "text": [
    "first array element",
    "second array element"
  ]
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.analyze(
  body =   {
    "analyzer": "standard",
    "text": [
      "first array element",
      "second array element"
    ]
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The previous request returns the following fields:

````json
{
  "tokens" : [
    {
      "token" : "first",
      "start_offset" : 0,
      "end_offset" : 5,
      "type" : "<ALPHANUM>",
      "position" : 0
    },
    {
      "token" : "array",
      "start_offset" : 6,
      "end_offset" : 11,
      "type" : "<ALPHANUM>",
      "position" : 1
    },
    {
      "token" : "element",
      "start_offset" : 12,
      "end_offset" : 19,
      "type" : "<ALPHANUM>",
      "position" : 2
    },
    {
      "token" : "second",
      "start_offset" : 20,
      "end_offset" : 26,
      "type" : "<ALPHANUM>",
      "position" : 3
    },
    {
      "token" : "array",
      "start_offset" : 27,
      "end_offset" : 32,
      "type" : "<ALPHANUM>",
      "position" : 4
    },
    {
      "token" : "element",
      "start_offset" : 33,
      "end_offset" : 40,
      "type" : "<ALPHANUM>",
      "position" : 5
    }
  ]
}
````

### Apply a built-in analyzer

You can apply any of the built-in analyzers to the text string without specifying an index.

The following request analyzes text using the `standard` built-in analyzer:

<!-- spec_insert_start
component: example_code
rest: GET /_analyze
body: |
{
  "analyzer" : "standard",
  "text" : "OpenSearch text analysis"
}
-->
{% capture step1_rest %}
GET /_analyze
{
  "analyzer": "standard",
  "text": "OpenSearch text analysis"
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.analyze(
  body =   {
    "analyzer": "standard",
    "text": "OpenSearch text analysis"
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The previous request returns the following fields:

````json
{
  "tokens" : [
    {
      "token" : "opensearch",
      "start_offset" : 0,
      "end_offset" : 10,
      "type" : "<ALPHANUM>",
      "position" : 0
    },
    {
      "token" : "text",
      "start_offset" : 11,
      "end_offset" : 15,
      "type" : "<ALPHANUM>",
      "position" : 1
    },
    {
      "token" : "analysis",
      "start_offset" : 16,
      "end_offset" : 24,
      "type" : "<ALPHANUM>",
      "position" : 2
    }
  ]
}
````

### Apply a custom analyzer

You can create your own analyzer and specify it in an analyze request.

The `books2` index defines the custom `lowercase_ascii_folding` analyzer, which converts text to lowercase and converts non-ASCII characters to ASCII.

The following request applies the custom analyzer to the provided text:

<!-- spec_insert_start
component: example_code
rest: GET /books2/_analyze
body: |
{
  "analyzer": "lowercase_ascii_folding",
  "text" : "Le garçon m'a SUIVI."
}
-->
{% capture step1_rest %}
GET /books2/_analyze
{
  "analyzer": "lowercase_ascii_folding",
  "text": "Le garçon m'a SUIVI."
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.analyze(
  index = "books2",
  body =   {
    "analyzer": "lowercase_ascii_folding",
    "text": "Le garçon m'a SUIVI."
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The previous request returns the following fields:

````json
{
  "tokens" : [
    {
      "token" : "le",
      "start_offset" : 0,
      "end_offset" : 2,
      "type" : "<ALPHANUM>",
      "position" : 0
    },
    {
      "token" : "garcon",
      "start_offset" : 3,
      "end_offset" : 9,
      "type" : "<ALPHANUM>",
      "position" : 1
    },
    {
      "token" : "m'a",
      "start_offset" : 10,
      "end_offset" : 13,
      "type" : "<ALPHANUM>",
      "position" : 2
    },
    {
      "token" : "suivi",
      "start_offset" : 14,
      "end_offset" : 19,
      "type" : "<ALPHANUM>",
      "position" : 3
    }
  ]
}
````

### Apply a custom transient analyzer

You can build a custom transient analyzer from tokenizers, token filters, or character filters. Use the `filter` parameter to specify token filters and the `char_filter` parameter to specify character filters.

The following request uses the `uppercase` token filter to convert the text to uppercase:

<!-- spec_insert_start
component: example_code
rest: GET /_analyze
body: |
{
  "tokenizer" : "keyword",
  "filter" : ["uppercase"],
  "text" : "OpenSearch filter"
}
-->
{% capture step1_rest %}
GET /_analyze
{
  "tokenizer": "keyword",
  "filter": [
    "uppercase"
  ],
  "text": "OpenSearch filter"
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.analyze(
  body =   {
    "tokenizer": "keyword",
    "filter": [
      "uppercase"
    ],
    "text": "OpenSearch filter"
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The previous request returns the following fields:

````json
{
  "tokens" : [
    {
      "token" : "OPENSEARCH FILTER",
      "start_offset" : 0,
      "end_offset" : 17,
      "type" : "word",
      "position" : 0
    }
  ]
}
````
<hr />

The following request uses the `html_strip` character filter to remove HTML tags from the text:

<!-- spec_insert_start
component: example_code
rest: GET /_analyze
body: |
{
  "tokenizer" : "keyword",
  "filter" : ["lowercase"],
  "char_filter" : ["html_strip"],
  "text" : "<b>Leave</b> right now!"
}
-->
{% capture step1_rest %}
GET /_analyze
{
  "tokenizer": "keyword",
  "filter": [
    "lowercase"
  ],
  "char_filter": [
    "html_strip"
  ],
  "text": "<b>Leave</b> right now!"
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.analyze(
  body =   {
    "tokenizer": "keyword",
    "filter": [
      "lowercase"
    ],
    "char_filter": [
      "html_strip"
    ],
    "text": "<b>Leave</b> right now!"
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The previous request returns the following fields:

````json
{
  "tokens" : [
    {
      "token" : "leave right now!",
      "start_offset" : 3,
      "end_offset" : 23,
      "type" : "word",
      "position" : 0
    }
  ]
}
````

<hr />

You can combine filters using an array.

The following request combines a `lowercase` translation with a `stop` filter that removes the words in the `stopwords` array:

<!-- spec_insert_start
component: example_code
rest: GET /_analyze
body: |
{
  "tokenizer" : "whitespace",
  "filter" : ["lowercase", {"type": "stop", "stopwords": [ "to", "in"]}],
  "text" : "how to train your dog in five steps"
}
-->
{% capture step1_rest %}
GET /_analyze
{
  "tokenizer": "whitespace",
  "filter": [
    "lowercase",
    {
      "type": "stop",
      "stopwords": [
        "to",
        "in"
      ]
    }
  ],
  "text": "how to train your dog in five steps"
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.analyze(
  body =   {
    "tokenizer": "whitespace",
    "filter": [
      "lowercase",
      {
        "type": "stop",
        "stopwords": [
          "to",
          "in"
        ]
      }
    ],
    "text": "how to train your dog in five steps"
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The previous request returns the following fields:

````json
{
  "tokens" : [
    {
      "token" : "how",
      "start_offset" : 0,
      "end_offset" : 3,
      "type" : "word",
      "position" : 0
    },
    {
      "token" : "train",
      "start_offset" : 7,
      "end_offset" : 12,
      "type" : "word",
      "position" : 2
    },
    {
      "token" : "your",
      "start_offset" : 13,
      "end_offset" : 17,
      "type" : "word",
      "position" : 3
    },
    {
      "token" : "dog",
      "start_offset" : 18,
      "end_offset" : 21,
      "type" : "word",
      "position" : 4
    },
    {
      "token" : "five",
      "start_offset" : 25,
      "end_offset" : 29,
      "type" : "word",
      "position" : 6
    },
    {
      "token" : "steps",
      "start_offset" : 30,
      "end_offset" : 35,
      "type" : "word",
      "position" : 7
    }
  ]
}
````

### Specify an index

You can analyze text using an index's default analyzer, or you can specify a different analyzer.

The following request analyzes the provided text using the default analyzer associated with the `books` index:

<!-- spec_insert_start
component: example_code
rest: GET /books/_analyze
body: |
{
  "text" : "OpenSearch analyze test"
}
-->
{% capture step1_rest %}
GET /books/_analyze
{
  "text": "OpenSearch analyze test"
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.analyze(
  index = "books",
  body =   {
    "text": "OpenSearch analyze test"
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The previous request returns the following fields:

````json
{
  "tokens" : [
    {
      "token" : "opensearch",
      "start_offset" : 0,
      "end_offset" : 10,
      "type" : "<ALPHANUM>",
      "position" : 0
    },
    {
      "token" : "analyze",
      "start_offset" : 11,
      "end_offset" : 18,
      "type" : "<ALPHANUM>",
      "position" : 1
    },
    {
      "token" : "test",
      "start_offset" : 19,
      "end_offset" : 23,
      "type" : "<ALPHANUM>",
      "position" : 2
    }
  ]
}
````

<hr />

The following request analyzes the provided text using the `keyword` analyzer, which returns the entire text value as a single token:

<!-- spec_insert_start
component: example_code
rest: GET /books/_analyze
body: |
{
  "analyzer" : "keyword",
  "text" : "OpenSearch analyze test"
}
-->
{% capture step1_rest %}
GET /books/_analyze
{
  "analyzer": "keyword",
  "text": "OpenSearch analyze test"
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.analyze(
  index = "books",
  body =   {
    "analyzer": "keyword",
    "text": "OpenSearch analyze test"
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The previous request returns the following fields:

````json
{
  "tokens" : [
    {
      "token" : "OpenSearch analyze test",
      "start_offset" : 0,
      "end_offset" : 23,
      "type" : "word",
      "position" : 0
    }
  ]
}
````

### Derive the analyzer from an index field

You can pass text and a field in the index. The API looks up the field's analyzer and uses it to analyze the text.

If the field is not mapped, the API uses the index's default analyzer.

The following request causes the analysis to be based on the mapping for `name`:

<!-- spec_insert_start
component: example_code
rest: GET /books2/_analyze
body: |
{
  "field" : "name",
  "text" : "OpenSearch analyze test"
}
-->
{% capture step1_rest %}
GET /books2/_analyze
{
  "field": "name",
  "text": "OpenSearch analyze test"
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.analyze(
  index = "books2",
  body =   {
    "field": "name",
    "text": "OpenSearch analyze test"
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The previous request returns the following fields:

````json
{
  "tokens" : [
    {
      "token" : "opensearch",
      "start_offset" : 0,
      "end_offset" : 10,
      "type" : "<ALPHANUM>",
      "position" : 0
    },
    {
      "token" : "analyze",
      "start_offset" : 11,
      "end_offset" : 18,
      "type" : "<ALPHANUM>",
      "position" : 1
    },
    {
      "token" : "test",
      "start_offset" : 19,
      "end_offset" : 23,
      "type" : "<ALPHANUM>",
      "position" : 2
    }
  ]
}
````

### Specify a normalizer

You can analyze text using a normalizer defined in the index. A normalizer produces a single token from the text.

The `books2` index defines the custom `to_lower_fold_ascii` normalizer, which converts text to lowercase and converts non-ASCII characters to ASCII.

The following request applies `to_lower_fold_ascii` to the text:

<!-- spec_insert_start
component: example_code
rest: GET /books2/_analyze
body: |
{
  "normalizer" : "to_lower_fold_ascii",
  "text" : "C'est le garçon qui m'a suivi."
}
-->
{% capture step1_rest %}
GET /books2/_analyze
{
  "normalizer": "to_lower_fold_ascii",
  "text": "C'est le garçon qui m'a suivi."
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.analyze(
  index = "books2",
  body =   {
    "normalizer": "to_lower_fold_ascii",
    "text": "C'est le garçon qui m'a suivi."
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The previous request returns the following fields:

````json
{
  "tokens" : [
    {
      "token" : "c'est le garcon qui m'a suivi.",
      "start_offset" : 0,
      "end_offset" : 30,
      "type" : "word",
      "position" : 0
    }
  ]
}
````

<hr />

You can create a custom transient normalizer by specifying token filters or character filters without a tokenizer. Only filters that are supported in normalizers can be used.

The following request uses the `uppercase` token filter to convert the given text to all uppercase:

<!-- spec_insert_start
component: example_code
rest: GET /_analyze
body: |
{
  "filter" : ["uppercase"],
  "text" : "That is the boy who followed me."
}
-->
{% capture step1_rest %}
GET /_analyze
{
  "filter": [
    "uppercase"
  ],
  "text": "That is the boy who followed me."
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.analyze(
  body =   {
    "filter": [
      "uppercase"
    ],
    "text": "That is the boy who followed me."
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The previous request returns the following fields:

````json
{
  "tokens" : [
    {
      "token" : "THAT IS THE BOY WHO FOLLOWED ME.",
      "start_offset" : 0,
      "end_offset" : 32,
      "type" : "word",
      "position" : 0
    }
  ]
}
````

### Get token details

You can obtain additional details for all tokens by setting the `explain` field to `true`. To limit the token attributes in the output, specify them in the `attributes` array.

The following request provides detailed token information for the `reverse` filter used with the `standard` tokenizer and includes only the `bytes` attribute:

<!-- spec_insert_start
component: example_code
rest: GET /_analyze
body: |
{
  "tokenizer" : "standard",
  "filter" : ["reverse"],
  "text" : "OpenSearch analyze test",
  "explain" : true,
  "attributes" : ["bytes"]
}
-->
{% capture step1_rest %}
GET /_analyze
{
  "tokenizer": "standard",
  "filter": [
    "reverse"
  ],
  "text": "OpenSearch analyze test",
  "explain": true,
  "attributes": [
    "bytes"
  ]
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.analyze(
  body =   {
    "tokenizer": "standard",
    "filter": [
      "reverse"
    ],
    "text": "OpenSearch analyze test",
    "explain": true,
    "attributes": [
      "bytes"
    ]
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The previous request returns the following fields:

````json
{
  "detail" : {
    "custom_analyzer" : true,
    "charfilters" : [ ],
    "tokenizer" : {
      "name" : "standard",
      "tokens" : [
        {
          "token" : "OpenSearch",
          "start_offset" : 0,
          "end_offset" : 10,
          "type" : "<ALPHANUM>",
          "position" : 0,
          "bytes" : "[4f 70 65 6e 53 65 61 72 63 68]"
        },
        {
          "token" : "analyze",
          "start_offset" : 11,
          "end_offset" : 18,
          "type" : "<ALPHANUM>",
          "position" : 1,
          "bytes" : "[61 6e 61 6c 79 7a 65]"
        },
        {
          "token" : "test",
          "start_offset" : 19,
          "end_offset" : 23,
          "type" : "<ALPHANUM>",
          "position" : 2,
          "bytes" : "[74 65 73 74]"
        }
      ]
    },
    "tokenfilters" : [
      {
        "name" : "reverse",
        "tokens" : [
          {
            "token" : "hcraeSnepO",
            "start_offset" : 0,
            "end_offset" : 10,
            "type" : "<ALPHANUM>",
            "position" : 0,
            "bytes" : "[68 63 72 61 65 53 6e 65 70 4f]"
          },
          {
            "token" : "ezylana",
            "start_offset" : 11,
            "end_offset" : 18,
            "type" : "<ALPHANUM>",
            "position" : 1,
            "bytes" : "[65 7a 79 6c 61 6e 61]"
          },
          {
            "token" : "tset",
            "start_offset" : 19,
            "end_offset" : 23,
            "type" : "<ALPHANUM>",
            "position" : 2,
            "bytes" : "[74 73 65 74]"
          }
        ]
      }
    ]
  }
}
````

### Set a token limit

Use the `index.analyze.max_token_count` setting to limit the number of tokens that an analyze request can produce for an index. Default is `10000`. The limit applies only to requests that specify an index.

The following request limits the tokens produced for the `books2` index to four:

```json
PUT /books2/_settings
{
  "index.analyze.max_token_count": 4
}
```
{% include copy-curl.html %}

The following request produces five tokens, which exceeds the limit, so OpenSearch rejects the request:

```json
GET /books2/_analyze
{
  "text": "how to train your dog"
}
```
{% include copy-curl.html %}

For more information about dynamic index settings, see [Dynamic index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#dynamic-index-settings).

## Response body fields

The text analysis endpoints return the following response fields.

Field | Data type | Description
:--- | :--- | :---
`tokens` | Array | Array of tokens derived from the `text`. Returned when `explain` is `false`. See [token object](#token-object).
`detail` | Object | Details about the analysis and each token. Returned instead of `tokens` when `explain` is `true`. See [detail object](#detail-object).

#### Token object

Field | Data type | Description
:--- | :--- | :---
`token`  | String | The token's text.
`start_offset` | Integer | The token's starting position within the original text string. Offsets are zero-based.
`end_offset` | Integer | The token's ending position within the original text string. The end offset is exclusive.
`type` | String | Classification of the token: `<ALPHANUM>`, `<NUM>`, and so on. The tokenizer usually sets the type, but some filters define their own types. For example, the synonym filter defines the `SYNONYM` type.
`position` | Integer | The token's position in the token stream. Positions can skip values, for example, when a filter removes tokens.
`bytes` | String | The token's bytes in hexadecimal. Returned only when `explain` is `true`.
`positionLength` | Integer | The number of positions that the token spans. Returned only when `explain` is `true`.
`termFrequency` | Integer | The token's term frequency. Returned only when `explain` is `true`.

#### Detail object

Field | Data type | Description
:--- | :--- | :---
`custom_analyzer` | Boolean | Whether the analyzer applied to the text is custom or built in.
`analyzer` | Object | Name of the analyzer applied to the text and a list of tokens<sup>*</sup> produced by the analyzer. Returned when the request specifies an analyzer or a field (`custom_analyzer` is `false`).
`charfilters` | Array | List of character filters applied to the text. Returned when `custom_analyzer` is `true`.
`tokenizer` | Object | Name of the tokenizer applied to the text and a list of tokens<sup>*</sup> with content before the token filters were applied. Returned when `custom_analyzer` is `true`.
`tokenfilters` | Array | List of token filters applied to the text. Each token filter includes the filter's name and a list of tokens<sup>*</sup> with content after the filters were applied. Token filters are listed in the order they are specified in the request. Returned when `custom_analyzer` is `true`.

See [token object](#token-object) for token field descriptions.
{: .note}

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:admin/analyze`.

## Related documentation

- [Text analysis]({{site.url}}{{site.baseurl}}/analyzers/)
- [Analyzers]({{site.url}}{{site.baseurl}}/analyzers/supported-analyzers/index/)
- [Tokenizers]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/index/)
- [Token filters]({{site.url}}{{site.baseurl}}/analyzers/token-filters/index/)
- [Normalizers]({{site.url}}{{site.baseurl}}/analyzers/normalizers/)
