---
layout: default
title: getEventType()
parent: Functions
grand_parent: Pipelines
nav_order: 45
---

# getEventType()

The `getEventType()` function returns the internal event type of the current event.

The value returned is one of the event types defined in [EventType.java](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/event/EventType.java). For example, if the event is Otel trace event, event type returned is "TRACE" and so on.

This function can be used to check event type of the event before doing some processing as follows:

```
getEventType() == "TRACE"
```
{% include copy.html %}
