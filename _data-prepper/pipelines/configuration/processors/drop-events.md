---
layout: default
title: drop_events
parent: Processors
grand_parent: Pipelines
nav_order: 53
---

# drop_events


The `drop_events` processor drops all the events that are passed into it. The following table describes when events are dropped and how exceptions for dropping events are handled. 

Option | Required | Type | Description
:--- | :--- | :--- | :---
drop_when | Yes | String | Accepts a Data Prepper expression string following the [Data Prepper Expression Syntax]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/). Configuring `drop_events` with `drop_when: true` drops all the events received.
handle_failed_events | No | Enum | Specifies how exceptions are handled when an exception occurs while evaluating an event. Default value is `drop`, which drops the event so that it is not sent to OpenSearch. Available options are `drop`, `drop_silently`, `skip`, and `skip_silently`. For more information, see [handle_failed_events](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/drop-events-processor#handle_failed_events).

<!---## Configuration

Content will be added to this section.--->
