---
layout: default
title: delete_entries
parent: Processors
grand_parent: Pipelines
nav_order: 45
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/delete-entries/
redirect_to: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/delete-entries/
---

# delete_entries

## Overview

The `delete_entries` processor deletes entries in an event and is a [mutate event](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-event-processors#mutate-event-processors) processor. The following table describes the options you can use to configure the `delete-entries` processor.

Option | Required | Type | Description
:--- | :--- | :--- | :---
with_keys | Yes | List |  An array of keys of the entries to be deleted.

<!---## Configuration

Content will be added to this section.--->
