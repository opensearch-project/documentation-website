---
layout: default
title: getEventType()
parent: Functions
grand_parent: Pipelines
nav_order: 45
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/get-eventtype/
---

# getEventType()

The `getEventType()` function returns the internal event type of the current event.

The return value is one of the event types defined in the `EventType.java` file. For example, if the event is an OpenTelemetry trace event, the returned event type is `TRACE`.

Use this function to check the event type before performing conditional processing, as shown in the following example:

```json
getEventType() == "TRACE"
```
{% include copy.html %}
