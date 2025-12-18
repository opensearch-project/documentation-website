---
layout: default
title: Processors
has_children: true
parent: Pipelines
nav_order: 35
redirect_from:
  - /data-prepper/pipelines/configuration/processors/mutate-event/
  - /data-prepper/pipelines/configuration/processors/mutate-string/
  - /data-prepper/pipelines/configuration/processors/
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/processors/
---

# Processors

Processors are components within an OpenSearch Data Prepper pipeline that enable you to filter, transform, and enrich events using your desired format before publishing records to the `sink` component. If no `processor` is defined in the pipeline configuration, then the events are published in the format specified by the `source` component. You can incorporate multiple processors within a single pipeline, and they are executed sequentially as defined in the pipeline.

Prior to Data Prepper 1.3, these components were named *preppers*. In Data Prepper 1.3, the term *prepper* was deprecated in favor of *processor*. In Data Prepper 2.0, the term *prepper* was removed.
{: .note }

# Mutate event processors

Use mutate event processors to modify events in OpenSearch Data Prepper. The following processors are available.

| Processor | Description |
|-----------|-------------|
| [`add_entries`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/add-entries/) | Add entries to an event. |
| [`convert_entry_type`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/convert-entry-type/) | Convert value types in an event. |
| [`copy_values`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/copy-values/) | Copy values within an event. |
| [`delete_entries`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/delete-entries/) | Delete entries from an event. |
| [`list_to_map`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/list-to-map) | Convert a list of objects from an event, where each object contains a `key` field, into a map of target keys. |
| [`map_to_list`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/map-to-list) | Convert a map of objects from an event, where each object contains a `key` field, into a list of target keys. |
| [`rename_keys`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/rename-keys/) | Rename keys in an event. |
| [`select_entries`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/select-entries/) | Select entries from an event. |

## Mutate string processors

Use mutate string processors to modify the contents or format of string values. The following processors are available.

| Processor | Description |
|-----------|-------------|
| [`substitute_string`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/substitute-string/) | Replace part of a string with a specified value using a regular expression. |
| [`split_string`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/split-string/) | Split a string into a list using a specified delimiter. |
| [`uppercase_string`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/uppercase-string/) | Convert a string to uppercase. |
| [`lowercase_string`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/lowercase-string/) | Convert a string to lowercase. |
| [`trim_string`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/trim-string/) | Remove leading and trailing white space from a string. |

