---
layout: default
title: Mutate event
parent: Processors
grand_parent: Pipelines
nav_order: 65
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/mutate-event/
redirect_to: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/mutate-event/
---

# Mutate event processors

Mutate event processors allow you to modify events in Data Prepper. The following processors are available:

* [add_entries]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/add-entries/) allows you to add entries to an event.
* [convert_entry_type]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/convert_entry_type/) allows you to convert value types in an event.
* [copy_values]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/copy-values/) allows you to copy values within an event.
* [delete_entries]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/delete-entries/) allows you to delete entries from an event.
* [list_to_map]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/list-to-map) allows you to convert list of objects from an event where each object contains a `key` field into a map of target keys.
* [map_to_list]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/map-to-list/) allows you to convert a map of objects from an event, where each object contains a `key` field, into a list of target keys.
* [rename_keys]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/rename-keys/) allows you to rename keys in an event.
* [select_entries]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/select-entries/) allows you to select entries from an event.




