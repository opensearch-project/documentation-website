---
layout: default
title: Elasticsearch OSS Java high-level REST client
nav_order: 60
nav_exclude: true
redirect_to: https://docs.opensearch.org/latest/clients/java-rest-high-level/
canonical_url: https://docs.opensearch.org/latest/clients/java-rest-high-level/
---

# Elasticsearch OSS Java high-level REST client

The Elasticsearch OSS Java high-level REST client allows you to interact with your OpenSearch clusters and indices through Java methods and data structures rather than HTTP methods and JSON.

You submit requests to your cluster using request objects, which allows you to create indices, add data to documents, or complete other operations with your cluster. In return, you get back response objects that have all of the available information, such as the associated index or ID, from your cluster.

## Setup

To start using the Elasticsearch OSS Java high-level REST client, ensure that you have the following dependency in your project's `pom.xml` file:

```
<dependency>
  <groupId>org.elasticsearch.client</groupId>
  <artifactId>elasticsearch-rest-high-level-client</artifactId>
  <version>7.10.2</version>
</dependency>
```

You can now start your OpenSearch cluster. The 7.10.2 Elasticsearch OSS high-level REST client works with the 1.x versions of OpenSearch.

## Sample code

```java
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.nio.client.HttpAsyncClientBuilder;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.support.master.AcknowledgedResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.indices.CreateIndexRequest;
import org.elasticsearch.client.indices.CreateIndexResponse;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.xcontent.XContentType;

import java.io.IOException;
import java.util.HashMap;

public class RESTClientSample {

  public static void main(String[] args) throws IOException {

    //Point to keystore with appropriate certificates for security.
    System.setProperty("javax.net.ssl.trustStore", "/full/path/to/keystore");
    System.setProperty("javax.net.ssl.trustStorePassword", password-to-keystore);

    //Establish credentials to use basic authentication.
    //Only for demo purposes. Do not specify your credentials in code.
    final CredentialsProvider credentialsProvider = new BasicCredentialsProvider();

    credentialsProvider.setCredentials(AuthScope.ANY,
      new UsernamePasswordCredentials("admin", "admin"));

    //Create a client.
    RestClientBuilder builder = RestClient.builder(new HttpHost("localhost", 9200, "https"))
      .setHttpClientConfigCallback(new RestClientBuilder.HttpClientConfigCallback() {
        @Override
        public HttpAsyncClientBuilder customizeHttpClient(HttpAsyncClientBuilder httpClientBuilder) {
          return httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider);
            }
          });
    RestHighLevelClient client = new RestHighLevelClient(builder);

    //Create a non-default index with custom settings and mappings.
    CreateIndexRequest createIndexRequest = new CreateIndexRequest("custom-index");

    createIndexRequest.settings(Settings.builder() //Specify in the settings how many shards you want in the index.
      .put("index.number_of_shards", 4)
      .put("index.number_of_replicas", 3)
      );
    //Create a set of maps for the index's mappings.
    HashMap<String, String> typeMapping = new HashMap<String,String>();
    typeMapping.put("type", "integer");
    HashMap<String, Object> ageMapping = new HashMap<String, Object>();
    ageMapping.put("age", typeMapping);
    HashMap<String, Object> mapping = new HashMap<String, Object>();
    mapping.put("properties", ageMapping);
    createIndexRequest.mapping(mapping);
    CreateIndexResponse createIndexResponse = client.indices().create(createIndexRequest, RequestOptions.DEFAULT);

    //Adding data to the index.
    IndexRequest request = new IndexRequest("custom-index"); //Add a document to the custom-index we created.
    request.id("1"); //Assign an ID to the document.

    HashMap<String, String> stringMapping = new HashMap<String, String>();
    stringMapping.put("message:", "Testing Java REST client");
    request.source(stringMapping); //Place your content into the index's source.
    IndexResponse indexResponse = client.index(request, RequestOptions.DEFAULT);

    //Getting back the document
    GetRequest getRequest = new GetRequest("custom-index", "1");
    GetResponse response = client.get(getRequest, RequestOptions.DEFAULT);

    System.out.println(response.getSourceAsString());

    //Delete the document
    DeleteRequest deleteDocumentRequest = new DeleteRequest("custom-index", "1"); //Index name followed by the ID.
    DeleteResponse deleteResponse = client.delete(deleteDocumentRequest, RequestOptions.DEFAULT);

    //Delete the index
    DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest("custom-index"); //Index name.
    AcknowledgedResponse deleteIndexResponse = client.indices().delete(deleteIndexRequest, RequestOptions.DEFAULT);

    client.close();
  }
}
```
