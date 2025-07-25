---
layout: default
title: Community ID
parent: Ingest processors
nav_order: 55
canonical_url: https://docs.opensearch.org/latest/ingest-pipelines/processors/community_id/
---

# Community ID processor

The `community_id` processor is used to generate the community ID flow hash for network flow tuples. The community ID flow hash algorithm is defined in the [community ID specification](https://github.com/corelight/community-id-spec). The processor-generated hash value can be used to correlate all related network events so that you can filter the network flow data by the hash value or generate statistics by aggregating on the hash field. The processor supports the TCP, UDP, SCTP, ICMP, and IPv6-ICMP network protocols. The SHA-1 hash algorithm is used to generate the hash value.

The following is the `community_id` processor syntax:

```json
{
  "community_id": {
    "source_ip_field": "source_ip",
    "source_port_field": "source_port",
    "destination_ip_field": "destination_ip",
    "destination_port_field": "destination_port",
    "iana_protocol_number_field": "iana_protocol_number",
    "source_port_field": "source_port",
    "target_field": "community_id"
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `community_id` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`source_ip_field`  | Required  | The name of the field containing the source IP address.  |
`source_port_field`  | Optional  | The name of the field containing the source port address. If the network protocol is TCP, UDP, or SCTP, then the field is required. Otherwise, it is not required.|
`destination_ip_field`  | Required  | The name of the field containing the destination IP address. |
`destination_port_field`  | Optional  | The name of the field containing the destination port address. If the network protocol is TCP, UDP, or SCTP, then the field is required. Otherwise, it is not required. |
`iana_protocol_number`  | Optional  | The name of the field containing the protocol number defined by the Internet Assigned Numbers Authority (IANA). The supported values are 1 (ICMP), 6 (TCP), 17 (UDP), 58 (IPv6-ICMP), and 132 (SCTP). |
`protocol_field`  | Optional  | The name of the field containing the protocol name. If `iana_protocol_number` is not set, then the field is required. Otherwise, it is not required. |
`icmp_type_field`  | Optional  | The name of the field containing the ICMP message type. Required when the protocol is ICMP or IPv6-ICMP. |
`icmp_code_field`  | Optional  | The name of the field containing the ICMP message code. For certain ICMP message types that do not have a code, the field is optional. Otherwise, it is required. |
`seed`  | Optional  | The seed for generating the community ID hash. The value must be between 0 and 65535. |
`target_field`  | Optional  | The name of the field in which to store the community ID hash value. Default target field is `community_id`.  |
`ignore_missing`  | Optional  | Specifies whether the processor should exit quietly if one of the required fields is missing. Default is `false`. |
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running the processor. |
`ignore_failure` | Optional | If set to `true`, then failures are ignored. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline**

The following query creates a pipeline named `community_id_pipeline` that uses the `community_id` processor to generate a hash value for the network flow tuple: 

```json
PUT /_ingest/pipeline/commnity_id_pipeline
{
  "description": "generate hash value for the network flow tuple",
  "processors": [
    {
      "community_id": {
        "source_ip_field": "source_ip",
        "source_port_field": "source_port",
        "destination_ip_field": "destination_ip",
        "destination_port_field": "destination_port",
        "iana_protocol_number_field": "iana_protocol_number",
        "target_field": "community_id"
     }
    }
  ]
}
```
{% include copy-curl.html %}

**Step 2 (Optional): Test the pipeline**

It is recommended that you test your pipeline before ingesting documents.
{: .tip}

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/commnity_id_pipeline/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source": {
        "source_ip": "66.35.250.204",
        "source_port": 80,
        "destination_ip": "128.232.110.120",
        "destination_port": 34855,
        "iana_protocol_number": 6
      }
    }
  ]
}
```
{% include copy-curl.html %}

#### Response

The following example response confirms that the pipeline is working as expected:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "testindex1",
        "_id": "1",
        "_source": {
          "community_id": "1:LQU9qZlK+B5F3KDmev6m5PMibrg=",
          "destination_ip": "128.232.110.120",
          "destination_port": 34855,
          "source_port": 80,
          "iana_protocol_number": 6,
          "source_ip": "66.35.250.204"
        },
        "_ingest": {
          "timestamp": "2024-03-11T02:17:22.329823Z"
        }
      }
    }
  ]
}
```

**Step 3: Ingest a document**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=commnity_id_pipeline
{
  "source_ip": "66.35.250.204",
  "source_port": 80,
  "destination_ip": "128.232.110.120",
  "destination_port": 34855,
  "iana_protocol_number": 6
}
```
{% include copy-curl.html %}

#### Response

The request indexes the document into the `testindex1` index:

```json
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 1,
  "result": "created",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 0,
  "_primary_term": 1
}
```

**Step 4 (Optional): Retrieve the document**

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}
