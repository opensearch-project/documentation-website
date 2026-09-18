---
layout: default
title: Index context
parent: Tuning indexes
nav_order: 50
redirect_from:
  - /opensearch/index-context/
---

# Index context
**Introduced 2.17**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

Index context declares the use case for an index. Using the context information, OpenSearch applies a predetermined set of settings and mappings, which provides the following benefits:

- Optimized performance
- Settings tuned to your specific use case
- Accurate mappings and aliases based on [OpenSearch Integrations]({{site.url}}{{site.baseurl}}/integrations/)

The settings and metadata configuration that are applied using component templates are automatically loaded when your cluster starts. Component templates that start with `@abc_template@` or Application-Based Configuration (ABC) templates can only be used through a `context` object declaration, in order to prevent configuration issues.
{: .warning}

## Enabling index context

Index context requires two settings, both of which are applied at node startup. Enable both on every node in the cluster, and then restart the nodes:

1. Set the `opensearch.experimental.feature.application_templates.enabled` feature flag to `true`. For more information, see [Experimental feature flags]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).

2. Add the following line to `opensearch.yml`:

   ```yaml
   cluster.application_templates.enabled: true
   ```
   {% include copy.html %}

Do not set `cluster.application_templates.enabled` using the [Cluster settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/). The API accepts the update and returns `200`, but the node then fails to apply the resulting cluster state, logging an error that the feature flag is not enabled. The node repeatedly gives up its cluster manager role, and every request that changes the cluster state, such as creating an index, stops responding until you restart the node. If you set the value as a persistent setting, it is reapplied after the restart.
{: .warning}

The `opensearch-system-templates` plugin supplies the component templates that back each context. It is bundled with all OpenSearch distributions except the minimal distribution. If you use the minimal distribution, install it using one of the [installation methods]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/#install).

## Using the `context` setting

Use the `context` setting with the Index API to add use-case-specific context.

### Considerations

Consider the following when using the `context` parameter during index creation:

- If you use the `context` parameter to create an index, you cannot include any settings declared in the index context during index creation or dynamic settings updates.
- The index context becomes permanent when set on an index or index template.

When you adhere to these limitations, suggested configurations or mappings are uniformly applied on indexed data within the specified context.

If `cluster.application_templates.enabled` is not enabled, a request that declares a context is rejected with `400`.

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

After creation, the context is added to the index and the corresponding settings are applied. To confirm this, send the following request:

```json
GET /my-metrics-index
```
{% include copy-curl.html %}

The response contains the context and the settings that it applied:

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

All indexes created using this index template will get the metadata provided by the associated component template. To confirm that `context` was added to the template, send the following request:

```json
GET _index_template/my-logs
```
{% include copy-curl.html %}

The response contains the context:

```json
{
    "index_templates": [
        {
            "name": "my-logs",
            "index_template": {
                "index_patterns": [
                    "my-logs-*"
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

The following templates can be used through the `context` parameter:

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
