---
layout: default
title: routes
parent: Processors
grand_parent: Pipelines
nav_order: 90
---

# Routes

Routes define conditions that can be used in sinks for conditional routing. Routes are specified at the same level as processors and sinks under the name `route` and consist of a list of key-value pairs, where the key is the name of a route and the value is an OpenSearch Data Prepper expression representing the routing condition.

## Configuration

The `routes` processor requires the following fields.

| Field | Required | Description |
| :--- | :--- | :--- |
| `default` | No   | A list of processor names to run if no route expressions match. If `default` is not specified and no expressions match, the event is dropped. |
| `routes`  | Yes    | A map where each key is a [Data Prepper expression language]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/) condition, and each value is a list of processors to apply if the condition evaluates to true. |

Each expression is evaluated independently. Events can match multiple routes and be sent through multiple paths.

## Usage

The following pipeline uses the `routes` processor to send error logs to one set of processors and non-error logs to another.

```yaml
pipeline:
  source:
    some-source: {}

  processor:
    - routes:
        routes:
          "event.message contains 'ERROR'": ["error_processors"]
          "event.message contains 'WARN'": ["warn_processors"]
        default: ["info_processors"]

    - error_processors:
        - grok:
            match:
              message: "ERROR %{GREEDYDATA:error_message}"

    - warn_processors:
        - grok:
            match:
              message: "WARN %{GREEDYDATA:warning_message}"

    - info_processors:
        - grok:
            match:
              message: "%{GREEDYDATA:info_message}"

  sink:
    some-sink: {}
```

## When to use

Use the `routes` processor when you need to:

- Apply different parsing or enrichment logic depending on event content.
- Drop or forward specific subsets of events.
- Implement branching logic in your pipeline for flexibility and modularity.

For example, you might use routing to apply different processors for logs from multiple services, environments, or severity levels.
