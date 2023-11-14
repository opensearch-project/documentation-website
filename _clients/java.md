---
layout: default
title: Java client
nav_order: 30
---

# Java client

The OpenSearch Java client allows you to interact with your OpenSearch clusters through Java methods and data structures rather than HTTP methods and raw JSON. For example, you can submit requests to your cluster using objects to create indexes, add data to documents, or complete some other operation using the client's built-in methods. For the client's complete API documentation and additional examples, see the [javadoc](https://www.javadoc.io/doc/org.opensearch.client/opensearch-java/latest/index.html).

This getting started guide illustrates how to connect to OpenSearch, index documents, and run queries. For the client source code, see the [opensearch-java repo](https://github.com/opensearch-project/opensearch-java).

## Installing the client using Apache HttpClient 5 Transport

To start using the OpenSearch Java client, you need to provide a transport. The default `ApacheHttpClient5TransportBuilder` transport comes with the Java client. To use the OpenSearch Java client with the default transport, add it to your `pom.xml` file as a dependency:

```xml
<dependency>
  <groupId>org.opensearch.client</groupId>
  <artifactId>opensearch-java</artifactId>
  <version>2.6.0</version>
</dependency>

<dependency>
  <groupId>org.apache.httpcomponents.client5</groupId>
  <artifactId>httpclient5</artifactId>
  <version>5.2.1</version>
</dependency>
```
{% include copy.html %}

If you're using Gradle, add the following dependencies to your project:

```
dependencies {
  implementation 'org.opensearch.client:opensearch-java:2.6.0'
}
```
{% include copy.html %}

You can now start your OpenSearch cluster.

## Installing the client using RestClient Transport

Alternatively, you can create a Java client by using the `RestClient`-based transport. In this case, make sure that you have the following dependencies in your project's `pom.xml` file:

```xml
<dependency>
  <groupId>org.opensearch.client</groupId>
  <artifactId>opensearch-rest-client</artifactId>
  <version>{{site.opensearch_version}}</version>
</dependency>

<dependency>
  <groupId>org.opensearch.client</groupId>
  <artifactId>opensearch-java</artifactId>
  <version>2.6.0</version>
</dependency>
```
{% include copy.html %}

If you're using Gradle, add the following dependencies to your project"

```
dependencies {
  implementation 'org.opensearch.client:opensearch-rest-client:{{site.opensearch_version}}'
  implementation 'org.opensearch.client:opensearch-java:2.6.0'
}
```
{% include copy.html %}

You can now start your OpenSearch cluster.

## Security

Before using the REST client in your Java application, you must configure the application's truststore to connect to the Security plugin. If you are using self-signed certificates or demo configurations, you can use the following command to create a custom truststore and add in root authority certificates.

If you're using certificates from a trusted Certificate Authority (CA), you don't need to configure the truststore.

```bash
keytool -import <path-to-cert> -alias <alias-to-call-cert> -keystore <truststore-name>
```
{% include copy.html %}

You can now point your Java client to the truststore and set basic authentication credentials that can access a secure cluster (refer to the sample code below on how to do so).

If you run into issues when configuring security, see [common issues]({{site.url}}{{site.baseurl}}/troubleshoot/index) and [troubleshoot TLS]({{site.url}}{{site.baseurl}}/troubleshoot/tls).

## Sample data

This section uses a class called `IndexData`, which is a simple Java class that stores basic data and methods. For your own OpenSearch cluster, you might find that you need a more robust class to store your data.

### IndexData class

```java
static class IndexData {
  private String firstName;
  private String lastName;

  public IndexData(String firstName, String lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  @Override
  public String toString() {
    return String.format("IndexData{first name='%s', last name='%s'}", firstName, lastName);
  }
}
```
{% include copy.html %}

## Initializing the client with SSL and TLS enabled using Apache HttpClient 5 Transport

This code example uses basic credentials that come with the default OpenSearch configuration. If you’re using the Java client with your own OpenSearch cluster, be sure to change the code so that it uses your own credentials.

The following sample code initializes a client with SSL and TLS enabled:


```java
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLEngine;

import org.apache.hc.client5.http.auth.AuthScope;
import org.apache.hc.client5.http.auth.UsernamePasswordCredentials;
import org.apache.hc.client5.http.impl.auth.BasicCredentialsProvider;
import org.apache.hc.client5.http.impl.nio.PoolingAsyncClientConnectionManager;
import org.apache.hc.client5.http.impl.nio.PoolingAsyncClientConnectionManagerBuilder;
import org.apache.hc.client5.http.ssl.ClientTlsStrategyBuilder;
import org.apache.hc.core5.function.Factory;
import org.apache.hc.core5.http.HttpHost;
import org.apache.hc.core5.http.nio.ssl.TlsStrategy;
import org.apache.hc.core5.reactor.ssl.TlsDetails;
import org.apache.hc.core5.ssl.SSLContextBuilder;
import org.opensearch.client.opensearch.OpenSearchClient;
import org.opensearch.client.transport.OpenSearchTransport;
import org.opensearch.client.transport.httpclient5.ApacheHttpClient5TransportBuilder;

public class OpenSearchClientExample {
  public static void main(String[] args) throws Exception {
    System.setProperty("javax.net.ssl.trustStore", "/full/path/to/keystore");
    System.setProperty("javax.net.ssl.trustStorePassword", "password-to-keystore");

    final HttpHost host = new HttpHost("https", "localhost", 9200);
    final BasicCredentialsProvider credentialsProvider = new BasicCredentialsProvider();
    // Only for demo purposes. Don't specify your credentials in code.
    credentialsProvider.setCredentials(new AuthScope(host), new UsernamePasswordCredentials("admin", "admin".toCharArray()));

    final SSLContext sslcontext = SSLContextBuilder
      .create()
      .loadTrustMaterial(null, (chains, authType) -> true)
      .build();

    final ApacheHttpClient5TransportBuilder builder = ApacheHttpClient5TransportBuilder.builder(host);
    builder.setHttpClientConfigCallback(httpClientBuilder -> {
      final TlsStrategy tlsStrategy = ClientTlsStrategyBuilder.create()
        .setSslContext(SSLContextBuilder.create().build())
        // See https://issues.apache.org/jira/browse/HTTPCLIENT-2219
        .setTlsDetailsFactory(new Factory<SSLEngine, TlsDetails>() {
          @Override
          public TlsDetails create(final SSLEngine sslEngine) {
            return new TlsDetails(sslEngine.getSession(), sslEngine.getApplicationProtocol());
          }
        })
        .build();

      final PoolingAsyncClientConnectionManager connectionManager = PoolingAsyncClientConnectionManagerBuilder
        .create()
        .setTlsStrategy(tlsStrategy)
        .build();

      return httpClientBuilder
        .setDefaultCredentialsProvider(credentialsProvider)
        .setConnectionManager(connectionManager);
    });

    final OpenSearchTransport transport = ApacheHttpClient5TransportBuilder.builder(host).build();
    OpenSearchClient client = new OpenSearchClient(transport);
  }
}

```

## Initializing the client with SSL and TLS enabled using RestClient Transport

This code example uses basic credentials that come with the default OpenSearch configuration. If you’re using the Java client with your own OpenSearch cluster, be sure to change the code so that it uses your own credentials.

The following sample code initializes a client with SSL and TLS enabled:

```java
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.impl.nio.client.HttpAsyncClientBuilder;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.opensearch.client.RestClient;
import org.opensearch.client.RestClientBuilder;
import org.opensearch.client.json.jackson.JacksonJsonpMapper;
import org.opensearch.client.opensearch.OpenSearchClient;
import org.opensearch.client.transport.OpenSearchTransport;
import org.opensearch.client.transport.rest_client.RestClientTransport;

public class OpenSearchClientExample {
  public static void main(String[] args) throws Exception {
    System.setProperty("javax.net.ssl.trustStore", "/full/path/to/keystore");
    System.setProperty("javax.net.ssl.trustStorePassword", "password-to-keystore");

    final HttpHost host = new HttpHost("https", 9200, "localhost");
    final BasicCredentialsProvider credentialsProvider = new BasicCredentialsProvider();
    //Only for demo purposes. Don't specify your credentials in code.
    credentialsProvider.setCredentials(new AuthScope(host), new UsernamePasswordCredentials("admin", "admin"));

    //Initialize the client with SSL and TLS enabled
    final RestClient restClient = RestClient.builder(host).
      setHttpClientConfigCallback(new RestClientBuilder.HttpClientConfigCallback() {
        @Override
        public HttpAsyncClientBuilder customizeHttpClient(HttpAsyncClientBuilder httpClientBuilder) {
        return httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider);
        }
      }).build();

    final OpenSearchTransport transport = new RestClientTransport(restClient, new JacksonJsonpMapper());
    final OpenSearchClient client = new OpenSearchClient(transport);
  }
}
```
{% include copy.html %}

## Connecting to Amazon OpenSearch Service

The following example illustrates connecting to Amazon OpenSearch Service:

```java
SdkHttpClient httpClient = ApacheHttpClient.builder().build();

OpenSearchClient client = new OpenSearchClient(
    new AwsSdk2Transport(
        httpClient,
        "search-...us-west-2.es.amazonaws.com", // OpenSearch endpoint, without https://
        "es"
        Region.US_WEST_2, // signing service region
        AwsSdk2TransportOptions.builder().build()
    )
);

InfoResponse info = client.info();
System.out.println(info.version().distribution() + ": " + info.version().number());

httpClient.close();
```
{% include copy.html %}

## Connecting to Amazon OpenSearch Serverless

The following example illustrates connecting to Amazon OpenSearch Serverless Service:

```java
SdkHttpClient httpClient = ApacheHttpClient.builder().build();

OpenSearchClient client = new OpenSearchClient(
    new AwsSdk2Transport(
        httpClient,
        "search-...us-west-2.aoss.amazonaws.com", // OpenSearch endpoint, without https://
        "aoss"
        Region.US_WEST_2, // signing service region
        AwsSdk2TransportOptions.builder().build()
    )
);

InfoResponse info = client.info();
System.out.println(info.version().distribution() + ": " + info.version().number());

httpClient.close();
```
{% include copy.html %}


## Creating an index 

You can create an index with non-default settings using the following code:

```java
String index = "sample-index";
CreateIndexRequest createIndexRequest = new CreateIndexRequest.Builder().index(index).build();
client.indices().create(createIndexRequest);

IndexSettings indexSettings = new IndexSettings.Builder().autoExpandReplicas("0-all").build();
PutIndicesSettingsRequest putIndicesSettingsRequest = new PutIndicesSettingsRequest.Builder().index(index).value(indexSettings).build();
client.indices().putSettings(putIndicesSettingsRequest);
```
{% include copy.html %}

## Indexing data

You can index data into OpenSearch using the following code:

```java
IndexData indexData = new IndexData("first_name", "Bruce");
IndexRequest<IndexData> indexRequest = new IndexRequest.Builder<IndexData>().index(index).id("1").document(indexData).build();
client.index(indexRequest);
```
{% include copy.html %}

## Searching for documents

You can search for a document using the following code:

```java
SearchResponse<IndexData> searchResponse = client.search(s -> s.index(index), IndexData.class);
for (int i = 0; i< searchResponse.hits().hits().size(); i++) {
  System.out.println(searchResponse.hits().hits().get(i).source());
}
```
{% include copy.html %}

## Deleting a document

The following sample code deletes a document whose ID is 1:

```java
client.delete(b -> b.index(index).id("1"));
```
{% include copy.html %}

### Deleting an index

The following sample code deletes an index:

```java
DeleteIndexRequest deleteIndexRequest = new DeleteRequest.Builder().index(index).build();
DeleteIndexResponse deleteIndexResponse = client.indices().delete(deleteIndexRequest);
```
{% include copy.html %}

## Sample program

The following sample program creates a client, adds an index with non-default settings, inserts a document, searches for the document, deletes the document, and then deletes the index:

```java
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.nio.client.HttpAsyncClientBuilder;
import org.opensearch.client.RestClient;
import org.opensearch.client.RestClientBuilder;
import org.opensearch.client.base.RestClientTransport;
import org.opensearch.client.base.Transport;
import org.opensearch.client.json.jackson.JacksonJsonpMapper;
import org.opensearch.client.opensearch.OpenSearchClient;
import org.opensearch.client.opensearch._global.IndexRequest;
import org.opensearch.client.opensearch._global.IndexResponse;
import org.opensearch.client.opensearch._global.SearchResponse;
import org.opensearch.client.opensearch.indices.*;
import org.opensearch.client.opensearch.indices.put_settings.IndexSettingsBody;

import java.io.IOException;

public class OpenSearchClientExample {
  public static void main(String[] args) {
    RestClient restClient = null;
    try{
      System.setProperty("javax.net.ssl.trustStore", "/full/path/to/keystore");
      System.setProperty("javax.net.ssl.trustStorePassword", "password-to-keystore");

      //Only for demo purposes. Don't specify your credentials in code.
      final CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
      credentialsProvider.setCredentials(AuthScope.ANY,
        new UsernamePasswordCredentials("admin", "admin"));

      //Initialize the client with SSL and TLS enabled
      restClient = RestClient.builder(new HttpHost("localhost", 9200, "https")).
        setHttpClientConfigCallback(new RestClientBuilder.HttpClientConfigCallback() {
          @Override
          public HttpAsyncClientBuilder customizeHttpClient(HttpAsyncClientBuilder httpClientBuilder) {
          return httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider);
          }
        }).build();
      Transport transport = new RestClientTransport(restClient, new JacksonJsonpMapper());
      OpenSearchClient client = new OpenSearchClient(transport);

      //Create the index
      String index = "sample-index";
      CreateIndexRequest createIndexRequest = new CreateIndexRequest.Builder().index(index).build();
      client.indices().create(createIndexRequest);

      //Add some settings to the index
      IndexSettings indexSettings = new IndexSettings.Builder().autoExpandReplicas("0-all").build();
      IndexSettingsBody settingsBody = new IndexSettingsBody.Builder().settings(indexSettings).build();
      PutSettingsRequest putSettingsRequest = new PutSettingsRequest.Builder().index(index).value(settingsBody).build();
      client.indices().putSettings(putSettingsRequest);

      //Index some data
      IndexData indexData = new IndexData("first_name", "Bruce");
      IndexRequest<IndexData> indexRequest = new IndexRequest.Builder<IndexData>().index(index).id("1").document(indexData).build();
      client.index(indexRequest);

      //Search for the document
      SearchResponse<IndexData> searchResponse = client.search(s -> s.index(index), IndexData.class);
      for (int i = 0; i< searchResponse.hits().hits().size(); i++) {
        System.out.println(searchResponse.hits().hits().get(i).source());
      }

      //Delete the document
      client.delete(b -> b.index(index).id("1"));

      // Delete the index
      DeleteIndexRequest deleteIndexRequest = new DeleteRequest.Builder().index(index).build();
      DeleteIndexResponse deleteIndexResponse = client.indices().delete(deleteIndexRequest);
    } catch (IOException e){
      System.out.println(e.toString());
    } finally {
      try {
        if (restClient != null) {
          restClient.close();
        }
      } catch (IOException e) {
        System.out.println(e.toString());
      }
    }
  }
}
```
{% include copy.html %}
