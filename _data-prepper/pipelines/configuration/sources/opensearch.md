---
layout: default
title: opensearch source
parent: Sources
grand_parent: Pipelines
nav_order: 30
---

# opensearch source

You can use the `opensearch` source plugin to read indices from an OpenSearch cluster, a legacy Elasticsearch cluster, an Amazon OpenSearch Service domain, or an Amazon OpenSearch Serverless collection.

The plugin supports OpenSearch 2.x, and Elasticsearch 7.x.

## Usage

#### Minimum required config with username and password

```yaml
opensearch-source-pipeline:
 source:
  opensearch:
    hosts: [ "https://localhost:9200" ]
    username: "username"
    password: "password"
 ...
```

#### Full config example

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

#### Amazon OpenSearch Service

The OpenSearch source can also be configured for an Amazon OpenSearch service domain by passing an `sts_role_arn` with access to the domain.

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

#### Using Metadata

When the OpenSearch source constructs Data Prepper Events from documents in the cluster, the document index is stored in the EventMetadata with an `opensearch-index` key, and the document_id is stored in the EventMetadata with a `opensearch-document_id` key. This allows conditional routing based on the index or document_id, among other things. For example, one could send to an OpenSearch sink and use the same index and document_id from the source cluster in the destination cluster. A full config example for this use case is below


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

### Configuration options


The following table describes options you can configure for the `opensearch` source.

Option | Required | Type    | Description
:--- | :--- |:--------| :---
`hosts` | Yes | List    | List of OpenSearch hosts to write to (for example, `["https://localhost:9200", "https://remote-cluster:9200"]`).
`username` | No | String  | Username for HTTP basic authentication.
`password` | No | String  | Password for HTTP basic authentication.
`disable_authentication` | No | Boolean | Whether authentication is disabled. Defaults to false.
`aws` | No | Object  | The AWS configuration. For more information, see [aws](#aws).
`acknowledgments` | No | Boolean | If `true`, enables the `opensearch` source to receive [end-to-end acknowledgments]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines/#end-to-end-acknowledgments) when events are received by OpenSearch sinks. Default is `false`.
`connection` | No | Object  | The connection configuration, see [Connection](#connection).
`indices` | No | Object | The indices configuration for filtering which indices are processed. Defaults to all indices, including system indices. See [Indices](#indices)
`scheduling` | No | Object | The scheduling configuration. See [Scheduling](#scheduling).
`search_options` | No | Object | The search options configuration. See [Search options](#search_options)

#### Scheduling

The scheduling configuration allows the user to configure reprocessing of each included index up to `index_read_count` number of times every `interval` amount of time.
For example, setting `index_read_count` to 3 with an `interval` of 1 hour will result in all indices being processed 3 times, an hour apart. By default,
indices will only be processed once.

Option | Required | Type            | Description
:--- | :--- |:----------------| :---
`index_read_count` | No | Integer | The number of times each index will be processed. Default to 1.
`interval` | No | String | The interval to reprocess indices. Supports ISO_8601 notation Strings ("PT20.345S", "PT15M", etc.) as well as simple notation Strings for seconds ("60s") and milliseconds ("1500ms"). Defaults to 8 hours.
`start_time` | No | String | The instant of time when processing should begin. The source will not start processing until this instant is reached. The String must be in ISO-8601 format, such as `2007-12-03T10:15:30.00Z`. Defaults to starting processing immediately.


#### Indices
### <a name="indices"></a>
The below options allow filtering which indices are processed from the source cluster via regex patterns. An index will only
be processed if it matches one of the `index_name_regex` patterns under `include` and does not match any of the 
patterns under `exclude`.

Option | Required | Type             | Description
:--- | :--- |:-----------------| :---
`include` | No | Array of Objects | A List of [Index Configuration](#index_configuration) that specifies which indices will be processed.
`exclude` | No | Array of Objects | A List of [Index Configuration](#index_configuration) that specifies which indices will not be processed. For example, one can specify an `index_name_regex` pattern of `\..*` to exclude system indices.

###### IndexConfiguration
### <a name="index_configuration"></a>

Option | Required | Type             | Description
:--- |:----|:-----------------| :---
`index_name_regex` | Yes | Regex String | The regex pattern to match indices against 

#### Search options
### <a name="search_options"></a>

Option | Required | Type    | Description
:--- |:---------|:--------| :---
`batch_size` | No       | Integer | The number of documents to read at a time while paginating from OpenSearch. Defaults to `1000` 
`search_context_type` | No | Enum | An override for the type of search/pagination to use on indices. Can be one of `point_in_time` (uses [Point in Time](https://opensearch.org/docs/latest/search-plugins/searching-data/paginate/#point-in-time-with-search_after)), `scroll` (uses [scroll](https://opensearch.org/docs/latest/search-plugins/searching-data/paginate/#scroll-search)), or `none` (uses [search_after](https://opensearch.org/docs/latest/search-plugins/searching-data/paginate/#the-search_after-parameter)). See [Default Search Behavior](#default_search_behavior) for default behavior.

###### Default search behavior
### <a name="default_search_behavior"></a>

By default, the `opensearch` source will do a lookup of the cluster version and distribution to determine 
which `search_context_type` to use. For versions and distributions that support [Point in Time](https://opensearch.org/docs/latest/search-plugins/searching-data/paginate/#point-in-time-with-search_after), `point_in_time` will be used. 
If `point_in_time` is not supported by the cluster, then [Scroll](https://opensearch.org/docs/latest/search-plugins/searching-data/paginate/#scroll-search) will be used. For Amazon OpenSearch Serverless collections, [search_after](https://opensearch.org/docs/latest/search-plugins/searching-data/paginate/#the-search_after-parameter)
will be used as neither `point_in_time` or `scroll` are supported by collections.

#### Connection

Option | Required | Type    | Description
:--- | :--- |:--------| :---
`cert` | No | String  | Path to the security certificate (for example, `"config/root-ca.pem"`) if the cluster uses the OpenSearch Security plugin.
`insecure` | No | Boolean | Whether or not to verify SSL certificates. If set to true, certificate authority (CA) certificate verification is disabled and insecure HTTP requests are sent instead. Default value is `false`.


#### AWS

Use the following options when setting up authentication for `aws` services.

Option | Required | Type    | Description
:--- | :--- |:--------| :---
`region` | No | String  | The AWS Region to use for credentials. Defaults to [standard SDK behavior to determine the Region](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html).
`sts_role_arn` | No | String  | The AWS Security Token Service (AWS STS) role to assume for requests to Amazon OpenSearch Service and Amazon OpenSearch Serverless. Default is `null`, which will use the [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html).
`serverless` | No | Boolean | Should be set to true when processing from an Amazon OpenSearch Serverless collection. Defaults to false.


## OpenSearch cluster security

In order to pull data from an OpenSearch cluster using the `opensearch` source plugin, you must specify your username and password within the pipeline configuration. The following example `pipelines.yaml` file demonstrates how to specify admin security credentials:

```yaml
source:
  opensearch:
    username: "admin"
    password: "admin"
  ...
```

## Amazon OpenSearch Service domain security

The `opensearch` source plugin can pull data from an [Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html) domain, which uses IAM for security. The plugin uses the default credential chain. Run `aws configure` using the [AWS Command Line Interface (AWS CLI)](https://aws.amazon.com/cli/) to set your credentials.

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

## OpenSearch Serverless collection security

The `opensearch` source plugin can receive data from an [Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless.html) collection.

OpenSearch Serverless collection sources have the following limitations:

- You can't read from a collection that uses virtual private cloud (VPC) access. The collection must be accessible from public networks.

### Creating a pipeline role

First, create an IAM role that the pipeline will assume in order to read from the collection. The role must have the following minimum permissions:

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

## Creating a collection

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

  ***Important***: Make sure to replace the ARN in the `Principal` element with the ARN of the pipeline role that you created in the preceding step.

  For instructions on how to create collections, see [Creating collections](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-manage.html#serverless-create) in the Amazon OpenSearch Service documentation.

### Creating a pipeline

Within your `pipelines.yaml` file, specify the OpenSearch Serverless collection endpoint as the `hosts` option. In addition, you must set the `serverless` option to `true`. Specify the pipeline role in the `sts_role_arn` option:

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
