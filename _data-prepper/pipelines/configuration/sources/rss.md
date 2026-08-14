---
layout: default
title: RSS
parent: Sources
grand_parent: Pipelines
nav_order: 97
---

# RSS source

The `rss` source polls one or more RSS or Atom feeds and converts their items into OpenSearch Data Prepper events. Each feed is polled on a schedule, and new items are written to the [`buffer`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/buffers/buffers/).

Each feed keeps a bounded in-memory cache of recently seen items, so already-ingested items are not re-emitted on subsequent polls. This cache is not persisted, so it resets when Data Prepper restarts.

## Usage

Provide one or more feeds under `feeds`, which is a map keyed by feed name. Each feed requires a `url` and can optionally set a per-feed `polling_frequency` and `authentication`. The following example pipeline specifies an `rss` source that polls three feeds:

```yaml
rss-pipeline:
  source:
    rss:
      workers: 2
      polling_frequency: PT5M
      feeds:
        opensearch-forum:
          url: https://forum.opensearch.org/latest.rss
        example-news:
          url: https://api.example.com/v2/rss?partnerKey=abc123
          polling_frequency: PT1M
        internal:
          url: https://private.example.com/feed.xml
          authentication:
            basic:
              username: my-username
              password: "p@ss:w0rd#123!"
```
{% include copy.html %}

To avoid inlining plaintext credentials in your pipeline configuration, you can reference them from a configured secret store instead. AWS Secrets Manager is currently supported: with the `aws` extension configured, a `{% raw %}${{aws_secrets:<secret-name>:<key>}}{% endraw %}` reference resolves the given key from a secret at startup. For more information, see [Reference secrets]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/configuring-data-prepper/#reference-secrets).

## Configuration options

Use the following options to configure the `rss` source.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`feeds` | Yes | Map | A non-empty map of feeds to poll. Each key is the feed name (attached to events as `feed_name` and useful for index routing), and each value is a feed configuration. See [feed options](#feed-options) for more information.
`polling_frequency` | No | Duration | The default polling frequency for feeds that do not set their own. Default is 5 minutes (`PT5M`).
`workers` | No | Integer | The size of the polling thread pool, further bounded by the number of feeds. Must be between 1 and 1,000. Default is `1`.
`request_timeout` | No | Duration | The connection, request, and read timeout applied to each feed fetch, so that one slow or hung feed cannot block its worker thread indefinitely. Default is 30 seconds.

<!-- vale off -->
### feed options
<!-- vale on -->

Use the following options for each entry in the `feeds` map.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`url` | Yes | String | The RSS or Atom feed URL to read from.
`polling_frequency` | No | Duration | Overrides the top-level `polling_frequency` for this feed.
`authentication` | No | Object | The authentication configuration for the feed. See [authentication](#authentication) for more information.

<!-- vale off -->
### authentication
<!-- vale on -->

Use the following option to configure HTTP Basic authentication for a feed. For production deployments, supply credentials using [secrets references]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/configuring-data-prepper/#reference-secrets) rather than inline plaintext.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`basic` | No | Object | HTTP Basic authentication credentials. Contains a `username` and a `password`.

All `Duration` values support ISO 8601 notation (`PT15M`, `PT20.345S`) as well as simple notation for seconds (`60s`) and milliseconds (`1500ms`).

## Event schema

Each item is emitted as an event of type `rss-item` with the following top-level body fields.

Field | Description
:--- | :---
`title` | The item title.
`link` | The item link.
`description` | The item description or summary.
`publication_date` | The item publication date.
`item_id` | The item GUID, falling back to `link`, then to a content hash when both are absent (always non-empty).
`feed_name` | The feed's key from the `feeds` map (always present).
`feed_url` | The configured feed URL with its query string redacted (always present).

Additional feed channel details are attached as event metadata (not stored in the document body), and only when the feed provides them.

Metadata attribute | Description
:--- | :---
`feed_title` | The feed channel's `<title>`.
`feed_link` | The feed channel's `<link>` (the publisher's site).
`feed_language` | The feed channel's `<language>`.
`feed_categories` | The feed channel's `<category>` values.

Because `feed_name` and `feed_url` are body fields, they are searchable and can be used directly for per-feed routing at the sink. The `item_id` field is well suited to `document_id` for sink-side upserts, as shown in the following example:

```yaml
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        index: "rss-${/feed_name}-%{yyyy.MM.dd}"
        document_id: "${/item_id}"
```
{% include copy.html %}

The channel metadata attributes are attached only when the feed provides them, so sink configuration must not depend on an attribute that may be absent. Routing and document IDs should key off the always-present `feed_name`, `feed_url`, or `item_id` body fields.

## Failure handling

Feeds are polled independently. A failing feed is logged (with its URL query string redacted), increments a per-feed failure metric, and backs off exponentially before retrying. A failing feed never stops the other feeds and never permanently stops polling.

## Limitations

The following capabilities are not yet supported:

- Durable, cross-restart, cross-node deduplication using source coordination.
- End-to-end acknowledgments.
- Bearer-token or custom-header authentication.
