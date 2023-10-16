---
layout: default
title: Execute Painless stored script
parent: Script APIs
nav_order: 2
---

# Execute Painless stored script
**Introduced 1.0**
{: .label .label-purple }

Runs a stored script written in the Painless language. 

OpenSearch provides several ways to run a script; the following sections show how to run a script by passing script information in the request body of a `GET <index>/_search` request.

## Request fields

| Field | Data type | Description | 
:--- | :--- | :---
| query | Object | A filter that specifies documents to process. |
| script_fields | Object | Fields to include in output. | 
| script | Object | ID of the script that produces a value for a field. |

#### Example request

The following request runs the stored script that was created in [Create or update stored script]({{site.url}}{{site.baseurl}}/api-reference/script-apis/create-stored-script/). The script sums the ratings for each book and displays the sum in the `total_ratings` field in the output.

* The script's target is the `books` index.

* The `"match_all": {}` property value is an empty object indicating to process each document in the index.

* The `total_ratings` field value is the result of the `my-first-script` execution. See  [Create or update stored script]({{site.url}}{{site.baseurl}}/api-reference/script-apis/create-stored-script/).

````json
GET books/_search
{
   "query": {
    "match_all": {}
  },
  "script_fields": {
    "total_ratings": {
      "script": {
        "id": "my-first-script" 
      }
    }
  }
}
````
{% include copy-curl.html %}

#### Example response

The `GET books/_search` request returns the following fields:

````json
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
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "books",
        "_id" : "1",
        "_score" : 1.0,
        "fields" : {
          "total_ratings" : [
            12
          ]
        }
      },
      {
        "_index" : "books",
        "_id" : "2",
        "_score" : 1.0,
        "fields" : {
          "total_ratings" : [
            15
          ]
        }
      },
      {
        "_index" : "books",
        "_id" : "3",
        "_score" : 1.0,
        "fields" : {
          "total_ratings" : [
            8
          ]
        }
      }
    ]
  }
}
````

## Response fields

| Field | Data type | Description | 
:--- | :--- | :---
| took | Integer | How long the operation took in milliseconds. |
| timed_out | Boolean | Whether the operation timed out. |
| _shards | Object | Total number of shards processed and also the total number of successful, skipped, and not processed. |
| hits | Object | Contains high-level information about the documents processed and an array of `hits` objects. See [Hits object](#hits-object). | 

#### Hits object

| Field | Data type | Description | 
:--- | :--- | :---
| total | Object | Total number of documents processed and their relationship to the `match` request field. |
| max_score | Double | Highest relevance score returned from all the hits. |
| hits | Array | Information about each document that was processed. See [Document object](#Document-object). |

#### Document object

| Field | Data type | Description | 
:--- | :--- | :---
| _index | String | Index that contains the document. |
| _id | String | Document ID. |
| _score | Float | Document's relevance score. |
| fields | Object | Fields and their value returned from the script. |

## Running a Painless stored script with parameters

To pass different parameters to the script each time when running a query, define `params` in `script_fields`.

#### Example

The following request runs the stored script that was created in [Create or update stored script]({{site.url}}{{site.baseurl}}/api-reference/script-apis/create-stored-script/). The script sums the ratings for each book, multiplies the summed value by the `multiplier` parameter, and displays the result in the output.

* The script's target is the `books` index.

* The `"match_all": {}` property value is an empty object, indicating that it processes each document in the index.

* The `total_ratings` field value is the result of the `multiplier-script` execution. See [Creating or updating a stored script with parameters]({{site.url}}{{site.baseurl}}/api-reference/script-apis/create-stored-script/).

* `"multiplier": 2` in the `params` field is a variable passed to the stored script `multiplier-script`:

```json
GET books/_search
{
   "query": {
    "match_all": {}
  },
  "script_fields": {
    "total_ratings": {
      "script": {
        "id": "multiplier-script", 
        "params": {
          "multiplier": 2
        }        
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took" : 12,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "3",
        "_score" : 1.0,
        "fields" : {
          "total_ratings" : [
            16
          ]
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : 1.0,
        "fields" : {
          "total_ratings" : [
            30
          ]
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 1.0,
        "fields" : {
          "total_ratings" : [
            24
          ]
        }
      }
    ]
  }
}
```

**Sort results using painless stored script
You can use painless stored script to sort results.**

#### Sample request

```json
GET books/_search
{
   "query": {
    "match_all": {}
  },
  "script_fields": {
    "total_ratings": {
      "script": {
        "id": "multiplier-script",
        "params": {
          "multiplier": 2
        }
      }
    }
  },
  "sort": {
    "_script": {
       "type": "number",
       "script": {
         "id": "multiplier-script",
         "params": {
           "multiplier": 2
          }
       },
       "order": "desc"
    }
  }
}
```

#### Sample response

```json
{
  "took" : 90,
  "timed_out" : false,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : null,
        "fields" : {
          "total_ratings" : [
            30
          ]
        },
        "sort" : [
          30.0
        ]
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : null,
        "fields" : {
          "total_ratings" : [
            24
          ]
        },
        "sort" : [
          24.0
        ]
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "3",
        "_score" : null,
        "fields" : {
          "total_ratings" : [
            16
          ]
        },
        "sort" : [
          16.0
        ]
      }
    ]
  }
}
```
