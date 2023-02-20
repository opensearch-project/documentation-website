---
layout: default
title: OTel trace group processor
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# OTel Trace Group Processor

The `OTel trace group` processor completes missing trace group related fields in the collection of [Span](../../data-prepper-api/src/main/java/org/opensearch/dataprepper/model/trace/Span.java) records by looking up the OpenSearch backend.
This processor t finds the missing trace group information for a `spanId` by looking up the relevant fields in its root `span` stored in OpenSearch, or the Amazon OpenSearch Service backend that the local Data Prepper host ingests into.

## Usage

<!---Need an introduction here,--->

### OpenSearch

<!---Need an introduction here,--->

```
pipeline:
  ...
  processor:
    - otel_trace_group:
        hosts: ["https://localhost:9200"]
        cert: path/to/cert
        username: YOUR_USERNAME_HERE
        password: YOUR_PASSWORD_HERE
```

See [OpenSearch Security](https://github.com/opensearch-project/data-prepper/blob/834f28fdf1df6d42a6666e91e6407474b88e7ec6/data-prepper-plugins/opensearch/opensearch_security.md#L4) for a detailed explanation. <!--- ...explaination of?--->

### Amazon OpenSearch Service

<!--- Needs an introduction.--->

```
pipeline:
  ...
  processor:
    - otel_trace_group:
        hosts: ["https://your-amazon-opensearch-service-endpoint"]
        aws_sigv4: true
        cert: path/to/cert
        insecure: false
```

See [OpenSearch Sink Security](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-plugins/opensearch/security.md) for a detailed explanation <!---...explanation of?--->.

## Configuration

<!---Need an introduction here,--->

- `hosts`: A list of IP addresses of OpenSearch nodes.

- `cert`(optional): CA certificate that is pem encoded. Accepts both .pem or .crt. This enables the client to trust the CA that has signed the certificate that OpenSearch is using.
Default is null.

- `aws_sigv4`: A boolean flag to sign the HTTP request with AWS credentials. Only applies to Amazon OpenSearch Service. See [security](security.md) for details. Default to `false`.

- `aws_region`: A String represents the region of Amazon OpenSearch Service domain, e.g. us-west-2. Only applies to Amazon OpenSearch Service. Defaults to `us-east-1`.

- `aws_sts_role_arn`: An IAM role arn which the sink plugin will assume to sign request to the Amazon OpenSearch Service. If not provided, the plugin uses the default credentials.

- `aws_sts_header_overrides`: An optional map of header overrides to make when assuming the IAM role for the sink plugin.

- `insecure`: A boolean flag to turn off SSL certificate verification. If set to `true`, CA certificate verification are turned off and insecure HTTP requests are sent. Default value is `false`.

- `username`(optional): A string that contains the username and is used in the [internal users](https://opensearch.org/docs/latest/security/access-control/users-roles/) of your OpenSearch cluster. Default value is `null`.

- `password`(optional): A string that contains the password and is used in the [internal users](https://opensearch.org/docs/latest/security/access-control/users-roles/) of your OpenSearch cluster. Default value is `null`.

## Metrics

<!---Need an introduction here.--->

### Counter

The `otel_trace_group` processor introduces the following custom metrics:

- `recordsInMissingTraceGroup`: The number of ingress records missing trace group fields.
- `recordsOutFixedTraceGroup`: The number of egress records with trace group fields filled successfully.
- `recordsOutMissingTraceGroup`: The number of egress records missing trace group fields.

## Developer Guide

This plugin is compatible with Java 8. See the following:

<!--- Java 8, or Java 14? Another plugin mentioned that it was compatible with Java 14.--->

- [CONTRIBUTING](https://github.com/opensearch-project/data-prepper/blob/main/CONTRIBUTING.md) 
- [monitoring](https://github.com/opensearch-project/data-prepper/blob/main/docs/monitoring.md)
