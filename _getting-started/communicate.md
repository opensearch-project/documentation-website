---
layout: default
title: Communicate with OpenSearch
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/getting-started/communicate/
---

# Communicate with OpenSearch

You can communicate with OpenSearch using the REST API or one of the OpenSearch language clients. This page introduces the OpenSearch REST API. If you need to communicate with OpenSearch in your programming language, see the [Clients]({{site.url}}{{site.baseurl}}/clients/) section for a list of available clients.

## OpenSearch REST API

You interact with OpenSearch clusters using the REST API, which offers a lot of flexibility. Through the REST API, you can change most OpenSearch settings, modify indexes, check cluster health, get statistics---almost everything. You can use clients like [cURL](https://curl.se/) or any programming language that can send HTTP requests. 

You can send HTTP requests in your terminal or in the [Dev Tools console]({{site.url}}{{site.baseurl}}/dashboards/dev-tools/index-dev/) in OpenSearch Dashboards.

### Sending requests in a terminal

When sending cURL requests in a terminal, the request format varies depending on whether you're using the Security plugin:

- **Without Security plugin**: Use `http://` URLs and no authentication.
- **With Security plugin**: Use `https://` URLs and provide username/password credentials.

As an example, consider a request to the Cluster Health API. 

If you're not using the Security plugin, send the following request:

```bash
curl -X GET "http://localhost:9200/_cluster/health"
```
{% include copy.html %}

If you're using the Security plugin, provide the username and password in the request. The default username is `admin`, and the password is set in your `docker-compose.yml` file in the `OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password>` setting:

```bash
curl -X GET "https://localhost:9200/_cluster/health" -ku admin:<custom-admin-password>
```
{% include copy.html %}

#### Pretty format


OpenSearch generally returns responses in a flat JSON format by default. For a human-readable response body, provide the `pretty` query parameter:

```bash
curl -X GET "http://localhost:9200/_cluster/health?pretty"
```
{% include copy.html %}

For more information about `pretty` and other useful query parameters, see [Common REST parameters]({{site.url}}{{site.baseurl}}/opensearch/common-parameters/).

#### Request body

For requests that contain a body, specify the `Content-Type` header and provide the request payload in the `-d` (data) option:

```json
curl -X GET "http://localhost:9200/students/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match_all": {}
  }
}'
```
{% include copy.html %}

### Sending requests in Dev Tools

The Dev Tools console in OpenSearch Dashboards uses a simpler syntax to format REST requests as compared to the cURL command. To send requests in Dev Tools, use the following steps:

1. Access OpenSearch Dashboards by opening `http://localhost:5601/` in a web browser on the same host that is running your OpenSearch cluster. If you're using the Security plugin, access OpenSearch Dashboards by opening `https://localhost:5601/`. The default username is `admin`, and the password is set in your `docker-compose.yml` file in the `OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password>` setting.
1. On the top menu bar, go to **Management > Dev Tools**.
1. In the left pane of the console, enter the following request:
    ```json
    GET _cluster/health
    ```
    {% include copy-curl.html %}
1. Choose the triangle icon on the upper right of the request to submit the query. You can also submit the request by pressing `Ctrl+Enter` (or `Cmd+Enter` for Mac users). To learn more about using the OpenSearch Dashboards console for submitting queries, see [Running queries in the console]({{site.url}}{{site.baseurl}}/dashboards/run-queries/).

In the following sections, and in most of the OpenSearch documentation, requests are presented in the Dev Tools console format. 

## Indexing documents

To add a JSON document to an OpenSearch index (that is, to _index_ a document), you send an HTTP request with the following header:

```json
PUT /<index-name>/_doc/<document-id>
```

For example, to index a document representing a student, send the following request:

```json
PUT /students/_doc/1
{
  "name": "John Doe",
  "gpa": 3.89,
  "grad_year": 2022
}
```
{% include copy-curl.html %}

Once you send the preceding request, OpenSearch creates an index called `students` and stores the ingested document in the index. If you don't provide an ID for your document, OpenSearch generates a document ID. In the preceding request, the document ID is specified as the student ID (`1`).

To learn more about indexing, see [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/).

## Dynamic mapping

When you index a document, OpenSearch infers the field types from the JSON types submitted in the document. This process is called _dynamic mapping_. For more information, see [Dynamic mapping]({{site.url}}{{site.baseurl}}/mappings/#dynamic-mapping).

To view the inferred field types, send a request to the `_mapping` endpoint:

```json
GET /students/_mapping
```
{% include copy-curl.html %}

OpenSearch responds with the field `type` for each field:

```json
{
  "students": {
    "mappings": {
      "properties": {
        "gpa": {
          "type": "float"
        },
        "grad_year": {
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

OpenSearch mapped the numeric fields to the `float` and `long` types. Notice that OpenSearch mapped the `name` text field to `text` and added a `name.keyword` subfield mapped to `keyword`. Fields mapped to `text` are analyzed (lowercased and split into terms) and can be used for full-text search. Fields mapped to `keyword` are used for exact term search.

OpenSearch mapped the `grad_year` field to `long`. If you want to map it to the `date` type instead, you need to [delete the index](#deleting-an-index) and then recreate it, explicitly specifying the mappings. For instructions on how to explicitly specify mappings, see [Index mappings and settings](#index-mappings-and-settings).

## Searching for documents

To run a search for the document, specify the index that you're searching and a query that will be used to match documents. The simplest query is the `match_all` query, which matches all documents in an index:

```json
GET /students/_search
{
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

OpenSearch returns the indexed document:

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
        "_id": "1",
        "_score": 1,
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

For more information about search, see [Search your data]({{site.url}}{{site.baseurl}}/getting-started/search-data/).

## Updating documents

In OpenSearch, documents are immutable. However, you can update a document by retrieving it, updating its information, and reindexing it. You can update an entire document using the Index Document API, providing values for all existing and added fields in the document. For example, to update the `gpa` field and add an `address` field to the previously indexed document, send the following request:

```json
PUT /students/_doc/1
{
  "name": "John Doe",
  "gpa": 3.91,
  "grad_year": 2022,
  "address": "123 Main St."
}
```
{% include copy-curl.html %}

Alternatively, you can update parts of a document by calling the Update Document API:

```json
POST /students/_update/1/
{
  "doc": {
    "gpa": 3.91,
    "address": "123 Main St."
  }
}
```
{% include copy-curl.html %}

For more information about partial document updates, see [Update Document API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-document/).

## Deleting a document

To delete a document, send a delete request and provide the document ID:

```json
DELETE /students/_doc/1
```
{% include copy-curl.html %}

## Deleting an index

To delete an index, send the following request:

```json
DELETE /students
```
{% include copy-curl.html %}

## Index mappings and settings

OpenSearch indexes are configured with mappings and settings:

- A _mapping_ is a collection of fields and the types of those fields. For more information, see [Mappings and field types]({{site.url}}{{site.baseurl}}/mappings/).
- _Settings_ include index data like the index name, creation date, and number of shards. For more information, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

You can specify the mappings and settings in one request. For example, the following request specifies the number of index shards and maps the `name` field to `text` and the `grad_year` field to `date`:

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
{% include copy-curl.html %}

Now you can index the same document that you indexed in the previous section:

```json
PUT /students/_doc/1
{
  "name": "John Doe",
  "gpa": 3.89,
  "grad_year": 2022
}
```
{% include copy-curl.html %}

To view the mappings for the index fields, send the following request:

```json
GET /students/_mapping
```
{% include copy-curl.html %}

OpenSearch mapped the `name` and `grad_year` fields according to the specified types and inferred the field type for the `gpa` field:

```json
{
  "students": {
    "mappings": {
      "properties": {
        "gpa": {
          "type": "float"
        },
        "grad_year": {
          "type": "date"
        },
        "name": {
          "type": "text"
        }
      }
    }
  }
}
```

Once a field is created, you cannot change its type. Changing a field type requires deleting the index and recreating it with the new mappings. 
{: .note}

## Further reading

- For information about the OpenSearch REST API, see the [REST API reference]({{site.url}}{{site.baseurl}}/api-reference/).
- For information about OpenSearch language clients, see [Clients]({{site.url}}{{site.baseurl}}/clients/).
- For information about mappings, see [Mappings and field types]({{site.url}}{{site.baseurl}}/mappings/).
- For information about settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## Next steps

- See [Ingest data into OpenSearch]({{site.url}}{{site.baseurl}}/getting-started/ingest-data/) to learn about ingestion options.
