---
layout: default
title: add_entries
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# add_entries

## Overview

Adds an entry to event. `add_entries` is part of [mutate event](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-event-processors#mutate-event-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
entries | Yes | List | List of events to be added. Valid entries are `key`, `value`, and `overwrite_if_key_exists`.
key | N/A | N/A | Key of the new event to be added.
value | N/A | N/A | Value of the new entry to be added. Valid data types are strings, booleans, numbers, null, nested objects, and arrays containing the aforementioned data types.
overwrite_if_key_exists | No | Boolean | If true, the existing value gets overwritten if the key already exists within the event. Default is `false`.

<!--- ## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section.---->