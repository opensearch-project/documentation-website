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

The following pipeline discards any documents that are not part of the specified CIDR blocks:

```yaml
cidr-allowlist-pipeline:
  source:
    http:
      path: /events
      ssl: true
      sslKeyCertChainFile: certs/dp.crt
      sslKeyFile: certs/dp.key
  processor:
    - drop_events:
        # Drop events whose client IP is NOT in specific CIDR allowlist
        drop_when: 'not cidrContains(/client/ip, "10.0.0.0/8", "192.168.0.0/16", "fd00::/8")'
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        insecure: true
        username: admin
        password: admin_pass
        index_type: custom
        index: logs-%{yyyy.MM.dd}
```
{% include copy.html %}

You can test this pipeline using the following command:

```bash
curl -ksS -X POST "https://localhost:2021/events" \
  -H "Content-Type: application/json" \
  -d '[
    {"client":{"ip":"10.23.45.6"},"msg":"allowed 10/8"},
    {"client":{"ip":"8.8.8.8"},"msg":"should be dropped"},
    {"client":{"ip":"fd00::1234"},"msg":"allowed ULA IPv6"}
  ]'
```
{% include copy.html %}

The documents stored in OpenSearch contain the following information:

```json
{
  ...
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "logs-2025.10.14",
        "_id": "Ng1i4pkBLPEKXekW48BU",
        "_score": 1,
        "_source": {
          "client": {
            "ip": "10.23.45.6"
          },
          "msg": "allowed 10/8"
        }
      },
      {
        "_index": "logs-2025.10.14",
        "_id": "Nw1i4pkBLPEKXekW48BU",
        "_score": 1,
        "_source": {
          "client": {
            "ip": "fd00::1234"
          },
          "msg": "allowed ULA IPv6"
        }
      }
    ]
  }
}
```
