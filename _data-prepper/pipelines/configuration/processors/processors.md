---
layout: default
title: Processors
has_children: true
parent: Pipelines
nav_order: 8
---

# Processors

Processors are components within a Data Prepper pipeline that enable you to filter, transform, and enrich events to your desired format before publishing records to the `sink` component. If no `processor` is defined in the pipeline configuration, the events are published in the format specified by the `source` component. You can incorporate multiple processors within a single pipeline, and they are executed sequentially as defined in the pipeline.

Prior to Data Prepper 1.3, these components were named "preppers." Starting with Data Prepper 1.3, the term "prepper" has been deprecated in favor of "processor." Starting with Data Prepper 2.0, the term "prepper" has been removed.
{: .note }

## Next steps

- Learn about the processor types listed under the Related Articles section.