---
layout: default
title: ISM Error Prevention
nav_order: 90
has_children: true
has_toc: false
redirect_from:
  - /im-plugin/ism/error-prevention/
  - /im-plugin/ism/error-prevention/index/
---

# ISM error prevention

Error prevention validates Index State Management (ISM) actions before they are performed in order to prevent actions from failing. It also outputs additional information from the action validation results in the response of the [Index Explain API]({{site.url}}{{site.baseurl}}/im-plugin/ism/api/#explain-index). Validation rules and troubleshooting of each action are listed in the following sections.

---

#### Table of contents
1. TOC
{:toc}


---

## rollover 

ISM does not perform a `rollover` action for an index under any of these conditions: 

- [The index is not the write index]({{site.url}}{{site.baseurl}}/im-plugin/ism/error-prevention/resolutions/#the-index-is-not-the-write-index).
- [The index does not have an alias]({{site.url}}{{site.baseurl}}/im-plugin/ism/error-prevention/resolutions/#the-index-does-not-have-an-alias).
- [The rollover policy does not contain a rollover_alias index setting]({{site.url}}{{site.baseurl}}/im-plugin/ism/error-prevention/resolutions/#the-rollover-policy-misses-rollover_alias-index-setting).
- [Skipping of a rollover action has occured]({{site.url}}{{site.baseurl}}/im-plugin/ism/error-prevention/resolutions/#skipping-rollover-action-is-true).
- [The index has already been rolled over using the alias successfully]({{site.url}}{{site.baseurl}}/im-plugin/ism/error-prevention/resolutions/#this-index-has-already-been-rolled-over-successfully).

## delete 

ISM does not perform a `delete` action for an index under any of these conditions: 

- The index does not exist.
- The index name is invalid.
- The index is the write index for a data stream.

## force_merge

ISM does not perform a `force_merge` action for an index if its dataset is too large and exceeds the threshold.

## replica_count

ISM does not perform a `replica_count` action for an index under any of these conditions: 

- The amount of data exceeds the threshold.
- The number of shards exceeds the maximum.

## open

ISM does not perform an `open` action for an index under any of these conditions: 

- The index is blocked.
- The number of shards exceeds the maximum.

## read_only

ISM does not perform a `read_only` action for an index under any of these conditions: 

- The index is blocked.
- The amount of data exceeds the threshold.

## read_write 

ISM does not perform a `read_write` action for an index if the index is blocked.


## close

ISM does not perform a `close` action for an index under any of these conditions:

- The index does not exist.
- The index name is invalid.

## index_priority

ISM does not perform an `index_priority` action for an index that does not have `read-only-allow-delete` permission.

## snapshot

ISM does not perform a `snapshot` action for an index under any of these conditions:

- The index does not exist.
- The index name is invalid.

## transition 

ISM does not perform a `transition` action for an index under any of these conditions:

- The index does not exist.
- The index name is invalid.