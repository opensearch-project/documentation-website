---
layout: default
title: getEventType()
parent: Functions
grand_parent: Pipelines
nav_order: 45
---

# getEventType()

The `getEventType()` function returns the internal event type of the current event.

The return value is one of the event types defined in the `EventType.java`. For example, if the event is an OpenTelemetry (Otel) trace event, the returned event type is `TRACE`.

Use this function to check the event type before performing conditional processing, as shown in the following example:

```json
getEventType() == "TRACE"
```
{% include copy.html %}
