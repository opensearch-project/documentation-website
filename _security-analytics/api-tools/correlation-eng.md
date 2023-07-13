---
layout: default
title: Correlation engine APIs
parent: API tools
nav_order: 55
---


# Correlation engine APIs

Correlation engine APIs allow you to perform tasks for the correlation engine.

## Get Correlated Findings

```json
GET /_plugins/_security_analytics/findings/correlate
```

### Query parameters

| Field | Type | Description |
| :--- | :--- |:--- |
| `finding` | Boolean | The primary finding's id |
| `detector_type` | Boolean | The primary finding |
| `nearby_findings` | Boolean | The primary finding |
| `nearby_findings` | Boolean | The primary finding |


### Example request



### Example response

| Field | Type | Description |
| :--- | :--- |:--- |


## Create correlation rules between log types

## List all findings and their correlations within a time window

## List correlations for a finding belonging to a log type












