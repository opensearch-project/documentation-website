---
layout: default
title: Rust client
nav_order: 100
---

# Rust client

The OpenSearch Rust client lets you connect your Rust application with the data in your OpenSearch cluster. For the client's complete API documentation and additional examples, see the [OpenSearch docs.rs documentation](https://docs.rs/opensearch/).

This getting started guide illustrates how to connect to OpenSearch, index documents, and run queries. For the client source code, see the [`opensearch-rs` repo](https://github.com/opensearch-project/opensearch-rs).

## Setup

If you're starting a new project, add the `opensearch` crate to Cargo.toml:

```toml
[dependencies]
opensearch = "2.4.0"
```
{% include copy.html %}

Additionally, you may want to add the following `serde` dependencies that help serialize types to JSON and deserialize JSON responses:

```toml
serde = "~1"
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

The following example illustrates connecting to Amazon OpenSearch Service:

```rust
let url = Url::parse("https://...")?;
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

Connecting to Amazon OpenSearch Serverless requires the same `aws-auth` feature, `aws-config` dependency, and imports as [connecting to Amazon OpenSearch Service](#connecting-to-amazon-opensearch-service). The following example illustrates connecting to Amazon OpenSearch Serverless Service:

```rust
let url = Url::parse("https://...")?;
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

You can index a document into OpenSearch using the client's `index` function. The `refresh(Refresh::True)` call makes the document immediately available for search. `Refresh` is defined in the `opensearch::params` module:

```rust
let response = client
    .index(IndexParts::IndexId("movies", "1"))
    .body(json!({
        "id": 1,
        "title": "Moneyball",
        "director": "Bennett Miller",
        "year": "2011"
    }))
    .refresh(Refresh::True)
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
    "year": "2016"
}).into());

let response = client
    .bulk(BulkParts::Index("movies"))
    .body(body)
    .refresh(Refresh::True)
    .send()
    .await?;
```
{% include copy.html %}

## Searching for documents

The easiest way to search for documents is to construct a query string. The following code uses a `multi_match` query to search for "miller" in the title and director fields. It boosts the documents where "miller" appears in the title field: 

```rust
let response = client
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
    println!("{}", serde_json::to_string_pretty(&hit["_source"])?);
}
```
{% include copy.html %}

## Updating a document

You can update a document using the client's `update` function. The following example adds a `genre` field to the document with the ID `1`:

```rust
let response = client
    .update(UpdateParts::IndexId("movies", "1"))
    .body(json!({
        "doc": {
            "genre": "Drama"
        }
    }))
    .send()
    .await?;
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

```toml
[package]
name = "os_rust_project"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
opensearch = "2.4.0"
tokio = { version = "1", features = ["full"] }
serde = "~1"
serde_json = "~1"
```
{% include copy.html %}

The following sample program creates a client, adds an index with non-default mappings, inserts a document, performs bulk operations, searches for the document, updates the document, deletes a document, and then deletes the index:

```rust
use opensearch::{
    http::request::JsonBody,
    indices::{IndicesCreateParts, IndicesDeleteParts},
    params::Refresh,
    BulkParts, DeleteParts, IndexParts, OpenSearch, SearchParts, UpdateParts,
};
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
    } else {
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
        .refresh(Refresh::True)
        .send()
        .await?;

    successful = response.status_code().is_success();

    if successful {
        println!("Successfully indexed a document");
    } else {
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
        "year": "2016"
    }).into());

    response = client
        .bulk(BulkParts::Index("movies"))
        .body(body)
        .refresh(Refresh::True)
        .send()
        .await?;

    let mut response_body = response.json::<Value>().await?;
    successful = response_body["errors"].as_bool() == Some(false);

    if successful {
        println!("Successfully performed bulk operations");
    } else {
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
        println!("{}", serde_json::to_string_pretty(&hit["_source"])?);
    }

    // Update a document
    println!("Updating a document...");
    response = client
        .update(UpdateParts::IndexId("movies", "1"))
        .body(json!({
            "doc": {
                "genre": "Drama"
            }
        }))
        .send()
        .await?;

    successful = response.status_code().is_success();

    if successful {
        println!("Successfully updated a document");
    } else {
        println!("Could not update document");
    }

    // Delete a document
    println!("Deleting a document...");
    response = client
        .delete(DeleteParts::IndexId("movies", "2"))
        .send()
        .await?;

    successful = response.status_code().is_success();

    if successful {
        println!("Successfully deleted a document");
    } else {
        println!("Could not delete document");
    }

    // Delete the index
    println!("Deleting the index...");
    response = client
        .indices()
        .delete(IndicesDeleteParts::Index(&["movies"]))
        .send()
        .await?;

    successful = response.status_code().is_success();

    if successful {
        println!("Successfully deleted the index");
    } else {
        println!("Could not delete the index");
    }

    Ok(())
}
```
{% include copy.html %}
