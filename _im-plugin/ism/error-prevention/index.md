---
layout: default
title: ISM error prevention
parent: Index State Management
nav_order: 1
has_children: true
redirect_from:
  - /im-plugin/ism/error-prevention/
---

# ISM Error prevention

Error prevention validates ISM actions before they are performed to avoid actions from failing. It also discloses more information from the action validation results in the response of the [Index Explain API]({{site.url}}{{site.baseurl}}/im-plugin/ism/api/#explain-index). Validation rules and troubleshooting of each action are listed below.

---

#### Table of contents
1. TOC
{:toc}


---

## rollover 

ISM does not perform a `rollover` action for an index under any of these conditions: 

- [The index is not the write index]({{site.url}}{{site.baseurl}}/im_plugin/ism/error-prevention/resolutions/#the-index-is-not-the-write-index).
- [The index does not have an alias]({{site.url}}{{site.baseurl}}/im_plugin/ism/error-prevention/resolutions/#the-index-does-not-have-an-alias).
- [The rollover policy does not contain a rollover_alias index setting]({{site.url}}{{site.baseurl}}/im_plugin/ism/error-prevention/resolutions/#the-rollover-policy-misses-rollover_alias-index-setting).
- [Skipping of a rollover action has occured]({{site.url}}{{site.baseurl}}/im_plugin/ism/error-prevention/resolutions/#skipping-rollover-action-is-true).
- [The index has already been rolled over using the alias successfully]({{site.url}}{{site.baseurl}}/im_plugin/ism/error-prevention/resolutions/#this-index-has-already-been-rolled-over-successfully).

## delete 

ISM does not perform a `delete` action for an index under any of these conditions: 

- The index does not exist.
- The index name is invalid.
- The index is the write index for some data stream.

## force_merge

ISM does not perform a `force_merge` action for an index if the data too large and is exceeding the threshold.

## replica_count

ISM does not perform a `replica_count` action for an index under any of these conditions: 

- The data is too large and is exceeding the threshold.
- Maximum shards exceeded.

## open

ISM does not perform an `open` action for an index under any of these conditions: 

- The index is blocked.
- Maximum shards exceeded.

## read_only

ISM does not perform a `read_only` action for an index under any of these conditions: 

- The index is blocked.
- The data is too large and is exceeding the threshold.

## read_write 

ISM does not perform read_write action for an index if the index is blocked.
