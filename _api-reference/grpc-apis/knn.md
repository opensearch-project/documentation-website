---
layout: default
title: KNN (gRPC)
parent: gRPC APIs
nav_order: 30
---

# KNN (gRPC) API
**Introduced 3.2**
{: .label .label-purple }

**Generally available 3.2**
{: .label .label-green }

The gRPC KNN API provides an efficient, binary-encoded interface for performing k-nearest neighbor searches using protocol buffers over gRPC. This API offers superior performance for vector similarity searches compared to the traditional HTTP-based approach, making it ideal for large-scale machine learning and vector database applications.

For information about HTTP-based k-NN queries, see [k-NN query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/).

## Prerequisite

To submit gRPC requests, you must have a set of protobufs on the client side. For ways to obtain the protobufs, see [Using gRPC APIs]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/index/#using-grpc-apis).

## gRPC service and method

gRPC KNN APIs are part of the transport-grpc module and leverage the same underlying k-NN functionality as the HTTP API. The gRPC implementation supports all k-NN query types and parameters available in the REST API while providing improved performance characteristics.

You can submit KNN search requests through the gRPC transport layer, which uses the same query structure as HTTP requests but with protocol buffer serialization for enhanced performance.

## Query structure

The gRPC KNN API uses the same query structure as the HTTP API but serialized using protocol buffers. All HTTP KNN query parameters are supported, except `filter`:

- `vector`: The query vector for similarity search
- `k`: Number of nearest neighbors to return
- `max_distance`: Maximum distance threshold for radial search
- `min_score`: Minimum score threshold for radial search
- `filter`: Query filters to apply during search (limited support - see [Filter limitations](#filter-limitations))
- `method_parameters`: Algorithm-specific parameters (ef_search, nprobes)
- `rescore`: Rescoring configuration for improved accuracy

## Example usage

Here's a basic example of how to use the gRPC KNN API conceptually (actual implementation depends on your gRPC client setup):

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
        SearchResponse response = searchStub.search(request);

        System.out.println("Found " + response.getResponseBody().getHits().getHitsCount() + " results");

        channel.shutdown();
    }
}
```
{% include copy.html %}

## Filter limitations

The gRPC KNN API has limited support for the `filter` clause compared to the HTTP API:

- **Supported filters**: Basic term, terms, range, and bool queries
- **Unsupported filters**: Complex nested queries, script queries, and some specialized query types

For complex filtering requirements, consider using the HTTP k-NN API, simplifying your filter logic, or waiting for the next release of KNN GRPC.



## Related APIs

- [Search (gRPC)]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/search/) - General gRPC search functionality
- [Bulk (gRPC)]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/bulk/) - Bulk operations via gRPC
- [k-NN queries]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/) - HTTP-based k-NN query documentation

## Next steps

- Learn more about [vector search in OpenSearch]({{site.url}}{{site.baseurl}}/search-plugins/knn/index/)
- Explore [KNN index settings]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/)
- Review [performance tuning for KNN]({{site.url}}{{site.baseurl}}/search-plugins/knn/performance-tuning/)
- Read about [gRPC configuration]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/index/#enabling-the-plugin)
