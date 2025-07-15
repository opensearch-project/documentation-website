---
layout: default
title: Index context
nav_order: 14
redirect_from:
  - /opensearch/index-context/
---

# Index context

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

Index context declares the use case for an index. Using the context information, OpenSearch applies a predetermined set of settings and mappings, which provides the following benefits:

- Optimized performance
- Settings tuned to your specific use case
- Accurate mappings and aliases based on [OpenSearch Integrations]({{site.url}}{{site.baseurl}}/integrations/)

The settings and metadata configuration that are applied using component templates are automatically loaded when your cluster starts. Component templates that start with `@abc_template@` or Application-Based Configuration (ABC) templates can only be used through a `context` object declaration, in order to prevent configuration issues.
{: .warning}


## Installation

To install the index context feature:

1. Install the `opensearch-system-templates` plugin on all nodes in your cluster using one of the [installation methods]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/#install).

2. Set the feature flag `opensearch.experimental.feature.application_templates.enabled` to `true`. For more information about enabling and disabling feature flags, see [Enabling experimental features]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).

3. Set the `cluster.application_templates.enabled` setting to `true`. For instructions on how to configure OpenSearch, see [configuring settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#static-settings).

## Using the `context` setting

Use the `context` setting with the Index API to add use-case-specific context.

### Considerations

Consider the following when using the `context` parameter during index creation:

1. If you use the `context` parameter to create an index, you cannot include any settings declared in the index context during index creation or dynamic settings updates.
2. The index context becomes permanent when set on an index or index template.

When you adhere to these limitations, suggested configurations or mappings are uniformly applied on indexed data within the specified context.

### Examples

The following examples show how to use index context.


#### Create an index

The following example request creates an index in which to store metric data by declaring a `metrics` mapping as the context:

```json
PUT /my-metrics-index
{
  "context": {
    "name": "metrics"
  }
}
```
{% include copy-curl.html %}

After creation, the context is added to the index and the corresponding settings are applied:


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


#### Create an index template

You can also use the `context` parameter when creating an index template. The following example request creates an index template with the context information as `logs`:

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

All indexes created using this index template will get the metadata provided by the associated component template. The following request and response show how `context` is added to the template:

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

If there is any conflict between any settings, mappings, or aliases directly declared by your template and the backing component template for the context, the latter gets higher priority during index creation.


## Available context templates

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
