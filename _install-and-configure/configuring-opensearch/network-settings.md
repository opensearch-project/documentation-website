---
layout: default
title: Network settings
parent: Configuring OpenSearch
nav_order: 20
---

# Network settings

OpenSearch uses HTTP settings to configure communication with external clients through the REST API and transport settings for internal node-to-node communication within OpenSearch.

To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

OpenSearch supports the following common network settings:

- `network.host` (Static, list): Binds an OpenSearch node to an address. Use `0.0.0.0` to include all available network interfaces, or specify an IP address assigned to a specific interface. The `network.host` setting is a combination of `network.bind_host` and `network.publish_host` if they are the same value. An alternative to `network.host` is to configure `network.bind_host` and `network.publish_host` separately as needed. See [Advanced network settings](#advanced-network-settings).

- `http.port` (Static, single value or range): Binds an OpenSearch node to a custom port or a range of ports for HTTP communication. You can specify an address or a range of addresses. Default is `9200-9300`.

- `transport.port` (Static, single value or range): Binds an OpenSearch node to a custom port for communication between nodes. You can specify an address or a range of addresses. Default is `9300-9400`.

## Advanced network settings

OpenSearch supports the following advanced network settings:

- `network.bind_host` (Static, list): Binds an OpenSearch node to an address or addresses for incoming connections. Default is the value in `network.host`. 

- `network.publish_host` (Static, list): Specifies an address or addresses that an OpenSearch node publishes to other nodes in the cluster so that they can connect to it.

## General TCP settings

OpenSearch supports the following TCP settings that apply to all network connections, including both HTTP and transport layers:

- `network.tcp.keep_alive` (Static, Boolean): Enables or disables TCP keep-alive for all TCP connections used by OpenSearch, including HTTP and transport layers. When enabled, the operating system will send periodic keep-alive packets to detect dead connections. Default is `true`.

- `network.tcp.no_delay` (Static, Boolean): Enables or disables the `TCP_NODELAY` option for all TCP connections. When enabled, disables Nagle's algorithm, which can reduce latency for small messages at the cost of increased network traffic. This applies to both HTTP and transport connections. Default is `true`.

- `network.tcp.receive_buffer_size` (Static, byte unit): Sets the size of the TCP receive buffer for all TCP connections used by OpenSearch. This affects both HTTP and transport connections. A larger buffer can improve throughput for high-bandwidth connections. By default, this is not explicitly set and uses the operating system default.

- `network.tcp.reuse_address` (Static, Boolean): Controls whether TCP addresses can be reused for all TCP connections. This affects socket binding behavior for both HTTP and transport connections. Default is `true` on non-Windows machines and `false` on Windows.

- `network.tcp.send_buffer_size` (Static, byte unit): Sets the size of the TCP send buffer for all TCP connections used by OpenSearch. This affects both HTTP and transport connections. A larger buffer can improve throughput for high-bandwidth connections. By default, this is not explicitly set and uses the operating system default.

## Advanced HTTP settings

OpenSearch supports the following advanced network settings for HTTP communication:

- `http.host` (Static, list): Sets the address of an OpenSearch node for HTTP communication. The `http.host` setting is a combination of `http.bind_host` and `http.publish_host` if they are the same value. An alternative to `http.host` is to configure `http.bind_host` and `http.publish_host` separately as needed. 

- `http.bind_host` (Static, list): Specifies an address or addresses to which an OpenSearch node binds to listen for incoming HTTP connections. 

- `http.publish_host` (Static, list): Specifies an address or addresses that an OpenSearch node publishes to other nodes for HTTP communication.

- `http.compression` (Static, Boolean): Enables support for compression using `Accept-Encoding` when applicable. When `HTTPS` is enabled, the default is `false`, otherwise, the default is `true`. Disabling compression for HTTPS helps mitigate potential security risks, such as `BREACH` attacks. To enable compression for HTTPS traffic, explicitly set `http.compression` to `true`.

- `http.max_header_size`: (Static, string) The maximum combined size of all HTTP headers allowed in a request. Default is `16KB`.

- `http.compression_level` (Static, integer): Defines the compression level to use for HTTP responses when compression is enabled. Valid values are in the range of 1 (minimum compression) to 9 (maximum compression). Higher values provide better compression but use more CPU resources. Default is `3`.

- `http.cors.max-age` (Static, time unit): Defines how long browsers should cache the results of CORS preflight OPTIONS requests. Browsers send preflight requests to determine CORS settings before making actual cross-origin requests. Default is `1728000` seconds (20 days).

- `http.max_content_length` (Static, byte unit): Sets the maximum content length allowed for HTTP requests. Requests exceeding this limit will be rejected. This setting helps prevent memory issues from extremely large requests. Default is `100mb`.

- `http.max_initial_line_length` (Static, byte unit): Sets the maximum length allowed for HTTP URLs in the initial request line. URLs exceeding this limit will be rejected. Default is `4kB`.

- `http.max_warning_header_count` (Static, integer): Sets the maximum number of warning headers that can be included in HTTP responses to clients. Warning headers provide additional information about the request processing. Default is unbounded (no limit).

- `http.max_warning_header_size` (Static, byte unit): Sets the maximum total size of all warning headers combined in HTTP responses to clients. This helps prevent response headers from becoming too large. Default is unbounded (no limit).

- `http.pipelining.max_events` (Static, integer): Sets the maximum number of events that can be queued up in memory before an HTTP connection is closed. This setting helps manage memory usage for HTTP pipelining. Default is `10000`.

- `http.publish_port` (Static, integer): Specifies the port that HTTP clients should use when communicating with this node. This setting is useful when a cluster node is behind a proxy or firewall and the actual `http.port` is not directly addressable from outside the network. Default is the actual port assigned via `http.port`.

- `http.tcp.no_delay` (Static, Boolean): Controls TCP_NODELAY option for HTTP connections. When enabled, disables Nagle's algorithm which can reduce latency for small messages at the cost of increased network traffic. Default is `true`.

## HTTP CORS settings

OpenSearch supports the following Cross-Origin Resource Sharing (CORS) settings for HTTP:

- `http.cors.enabled` (Static, Boolean): Enables or disables cross-origin resource sharing (CORS) for HTTP requests. When enabled, OpenSearch processes CORS preflight requests and responds with appropriate `Access-Control-Allow-Origin` headers if the request origin is permitted. When disabled, OpenSearch ignores the `Origin` request header, effectively disabling CORS. Default is `false`.

- `http.cors.allow-origin` (Static, list): Specifies which origins are allowed for CORS requests. You can use wildcards (`*`) to allow all origins, though this is considered a security risk. You can also use regular expressions by wrapping the value with forward slashes (e.g., `/https?:\/\/localhost(:[0-9]+)?/`). Default is no origins allowed.

- `http.cors.allow-methods` (Static, list): Specifies which HTTP methods are allowed for CORS requests. Default is `OPTIONS, HEAD, GET, POST, PUT, DELETE`.

- `http.cors.allow-headers` (Static, list): Specifies which HTTP headers are allowed in CORS requests. Default is `X-Requested-With, Content-Type, Content-Length`.

- `http.cors.allow-credentials` (Static, Boolean): Controls whether the `Access-Control-Allow-Credentials` header should be included in CORS responses. This header is only returned when this setting is `true`. Default is `false`.

## HTTP error handling settings

OpenSearch supports the following HTTP error handling settings:

- `http.detailed_errors.enabled` (Static, Boolean): Controls whether detailed error messages and stack traces are included in HTTP response output. When set to `false`, only simple error messages are returned unless the `error_trace` request parameter is specified (which will return an error when detailed errors are disabled). Default is `true`.

## HTTP debugging settings

OpenSearch supports the following HTTP debugging settings for tracing HTTP communication:

- `http.tracer.include` (Dynamic, list): Specifies a comma-separated list of HTTP request paths or wildcard patterns to include in HTTP tracing. When configured, only HTTP requests matching these patterns are traced in the logs. This setting is useful for debugging specific HTTP endpoints or API calls. Default is `[]` (empty list, traces all requests when HTTP tracing is enabled).

- `http.tracer.exclude` (Dynamic, list): Specifies a comma-separated list of HTTP request paths or wildcard patterns to exclude from HTTP tracing. HTTP requests matching these patterns are not traced in the logs, even if HTTP tracing is enabled. This setting is useful for reducing noise from frequent or unimportant endpoints. Default is `[]` (empty list, no exclusions when HTTP tracing is enabled).

## Advanced transport settings

OpenSearch supports the following advanced network settings for transport communication:

- `transport.host` (Static, list): Sets the address of an OpenSearch node for transport communication. The `transport.host` setting is a combination of `transport.bind_host` and `transport.publish_host` if they are the same value. An alternative to `transport.host` is to configure `transport.bind_host` and `transport.publish_host` separately as needed. 

- `transport.bind_host` (Static, list): Specifies an address or addresses to which an OpenSearch node binds to listen for incoming transport connections. 

- `transport.publish_host` (Static, list): Specifies an address or addresses that an OpenSearch node publishes to other nodes for transport communication.

## Transport debugging settings

OpenSearch supports the following transport debugging settings for tracing transport communication:

- `transport.tracer.include` (Dynamic, list): Specifies a comma-separated list of transport actions or patterns to include in transport tracing. When configured, only transport communications matching these patterns are traced in the logs. This setting is useful for debugging specific internal OpenSearch operations. Default is `[]` (empty list, traces all actions when transport tracing is enabled).

- `transport.tracer.exclude` (Dynamic, list): Specifies a comma-separated list of transport actions or patterns to exclude from transport tracing. Transport communications matching these patterns are not traced in the logs, even if transport tracing is enabled. This setting is useful for reducing noise from frequent or unimportant operations. Default is `[]` (empty list, no exclusions when transport tracing is enabled).

## Transport profiles settings

OpenSearch supports the following transport profile settings that allow configuration of multiple transport profiles for different types of connections:

Transport profiles allow you to bind to multiple ports on different interfaces for different types of connections. The `default` profile is special and serves as a fallback for other profiles and controls how this node connects to other nodes in the cluster. The following settings can be configured for each transport profile:

- `transport.profiles.<profile_name>.port` (Dynamic, single value or range): Sets the port or port range to bind for this transport profile. Different profiles can use different ports to separate types of traffic.

- `transport.profiles.<profile_name>.bind_host` (Dynamic, list): Specifies which network interfaces this transport profile should bind to for incoming connections. Different profiles can bind to different network interfaces.

- `transport.profiles.<profile_name>.publish_host` (Dynamic, list): Specifies the address that this transport profile publishes to other nodes so they can connect to it. This is useful when the bind address differs from the externally accessible address.

- `transport.profiles.<profile_name>.tcp.no_delay` (Dynamic, Boolean): Controls the `TCP_NODELAY` option for connections on this transport profile. When enabled, disables Nagle's algorithm to reduce latency for small messages.

- `transport.profiles.<profile_name>.tcp.keep_alive` (Dynamic, Boolean): Controls the `SO_KEEPALIVE` option for connections on this transport profile. When enabled, the operating system sends periodic keep-alive packets to detect dead connections.

- `transport.profiles.<profile_name>.tcp.keep_idle` (Dynamic, time unit): Sets the time a connection must be idle before starting to send TCP keepalive probes. Only available on Linux and Mac with JDK 11 or newer. Default is `-1` (uses system default).

- `transport.profiles.<profile_name>.tcp.keep_interval` (Dynamic, time unit): Sets the interval between TCP keepalive probes for connections on this transport profile. Only available on Linux and Mac with JDK 11 or newer. Default is `-1` (uses system default).

- `transport.profiles.<profile_name>.tcp.keep_count` (Dynamic, integer): Sets the number of unacknowledged TCP keepalive probes before dropping the connection. Only available on Linux and Mac with JDK 11 or newer. Default is `-1` (uses system default).

- `transport.profiles.<profile_name>.tcp.reuse_address` (Dynamic, Boolean): Controls the `SO_REUSEADDR` option for sockets on this transport profile, allowing address reuse after socket closure.

- `transport.profiles.<profile_name>.tcp.send_buffer_size` (Dynamic, byte unit): Sets the TCP send buffer size for connections on this transport profile. Larger buffers can improve throughput for high-bandwidth connections.

- `transport.profiles.<profile_name>.tcp.receive_buffer_size` (Dynamic, byte unit): Sets the TCP receive buffer size for connections on this transport profile. Larger buffers can improve throughput for high-bandwidth connections.

## Advanced transport settings

OpenSearch supports the following advanced transport settings:

- `transport.compress` (Static, Boolean): Enables `DEFLATE` compression for all inter-node transport communications. When enabled, data transmitted between nodes is compressed to reduce network bandwidth usage, which can be beneficial for clusters connected over slower network links. However, compression adds CPU overhead for compression and decompression operations. Default is `false`.

- `transport.connect_timeout` (Static, time unit): Sets the timeout period for establishing new transport connections between nodes. If a connection attempt does not complete within this time limit, it is considered failed. This setting helps prevent nodes from hanging indefinitely when trying to connect to unresponsive or unreachable nodes. Default is `30s`.

- `transport.ping_schedule` (Static, time unit): Configures the interval for sending application-level ping messages to maintain transport connections between nodes. When set to a positive value, nodes will send periodic ping messages to detect and prevent idle connection timeouts. Setting this to `-1` disables application-level pings. It is generally recommended to use TCP keep-alive settings instead, as they provide more comprehensive connection monitoring for all connection types. Default is `-1` (disabled).

- `transport.publish_port` (Static, integer): Specifies the port that other nodes should use when connecting to this node for transport communication. This setting is particularly useful when nodes are behind proxies, firewalls, or NAT configurations where the actual bind port differs from the externally accessible port. If not specified, other nodes will use the port determined by the `transport.port` setting. Default is the actual port assigned via `transport.port`.

## Selecting the transport

The default OpenSearch transport is provided by the `transport-netty4` module and uses the [Netty 4](https://netty.io/) engine for both internal TCP-based communication between nodes in the cluster and external HTTP-based communication with clients. This communication is fully asynchronous and non-blocking. The following table lists other available transport plugins that can be used interchangeably.

Plugin | Description
:---------- | :--------
`transport-reactor-netty4`    | The OpenSearch HTTP transport based on [Project Reactor](https://github.com/reactor/reactor-netty) and Netty 4 (**experimental**) <br> Installation: `./bin/opensearch-plugin install transport-reactor-netty4` <br> Configuration (using `opensearch.yml`): <br> `http.type: reactor-netty4` <br> `http.type: reactor-netty4-secure`
