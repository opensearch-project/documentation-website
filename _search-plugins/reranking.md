Creating a rerank pipeline:

```
PUT /_search/pipeline/rerank_pipeline
{
  "response_processors": [
    {
      "rerank": {
        "ml_opensearch": {
          "model_id": id of TEXT_SIMILARITY model [required]
        },
        "context": {
          "document_fields": [ "title", "text_representation", ...]
        }
      }
    }
  ]
}
```

The rerank pipeline has two parameters: the context object and the rerank-type object.

The rerank-type object (keyed by name; here it's "ml-opensearch") provides the rerank processor static information needed across all reranking calls. For example, the id of the reranking model in ml-commons.

`ml_opensearch` rerank type parameters
| field name | required? | description |
| --- | --- | --- |
| model_id | required | unique id of a TEXT_SIMILARITY model (deployed via ml-commons) |

Requires `context.document_fields`

The context object provides the rerank processor information necessary for generating reranking context at query time. For instance, "document_fields" specifies where to look in each search result for context to pass to the reranking model.

`context` parameters
| field name | dependent rerank types | description |
| --- | --- | --- |
document_fields | ml_opensearch | nonempty list of document fields to rerank over |

Searching with a rerank pipeline:
 
```
POST /_search?search_pipeline=rerank_pipeline
{
  "query": {
    "match": {
      "text_representation": "Where is Albuquerque?"
     }
  },
  "ext": {
    "rerank": {
      "query_context": {
        "query_text": "Where is Albuquerque?"
      }
    }
  }
}
```

Reranking queries are pretty similar to ordinary queries, except that they have this additional "ext.rerank" section. The query_context object must have exactly one of two parameters (mutually exclusive): `ext.rerank.query_context` params
| field name | description |
| --- | --- |
| query_text | the (natural language) text of the question you want to rerank over |
| query_text_path | the json path to the text of the question you want to rerank over |

when specifying `query_text_path`, use the fully specified path. For example, for the above query, you'd set `query_text_path = query.match.text_representation.query`.

