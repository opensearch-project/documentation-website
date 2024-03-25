---
layout: default
title: Sources
parent: Pipelines
has_children: true
nav_order: 5
---

# Sources

The `source` is the input component that specifies how a Data Prepper pipeline ingests events. Each pipeline has a single source that either receives events over HTTP(S) or reads from external endpoints like OTel Collector for traces or metrics and Amazon S3. Sources have configurable options based on the event format (string, JSON, Amazon CloudWatch logs, OpenTelemtry traces). The source consumes events and passes them to the [`buffer`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/buffers/buffers/) component.

## Next steps 

- Learn more about the source types listed under the Related Articles section.
