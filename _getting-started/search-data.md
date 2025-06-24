---
layout: default
title: Search your data
nav_order: 50
canonical_url: https://docs.opensearch.org/docs/latest/getting-started/search-data/
---

# Search your data

In OpenSearch, there are several ways to search data:

- [Query domain-specific language (DSL)]({{site.url}}{{site.baseurl}}/query-dsl/index/): The primary OpenSearch query language, which you can use to create complex, fully customizable queries.
- [Query string query language]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/): A scaled-down query language that you can use in a query parameter of a search request or in OpenSearch Dashboards.
- [SQL]({{site.url}}{{site.baseurl}}/search-plugins/sql/sql/index/): A traditional query language that bridges the gap between traditional relational database concepts and the flexibility of OpenSearch’s document-oriented data storage.
- [Piped Processing Language (PPL)]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/): The primary language used for observability in OpenSearch. PPL uses a pipe syntax that chains commands into a query.
- [Dashboards Query Language (DQL)]({{site.url}}{{site.baseurl}}/dashboards/dql/): A simple text-based query language for filtering data in OpenSearch Dashboards. 

This tutorial contains a brief introduction to searching using [query string queries](#query-string-queries) and [query DSL](#query-dsl).

## Prepare the data

For this tutorial, you'll need to index student data if you haven't done so already. You can start by deleting the `students` index (`DELETE /students`) and then sending the following bulk request:

```json
POST _bulk
{ "create": { "_index": "students", "_id": "1" } }
{ "name": "John Doe", "gpa": 3.89, "grad_year": 2022}
{ "create": { "_index": "students", "_id": "2" } }
{ "name": "Jonathan Powers", "gpa": 3.85, "grad_year": 2025 }
{ "create": { "_index": "students", "_id": "3" } }
{ "name": "Jane Doe", "gpa": 3.52, "grad_year": 2024 }
```
{% include copy-curl.html %}

## Retrieve all documents in an index

To retrieve all documents in an index, send the following request:

```json
GET /students/_search
```
{% include copy-curl.html %}

The preceding request is equivalent to the `match_all` query, which matches all documents in an index:

```json
GET /students/_search
{
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

OpenSearch returns the matching documents:

```json
{
  "took": 12,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "students",
        "_id": "1",
        "_score": 1,
        "_source": {
          "name": "John Doe",
          "gpa": 3.89,
          "grad_year": 2022
        }
      },
      {
        "_index": "students",
        "_id": "2",
        "_score": 1,
        "_source": {
          "name": "Jonathan Powers",
          "gpa": 3.85,
          "grad_year": 2025
        }
      },
      {
        "_index": "students",
        "_id": "3",
        "_score": 1,
        "_source": {
          "name": "Jane Doe",
          "gpa": 3.52,
          "grad_year": 2024
        }
      }
    ]
  }
}
```

## Response body fields

The preceding response contains the following fields.

<!-- vale off -->
### took
<!-- vale on -->

The `took` field contains the amount of time the query took to run, in milliseconds.

<!-- vale off -->
### timed_out
<!-- vale on -->

This field indicates whether the request timed out. If a request timed out, then OpenSearch returns the results that were gathered before the timeout. You can set the desired timeout value by providing the `timeout` query parameter:

```json
GET /students/_search?timeout=20ms
```
{% include copy-curl.html %}

<!-- vale off -->
### _shards
<!-- vale on -->

The `_shards` object specifies the total number of shards on which the query ran as well as the number of shards that succeeded or failed. A shard may fail if the shard itself and all its replicas are unavailable. If any of the involved shards fail, OpenSearch continues to run the query on the remaining shards.

<!-- vale off -->
### hits
<!-- vale on -->

The `hits` object contains the total number of matching documents and the documents themselves (listed in the `hits` array). Each matching document contains the `_index` and `_id` fields as well as the `_source` field, which contains the complete originally indexed document. 

Each document is given a relevance score in the `_score` field. Because you ran a `match_all` search, all document scores are set to `1` (there is no difference in their relevance). The `max_score` field contains the highest score of any matching document.

## Query string queries

Query string queries are lightweight but powerful. You can send a query string query as a `q` query parameter. For example, the following query searches for students with the name `john`:

```json
GET /students/_search?q=name:john
```
{% include copy-curl.html %}

OpenSearch returns the matching document:

```json
{
  "took": 18,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.9808291,
    "hits": [
      {
        "_index": "students",
        "_id": "1",
        "_score": 0.9808291,
        "_source": {
          "name": "John Doe",
          "grade": 12,
          "gpa": 3.89,
          "grad_year": 2022,
          "future_plans": "John plans to be a computer science major"
        }
      }
    ]
  }
}
```

For more information about query string syntax, see [Query string query language]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/).

## Query DSL

Using Query DSL, you can create more complex and customized queries. 

### Full-text search

You can run a full-text search on fields mapped as `text`. By default, text fields are analyzed by the `default` analyzer. The analyzer splits text into terms and changes it to lowercase. For more information about OpenSearch analyzers, see [Analyzers]({{site.url}}{{site.baseurl}}/analyzers/).

For example, the following query searches for students with the name `john`:

```json
GET /students/_search
{
  "query": {
    "match": {
      "name": "john"
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching document:

```json
{
  "took": 13,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.9808291,
    "hits": [
      {
        "_index": "students",
        "_id": "1",
        "_score": 0.9808291,
        "_source": {
          "name": "John Doe",
          "gpa": 3.89,
          "grad_year": 2022
        }
      }
    ]
  }
}
```

Notice that the query text is lowercase while the text in the field is not, but the query still returns the matching document. 

You can reorder the terms in the search string. For example, the following query searches for `doe john`:

```json
GET /students/_search
{
  "query": {
    "match": {
      "name": "doe john"
    }
  }
}
```
{% include copy-curl.html %}

The response contains two matching documents:

```json
{
  "took": 14,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1.4508327,
    "hits": [
      {
        "_index": "students",
        "_id": "1",
        "_score": 1.4508327,
        "_source": {
          "name": "John Doe",
          "gpa": 3.89,
          "grad_year": 2022
        }
      },
      {
        "_index": "students",
        "_id": "3",
        "_score": 0.4700036,
        "_source": {
          "name": "Jane Doe",
          "gpa": 3.52,
          "grad_year": 2024
        }
      }
    ]
  }
}
```

The match query type uses `OR` as an operator by default, so the query is functionally `doe OR john`. Both `John Doe` and `Jane Doe` matched the word `doe`, but `John Doe` is scored higher because it also matched `john`.

### Keyword search

The `name` field contains the `name.keyword` subfield, which is added by OpenSearch automatically. If you search the `name.keyword` field in a manner similar to the previous request:

```json
GET /students/_search
{
  "query": {
    "match": {
      "name.keyword": "john"
    }
  }
}
```
{% include copy-curl.html %}

Then the request returns no hits because the `keyword` fields must exactly match. 

However, if you search for the exact text `John Doe`:

```json
GET /students/_search
{
  "query": {
    "match": {
      "name.keyword": "John Doe"
    }
  }
}
```
{% include copy-curl.html %}

OpenSearch returns the matching document:

```json
{
  "took": 19,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.9808291,
    "hits": [
      {
        "_index": "students",
        "_id": "1",
        "_score": 0.9808291,
        "_source": {
          "name": "John Doe",
          "gpa": 3.89,
          "grad_year": 2022
        }
      }
    ]
  }
}
```

### Filters

Using a Boolean query, you can add a filter clause to your query for fields with exact values

Term filters match specific terms. For example, the following Boolean query searches for students whose graduation year is 2022:

```json
GET students/_search
{
  "query": { 
    "bool": { 
      "filter": [ 
        { "term":  { "grad_year": 2022 }}
      ]
    }
  }
}
```
{% include copy-curl.html %}

With range filters, you can specify a range of values. For example, the following Boolean query searches for students whose GPA is greater than 3.6:

```json
GET students/_search
{
  "query": { 
    "bool": { 
      "filter": [ 
        { "range": { "gpa": { "gt": 3.6 }}}
      ]
    }
  }
}
```
{% include copy-curl.html %}

For more information about filters, see [Query and filter context]({{site.url}}{{site.baseurl}}/query-dsl/query-filter-context/).

### Compound queries

A compound query lets you combine multiple query or filter clauses. A Boolean query is an example of a compound query.

For example, to search for students whose name matches `doe` and filter by graduation year and GPA, use the following request:

```json
GET students/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "name": "doe"
          }
        },
        { "range": { "gpa": { "gte": 3.6, "lte": 3.9 } } },
        { "term":  { "grad_year": 2022 }}
      ]
    }
  }
}
```
{% include copy-curl.html %}

For more information about Boolean and other compound queries, see [Compound queries]({{site.url}}{{site.baseurl}}/query-dsl/compound/index/).

## Search methods

Along with the traditional full-text search described in this tutorial, OpenSearch supports a range of machine learning (ML)-powered search methods, including k-NN, semantic, multimodal, sparse, hybrid, and conversational search. For information about all OpenSearch-supported search methods, see [Search]({{site.url}}{{site.baseurl}}/search-plugins/).

## Next steps

- For information about available query types, see [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/index/).
- For information about available search methods, see [Search]({{site.url}}{{site.baseurl}}/search-plugins/).