---
layout: default
title: Migrating from Logstash
nav_order: 25
redirect_from: 
  - /clients/data-prepper/configure-logstash-data-prepper/
  - /data-prepper/configure-logstash-data-prepper/
---

# Migrating from Logstash

You can run OpenSearch Data Prepper with a Logstash configuration.

As mentioned in [Getting started with OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/), you'll need to configure Data Prepper with a pipeline using a `pipelines.yaml` file.

Alternatively, if you have a Logstash configuration `logstash.conf` to configure Data Prepper instead of `pipelines.yaml`.

## Supported plugins

As of the Data Prepper 1.2 release, the following plugins from the Logstash configuration are supported:
* HTTP Input plugin
* Grok Filter plugin
* Elasticsearch Output plugin
* Amazon Elasticsearch Output plugin

## Limitations
* Apart from the supported plugins, all other plugins from the Logstash configuration will throw an `Exception` and fail to run.
* Conditionals in the Logstash configuration are not supported as of the Data Prepper 1.2 release.

## Running Data Prepper with a Logstash configuration

If you have OpenSearch running on your host and want to run Data Prepper Docker container with Logstash configuration, follow these steps:

1. Update the `elasticsearch` section of `logstash.conf` to point to your OpenSearch instance. The host name has to match the OpenSearch certificate SANs, for example `node-0.example.com` if demo installation is used.

    ```
    input {
      http {
        port => 4910 # Note the port used in this example
      }
    }
    filter {
      grok {
        match => { "message" => "%{COMBINEDAPACHELOG}" }
        tag_on_failure => []
      }
    }
    output {
      # Point this at your OpenSearch/OSD endpoint
      elasticsearch {
        hosts    => ["https://node-0.example.com:9200"]   # change to your host:port
        index    => "logstash-%{+YYYY.MM.dd}"
        user     => "admin"                
        password => "<admin_pass>"
        ssl => true
        ssl_certificate_verification => true
      }
    }
    ```
    {% include copy-curl.html %}

1. Supply your `logstash.conf` configuration to Data Prepper Docker container, using the following command:

    ```bash
    docker run --rm --name data-prepper \
      --add-host node-0.example.com:host-gateway \
      -p 4910:4910 \
      -v "${PWD}/logstash.conf:/usr/share/data-prepper/logstash.conf" \
      --entrypoint bin/data-prepper \
      opensearchproject/data-prepper:latest \
      /usr/share/data-prepper/logstash.conf \
      /usr/share/data-prepper/config/data-prepper-config.yaml
    ```
    {% include copy-curl.html %}

The `logstash.conf` file is converted to `logstash.yaml` by mapping the plugins and attributes in the Logstash configuration to the corresponding plugins and attributes in Data Prepper.
You can find the converted `logstash.yaml` file in the same directory where you stored `logstash.conf`. See the converted `logstash.yaml` sample file:

```
logstash-converted-pipeline:
  source:
    http:
      max_connection_count: 500
      request_timeout: 10000
      port: 4910
  processor:
    - grok:
        match:
          message:
            - "%{COMBINEDAPACHELOG}"
  sink:
    - opensearch:
        hosts:
          - "https://node-0.example.com:9200"
        username: "admin"
        password: "<admin_pass>"
        index: "logstash-%{yyyy.MM.dd}"
```


The following output in your terminal indicates that Data Prepper is running correctly:

```
INFO  org.opensearch.dataprepper.plugins.source.loghttp.HTTPSource - Started http source on port 4910...
```

To test this further, run the following command on your host to push sample data to Data Prepper:

```bash
curl -X POST "http://localhost:4910/log/ingest" \                           
  -H "Content-Type: application/json" \
  -d '[{"message":"hello"}]'
```
{% include copy-curl.html %}

After a couple of seconds you can query OpenSearch `logstash-*` index for this document:

```bash
curl -k -uadmin:"<admin_pass>" "https://localhost:9200/logstash-*/_search?pretty"
```
{% include copy-curl.html %}

The sample document will be returned:

```json
{
  "took" : 2,
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
        "_index" : "logstash-2025.10.10",
        "_id" : "dHnSzZkBIk7UWjH_Kjxh",
        "_score" : 1.0,
        "_source" : {
          "message" : "hello"
        }
      }
    ]
  }
}
```

