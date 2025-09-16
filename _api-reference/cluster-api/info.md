---
layout: default
title: Cluster information
nav_order: 65
parent: Cluster APIs
has_children: false
---

# Cluster Information API

The Cluster Information API (`/`) retrieves information about the running OpenSearch cluster and node, including version, build details, and cluster name. This is the simplest way to verify that a cluster is reachable and to discover the OpenSearch version.

## Endpoints

```json
GET /
HEAD /
```

- `GET /` returns a JSON body containing cluster and version details.  
- `HEAD /` returns only an HTTP status (200 if reachable), useful for lightweight health checks.

## Example request

To get the version and build information for the cluster, send the following request:

```json
GET /
```
{% include copy-curl.html %}

## Example response

```json
{
  "name": "opensearch-node1",
  "cluster_name": "opensearch-cluster",
  "cluster_uuid": "sQj1b9cZQICv0b8iYc3y5A",
  "version": {
    "distribution": "opensearch",
    "number": "3.2.0",
    "build_type": "tar",
    "build_hash": "abc123def456",
    "build_date": "2025-06-18T12:34:56.000Z",
    "build_snapshot": false,
    "lucene_version": "9.10.0",
    "minimum_wire_compatibility_version": "7.10.0",
    "minimum_index_compatibility_version": "7.0.0"
  },
  "tagline": "The OpenSearch Project: https://opensearch.org/"
}
```

## Response body fields

Field | Type | Description
:--- | :--- | :---
`name` | String | The name of the node that served the request.
`cluster_name` | String | The name of the cluster.
`cluster_uuid` | String | The universally unique identifier (UUID) of the cluster.
`tagline` | String | The tagline string.
`version` | Object | The object containing version and build metadata.
`version.distribution` | String | The distribution identifier, typically `opensearch`.
`version.number` | String | The OpenSearch version number, for example, `3.2.0`.
`version.build_type` | String | The distribution type.
`version.build_hash` | String | The commit hash the build was created from.
`version.build_date` | String | The build timestamp in ISO 8601 format.
`version.build_snapshot` | Boolean | Whether the build is a snapshot build.
`version.lucene_version` | String | The Lucene version used by this build.
`version.minimum_wire_compatibility_version` | String | The minimum compatible transport protocol version.
`version.minimum_index_compatibility_version` | String | The minimum index version that can be read.
