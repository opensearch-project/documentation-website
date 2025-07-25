---
layout: default
title: rename_keys
parent: Processors
grand_parent: Pipelines
nav_order: 44
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/rename-keys/
redirect_to: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/rename-keys/
---

# rename_keys

## Overview

The `rename_keys` processor renames keys in an event and is a [mutate event](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-event-processors#mutate-event-processors) processor. The following table describes the options you can use to configure the `rename_keys` processor.

Option | Required | Type | Description
:--- | :--- | :--- | :---
entries | Yes | List | List of entries. Valid values are `from_key`, `to_key`, and `overwrite_if_key_exists`. Renaming occurs in the order defined.
from_key | N/A | N/A | The key of the entry to be renamed.
to_key | N/A | N/A | The new key of the entry.
overwrite_if_to_key_exists | No | Boolean | If true, the existing value gets overwritten if `to_key` already exists in the event.

<!---## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section.--->