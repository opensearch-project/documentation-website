---
layout: default
title: copy_values
parent: Processors
grand_parent: Pipelines
nav_order: 45
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/copy-values/
redirect_to: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/copy-values/
---

# copy_values

## Overview

The `copy_values` processor copies values within an event and is a [mutate event](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-event-processors#mutate-event-processors) processor. The following table describes the options you can use to configure the `copy_values` processor.

Option | Required | Type | Description
:--- | :--- | :--- | :---
entries | Yes | List | The list of entries to be copied. Valid values are `from_key`, `to_key`, and `overwrite_if_key_exists`.
from_key | N/A | N/A | The key of the entry to be copied.
to_key | N/A | N/A | The key of the new entry to be added.
overwrite_if_to_key_exists | No | Boolean | If true, the existing value is overwritten if the key already exists within the event. Default value is `false`.

<!---## Configuration

Content will be added to this section.--->
