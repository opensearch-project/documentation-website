---
layout: default
title: Filling templates in the agent server
parent: Filling search templates
grand_parent: Agentic search
great_grand_parent: AI search
nav_order: 20
---

<!-- vale off -->
# Filling templates in the agent server
**Introduced 3.10**
{: .label .label-purple }
<!-- vale on -->

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/opensearch-agent-server/issues/150).
{: .warning}

The [OpenSearch Agent Server](https://github.com/opensearch-project/opensearch-agent-server) is a standalone service. Its `agentic_search` agent converts a natural language question into query DSL. When a request to the agent names one or more registered templates, the agent fills a template instead of writing the full query.

## Prerequisites

Before you start, complete the following steps:

1. Enable agentic search templates, then store and register a search template as described in [Filling search templates]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agentic-search-templates/index/).
1. Run the agent server with access to your cluster and an LLM. For setup instructions, see the [OpenSearch Agent Server repository](https://github.com/opensearch-project/opensearch-agent-server).

The agent server fills templates using a forced tool call, which it supports only for Amazon Bedrock models. For all other model providers, every request falls back to writing the full query.
{: .note}

## Step 1: Create a connector to the agent server

Create a connector that calls the agent server's `/invoke` endpoint. The request body names the `agentic_search` agent and passes the index name and the template ID in `context`. Setting `response_format` to `inference_results` and `post_process_function` to `connector.post_process.mlcommons.passthrough` returns the generated query in the format that the flow agent requires:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Agentic search template fill connector",
  "description": "Calls the agent server /invoke endpoint in template mode",
  "version": "1",
  "protocol": "http",
  "parameters": {
    "endpoint": "<agent_server_host>:<port>",
    "template_id": "product_search"
  },
  "credential": {
    "token": "<token>"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "http://${parameters.endpoint}/invoke",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer ${credential.token}"
      },
      "request_body": "{ \"query\": \"${parameters.question}\", \"agent\": \"agentic_search\", \"context\": { \"index_name\": \"${parameters.index_name}\", \"template_id\": \"${parameters.template_id}\" }, \"response_format\": \"inference_results\" }",
      "post_process_function": "connector.post_process.mlcommons.passthrough"
    }
  ]
}
```
{% include copy-curl.html %}

The agent server makes all of its calls to the cluster using the bearer token from the `Authorization` header, so they run as the token's user. When the Security plugin is enabled, that user needs the following permissions:

- The `indices:data/read/search/template/render` permission, which is required to render search templates. Grant it as a cluster permission in `cluster_permissions`. Granting it as an index permission, even on the `*` index pattern, doesn't allow rendering.
- The `read` permission on the `.plugins-ml-agentic-search-templates` system index, which stores the parameter schemas. Because this is a system index, the role must also grant `system:admin/system_index` on it, and `plugins.security.system_indices.permission.enabled` must be `true`. For more information, see [System index permissions]({{site.url}}{{site.baseurl}}/security/access-control/permissions/#system-index-permissions).
- The `indices:admin/mappings/get` and `read` permissions on the searched index. When the agent falls back to writing the full query, it reads the index mapping and searches the index for a sample document. Without `read`, the fallback writes the query without a sample document.

If the agent can't read a template's parameter schema or render it, it falls back to writing the full query without returning an error, so verify these permissions if the agent never fills a template.

To let the agent choose among several templates, replace `template_id` in the `context` object of `request_body` with a `template_ids` array, for example, `\"template_ids\": [\"product_search\", \"similar_search\"]`. When the request names two or more distinct template IDs (across `template_id` and `template_ids`), the agent skips templates that aren't registered for exactly the `index_name` index (aliases and index patterns don't match) and uses at most eight candidates. When the request names a single template, the agent doesn't verify the index specified for the template.

If the agent server or the cluster is on a private IP address, set `plugins.ml_commons.connector.private_ip_enabled` to `true`. If the endpoint doesn't match `plugins.ml_commons.trusted_connector_endpoints_regex`, add it to that setting. For more information, see [ML Commons cluster settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/).
{: .note}

## Step 2: Register a flow agent with a ConnectorTool

Register a flow agent with a [`ConnectorTool`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/connector-tool/) that uses the connector:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "agent-server-template-fill-agent",
  "type": "flow",
  "tools": [
    {
      "type": "ConnectorTool",
      "name": "remote_dsl_generator",
      "description": "Generates OpenSearch DSL from a natural language question.",
      "parameters": {
        "connector_id": "<connector_id>",
        "connector_action": "predict"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Step 3: Create a search pipeline and run an agentic search

Create a search pipeline that uses the agent and run an agentic search as described in [Steps 3 and 4]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agentic-search-templates/opensearch/#step-3-create-a-search-pipeline) of [Filling templates in OpenSearch]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agentic-search-templates/opensearch/).

## Falling back to an LLM-written query

The agent writes the full query using its own LLM whenever filling a template fails for any reason, including when the template isn't registered or can't be read, the LLM call fails, the LLM declines to fill the template, the filled values fail validation, or the template doesn't render a valid query. Unlike the `SearchTemplateFillTool`, which returns an error when reading templates or calling the LLM fails, the agent server doesn't return these errors, and it has no setting equivalent to `fallback_enabled`. If query generation fails entirely, the agent returns `{"size":10,"query":{"match_all":{}}}`.

The agent server might decline some questions that the `SearchTemplateFillTool` fills and write the full query instead. LLM output varies between runs, so the same question can be filled in one request and declined in another.

The agent server caches each template's parameter schema for 60 seconds, so a schema update can take up to 60 seconds to take effect.

## Related documentation

- [Filling search templates]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agentic-search-templates/index/)
- [Search Template Fill tool]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/search-template-fill-tool/)
- [Agentic search template APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/index/)
