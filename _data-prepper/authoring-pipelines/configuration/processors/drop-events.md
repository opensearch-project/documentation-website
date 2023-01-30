---
layout: default
title: drop_events
parent: Processors
grand_parent: Authoring pipelines
nav_order: 45
---

# drop_events

## Overview

Drops all the events that are passed into this processor.

Option | Required | Type | Description
:--- | :--- | :--- | :---
drop_when | Yes | String | Accepts a Data Prepper Expression string following the [Data Prepper Expression Syntax](https://github.com/opensearch-project/data-prepper/blob/main/docs/expression_syntax.md). Configuring `drop_events` with `drop_when: true` drops all the events received.
handle_failed_events | No | Enum | Specifies how exceptions are handled when an exception occurs while evaluating an event. Default value is `drop`, which drops the event so it doesn't get sent to OpenSearch. Available options are `drop`, `drop_silently`, `skip`, `skip_silently`. For more information, see [handle_failed_events](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/drop-events-processor#handle_failed_events).

<!---## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section.--->