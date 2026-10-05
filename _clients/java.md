---
layout: default
title: Java client
nav_order: 30
---

# Java client

The OpenSearch Java client allows you to interact with your OpenSearch clusters through Java methods and data structures rather than HTTP methods and raw JSON. For example, you can submit requests to your cluster using objects to create indexes, add data to documents, or complete some other operation using the client's built-in methods. For the client's complete API documentation and additional examples, see the [javadoc](https://www.javadoc.io/doc/org.opensearch.client/opensearch-java/latest/index.html).

This getting started guide illustrates how to connect to OpenSearch, index documents, and run queries. For the client source code, see the [`opensearch-java` repo](https://github.com/opensearch-project/opensearch-java).

## Installing the Java client

The Java client requires a transport in order to communicate with your cluster. `ApacheHttpClient5Transport` is the default transport and the recommended choice for new applications. The `RestClient` transport is deprecated and will be removed in a future release.

### Installing the client using Apache HttpClient 5 Transport

To start using the OpenSearch Java client, you need to provide a transport. The default `ApacheHttpClient5TransportBuilder` transport comes with the Java client. To use the OpenSearch Java client with the default transport, add it to your `pom.xml` file as a dependency:

```xml
<dependency>
  <groupId>org.opensearch.client</groupId>
  <artifactId>opensearch-java</artifactId>
  <version>3.10.0</version>
</dependency>
```
{% include copy.html %}

If you're using Gradle, add the following dependencies to your project:

```groovy
dependencies {
  implementation 'org.opensearch.client:opensearch-java:3.10.0'
}
```
{% include copy.html %}

You can now start your OpenSearch cluster.

### Installing the client using RestClient Transport (deprecated)

The `RestClientTransport` transport and the `org.opensearch.client.RestClient` class that it wraps are deprecated and will be removed in a future release. Use [Apache HttpClient 5 Transport](#installing-the-client-using-apache-httpclient-5-transport) instead.
{: .warning}

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
  <version>3.10.0</version>
</dependency>
```
{% include copy.html %}

If you're using Gradle, add the following dependencies to your project:

```groovy
dependencies {
  implementation 'org.opensearch.client:opensearch-rest-client:{{site.opensearch_version}}'
  implementation 'org.opensearch.client:opensearch-java:3.10.0'
}
```
{% include copy.html %}

You can now start your OpenSearch cluster.

## Sample data

The sample programs in the following sections use a `Student` class to represent documents. Use the following wrapper class, which declares `gpa` as a boxed `Double` so that partial updates serialize correctly:

```java
public class Student {
  private String firstName;
  private String lastName;
  private Double gpa;
  private String gradDate;

  public Student() {}

  public Student(String firstName, String lastName, double gpa, String gradDate) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.gpa = gpa;
    this.gradDate = gradDate;
  }

  public String getFirstName() { return firstName; }
  public void setFirstName(String firstName) { this.firstName = firstName; }
  public String getLastName() { return lastName; }
  public void setLastName(String lastName) { this.lastName = lastName; }
  public Double getGpa() { return gpa; }
  public void setGpa(Double gpa) { this.gpa = gpa; }
  public String getGradDate() { return gradDate; }
  public void setGradDate(String gradDate) { this.gradDate = gradDate; }

  @Override
  public String toString() {
    return String.format("Student{firstName='%s', lastName='%s', gpa=%s, gradDate=%s}",
      firstName, lastName, gpa, gradDate);
  }
}
```
{% include copy.html %}

## Connecting to OpenSearch

The following examples connect to a cluster that has the Security plugin enabled using either the Apache HttpClient 5 transport or the deprecated RestClient transport.

### Using Apache HttpClient 5 Transport

This code example uses the `admin` user. Replace `<custom-admin-password>` with the admin password that you set when you installed OpenSearch.

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
    final HttpHost host = new HttpHost("https", "localhost", 9200);
    final BasicCredentialsProvider credentialsProvider = new BasicCredentialsProvider();
    // Only for demo purposes. Don't specify your credentials in code.
    credentialsProvider.setCredentials(new AuthScope(host), new UsernamePasswordCredentials("admin", "<custom-admin-password>".toCharArray()));

    // Trusts all certificates, including self-signed certificates. For testing only. Don't use in production.
    final SSLContext sslcontext = SSLContextBuilder
      .create()
      .loadTrustMaterial(null, (chains, authType) -> true)
      .build();

    final ApacheHttpClient5TransportBuilder builder = ApacheHttpClient5TransportBuilder.builder(host);
    builder.setHttpClientConfigCallback(httpClientBuilder -> {
      final TlsStrategy tlsStrategy = ClientTlsStrategyBuilder.create()
        .setSslContext(sslcontext)
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

    final OpenSearchTransport transport = builder.build();
    OpenSearchClient client = new OpenSearchClient(transport);
  }
}
```
{% include copy.html %}

If you run into issues when configuring security, see [Troubleshooting TLS]({{site.url}}{{site.baseurl}}/security/configuration/troubleshoot-tls/).

### Using RestClient Transport (deprecated)

The `RestClientTransport` transport and the `org.opensearch.client.RestClient` class that it wraps are deprecated and will be removed in a future release. Use [Apache HttpClient 5 Transport](#using-apache-httpclient-5-transport) instead.
{: .warning}

This code example uses the `admin` user. Replace `<custom-admin-password>` with the admin password that you set when you installed OpenSearch.

The RestClient transport uses the Java truststore to validate the cluster's certificate. If you are using self-signed certificates or demo certificates, create a truststore that contains the root certificate authority (CA) certificate using the following command. When prompted, enter a password for the truststore:

```bash
keytool -importcert -file <path-to-root-ca-cert> -alias <alias> -keystore <truststore-name>
```
{% include copy.html %}

If you're using certificates from a trusted CA, you don't need to configure the truststore.

In the following code, replace `/full/path/to/keystore` with the path to your truststore and `password-to-keystore` with the truststore password. The following sample code initializes a client with SSL and TLS enabled:

```java
import org.apache.hc.core5.http.HttpHost;
import org.apache.hc.client5.http.auth.AuthScope;
import org.apache.hc.client5.http.auth.UsernamePasswordCredentials;
import org.apache.hc.client5.http.impl.async.HttpAsyncClientBuilder;
import org.apache.hc.client5.http.impl.auth.BasicCredentialsProvider;
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

    final HttpHost host = new HttpHost("https", "localhost", 9200);
    final BasicCredentialsProvider credentialsProvider = new BasicCredentialsProvider();
    //Only for demo purposes. Don't specify your credentials in code.
    credentialsProvider.setCredentials(new AuthScope(host), new UsernamePasswordCredentials("admin", "<custom-admin-password>".toCharArray()));

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

To connect to Amazon OpenSearch Service or Amazon OpenSearch Serverless, use `AwsSdk2Transport`, which signs requests using the AWS SDK for Java 2.x. Add the AWS SDK HTTP client and authentication modules to your `pom.xml` file in addition to `opensearch-java`:

```xml
<dependency>
  <groupId>software.amazon.awssdk</groupId>
  <artifactId>aws-crt-client</artifactId>
  <version>2.55.9</version>
</dependency>

<dependency>
  <groupId>software.amazon.awssdk</groupId>
  <artifactId>auth</artifactId>
  <version>2.55.9</version>
</dependency>
```
{% include copy.html %}

If you're using Gradle, add the following dependencies to your project:

```groovy
dependencies {
  implementation 'software.amazon.awssdk:aws-crt-client:2.55.9'
  implementation 'software.amazon.awssdk:auth:2.55.9'
}
```
{% include copy.html %}

The examples use `AwsCrtHttpClient`. Avoid `ApacheHttpClient` from the AWS SDK because it does not support request bodies in `GET` or `DELETE` requests, so `AwsSdk2Transport` throws a `TransportException` for operations such as `clearScroll()` and `deletePit()`.
{: .note}

In the following example, replace the endpoint with your domain endpoint, which is listed on the domain's details page in the Amazon OpenSearch Service console.

`AwsSdk2Transport` obtains AWS credentials from the AWS SDK default credentials provider chain. The following example illustrates connecting to Amazon OpenSearch Service:

```java
import org.opensearch.client.opensearch.OpenSearchClient;
import org.opensearch.client.opensearch.core.InfoResponse;
import org.opensearch.client.transport.aws.AwsSdk2Transport;
import org.opensearch.client.transport.aws.AwsSdk2TransportOptions;
import software.amazon.awssdk.http.SdkHttpClient;
import software.amazon.awssdk.http.crt.AwsCrtHttpClient;
import software.amazon.awssdk.regions.Region;

SdkHttpClient httpClient = AwsCrtHttpClient.builder().build();

OpenSearchClient client = new OpenSearchClient(
    new AwsSdk2Transport(
        httpClient,
        "search-<domain-name>-<id>.us-east-1.es.amazonaws.com", // OpenSearch endpoint, without https://
        "es",
        Region.US_EAST_1, // signing service region
        AwsSdk2TransportOptions.builder().build()
    )
);

InfoResponse info = client.info();
System.out.println(info.version().distribution() + ": " + info.version().number());

httpClient.close();
```
{% include copy.html %}

## Connecting to Amazon OpenSearch Serverless

In the following example, replace the endpoint with your collection endpoint, which is listed on the collection's details page in the Amazon OpenSearch Service console.

The following example illustrates connecting to Amazon OpenSearch Serverless. Because Amazon OpenSearch Serverless does not support the root endpoint, the example checks whether an index exists:

```java
import org.opensearch.client.opensearch.OpenSearchClient;
import org.opensearch.client.transport.aws.AwsSdk2Transport;
import org.opensearch.client.transport.aws.AwsSdk2TransportOptions;
import software.amazon.awssdk.http.SdkHttpClient;
import software.amazon.awssdk.http.crt.AwsCrtHttpClient;
import software.amazon.awssdk.regions.Region;

SdkHttpClient httpClient = AwsCrtHttpClient.builder().build();

OpenSearchClient client = new OpenSearchClient(
    new AwsSdk2Transport(
        httpClient,
        "<collection-id>.us-east-1.aoss.amazonaws.com", // OpenSearch Serverless collection endpoint, without https://
        "aoss",
        Region.US_EAST_1, // signing service region
        AwsSdk2TransportOptions.builder().build()
    )
);

boolean exists = client.indices().exists(e -> e.index("students")).value();
System.out.println("Index exists: " + exists);

httpClient.close();
```
{% include copy.html %}

Amazon OpenSearch Serverless supports a subset of OpenSearch API operations and does not support the `refresh` parameter used in the examples on this page. For more information, see [Supported operations and plugins in Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-genref.html).
{: .note}

## Creating an index

The following example creates an index with one primary shard and one replica. It explicitly maps the `gradDate` field as a `date` in the `yyyy-MM-dd` format. OpenSearch maps the other document fields dynamically when you index documents:

```java
String index = "students";
CreateIndexRequest createIndexRequest = new CreateIndexRequest.Builder()
  .index(index)
  .settings(s -> s
    .numberOfShards(1)
    .numberOfReplicas(1))
  .mappings(m -> m
    .properties("gradDate", p -> p.date(d -> d.format("yyyy-MM-dd"))))
  .build();
client.indices().create(createIndexRequest);
```
{% include copy.html %}

## Indexing a document

Index a document using the following code:

```java
Student student = new Student("John", "Doe", 3.89, "2022-05-15");
IndexRequest<Student> indexRequest = new IndexRequest.Builder<Student>()
  .index(index).id("1").document(student).refresh(Refresh.True).build();
IndexResponse indexResponse = client.index(indexRequest);
```
{% include copy.html %}

## Bulk indexing

Index multiple documents in a single request using the following code:

```java
List<BulkOperation> operations = new ArrayList<>();
operations.add(new BulkOperation.Builder().index(
  new IndexOperation.Builder<Student>()
    .index(index).id("2")
    .document(new Student("Paulo", "Santos", 3.93, "2021-05-20")).build()
).build());
operations.add(new BulkOperation.Builder().index(
  new IndexOperation.Builder<Student>()
    .index(index).id("3")
    .document(new Student("Shirley", "Rodriguez", 3.91, "2019-05-10")).build()
).build());
BulkRequest bulkRequest = new BulkRequest.Builder()
  .index(index).operations(operations).refresh(Refresh.True).build();
BulkResponse bulkResponse = client.bulk(bulkRequest);
```
{% include copy.html %}

## Searching for documents

Search for all documents in an index using the following code:

```java
SearchResponse<Student> searchResponse = client.search(s -> s.index(index), Student.class);
for (int i = 0; i < searchResponse.hits().hits().size(); i++) {
  System.out.println(searchResponse.hits().hits().get(i).source());
}
```
{% include copy.html %}

Each hit in `searchResponse.hits().hits()` is a `Hit<Student>` object that contains the document ID in `hit.id()` and the `Student` object in `hit.source()`, whose fields are available through getters. To use the `Hit` class, import `org.opensearch.client.opensearch.core.search.Hit`:

```java
for (Hit<Student> hit : searchResponse.hits().hits()) {
  Student student = hit.source();
  System.out.println("ID: " + hit.id() + ", name: " + student.getFirstName() + " " + student.getLastName()
      + ", GPA: " + student.getGpa() + ", graduation date: " + student.getGradDate());
}
```
{% include copy.html %}

Search using a range query. The `gte` and `lte` bounds take `JsonData` values, so import `org.opensearch.client.json.JsonData`:

```java
SearchResponse<Student> searchResponse = client.search(s -> s
  .index(index)
  .query(q -> q.range(r -> r
    .field("gradDate")
    .gte(JsonData.of("2019-01-01"))
    .lte(JsonData.of("2019-12-31")))),
  Student.class);
```
{% include copy.html %}

## Paginating results

To paginate results, use the `from` and `size` parameters. The following example sorts students by graduation date and retrieves the results two at a time. The first request returns the first page of results, and the second request returns the next page. To use the `SortOrder` enum, import `org.opensearch.client.opensearch._types.SortOrder`:

```java
SearchResponse<Student> firstPageResponse = client.search(s -> s
  .index(index)
  .from(0)
  .size(2)
  .sort(so -> so.field(f -> f.field("gradDate").order(SortOrder.Asc))),
  Student.class);
for (int i = 0; i < firstPageResponse.hits().hits().size(); i++) {
  System.out.println(firstPageResponse.hits().hits().get(i).source());
}

SearchResponse<Student> nextPageResponse = client.search(s -> s
  .index(index)
  .from(2)
  .size(2)
  .sort(so -> so.field(f -> f.field("gradDate").order(SortOrder.Asc))),
  Student.class);
for (int i = 0; i < nextPageResponse.hits().hits().size(); i++) {
  System.out.println(nextPageResponse.hits().hits().get(i).source());
}
```
{% include copy.html %}

The `from` and `size` parameters work well for the first pages of results. To paginate through a large number of results, use point in time with `search_after`. For more information, see [Paginate results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/).

## Updating a document

Update a document using a partial document object. Fields set to `null` are not sent, so only the specified fields are updated:

```java
Student updatedFields = new Student();
updatedFields.setGpa(3.92);
UpdateRequest<Student, Student> updateRequest = new UpdateRequest.Builder<Student, Student>()
  .index(index).id("1").doc(updatedFields).build();
UpdateResponse<Student> updateResponse = client.update(updateRequest, Student.class);
```
{% include copy.html %}

## Deleting a document

Delete a document using the following code:

```java
client.delete(b -> b.index(index).id("3").refresh(Refresh.True));
```
{% include copy.html %}

## Deleting an index

Delete an index using the following code:

```java
DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest.Builder().index(index).build();
DeleteIndexResponse deleteIndexResponse = client.indices().delete(deleteIndexRequest);
```
{% include copy.html %}

## Sample program

This sample program combines the code from the preceding sections. It connects to a cluster that has the Security plugin enabled. To connect to a cluster without the Security plugin, change the lines marked with `// Without security` comments. Before running the sample program, make sure that you have the `Student` class defined in your project. Make sure to change the credentials to match your cluster configuration.

This sample program is for testing only. It specifies credentials in code and disables certificate validation so that it can connect to a cluster that uses self-signed certificates. In production, load credentials from a secure location and validate the cluster's certificate.
{: .warning}

The following sample program creates a client, creates an index, indexes documents individually and in bulk, searches for documents, updates a document, deletes a document, and then deletes the index:

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
import org.opensearch.client.json.JsonData;
import org.opensearch.client.opensearch.OpenSearchClient;
import org.opensearch.client.opensearch._types.Refresh;
import org.opensearch.client.opensearch._types.SortOrder;
import org.opensearch.client.opensearch.core.IndexRequest;
import org.opensearch.client.opensearch.core.IndexResponse;
import org.opensearch.client.opensearch.core.SearchResponse;
import org.opensearch.client.opensearch.core.UpdateRequest;
import org.opensearch.client.opensearch.core.UpdateResponse;
import org.opensearch.client.opensearch.core.GetResponse;
import org.opensearch.client.opensearch.core.BulkRequest;
import org.opensearch.client.opensearch.core.BulkResponse;
import org.opensearch.client.opensearch.core.DeleteResponse;
import org.opensearch.client.opensearch.core.bulk.BulkOperation;
import org.opensearch.client.opensearch.core.bulk.IndexOperation;
import org.opensearch.client.opensearch.indices.*;
import org.opensearch.client.transport.OpenSearchTransport;
import org.opensearch.client.transport.httpclient5.ApacheHttpClient5TransportBuilder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class OpenSearchClientExample {
  public static void main(String[] args) throws Exception {
    final HttpHost host = new HttpHost("https", "localhost", 9200); // Without security, use new HttpHost("http", "localhost", 9200)
    final BasicCredentialsProvider credentialsProvider = new BasicCredentialsProvider(); // Without security, remove this line
    // Without security, remove this line
    credentialsProvider.setCredentials(new AuthScope(host), new UsernamePasswordCredentials("admin", "<custom-admin-password>".toCharArray()));

    final SSLContext sslcontext = SSLContextBuilder.create()
      .loadTrustMaterial(null, (chains, authType) -> true)
      .build();

    final ApacheHttpClient5TransportBuilder builder = ApacheHttpClient5TransportBuilder.builder(host);
    builder.setHttpClientConfigCallback(httpClientBuilder -> {
      final TlsStrategy tlsStrategy = ClientTlsStrategyBuilder.create()
        .setSslContext(sslcontext)
        .setTlsDetailsFactory(new Factory<SSLEngine, TlsDetails>() {
          @Override
          public TlsDetails create(final SSLEngine sslEngine) {
            return new TlsDetails(sslEngine.getSession(), sslEngine.getApplicationProtocol());
          }
        })
        .build();

      final PoolingAsyncClientConnectionManager connectionManager =
        PoolingAsyncClientConnectionManagerBuilder.create()
          .setTlsStrategy(tlsStrategy)
          .build();

      return httpClientBuilder
        .setDefaultCredentialsProvider(credentialsProvider) // Without security, remove this line
        .setConnectionManager(connectionManager);
    });

    final OpenSearchTransport transport = builder.build();
    final OpenSearchClient client = new OpenSearchClient(transport);

    try {
      // Create the index
      String index = "students";
      System.out.println("Creating index......");
      CreateIndexRequest createIndexRequest = new CreateIndexRequest.Builder()
        .index(index)
        .settings(s -> s
          .numberOfShards(1)
          .numberOfReplicas(1))
        .mappings(m -> m
          .properties("gradDate", p -> p.date(d -> d.format("yyyy-MM-dd"))))
        .build();
      CreateIndexResponse createIndexResponse = client.indices().create(createIndexRequest);
      System.out.println("Index created: " + createIndexResponse.index());

      // Index a document
      System.out.println("\nIndexing one student......");
      Student student = new Student("John", "Doe", 3.89, "2022-05-15");
      IndexRequest<Student> indexRequest = new IndexRequest.Builder<Student>()
        .index(index).id("1").document(student).refresh(Refresh.True).build();
      IndexResponse indexResponse = client.index(indexRequest);
      System.out.println("Result: " + indexResponse.result().jsonValue() + ", id: " + indexResponse.id() + ", version: " + indexResponse.version());

      // Bulk index documents
      System.out.println("\nIndexing many students......");
      List<BulkOperation> operations = new ArrayList<>();
      operations.add(new BulkOperation.Builder().index(
        new IndexOperation.Builder<Student>()
          .index(index).id("2")
          .document(new Student("Paulo", "Santos", 3.93, "2021-05-20")).build()
      ).build());
      operations.add(new BulkOperation.Builder().index(
        new IndexOperation.Builder<Student>()
          .index(index).id("3")
          .document(new Student("Shirley", "Rodriguez", 3.91, "2019-05-10")).build()
      ).build());
      BulkRequest bulkRequest = new BulkRequest.Builder()
        .index(index).operations(operations).refresh(Refresh.True).build();
      BulkResponse bulkResponse = client.bulk(bulkRequest);
      System.out.println("Errors: " + bulkResponse.errors());
      bulkResponse.items().forEach(item ->
        System.out.println("  " + item.result() + " id: " + item.id()));

      // Search for all students
      System.out.println("\nSearching for all students......");
      SearchResponse<Student> searchResponse = client.search(s -> s
        .index(index)
        .from(0)
        .size(2)
        .sort(so -> so.field(f -> f.field("gradDate").order(SortOrder.Asc))),
        Student.class);
      System.out.println("Total hits: " + searchResponse.hits().total().value());
      System.out.println("Page 1:");
      for (int i = 0; i < searchResponse.hits().hits().size(); i++) {
        System.out.println("  " + searchResponse.hits().hits().get(i).source());
      }
      SearchResponse<Student> nextPageResponse = client.search(s -> s
        .index(index)
        .from(2)
        .size(2)
        .sort(so -> so.field(f -> f.field("gradDate").order(SortOrder.Asc))),
        Student.class);
      System.out.println("Page 2:");
      for (int i = 0; i < nextPageResponse.hits().hits().size(); i++) {
        System.out.println("  " + nextPageResponse.hits().hits().get(i).source());
      }

      // Search for students who graduated in 2019
      System.out.println("\nSearching for students who graduated in 2019......");
      SearchResponse<Student> searchResponse2 = client.search(s -> s
        .index(index)
        .query(q -> q.range(r -> r
          .field("gradDate")
          .gte(JsonData.of("2019-01-01"))
          .lte(JsonData.of("2019-12-31")))),
        Student.class);
      System.out.println("Total hits: " + searchResponse2.hits().total().value());
      for (int i = 0; i < searchResponse2.hits().hits().size(); i++) {
        System.out.println("  " + searchResponse2.hits().hits().get(i).source());
      }

      // Update a document
      System.out.println("\nUpdating a student's GPA......");
      Student updatedFields = new Student();
      updatedFields.setGpa(3.92);
      UpdateRequest<Student, Student> updateRequest = new UpdateRequest.Builder<Student, Student>()
        .index(index).id("1").doc(updatedFields).build();
      UpdateResponse<Student> updateResponse = client.update(updateRequest, Student.class);
      System.out.println("Result: " + updateResponse.result().jsonValue() + ", version: " + updateResponse.version());

      // Get the updated document
      GetResponse<Student> getResponse = client.get(g -> g.index(index).id("1"), Student.class);
      System.out.println("Updated document: " + getResponse.source());

      // Delete a document
      System.out.println("\nDeleting a student......");
      DeleteResponse deleteResponse = client.delete(b -> b.index(index).id("3").refresh(Refresh.True));
      System.out.println("Result: " + deleteResponse.result().jsonValue());

      // Delete the index
      System.out.println("\nDeleting the index......");
      DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest.Builder().index(index).build();
      DeleteIndexResponse deleteIndexResponse = client.indices().delete(deleteIndexRequest);
      System.out.println("Acknowledged: " + deleteIndexResponse.acknowledged());

    } finally {
      transport.close();
    }
  }
}
```
{% include copy.html %}

The program produces the following output:

```
Creating index......
Index created: students

Indexing one student......
Result: created, id: 1, version: 1

Indexing many students......
Errors: false
  created id: 2
  created id: 3

Searching for all students......
Total hits: 3
Page 1:
  Student{firstName='Shirley', lastName='Rodriguez', gpa=3.91, gradDate=2019-05-10}
  Student{firstName='Paulo', lastName='Santos', gpa=3.93, gradDate=2021-05-20}
Page 2:
  Student{firstName='John', lastName='Doe', gpa=3.89, gradDate=2022-05-15}

Searching for students who graduated in 2019......
Total hits: 1
  Student{firstName='Shirley', lastName='Rodriguez', gpa=3.91, gradDate=2019-05-10}

Updating a student's GPA......
Result: updated, version: 2
Updated document: Student{firstName='John', lastName='Doe', gpa=3.92, gradDate=2022-05-15}

Deleting a student......
Result: deleted

Deleting the index......
Acknowledged: true
```

## Related documentation

- For more examples of using the client, see the [`opensearch-java` user guide](https://github.com/opensearch-project/opensearch-java/blob/main/USER_GUIDE.md).
- For guides to specific tasks, such as bulk indexing and searching, see the [`opensearch-java` guides](https://github.com/opensearch-project/opensearch-java/tree/main/guides).
- For complete sample applications, see the [`opensearch-java` samples](https://github.com/opensearch-project/opensearch-java/tree/main/samples).
