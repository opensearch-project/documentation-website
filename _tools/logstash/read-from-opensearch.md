---
layout: default
title: Reading from OpenSearch
parent: Logstash
nav_order: 220
redirect_from:
  - /clients/logstash/read-from-opensearch/
---

# Reading from OpenSearch

Use the [OpenSearch input plugin](https://github.com/opensearch-project/logstash-input-opensearch) to run a search query on an OpenSearch cluster and load the matching documents into Logstash as events. For example, you can replay test logs, reindex documents into another cluster, or export documents to a file. The plugin can run the query once or periodically on a schedule.

Before you start, install [Logstash and the OpenSearch input plugin]({{site.url}}{{site.baseurl}}/tools/logstash/index/#installing-logstash).

## Configuring the OpenSearch input plugin

To read from OpenSearch, add the `opensearch` plugin to the `input` section of your pipeline configuration file. The following example runs a `match_all` query on all indexes whose names start with `logstash-logs-` and prints the documents to the terminal. Replace `<admin-password>` with the password for the `admin` user and `<path-to-root-ca>` with the path to the certificate authority file that signed the OpenSearch node certificates:

```ruby
input {
  opensearch {
    hosts    => ["localhost:9200"]
    user     => "admin"
    password => "<admin-password>"
    index    => "logstash-logs-*"
    query    => '{ "query": { "match_all": {} } }'
    ssl      => true
    ca_file  => "<path-to-root-ca>"
  }
}

output {
  stdout { }
}
```
{% include copy.html %}

The plugin settings have the following requirements:

- When `ssl` is `true`, specify `hosts` as `<hostname>:<port>`, without the `https://` prefix. If you include the prefix, the plugin fails to resolve the hostname.
- The plugin always verifies the OpenSearch node certificates when `ssl` is `true`. The hostname in `hosts` must match a name in the node certificate. For example, the certificates in the OpenSearch demo configuration are valid only for `localhost`.
- The `index` setting doesn't support date patterns such as `%{+YYYY.MM.dd}`. To read from multiple indexes, use a wildcard expression or a comma-separated list of index names.

Start Logstash using the pipeline configuration file:

```bash
bin/logstash -f config/pipeline.conf
```
{% include copy.html %}

When the query completes and the plugin has loaded all matching documents, Logstash stops.

## Running the query on a schedule

To run the query on a schedule, add the `schedule` setting containing a cron expression. For example, the following setting runs the query every minute:

```ruby
schedule => "* * * * *"
```
{% include copy.html %}

When you specify a schedule, Logstash keeps running and loads the matching documents each time the query runs. For more information about the cron expression syntax, see [Cron expressions]({{site.url}}{{site.baseurl}}/api-reference/cron-expressions/).

## Settings

The following table lists the most commonly used OpenSearch input plugin settings.

Setting | Data type | Description
:--- | :--- | :---
`hosts` | Array | The OpenSearch hosts to connect to, in `<hostname>:<port>` format.
`index` | String | The index or indexes to query. Supports wildcard expressions. Default is `logstash-*`.
`query` | String | The query to run, in OpenSearch query DSL format. Default is `{ "sort": [ "_doc" ] }`, which returns all documents.
`schedule` | String | A cron expression that specifies when to run the query. If not specified, the query runs once.
`user` | String | The user name for basic authentication.
`password` | String | The password for basic authentication.
`ssl` | Boolean | Whether to connect to OpenSearch over HTTPS. Default is `false`.
`ca_file` | String | The path to the certificate authority file used to verify the OpenSearch node certificates.
`size` | Integer | The number of documents to return for each scroll request. Default is `1000`.
`scroll` | String | How long to keep the search context open between scroll requests. Default is `1m`.
`docinfo` | Boolean | Whether to add document metadata, such as the index name and document ID, to each event in the `[@metadata][input][opensearch]` field. Default is `false`.

## Example: Copy documents to another index

To copy documents from one index to another, use the OpenSearch input plugin to read the documents and the OpenSearch output plugin to write them. The following pipeline copies the documents from the `logstash-logs-*` indexes to the `logstash-logs-copy` index and keeps each document's ID:

```ruby
input {
  opensearch {
    hosts    => ["localhost:9200"]
    user     => "admin"
    password => "<admin-password>"
    index    => "logstash-logs-*"
    ssl      => true
    ca_file  => "<path-to-root-ca>"
    docinfo  => true
  }
}

output {
  opensearch {
    hosts       => ["https://localhost:9200"]
    user        => "admin"
    password    => "<admin-password>"
    index       => "logstash-logs-copy"
    document_id => "%{[@metadata][input][opensearch][_id]}"
    ssl         => true
    cacert      => "<path-to-root-ca>"
  }
}
```
{% include copy.html %}

For more information about the output plugin settings, see [Shipping events to OpenSearch]({{site.url}}{{site.baseurl}}/tools/logstash/ship-to-opensearch/).
