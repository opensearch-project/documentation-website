---
layout: default
title: opensearch
parent: Sources
grand_parent: Pipelines
nav_order: 30
---

# opensearch

The `opensearch` source plugin is used to read indexes from an OpenSearch cluster, a legacy Elasticsearch cluster, an Amazon OpenSearch Service domain, or an Amazon OpenSearch Serverless collection.

The plugin supports OpenSearch 2.x and Elasticsearch 7.x.

## Usage

To use the `opensearch` source with the minimum required settings, add the following configuration to your `pipeline.yaml` file:

```yaml
opensearch-source-pipeline:
 source:
  opensearch:
    hosts: [ "https://localhost:9200" ]
    username: "username"
    password: "password"
 ...
```

To use the `opensearch` source with all configuration settings, including `indices`, `scheduling`, `search_options`, and `connection`, add the following example to your `pipeline.yaml` file:

```yaml
opensearch-source-pipeline:
  source:
    opensearch:
      hosts: [ "https://localhost:9200" ]
      username: "username"
      password: "password"
      indices:
        include:
          - index_name_regex: "test-index-.*"
        exclude:
          - index_name_regex: "\..*"
      scheduling:
        interval: "PT1H"
        index_read_count: 2
        start_time: "2023-06-02T22:01:30.00Z"
      search_options:
        search_context_type: "none"
        batch_size: 1000
      connection:
        insecure: false
        cert: "/path/to/cert.crt"
  ...
```

## Amazon OpenSearch Service

The `opensearch` source can be configured for an Amazon OpenSearch Service domain by passing an `sts_role_arn` with access to the domain, as shown in the following example:

```yaml
opensearch-source-pipeline:
  source:
    opensearch:
      hosts: [ "https://search-my-domain-soopywaovobopgs8ywurr3utsu.us-east-1.es.amazonaws.com" ]
      aws:
        region: "us-east-1"
        sts_role_arn: "arn:aws:iam::123456789012:role/my-domain-role"
  ...
```

## Using metadata

When the `opensource` source constructs Data Prepper events from documents in the cluster, the document index is stored in the EventMetadata with an `opensearch-index` key, and the document_id is stored in the `EventMetadata` with the `opensearch-document_id` as the key. This allows for conditional routing based on the index or `document_id`. The following example pipeline configuration sends events to an `opensearch` sink and uses the same index and `document_id` from the source cluster as in the destination cluster:


```yaml
opensearch-migration-pipeline:
  source:
    opensearch:
      hosts: [ "https://source-cluster:9200" ]
      username: "username"
      password: "password"
  sink:
    - opensearch:
        hosts: [ "https://sink-cluster:9200" ]
        username: "username"
        password: "password"
        document_id: "${getMetadata(\"opensearch-document_id\")}"
        index: "${getMetadata(\"opensearch-index\"}"
```

## Configuration options


The following table describes options you can configure for the `opensearch` source.

Option | Required | Type    | Description
:--- | :--- |:--------| :---
`hosts` | Yes | List    | A list of OpenSearch hosts to write to, for example, `["https://localhost:9200", "https://remote-cluster:9200"]`.
`username` | No | String  | The username for HTTP basic authentication. Since Data Prepper 2.5, this setting can be refreshed at runtime if [AWS secrets reference]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/configuring-data-prepper/#reference-secrets) is applied.
`password` | No | String  | The password for HTTP basic authentication. Since Data Prepper 2.5, this setting can be refreshed at runtime if [AWS secrets reference]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/configuring-data-prepper/#reference-secrets) is applied.
`disable_authentication` | No | Boolean | Whether authentication is disabled. Defaults to `false`.
`aws` | No | Object  | The AWS configuration. For more information, see [aws](#aws).
`acknowledgments` | No | Boolean | When `true`, enables the `opensearch` source to receive [end-to-end acknowledgments]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines/#end-to-end-acknowledgments) when events are received by OpenSearch sinks. Default is `false`.
`connection` | No | Object  | The connection configuration. For more information, see [Connection](#connection).
`indices` | No | Object | The configuration for filtering which indexes are processed. Defaults to all indexes, including system indexes. For more information, see [indexes](#indices).
`scheduling` | No | Object | The scheduling configuration. For more information, see [Scheduling](#scheduling).
`search_options` | No | Object | A list of search options performed by the source. For more information, see [Search options](#search_options).

### Scheduling

The `scheduling` configuration allows the user to configure how indexes are reprocessed in the source based on the the `index_read_count` and recount time `interval`.

For example, setting `index_read_count` to `3` with an `interval` of `1h` will result in all indexes being reprocessed 3 times, 1 hour apart. By default, indexes will only be processed once.

Use the following options under the `scheduling` configuration.

Option | Required | Type            | Description
:--- | :--- |:----------------| :---
`index_read_count` | No | Integer | The number of times each index will be processed. Default is `1`.
`interval` | No | String | The interval that determines the amount of time between reprocessing. Supports ISO 8601 notation strings, such as "PT20.345S" or "PT15M", as well as simple notation strings for seconds ("60s") and milliseconds ("1500ms"). Defaults to `8h`.
`start_time` | No | String | The time when processing should begin. The source will not start processing until this time. The string must be in ISO 8601 format, such as `2007-12-03T10:15:30.00Z`. The default option starts processing immediately.


### indices

The following options help the `opensearch` source determine which indexes are processed from the source cluster using regex patterns. An index will only be processed if it matches one of the `index_name_regex` patterns under the `include` setting and does not match any of the
patterns under the `exclude` setting.

Option | Required | Type  | Description
:--- | :--- |:-----------------| :---
`include` | No | Array of objects | A list of index configuration patterns that specifies which indexes will be processed.
`exclude` | No | Array of Objects | A list of index configuration patterns that specifies which indexes will not be processed. For example, you can specify an `index_name_regex` pattern of `\..*` to exclude system indexes.


Use the following setting under the `include` and `exclude` options to indicate the regex pattern for the index.

Option | Required | Type    | Description
:--- |:----|:-----------------| :---
`index_name_regex` | Yes | Regex string | The regex pattern to match indexes against.

### search_options

Use the following settings under the `search_options` configuration.

Option | Required | Type    | Description
:--- |:---------|:--------| :---
`batch_size` | No       | Integer | The number of documents to read while paginating from OpenSearch. Default is `1000`.
`search_context_type` | No | Enum | An override for the type of search/pagination to use on indexes. Can be [point_in_time]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/#point-in-time-with-search_after)), [scroll]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/#scroll-search), or `none`. The `none` option will use the [search_after]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/#the-search_after-parameter) parameter. For more information, see [Default Search Behavior](#default-search-behavior).

### Default search behavior

By default, the `opensearch` source will look up the cluster version and distribution to determine
which `search_context_type` to use. For versions and distributions that support [Point in Time](https://opensearch.org/docs/latest/search-plugins/searching-data/paginate/#point-in-time-with-search_after), `point_in_time` will be used.
If `point_in_time` is not supported by the cluster, then [scroll](https://opensearch.org/docs/latest/search-plugins/searching-data/paginate/#scroll-search) will be used. For Amazon OpenSearch Serverless collections, [search_after](https://opensearch.org/docs/latest/search-plugins/searching-data/paginate/#the-search_after-parameter) will be used because neither `point_in_time` nor `scroll` are supported by collections.

### Connection

Use the following settings under the `connection` configuration.

Option | Required | Type    | Description
:--- | :--- |:--------| :---
`cert` | No | String  | The path to the security certificate, for example, `"config/root-ca.pem"`, when the cluster uses the OpenSearch Security plugin.
`insecure` | No | Boolean | Whether or not to verify SSL certificates. If set to `true`, the certificate authority (CA) certificate verification is disabled and insecure HTTP requests are sent. Default is `false`.


### AWS

Use the following options when setting up authentication for `aws` services.

Option | Required | Type    | Description
:--- | :--- |:--------| :---
`region` | No | String  | The AWS Region to use for credentials. Defaults to [standard SDK behavior to determine the Region](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html).
`sts_role_arn` | No | String  | The AWS Security Token Service (AWS STS) role to assume for requests to Amazon OpenSearch Service and Amazon OpenSearch Serverless. Default is `null`, which will use the [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html).
`serverless` | No | Boolean | Should be set to `true` when processing from an Amazon OpenSearch Serverless collection. Defaults to `false`.


## OpenSearch cluster security

In order to pull data from an OpenSearch cluster using the `opensearch` source plugin, you must specify your username and password within the pipeline configuration. The following example `pipeline.yaml` file demonstrates how to specify the default admin security credentials:

```yaml
source:
  opensearch:
    username: "admin"
    password: "admin"
  ...
```

### Amazon OpenSearch Service domain security

The `opensearch` source plugin can pull data from an [Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html) domain, which uses AWS Identity and Access Management (IAM) for security. The plugin uses the default Amazon OpenSearch Service credential chain. Run `aws configure` using the [AWS Command Line Interface (AWS CLI)](https://aws.amazon.com/cli/) to set your credentials.

Make sure the credentials that you configure have the required IAM permissions. The following domain access policy shows the minimum required permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::<AccountId>:user/data-prepper-user"
      },
      "Action": "es:ESHttpGet",
      "Resource": [
        "arn:aws:es:us-east-1:<AccountId>:domain/<domain-name>/",
        "arn:aws:es:us-east-1:<AccountId>:domain/<domain-name>/_cat/indices",
        "arn:aws:es:us-east-1:<AccountId>:domain/<domain-name>/_search",
        "arn:aws:es:us-east-1:<AccountId>:domain/<domain-name>/_search/scroll",
        "arn:aws:es:us-east-1:<AccountId>:domain/<domain-name>/*/_search"
      ]
    },
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::<AccountId>:user/data-prepper-user"
      },
      "Action": "es:ESHttpPost",
      "Resource": [
        "arn:aws:es:us-east-1:<AccountId>:domain/<domain-name>/*/_search/point_in_time",
        "arn:aws:es:us-east-1:<AccountId>:domain/<domain-name>/*/_search/scroll"
      ]
    },
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::<AccountId>:user/data-prepper-user"
      },
      "Action": "es:ESHttpDelete",
      "Resource": [
        "arn:aws:es:us-east-1:<AccountId>:domain/<domain-name>/_search/point_in_time",
        "arn:aws:es:us-east-1:<AccountId>:domain/<domain-name>/_search/scroll"
      ]
    }
  ]
}
```

For instructions on how to configure the domain access policy, see [Resource-based policies
](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ac.html#ac-types-resource) in the Amazon OpenSearch Service documentation.

### OpenSearch Serverless collection security

The `opensearch` source plugin can receive data from an [Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless.html) collection.

You cannot read from a collection that uses virtual private cloud (VPC) access. The collection must be accessible from public networks.
{: .warning}

#### Creating a pipeline role

To use OpenSearch Serverless collection security, create an IAM role that the pipeline will assume in order to read from the collection. The role must have the following minimum permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "aoss:APIAccessAll"
            ],
            "Resource": "arn:aws:aoss:*:<AccountId>:collection/*"
        }
    ]
}
```

#### Creating a collection

Next, create a collection with the following settings:

- Public [network access](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-network.html) to both the OpenSearch endpoint and OpenSearch Dashboards.
- The following [data access policy](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-data-access.html), which grants the required permissions to the pipeline role, as shown in the following configuration:

  ```json
  [
   {
      "Rules":[
         {
            "Resource":[
               "index/collection-name/*"
            ],
            "Permission":[
               "aoss:ReadDocument",
               "aoss:DescribeIndex"
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

Make sure to replace the Amazon Resource Name (ARN) in the `Principal` element with the ARN of the pipeline role that you created in the preceding step.
{: .tip}

For instructions on how to create collections, see [Creating collections](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-manage.html#serverless-create) in the Amazon OpenSearch Service documentation.

#### Creating a pipeline

Within your `pipeline.yaml` file, specify the OpenSearch Serverless collection endpoint as the `hosts` option. In addition, you must set the `serverless` option to `true`. Specify the pipeline role in the `sts_role_arn` option, as shown in the following example:

```yaml
opensearch-source-pipeline:
  source:
    opensearch:
      hosts: [ "https://<serverless-public-collection-endpoint>" ]
      aws:
        serverless: true
        sts_role_arn: "arn:aws:iam::<AccountId>:role/PipelineRole"
        region: "us-east-1"
  processor:
    - date:
        from_time_received: true
        destination: "@timestamp"
  sink:
    - stdout:
```
