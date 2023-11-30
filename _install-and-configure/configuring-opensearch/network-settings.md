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

## Advanced HTTP settings

OpenSearch supports the following advanced network settings for HTTP communication:

- `http.host` (Static, list): Sets the address of an OpenSearch node for HTTP communication. The `http.host` setting is a combination of `http.bind_host` and `http.publish_host` if they are the same value. An alternative to `http.host` is to configure `http.bind_host` and `http.publish_host` separately as needed. 

- `http.bind_host` (Static, list): Specifies an address or addresses to which an OpenSearch node binds to listen for incoming HTTP connections. 

- `http.publish_host` (Static, list): Specifies an address or addresses that an OpenSearch node publishes to other nodes for HTTP communication.

## Advanced transport settings

OpenSearch supports the following advanced network settings for transport communication:

- `transport.host` (Static, list): Sets the address of an OpenSearch node for transport communication. The `transport.host` setting is a combination of `transport.bind_host` and `transport.publish_host` if they are the same value. An alternative to `transport.host` is to configure `transport.bind_host` and `transport.publish_host` separately as needed. 

- `transport.bind_host` (Static, list): Specifies an address or addresses to which an OpenSearch node binds to listen for incoming transport connections. 

- `transport.publish_host` (Static, list): Specifies an address or addresses that an OpenSearch node publishes to other nodes for transport communication.
