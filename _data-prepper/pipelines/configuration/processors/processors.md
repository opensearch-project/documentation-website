---
layout: default
title: Processors
has_children: true
parent: Pipelines
nav_order: 35
canonical_url: https://docs.opensearch.org/docs/latest/data-prepper/pipelines/configuration/processors/processors/
---

# Processors

Processors are components within an OpenSearch Data Prepper pipeline that enable you to filter, transform, and enrich events using your desired format before publishing records to the `sink` component. If no `processor` is defined in the pipeline configuration, then the events are published in the format specified by the `source` component. You can incorporate multiple processors within a single pipeline, and they are executed sequentially as defined in the pipeline.

Prior to Data Prepper 1.3, these components were named *preppers*. In Data Prepper 1.3, the term *prepper* was deprecated in favor of *processor*. In Data Prepper 2.0, the term *prepper* was removed.
{: .note }


