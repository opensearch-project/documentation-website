---
layout: default
title: trim_string
parent: Processors
grand_parent: Pipelines
nav_order: 45
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/trim-string/
redirect_to: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/trim-string/
---

# trim_string

## Overview

The `trim_string` processor removes whitespace from the beginning and end of a key and is a [mutate string](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-string-processors#mutate-string-processors) processor. The following table describes the option you can use to configure the `trim_string` processor.

Option | Required | Type | Description
:--- | :--- | :--- | :---
with_keys | Yes | List | A list of keys to trim the whitespace from.

<!---## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section.--->