---
layout: default
title: Node discovery and seed hosts
parent: Discovery and cluster formation
nav_order: 10
---

# Node discovery and seed hosts

Node discovery is the process by which OpenSearch nodes locate and connect to other nodes to form or join a cluster. This process is essential when starting a node for the first time or when a node loses connection to the cluster manager and needs to rejoin the cluster.

The discovery process operates in two distinct phases:

1. **Initial seed discovery**: Each starting node connects to a predefined list of seed addresses and attempts to identify whether the nodes at those addresses are cluster-manager-eligible.

2. **Peer discovery**: Once connected to seed nodes, the node exchanges lists of known cluster-manager-eligible peers. This creates a cascading discovery process where each newly discovered node provides additional peer information.

The discovery process continues until one of the following conditions is met:

- **For non-cluster-manager-eligible nodes**: Discovery continues until an elected cluster manager is found.
- **For cluster-manager-eligible nodes**: Discovery continues until either an elected cluster manager is found or enough cluster-manager-eligible nodes are discovered to complete a cluster manager election.

If neither condition is met within the configured time, the node retries the discovery process after the interval specified by `discovery.find_peers_interval` (default is `1s`).

## Seed hosts providers

OpenSearch uses _seed hosts providers_ to supply the initial list of addresses for node discovery. These providers define how nodes obtain the seed addresses needed to start the discovery process.

You can configure seed hosts providers using the `discovery.seed_providers` setting, which accepts a list of provider types. This allows you to combine multiple discovery methods for your cluster. The default provider is `settings`, which uses static configuration.

### Settings-based seed hosts provider

The settings-based provider uses static configuration to define a list of seed node addresses. This is the most common approach for on-premises deployments with known node addresses.

Configure seed hosts using the `discovery.seed_hosts` setting in `opensearch.yml`:

```yaml
discovery.seed_hosts:
  - 192.168.1.10:9300
  - 192.168.1.11          # Port defaults to transport.port
  - seeds.example.com     # DNS hostnames are resolved
```
{% include copy.html %}

Each seed host address can be specified in the following ways.

| Format                  | Example                  | Notes                                    |
| ----------------------- | ------------------------ | ---------------------------------------- |
| IP address with port    | `192.168.1.10:9300`      | Specifies a custom transport port        |
| IP address without port | `192.168.1.11`           | Uses the default transport port          |
| Hostname with port      | `node1.example.com:9300` | Specifies a custom transport port        |
| Hostname without port   | `node1.example.com`      | Uses the default transport port          |
| IPv6 address            | `[2001:db8::1]:9300`     | Brackets are required for IPv6 addresses |

When no port is specified, OpenSearch uses the first port from these settings in order:

1. `transport.profiles.default.port`
2. `transport.port`

If neither setting is configured, the default port `9300` is used.

When you specify hostnames as seed addresses OpenSearch performs the following DNS resolution steps:

- OpenSearch performs DNS lookups to resolve hostnames to IP addresses.
- If a hostname resolves to multiple IP addresses, OpenSearch attempts to connect to all resolved addresses.
- DNS lookups are subject to JVM DNS caching settings.
- Resolution occurs during each discovery round, allowing for dynamic IP changes.

The DNS resolution behavior is controlled by these settings:

- `discovery.seed_resolver.max_concurrent_resolvers`: Maximum concurrent DNS lookups (default is `10`).
- `discovery.seed_resolver.timeout`: Timeout for each DNS lookup (default is `5s`).

### File-based seed hosts provider

The file-based provider reads seed host addresses from an external file, allowing for dynamic updates without restarting nodes. This is particularly useful in containerized environments where IP addresses may not be known at startup.

Enable the file-based provider in `opensearch.yml`:

```yaml
discovery.seed_providers: file
```
{% include copy.html %}

You can also combine it with the settings-based provider:

```yaml
discovery.seed_providers: [settings, file]
```
{% include copy.html %}

Create a file named `unicast_hosts.txt` in your OpenSearch configuration directory (`$OPENSEARCH_PATH_CONF/unicast_hosts.txt`). The file should follow this format:

```
# Static IP addresses
10.0.1.10
10.0.1.11:9305

# Hostnames
node1.example.com
node2.example.com:9301

# IPv6 addresses (brackets required)
[2001:db8::1]:9300
[2001:db8::2]

# Comments start with # and must be on separate lines
# This is a comment
```
{% include copy.html %}

The file should follow this format:

- Each line contains a single host address.
- Specify a `host:port` or just `host` (uses default port).
- Lines starting with `#` are treated as comments.
- IPv6 addresses must be enclosed in brackets, with optional port after the brackets.
- Empty lines are ignored.

OpenSearch automatically detects changes to the `unicast_hosts.txt` file and reloads the seed host list without requiring a node restart. This allows you to:

- Add new seed hosts as your cluster grows.
- Remove decommissioned nodes from the seed list.
- Update IP addresses after infrastructure changes.

Note that file-based discovery supplements (rather than replaces) any seed hosts configured in the `discovery.seed_hosts` setting.

## Configuration examples

The following examples demonstrate how to configure different discovery mechanisms.

### Combining discovery providers

You can use multiple seed host providers simultaneously:

```yaml
discovery.seed_providers: [settings, file]
discovery.seed_hosts:
  - 10.0.1.10:9300  # Always include this seed host
# Additional hosts loaded from unicast_hosts.txt
```
{% include copy.html %}

This configuration uses both static seed hosts and dynamically loaded hosts from a file.

### Single-node development setup

For development or testing environments:

```yaml
discovery.type: single-node
```
{% include copy.html %}

When `discovery.type` is set to `single-node`, OpenSearch bypasses the normal discovery process and forms a single-node cluster immediately.

## Related documentation

- To troubleshoot discovery issues, use the monitoring commands detailed in the [Discovery and cluster formation]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/#monitoring-discovery-and-cluster-formation-discovery-and-cluster-formation) overview.

- For a complete list of discovery-related settings, see [Discovery and cluster formation settings]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/settings/).
