---
layout: default
title: RSS
parent: Sources
grand_parent: Pipelines
nav_order: 97
---

# RSS source

The `rss` source polls one or more RSS or Atom feeds and converts their items into OpenSearch Data Prepper events. Each feed is polled on a schedule, and new items are written to the [`buffer`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/buffers/buffers/).

Each feed keeps a bounded in-memory cache of recently seen items, so already ingested items are not re-emitted on subsequent polls. This cache is not persisted, so it resets when Data Prepper restarts.

## Usage

Provide one or more feeds under the `feeds` map, which is keyed by feed name. Each feed requires a `url` and can optionally set a per-feed `polling_frequency` and `authentication`. The following example pipeline specifies an `rss` source that polls three feeds:

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
              password: my-password
```
{% include copy.html %}

To avoid storing plaintext credentials in your pipeline configuration, reference them from a configured secret store. AWS Secrets Manager is the only supported secret store. When the `aws` extension is configured, a `{% raw %}${{aws_secrets:<secret-name>:<key>}}{% endraw %}` reference resolves the given key from a secret at startup. For more information, see [Reference secrets]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/configuring-data-prepper/#reference-secrets).

## Configuration options

Use the following options to configure the `rss` source. All duration values support ISO 8601 notation (such as `PT15M` or `PT20.345S`) and simple notation for seconds (`60s`) and milliseconds (`1500ms`).

Option | Required | Type | Description
:--- | :--- | :--- | :---
`feeds` | Yes | Map | A non-empty map of feeds to poll. Each key is the feed name, which is attached to events as `feed_name` and can be used for index routing. Feed names must be 1--64 characters long and can contain only letters, digits, underscores, and hyphens. Each value is a feed configuration. For more information, see [Feed options](#feed-options).
`polling_frequency` | No | Duration | The default polling frequency for feeds that do not set their own. Must be at least 1 second. Default is `PT5M` (5 minutes).
`workers` | No | Integer | The size of the polling thread pool. Must be between 1 and 1,000. The pool never contains more threads than the number of configured feeds. Default is `1`.
`request_timeout` | No | Duration | The connection, request, and read timeout applied to each feed fetch. This timeout prevents a slow or unresponsive feed from blocking its worker thread indefinitely. Default is `PT30S` (30 seconds).

### Feed options

Use the following options for each entry in the `feeds` map.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`url` | Yes | String | The RSS or Atom feed URL to read from.
`polling_frequency` | No | Duration | Overrides the top-level `polling_frequency` for this feed. Must be at least 1 second.
`authentication` | No | Object | The authentication configuration for the feed. For more information, see [Authentication](#authentication).

### Authentication

Use the following option in a feed's `authentication` object to configure HTTP basic authentication.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`basic` | No | Object | The HTTP basic authentication credentials. Contains a `username` and a `password`, both of which are required when `basic` is specified.

## Event schema

The source emits each item as an event of type `rss-item` that contains the following top-level body fields.

Field | Description
:--- | :---
`title` | The item title.
`link` | The item link.
`description` | The item description or summary.
`publication_date` | The item publication date.
`item_id` | The item's globally unique identifier (GUID). If the item has no GUID, the source uses the `link` value. If both are absent, the source uses a content hash. This field is always non-empty.
`feed_name` | The feed's key from the `feeds` map. This field is always present.
`feed_url` | The configured feed URL with its query string redacted. This field is always present.

When a feed provides the following feed channel details, the source attaches them as event metadata rather than storing them in the document body.

Metadata attribute | Description
:--- | :---
`feed_title` | The feed channel's `<title>`.
`feed_link` | The feed channel's `<link>` (the publisher's site).
`feed_language` | The feed channel's `<language>`.
`feed_categories` | The feed channel's `<category>` values.

Because `feed_name` and `feed_url` are body fields, they are searchable and can be used directly for per-feed routing at the sink. Use `item_id` as the `document_id` at the sink so that a republished item updates the existing document, as shown in the following example:

```yaml
sink:
  - opensearch:
      hosts: ["https://opensearch:9200"]
      index: "rss-${/feed_name}-%{yyyy.MM.dd}"
      document_id: "${/item_id}"
```
{% include copy.html %}

Do not configure the sink to depend on a channel metadata attribute, because the attribute is absent when the feed does not provide it. Use the always present `feed_name`, `feed_url`, and `item_id` body fields for routing and document IDs.

## Failure handling

Feeds are polled independently. When a feed fails, the source logs the failure with the query string redacted from the feed URL, increments the `feedPollsFailed` metric for that feed, and backs off exponentially before retrying. A failure in one feed does not stop the other feeds or permanently stop polling.

## Metrics

The `rss` source includes the following metrics (counters). Each metric is recorded separately for every feed, with the feed name appended to the metric name:

* `feedPollsFailed.<feed-name>`: The number of polls that have failed for the feed.
* `itemsIngested.<feed-name>`: The number of items the source has written to the buffer for the feed.


## Limitations

The following capabilities are not yet supported:

- Bearer token authentication
- Custom header authentication
- Deduplication across restarts and nodes using source coordination
- End-to-end acknowledgments