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

To configure an [Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html) sink, specify the domain endpoint as the `hosts` option:

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
:--- | :--- | :--- | :---
hosts | Yes | List | List of OpenSearch hosts to write to (for example, `["https://localhost:9200", "https://remote-cluster:9200"]`).
cert | No | String | Path to the security certificate (for example, `"config/root-ca.pem"`) if the cluster uses the OpenSearch Security plugin.
username | No | String | Username for HTTP basic authentication.
password | No | String | Password for HTTP basic authentication.
aws_sigv4 | No | Boolean | Default value is false. Whether to use AWS Identity and Access Management (IAM) signing to connect to an Amazon OpenSearch Service domain. For your access key, secret key, and optional session token, Data Prepper uses the default credential chain (environment variables, Java system properties, `~/.aws/credential`, etc.).
aws_region | No | String | The AWS region (for example, `"us-east-1"`) for the domain if you are connecting to Amazon OpenSearch Service.
aws_sts_role_arn | No | String | IAM role that the plugin uses to sign requests sent to Amazon OpenSearch Service. If this information is not provided, the plugin uses the default credentials.
[max_retries](#configure-max_retries) | No | Integer | The maximum number of times the OpenSearch sink should try to push data to the OpenSearch server before considering it to be a failure. Defaults to `Integer.MAX_VALUE`. If not provided, the sink will try to push data to the OpenSearch server indefinitely because the default value is high and exponential backoff would increase the waiting time before retry.
socket_timeout | No | Integer | The timeout, in milliseconds, waiting for data to return (or the maximum period of inactivity between two consecutive data packets). A timeout value of zero is interpreted as an infinite timeout. If this timeout value is negative or not set, the underlying Apache HttpClient would rely on operating system settings for managing socket timeouts.
connect_timeout | No | Integer | The timeout in milliseconds used when requesting a connection from the connection manager. A timeout value of zero is interpreted as an infinite timeout. If this timeout value is negative or not set, the underlying Apache HttpClient would rely on operating system settings for managing connection timeouts.
insecure | No | Boolean | Whether or not to verify SSL certificates. If set to true, certificate authority (CA) certificate verification is disabled and insecure HTTP requests are sent instead. Default value is `false`.
proxy | No | String | The address of a [forward HTTP proxy server](https://en.wikipedia.org/wiki/Proxy_server). The format is "&lt;host name or IP&gt;:&lt;port&gt;". Examples: "example.com:8100", "http://example.com:8100", "112.112.112.112:8100". Port number cannot be omitted.
index | Conditionally | String | Name of the export index. Applicable and required only when the `index_type` is `custom`.
index_type | No | String | This index type tells the Sink plugin what type of data it is handling. Valid values: `custom`, `trace-analytics-raw`, `trace-analytics-service-map`, `management-disabled`. Default value is `custom`.
template_type | No | String | Defines what type of OpenSearch template to use. The available options are `v1` and `index-template`. The default value is `v1`, which uses the original OpenSearch templates available at the `_template` API endpoints. The `index-template` option uses composable [index templates]({{site.url}}{{site.baseurl}}/opensearch/index-templates/) which are available through OpenSearch's `_index_template` API. Composable index types offer more flexibility than the default and are necessary when an OpenSearch cluster has already existing index templates. Composable templates are available for all versions of OpenSearch and some later versions of Elasticsearch. When `distribution_version` is set to `es6`, Data Prepper enforces the `template_type` as `v1`.
template_file | No | String | The path to a JSON [index template]({{site.url}}{{site.baseurl}}/opensearch/index-templates/) file such as `/your/local/template-file.json` when `index_type` is set to `custom`.  For an example template file, see [otel-v1-apm-span-index-template.json](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-plugins/opensearch/src/main/resources/otel-v1-apm-span-index-template.json). If you supply a template file it must match the template format specified by the `template_type` parameter.
document_id_field | No | String | The field from the source data to use for the OpenSearch document ID (for example, `"my-field"`) if `index_type` is `custom`.
dlq_file | No | String | The path to your preferred dead letter queue file (for example, `/your/local/dlq-file`). Data Prepper writes to this file when it fails to index a document on the OpenSearch cluster.
dlq | No | N/A | DLQ configurations. See [Dead Letter Queues]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/dlq/) for details. If the `dlq_file` option is also available, the sink will fail.
bulk_size | No | Integer (long) | The maximum size (in MiB) of bulk requests sent to the OpenSearch cluster. Values below 0 indicate an unlimited size. If a single document exceeds the maximum bulk request size, Data Prepper sends it individually. Default value is 5.
ism_policy_file | No | String | The absolute file path for an ISM (Index State Management) policy JSON file. This policy file is effective only when there is no built-in policy file for the index type. For example, `custom` index type is currently the only one without a built-in policy file, thus it would use the policy file here if it's provided through this parameter. For more information, see [ISM policies]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/).
number_of_shards | No | Integer | The number of primary shards that an index should have on the destination OpenSearch server. This parameter is effective only when `template_file` is either explicitly provided in Sink configuration or built-in. If this parameter is set, it would override the value in index template file. For more information, see [Create index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/).
number_of_replicas | No | Integer | The number of replica shards each primary shard should have on the destination OpenSearch server. For example, if you have 4 primary shards and set number_of_replicas to 3, the index has 12 replica shards. This parameter is effective only when `template_file` is either explicitly provided in Sink configuration or built-in. If this parameter is set, it would override the value in index template file. For more information, see [Create index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/).
distribution_version | No | String | Indicates whether the sink backend version is Elasticsearch 6 or later. `es6` represents Elasticsearch 6. `default` represents the latest compatible backend version, such as Elasticsearch 7.x, OpenSearch 1.x, or OpenSearch 2.x. Default is `default`.
enable_request_compression | No | Boolean | Whether to enable compression when sending requests to OpenSearch. When `distribution_version` is set to `es6`, default is `false`. For all other distribution versions, default is `true`.  

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

For instructions on how to map users to roles, see [Map users to roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/#map-users-to-roles).

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
      aws_sigv4: false
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
