---
layout: default
title: Java high-level REST client
nav_order: 97
---

# Java high-level REST client

The Elasticsearch OSS Java high-level REST client allows you to interact with your OpenSearch clusters and indices through request objects and response objects. To create an index, add data to a document, or complete some other operation, you submit request objects to your cluster, and you get back response objects that have all of the available information, such as the associated index or ID, returned from your cluster.

## Setup

To start using the Elasticsearch OSS Java high-level REST client, ensure that you have the following dependency in your project's `pom.xml` file:

```
<dependency>
  <groupId>org.elasticsearch.client</groupId>
  <artifactId>elasticsearch-rest-high-level-client</artifactId>
  <version>7.10.2</version>
</dependency>
```

You can now start your OpenSearch cluster. Any version of OpenSearch works with the Elasticsearch OSS high-level REST client.

## Create high-level client

Before you begin submitting request objects, you need to first create a high-level REST client object. The following example demonstrates how to establish a client that uses basic authorization credentials to access a cluster.

If you're using the Elasticsearch OSS high-level REST client over HTTPS, you also need to point your java project to a keystore that has the appropriate security certificates.

```java
System.setProperty("javax.net.ssl.trustStore", "/full/path/to/keystore.jks");
System.setProperty("javax.net.ssl.trustStorePassword", password-to-keystore);

final CredentialsProvider credentialsProvider = new BasicCredentialsProvider();

credentialsProvider.setCredentials(AuthScope.ANY,
        new UsernamePasswordCredentials("admin", "admin"));

RestClientBuilder builder = RestClient.builder(new HttpHost("localhost", 9200, "https"))
        .setHttpClientConfigCallback(new RestClientBuilder.HttpClientConfigCallback() {
            @Override
            public HttpAsyncClientBuilder customizeHttpClient(HttpAsyncClientBuilder httpClientBuilder) {
                return httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider);
            }
        });

RestHighLevelClient client = new RestHighLevelClient(builder);
```

After creating your client, you're ready to start sending requests to your cluster.

## Create index and index documents

The following example demonstrates how to create an index with non-default settings.

```java
CreateIndexRequest createIndexRequest = new CreateIndexRequest("custom-index");

createIndexRequest.settings(Settings.builder() //Specify in the settings how many shards you want in the index.
      .put("index.number_of_shards", 4)
      .put("index.number_of_replicas", 3)
  );

createIndexRequest.mapping( //Specify any mappings you want.
    "{\n" +
        "  \"properties\": {\n" +
        "    \"age\": {\n" +
        "      \"type\": \"integer\"\n" +
        "    }\n" +
        "  }\n" +
        "}",
        XContentType.JSON);
CreateIndexResponse createIndexResponse = client.indices().create(createIndexRequest, RequestOptions.DEFAULT); //Send the request
```
## Add data

Now that the index is created, you can start adding data to it.

```java
IndexRequest request = new IndexRequest("custom-index"); //Add the document to the custom-index we created.
request.id("1"); //Assigning an ID to the document.
String data = "{" +
        "\"message\":\"Testing Java REST client\"" +
        "}";
request.source(data,XContentType.JSON); //Place your content into the index's source.
IndexResponse indexResponse = client.index(request, RequestOptions.DEFAULT);
```

## Read data

After you add data to your cluster, you can get it back as a string.

```java
GetRequest getRequest = new GetRequest("custom-index", "1"); //Index name followed by the document ID.
GetResponse response = client.get(getRequest, RequestOptions.DEFAULT);

System.out.println(response.getSourceAsString());
```

## Delete the document and index

When you're done with the documents, you can delete them. If you want, you can also delete the index.

```java
DeleteRequest deleteRequest = new DeleteRequest("custom-index", "1"); //Index name followed by the document ID.
DeleteResponse deleteResponse = client.delete(deleteRequest, RequestOptions.DEFAULT);

DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest("custom-index");
        AcknowledgedResponse deleteIndexResponse = client.indices().delete(deleteIndexRequest, RequestOptions.DEFAULT);
```
