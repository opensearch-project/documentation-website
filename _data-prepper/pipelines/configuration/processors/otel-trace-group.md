---
layout: default
title: OTel trace group
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# OTel trace group

The `OTel trace group` processor completes missing trace group related fields in the collection of [span](https://github.com/opensearch-project/data-prepper/blob/834f28fdf1df6d42a6666e91e6407474b88e7ec6/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/trace/Span.java) records by looking up the OpenSearch backend. The `OTel trace group` processor identifies the missing trace group information for a `spanId` by looking up the relevant fields in its root `span` stored in OpenSearch.

### OpenSearch

See the following example of a configuration for `OTel trace group` processor when using self-managed OpenSearch:

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

See [OpenSearch security](https://github.com/opensearch-project/data-prepper/blob/834f28fdf1df6d42a6666e91e6407474b88e7ec6/data-prepper-plugins/opensearch/opensearch_security.md#L4) for a more detailed explanation of which OpenSearch credentials and permissions are required and how to configure those credentials for the `OTel trace group` processor.

### Amazon OpenSearch Service

See the following example of a configuration for the `OTel trace group` processor when using Amazon OpenSearch Service:

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

See [OpenSearch Sink Security](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-plugins/opensearch/security.md) for a detailed explanation.

## Configuration

You can configure the Amazon OpenSearch Service with the following options.

| Name | Required | Description | Default value
| -----| ----| -----------| -----|
| `hosts`| Yes | A list of IP addresses of OpenSearch nodes. | Default value | 
| `cert` | No | A certificate authority (CA) certificate that is PEM-encoded. Accepts both .pem or .crt. This enables the client to trust the CA that has signed the certificate that OpenSearch is using. | `null` |
| `aws_sigv4` | Yes | A boolean flag to sign the HTTP request with AWS credentials. Only applies to Amazon OpenSearch Service. See [OpenSearch security](https://github.com/opensearch-project/data-prepper/blob/129524227779ee35a327c27c3098d550d7256df1/data-prepper-plugins/opensearch/security.md) for details. | `false`. |
| `aws_region` | A String that represents the region of Amazon OpenSearch Service domain, for example, `us-west-2`. Only applies to Amazon OpenSearch Service. | `us-east-1` |
| `aws_sts_role_arn`| An identity and access management (IAM) role that the sink plugin assumes to sign the request to the Amazon OpenSearch Service. If not provided, the plugin uses the default credentials. | Default value |
| `aws_sts_header_overrides` | No | A map of header overrides to make when assuming the IAM role for the sink plugin. | <!--- Need default ---> |
| `insecure` | Yes | A boolean flag to turn off SSL certificate verification. If set to `true`, CA certificate verification is turned off and insecure HTTP requests are sent. | `false` |
| `username` | No | A string that contains the username and is used in the [internal users](https://opensearch.org/docs/latest/security/access-control/users-roles/) of your OpenSearch cluster. | `null` |
| `password` | No | A string that contains the password and is used in the [internal users](https://opensearch.org/docs/latest/security/access-control/users-roles/) of your OpenSearch cluster. | `null` |

## Metrics

The following table describes metrics that are common to all processors.

| Metric name | Type | Description |
| ------------- | ---- | -----------|
| `recordsIn` | Counter | Metric representing the ingress of records to a pipeline component. |
| `recordsOut` | Counter | Metric representing the egress of records from a pipeline component. |
| `timeElapsed` | Timer | Metric representing the time elapsed during execution of a pipeline component. | 

The `otel_trace_group` processor includes the following custom counter metrics.

| Metric name | Type | Description |
| ------------- | -----------|
| `recordsInMissingTraceGroup` | Counter | The number of ingress records missing trace group fields. |
| `recordsOutFixedTraceGroup` | Counter | The number of egress records with successfully completed trace group fields. |
| `recordsOutMissingTraceGroup` | Counter | The number of egress records missing trace group fields. |