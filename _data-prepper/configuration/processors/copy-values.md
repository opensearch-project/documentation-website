---
layout: default
title: copy_values
parent: Processors
nav_order: 45
---

# copy_values

## Overview

Copy values within an event. `copy_values`  is part of [mutate event](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-event-processors#mutate-event-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
entries | Yes | List | List of entries to be copied. Valid values are `from_key`, `to_key`, and `overwrite_if_key_exists`.
from_key | N/A | N/A | The key of the entry to be copied.
to_key | N/A | N/A | The key of the new entry to be added.
overwrite_if_to_key_exists | No | Boolean | If true, the existing value is overwritten if the key already exists within the event. Default is `false`.

## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section.