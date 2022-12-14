---
layout: default
title: Core APIs
nav_order: 2
---

# Core APIs

All Data Prepper instances expose a server with some control APIs. By default, this server runs on port 4900. Some plugins, especially Source plugins may expose other servers. These will be on different ports and their configurations are independent of the core API. For example, to shut down Data Prepper, you can run:

```
curl -X POST http://localhost:4900/shutdown
```

## APIs

The following APIs are available:

| Name | Description |
| --- | --- | 
| ```GET /list```<br>```POST /list``` | Returns a list of running pipelines. |
| ```POST /shutdown``` | Starts a graceful shutdown of Data Prepper. |
| ```GET /metrics/prometheus```<br>```POST /metrics/prometheus``` | Returns a scrape of Data Prepper metrics in Prometheus text format. This API is available provided `metricsRegistries` parameter in data prepper configuration file `data-prepper-config.yaml` has `Prometheus` as one of the registry.
| ```GET /metrics/sys```<br>```POST /metrics/sys``` | Returns JVM metrics in Prometheus text format. This API is available provided `metricsRegistries` parameter in Data Prepper configuration file `data-prepper-config.yaml` has `Prometheus` as one of the registry.

## Configuring the server

You can configure your Data Prepper core APIs through the `data-prepper-config.yaml` file. 

### SSL/TLS connection

Many of the Getting Started guides in this project disable SSL on the endpoint.

```yaml
ssl: false
```

To enable SSL on your Data Prepper endpoint, configure your `data-prepper-config.yaml`
with the following:

```yaml
ssl: true
keyStoreFilePath: "/usr/share/data-prepper/keystore.p12"
keyStorePassword: "secret"
privateKeyPassword: "secret"
```

For more information on configuring your Data Prepper server with SSL, see [Server Configuration](https://github.com/opensearch-project/data-prepper/blob/main/docs/configuration.md#server-configuration). If you are using a self-signed certificate, you can add the `-k` flag to quickly test out sending curl requests for the core APIs with SSL.

```
curl -k -X POST https://localhost:4900/shutdown
```

### Authentication

The Data Prepper Core APIs support HTTP Basic authentication. You can set the username and password with the following configuration in `data-prepper-config.yaml`:

```yaml
authentication:
  http_basic:
    username: "myuser"
    password: "mys3cr3t"
```

You can disable authentication of core endpoints using the following
configuration. Use this with caution because the shutdown API and
others will be accessible to anybody with network access to
your Data Prepper instance.

```yaml
authentication:
  unauthenticated:
```

### Peer Forwarder

Peer forwarder can be configured to enable stateful aggregation across multiple Data Prepper nodes. For more information on configuring Peer Forwarder, see [Peer Forwarder Configuration](https://github.com/opensearch-project/data-prepper/blob/main/docs/peer_forwarder.md).
It is supported by `service_map_stateful`, `otel_trace_raw` and `aggregate` processors.

### Shutdown Timeouts

When the DataPrepper `shutdown` API is invoked, the sink and processor `ExecutorService` are given time to gracefully shutdown and clear any in-flight data. The default graceful shutdown timeout for the `ExecutorService` processes is 10 seconds. You can configure the timeout with the following optional parameters:

```yaml
processorShutdownTimeout: "PT15M"
sinkShutdownTimeout: 30s
```

The values for these parameters are parsed into a `Duration` object via the [DataPrepperDurationDeserializer](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-core/src/main/java/org/opensearch/dataprepper/parser/DataPrepperDurationDeserializer.java).