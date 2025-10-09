---
layout: default
title: k-NN (gRPC)
parent: gRPC APIs
nav_order: 30
---

# k-NN (gRPC) API
**Introduced 3.2**
{: .label .label-purple }


The gRPC k-NN API is generally available starting with OpenSearch 3.2. However, expect updates to the protobuf structure as the feature matures in upcoming versions.

The gRPC k-NN API provides an efficient, binary-encoded interface for performing k-nearest neighbor searches using protocol buffers over gRPC. The k-NN plugin offers a specific search query type for vector similarity searches. This API offers superior performance compared to the traditional HTTP-based approach, making it ideal for large-scale machine learning and vector database applications.

For information about HTTP-based k-NN queries, see [k-NN query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/).

## Prerequisite

To submit gRPC requests, you must have a set of protobufs on the client side. For ways to obtain the protobufs, see [Using gRPC APIs]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/index/#using-grpc-apis).

## gRPC service and method

gRPC k-NN APIs reside in the [`SearchService`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.19.0/protos/services/search_service.proto#L22), the same service used for general search operations.

You can submit k-NN search requests by invoking the [`Search`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.19.0/protos/services/search_service.proto#L23) gRPC method within the `SearchService`, using a [`KnnQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.19.0/protos/schemas/common.proto#L1262) within the search request. The method takes a [`SearchRequest`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.19.0/protos/schemas/search.proto#L18) and returns a [`SearchResponse`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.19.0/protos/schemas/search.proto#L270).

The gRPC implementation uses the same underlying k-NN functionality as the HTTP API while providing improved performance through protocol buffer serialization.

## KnnQuery fields

The gRPC k-NN API uses the [`KnnQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.19.0/protos/schemas/common.proto#L1262) message within a [`QueryContainer`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.19.0/protos/schemas/common.proto#L395) for k-NN searches. The `KnnQuery` message accepts the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `field` | `string` | The vector field against which to run the search query. Required. |
| `vector` | `repeated float` | A query vector. Must have the same number of dimensions as the vector field. Optional. |
| `k` | `int32` | The number of nearest neighbors to return as top hits. Optional. |
| `min_score` | `float` | The minimum similarity score required for a neighbor to be considered a hit. Optional. |
| `max_distance` | `float` | The maximum physical distance in vector space required for a neighbor to be considered a hit. Optional. |
| `filter` | [`QueryContainer`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.19.0/protos/schemas/common.proto#L395) | Filters for the k-NN search query. See [Filter limitations](#filter-limitations). Optional. |
| `boost` | `float` | A boost value used to increase or decrease relevance scores. Default is 1.0. Optional. |
| `underscore_name` | `string` | A query name for query tagging (JSON key: `_name`). Optional. |
| `method_parameters` | [`ObjectMap`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.19.0/protos/schemas/common.proto#L111) | Algorithm-specific parameters (for example, `ef_search` or `nprobes`). Optional. |
| `rescore` | [`KnnQueryRescore`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.19.0/protos/schemas/common.proto#L1311) | A rescoring configuration for improved accuracy. Available in versions later than 2.17. Optional. |
| `expand_nested_docs` | `bool` | When `true`, retrieves scores for all nested field documents within each parent document. Used with nested queries. Optional. |

## Example request

The following example shows a gRPC search request with a k-NN query. It searches for the 10 most similar vectors to the query vector `[0.1, 0.2, 0.3, 0.4]` in the `my_vector` field of the `vector_index` index:

```json
{
  "index": ["vector_index"],
  "request_body": {
    "query": {
      "knn": {
        "field": "my_vector",
        "vector": [0.1, 0.2, 0.3, 0.4],
        "k": 10
      }
    },
    "size": 10
  }
}
```
{% include copy.html %}

## Java gRPC client example

The following is a basic example of using the gRPC k-NN API (the actual implementation depends on your gRPC client setup):

```java
import org.opensearch.protobufs.*;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

public class KnnGrpcClient {
    public static void main(String[] args) {
        ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 9400)
                .usePlaintext()
                .build();

        // Create a gRPC stub for search operations
        SearchServiceGrpc.SearchServiceBlockingStub searchStub =
            SearchServiceGrpc.newBlockingStub(channel);

        // Build a k-NN query using protocol buffers
        QueryContainer knnQuery = QueryContainer.newBuilder()
            .setKnn(KnnQuery.newBuilder()
                .setField("my_vector")
                .addAllVector(Arrays.asList(0.1f, 0.2f, 0.3f, 0.4f))
                .setK(10)
                .build())
            .build();

        // Create the search request
        SearchRequest request = SearchRequest.newBuilder()
            .addIndex("vector_index")
            .setRequestBody(SearchRequestBody.newBuilder()
                .setQuery(knnQuery)
                .setSize(10)
                .build())
            .build();

        // Execute the search
        try {
            SearchResponse response = searchStub.search(request);

            // Handle the response
            System.out.println("Search took: " + response.getTook() + " ms");

            HitsMetadata hits = response.getHits();
            if (hits.hasTotal()) {
                System.out.println("Found " + hits.getTotal().getValue() + " results");
            }

            // Process k-NN results with similarity scores
            for (HitsMetadataHitsInner hit : hits.getHitsList()) {
                System.out.println("Document ID: " + hit.getXId());
                if (hit.hasXScore()) {
                    System.out.println("Similarity score: " + hit.getXScore().getDouble());
                }
            }
        } catch (io.grpc.StatusRuntimeException e) {
            System.err.println("gRPC k-NN search request failed with status: " + e.getStatus());
            System.err.println("Error message: " + e.getMessage());
        }

        channel.shutdown();
    }
}
```
{% include copy.html %}

## Response fields

k-NN search requests return the same [`SearchResponse`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.19.0/protos/schemas/search.proto#L270) structure as regular search operations. For information about response fields, see [Search (gRPC) response fields]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/search/#response-fields).

The response includes the standard search metadata (`took`, `timed_out`, and `shards`) and a `hits` array containing the k-NN documents with their similarity scores.

## Filter limitations

The gRPC k-NN API has limited support for the `filter` clause compared to the HTTP API. For the current list of supported query types in gRPC, see the [Search API QueryContainer documentation]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/search/#querycontainer-fields) and [Supported queries]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/search/#supported-queries).

For complex filtering requirements, consider using the HTTP k-NN API, simplifying your filter logic, or waiting for the next version of k-NN gRPC.



## Related APIs

- [Search (gRPC)]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/search/) - General gRPC search functionality
- [Bulk (gRPC)]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/bulk/) - Bulk operations using gRPC
- [k-NN queries]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/) - HTTP-based k-NN query documentation

## Next steps

- Learn more about [vector search in OpenSearch]({{site.url}}{{site.baseurl}}/search-plugins/knn/index/).
- Explore [k-NN index settings]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/).
- Review [performance tuning for k-NN]({{site.url}}{{site.baseurl}}/search-plugins/knn/performance-tuning/).
- Read about [gRPC configuration]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/index/#enabling-grpc-apis).
