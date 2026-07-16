---
layout: default
title: Java client
nav_order: 30
---

# Java client

The OpenSearch Java client allows you to interact with your OpenSearch clusters through Java methods and data structures rather than HTTP methods and raw JSON. For example, you can submit requests to your cluster using objects to create indexes, add data to documents, or complete some other operation using the client's built-in methods. For the client's complete API documentation and additional examples, see the [javadoc](https://www.javadoc.io/doc/org.opensearch.client/opensearch-java/latest/index.html).

This getting started guide illustrates how to connect to OpenSearch, index documents, and run queries. For the client source code, see the [`opensearch-java` repo](https://github.com/opensearch-project/opensearch-java).

## Installing the client using Apache HttpClient 5 Transport

To start using the OpenSearch Java client, you need to provide a transport. The default `ApacheHttpClient5TransportBuilder` transport comes with the Java client. To use the OpenSearch Java client with the default transport, add it to your `pom.xml` file as a dependency:

```xml
<dependency>
  <groupId>org.opensearch.client</groupId>
  <artifactId>opensearch-java</artifactId>
  <version>3.9.0</version>
</dependency>

<dependency>
  <groupId>org.apache.httpcomponents.client5</groupId>
  <artifactId>httpclient5</artifactId>
  <version>5.2.1</version>
</dependency>
```
{% include copy.html %}

If you're using Gradle, add the following dependencies to your project:

```groovy
dependencies {
  implementation 'org.opensearch.client:opensearch-java:3.9.0'
  implementation 'org.apache.httpcomponents.client5:httpclient5:5.2.1'
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
  <version>3.9.0</version>
</dependency>
```
{% include copy.html %}

If you're using Gradle, add the following dependencies to your project:

```groovy
dependencies {
  implementation 'org.opensearch.client:opensearch-rest-client:{{site.opensearch_version}}'
  implementation 'org.opensearch.client:opensearch-java:3.9.0'
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

You can now point your Java client to the truststore and set basic authentication credentials that can access a secure cluster (see the sample code in the next sections).

If you run into issues when configuring security, see [common issues]({{site.url}}{{site.baseurl}}/troubleshoot/index/) and [troubleshoot TLS]({{site.url}}{{site.baseurl}}/troubleshoot/tls/).

## Sample data

The sample programs in the following sections use a `Student` class to represent documents. Use the following wrapper class with numeric fields as boxed types (`Double`, `Integer`) so that partial updates serialize correctly:

```java
public class Student {
  private String firstName;
  private String lastName;
  private Double gpa;
  private Integer gradYear;

  public Student() {}

  public Student(String firstName, String lastName, double gpa, int gradYear) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.gpa = gpa;
    this.gradYear = gradYear;
  }

  public String getFirstName() { return firstName; }
  public void setFirstName(String firstName) { this.firstName = firstName; }
  public String getLastName() { return lastName; }
  public void setLastName(String lastName) { this.lastName = lastName; }
  public Double getGpa() { return gpa; }
  public void setGpa(Double gpa) { this.gpa = gpa; }
  public Integer getGradYear() { return gradYear; }
  public void setGradYear(Integer gradYear) { this.gradYear = gradYear; }

  @Override
  public String toString() {
    return String.format("Student{firstName='%s', lastName='%s', gpa=%s, gradYear=%s}",
      firstName, lastName, gpa, gradYear);
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

    final HttpHost host = new HttpHost("https", "localhost", 9200);
    final BasicCredentialsProvider credentialsProvider = new BasicCredentialsProvider();
    //Only for demo purposes. Don't specify your credentials in code.
    credentialsProvider.setCredentials(new AuthScope(host), new UsernamePasswordCredentials("admin", "admin".toCharArray()));

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
        "es",
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
        "aoss",
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

Create an index using the following code:

```java
String index = "students";
CreateIndexRequest createIndexRequest = new CreateIndexRequest.Builder().index(index).build();
client.indices().create(createIndexRequest);
```
{% include copy.html %}

## Indexing a document

Index a document using the following code:

```java
Student student = new Student("John", "Doe", 3.89, 2022);
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
    .document(new Student("Paulo", "Santos", 3.93, 2021)).build()
).build());
operations.add(new BulkOperation.Builder().index(
  new IndexOperation.Builder<Student>()
    .index(index).id("3")
    .document(new Student("Shirley", "Rodriguez", 3.91, 2019)).build()
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

Search using a term query:

```java
SearchResponse<Student> searchResponse = client.search(s -> s
  .index(index)
  .query(q -> q.term(t -> t.field("gradYear").value(v -> v.longValue(2019)))),
  Student.class);
```
{% include copy.html %}

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
client.delete(b -> b.index(index).id("1"));
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

The following sample program creates a client, creates an index, indexes documents individually and in bulk, searches for documents, updates a document, deletes a document, and then deletes the index. Before running the sample program, make sure that you have the `Student` class defined in your project.

### Without security

Use the following sample program when connecting to an OpenSearch cluster that does not have the Security plugin enabled:

```java
import org.apache.hc.core5.http.HttpHost;
import org.opensearch.client.opensearch.OpenSearchClient;
import org.opensearch.client.opensearch._types.Refresh;
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
  public static void main(String[] args) throws IOException {
    final HttpHost host = new HttpHost("http", "localhost", 9200);
    final OpenSearchTransport transport = ApacheHttpClient5TransportBuilder.builder(host).build();
    final OpenSearchClient client = new OpenSearchClient(transport);

    try {
      // Create the index
      String index = "students";
      System.out.println("Creating index......");
      CreateIndexRequest createIndexRequest = new CreateIndexRequest.Builder().index(index).build();
      CreateIndexResponse createIndexResponse = client.indices().create(createIndexRequest);
      System.out.println("Index created: " + createIndexResponse.index());

      // Index a document
      System.out.println("\nIndexing one student......");
      Student student = new Student("John", "Doe", 3.89, 2022);
      IndexRequest<Student> indexRequest = new IndexRequest.Builder<Student>()
        .index(index).id("1").document(student).refresh(Refresh.True).build();
      IndexResponse indexResponse = client.index(indexRequest);
      System.out.println("Result: " + indexResponse.result() + ", id: " + indexResponse.id() + ", version: " + indexResponse.version());

      // Bulk index documents
      System.out.println("\nIndexing many students......");
      List<BulkOperation> operations = new ArrayList<>();
      operations.add(new BulkOperation.Builder().index(
        new IndexOperation.Builder<Student>()
          .index(index).id("2")
          .document(new Student("Paulo", "Santos", 3.93, 2021)).build()
      ).build());
      operations.add(new BulkOperation.Builder().index(
        new IndexOperation.Builder<Student>()
          .index(index).id("3")
          .document(new Student("Shirley", "Rodriguez", 3.91, 2019)).build()
      ).build());
      BulkRequest bulkRequest = new BulkRequest.Builder()
        .index(index).operations(operations).refresh(Refresh.True).build();
      BulkResponse bulkResponse = client.bulk(bulkRequest);
      System.out.println("Errors: " + bulkResponse.errors());
      bulkResponse.items().forEach(item ->
        System.out.println("  " + item.result() + " id: " + item.id()));

      // Search for all students
      System.out.println("\nSearching for all students......");
      SearchResponse<Student> searchResponse = client.search(s -> s.index(index), Student.class);
      System.out.println("Total hits: " + searchResponse.hits().total().value());
      for (int i = 0; i < searchResponse.hits().hits().size(); i++) {
        System.out.println("  " + searchResponse.hits().hits().get(i).source());
      }

      // Search for students who graduated in 2019
      System.out.println("\nSearching for students who graduated in 2019......");
      SearchResponse<Student> searchResponse2 = client.search(s -> s
        .index(index)
        .query(q -> q.term(t -> t.field("gradYear").value(v -> v.longValue(2019)))),
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
      System.out.println("Result: " + updateResponse.result() + ", version: " + updateResponse.version());

      // Get the updated document
      GetResponse<Student> getResponse = client.get(g -> g.index(index).id("1"), Student.class);
      System.out.println("Updated document: " + getResponse.source());

      // Delete a document
      System.out.println("\nDeleting a student......");
      DeleteResponse deleteResponse = client.delete(b -> b.index(index).id("3").refresh(Refresh.True));
      System.out.println("Result: " + deleteResponse.result());

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

### With security

Use the following sample program when connecting to an OpenSearch cluster that has the Security plugin enabled. Make sure to change the credentials and truststore path to match your cluster configuration:

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
import org.opensearch.client.opensearch._types.Refresh;
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
    System.setProperty("javax.net.ssl.trustStore", "/full/path/to/keystore");
    System.setProperty("javax.net.ssl.trustStorePassword", "password-to-keystore");

    final HttpHost host = new HttpHost("https", "localhost", 9200);
    final BasicCredentialsProvider credentialsProvider = new BasicCredentialsProvider();
    // Only for demo purposes. Don't specify your credentials in code.
    credentialsProvider.setCredentials(new AuthScope(host),
      new UsernamePasswordCredentials("admin", "<custom-admin-password>".toCharArray()));

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
        .setDefaultCredentialsProvider(credentialsProvider)
        .setConnectionManager(connectionManager);
    });

    final OpenSearchTransport transport = builder.build();
    final OpenSearchClient client = new OpenSearchClient(transport);

    try {
      // Create the index
      String index = "students";
      System.out.println("Creating index......");
      CreateIndexRequest createIndexRequest = new CreateIndexRequest.Builder().index(index).build();
      CreateIndexResponse createIndexResponse = client.indices().create(createIndexRequest);
      System.out.println("Index created: " + createIndexResponse.index());

      // Index a document
      System.out.println("\nIndexing one student......");
      Student student = new Student("John", "Doe", 3.89, 2022);
      IndexRequest<Student> indexRequest = new IndexRequest.Builder<Student>()
        .index(index).id("1").document(student).refresh(Refresh.True).build();
      IndexResponse indexResponse = client.index(indexRequest);
      System.out.println("Result: " + indexResponse.result() + ", id: " + indexResponse.id() + ", version: " + indexResponse.version());

      // Bulk index documents
      System.out.println("\nIndexing many students......");
      List<BulkOperation> operations = new ArrayList<>();
      operations.add(new BulkOperation.Builder().index(
        new IndexOperation.Builder<Student>()
          .index(index).id("2")
          .document(new Student("Paulo", "Santos", 3.93, 2021)).build()
      ).build());
      operations.add(new BulkOperation.Builder().index(
        new IndexOperation.Builder<Student>()
          .index(index).id("3")
          .document(new Student("Shirley", "Rodriguez", 3.91, 2019)).build()
      ).build());
      BulkRequest bulkRequest = new BulkRequest.Builder()
        .index(index).operations(operations).refresh(Refresh.True).build();
      BulkResponse bulkResponse = client.bulk(bulkRequest);
      System.out.println("Errors: " + bulkResponse.errors());
      bulkResponse.items().forEach(item ->
        System.out.println("  " + item.result() + " id: " + item.id()));

      // Search for all students
      System.out.println("\nSearching for all students......");
      SearchResponse<Student> searchResponse = client.search(s -> s.index(index), Student.class);
      System.out.println("Total hits: " + searchResponse.hits().total().value());
      for (int i = 0; i < searchResponse.hits().hits().size(); i++) {
        System.out.println("  " + searchResponse.hits().hits().get(i).source());
      }

      // Search for students who graduated in 2019
      System.out.println("\nSearching for students who graduated in 2019......");
      SearchResponse<Student> searchResponse2 = client.search(s -> s
        .index(index)
        .query(q -> q.term(t -> t.field("gradYear").value(v -> v.longValue(2019)))),
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
      System.out.println("Result: " + updateResponse.result() + ", version: " + updateResponse.version());

      // Get the updated document
      GetResponse<Student> getResponse = client.get(g -> g.index(index).id("1"), Student.class);
      System.out.println("Updated document: " + getResponse.source());

      // Delete a document
      System.out.println("\nDeleting a student......");
      DeleteResponse deleteResponse = client.delete(b -> b.index(index).id("3").refresh(Refresh.True));
      System.out.println("Result: " + deleteResponse.result());

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
