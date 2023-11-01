---
layout: default
title: Query string
parent: Full-text queries
grand_parent: Query DSL
nav_order: 60

redirect_from:
  - /opensearch/query-dsl/full-text/query-string/
  - /query-dsl/query-dsl/full-text/query-string/
---

# Query string query

A `query_string` query parses the query string based on the [query string syntax](#query-string-syntax). It provides for creating powerful yet concise queries that can incorporate wildcards and search multiple fields.

Searches with `query_string` queries do not return nested documents. To search nested fields, use the [`nested` query]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/nested/).
{: .note}

Query string query has a strict syntax and returns an error in case of invalid syntax. Therefore, it does not work well for search box applications. For a less strict alternative, consider using [`simple_query_string` query]({{site.url}}{{site.baseurl}}/query-dsl/full-text/simple-query-string/). If you don't need query syntax support, use the [`match` query]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match/).
{: .important}

## Query string syntax

Query string syntax is based on [Apache Lucene query syntax](https://lucene.apache.org/core/2_9_4/queryparsersyntax.html).

You can use query string syntax in the following cases:

1. In a `query_string` query, for example:
    ```json
    GET _search
    {
      "query": {
        "query_string": {
          "query": "the wind AND (rises OR rising)"
        }
      }
    }
    ```
    {% include copy-curl.html %}

1. In the Discover app of OpenSearch Dashboards, if you turn off DQL, as shown in the following image.
  ![Using query string syntax in OpenSearch Dashboards Discover]({{site.url}}{{site.baseurl}}/images/discover-lucene-syntax.png)
  For more information, see [Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/).

1. If you search using the HTTP request query parameters, for example: 
  ```json
    GET _search?q=wind
  ```

A query string consists of _terms_ and _operators_. A term is a single word (for example, in the query `wind rises`, the terms are `wind` and `rises`). If several terms are surrounded by quotation marks, they are treated as one phrase where words are marched in the order they appear (for example, `"wind rises"`). Operators (such as `OR`, `AND`, and `NOT`) specify the Boolean logic used to interpret text in the query string. 

The examples in this section use an index containing the following mapping and documents:

```json
PUT /testindex
{
  "mappings": {
    "properties": {
      "title": { 
        "type": "text",
        "fields": {
          "english": { 
            "type": "text",
            "analyzer": "english"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

```json
PUT /testindex/_doc/1
{
  "title": "The wind rises"
}
```
{% include copy-curl.html %}

```json
PUT /testindex/_doc/2
{
  "title": "Gone with the wind",
  "description": "A 1939 American epic historical film"
}
```
{% include copy-curl.html %}

```json
PUT /testindex/_doc/3
{
  "title": "Windy city"
}
```
{% include copy-curl.html %}

```json
PUT /testindex/_doc/4
{
  "article title": "Wind turbines"
}
```
{% include copy-curl.html %}

## Reserved characters

The following is a list of reserved characters for the query string query: 

`+`, `-`, `=`, `&&`, `||`, `>`, `<`, `!`, `(`, `)`,`{`, `}`, `[`, `]`, `^`, `"`, `~`, `*`, `?`, `:`, `\`, `/`

Escape reserved characters with a backslash (`\`). When sending a JSON request, use a double backslash (`\\`) to escape reserved characters (because the backslash character is itself reserved, you must escape the backslash with another backslash). 
{: .tip}

For example, to search for an expression `2*3`, specify the query string: `2\\*3`:

```json
GET /testindex/_search
{
 "query": {
    "query_string": {
      "query": "title: 2\\*3"
    }
  }
}
```
{% include copy-curl.html %}

The `>` and `<` signs cannot be escaped. They are interpreted as a range query. 
{: .important}

## White space characters and empty queries

White space characters are not considered operators. If a query string is empty or only contains white space characters, the query does not return results.

## Field names

Specify the field name before the colon. The following table contains example queries with field names.

Query in the `query_string` query | Query in Discover | Criterion for a document to match | Matching documents from the `testindex` index
:--- | :--- | :--- | :---
`title: wind` | `title: wind` | The `title` field contains the word `wind`. | 1, 2
`title: (wind OR windy)` | `title: (wind OR windy)` | The `title` field contains the word `wind` or the word `windy`. | 1, 2, 3
`title: \"wind rises\"` | `title: "wind rises"` | The `title` field contains the phrase `wind rises`. Escape quotation marks with a backslash. | 1
`article\\ title: wind` | `article\ title: wind` | The `article title` field contains the word `wind`. Escape the space character with a backslash. | 4
`title.\\*: rise` | `title.\*: rise` | Every field that begins with `title.` (in this example, `title.english`) contains the word `rise`. Escape the wildcard character with a backslash. | 1
`_exists_: description` | `_exists_: description` | The field `description` exists. | 2

## Wildcard expressions

You can specify wildcard expressions using special characters: `?` replaces a single character and `*` replaces zero or more characters.

#### Example

The following query searches for the title containing the word `gone` and a description that contains a word starting with `hist`:

```json
GET /testindex/_search
{
 "query": {
    "query_string": {
      "query": "title: gone AND description: hist*"
    }
  }
}
```
{% include copy-curl.html %}

Wildcard queries can use a significant amount of memory, which can degrade performance. Wildcards at the beginning of a word (for example, `*cal`) are the most expensive because matching documents on such wildcards requires examining all terms in the index. To disable leading wildcards, set `allow_leading_wildcard` to `false`.
{: .warning}

For efficiency, pure wildcards such as `*` are rewritten as `exists` queries. Therefore, the `description: *` wildcard will match documents containing an empty value in the `description` field but will not match documents in which the `description` field is either missing or has a `null` value.

If you set `analyze_wildcard` to `true`, OpenSearch will analyze queries that end with a `*` (such as `hist*`). Consequently, OpenSearch will build a Boolean query comprising the resulting tokens by taking exact matches on the first n-1 tokens and a prefix match on the last token.

## Regular expressions

To specify regular expression patterns in a query string, surround them with forward slashes (`/`), for example `title: /w[a-z]nd/`.

The `allow_leading_wildcard` parameter does not apply to regular expressions. For example, a query string such as  `/.*d/` will examine all terms in the index. 
{: .important}

## Fuzziness

You can run fuzzy queries using the `~` operator, for example `title: rise~`.

The query searches for documents containing terms that are similar to the search term within the maximum allowed edit distance. The edit distance is defined as the [Damerau-Levenshtein distance](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance), which measures the number of one-character changes (insertions, deletions, substitutions, or transpositions) needed to change one term to another term.

The default edit distance of 2 should catch 80% of misspellings. To change the default edit distance, specify the new edit distance after the `~` operator. For example, to set the edit distance to `1`, use the query `title: rise~1`.

Do not mix fuzzy and wildcard operators. If you specify both fuzzy and wildcard operators, one of the operators will not be applied. For example, if you can search for `wnid*~1`, the wildcard operator `*` will be applied but the fuzzy operator `~1` will not be applied.
{: .important}

## Proximity queries

A proximity query does not require the search phrase to be in the specified order. It allows the words in the phrase to be in a different order or separated by other words. A proximity query specifies a maximum edit distance of words in a phrase. For example, the following query allows an edit distance of 4 when matching the words in the specified phrase:

```json
GET /testindex/_search
{
 "query": {
    "query_string": {
      "query": "title: \"wind gone\"~4"
    }
  }
}
```
{% include copy-curl.html %}

When OpenSearch matches documents, the closer the words in the document to the word order specified in the query (the less the edit distance), the higher the document's relevance score.  

## Ranges

To specify a range for a numeric, string, or date field, use square brackets (`[min TO max]`) for an inclusive range and curly braces (`{min TO max}`) for an exclusive range. You can also mix square brackets and curly braces to include or exclude the lower and upper bound (for example, `{min TO max]`). 

The dates for a date range must be provided in the format that you used when mapping the field containing the date. For more information about supported date formats, see [Formats]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/date/#formats).

The following table provides range syntax examples.

Data type | Query | Query string
:--- | :--- | :---
Numeric | Documents whose account numbers are from 1 to 15, inclusive. | `account_number: [1 TO 15]` or <br> `account_number: (>=1 AND <=15)` or <br> `account_number: (+>=1 +<=15)`
| Documents whose account numbers are 15 and greater. | `account_number: [15 TO *]` or <br> `account_number: >=15` (note no space after the `>=` sign)
String | Documents where last name is from Bates, inclusive, to Duke, exclusive. | `lastname: [Bates TO Duke}` or <br> `lastname: (>=Bates AND <Duke)`
| Documents where last name precedes Bates alphabetically. | `lastname: {* TO Bates}` or <br> `lastname: <Bates` (note no space after the `<` sign)
Date | Documents where the release date is between 03/21/2023 and 09/25/2023, inclusive. | `release_date: [03/21/2023 TO 09/25/2023]`

As an alternative to specifying a range in a query string, you can use a [range query]({{site.url}}{{site.baseurl}}/query-dsl/term/range/), which provides a more reliable syntax.
{: .tip}

## Boosting

Use the caret (`^`) boost operator to boost the relevance score of documents by a multiplier. Values in the [0, 1) range decrease relevance, and values greater than 1 increase relevance. Default is `1`. 

The following table provides boost examples.

Type | Description | Query string
:--- | :--- | :---
Word boost | Find all addresses containing the word `street` and boost the ones containing the word `Madison`. | `address: Madison^2 street`
Phrase boost | Find documents with the title containing the phrase `wind rises`, boosted by 2. | `title: \"wind rises\"^2` 
| Find documents with the title containing the words `wind rises`, and boost the documents containing the phrase `wind rises` by 2. | `title: (wind rises)^2`

## Boolean operators

When you provide search terms in the query, by default, the query returns documents containing at least one of the provided terms. You can use the `default_operator` parameter to specify an operator for all terms. Thus, if you set the `default_operator` to `AND`, all terms will be required, whereas if you set it to `OR`, all terms will be optional. 

### `+` and `-` operators

If you want more granular control over the required and optional terms, you can use the `+` and `-` operators. The `+` operator makes the term following it required, while the `-` operator excludes the term following it.

For example, in the query string `title: (gone +wind -turbines)` specifies that the term `gone` is optional, the term `wind` must be present and the term `turbines` must not be present in the title of the matching documents:

```json
GET /testindex/_search
{
 "query": {
    "query_string": {
      "query": "title: (gone +wind -turbines)"
    }
  }
}
```
{% include copy-curl.html %}

The query returns two matching documents:

```json
{
  "_index": "testindex",
  "_id": "2",
  "_score": 1.3159468,
  "_source": {
    "title": "Gone with the wind",
    "description": "A 1939 American epic historical film"
  }
},
{
  "_index": "testindex",
  "_id": "1",
  "_score": 0.3438858,
  "_source": {
    "title": "The wind rises"
  }
}
```

The preceding query is equivalent to the following Boolean query:

```json
GET testindex/_search
{
  "query": {
    "bool": {
      "must": {
        "match": {
          "title": "wind"
        }
      },
      "should": {
        "match": {
          "title": "gone"
        }
      },
      "must_not": {
        "match": {
          "title": "turbines"
        }
      }
    }
  }
}
```

### Conventional Boolean operators

Alternatively, you can use the following Boolean operators: `AND`, `&&`, `OR`, `||`, `NOT`, `!`. However, these operators do not follow the precedence rules, so you must use parentheses to specify precedence when using multiple Boolean operators. For example, the query string `title: (gone +wind -turbines)` can be rewritten as follows using Boolean operators:

`title: ((gone AND wind) OR wind) AND NOT turbines`

Run the following query that contains the rewritten query string:

```json
GET testindex/_search
{
 "query": {
    "query_string": {
      "query": "title: ((gone AND wind) OR wind) AND NOT turbines"
    }
  }
}
```
{% include copy-curl.html %}

The query returns the same results as the query that uses the `+` and `-` operators. However, note that the relevance scores of the matching documents are not the same as in the previous results:

```json
{
  "_index": "testindex",
  "_id": "2",
  "_score": 1.6166971,
  "_source": {
    "title": "Gone with the wind",
    "description": "A 1939 American epic historical film"
  }
},
{
  "_index": "testindex",
  "_id": "1",
  "_score": 0.3438858,
  "_source": {
    "title": "The wind rises"
  }
}
```
{% include copy-curl.html %}

## Grouping

Group multiple clauses or terms into subqueries using parentheses. For example, the following query searches for documents containing the words `gone` or `rises` that must contain the word `wind` in the title:

```json
GET testindex/_search
{
 "query": {
    "query_string": {
      "query": "title: (gone OR rises) AND wind"
    }
  }
}
```

The results contain the two matching documents:

```json
{
  "_index": "testindex",
  "_id": "1",
  "_score": 1.5046883,
  "_source": {
    "title": "The wind rises"
  }
},
{
  "_index": "testindex",
  "_id": "2",
  "_score": 1.3159468,
  "_source": {
    "title": "Gone with the wind",
    "description": "A 1939 American epic historical film"
  }
}
```

You can also use grouping to boost subquery results or to target the specified field, for example `title:(gone AND wind) description:(historical film)^2`.

## Searching multiple fields

To search multiple fields, use the `fields` parameter. When you provide the `fields` parameter, the query is rewritten as `field_1: query OR field_2: query ...`. 

For example, the following query searches for the terms `wind` or `film` in the `title` and `description` fields:

```json
GET testindex/_search
{
  "query": {
    "query_string": {
      "fields": [ "title", "description" ],
      "query": "wind AND film"
    }
  }
}
```
{% include copy-curl.html %}

The preceding query is equivalent to the following query that does not provide the `fields` parameter:

```json
GET testindex/_search
{
  "query": {
    "query_string": {
      "query": "(title:wind OR description:wind) AND (title:film OR description:film)"
    }
  }
}
```

### Searching multiple subfields of a field

To search all inner fields of a field, you can use a wildcard. For example, to search all subfields within the `address` field, use the following query:

```json
GET /testindex/_search
{
  "query": {
    "query_string" : {
      "fields" : ["address.*"],
      "query" : "New AND (York OR Jersey)"
    }
  }
}
```
{% include copy-curl.html %}

The preceding query is equivalent to the following query that does not provide the `fields` parameter (note that the `*` is escaped with `\\`):

```json
GET /testindex/_search
{
  "query": {
    "query_string" : {
      "query" : "address.\\*: New AND (York OR Jersey)"
    }
  }
}
```

### Boosting

The subqueries that are generated from each search term are combined using a [`dis_max` query]({{site.url}}{{site.baseurl}}/query-dsl/compound/disjunction-max/) with a `tie_breaker`. To boost individual fields, use the `^` operator. For example, the following query boosts the `title` field by a factor of 2:

```json
GET testindex/_search
{
  "query": {
    "query_string": {
      "fields": [ "title^2", "description" ],
      "query": "wind AND film"
    }
  }
}
```
{% include copy-curl.html %}

To boost all subfields of a field, specify the boost operator after the wildcard:

```json
GET /testindex/_search
{
  "query": {
    "query_string" : {
      "fields" : ["work_address", "address.*^2"],
      "query" : "New AND (York OR Jersey)"
    }
  }
}
```

### Parameters for multiple field searches

When searching multiple fields, you can pass the additional optional `type` parameter to the `query_string` query. 

Parameter | Data type | Description
:--- | :--- | :---
`type` | String | Determines how OpenSearch executes the query and scores the results. Valid values are `best_fields`, `bool_prefix`, `most_fields`, `cross_fields`, `phrase`, and `phrase_prefix`. Default is `best_fields`. For descriptions of valid values, see [Multi-match query types]({{site.url}}{{site.baseurl}}/query-dsl/full-text/multi-match/#multi-match-query-types). 

## Synonyms in the `query_string` query

The `query_string` query supports multi-term synonym expansion with the `synonym_graph` token filter. If you use the `synonym_graph` token filter, OpenSearch creates a [match phrase query]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase/) for each synonym. 

The `auto_generate_synonyms_phrase_query` parameter specifies whether to create a match phrase query automatically for multi-term synonyms. By default, `auto_generate_synonyms_phrase_query` is `true`, so if you specify `ml, machine learning` as synonyms and search for `ml`, OpenSearch searches for `ml OR "machine learning"`. 

Alternatively, you can match multi-term synonyms using conjunctions. If you set `auto_generate_synonyms_phrase_query` to `false`, OpenSearch searches for `ml OR (machine AND learning)`. 

For example, the following query searches for the text `ml models` and specifies not to auto-generate a match phrase query for each synonym:

```json
GET /testindex/_search
{
  "query": {
    "query_string": {
      "default_field": "title",
      "query": "ml models",
      "auto_generate_synonyms_phrase_query": false
    }
  }
}
```
{% include copy-curl.html %}

For this query, OpenSearch creates the following Boolean query: `(ml OR (machine AND learning)) models`.

## Minimum should match

The `query_string` query splits the query around each operator and creates a Boolean query for the entire input. The [`minimum_should_match` parameter]({{site.url}}{{site.baseurl}}/query-dsl/minimum-should-match/) specifies the minimum number of terms a document must match to be returned in search results. For example, the following query specifies that the `description` field must match at least two terms for each search result:

```json
GET /testindex/_search
{
  "query": {
    "query_string": {
      "fields": [
        "description"
      ],
      "query": "historical epic film",
      "minimum_should_match": 2
    }
  }
}
```
{% include copy-curl.html %}

For this query, OpenSearch creates the following Boolean query: `(description:historical description:epic description:film)~2`.

### Minimum should match with multiple fields

If you specify multiple fields in a `query_string` query, OpenSearch creates a [`dis_max` query]({{site.url}}{{site.baseurl}}/query-dsl/compound/disjunction-max/) for the specified fields. If you don't explicitly specify an operator for the query terms, the whole query text is treated as one clause. OpenSearch builds a query for each field using this single clause. The final Boolean query contains a single clause that corresponds to the `dis_max` query for all fields, therefore the `minimum_should_match` parameter is not applied.

For example, in the following query, `historical epic heroic` is treated as a single clause:

```json
GET /testindex/_search
{
  "query": {
    "query_string": {
      "fields": [
        "title",
        "description"
      ],
      "query": "historical epic heroic",
      "minimum_should_match": 2
    }
  }
}
```
{% include copy-curl.html %}

For this query, OpenSearch creates the following Boolean query: `((title:historical title:epic title:heroic) | (description:historical description:epic description:heroic))`.

If you add explicit operators (`AND` or `OR`) to the query terms, each term is considered a separate clause, to which the `minimum_should_match` parameter can be applied. For example, in the following query, `historical`, `epic`, and `heroic` are considered separate clauses:

```json
GET /testindex/_search
{
  "query": {
    "query_string": {
      "fields": [
        "title",
        "description"
      ],
      "query": "historical OR epic OR heroic",
      "minimum_should_match": 2
    }
  }
}
```
{% include copy-curl.html %}

For this query, OpenSearch creates the following Boolean query: `((title:historical | description:historical) (description:epic | title:epic) (description:heroic | title:heroic))~2`. The query matches at least two of the three clauses. Each clause represents a `dis_max` query on both the `title` and `description` fields for each term.

Alternatively, to ensure that `minimum_should_match` can be applied, you can set the `type` parameter to `cross_fields`. This indicates that the fields with the same analyzer should be grouped together when the input text is analyzed:

```json
GET /testindex/_search
{
  "query": {
    "query_string": {
      "fields": [
        "title",
        "description"
      ],
      "query": "historical epic heroic",
      "type": "cross_fields",
      "minimum_should_match": 2
    }
  }
}
```
{% include copy-curl.html %}

For this query, OpenSearch creates the following Boolean query: `((title:historical | description:historical) (description:epic | title:epic) (description:heroic | title:heroic))~2`. 

However, if you use different analyzers, you must use explicit operators in the query to ensure that the `minimum_should_match` parameter is applied to each term.

## Parameters

The following table lists the parameters that `query_string` query supports. All parameters except `query` are optional.

Parameter | Data type | Description
:--- | :--- | :---
`query` | String | The text that may contain expressions in the [query string syntax](#query-string-syntax) to use for search. Required.
`allow_leading_wildcard` | Boolean | Specifies whether `*` and `?` are allowed as first characters of a search term. Default is `true`.
`analyze_wildcard` | Boolean | Specifies whether OpenSearch should attempt to analyze wildcard terms. Default is `false`.
`analyzer` | String | The [analyzer]({{site.url}}{{site.baseurl}}/analyzers/index/) used to tokenize the query string text. Default is the index-time analyzer specified for the `default_field`. If no analyzer is specified for the `default_field`, the `analyzer` is the default analyzer for the index.
`auto_generate_synonyms_phrase_query` | Boolean | Specifies whether to create a [match phrase query]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase/) automatically for multi-term synonyms. For example, if you specify `ba, batting average` as synonyms and search for `ba`, OpenSearch searches for `ba OR "batting average"` (if this option is `true`) or `ba OR (batting AND average)` (if this option is `false`). Default is `true`.
`boost` | Floating-point | Boosts the clause by the given multiplier. Useful for weighing clauses in compound queries. Values in the [0, 1) range decrease relevance, and values greater than 1 increase relevance. Default is `1`. 
`default_field` | String | The field in which to search if the field is not specified in the query string. Supports wildcards. Defaults to the value specified in the `index.query. Default_field` index setting. By default, the `index.query. Default_field` is `*`, which means extract all fields eligible for term query and filter the metadata fields. The extracted fields are combined into a query if the `prefix` is not specified. Eligible fields do not include nested documents. Searching all eligible fields could be a resource-intensive operation. The `indices.query.bool.max_clause_count` search setting defines the maximum value for the product of the number of fields and the number of terms that can be queried at one time. The default value for `indices.query.bool.max_clause_count` is 1,024.
`default_operator`| String | If the query string contains multiple search terms, whether all terms need to match (`AND`) or only one term needs to match (`OR`) for a document to be considered a match. Valid values are:<br>- `OR`: The string `to be` is interpreted as `to OR be`<br>- `AND`: The string `to be` is interpreted as `to AND be`<br> Default is `OR`.
`enable_position_increments` | Boolean | When `true`, resulting queries are aware of position increments. This setting is useful when the removal of stop words leaves an unwanted "gap" between terms. Default is `true`.
`fields` | String array | The list of fields to search (for example, `"fields": ["title^4", "description"]`). Supports wildcards. If unspecified, defaults to the `index.query. Default_field` setting, which defaults to `["*"]`.
`fuzziness` | String | The number of character edits (insert, delete, substitute) that it takes to change one word to another when determining whether a term matched a value. For example, the distance between `wined` and `wind` is 1. Valid values are non-negative integers or `AUTO`. The default, `AUTO`, chooses a value based on the length of each term and is a good choice for most use cases.
`fuzzy_max_expansions` | Positive integer | The maximum number of terms to which the query can expand. Fuzzy queries “expand to” a number of matching terms that are within the distance specified in `fuzziness`. Then OpenSearch tries to match those terms. Default is `50`.
`fuzzy_transpositions` | Boolean | Setting `fuzzy_transpositions` to `true` (default) adds swaps of adjacent characters to the insert, delete, and substitute operations of the `fuzziness` option. For example, the distance between `wind` and `wnid` is 1 if `fuzzy_transpositions` is true (swap "n" and "i") and 2 if it is false (delete "n", insert "n"). If `fuzzy_transpositions` is false, `rewind` and `wnid` have the same distance (2) from `wind`, despite the more human-centric opinion that `wnid` is an obvious typo. The default is a good choice for most use cases.
`lenient` | Boolean | Setting `lenient` to `true` ignores data type mismatches between the query and the document field. For example, a query string of `"8.2"` could match a field of type `float`. Default is `false`.
`max_determinized_states` | Positive integer | The maximum number of "[states](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/util/automaton/Operations.html#DEFAULT_MAX_DETERMINIZED_STATES)" (a measure of complexity) that Lucene can create for query strings that contain regular expressions (for example, `"query": "/wind.+?/"`). Larger numbers allow for queries that use more memory. Default is 10,000.
`minimum_should_match` | Positive or negative integer, positive or negative percentage, combination | If the query string contains multiple search terms and you use the `or` operator, the number of terms that need to match for the document to be considered a match. For example, if `minimum_should_match` is 2, `wind often rising` does not match `The Wind Rises.` If `minimum_should_match` is `1`, it matches. For details, see [Minimum should match]({{site.url}}{{site.baseurl}}/query-dsl/minimum-should-match/).
`phrase_slop` | Integer | The maximum number of words that are allowed between the matched words. If `phrase_slop` is 2, a maximum of two words is allowed between matched words in a phrase. Transposed words have a slop of 2. Default is `0` (an exact phrase match where matched words must be next to each other).
`quote_analyzer` | String | The analyzer used to tokenize quoted text in the query string. Overrides the `analyzer` parameter for quoted text. Default is the `search_quote_analyzer` specified for the `default_field`. 
`quote_field_suffix` | String | This option supports searching for exact matches (surrounded with quotation marks) using a different analysis method than non-exact matches use. For example, if `quote_field_suffix` is `.exact` and you search for `\"lightly\"` in the `title` field, OpenSearch searches for the word `lightly` in the `title.exact` field. This second field might use a different type (for example, `keyword` rather than `text`) or a different analyzer.  
`rewrite` | String | Determines how OpenSearch rewrites and scores multi-term queries. Valid values are `constant_score`, `scoring_boolean`, `constant_score_boolean`, `top_terms_N`, `top_terms_boost_N`, and `top_terms_blended_freqs_N`. Default is `constant_score`.
`time_zone` | String | Specifies the number of hours to offset the desired time zone from `UTC`. You need to indicate the time zone offset number if the query string contains a date range. For example, set `time_zone": "-08:00"` for a query with a date range such as `"query": "wind rises release_date[2012-01-01 TO 2014-01-01]"`). The default time zone format used to specify number of offset hours is `UTC`.

Query string queries may be internally converted into [prefix queries]({{site.url}}{{site.baseurl}}/query-dsl/term/prefix/). If [`search.allow_expensive_queries`]({{site.url}}{{site.baseurl}}/query-dsl/index/#expensive-queries) is set to `false`, prefix queries are not executed. If `index_prefixes` is enabled, the `search.allow_expensive_queries` setting is ignored and an optimized query is built and executed.
{: .important}