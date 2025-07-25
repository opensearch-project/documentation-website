---
layout: default
title: Sources
parent: Pipelines
has_children: true
nav_order: 110
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/sources/sources/
---

# Sources

A `source` is an input component that specifies how a Data Prepper pipeline ingests events. Each pipeline has a single source that either receives events over HTTP(S) or reads from external endpoints, such as OpenTelemetry Collector or Amazon Simple Storage Service (Amazon S3). Sources have configurable options based on the event format (string, JSON, Amazon CloudWatch logs, OpenTelemtry traces). The source consumes events and passes them to the [`buffer`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/buffers/buffers/) component.


