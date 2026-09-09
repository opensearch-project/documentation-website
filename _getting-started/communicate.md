---
layout: default
title: Communicate with OpenSearch
nav_order: 30
description: "Learn how to communicate with OpenSearch using the REST API to index documents, run queries, and change cluster settings."
---

# Communicate with OpenSearch

You interact with OpenSearch clusters using the REST API. Through the REST API, you can change most OpenSearch settings, modify indexes, check cluster health, get statistics---almost everything. You can use clients like [cURL](https://curl.se/) or any programming language that can send HTTP requests.

You can send HTTP requests in your terminal or in the [Dev Tools console]({{site.url}}{{site.baseurl}}/dashboards/dev-tools/index/) in OpenSearch Dashboards.

If you need to communicate with OpenSearch in your programming language, see the [Clients]({{site.url}}{{site.baseurl}}/clients/) section for a list of available clients.

## Sending requests in a terminal

When sending cURL requests in a terminal, the request format varies depending on whether you're using the Security plugin:

- **Without Security plugin**: Use `http://` URLs and no authentication.
- **With Security plugin**: Use `https://` URLs and provide username/password credentials.

As an example, consider a request to the Cluster Health API. 

If you're not using the Security plugin, send the following request:

```bash
curl -X GET "http://localhost:9200/_cluster/health"
```
{% include copy.html %}

If you're using the Security plugin, provide the username and password in the request. The default username is `admin`, and the password is set in your `docker-compose.yml` file in the `OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password>` setting:

```bash
curl -X GET "https://localhost:9200/_cluster/health" -ku admin:<custom-admin-password>
```
{% include copy.html %}

### Pretty format

OpenSearch generally returns responses in a flat JSON format by default. For a human-readable response body, provide the `pretty` query parameter:

```bash
curl -X GET "http://localhost:9200/_cluster/health?pretty"
```
{% include copy.html %}

For more information about `pretty` and other useful query parameters, see [Common REST parameters]({{site.url}}{{site.baseurl}}/opensearch/common-parameters/).

### Request body

For requests that contain a body, specify the `Content-Type` header and provide the request payload in the `-d` (data) option:

```json
curl -X GET "http://localhost:9200/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match_all": {}
  }
}'
```
{% include copy.html %}

## Sending requests in Dev Tools

The Dev Tools console in OpenSearch Dashboards uses a simpler syntax to format REST requests as compared to the cURL command. To send requests in Dev Tools, use the following steps:

1. Access OpenSearch Dashboards by opening `http://localhost:5601/` in a web browser on the same host that is running your OpenSearch cluster. If you're using the Security plugin, access OpenSearch Dashboards by opening `https://localhost:5601/`. The default username is `admin`, and the password is set in your `docker-compose.yml` file in the `OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password>` setting.
1. On the top menu bar, go to **Management > Dev Tools**.
1. In the left pane of the console, enter the following request:
    ```json
    GET _cluster/health
    ```
    {% include copy-curl.html %}
1. Choose the triangle icon on the upper right of the request to submit the query. You can also submit the request by pressing `Ctrl+Enter` (or `Cmd+Enter` for Mac users). To learn more about using the OpenSearch Dashboards console for submitting queries, see [Console]({{site.url}}{{site.baseurl}}/dashboards/dev-tools/console/).

In most of the OpenSearch documentation, requests are presented in the Dev Tools console format.

## Further reading

- For information about the OpenSearch REST API, see the [REST API reference]({{site.url}}{{site.baseurl}}/api-reference/).
- For information about OpenSearch language clients, see [Clients]({{site.url}}{{site.baseurl}}/clients/).

## Next steps

- To index, search, update, and delete documents, see [Add and manage your data]({{site.url}}{{site.baseurl}}/getting-started/manage-data/).
 
