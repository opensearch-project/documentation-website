---
layout: default
title: Ingesting log data into OpenSearch
parent: Getting started
nav_order: 30
---

# Ingesting log data into OpenSearch

In this tutorial, you'll run Data Prepper and OpenSearch in Docker, send raw Apache access logs to Data Prepper, and search the parsed log data in OpenSearch. The pipeline that you create performs the following tasks:

1. Receives log lines over HTTP.
1. Parses each log line into separate fields, such as the client IP address, request path, and response code.
1. Converts the log timestamp into a date and the response code and size into integers.
1. Writes each event to an OpenSearch index and prints it to the Data Prepper log.

The pipeline parses log lines in the Apache common log format, such as the following:

```text
10.0.0.7 - - [19/Oct/2026:10:16:03 +0000] "GET /checkout HTTP/1.1" 500 98
```

Each line contains the client IP address, two identity fields (`-` when empty), the timestamp, the request (method, path, and HTTP version), the response code, and the response size in bytes.

Docker Compose downloads the Data Prepper and OpenSearch images when you start the containers, so you don't need to install Data Prepper first.

## Prerequisites

Install [Docker](https://docs.docker.com/get-docker/), including [Docker Compose](https://docs.docker.com/compose/). The containers use ports `9200` (OpenSearch) and `2021` (Data Prepper), so make sure that these ports are not in use.

If you're using Linux, increase the maximum number of memory maps available to OpenSearch. For more information, see [Important settings]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/#important-settings).

## Step 1: Define a pipeline

Create a directory for this tutorial (for example, `data-prepper-tutorial`). In this directory, create a file named `pipelines.yaml` containing the following pipeline configuration. Replace `<custom-admin-password>` with a password that meets the [admin password requirements]({{site.url}}{{site.baseurl}}/security/configuration/demo-configuration/#admin-password-requirements). You'll also use this password for OpenSearch in the next step:

```yaml
log-pipeline:
  source:
    http:
      ssl: false
  processor:
    - grok:
        match:
          message: ['%{COMMONAPACHELOG}']
    - date:
        match:
          - key: timestamp
            patterns: ["dd/MMM/yyyy:HH:mm:ss Z"]
        destination: "@timestamp"
    - convert_type:
        keys: ["response", "bytes"]
        type: integer
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        insecure: true
        username: admin
        password: "<custom-admin-password>"
        index: web-logs
        flush_timeout: -1
    - stdout:
```
{% include copy.html %}

This file defines one pipeline named `log-pipeline` containing the following components:

- `source`: The [`http`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/http/) source receives events on port `2021` at the `/log/ingest` path. The `ssl: false` setting accepts plain HTTP requests, which is suitable only for local testing.
- `processor`: Data Prepper runs the processors in the order in which they are listed:
  - The [`grok`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/grok/) processor matches the `message` field against the built-in `COMMONAPACHELOG` pattern and adds a field for each part of the log line, such as `clientip`, `verb`, `request`, `response`, `bytes`, and `timestamp`.
  - The [`date`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/date/) processor parses the `timestamp` field and writes the result to the `@timestamp` field in ISO 8601 format so that OpenSearch maps it as a date.
  - The [`convert_type`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/convert-entry-type/) processor converts the `response` and `bytes` fields from strings to integers so that you can run range queries on them.
- `sink`: Each event is sent to both sinks:
  - The [`opensearch`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/opensearch/) sink writes events to the `web-logs` index. The `opensearch` hostname refers to the OpenSearch container that you'll define in the next step. The `insecure: true` setting skips certificate verification because the OpenSearch container uses demo certificates. By default, the sink waits up to 60 seconds to batch events before writing them to OpenSearch. Setting `flush_timeout` to `-1` writes events as soon as they are processed so that you can see the results immediately.
  - The [`stdout`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/stdout/) sink prints each processed event to the Data Prepper log so that you can inspect it.

## Step 2: Create the Docker Compose file

In the same directory, create a file named `.env` containing the following line. Replace `<custom-admin-password>` with the password that you used in `pipelines.yaml`:

```bash
OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password>
```
{% include copy.html %}

Docker Compose reads the `.env` file automatically and passes the password to OpenSearch. If the password does not meet the requirements, OpenSearch does not start.

Create a file named `docker-compose.yml` containing the following configuration:

```yaml
services:
  opensearch:
    image: opensearchproject/opensearch:latest
    container_name: opensearch
    environment:
      - discovery.type=single-node
      - OPENSEARCH_INITIAL_ADMIN_PASSWORD=${OPENSEARCH_INITIAL_ADMIN_PASSWORD}
    ports:
      - 9200:9200
  data-prepper:
    image: opensearchproject/data-prepper:latest
    container_name: data-prepper
    volumes:
      - ./pipelines.yaml:/usr/share/data-prepper/pipelines/pipelines.yaml
    ports:
      - 2021:2021
    depends_on:
      - opensearch
```
{% include copy.html %}

This file defines two containers:

- `opensearch`: A single-node OpenSearch cluster with security enabled, available at `https://localhost:9200`.
- `data-prepper`: A Data Prepper instance. Data Prepper loads every pipeline configuration file in the `/usr/share/data-prepper/pipelines/` directory, so the `volumes` setting mounts your `pipelines.yaml` file into that directory. Port `2021` is published so that you can send data to the `http` source from your machine.

Your directory now contains the following files:

```text
data-prepper-tutorial/
├── .env
├── docker-compose.yml
└── pipelines.yaml
```

## Step 3: Start the containers

From the `data-prepper-tutorial` directory, start the containers in the background:

```bash
docker compose up -d
```
{% include copy.html %}

Follow the Data Prepper log:

```bash
docker compose logs -f data-prepper
```
{% include copy.html %}

While OpenSearch is starting, Data Prepper logs `Failed to initialize OpenSearch sink, retrying` warnings. These warnings are expected. Data Prepper retries until OpenSearch is available, which usually takes less than a minute. When the pipeline is ready, the log contains the following lines:

```text
data-prepper  | ... INFO  org.opensearch.dataprepper.plugins.source.loghttp.HTTPSource - Started http source on port 2021...
data-prepper  | ... INFO  org.opensearch.dataprepper.plugins.sink.opensearch.OpenSearchSink - Initialized OpenSearch sink
```

Leave the log running and open a new terminal window for the next step.

## Step 4: Send log data to Data Prepper

The `http` source accepts a JSON array in which each object becomes one event. Send three Apache access log lines, each in the `message` field:

```bash
curl -X POST http://localhost:2021/log/ingest \
  -H "Content-Type: application/json" \
  -d '[
    {"message": "192.168.1.10 - - [19/Oct/2026:10:15:32 +0000] \"GET /products/123 HTTP/1.1\" 200 5120"},
    {"message": "192.168.1.25 - - [19/Oct/2026:10:15:47 +0000] \"POST /cart HTTP/1.1\" 201 342"},
    {"message": "10.0.0.7 - - [19/Oct/2026:10:16:03 +0000] \"GET /checkout HTTP/1.1\" 500 98"}
  ]'
```
{% include copy.html %}

Data Prepper responds with `200 OK`.

## Step 5: View the processed events

Return to the terminal containing the Data Prepper log. The `stdout` sink prints each processed event on a single line. For example, the following event, formatted for readability, was created from the third log line:

```json
{
  "message": "10.0.0.7 - - [19/Oct/2026:10:16:03 +0000] \"GET /checkout HTTP/1.1\" 500 98",
  "request": "/checkout",
  "auth": "-",
  "ident": "-",
  "response": 500,
  "bytes": 98,
  "clientip": "10.0.0.7",
  "verb": "GET",
  "httpversion": "1.1",
  "timestamp": "19/Oct/2026:10:16:03 +0000",
  "@timestamp": "2026-10-19T10:16:03.000Z"
}
```

Compare the event to the log line that you sent:

- The `message` field contains the original log line.
- The `grok` processor added the `clientip`, `ident`, `auth`, `timestamp`, `verb`, `request`, `httpversion`, `response`, and `bytes` fields.
- The `date` processor added the `@timestamp` field.
- The `convert_type` processor changed `response` and `bytes` to integers, so they appear without quotation marks.

## Step 6: Search the data in OpenSearch

The `opensearch` sink wrote the same events to the `web-logs` index. Search for requests that returned an error, which are those containing a response code of `400` or higher:

```bash
curl -X GET "https://localhost:9200/web-logs/_search?pretty" -ku admin:<custom-admin-password> \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "range": {
        "response": {
          "gte": 400
        }
      }
    }
  }'
```
{% include copy.html %}

The `-k` option skips certificate verification because OpenSearch uses demo certificates. The response contains the event for the request that returned a `500` response code:

```json
{
  "took" : 41,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "web-logs",
        "_id" : "QJmSVKEBVverMSge8P0k",
        "_score" : 1.0,
        "_source":{"message":"10.0.0.7 - - [19/Oct/2026:10:16:03 +0000] \"GET /checkout HTTP/1.1\" 500 98","request":"/checkout","auth":"-","ident":"-","response":500,"bytes":98,"clientip":"10.0.0.7","verb":"GET","httpversion":"1.1","timestamp":"19/Oct/2026:10:16:03 +0000","@timestamp":"2026-10-19T10:16:03.000Z"}
      }
    ]
  }
}
```

The range query works because the `convert_type` processor converted `response` to an integer before the event reached OpenSearch.

## Step 7: Modify the pipeline

Data Prepper reads pipeline configuration files only at startup, so you must restart Data Prepper after changing a pipeline.

The `timestamp` field duplicates the `@timestamp` field. To remove it, add a [`delete_entries`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/delete-entries/) processor to the end of the `processor` list in `pipelines.yaml`:

```yaml
  processor:
    - grok:
        match:
          message: ['%{COMMONAPACHELOG}']
    - date:
        match:
          - key: timestamp
            patterns: ["dd/MMM/yyyy:HH:mm:ss Z"]
        destination: "@timestamp"
    - convert_type:
        keys: ["response", "bytes"]
        type: integer
    - delete_entries:
        with_keys: ["timestamp"]
```
{% include copy.html %}

Restart Data Prepper:

```bash
docker compose restart data-prepper
```
{% include copy.html %}

Wait until the Data Prepper log contains a new `Started http source on port 2021` line, and then send another log line:

```bash
curl -X POST http://localhost:2021/log/ingest \
  -H "Content-Type: application/json" \
  -d '[
    {"message": "10.0.0.7 - - [19/Oct/2026:10:20:11 +0000] \"GET /checkout HTTP/1.1\" 503 64"}
  ]'
```
{% include copy.html %}

The new event in the Data Prepper log no longer contains the `timestamp` field:

```json
{
  "message": "10.0.0.7 - - [19/Oct/2026:10:20:11 +0000] \"GET /checkout HTTP/1.1\" 503 64",
  "request": "/checkout",
  "auth": "-",
  "ident": "-",
  "response": 503,
  "bytes": 64,
  "clientip": "10.0.0.7",
  "verb": "GET",
  "httpversion": "1.1",
  "@timestamp": "2026-10-19T10:20:11.000Z"
}
```

Events that were indexed before the change are not modified.

## Step 8: Clean up

To stop and remove the containers, run the following command from the `data-prepper-tutorial` directory:

```bash
docker compose down
```
{% include copy.html %}

The containers do not use volumes, so removing them deletes the `web-logs` index.

## Next steps

- To learn about pipeline structure, conditional routing, and other pipeline options, see [Pipelines]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines/).
- To find the sources, processors, and sinks that you can use in a pipeline, see [Sources]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/sources/), [Processors]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/processors/), and [Sinks]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/sinks/). Some processor pages include complete examples that send data to `localhost:2021` and write to `https://opensearch:9200`. You can run these examples in the environment from this tutorial by copying the example pipeline into `pipelines.yaml`, replacing `<custom-admin-password>` with the admin password from your `.env` file, and restarting Data Prepper.
- To configure the Data Prepper server, including its port, TLS, and authentication, see [Configuring OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/configuring-data-prepper/).
- To set up Data Prepper for common use cases, see [Log analytics]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/log-analytics/) and [Trace analytics]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/trace-analytics/).
- To send logs from a log collector instead of `curl`, see the Data Prepper repository examples for [Fluent Bit](https://github.com/opensearch-project/data-prepper/tree/main/examples/log-ingestion), [Fluentd](https://github.com/opensearch-project/data-prepper/tree/main/examples/log-ingestion-fluentd), [Kubernetes](https://github.com/opensearch-project/data-prepper/tree/main/examples/log-ingestion-k8s), and [Amazon ECS FireLens](https://github.com/opensearch-project/data-prepper/tree/main/examples/log-ingestion-ecs-firelens).
