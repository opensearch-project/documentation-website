---
layout: default
title: OTel trace group
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# OTel trace group processor

The OTel trace group processor completes missing trace group related fields in the collection of [span](https://github.com/opensearch-project/data-prepper/blob/834f28fdf1df6d42a6666e91e6407474b88e7ec6/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/trace/Span.java) records by looking up the OpenSearch backend. The OTel trace group processor identifies the missing trace group information for a `spanId` by looking up the relevant fields in its root `span` stored in OpenSearch.

## OpenSearch

See the following example `YAML` configuration file for the OTel trace group processor when you connect to an OpenSearch cluster using your username and password:

``` YAML
pipeline:
  ...
  processor:
    - otel_trace_group:
        hosts: ["https://localhost:9200"]
        cert: path/to/cert
        username: YOUR_USERNAME_HERE
        password: YOUR_PASSWORD_HERE
```

See [OpenSearch security](https://github.com/opensearch-project/data-prepper/blob/834f28fdf1df6d42a6666e91e6407474b88e7ec6/data-prepper-plugins/opensearch/opensearch_security.md#L4) for a more detailed explanation of which OpenSearch credentials and permissions are required and how to configure those credentials for the OTel trace group processor.

### Amazon OpenSearch Service

See the following example `YAML` configuration file for the OTel trace group processor when you use the Amazon OpenSearch Service:

``` YAML
pipeline:
  ...
  processor:
    - otel_trace_group:
        hosts: ["https://your-amazon-opensearch-service-endpoint"]
        aws_sigv4: true
        cert: path/to/cert
        insecure: false
```

## Configuration

You can configure the OTel trace group processor with the following options.

| Name | Required | Description | Default value
| -----| ----| -----------| -----|
| `hosts`| Yes | A list of IP addresses of OpenSearch nodes. | Default value | 
| `cert` | No | A certificate authority (CA) certificate that is PEM-encoded. Accepts both .pem or .crt. This enables the client to trust the CA that has signed the certificate that OpenSearch is using. | `null` |
| `aws_sigv4` | No | A boolean flag to sign the HTTP request with AWS credentials. Only applies to Amazon OpenSearch Service. See [OpenSearch security](https://github.com/opensearch-project/data-prepper/blob/129524227779ee35a327c27c3098d550d7256df1/data-prepper-plugins/opensearch/security.md) for details. | `false`. |
| `aws_region` | No | A String that represents the region of Amazon OpenSearch Service domain, for example, `us-west-2`. Only applies to Amazon OpenSearch Service. | `us-east-1` |
| `aws_sts_role_arn`| No | An identity and access management (IAM) role that the sink plugin assumes to sign the request to the Amazon OpenSearch Service. If not provided, the plugin uses the (Default credentials)[https://sdk.amazonaws.com/java/api/latest/software/amazon/awssdk/auth/credentials/DefaultCredentialsProvider.html]. | `null` |
| `aws_sts_header_overrides` | No | A map of header overrides to make when assuming the IAM role for the sink plugin. | `null` |
| `insecure` | No | A boolean flag to turn off SSL certificate verification. If set to `true`, CA certificate verification is turned off and insecure HTTP requests are sent. | `false` |
| `username` | No | A string that contains the username and is used in the [internal users](https://opensearch.org/docs/latest/security/access-control/users-roles/) of your OpenSearch cluster. | `null` |
| `password` | No | A string that contains the password and is used in the [internal users](https://opensearch.org/docs/latest/security/access-control/users-roles/) of your OpenSearch cluster. | `null` |

## Configuration option examples

You can define the configuration option values in the `aws_sts_header_overrides` option. See the following example.

```
aws_sts_header_overrides:
  x-my-custom-header-1: my-custom-value-1
  x-my-custom-header-2: my-custom-value-2
```

## Metrics

The following table describes both metrics common to all processors as well as metrics specific to the `otel_trace_group` processor.

| Metric name | Type | Description | Metric type |
| ------------- | ---- | -----------| --- | 
| `recordsIn` | Counter | Metric representing the ingress of records to a pipeline component. | Common |
| `recordsOut` | Counter | Metric representing the egress of records from a pipeline component. | Common | 
| `timeElapsed` | Timer | Metric representing the time elapsed during execution of a pipeline component. | Common |
| `recordsInMissingTraceGroup` | Counter | The number of ingress records missing trace group fields. | Custom |
| `recordsOutFixedTraceGroup` | Counter | The number of egress records with successfully completed trace group fields. | Custom |
| `recordsOutMissingTraceGroup` | Counter | The number of egress records missing trace group fields. | Custom |