---
layout: default
title: opensearch 
parent: Sinks
grand_parent: Pipelines
nav_order: 50
---

# opensearch

You can use the `opensearch` sink plugin to send data to an OpenSearch cluster, a legacy Elasticsearch cluster, or an Amazon OpenSearch Service domain.

The plugin supports OpenSearch 1.0 and later and Elasticsearch 7.3 and later.

## Usage

To configure an `opensearch` sink, specify the `opensearch` option within the pipeline configuration:

```yaml
pipeline:
  ...
  sink:
    opensearch:
      hosts: ["https://localhost:9200"]
      cert: path/to/cert
      username: YOUR_USERNAME
      password: YOUR_PASSWORD
      index_type: trace-analytics-raw
      dlq_file: /your/local/dlq-file
      max_retries: 20
      bulk_size: 4
```

To configure an [Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html) sink, specify the domain endpoint as the `hosts` option, as shown in the following example:

```yaml
pipeline:
  ...
  sink:
    opensearch:
      hosts: ["https://your-amazon-opensearch-service-endpoint"]
      aws_sigv4: true
      cert: path/to/cert
      insecure: false
      index_type: trace-analytics-service-map
      bulk_size: 4
```

## Configuration options

The following table describes options you can configure for the `opensearch` sink.

Option | Required | Type | Description
:--- | :--- |:---| :---
`hosts` | Yes | List | A list of OpenSearch hosts to write to, such as `["https://localhost:9200", "https://remote-cluster:9200"]`.
`cert` | No | String | The path to the security certificate. For example, `"config/root-ca.pem"` if the cluster uses the OpenSearch Security plugin.
`username` | No | String  | The username for HTTP basic authentication.
`password` | No | String | The password for HTTP basic authentication.
`aws` | No | AWS  | The [AWS](#aws) configuration. 
[max_retries](#configure-max_retries) | No | Integer | The maximum number of times that the `opensearch` sink should try to push data to the OpenSearch server before considering it to be a failure. Defaults to `Integer.MAX_VALUE`. When not provided, the sink will try to push data to the OpenSearch server indefinitely and exponential backoff will increase the waiting time before a retry.
`aws_sigv4` | No | Boolean | **Deprecated in Data Prepper 2.7.** Default is `false`. Whether to use AWS Identity and Access Management (IAM) signing to connect to an Amazon OpenSearch Service domain. For your access key, secret key, and optional session token, OpenSearch Data Prepper uses the default credential chain (environment variables, Java system properties, `~/.aws/credential`). 
`aws_region` | No | String | **Deprecated in Data Prepper 2.7.** The AWS Region (for example, `"us-east-1"`) for the domain when you are connecting to Amazon OpenSearch Service.
`aws_sts_role_arn` | No | String | **Deprecated in Data Prepper 2.7.** The IAM role that the plugin uses to sign requests sent to Amazon OpenSearch Service. If this information is not provided, then the plugin uses the default credentials.
`socket_timeout` | No | Integer | The timeout value, in milliseconds, when waiting for data to be returned (the maximum period of inactivity between two consecutive data packets). A timeout value of `0` is interpreted as an infinite timeout. If this timeout value is negative or not set, then the underlying Apache HttpClient will rely on operating system settings to manage socket timeouts.
`connect_timeout` | No | Integer| The timeout value, in milliseconds, when requesting a connection from the connection manager. A timeout value of `0` is interpreted as an infinite timeout. If this timeout value is negative or not set, the underlying Apache HttpClient will rely on operating system settings to manage connection timeouts.
`insecure` | No | Boolean  | Whether or not to verify SSL certificates. If set to `true`, then certificate authority (CA) certificate verification is disabled and insecure HTTP requests are sent instead. Default is `false`.
`proxy` | No | String | The address of the [forward HTTP proxy server](https://en.wikipedia.org/wiki/Proxy_server). The format is `"&lt;hostname or IP&gt;:&lt;port&gt;"` (for example, `"example.com:8100"`, `"http://example.com:8100"`, `"112.112.112.112:8100"`). The port number cannot be omitted.
`index` | Conditionally | String | The name of the export index. Only required when the `index_type` is `custom`. The index can be a plain string, such as `my-index-name`, contain [Java date-time patterns](https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html), such as `my-index-%{yyyy.MM.dd}` or `my-%{yyyy-MM-dd-HH}-index`, be formatted using field values, such as `my-index-${/my_field}`, or use [Data Prepper expressions]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/), such as `my-index-${getMetadata(\"my_metadata_field\"}`. All formatting options can be combined to provide flexibility when creating static, dynamic, and rolling indexes. 
`index_type` | No | String | Specifies the type of data the sink plugin handles. Valid values include `custom`, `trace-analytics-raw`, `trace-analytics-plain-raw`, `trace-analytics-service-map`, `log-analytics`, `log-analytics-plain`, `metric-analytics`, `metric-analytics-plain`, and `management-disabled`. <br><br>To produce Amazon Security Lake–compliant data from the `otel_logs_source` with `output_format: otel`, set `index_type` to `log-analytics-plain`. <br>For `otel_metrics_source` with `output_format: otel`, set `index_type` to `metric-analytics-plain`. <br>For `otel_trace_source` with `output_format: otel`, set `index_type` to `trace-analytics-plain-raw`. <br><br>Default is `custom`.


`template_type` | No | String | Defines what type of OpenSearch template to use. Available options are `v1` and `index-template`. The default value is `v1`, which uses the original OpenSearch templates available at the `_template` API endpoints. The `index-template` option uses composable [index templates]({{site.url}}{{site.baseurl}}/opensearch/index-templates/), which are available through the OpenSearch `_index_template` API. Composable index types offer more flexibility than the default and are necessary when an OpenSearch cluster contains existing index templates. Composable templates are available for all versions of OpenSearch and some later versions of Elasticsearch. When `distribution_version` is set to `es6`, Data Prepper enforces the `template_type` as `v1`.
`template_file` | No | String | The path to a JSON [index template]({{site.url}}{{site.baseurl}}/opensearch/index-templates/) file, such as `/your/local/template-file.json`, when `index_type` is set to `custom`. For an example template file, see [otel-v1-apm-span-index-template.json](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-plugins/opensearch/src/main/resources/otel-v1-apm-span-index-template.json). If you supply a template file, then it must match the template format specified by the `template_type` parameter.
`template_content` | No | JSON | Contains all the inline JSON found inside of the index  [index template]({{site.url}}{{site.baseurl}}/opensearch/index-templates/). For an example of template content, see [the example template content](#example_template_content).
`document_id_field` | No | String | **Deprecated in Data Prepper 2.7 in favor of `document_id`.** The field from the source data to use for the OpenSearch document ID (for example, `"my-field"`) if `index_type` is `custom`.
`document_id` | No | String | A format string to use as the `_id` in OpenSearch documents. To specify a single field in an event, use `${/my_field}`. You can also use Data Prepper expressions to construct the `document_id`, for example, `${getMetadata(\"some_metadata_key\")}`. These options can be combined into more complex formats, such as `${/my_field}-test-${getMetadata(\"some_metadata_key\")}`. 
`document_version` | No | String  |  A format string to use as the `_version` in OpenSearch documents. To specify a single field in an event, use `${/my_field}`. You can also use Data Prepper expressions to construct the `document_version`, for example, `${getMetadata(\"some_metadata_key\")}`. These options can be combined into more complex versions, such as `${/my_field}${getMetadata(\"some_metadata_key\")}`. The `document_version` format must evaluate to a long type and can only be used when `document_version_type` is set to either `external` or `external_gte`.
`document_version_type` | No | String  | The document version type for index operations. Must be one of `external`, `external_gte`, or `internal`. If set to `external` or `external_gte`, then `document_version` is required.
`dlq_file` | No | String | The path to your preferred dead letter queue file (such as `/your/local/dlq-file`). Data Prepper writes to this file when it fails to index a document on the OpenSearch cluster.
`dlq` | No | N/A | [DLQ configurations]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/dlq/). 
`bulk_size` | No | Integer (long) | The maximum size (in MiB) of bulk requests sent to the OpenSearch cluster. Values below `0` indicate an unlimited size. If a single document exceeds the maximum bulk request size, then Data Prepper sends each request individually. Default value is `5`.
`ism_policy_file` | No | String | The absolute file path for an Index State Management (ISM) policy JSON file. This policy file is effective only when there is no built-in policy file for the index type. For example, the `custom` index type is currently the only type without a built-in policy file, so it will use this policy file if it is provided through this parameter. For more information about the policy JSON file, see [ISM policies]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/).
`number_of_shards` | No | Integer  | The number of primary shards that an index should have on the destination OpenSearch server. This parameter is effective only when `template_file` is either explicitly provided in the sink configuration or built in. If this parameter is set, then it will override the value in the index template file. For more information, see [Create index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/).
`number_of_replicas` | No | Integer | The number of replica shards that each primary shard should have on the destination OpenSearch server. For example, if you have 4 primary shards and set `number_of_replicas` to `3`, then the index has 12 replica shards. This parameter is effective only when `template_file` is either explicitly provided in the sink configuration or built in. If this parameter is set, then it will override the value in the index template file. For more information, see [Create index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/).
`distribution_version` | No | String  | Indicates whether the backend version of the sink is Elasticsearch 6 or later. `es6` represents Elasticsearch 6. `default` represents the latest compatible backend version, such as Elasticsearch 7.x, OpenSearch 1.x, or OpenSearch 2.x. Default is `default`.
`enable_request_compression` | No | Boolean | Whether to enable compression when sending requests to OpenSearch. When `distribution_version` is set to `es6`, default is `false`. For all other distribution versions, default is `true`.
`action` | No | String | The OpenSearch bulk action to use for documents. Must be one of `create`, `index`, `update`, `upsert`, or `delete`. Default is `index`.
`actions` | No | List | A [list of actions](#actions) that can be used as an alternative to `action`, which reads as a switch case statement that conditionally determines the bulk action to take for an event. 
`flush_timeout` | No | Long | A long class that contains the amount of time, in milliseconds, to try packing a bulk request up to the `bulk_size` before flushing the request. If this timeout expires before a bulk request has reached the `bulk_size`, the request will be flushed. Set to `-1` to disable the flush timeout and instead flush whatever is present at the end of each batch. Default is `60,000`, or 1 minute.
`normalize_index` | No | Boolean | If true, then the OpenSearch sink will try to create dynamic index names. Index names with format options specified in `${})` are valid according to the [index naming restrictions]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/#index-naming-restrictions). Any invalid characters will be removed. Default value is `false`.
`routing` | No | String | A string used as a hash for generating the `shard_id` for a document when it is stored in OpenSearch. Each incoming record is searched. When present, the string is used as the routing field for the document. When not present, the default routing mechanism (`document_id`) is used by OpenSearch when storing the document. Supports formatting with fields in events and [Data Prepper expressions]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/), such as `${/my_field}-test-${getMetadata(\"some_metadata_key\")}`.
`document_root_key` | No | String  | The key in the event that will be used as the root in the document. The default is the root of the event. If the key does not exist, then the entire event is written as the document. If `document_root_key` is of a basic value type, such as a string or integer, then the document will have a structure of `{"data": <value of the document_root_key>}`.
`serverless` | No | Boolean | **Deprecated in Data Prepper 2.7. Use this option with the `aws` configuration instead.** Determines whether the OpenSearch backend is Amazon OpenSearch Serverless. Set this value to `true` when the destination for the `opensearch` sink is an Amazon OpenSearch Serverless collection. Default is `false`.
`serverless_options` | No | Object | **Deprecated in Data Prepper 2.7. Use this option with the `aws` configuration instead.** The network configuration options available when the backend of the `opensearch` sink is set to Amazon OpenSearch Serverless. For more information, see [Serverless options](#serverless-options).


## aws

Option | Required | Type | Description
:--- | :--- | :--- | :---
`region` | No | String | The AWS Region to use for credentials. Defaults to [standard SDK behavior to determine the Region](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html).
`sts_role_arn` | No | String | The AWS Security Token Service (AWS STS) role to assume for requests to Amazon SQS and Amazon S3. Defaults to `null`, which will use [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html).
`sts_header_overrides` | No | Map | A map of header overrides that the IAM role assumes for the sink plugin.
`sts_external_id` | No | String | The external ID to attach to AssumeRole requests from AWS STS.
`serverless` | No | Boolean | Determines whether the OpenSearch backend is Amazon OpenSearch Serverless. Set this value to `true` when the destination for the `opensearch` sink is an Amazon OpenSearch Serverless collection. Default is `false`.
`serverless_options` | No | Object | The network configuration options available when the backend of the `opensearch` sink is set to Amazon OpenSearch Serverless. For more information, see [Serverless options](#serverless-options).

<!-- vale off -->
## actions
<!-- vale on -->

The following options can be used inside the `actions` option.

Option | Required | Type | Description
:--- |:---| :--- | :---
`type` | Yes | String | The type of bulk action to use if the `when` condition evaluates to true. Must be either `create`, `index`, `update`, `upsert`, or `delete`.
`when` | No | String | A [Data Prepper expression]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/) that conditionally evaluates whether an event will be sent to OpenSearch using the bulk action configured in `type`. When empty, the bulk action will be chosen automatically when the event is sent to OpenSearch.


## Serverless options

The following options can be used in the `serverless_options` object.

Option | Required | Type | Description
:--- | :--- | :---| :---
`network_policy_name` | Yes | String | The name of the network policy to create.
`collection_name` | Yes | String | The name of the Amazon OpenSearch Serverless collection to configure.
`vpce_id` | Yes | String | The virtual private cloud (VPC) endpoint to which the source connects.

### Configure max_retries

You can include the `max_retries` option in your pipeline configuration to control the number of times the source tries to write to sinks with exponential backoff. If you don't include this option, pipelines keep retrying forever. 

If you specify `max_retries` and a pipeline has a [dead-letter queue (DLQ)]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/dlq/) configured, the pipeline will keep trying to write to sinks until it reaches the maximum number of retries, at which point it starts to send failed data to the DLQ.

If you don't specify `max_retries`, only data that is rejected by sinks is written to the DLQ. Pipelines continue to try to write all other data to the sinks.

## OpenSearch cluster security

In order to send data to an OpenSearch cluster using the `opensearch` sink plugin, you must specify your username and password within the pipeline configuration. The following example `pipelines.yaml` file demonstrates how to specify admin security credentials:

```yaml
sink:
  - opensearch:
      username: "admin"
      password: "admin"
      ...
```

Alternately, rather than admin credentials, you can specify the credentials of a user mapped to a role with the minimum permissions listed in the following sections.

### Cluster permissions

- `cluster_all`
- `indices:admin/template/get`
- `indices:admin/template/put`

### Index permissions

- Index: `otel-v1*`; Index permission: `indices_all`
- Index: `.opendistro-ism-config`; Index permission: `indices_all`
- Index: `*`; Index permission: `manage_aliases`

For instructions on how to map users to roles, see [Map users to roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/#mapping-users-to-roles).

## Amazon OpenSearch Service domain security

The `opensearch` sink plugin can send data to an [Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html) domain, which uses IAM for security. The plugin uses the default credential chain. Run `aws configure` using the [AWS Command Line Interface (AWS CLI)](https://aws.amazon.com/cli/) to set your credentials.

Make sure the credentials that you configure have the required IAM permissions. The following domain access policy demonstrates the minimum required permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::<AccountId>:user/data-prepper-user"
      },
      "Action": "es:ESHttp*",
      "Resource": [
        "arn:aws:es:us-east-1:<AccountId>:domain/<domain-name>/otel-v1*",
        "arn:aws:es:us-east-1:<AccountId>:domain/<domain-name>/_template/otel-v1*",
        "arn:aws:es:us-east-1:<AccountId>:domain/<domain-name>/_plugins/_ism/policies/raw-span-policy",
        "arn:aws:es:us-east-1:<AccountId>:domain/<domain-name>/_alias/otel-v1*",
        "arn:aws:es:us-east-1:<AccountId>:domain/<domain-name>/_alias/_bulk"
      ]
    },
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::<AccountId>:user/data-prepper-user"
      },
      "Action": "es:ESHttpGet",
      "Resource": "arn:aws:es:us-east-1:<AccountId>:domain/<domain-name>/_cluster/settings"
    }
  ]
}
```

For instructions on how to configure the domain access policy, see [Resource-based policies
](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ac.html#ac-types-resource) in the Amazon OpenSearch Service documentation.

### Fine-grained access control

If your OpenSearch Service domain uses [fine-grained access control](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/fgac.html), the `opensearch` sink plugin requires some additional configuration.

#### IAM ARN as master user

If you're using an IAM Amazon Resource Name (ARN) as the master user, include the `aws_sigv4` option in your sink configuration:

```yaml
...
sink:
    opensearch:
      hosts: ["https://your-fgac-amazon-opensearch-service-endpoint"]
      aws_sigv4: true
```

Run `aws configure` using the AWS CLI to use the master IAM user credentials. If you don't want to use the master user, you can specify a different IAM role using the `aws_sts_role_arn` option. The plugin will then use this role to sign requests sent to the domain sink. The ARN that you specify must be included in the [domain access policy]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/opensearch/#amazon-opensearch-service-domain-security).

#### Master user in the internal user database

If your domain uses a master user in the internal user database, specify the master username and password as well as the `aws_sigv4` option:

```yaml
sink:
    opensearch:
      hosts: ["https://your-fgac-amazon-opensearch-service-endpoint"]
      username: "master-username"
      password: "master-password"
```

For more information, see [Recommended configurations](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/fgac.html#fgac-recommendations) in the Amazon OpenSearch Service documentation.

***Note***: You can create a new IAM role or internal user database user with the `all_access` permission and use it instead of the master user.

## OpenSearch Serverless collection security

The `opensearch` sink plugin can send data to an [Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless.html) collection.

OpenSearch Serverless collection sinks have the following limitations:

- You can't write to a collection that uses virtual private cloud (VPC) access. The collection must be accessible from public networks.
- The OTel trace group processor doesn't currently support collection sinks.

### Creating a pipeline role

First, create an IAM role that the pipeline will assume in order to write to the collection. The role must have the following minimum permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "aoss:BatchGetCollection"
            ],
            "Resource": "*"
        }
    ]
}
```

The role must have the following trust relationship, which allows the pipeline to assume it:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::<AccountId>:root"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```

### Creating a collection

Next, create a collection with the following settings:

- Public [network access](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-network.html) to both the OpenSearch endpoint and OpenSearch Dashboards.
- The following [data access policy](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-data-access.html), which grants the required permissions to the pipeline role:

  ```json
  [
   {
      "Rules":[
         {
            "Resource":[
               "index/collection-name/*"
            ],
            "Permission":[
               "aoss:CreateIndex",
               "aoss:UpdateIndex",
               "aoss:DescribeIndex",
               "aoss:WriteDocument"
            ],
            "ResourceType":"index"
         }
      ],
      "Principal":[
         "arn:aws:iam::<AccountId>:role/PipelineRole"
      ],
      "Description":"Pipeline role access"
   }
  ]
  ```

  ***Important***: Make sure to replace the ARN in the `Principal` element with the ARN of the pipeline role that you created in the preceding step.

  For instructions on how to create collections, see [Creating collections](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-manage.html#serverless-create) in the Amazon OpenSearch Service documentation.

### Creating a pipeline

Within your `pipelines.yaml` file, specify the OpenSearch Serverless collection endpoint as the `hosts` option. In addition, you must set the `serverless` option to `true`. Specify the pipeline role in the `sts_role_arn` option:

```yaml
log-pipeline:
  source:
    http:
  processor:
    - date:
        from_time_received: true
        destination: "@timestamp"
  sink:
    - opensearch:
        hosts: [ "https://<serverless-public-collection-endpoint>" ]
        index: "my-serverless-index"
        aws:
          serverless: true
          sts_role_arn: "arn:aws:iam::<AccountId>:role/PipelineRole"
          region: "us-east-1"
```

### Example with template_content and actions <a id="example_template_content"></a>

The following example pipeline contains both `template_content` and a list of conditional `actions`:

```yaml
log-pipeline:
  source:
    http:
  processor:
    - date:
        from_time_received: true
        destination: "@timestamp"
  sink:
    - opensearch:
        hosts: [ "https://<serverless-public-collection-endpoint>" ]
        index: "my-serverless-index"
        template_type: index-template
        template_content: >
          {
            "template" : {
              "mappings" : {
                "properties" : {
                  "Data" : {
                    "type" : "binary"
                  },
                  "EncodedColors" : {
                    "type" : "binary"
                  },
                  "Type" : {
                    "type" : "keyword"
                  },
                  "LargeDouble" : {
                    "type" : "double"
                  }          
                }
              }
            }
          }
        # index is the default case  
        actions:
         - type: "delete"
           when: '/operation == "delete"'
         - type: "update"
           when: '/operation == "update"'
         - type: "index"
        aws:
          sts_role_arn: "arn:aws:iam::<AccountId>:role/PipelineRole"
          region: "us-east-1"
```
