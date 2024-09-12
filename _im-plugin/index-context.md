---
layout: default
title: Index context
nav_order: 14
redirect_from:
  - /opensearch/index-context/
---

# Index context

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress the feature or if you want to leave feedback, join the discussion in the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

Index Context declares the use case for an index. Using the context information, OpenSearch applies a pre-determined set of settings and mappings to do the heavy-lifting to ensure. When given the correct context, context provides indexes with:

- Optimized performance.
- Settings tuned to your specific use case.
- Accurate mappings and aliases based on [OpenSearch Integrations]({{site.url}}{{site.baseurl}}/integrations/).

These settings and metadata configuration that are applied using component templates which are automatically loaded when your cluster comes up. The templates for the components start with `@abc_template@`. To prevent potential configuration issues, only use `@abc_template@` the way it’s described on this page.
{: .warning}


## Installation

To install the index context feature:

1. Install the `opensearch-system-templates` plugin on all nodes in your cluster using one of the [installation methods]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/#install)

2. Set the feature flag `opensearch.experimental.feature.application_templates.enabled` to `true`. For more information about enabling and disabling feature flags, see [Enabling experimental features]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).

3. Set the `cluster.application_templates.enabled` setting to `true`. For instructions on how to configure OpenSearch, see [configuring settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#static-settings).

## Using the `context` setting.

Use the `context` setting with the Index API to add use-case specific context.

### Considerations

Consider the following when using the `context` parameter during index creation:

1. If you use the `context` field to create an index, you cannot include any settings declared in context during index creation or dynamic settings updates.
2. Context becomes permanent when set on an index or index-template.

When you adhere to these limitations, suggested configurations or mappings are uniformly applied on indexed data within the specified context.

### Examples

#### Create Index

The following example request creates an index to store metrics data by declaring a `metrics` mapping as the context:

```json
PUT /my-metrics-index
{
  "context": {
    "name": "metrics"
  }
}
```
{% include copy-curl.html %}

After creation, the index will have the context added to it, and also have few settings applied:


**GET request**

```json
GET /my-metrics-index
```
{% include copy-curl.html %}


**Response**

```json
{
    "my-metrics-index": {
        "aliases": {},
        "mappings": {},
        "settings": {
            "index": {
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


#### Create index templates

You can also use the `context` parameter when creating an index template. The following example request creates an index template with the context information as `logs`.

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
```
{% include copy-curl.html %}

All indexes created using this index template will get the metadata provided by the associated component template. The following request and response shows how `context` is added to the template:

**Get index template**

```json
GET _index_template/my-logs
```
{% include copy-curl.html %}

**Response**

```json
{
    "index_templates": [
        {
            "name": "my-logs2",
            "index_template": {
                "index_patterns": [
                    "my-logs1-*"
                ],
                "context": {
                    "name": "logs",
                    "version": "1"
                }
            }
        }
    ]
}
```

If there is any overlap between any settings, mappings, or aliases declared by your template directly and the backing component template for the context, the latter gets higher priority during index creation.


## Available templates for context

The following templates are available to be used through the `context` parameter as of OpenSearch 2.17:

- `logs`
- `metrics`
- `nginx-logs`
- `amazon-cloudtrail-logs`
- `amazon-elb-logs`
- `amazon-s3-logs`
- `apache-web-logs`
- `k8s-logs`

For more information about these templates, see the [OpenSearch system templates repository](https://github.com/opensearch-project/opensearch-system-templates/tree/main/src/main/resources/org/opensearch/system/applicationtemplates/v1).

To view the current version of these templates on your cluster, use `GET /_component_template`.
