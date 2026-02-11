---
layout: default
title: Resolve index
parent: Core index APIs
grand_parent: Index APIs
nav_order: 70
canonical_url: https://docs.opensearch.org/latest/api-reference/index-apis/resolve-index/
---

# Resolve Index API

The Resolve Index API helps you understand how OpenSearch resolves aliases, data streams, and concrete indexes that match a specified name or wildcard expression.

## Endpoints

```json
GET /_resolve/index/<name>
```

## Path parameters

The following table lists the available path parameters. All path parameters are required.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `name` | String | The name, alias, data stream, or wildcard expression to resolve. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `expand_wildcards` | String | Controls how wildcard expressions expand to matching indexes. Multiple values can be combined using commas. Valid values are:<br>• `all` – Expand to open and closed indexes, including hidden ones.<br>• `open` – Expand only to open indexes.<br>• `closed` – Expand only to closed indexes.<br>• `hidden` – Include hidden indexes (must be used with `open`, `closed`, or both).<br>• `none` – Wildcard expressions are not accepted.<br>**Default**: `open`. |

## Example requests

The following sections provide example Resolve API requests.


### Resolve a concrete index


<!-- spec_insert_start
component: example_code
rest: GET /_resolve/index/my-index-001
-->
{% capture step1_rest %}
GET /_resolve/index/my-index-001
{% endcapture %}

{% capture step1_python %}


response = client.indices.resolve_index(
  name = "my-index-001"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Resolve indexes using a wildcard


<!-- spec_insert_start
component: example_code
rest: GET /_resolve/index/my-index-*
-->
{% capture step1_rest %}
GET /_resolve/index/my-index-*
{% endcapture %}

{% capture step1_python %}


response = client.indices.resolve_index(
  name = "my-index-*"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Resolve a data stream or alias

If an alias or data stream named `logs-app` exists, use the following request to resolve it:

<!-- spec_insert_start
component: example_code
rest: GET /_resolve/index/logs-app
-->
{% capture step1_rest %}
GET /_resolve/index/logs-app
{% endcapture %}

{% capture step1_python %}


response = client.indices.resolve_index(
  name = "logs-app"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Resolve hidden indexes using a wildcard in a remote cluster

The following example shows an API request using a wildcard, a remote cluster, and `expand_wildcards` configured to `hidden`:

<!-- spec_insert_start
component: example_code
rest: GET /_resolve/index/my-index-*,remote-cluster:my-index-*?expand_wildcards=hidden
-->
{% capture step1_rest %}
GET /_resolve/index/my-index-*,remote-cluster:my-index-*?expand_wildcards=hidden
{% endcapture %}

{% capture step1_python %}


response = client.indices.resolve_index(
  name = "my-index-*,remote-cluster:my-index-*",
  params = { "expand_wildcards": "hidden" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

```json
{
  "indices": [
    {
      "name": "my-index-001",
      "attributes": [
        "open"
      ]
    }
  ],
  "aliases": [],
  "data_streams": []
}
```

## Response body fields

| Field | Data type | Description |
| :--- | :--- | :--- |
| `indices` | Array | A list of resolved concrete indexes. |
| `aliases` | Array | A list of resolved index aliases. |
| `data_streams` | Array | A list of matched data streams. |

## Required permissions

If you are using the Security plugin, the user running these queries needs to have at least `read` permissions for the resolved index. 
