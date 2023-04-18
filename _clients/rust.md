---
layout: default
title: Rust client
nav_order: 100
---

# Rust client

The OpenSearch Rust client lets you connect your Rust application with the data in your OpenSearch cluster. For the client's complete API documentation and additional examples, see the [OpenSearch docs.rs documentation](https://docs.rs/opensearch/).

This getting started guide illustrates how to connect to OpenSearch, index documents, and run queries. For the client source code, see the [opensearch-rs repo](https://github.com/opensearch-project/opensearch-rs).

## Setup

If you're starting a new project, add the `opensearch` crate to Cargo.toml:

```rust
[dependencies]
opensearch = "1.0.0"
```
{% include copy.html %}

Additionally, you may want to add the following `serde` dependencies that help serialize types to JSON and deserialize JSON responses:

```rust
serde = "~1"
serde_json = "~1"
```
{% include copy.html %}

The Rust client uses the higher-level [`reqwest`](https://crates.io/crates/reqwest) HTTP client library for HTTP requests, and reqwest uses the [`tokio`](https://crates.io/crates/tokio) platform to support asynchronous requests. If you are planning to use asynchronous functions, you need to add the `tokio` dependency to Cargo.toml:

```rust
tokio = { version = "*", features = ["full"] }
```
{% include copy.html %}

See the [Sample program](#sample-program) section for the complete Cargo.toml file.

To use the Rust client API, import the modules, structs, and enums you need:

```rust
use opensearch::OpenSearch;
```
{% include copy.html %}

## Connecting to OpenSearch

To connect to the default OpenSearch host, create a default client object that connects to OpenSearch at the address `http://localhost:9200`:

```rust
let client = OpenSearch::default();
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

## Connecting to Amazon OpenSearch Service

The following example illustrates connecting to Amazon OpenSearch Service:

```rust
let url = Url::parse("https://...");
let service_name = "es";
let conn_pool = SingleNodeConnectionPool::new(url?);
let region_provider = RegionProviderChain::default_provider().or_else("us-east-1");
let aws_config = aws_config::from_env().region(region_provider).load().await.clone();
let transport = TransportBuilder::new(conn_pool)
    .auth(aws_config.clone().try_into()?)
    .service_name(service_name)
    .build()?;
let client = OpenSearch::new(transport);
```
{% include copy.html %}

## Connecting to Amazon OpenSearch Serverless

The following example illustrates connecting to Amazon OpenSearch Serverless Service:

```rust
let url = Url::parse("https://...");
let service_name = "aoss";
let conn_pool = SingleNodeConnectionPool::new(url?);
let region_provider = RegionProviderChain::default_provider().or_else("us-east-1");
let aws_config = aws_config::from_env().region(region_provider).load().await.clone();
let transport = TransportBuilder::new(conn_pool)
    .auth(aws_config.clone().try_into()?)
    .service_name(service_name)
    .build()?;
let client = OpenSearch::new(transport);
```
{% include copy.html %}


## Creating an index

To create an OpenSearch index, use the `create` function of the `opensearch::indices::Indices` struct. You can use the following code to construct a JSON object with custom mappings:

```rust
let response = client
    .indices()
    .create(IndicesCreateParts::Index("movies"))
    .body(json!({
        "mappings" : {
            "properties" : {
                "title" : { "type" : "text" }
            }
        }
    }))
    .send()
    .await?;
```
{% include copy.html %}

## Indexing a document

You can index a document into OpenSearch using the client's `index` function:

```rust
let response = client
    .index(IndexParts::IndexId("movies", "1"))
    .body(json!({
        "id": 1,
        "title": "Moneyball",
        "director": "Bennett Miller",
        "year": "2011"
    }))
    .send()
    .await?;
```
{% include copy.html %}

## Performing bulk operations

You can perform several operations at the same time by using the client's `bulk` function. First, create the JSON body of a Bulk API call, and then pass it to the `bulk` function:

```rust
let mut body: Vec<JsonBody<_>> = Vec::with_capacity(4);

// add the first operation and document
body.push(json!({"index": {"_id": "2"}}).into());
body.push(json!({
    "id": 2,
    "title": "Interstellar",
    "director": "Christopher Nolan",
    "year": "2014"
}).into());

// add the second operation and document
body.push(json!({"index": {"_id": "3"}}).into());
body.push(json!({
    "id": 3,
    "title": "Star Trek Beyond",
    "director": "Justin Lin",
    "year": "2015"
}).into());

let response = client
    .bulk(BulkParts::Index("movies"))
    .body(body)
    .send()
    .await?;
```
{% include copy.html %}

## Searching for documents

The easiest way to search for documents is to construct a query string. The following code uses a `multi_match` query to search for "miller" in the title and director fields. It boosts the documents where "miller" appears in the title field: 

```rust
response = client
    .search(SearchParts::Index(&["movies"]))
    .from(0)
    .size(10)
    .body(json!({
        "query": {
            "multi_match": {
                "query": "miller",
                "fields": ["title^2", "director"]
            }           
        }
    }))
    .send()
    .await?;
```
{% include copy.html %}

You can then read the response body as JSON and iterate over the `hits` array to read all the `_source` documents:

```rust
let response_body = response.json::<Value>().await?;
for hit in response_body["hits"]["hits"].as_array().unwrap() {
    // print the source document
    println!("{}", serde_json::to_string_pretty(&hit["_source"]).unwrap());
}
```
{% include copy.html %}

## Deleting a document

You can delete a document using the client's `delete` function:

```rust
let response = client
    .delete(DeleteParts::IndexId("movies", "2"))
    .send()
    .await?;
```
{% include copy.html %}

## Deleting an index

You can delete an index using the `delete` function of the `opensearch::indices::Indices` struct:

```rust
let response = client
    .indices()
    .delete(IndicesDeleteParts::Index(&["movies"]))
    .send()
    .await?;
```
{% include copy.html %}

## Sample program

The sample program uses the following Cargo.toml file with all dependencies described in the [Setup](#setup) section:

```rust
[package]
name = "os_rust_project"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
opensearch = "1.0.0"
tokio = { version = "*", features = ["full"] }
serde = "~1"
serde_json = "~1"
```
{% include copy.html %}

The following sample program creates a client, adds an index with non-default mappings, inserts a document, performs bulk operations, searches for the document, deletes the document, and then deletes the index:

```rust
use opensearch::{DeleteParts, OpenSearch, IndexParts, http::request::JsonBody, BulkParts, SearchParts};
use opensearch::{indices::{IndicesDeleteParts, IndicesCreateParts}};
use serde_json::{json, Value};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = OpenSearch::default();

    // Create an index
    let mut response = client
    .indices()
    .create(IndicesCreateParts::Index("movies"))
    .body(json!({
        "mappings" : {
            "properties" : {
                "title" : { "type" : "text" }
            }
        }
    }))
    .send()
    .await?;

    let mut successful = response.status_code().is_success();
    
    if successful {
        println!("Successfully created an index");
    }
    else {
        println!("Could not create an index");
    }

    // Index a single document
    println!("Indexing a single document...");
    response = client
    .index(IndexParts::IndexId("movies", "1"))
    .body(json!({
        "id": 1,
        "title": "Moneyball",
        "director": "Bennett Miller",
        "year": "2011"
    }))
    .send()
    .await?;

    successful = response.status_code().is_success();
    
    if successful {
        println!("Successfully indexed a document");
    }
    else {
        println!("Could not index document");
    }

    // Index multiple documents using the bulk operation

    println!("Indexing multiple documents...");

    let mut body: Vec<JsonBody<_>> = Vec::with_capacity(4);

    // add the first operation and document
    body.push(json!({"index": {"_id": "2"}}).into());
    body.push(json!({
        "id": 2,
        "title": "Interstellar",
        "director": "Christopher Nolan",
        "year": "2014"
    }).into());

    // add the second operation and document
    body.push(json!({"index": {"_id": "3"}}).into());
    body.push(json!({
        "id": 3,
        "title": "Star Trek Beyond",
        "director": "Justin Lin",
        "year": "2015"
    }).into());

    response = client
        .bulk(BulkParts::Index("movies"))
        .body(body)
        .send()
        .await?;

    let mut response_body = response.json::<Value>().await?;
    successful = response_body["errors"].as_bool().unwrap() == false;

    if successful {
        println!("Successfully performed bulk operations");
    }
    else {
        println!("Could not perform bulk operations");
    }

    // Search for a document

    println!("Searching for a document...");
    response = client
    .search(SearchParts::Index(&["movies"]))
    .from(0)
    .size(10)
    .body(json!({
        "query": {
            "multi_match": {
                "query": "miller",
                "fields": ["title^2", "director"]
            }           
        }
    }))
    .send()
    .await?;

    response_body = response.json::<Value>().await?;
    for hit in response_body["hits"]["hits"].as_array().unwrap() {
        // print the source document
        println!("{}", serde_json::to_string_pretty(&hit["_source"]).unwrap());
    }

    // Delete a document

    response = client
    .delete(DeleteParts::IndexId("movies", "2"))
    .send()
    .await?;

    successful = response.status_code().is_success();
    
    if successful {
        println!("Successfully deleted a document");
    }
    else {
        println!("Could not delete document");
    }

    // Delete the index

    response = client
    .indices()
    .delete(IndicesDeleteParts::Index(&["movies"]))
    .send()
    .await?;

    successful = response.status_code().is_success();

    if successful {
        println!("Successfully deleted the index");
    }
    else {
        println!("Could not delete the index");
    }
    
    Ok(())
}
```
{% include copy.html %}