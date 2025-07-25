---
layout: default
title: OpenSearch sink
parent: Sinks
grand_parent: Pipelines
nav_order: 45
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/sinks/opensearch/
redirect_to: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/sinks/opensearch/
---

# OpenSearch sink

## Overview

You can use the `OpenSearch` sink to send data to an OpenSearch, Amazon OpenSearch Service, or Elasticsearch cluster using the REST client. The following table describes options you can configure for the `OpenSearch` sink.

Option | Required | Type | Description
:--- | :--- | :--- | :---
hosts | Yes | List | List of OpenSearch hosts to write to (for example, `["https://localhost:9200", "https://remote-cluster:9200"]`).
cert | No | String | Path to the security certificate (for example, `"config/root-ca.pem"`) if the cluster uses the OpenSearch security plugin.
username | No | String | Username for HTTP basic authentication.
password | No | String | Password for HTTP basic authentication.
aws_sigv4 | No | Boolean | Default value is false. Whether to use AWS Identity and Access Management (IAM) signing to connect to an Amazon OpenSearch Service domain. For your access key, secret key, and optional session token, Data Prepper uses the default credential chain (environment variables, Java system properties, `~/.aws/credential`, etc.).
aws_region | No | String | The AWS region (for example, `"us-east-1"`) for the domain if you are connecting to Amazon OpenSearch Service.
aws_sts_role_arn | No | String | IAM role that the Sink plugin uses to sign requests to Amazon OpenSearch Service. If this information is not provided, the plugin uses the default credentials.
socket_timeout | No | Integer | The timeout, in milliseconds, waiting for data to return (or the maximum period of inactivity between two consecutive data packets). A timeout value of zero is interpreted as an infinite timeout. If this timeout value is negative or not set, the underlying Apache HttpClient would rely on operating system settings for managing socket timeouts.
connect_timeout | No | Integer | The timeout in milliseconds used when requesting a connection from the connection manager. A timeout value of zero is interpreted as an infinite timeout. If this timeout value is negative or not set, the underlying Apache HttpClient would rely on operating system settings for managing connection timeouts.
insecure | No | Boolean | Whether or not to verify SSL certificates. If set to true, certificate authority (CA) certificate verification is disabled and insecure HTTP requests are sent instead. Default value is `false`.
proxy | No | String | The address of a [forward HTTP proxy server](https://en.wikipedia.org/wiki/Proxy_server). The format is "&lt;host name or IP&gt;:&lt;port&gt;". Examples: "example.com:8100", "http://example.com:8100", "112.112.112.112:8100". Port number cannot be omitted.
index | Conditionally | String | Name of the export index. Applicable and required only when the `index_type` is `custom`.
index_type | No | String | This index type tells the Sink plugin what type of data it is handling. Valid values: `custom`, `trace-analytics-raw`, `trace-analytics-service-map`, `management-disabled`. Default value is `custom`.
template_file | No | String | Path to a JSON [index template]({{site.url}}{{site.baseurl}}/opensearch/index-templates/) file (for example, `/your/local/template-file.json`) if `index_type` is `custom`. See [otel-v1-apm-span-index-template.json](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-plugins/opensearch/src/main/resources/otel-v1-apm-span-index-template.json) for an example.
document_id_field | No | String | The field from the source data to use for the OpenSearch document ID (for example, `"my-field"`) if `index_type` is `custom`.
dlq_file | No | String | The path to your preferred dead letter queue file (for example, `/your/local/dlq-file`). Data Prepper writes to this file when it fails to index a document on the OpenSearch cluster.
bulk_size | No | Integer (long) | The maximum size (in MiB) of bulk requests sent to the OpenSearch cluster. Values below 0 indicate an unlimited size. If a single document exceeds the maximum bulk request size, Data Prepper sends it individually. Default value is 5.
ism_policy_file | No | String | The absolute file path for an ISM (Index State Management) policy JSON file. This policy file is effective only when there is no built-in policy file for the index type. For example, `custom` index type is currently the only one without a built-in policy file, thus it would use the policy file here if it's provided through this parameter. For more information, see [ISM policies]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/).
number_of_shards | No | Integer | The number of primary shards that an index should have on the destination OpenSearch server. This parameter is effective only when `template_file` is either explicitly provided in Sink configuration or built-in. If this parameter is set, it would override the value in index template file. For more information, see [Create index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/).
number_of_replicas | No | Integer | The number of replica shards each primary shard should have on the destination OpenSearch server. For example, if you have 4 primary shards and set number_of_replicas to 3, the index has 12 replica shards. This parameter is effective only when `template_file` is either explicitly provided in Sink configuration or built-in. If this parameter is set, it would override the value in index template file. For more information, see [Create index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/).

<!--- ## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section. --->