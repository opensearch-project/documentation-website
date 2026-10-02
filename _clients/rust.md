---
layout: default
title: Rust client
nav_order: 100
---

# Rust client

The OpenSearch Rust client lets you connect your Rust application with the data in your OpenSearch cluster. For the client's complete API documentation and additional examples, see the [OpenSearch docs.rs documentation](https://docs.rs/opensearch/).

This getting started guide illustrates how to connect to OpenSearch, index documents, and run queries. For the client source code, see the [`opensearch-rs` repo](https://github.com/opensearch-project/opensearch-rs).

## Installing the Rust client

If you're starting a new project, add the `opensearch` crate to Cargo.toml:

```toml
[dependencies]
opensearch = "2.4.0"
```
{% include copy.html %}

Additionally, you may want to add the following `serde` dependencies that help serialize types to JSON and deserialize JSON responses. The `derive` feature lets you derive `Serialize` and `Deserialize` for your own structs:

```toml
serde = { version = "~1", features = ["derive"] }
serde_json = "~1"
```
{% include copy.html %}

The Rust client uses the higher-level [`reqwest`](https://crates.io/crates/reqwest) HTTP client library for HTTP requests, and `reqwest` uses the [`tokio`](https://crates.io/crates/tokio) platform to support asynchronous requests. If you are planning to use asynchronous functions, you need to add the `tokio` dependency to Cargo.toml:

```toml
tokio = { version = "1", features = ["full"] }
```
{% include copy.html %}

See the [Sample program](#sample-program) section for the complete Cargo.toml file.

To use the Rust client API, import the modules, structs, and enums you need:

```rust
use opensearch::OpenSearch;
```
{% include copy.html %}

## Sample data

The examples on this page use a `Student` struct to represent documents. The `#[serde(rename_all = "camelCase")]` attribute serializes the struct fields to the `firstName`, `lastName`, `gpa`, and `gradDate` JSON fields:

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Student {
    first_name: String,
    last_name: String,
    gpa: f64,
    grad_date: String,
}

impl Student {
    fn new(first_name: &str, last_name: &str, gpa: f64, grad_date: &str) -> Self {
        Student {
            first_name: first_name.to_string(),
            last_name: last_name.to_string(),
            gpa,
            grad_date: grad_date.to_string(),
        }
    }
}
```
{% include copy.html %}

## Connecting to OpenSearch

To connect to the default OpenSearch host, create a default client object that connects to OpenSearch at the address `http://localhost:9200`:

```rust
let client = OpenSearch::default();
```
{% include copy.html %}

The remaining connection examples on this page require the following imports:

```rust
use opensearch::{
    http::transport::{SingleNodeConnectionPool, Transport, TransportBuilder},
    http::Url,
    OpenSearch,
};
```
{% include copy.html %}

To connect to an OpenSearch host that is running at a different address, create a client with the specified address:

```rust
let transport = Transport::single_node("http://localhost:9200")?;
let client = OpenSearch::new(transport);
```
{% include copy.html %}

Alternatively, you can customize the URL and use a connection pool by creating a `TransportBuilder` struct and passing it to `OpenSearch::new` to create a new instance of the client: 

```rust
let url = Url::parse("http://localhost:9200")?;
let conn_pool = SingleNodeConnectionPool::new(url);
let transport = TransportBuilder::new(conn_pool).disable_proxy().build()?;
let client = OpenSearch::new(transport);
```
{% include copy.html %}

To connect to a cluster that has the Security plugin enabled, use HTTPS and provide basic authentication credentials. The following example also disables certificate validation so that the client accepts the self-signed demo certificates. Import `Credentials` from `opensearch::auth` and `CertificateValidation` from `opensearch::cert`:

```rust
let url = Url::parse("https://localhost:9200")?;
let conn_pool = SingleNodeConnectionPool::new(url);
let transport = TransportBuilder::new(conn_pool)
    // Only for demo purposes. Don't specify your credentials in code.
    .auth(Credentials::Basic(
        "admin".to_string(),
        "<custom-admin-password>".to_string(),
    ))
    // Only for demo purposes. Disables certificate validation for self-signed certificates.
    .cert_validation(CertificateValidation::None)
    .build()?;
let client = OpenSearch::new(transport);
```
{% include copy.html %}

## Connecting to Amazon OpenSearch Service

To sign requests using AWS Signature Version 4, enable the `aws-auth` feature of the `opensearch` crate and add the `aws-config` dependency to Cargo.toml:

```toml
opensearch = { version = "2.4.0", features = ["aws-auth"] }
aws-config = "1"
```
{% include copy.html %}

Then import the AWS configuration types:

```rust
use aws_config::{meta::region::RegionProviderChain, BehaviorVersion};
```
{% include copy.html %}

In the following example, replace the endpoint with your domain endpoint, which is listed on the domain's details page in the Amazon OpenSearch Service console.

The following example illustrates connecting to Amazon OpenSearch Service:

```rust
let url = Url::parse("https://search-<domain-name>-<id>.us-east-1.es.amazonaws.com")?;
let service_name = "es";
let conn_pool = SingleNodeConnectionPool::new(url);
let region_provider = RegionProviderChain::default_provider().or_else("us-east-1");
let aws_config = aws_config::defaults(BehaviorVersion::latest())
    .region(region_provider)
    .load()
    .await;
let transport = TransportBuilder::new(conn_pool)
    .auth(aws_config.try_into()?)
    .service_name(service_name)
    .build()?;
let client = OpenSearch::new(transport);
```
{% include copy.html %}

## Connecting to Amazon OpenSearch Serverless

In the following example, replace the endpoint with your collection endpoint, which is listed on the collection's details page in the Amazon OpenSearch Service console.

Connecting to Amazon OpenSearch Serverless requires the same `aws-auth` feature, `aws-config` dependency, and imports as [connecting to Amazon OpenSearch Service](#connecting-to-amazon-opensearch-service). The following example illustrates connecting to Amazon OpenSearch Serverless:

```rust
let url = Url::parse("https://<collection-id>.us-east-1.aoss.amazonaws.com")?;
let service_name = "aoss";
let conn_pool = SingleNodeConnectionPool::new(url);
let region_provider = RegionProviderChain::default_provider().or_else("us-east-1");
let aws_config = aws_config::defaults(BehaviorVersion::latest())
    .region(region_provider)
    .load()
    .await;
let transport = TransportBuilder::new(conn_pool)
    .auth(aws_config.try_into()?)
    .service_name(service_name)
    .build()?;
let client = OpenSearch::new(transport);
```
{% include copy.html %}

Amazon OpenSearch Serverless supports a subset of OpenSearch API operations and does not support the `refresh` parameter used in the examples on this page. For more information, see [Supported operations and plugins in Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-genref.html).
{: .note}

## Creating an index

The following example creates an index with one primary shard and one replica. It explicitly maps the `gradDate` field as a `date` in the `yyyy-MM-dd` format. OpenSearch maps the other document fields dynamically when you index documents:

```rust
let index = "students";
let response = client
    .indices()
    .create(IndicesCreateParts::Index(index))
    .body(json!({
        "settings": {
            "index": {
                "number_of_shards": 1,
                "number_of_replicas": 1
            }
        },
        "mappings": {
            "properties": {
                "gradDate": { "type": "date", "format": "yyyy-MM-dd" }
            }
        }
    }))
    .send()
    .await?;
```
{% include copy.html %}

## Indexing a document

You can index a document into OpenSearch using the client's `index` function. The `refresh(Refresh::True)` call makes the document immediately available for search. `Refresh` is defined in the `opensearch::params` module:

```rust
let student = Student::new("John", "Doe", 3.89, "2022-05-15");
let response = client
    .index(IndexParts::IndexId(index, "1"))
    .body(student)
    .refresh(Refresh::True)
    .send()
    .await?;
```
{% include copy.html %}

## Performing bulk operations

You can perform several operations at the same time by using the client's `bulk` function. First, create the JSON body of a Bulk API call, and then pass it to the `bulk` function:

```rust
let body: Vec<JsonBody<Value>> = vec![
    json!({"index": {"_id": "2"}}).into(),
    serde_json::to_value(Student::new("Paulo", "Santos", 3.93, "2021-05-20"))?.into(),
    json!({"index": {"_id": "3"}}).into(),
    serde_json::to_value(Student::new("Shirley", "Rodriguez", 3.91, "2019-05-10"))?.into(),
];
let response = client
    .bulk(BulkParts::Index(index))
    .body(body)
    .refresh(Refresh::True)
    .send()
    .await?;
```
{% include copy.html %}

## Searching for documents

To search for all documents in an index, send a search request without a query:

```rust
let response = client
    .search(SearchParts::Index(&[index]))
    .send()
    .await?;
```
{% include copy.html %}

You can then read the response body as JSON and iterate over the `hits` array to deserialize each `_source` document into a `Student`:

```rust
let response_body = response.json::<Value>().await?;
println!("Total hits: {}", response_body["hits"]["total"]["value"]);
for hit in response_body["hits"]["hits"].as_array().unwrap_or(&vec![]) {
    let student: Student = serde_json::from_value(hit["_source"].clone())?;
    println!("  {}", serde_json::to_string(&student)?);
}
```
{% include copy.html %}

Each `_source` document deserializes into a `Student` struct, so the document fields are available as struct fields, such as `student.first_name`. Each hit contains the document ID in `hit["_id"]` and the document in `hit["_source"]`. To print the ID and fields of each document, use the following code:

```rust
for hit in response_body["hits"]["hits"].as_array().unwrap_or(&vec![]) {
    let id = hit["_id"].as_str().unwrap_or_default();
    let student: Student = serde_json::from_value(hit["_source"].clone())?;
    println!(
        "ID: {}, name: {} {}, GPA: {}, graduation date: {}",
        id, student.first_name, student.last_name, student.gpa, student.grad_date
    );
}
```
{% include copy.html %}

To search for students who graduated in 2019, use a `range` query on the `gradDate` field:

```rust
let response = client
    .search(SearchParts::Index(&[index]))
    .body(json!({
        "query": {
            "range": {
                "gradDate": {
                    "gte": "2019-01-01",
                    "lte": "2019-12-31"
                }
            }
        }
    }))
    .send()
    .await?;
```
{% include copy.html %}

## Paginating results

To paginate results, use the `from` and `size` parameters. The following example sorts students by graduation date and retrieves the results two at a time. The first request returns the first page of results, and the second request returns the next page:

```rust
let response = client
    .search(SearchParts::Index(&[index]))
    .from(0)
    .size(2)
    .sort(&["gradDate:asc"])
    .send()
    .await?;

let next_page = client
    .search(SearchParts::Index(&[index]))
    .from(2)
    .size(2)
    .sort(&["gradDate:asc"])
    .send()
    .await?;
```
{% include copy.html %}

The `from` and `size` parameters work well for the first pages of results. To paginate through a large number of results, use point in time with `search_after`. For more information, see [Paginate results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/).

## Updating a document

You can update a document using the client's `update` function. The following example sets the `gpa` field of the document with the ID `1` to `3.92`:

```rust
let response = client
    .update(UpdateParts::IndexId(index, "1"))
    .body(json!({
        "doc": {
            "gpa": 3.92
        }
    }))
    .send()
    .await?;
```
{% include copy.html %}

To retrieve the updated document, use the client's `get` function:

```rust
let response = client
    .get(GetParts::IndexId(index, "1"))
    .send()
    .await?;
```
{% include copy.html %}

## Deleting a document

You can delete a document using the client's `delete` function:

```rust
let response = client
    .delete(DeleteParts::IndexId(index, "3"))
    .refresh(Refresh::True)
    .send()
    .await?;
```
{% include copy.html %}

## Deleting an index

You can delete an index using the `delete` function of the `opensearch::indices::Indices` struct:

```rust
let response = client
    .indices()
    .delete(IndicesDeleteParts::Index(&[index]))
    .send()
    .await?;
```
{% include copy.html %}

## Sample program

This sample program combines the code from the preceding sections. It connects to a cluster that has the Security plugin enabled. To connect to a cluster without the Security plugin, change the lines marked with `// Without security` comments.

The sample program uses the following Cargo.toml file with all dependencies described in the [Installing the Rust client](#installing-the-rust-client) section:

```toml
[package]
name = "os_rust_project"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
opensearch = "2.4.0"
tokio = { version = "1", features = ["full"] }
serde = { version = "~1", features = ["derive"] }
serde_json = "~1"
```
{% include copy.html %}

This sample program is for testing only. It specifies credentials in code and disables certificate validation so that it can connect to a cluster that uses self-signed certificates. In production, load credentials from a secure location and validate the cluster's certificate.
{: .warning}

The following sample program creates a client, creates an index, indexes documents individually and in bulk, searches for documents, updates a document, deletes a document, and then deletes the index:

```rust
use opensearch::{
    auth::Credentials, // Without security, remove this line
    cert::CertificateValidation, // Without security, remove this line
    http::request::JsonBody,
    http::transport::{SingleNodeConnectionPool, TransportBuilder},
    http::Url,
    indices::{IndicesCreateParts, IndicesDeleteParts},
    params::Refresh,
    BulkParts, DeleteParts, GetParts, IndexParts, OpenSearch, SearchParts, UpdateParts,
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Student {
    first_name: String,
    last_name: String,
    gpa: f64,
    grad_date: String,
}

impl Student {
    fn new(first_name: &str, last_name: &str, gpa: f64, grad_date: &str) -> Self {
        Student {
            first_name: first_name.to_string(),
            last_name: last_name.to_string(),
            gpa,
            grad_date: grad_date.to_string(),
        }
    }
}

fn print_students(response_body: &Value) -> Result<(), Box<dyn std::error::Error>> {
    for hit in response_body["hits"]["hits"].as_array().unwrap_or(&vec![]) {
        let student: Student = serde_json::from_value(hit["_source"].clone())?;
        println!("  {}", serde_json::to_string(&student)?);
    }
    Ok(())
}

fn print_hits(response_body: &Value) -> Result<(), Box<dyn std::error::Error>> {
    println!("Total hits: {}", response_body["hits"]["total"]["value"]);
    print_students(response_body)
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let url = Url::parse("https://localhost:9200")?; // Without security, use http://localhost:9200
    let conn_pool = SingleNodeConnectionPool::new(url);
    let transport = TransportBuilder::new(conn_pool)
        // Without security, remove this line
        .auth(Credentials::Basic("admin".to_string(), "<custom-admin-password>".to_string()))
        .cert_validation(CertificateValidation::None) // Without security, remove this line
        .build()?;
    let client = OpenSearch::new(transport);

    // Create the index
    let index = "students";
    println!("Creating index......");
    let response_body = client
        .indices()
        .create(IndicesCreateParts::Index(index))
        .body(json!({
            "settings": {
                "index": {
                    "number_of_shards": 1,
                    "number_of_replicas": 1
                }
            },
            "mappings": {
                "properties": {
                    "gradDate": { "type": "date", "format": "yyyy-MM-dd" }
                }
            }
        }))
        .send()
        .await?
        .json::<Value>()
        .await?;
    println!("Index created: {}", response_body["index"].as_str().unwrap_or_default());

    // Index a document
    println!("\nIndexing one student......");
    let student = Student::new("John", "Doe", 3.89, "2022-05-15");
    let response_body = client
        .index(IndexParts::IndexId(index, "1"))
        .body(student)
        .refresh(Refresh::True)
        .send()
        .await?
        .json::<Value>()
        .await?;
    println!(
        "Result: {}, id: {}, version: {}",
        response_body["result"].as_str().unwrap_or_default(),
        response_body["_id"].as_str().unwrap_or_default(),
        response_body["_version"]
    );

    // Bulk index documents
    println!("\nIndexing many students......");
    let body: Vec<JsonBody<Value>> = vec![
        json!({"index": {"_id": "2"}}).into(),
        serde_json::to_value(Student::new("Paulo", "Santos", 3.93, "2021-05-20"))?.into(),
        json!({"index": {"_id": "3"}}).into(),
        serde_json::to_value(Student::new("Shirley", "Rodriguez", 3.91, "2019-05-10"))?.into(),
    ];
    let response_body = client
        .bulk(BulkParts::Index(index))
        .body(body)
        .refresh(Refresh::True)
        .send()
        .await?
        .json::<Value>()
        .await?;
    println!("Errors: {}", response_body["errors"]);
    for item in response_body["items"].as_array().unwrap_or(&vec![]) {
        println!(
            "  {} id: {}",
            item["index"]["result"].as_str().unwrap_or_default(),
            item["index"]["_id"].as_str().unwrap_or_default()
        );
    }

    // Search for all students, two at a time, sorted by graduation date
    println!("\nSearching for all students......");
    for (page, from) in [(1, 0), (2, 2)] {
        let response_body = client
            .search(SearchParts::Index(&[index]))
            .from(from)
            .size(2)
            .sort(&["gradDate:asc"])
            .send()
            .await?
            .json::<Value>()
            .await?;
        if page == 1 {
            println!("Total hits: {}", response_body["hits"]["total"]["value"]);
        }
        println!("Page {}:", page);
        print_students(&response_body)?;
    }

    // Search for students who graduated in 2019
    println!("\nSearching for students who graduated in 2019......");
    let response_body = client
        .search(SearchParts::Index(&[index]))
        .body(json!({
            "query": {
                "range": {
                    "gradDate": {
                        "gte": "2019-01-01",
                        "lte": "2019-12-31"
                    }
                }
            }
        }))
        .send()
        .await?
        .json::<Value>()
        .await?;
    print_hits(&response_body)?;

    // Update a document
    println!("\nUpdating a student's GPA......");
    let response_body = client
        .update(UpdateParts::IndexId(index, "1"))
        .body(json!({
            "doc": {
                "gpa": 3.92
            }
        }))
        .send()
        .await?
        .json::<Value>()
        .await?;
    println!(
        "Result: {}, version: {}",
        response_body["result"].as_str().unwrap_or_default(),
        response_body["_version"]
    );

    // Get the updated document
    let response_body = client
        .get(GetParts::IndexId(index, "1"))
        .send()
        .await?
        .json::<Value>()
        .await?;
    let student: Student = serde_json::from_value(response_body["_source"].clone())?;
    println!("Updated document: {}", serde_json::to_string(&student)?);

    // Delete a document
    println!("\nDeleting a student......");
    let response_body = client
        .delete(DeleteParts::IndexId(index, "3"))
        .refresh(Refresh::True)
        .send()
        .await?
        .json::<Value>()
        .await?;
    println!("Result: {}", response_body["result"].as_str().unwrap_or_default());

    // Delete the index
    println!("\nDeleting the index......");
    let response_body = client
        .indices()
        .delete(IndicesDeleteParts::Index(&[index]))
        .send()
        .await?
        .json::<Value>()
        .await?;
    println!("Acknowledged: {}", response_body["acknowledged"]);

    Ok(())
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
  {"firstName":"Shirley","lastName":"Rodriguez","gpa":3.91,"gradDate":"2019-05-10"}
  {"firstName":"Paulo","lastName":"Santos","gpa":3.93,"gradDate":"2021-05-20"}
Page 2:
  {"firstName":"John","lastName":"Doe","gpa":3.89,"gradDate":"2022-05-15"}

Searching for students who graduated in 2019......
Total hits: 1
  {"firstName":"Shirley","lastName":"Rodriguez","gpa":3.91,"gradDate":"2019-05-10"}

Updating a student's GPA......
Result: updated, version: 2
Updated document: {"firstName":"John","lastName":"Doe","gpa":3.92,"gradDate":"2022-05-15"}

Deleting a student......
Result: deleted

Deleting the index......
Acknowledged: true
```

## Related documentation

- For more examples of using the client, see the [`opensearch-rs` user guide](https://github.com/opensearch-project/opensearch-rs/blob/main/USER_GUIDE.md).
- For guides to specific tasks, such as bulk indexing and searching, see the [`opensearch-rs` guides](https://github.com/opensearch-project/opensearch-rs/tree/main/guides).
