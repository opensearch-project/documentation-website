---
layout: default
title: Communicate with OpenSearch
nav_order: 30
---

# Communicate with OpenSearch

You can communicate with OpenSearch using REST API or one of the OpenSearch language clients. This page introduces the OpenSearch REST API. If you need to communicate with OpenSearch in your programming language, see the [Clients]({{site.url}}{{site.baseurl}}/clients/) section for a list of available clients.

## OpenSearch REST API

You interact with OpenSearch clusters using the REST API, which offers a lot of flexibility. You can change most OpenSearch settings using the REST API, modify indexes, check the health of the cluster, get statistics---almost everything. You can use clients like [cURL](https://curl.se/) or any programming language that can send HTTP requests. 

You can send HTTP requests in your terminal or in the Dev Tools console in OpenSearch Dashboards.

### Sending requests in the terminal

To send a cURL request in your terminal, enter the request in cURL format. For example, to view the indexes in your cluster, send a CAT indices request. 

If you're not using the Security plugin, the CAT indices request is as follows:

```json
curl -XGET "http://localhost:9200/_cat/indices"
```
{% include copy.html %}

If you're using the Security plugin, provide the user name and password in the request:

```json
curl -H 'Content-Type: application/json' -X GET "https://localhost:9200/_cat/indices" -ku admin:<custom-admin-password>
```
{% include copy.html %}

The default username is `admin` and the password is set in your `docker-compose.yml` file in the `OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password>` setting.

### Sending requests in Dev Tools

The Dev Tools console in OpenSearch Dashboards uses a simplified syntax to format REST requests compared to the cURL command. To send requests in Dev Tools, use the following steps:

1. Access OpenSearch Dashboards by opening `http://localhost:5601/` in a web browser on the same host that is running your OpenSearch cluster. The default username is `admin` and the password is set in your `docker-compose.yml` file in the `OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password>` setting.
1. On the top menu bar, go to **Management > Dev Tools**.
1. In the left pane of the console, enter the following request:
    ```json
    GET _cat/indices
    ```
    {% include copy-curl.html %}
1. Choose the triangle icon at the upper right of the request to submit the query. You can also submit the request by pressing `Ctrl+Enter` (or `Cmd+Enter` for Mac users). To learn more about using the OpenSearch Dashboards console for submitting queries, see [Running queries in the console]({{site.url}}{{site.baseurl}}/dashboards/run-queries/).

## Indexing documents

To add a JSON document to an OpenSearch index (that is, to _index_ a document), you send an HTTP request that has the following header:

```json
PUT https://<host>:<port>/<index-name>/_doc/<document-id>
```

For example, to index a document representing a student, you can send the following request:

```json
PUT /students/_doc/123456
{
  "name": "John Doe",
  "grade": 12,
  "gpa": 3.89,
  "grad_year": 2022,
  "future_plans": "John plans to be a computer science major"
}
```
{% include copy-curl.html %}

Once you send the preceding request, OpenSearch creates an index called `students` and stores the ingested document in the index. If you don't provide an ID for your document, OpenSearch generates a document ID. For the preceding request, you have specified the document ID to be the student ID (`123456`). 

### Dynamic mapping

When you index a document, OpenSearch infers the field types from the JSON types submitted in the document. This process is called _dynamic mapping_. For more information, see [Dynamic mapping]({{site.url}}{{site.baseurl}}/field-types/#dynamic-mapping).

To view the inferred field data types, send a request to the `_mapping` endpoint:

```json
GET students/_mapping
```
{% include copy-curl.html %}

OpenSearch responds with the field `type` for each field:

```json
{
  "students": {
    "mappings": {
      "properties": {
        "future_plans": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "gpa": {
          "type": "float"
        },
        "grad_year": {
          "type": "long"
        },
        "grade": {
          "type": "long"
        },
        "name": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        }
      }
    }
  }
}
```

OpenSearch mapped the numeric fields to the `float` and `long` types. Notice that OpenSearch mapped the text fields to `text` and added a `name.keyword` subfield mapped to `keyword`. Fields mapped to `text` are used for full-text search, while fields mapped to `keyword` are used for exact term search.

OpenSearch mapped the `grad_year` field to `long`. If you want to map it to the `date` type instead, you need to [delete the index](#deleting-the-index) and recreate it, specifying the mappings you want explicitly. For steps to specify explicit mappings, see [Index settings and mappings](#index-settings-and-mappings).

## Searching for documents

To run a search for the document, specify the index that you're searching and a query that will be used to match documents. For example, the simplest query is the `match_all` query that matches all documents in the index:

```json
GET /students/_search
{
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

Note that when you run the preceding query in a terminal, the response is not formatted because queries submitted to OpenSearch generally return a flat JSON by default. For a human-readable response body, provide the `pretty` query parameter:

```json
curl -XGET "http://localhost:9200/students/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match_all": {}
  }
}'
```
{% include copy.html %}

For more information about `pretty` and other useful query parameters, see [Common REST parameters]({{site.url}}{{site.baseurl}}/opensearch/common-parameters/).

OpenSearch returns the document that you indexed:

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
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "students",
        "_id": "123456",
        "_score": 1,
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

## Updating documents

In OpenSearch, documents are immutable. However, you can update a document by retrieving it, updating its information, and reindexing it. You can update the whole document using the Index Document API, providing values for all existing and added fields in the document. For example, to update the `gpa` field and add an `address` field to the previously indexed document, send the following request:

```json
PUT /students/_doc/123456
{
  "name": "John Doe",
  "grade": 12,
  "gpa": 3.91,
  "grad_year": 2022,
  "future_plans": "John plans to be a computer science major",
  "address": "123 Main St."
}
```
{% include copy.html %}

Alternatively, you can update parts of a document by calling the Update Document API:

```json
POST /students/_update/123456/
{
  "doc": {
    "gpa": 3.91,
    "address": "123 Main St."
  }
}
```
{% include copy.html %}

For more information about partial document updates, see [Update Document API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-document/).

## Deleting documents

To delete the document, send a delete request and provide the document ID:

```json
DELETE /students/_doc/123456
```
{% include copy.html %}

## Deleting the index

To delete the index, send the following delete request:

```json
DELETE /students
```
{% include copy.html %}

## Index settings and mappings

OpenSearch indexes contain mappings and settings:

- A _mapping_ is the collection of fields and the types of those fields. For more information, see [Mappings and field types]({{site.url}{{site.baseurl}}/field-types).
- _Settings_ include index data like the index name, creation date, and number of shards. For more information, see [Configuring OpenSearch]({{site.url}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

You can specify the settings and mappings in one request. For example, the following request specifies the number of shards for the index and maps the `name` field to `text` and the `grad_year` field to `date`:

```json
PUT /students
{
  "settings": {
    "index.number_of_shards": 1
  }, 
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      },
      "grad_year": {
        "type": "date"
      }
    }
  }
}
```
{% include copy.html %}

Now you can index the same document as you indexed in the previous section:

```json
PUT /students/_doc/123456
{
  "name": "John Doe",
  "grade": 12,
  "gpa": 3.89,
  "grad_year": 2022,
  "future_plans": "John plans to be a computer science major"
}
```
{% include copy.html %}

To view the mappings for the index fields, send the following request:

```json
GET students/_mapping
```
{% include copy-curl.html %}

OpenSearch mapped the `name` and `grad_year` fields according to the types you specified and inferred the field types for the other fields:

```json
{
  "students": {
    "mappings": {
      "properties": {
        "future_plans": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "gpa": {
          "type": "float"
        },
        "grad_year": {
          "type": "date"
        },
        "grade": {
          "type": "long"
        },
        "name": {
          "type": "text"
        }
      }
    }
  }
}
```

You cannot change the mappings once the index is created. 
{: .note}

## Next steps

- Learn about ingestion options in [Ingest data into OpenSearch]({{site.url}}{{site.baseurl}}/getting-started/ingest-data/)

## Further reading

- For information about OpenSearch REST API, see the [REST API reference]({{site.url}{{site.baseurl}}/api-reference/)
- For information about OpenSearch language clients, see [Clients]({{site.url}{{site.baseurl}}/clients/)
- For information about mappings, see [Mappings and field types]({{site.url}{{site.baseurl}}/field-types)
- For information about settings, see [Configuring OpenSearch]({{site.url}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/)
