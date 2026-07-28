---
layout: default
title: Java gRPC transport
nav_order: 35
---

# Java gRPC transport

The OpenSearch Java gRPC transport provides a high-performance alternative to the default REST transport for supported operations. It uses [protocol buffers](https://protobuf.dev/) over [gRPC](https://grpc.io/) for binary serialization and HTTP/2 multiplexing, reducing payload size and improving throughput for bulk ingestion workloads.

The gRPC transport is **transparent** — you use the same `OpenSearchClient` methods you already know (`client.bulk()`, `client.search()`, etc.). Supported operations are automatically routed over gRPC, while all other operations use REST. No code changes are required beyond transport configuration.

For the client source code, see the [`opensearch-java` repo](https://github.com/opensearch-project/opensearch-java).

## Installing the client

To use the gRPC transport, add the `opensearch-java-grpc` module to your project alongside `opensearch-java`.

Add the following dependencies to your `pom.xml` file:

```xml
<dependency>
  <groupId>org.opensearch.client</groupId>
  <artifactId>opensearch-java</artifactId>
  <version>3.9.0</version>
</dependency>

<dependency>
  <groupId>org.opensearch.client</groupId>
  <artifactId>opensearch-java-grpc</artifactId>
  <version>3.9.0</version>
</dependency>
```
{% include copy.html %}

If you're using Gradle, add the following dependencies to your project:

```groovy
dependencies {
  implementation 'org.opensearch.client:opensearch-java:3.9.0'
  implementation 'org.opensearch.client:opensearch-java-grpc:3.9.0'
}
```
{% include copy.html %}

## Supported operations

The gRPC transport currently supports the following operations:

| Operation | gRPC support | Notes |
| :--- | :--- | :--- |
| Bulk (index, create, update, delete) | **Generally available** | All four operation types supported |
| Search | Planned | Server-side GA in OpenSearch 3.5.0 |
| k-NN | Planned | Server-side GA in OpenSearch 3.5.0 |
| All other operations | Routed to REST | Handled automatically by `HybridTransport` |

## Initializing the client with HybridTransport

The `HybridTransport` composes a gRPC transport with a REST transport. Supported operations (such as bulk) are sent over gRPC, and all other operations are automatically routed to REST.

The following example initializes a client with `HybridTransport`:

```java
import org.apache.hc.core5.http.HttpHost;
import org.opensearch.client.json.jackson3.JacksonJsonpMapper;
import org.opensearch.client.opensearch.OpenSearchClient;
import org.opensearch.client.transport.OpenSearchTransport;
import org.opensearch.client.transport.grpc.GrpcTransport;
import org.opensearch.client.transport.grpc.HybridTransport;
import org.opensearch.client.transport.httpclient5.ApacheHttpClient5TransportBuilder;

public class OpenSearchGrpcExample {
  public static void main(String[] args) throws Exception {
    // REST transport for non-bulk operations
    final HttpHost restHost = new HttpHost("http", "localhost", 9200);
    final OpenSearchTransport restTransport = ApacheHttpClient5TransportBuilder.builder(restHost).build();

    // gRPC transport for bulk operations
    final GrpcTransport grpcTransport = GrpcTransport.builder("localhost", 9400)
      .jsonpMapper(new JacksonJsonpMapper())
      .build();

    // HybridTransport routes automatically: bulk → gRPC, everything else → REST
    final HybridTransport hybridTransport = new HybridTransport(grpcTransport, restTransport);
    final OpenSearchClient client = new OpenSearchClient(hybridTransport);

    // Use the client normally — routing is transparent
    var info = client.info();
    System.out.println(info.version().distribution() + ": " + info.version().number());
  }
}
```
{% include copy.html %}

## Initializing the client with basic authentication

To connect to a cluster with basic authentication enabled, use the `basicAuth` builder method:

```java
final GrpcTransport grpcTransport = GrpcTransport.builder("localhost", 9400)
  .jsonpMapper(new JacksonJsonpMapper())
  .basicAuth("admin", "admin")
  .build();
```
{% include copy.html %}

## Initializing the client with TLS

To connect to a cluster with TLS enabled, configure `GrpcTlsConfig`:

```java
import org.opensearch.client.transport.grpc.GrpcTlsConfig;

final GrpcTransport grpcTransport = GrpcTransport.builder("localhost", 9400)
  .jsonpMapper(new JacksonJsonpMapper())
  .tls(GrpcTlsConfig.builder()
    .trustCertificatePath("/path/to/root-ca.pem")
    .build())
  .basicAuth("admin", "admin")
  .build();
```
{% include copy.html %}

For testing with self-signed certificates, you can use insecure TLS (skip certificate verification):

```java
final GrpcTransport grpcTransport = GrpcTransport.builder("localhost", 9400)
  .jsonpMapper(new JacksonJsonpMapper())
  .tlsInsecure()
  .basicAuth("admin", "admin")
  .build();
```
{% include copy.html %}

### GrpcTlsConfig options

The following table lists all available TLS configuration options.

| Option | Type | Description |
| :--- | :--- | :--- |
| `trustCertificatePath` | `String` | Path to the CA certificate file (PEM format). |
| `clientCertificatePath` | `String` | Path to the client certificate for mTLS. |
| `clientKeyPath` | `String` | Path to the client private key for mTLS. |
| `clientKeyPassword` | `String` | Password for the client private key. |
| `trustStorePath` | `String` | Path to the Java trust store file. |
| `trustStorePassword` | `String` | Password for the trust store. |
| `trustStoreType` | `String` | Trust store type (default: `JKS`). |
| `hostnameOverride` | `String` | Override the hostname for TLS verification. |
| `insecure` | `boolean` | If `true`, skips certificate verification. For testing only. |

## Initializing the client with JWT authentication

To connect with JWT or bearer token authentication:

```java
final GrpcTransport grpcTransport = GrpcTransport.builder("localhost", 9400)
  .jsonpMapper(new JacksonJsonpMapper())
  .tls(GrpcTlsConfig.builder().build())
  .jwtAuth(() -> getRefreshedToken()) // supplier that provides current token
  .build();
```
{% include copy.html %}

## Connecting to Amazon OpenSearch Service

To connect to Amazon OpenSearch Service with IAM (SigV4) authentication, use `AwsGrpcTransport`:

```java
import org.opensearch.client.transport.grpc.AwsGrpcTransport;
import org.opensearch.client.transport.grpc.GrpcSigV4Config;
import org.opensearch.client.transport.grpc.GrpcTlsConfig;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;

final GrpcTransport grpcTransport = AwsGrpcTransport.awsBuilder("search-mydomain.us-east-1.es.amazonaws.com", 9400)
  .jsonpMapper(new JacksonJsonpMapper())
  .tls(GrpcTlsConfig.builder().build())
  .sigV4(GrpcSigV4Config.builder()
    .region(Region.US_EAST_1)
    .service("es")
    .credentialsProvider(DefaultCredentialsProvider.create())
    .build())
  .build();

// Combine with REST transport for non-bulk operations
final OpenSearchTransport restTransport = new AwsSdk2Transport(
  ApacheHttpClient.builder().build(),
  "search-mydomain.us-east-1.es.amazonaws.com",
  "es",
  Region.US_EAST_1,
  AwsSdk2TransportOptions.builder().build()
);

final HybridTransport hybridTransport = new HybridTransport(grpcTransport, restTransport);
final OpenSearchClient client = new OpenSearchClient(hybridTransport);
```
{% include copy.html %}

For Amazon OpenSearch Serverless, use `"aoss"` as the service name.

## GrpcTransportOptions

Configure gRPC channel behavior using `GrpcTransportOptions`:

```java
import org.opensearch.client.transport.grpc.GrpcTransportOptions;
import java.util.concurrent.TimeUnit;

final GrpcTransport grpcTransport = GrpcTransport.builder("localhost", 9400)
  .jsonpMapper(new JacksonJsonpMapper())
  .grpcOptions(GrpcTransportOptions.builder()
    .maxInboundMessageSize(50 * 1024 * 1024) // 50 MB
    .keepAliveTime(60, TimeUnit.SECONDS)
    .keepAliveTimeout(10, TimeUnit.SECONDS)
    .idleTimeout(5, TimeUnit.MINUTES)
    .deadline(30, TimeUnit.SECONDS)
    .maxRetries(3)
    .build())
  .build();
```
{% include copy.html %}

The following table lists all available transport options.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `maxInboundMessageSize` | `int` | 10 MB | Maximum size of inbound gRPC messages. Must match the server's `grpc.netty.max_msg_size` setting. |
| `keepAliveTime` | `long` + `TimeUnit` | 60 seconds | Interval between keep-alive pings. |
| `keepAliveTimeout` | `long` + `TimeUnit` | 10 seconds | Time to wait for a keep-alive ping response. |
| `keepAliveWithoutCalls` | `boolean` | `false` | Whether to send keep-alive pings when there are no active calls. |
| `idleTimeout` | `long` + `TimeUnit` | 5 minutes | Time after which idle connections are closed. |
| `deadline` | `long` + `TimeUnit` | 30 seconds | Maximum time to wait for a response. |
| `maxRetries` | `int` | 3 | Number of retry attempts for transient failures. |
| `retryBackoffMs` | `long` | 100 ms | Initial backoff between retries (doubles per attempt). |

## Bulk indexing

Bulk indexing works identically to the REST transport. The `HybridTransport` routes bulk operations to gRPC automatically:

```java
String index = "students";
client.indices().create(c -> c.index(index)); // Goes to REST

// Bulk indexing — routed to gRPC automatically
List<BulkOperation> operations = new ArrayList<>();
operations.add(new BulkOperation.Builder().index(
  new IndexOperation.Builder<Student>()
    .index(index).id("1")
    .document(new Student("John", "Doe", 3.89, 2022)).build()
).build());
operations.add(new BulkOperation.Builder().index(
  new IndexOperation.Builder<Student>()
    .index(index).id("2")
    .document(new Student("Paulo", "Santos", 3.93, 2021)).build()
).build());

BulkRequest bulkRequest = new BulkRequest.Builder()
  .index(index).operations(operations).refresh(Refresh.True).build();
BulkResponse bulkResponse = client.bulk(bulkRequest); // Goes to gRPC
System.out.println("Errors: " + bulkResponse.errors());
```
{% include copy.html %}

## Searching for documents

Search operations are automatically routed to REST by the `HybridTransport`:

```java
SearchResponse<Student> searchResponse = client.search(s -> s.index(index), Student.class);
for (int i = 0; i < searchResponse.hits().hits().size(); i++) {
  System.out.println(searchResponse.hits().hits().get(i).source());
}
```
{% include copy.html %}

## Server configuration

To use the gRPC transport, the OpenSearch server must have gRPC enabled. Add the following to `opensearch.yml`:

```yaml
aux.transport.types: [transport-grpc]
aux.transport.transport-grpc.port: '9400'
```
{% include copy.html %}

For more information about server-side gRPC settings, see [gRPC APIs]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/#grpc-settings).
