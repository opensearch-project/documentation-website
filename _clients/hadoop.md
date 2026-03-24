---
layout: default
title: Hadoop connector
nav_order: 110
---

# Hadoop connector

The OpenSearch Hadoop connector lets you read and write data between [Apache Spark](http://spark.apache.org), [Apache Hive](http://hive.apache.org), Hadoop MapReduce, and OpenSearch. It enables Spark jobs to directly index data into OpenSearch and run queries against it, with parallel reads and writes across Spark partitions and OpenSearch shards for efficient distributed processing.

For the source code, see the [OpenSearch Hadoop](https://github.com/opensearch-project/opensearch-hadoop) repository.

## Setup

Add the connector to your Spark application using `--packages`:

- For Spark 3.4.x, run the following command:

```bash
pyspark --packages org.opensearch.client:opensearch-spark-30_2.12:2.0.0
```
{% include copy.html %}

- For Spark 3.5.x, run the following command:

```bash
pyspark --packages org.opensearch.client:opensearch-spark-35_2.12:2.0.0
```
{% include copy.html %}

- For Spark 4.x, run the following command:

```bash
pyspark --packages org.opensearch.client:opensearch-spark-40_2.13:2.0.0
```
{% include copy.html %}

Alternatively, add Spark as a dependency in your build file:

```xml
<dependency>
    <groupId>org.opensearch.client</groupId>
    <artifactId>opensearch-spark-30_2.12</artifactId>
    <version>2.0.0</version>
</dependency>
```
{% include copy.html %}

Choose the artifact that matches your Spark and Scala version listed in the following table.

Spark version | Scala version | Artifact
:--- | :--- | :---
3.4.x | 2.12 | `org.opensearch.client:opensearch-spark-30_2.12:2.0.0`
3.4.x | 2.13 | `org.opensearch.client:opensearch-spark-30_2.13:2.0.0`
3.5.x | 2.12 | `org.opensearch.client:opensearch-spark-35_2.12:2.0.0`
3.5.x | 2.13 | `org.opensearch.client:opensearch-spark-35_2.13:2.0.0`
4.x | 2.13 | `org.opensearch.client:opensearch-spark-40_2.13:2.0.0`

## Basic usage

The following examples demonstrate basic read and write operations using the connector with different Spark APIs.

### PySpark

No additional Python package is needed. The Java connector is loaded using `--packages` or `spark.jars`:

```python
# Write (index documents into OpenSearch)
df = spark.createDataFrame([("John", 30), ("Jane", 25)], ["name", "age"])
df.write.format("opensearch").save("people")

# Read (query documents from OpenSearch)
df = spark.read.format("opensearch").load("people")
df.show()

# Read with a query (only matching documents are transferred to Spark)
filtered = spark.read \
    .format("opensearch") \
    .option("opensearch.query", '{"query":{"match":{"name":"John"}}}') \
    .load("people")
```
{% include copy.html %}

### Scala

Use the Scala API to access helper methods like `saveToOpenSearch` for cleaner syntax:

```scala
import org.opensearch.spark.sql._

// Write (index documents into OpenSearch)
val df = spark.createDataFrame(Seq(("John", 30), ("Jane", 25))).toDF("name", "age")
df.saveToOpenSearch("people")

// Read (query documents from OpenSearch)
val result = spark.read.format("opensearch").load("people")
result.show()

// Read with a query
val filtered = spark.read
  .format("opensearch")
  .option("opensearch.query", """{"query":{"match":{"name":"John"}}}""")
  .load("people")
```
{% include copy.html %}

### Java

Use the `JavaOpenSearchSparkSQL` wrapper for Java applications:

```java
import org.opensearch.spark.sql.api.java.JavaOpenSearchSparkSQL;

// Write
Dataset<Row> df = spark.createDataFrame(data, schema);
JavaOpenSearchSparkSQL.saveToOpenSearch(df, "people");

// Read
Dataset<Row> result = spark.read().format("opensearch").load("people");
result.show();
```
{% include copy.html %}

### Spark SQL

You can register an OpenSearch index as a temporary view and query it using SQL:

```python
spark.sql("""
  CREATE TEMPORARY VIEW people
  USING opensearch
  OPTIONS (resource 'people')
""")

spark.sql("SELECT * FROM people WHERE age > 25").show()
```
{% include copy.html %}

## Write operations

Configure how documents are written to OpenSearch indexes, including document IDs, write modes, and routing strategies.

### Specifying a document ID

Use `opensearch.mapping.id` to control the `_id` of each document:

```python
df.write.format("opensearch") \
    .option("opensearch.mapping.id", "id") \
    .save("my-index")
```
{% include copy.html %}

### Write modes

Control how data is written to OpenSearch using Spark's write modes:

```python
# Append (default): add documents to the index
df.write.format("opensearch").mode("append").save("my-index")

# Overwrite: delete the index and recreate it with the new data
df.write.format("opensearch").mode("overwrite").save("my-index")
```
{% include copy.html %}

### Upsert

Update documents if they exist or insert them as new documents if they don't. This operation requires specifying a document ID field:

```python
df.write.format("opensearch") \
    .option("opensearch.mapping.id", "id") \
    .option("opensearch.write.operation", "upsert") \
    .save("my-index")
```
{% include copy.html %}

### Dynamic index routing

Use placeholders in the index name to route documents to different indexes based on field values. This feature requires the Scala `saveToOpenSearch` method:

```scala
import org.opensearch.spark.sql._

// Route by field value: {"category": "electronics", "name": "TV"} -> index "electronics"
df.saveToOpenSearch("{category}")

// Prefix + field value: {"env": "prod", "msg": "ok"} -> index "logs-prod"
df.saveToOpenSearch("logs-{env}")

// Date formatting: {"timestamp": "2026-02-16T10:30:00.000Z", "msg": "ok"} -> index "logs-2026.02.16"
df.saveToOpenSearch("logs-{timestamp|yyyy.MM.dd}")
```
{% include copy.html %}

## Read operations

Optimize data retrieval from OpenSearch by filtering queries and selecting specific fields to reduce data transfer.

### Reading with a query

Filter data at the OpenSearch level so only matching documents are loaded into Spark:

```python
# Query DSL
df = spark.read.format("opensearch") \
    .option("opensearch.query", '{"query":{"range":{"age":{"gte":25}}}}') \
    .load("my-index")

# URI query
df = spark.read.format("opensearch") \
    .option("opensearch.query", "?q=name:John") \
    .load("my-index")
```
{% include copy.html %}

### Selecting fields

Load only specific fields to reduce data transfer:

```python
df = spark.read.format("opensearch") \
    .option("opensearch.read.field.include", "name,age") \
    .load("my-index")
```
{% include copy.html %}

## Security

Secure connections to OpenSearch clusters using authentication and encryption.

### Basic authentication

Provide credentials for OpenSearch clusters with authentication enabled:

```python
df.write.format("opensearch") \
    .option("opensearch.net.http.auth.user", "<username>") \
    .option("opensearch.net.http.auth.pass", "<password>") \
    .save("my-index")
```
{% include copy.html %}

### HTTPS

Enable SSL/TLS encryption for secure connections:

```python
df.write.format("opensearch") \
    .option("opensearch.net.ssl", "true") \
    .save("my-index")
```
{% include copy.html %}

## Advanced Spark features

Access low-level Spark APIs and streaming capabilities for specialized use cases.

### Spark resilient distributed dataset

For low-level access, the connector provides resilient distributed dataset (RDD)-based read and write methods:

```scala
import org.opensearch.spark._

// Write
val data = sc.makeRDD(Seq(
  Map("name" -> "John", "age" -> 30),
  Map("name" -> "Jane", "age" -> 25)
))
data.saveToOpenSearch("people")

// Read
val rdd = sc.opensearchRDD("people")
rdd.collect().foreach(println)

// Read with query
val filtered = sc.opensearchRDD("people", "?q=name:John")
```
{% include copy.html %}

### Structured Streaming

The connector supports Spark Structured Streaming as a sink:

```scala
val query = streamingDF.writeStream
  .format("opensearch")
  .option("checkpointLocation", "/tmp/checkpoint")
  .start("streaming-index")
```
{% include copy.html %}

## Alternative interfaces

Use the connector with Hadoop MapReduce and Apache Hive for alternative workflows.

### Hadoop MapReduce

For Hadoop MapReduce jobs, the connector provides `OpenSearchInputFormat` and `OpenSearchOutputFormat`. Add `opensearch-hadoop-mr-2.0.0.jar` to your job `classpath`.

```java
// Writing
Configuration conf = new Configuration();
conf.set("opensearch.resource", "my-index");
Job job = new Job(conf);
job.setOutputFormatClass(OpenSearchOutputFormat.class);
job.waitForCompletion(true);

// Reading
Configuration conf = new Configuration();
conf.set("opensearch.resource", "my-index");
Job job = new Job(conf);
job.setInputFormatClass(OpenSearchInputFormat.class);
job.waitForCompletion(true);
```
{% include copy.html %}

### Apache Hive

The connector provides an Apache Hive storage handler. Add `opensearch-hadoop-hive-2.0.0.jar` to your Hive classpath:

```sql
ADD JAR /path/opensearch-hadoop-hive-2.0.0.jar;

CREATE EXTERNAL TABLE people (
    name STRING,
    age  INT)
STORED BY 'org.opensearch.hadoop.hive.OpenSearchStorageHandler'
TBLPROPERTIES('opensearch.resource' = 'people');

SELECT * FROM people;
```
{% include copy.html %}

## Connecting to Amazon OpenSearch Service

To connect to Amazon OpenSearch Service with IAM authentication, enable AWS Signature Version 4 signing and HTTPS:

```python
df.write.format("opensearch") \
    .option("opensearch.nodes", "https://search-xxx.us-east-1.es.amazonaws.com") \
    .option("opensearch.port", "443") \
    .option("opensearch.net.ssl", "true") \
    .option("opensearch.nodes.wan.only", "true") \
    .option("opensearch.aws.sigv4.enabled", "true") \
    .option("opensearch.aws.sigv4.region", "us-east-1") \
    .save("my-index")
```
{% include copy.html %}

The following AWS SDK v2 dependencies are required on the `classpath`:
- `software.amazon.awssdk:auth:2.31.59` (or later)
- `software.amazon.awssdk:regions:2.31.59` (or later)
- `software.amazon.awssdk:http-client-spi:2.31.59` (or later)
- `software.amazon.awssdk:identity-spi:2.31.59` (or later)
- `software.amazon.awssdk:sdk-core:2.31.59` (or later)
- `software.amazon.awssdk:utils:2.31.59` (or later)

## Connecting to Amazon OpenSearch Serverless

To connect to Amazon OpenSearch Serverless, add `opensearch.serverless` and set the Signature Version 4 service name to `aoss`:

```python
df.write.format("opensearch") \
    .option("opensearch.nodes", "https://xxx.us-east-1.aoss.amazonaws.com") \
    .option("opensearch.port", "443") \
    .option("opensearch.net.ssl", "true") \
    .option("opensearch.nodes.wan.only", "true") \
    .option("opensearch.aws.sigv4.enabled", "true") \
    .option("opensearch.aws.sigv4.region", "us-east-1") \
    .option("opensearch.aws.sigv4.service.name", "aoss") \
    .option("opensearch.serverless", "true") \
    .save("my-index")
```
{% include copy.html %}

## Configuration properties

All configuration properties start with the `opensearch` prefix. Properties can be set using Spark configuration (`--conf`), as options of the `DataFrame` reader/writer, or in the Hadoop configuration.

Property | Default | Description
:--- | :--- | :---
`opensearch.resource` | (none) | The OpenSearch index name. Can also be specified as the argument to `saveToOpenSearch()` or `load()`.
`opensearch.nodes` | `localhost` | The OpenSearch host address.
`opensearch.port` | `9200` | The OpenSearch REST port.
`opensearch.nodes.wan.only` | `false` | Set to `true` when connecting through a load balancer or proxy.
`opensearch.query` | match all | A query DSL or Uniform Resource Identifier (URI) query for reading.
`opensearch.net.ssl` | `false` | Enables HTTPS.
`opensearch.mapping.id` | (none) | The document field to use as the `_id`.
`opensearch.write.operation` | `index` | The write operation: `index`, `create`, `update`, or `upsert`.
`opensearch.scroll.size` | `1000` | The number of documents fetched per batch when reading.
`opensearch.read.field.include` | (none) | A comma-separated list of fields to read.

## Compatibility

The following table lists the connector versions and their compatible runtime versions.

Client version | Minimum Java runtime version | OpenSearch version | Spark version
:--- | :--- | :--- | :---
1.0.0--1.3.0 | Java 8 | 1.x, 2.x | 3.4.x
2.0.0 | Java 11 | 1.x, 2.x, 3.x | 3.4.x, 3.5.x, 4.x

