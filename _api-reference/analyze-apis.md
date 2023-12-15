---
layout: default
title: Analyze API
has_children: true
nav_order: 7
redirect_from:
  - /opensearch/rest-api/analyze-apis/
  - /api-reference/analyze-apis/
---

# Analyze API
**Introduced 1.0**
{: .label .label-purple }

The Analyze API allows you to perform [text analysis]({{site.url}}{{site.baseurl}}/api-reference/analyze-apis/), which is the process of converting unstructured text into individual tokens (usually words) that are optimized for search.

The Analyze API analyzes a text string and returns the resulting tokens.

If you use the Security plugin, you must have the `manage index` privilege. If you only want to analyze text, you must have the `manage cluster` privilege.
{: .note}

## Path and HTTP methods

```
GET /_analyze
GET /{index}/_analyze
POST /_analyze
POST /{index}/_analyze
```

Although you can issue an analyze request using both `GET` and `POST` requests, the two have important distinctions. A `GET` request causes data to be cached in the index so that the next time the data is requested, it is retrieved faster. A `POST` request sends a string that does not already exist to the analyzer to be compared with data that is already in the index. `POST` requests are not cached.
{: .note}

## Path parameter

You can include the following optional path parameter in your request.

Parameter | Data type | Description
:--- | :--- | :---
index | String | Index that is used to derive the analyzer.

## Query parameters

You can include the following optional query parameters in your request.

Field | Data type | Description
:--- | :--- | :---
analyzer | String | The name of the analyzer to apply to the `text` field. The analyzer can be built in or configured in the index.<br /><br />If `analyzer` is not specified, the analyze API uses the analyzer defined in the mapping of the `field` field.<br /><br />If the `field` field is not specified, the analyze API uses the default analyzer for the index.<br /><br > If no index is specified or the index does not have a default analyzer, the analyze API uses the standard analyzer.
attributes | Array of Strings | Array of token attributes for filtering the output of the `explain` field.
char_filter | Array of Strings | Array of character filters for preprocessing characters before the `tokenizer` field.
explain | Boolean | If true, causes the response to include token attributes and additional details. Defaults to `false`.
field | String | Field for deriving the analyzer. <br /><br > If you specify `field`, you must also specify the `index` path parameter. <br /><br > If you specify the `analyzer` field, it overrides the value of `field`. <br /><br > If you do not specify `field`, the analyze API uses the default analyzer for the index. <br /><br > If you do not specify the `index` field, or the index does not have a default analyzer, the analyze API uses the standard analyzer.
filter | Array of Strings | Array of token filters to apply after the `tokenizer` field.
normalizer | String | Normalizer for converting text into a single token. 
tokenizer | String | Tokenizer for converting the `text` field into tokens.

The following query parameter is required.

Field | Data type | Description
:--- | :--- | :---
text | String or Array of Strings | Text to analyze. If you provide an array of strings, the text is analyzed as a multi-value field.

#### Example requests

[Analyze array of text strings](#analyze-array-of-text-strings)

[Apply a built-in analyzer](#apply-a-built-in-analyzer)

[Apply a custom analyzer](#apply-a-custom-analyzer)

[Apply a custom transient analyzer](#apply-a-custom-transient-analyzer)

[Specify an index](#specify-an-index)

[Derive the analyzer from an index field](#derive-the-analyzer-from-an-index-field)

[Specify a normalizer](#specify-a-normalizer)

[Get token details](#get-token-details)

[Set a token limit](#set-a-token-limit)

#### Analyze array of text strings

When you pass an array of strings to the `text` field, it is analyzed as a multi-value field.

````json
GET /_analyze
{
  "analyzer" : "standard",
  "text" : ["first array element", "second array element"]
}
````
{% include copy-curl.html %}

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

#### Apply a built-in analyzer

If you omit the `index` path parameter, you can apply any of the built-in analyzers to the text string.

The following request analyzes text using the `standard` built-in analyzer:

````json
GET /_analyze
{
  "analyzer" : "standard",
  "text" : "OpenSearch text analysis"
}
````
{% include copy-curl.html %}

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

#### Apply a custom analyzer

You can create your own analyzer and specify it in an analyze request.

In this scenario, a custom analyzer `lowercase_ascii_folding` has been created and associated with the `books2` index. The analyzer converts text to lowercase and converts non-ASCII characters to ASCII.

The following request applies the custom analyzer to the provided text:

````json
GET /books2/_analyze
{
  "analyzer": "lowercase_ascii_folding",
  "text" : "Le garçon m'a SUIVI."
}
````
{% include copy-curl.html %}

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

#### Apply a custom transient analyzer

You can build a custom transient analyzer from tokenizers, token filters, or character filters. Use the `filter` parameter to specify token filters.

The following request uses the `uppercase` character filter to convert the text to uppercase:

````json
GET /_analyze
{
  "tokenizer" : "keyword",
  "filter" : ["uppercase"],
  "text" : "OpenSearch filter"
}
````
{% include copy-curl.html %}

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

The following request uses the `html_strip` filter to remove HTML characters from the text:

````json
GET /_analyze
{
  "tokenizer" : "keyword",
  "filter" : ["lowercase"],
  "char_filter" : ["html_strip"],
  "text" : "<b>Leave</b> right now!"
}
````
{% include copy-curl.html %}

The previous request returns the following fields:

```` json
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

````json
GET /_analyze
{
  "tokenizer" : "whitespace",
  "filter" : ["lowercase", {"type": "stop", "stopwords": [ "to", "in"]}],
  "text" : "how to train your dog in five steps"
}
````
{% include copy-curl.html %}

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

#### Specify an index

You can analyze text using an index's default analyzer, or you can specify a different analyzer.

The following request analyzes the provided text using the default analyzer associated with the `books` index:

````json
GET /books/_analyze
{
  "text" : "OpenSearch analyze test"
}
````
{% include copy-curl.html %}

The previous request returns the following fields:

````json

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

````json
GET /books/_analyze
{
  "analyzer" : "keyword",
  "text" : "OpenSearch analyze test"
}
````
{% include copy-curl.html %}

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

#### Derive the analyzer from an index field

You can pass text and a field in the index. The API looks up the field's analyzer and uses it to analyze the text.

If the mapping does not exist, the API uses the standard analyzer, which converts all text to lowercase and tokenizes based on white space.

The following request causes the analysis to be based on the mapping for `name`:

````json
GET /books2/_analyze
{
  "field" : "name",
  "text" : "OpenSearch analyze test"
}
````
{% include copy-curl.html %}

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

#### Specify a normalizer

Instead of using a keyword field, you can use the normalizer associated with the index. A normalizer causes the analysis change to produce a single token.

In this example, the `books2` index includes a normalizer called `to_lower_fold_ascii` that converts text to lowercase and translates non-ASCII text to ASCII.

The following request applies `to_lower_fold_ascii` to the text:

````json
GET /books2/_analyze
{
  "normalizer" : "to_lower_fold_ascii",
  "text" : "C'est le garçon qui m'a suivi."
}
````
{% include copy-curl.html %}

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

You can create a custom transient normalizer with token and character filters.

The following request uses the `uppercase` character filter to convert the given text to all uppercase:

````json
GET /_analyze
{
  "filter" : ["uppercase"],
  "text" : "That is the boy who followed me."
}
````
{% include copy-curl.html %}

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

#### Get token details

You can obtain additional details for all tokens by setting the `explain` attribute to `true`.

The following request provides detailed token information for the `reverse` filter used with the `standard` tokenizer:

````json
GET /_analyze
{
  "tokenizer" : "standard",
  "filter" : ["reverse"],
  "text" : "OpenSearch analyze test",
  "explain" : true,
  "attributes" : ["keyword"] 
}
````
{% include copy-curl.html %}

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
            "position" : 0
          },
          {
            "token" : "ezylana",
            "start_offset" : 11,
            "end_offset" : 18,
            "type" : "<ALPHANUM>",
            "position" : 1
          },
          {
            "token" : "tset",
            "start_offset" : 19,
            "end_offset" : 23,
            "type" : "<ALPHANUM>",
            "position" : 2
          }
        ]
      }
    ]
  }
}
````

#### Set a token limit

You can set a limit to the number of tokens generated. Setting a lower value reduces a node's memory usage. The default value is 10000.

The following request limits the tokens to four:

````json
PUT /books2
{
  "settings" : {
    "index.analyze.max_token_count" : 4
  }
}
````
{% include copy-curl.html %}

The preceding request is an index API rather than an analyze API. See [Dynamic index-level index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#dynamic-index-level-index-settings) for additional details.
{: .note}

### Response fields

The text analysis endpoints return the following response fields.

Field | Data type | Description
:--- | :--- | :---
tokens | Array | Array of tokens derived from the `text`. See [token object](#token-object).
detail | Object | Details about the analysis and each token. Included only when you request token details. See [detail object](#detail-object).

#### Token object

Field | Data type | Description
:--- | :--- | :---
token  | String | The token's text.
start_offset | Integer | The token's starting position within the original text string. Offsets are zero-based.
end_offset | Integer | The token's ending position within the original text string.
type | String | Classification of the token: `<ALPHANUM>`, `<NUM>`, and so on. The tokenizer usually sets the type, but some filters define their own types. For example, the synonym filter defines the `<SYNONYM>` type.
position |  Integer | The token's position within the `tokens` array.

#### Detail object

Field | Data type | Description
:--- | :--- | :---
custom_analyzer | Boolean | Whether the analyzer applied to the text is custom or built in.
charfilters | Array | List of character filters applied to the text.
tokenizer | Object | Name of the tokenizer applied to the text and a list of tokens<sup>*</sup> with content before the token filters were applied.
tokenfilters | Array | List of token filters applied to the text. Each token filter includes the filter's name and a list of tokens<sup>*</sup> with content after the filters were applied. Token filters are listed in the order they are specified in the request. 

See [token object](#token-object) for token field descriptions.
{: .note}