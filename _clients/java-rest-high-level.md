---
layout: default
title: Java high-level REST client
nav_order: 20
---

# Java high-level REST client

The OpenSearch Java high-level REST client is deprecated. Support will be removed in OpenSearch version 3.0.0. We recommend switching to the [Java client]({{site.url}}{{site.baseurl}}/clients/java/) instead.
{: .warning}

The OpenSearch Java high-level REST client lets you interact with your OpenSearch clusters and indexes through Java methods and data structures rather than HTTP methods and JSON.

## Setup

To start using the OpenSearch Java high-level REST client, ensure that you have the following dependency in your project's `pom.xml` file:

```
<dependency>
  <groupId>org.opensearch.client</groupId>
  <artifactId>opensearch-rest-high-level-client</artifactId>
  <version>{{site.opensearch_version}}</version>
</dependency>
```

You can now start your OpenSearch cluster. The OpenSearch 1.x high-level REST client works with the 1.x versions of OpenSearch.

## Security

Before using the REST client in your Java application, you must configure the application's truststore to connect to the Security plugin. If you are using self-signed certificates or demo configurations, you can use the following command to create a custom truststore and add in root authority certificates.

If you're using certificates from a trusted Certificate Authority (CA), you don't need to configure the truststore.

```bash
keytool -import <path-to-cert> -alias <alias-to-call-cert> -keystore <truststore-name>
```

You can now point your Java client to the truststore and set basic authentication credentials that can access a secure cluster (refer to the sample code below on how to do so).

If you run into issues when configuring security, see [common issues]({{site.url}}{{site.baseurl}}/troubleshoot/index) and [troubleshoot TLS]({{site.url}}{{site.baseurl}}/troubleshoot/tls).

## Sample program

This code example uses basic credentials that come with the default OpenSearch configuration. If you’re using the OpenSearch Java high-level REST client with your own OpenSearch cluster, be sure to change the code to use your own credentials.

```java
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.nio.client.HttpAsyncClientBuilder;
import org.opensearch.action.admin.indices.delete.DeleteIndexRequest;
import org.opensearch.action.delete.DeleteRequest;
import org.opensearch.action.delete.DeleteResponse;
import org.opensearch.action.get.GetRequest;
import org.opensearch.action.get.GetResponse;
import org.opensearch.action.index.IndexRequest;
import org.opensearch.action.index.IndexResponse;
import org.opensearch.action.support.master.AcknowledgedResponse;
import org.opensearch.client.RequestOptions;
import org.opensearch.client.RestClient;
import org.opensearch.client.RestClientBuilder;
import org.opensearch.client.RestHighLevelClient;
import org.opensearch.client.indices.CreateIndexRequest;
import org.opensearch.client.indices.CreateIndexResponse;
import org.opensearch.common.settings.Settings;

import java.io.IOException;
import java.util.HashMap;

public class RESTClientSample {

  public static void main(String[] args) throws IOException {

    //Point to keystore with appropriate certificates for security.
    System.setProperty("javax.net.ssl.trustStore", "/full/path/to/keystore");
    System.setProperty("javax.net.ssl.trustStorePassword", "password-to-keystore");

    //Establish credentials to use basic authentication.
    //Only for demo purposes. Don't specify your credentials in code.
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

## Elasticsearch OSS Java high-level REST client

We recommend using the OpenSearch client to connect to OpenSearch clusters, but if you must use the Elasticsearch OSS Java high-level REST client, version 7.10.2 of the Elasticsearch OSS client also works with the 1.x versions of OpenSearch.

### Migrating to the OpenSearch Java high-level REST client

Migrating from the Elasticsearch OSS client to the OpenSearch high-level REST client is as simple as changing your Maven dependency to one that references [OpenSearch's dependency](#setup).

Afterward, change all references of `org.elasticsearch` to `org.opensearch`, and you're ready to start submitting requests to your OpenSearch cluster.
