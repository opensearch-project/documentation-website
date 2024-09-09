---
layout: default
title: Index context
nav_order: 14
redirect_from:
  - /opensearch/index-context/
---

# Index context

Context can be used to declare the use case for which you are building your index. 
Using the context information, OpenSearch can apply a pre-determined set of settings, and mappings to do the heavy-lifting around ensuring:

1. Available performance optimizations are applied for the index.
2. Existing settings are tuned according to the use-case.
3. Mappings/Aliases based on [OpenSearch Integrations]({{site.url}}{{site.baseurl}}/integrations/)  are applied on the index if applicable.

These metadata parameters applied are backed by component templates which are automatically loaded when your cluster comes up. These component templates are prefixed with `@abc_template@`, and can only be used based on the usage pattern outlined in this document.
{: .important}

The `context` parameter is available on indices and index templates as an experimental feature starting OpenSearch 2.17
{: .warning}

## Usage

### Installation

In order to use the `context` field while creating an index or index-template:

1. Install the `opensearch-system-templates` plugin on all nodes in your cluster using one of the [installation methods]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/#install)
2. Set the feature flag `opensearch.experimental.feature.application_templates.enabled` to `true`. For more information about enabling and disabling feature flags, see [Enabling experimental features]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).
3. Enable setting `cluster.application_templates.enabled` to `true`. See [configuring settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#static-settings) for steps on how to do this.


### Create Index

For example, if you are using your indices to store metrics data, you can declare `metrics` as a context on your index:

````
```json
PUT /my-metrics-index
{
  "context": {
    "name": "metrics"
  }
}
```
{% include copy-curl.html %}
````


After creation, the index will have the context added to it, and also few settings applied:


````
```json
GET /my-metrics-index
```
{% include copy-curl.html %}
````

````
```json
{
    "my-metrics-index": {
        "aliases": {},
        "mappings": {},
        "settings": {
            "index": {
                "replication": {
                    "type": "DOCUMENT"
                },
                "codec": "zstd_no_dict",
                "refresh_interval": "60s",
                "number_of_shards": "1",
                "provided_name": "my-metrics-index",
                "merge": {
                    "policy": "log_byte_size"
                },
                "context": {
                    "created_version": "1",
                    "current_version": "1"
                },
                ...
            }
        },
        "context": {
            "name": "metrics",
            "version": "_latest"
        }
    }
}
```
````

#### Considerations

There are few restrictions which are applied when you decide to use `context` param when creating your indices:

1. When you create an index using `context` field, any settings which are declared in context cannot be provided as part of index creation, or dynamic settings updates.
2. Once set on an index/index-template, context cannot be removed from it.

The above points ensure that at any point, the recommended settings/mappings are always applied on the indices.



### Create Index Templates

You can also provide the `context` parameter while creating index templates:

````
```json
PUT _index_template/my-logs
{
    "context": {
        "name": "logs",
        "version": "1"
    },
    "index_patterns": [
        "my-logs-*"
    ]
}
{% include copy-curl.html %}
````

This will create an index template with the context information as `logs`, and all indices created via this index template will get the metadata provided by the associated component template.
If there is any overlap between settings/mappings/aliases declared by your template directly and the same coming through the backing component template for the context, the latter gets higher priority during index creation.

## Available Templates for Context

Following templates are available to be used through the `context` parameter as of today:

1. logs
2. metrics
3. nginx-logs
4. amazon-cloudtrail-logs
5. amazon-elb-logs
6. amazon-s3-logs
7. apache-web-logs
8. k8s-logs

To see more details on what these templates provide, please take a look at the [repository](https://github.com/opensearch-project/opensearch-system-templates/tree/d71e12588e3144ad0fd26745d084ba49e9e08349/src/main/resources/org/opensearch/system/applicationtemplates/v1).
You can also check the current version of these templates installed on your cluster through `GET /_component_template`