---
layout: default
title: Append
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 10
---

# Append

The append ingest processor enriches incoming data during the ingestion process by appending additonal fields or values to each document. The append processor operates on a per-dcoument basis, meaning it processes each incoming doucment individually. Learn how to use the append processor in your data processing workflows in the following documentation. 

## Getting started

To use the append processor, make sure you have the necessary permissions and access rights to configure and deploy ingest processors. 

## Configuration

The append processor requires the following configuration parameters to specify the field or value to append to incomming documents: 

- **Field name**: Specify the name of the field where the additional data should be appended.
- **Value**: Specify the value to be appended. This can be a static value, a dynamic value derived from existing fields, or a value obtained from external lookups. 

Optional configuration parameters include: 

_<what are the options?>_

## Usage examples

Some usage examples include the following.

#### Example: Appending timestamps

To add a timestamp field to each incoming document, use the following configuration: 

```json
processors:
  - append:
      field: timestamp
      value: "{{_ingest.timestamp}}"
```

In the example, the `timestamp` field is appended with the current timestamp when the document is ingested. The `{{_ingest.timestamp}}` expression retrieves the current timestamp provided by the ingestion framework.

#### Example: Enriching with geolocation data

To enrich documents with geolocation information based on IP addresses, use the following configuration: 

```json
processors:
  - append:
      field: location
      value: "{{geoip.ip}}"
```

In the example, the `location` field is appended with the IP address extracted from the `geoip` field. The `{{geoip.ip}}` expression retrieves the IP address information from the existing `geoip` field. 

## Best practices

- Data validation: Make sure the values being appended are valid and compatible with the target field's data type and format.
- Efficiency: Consider the performance implications of appending large amounts of data to each document and optimize the processor configuration accordingly.
- Error handling: Implement proper error handling mechanisms to handle scenarios where appending fails, such as when external lookups or API requests encounter errors. 