---
layout: default
title: cidrContains()
parent: Functions
grand_parent: Pipelines
nav_order: 5
---

# cidrContains()

The `cidrContains()` function is used to check if an IP address is contained within a specified Classless Inter-Domain Routing (CIDR) block or range of CIDR blocks. It accepts two or more arguments:

- The first argument is a JSON pointer, which represents the key or path to the field containing the IP address to be checked. It supports both IPv4 and IPv6 address formats.

- The subsequent arguments are strings representing one or more CIDR blocks or IP address ranges. The function checks if the IP address specified in the first argument matches or is contained within any of these CIDR blocks.

For example, if your data contains an IP address field named `client.ip` and you want to check if it belongs to the CIDR blocks `192.168.0.0/16` or `10.0.0.0/8`, you can use the `cidrContains()` function as follows:

```
cidrContains('/client.ip', '192.168.0.0/16', '10.0.0.0/8')
```
{% include copy.html %}

This function returns `true` if the IP address matches any of the specified CIDR blocks or `false` if it does not.

## Example

The following pipeline drop any documents that are not part of the specified CIDR blocks:

```
cidr-allowlist-pipeline:
  source:
    http:
      port: 2021
      path: /events
      ssl: true
      sslKeyCertChainFile: "certs/dp.crt"
      sslKeyFile: "certs/dp.key"
  processor:
    - drop_events:
        # Drop events whose client IP is NOT in specific CIDR allowlist
        drop_when: 'not cidrContains(/client/ip, "10.0.0.0/8", "192.168.0.0/16", "fd00::/8")'
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        insecure: true
        username: admin
        password: "admin_pass"
        index_type: custom
        index: "logs-%{yyyy.MM.dd}"
```
