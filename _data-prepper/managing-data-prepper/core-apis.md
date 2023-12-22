---
layout: default
title: Core APIs
parent: Managing Data Prepper
nav_order: 15
---

# Core APIs

All Data Prepper instances expose a server with some control APIs. By default, this server runs on port 4900. Some plugins, especially source plugins, may expose other servers that run on different ports. Configurations for these plugins are independent of the core API. For example, to shut down Data Prepper, you can run the following curl request:

```
curl -X POST http://localhost:4900/shutdown
```

## APIs

The following table lists the available APIs.

| Name | Description |
| --- | --- | 
| ```GET /list```<br>```POST /list``` | Returns a list of running pipelines. |
| ```POST /shutdown``` | Starts a graceful shutdown of Data Prepper. |
| ```GET /metrics/prometheus```<br>```POST /metrics/prometheus``` | Returns a scrape of Data Prepper metrics in Prometheus text format. This API is available as a `metricsRegistries` parameter in the Data Prepper configuration file `data-prepper-config.yaml` and contains `Prometheus` as part of the registry.
| ```GET /metrics/sys```<br>```POST /metrics/sys``` | Returns JVM metrics in Prometheus text format. This API is available as a `metricsRegistries` parameter in the Data Prepper configuration file `data-prepper-config.yaml` and contains `Prometheus` as part of the registry.

## Configuring the server

You can configure your Data Prepper core APIs through the `data-prepper-config.yaml` file. 

### SSL/TLS connection

Many of the getting started guides for this project disable SSL on the endpoint:

```yaml
ssl: false
```

To enable SSL on your Data Prepper endpoint, configure your `data-prepper-config.yaml` file with the following options:

```yaml
ssl: true
keyStoreFilePath: "/usr/share/data-prepper/keystore.p12"
keyStorePassword: "secret"
privateKeyPassword: "secret"
```

For more information about configuring your Data Prepper server with SSL, see [Server Configuration](https://github.com/opensearch-project/data-prepper/blob/main/docs/configuration.md#server-configuration). If you are using a self-signed certificate, you can add the `-k` flag to the request to quickly test core APIs with SSL. Use the following `shutdown` request to test core APIs with SSL:


```
curl -k -X POST https://localhost:4900/shutdown 
```

### Authentication

The Data Prepper core APIs support HTTP basic authentication. You can set the username and password with the following configuration in the `data-prepper-config.yaml` file:

```yaml
authentication:
  http_basic:
    username: "myuser"
    password: "mys3cr3t"
```

You can disable authentication of core endpoints using the following configuration. Use this with caution because the shutdown API and others will be accessible to anybody with network access to your Data Prepper instance.

```yaml
authentication:
  unauthenticated:
```

### Peer Forwarder

Peer Forwarder can be configured to enable stateful aggregation across multiple Data Prepper nodes. For more information about configuring Peer Forwarder, see [Peer forwarder]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/peer-forwarder/). It is supported by the `service_map_stateful`, `otel_traces_raw`, and `aggregate` processors.

### Shutdown timeouts

When you run the Data Prepper `shutdown` API, the process gracefully shuts down and clears any remaining data for both the `ExecutorService` sink and `ExecutorService` processor. The default timeout for shutdown of both processes is 10 seconds. You can configure the timeout with the following optional `data-prepper-config.yaml` file parameters:

```yaml
processorShutdownTimeout: "PT15M"
sinkShutdownTimeout: 30s
```

The values for these parameters are parsed into a `Duration` object through the [Data Prepper Duration Deserializer](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-core/src/main/java/org/opensearch/dataprepper/parser/DataPrepperDurationDeserializer.java). 