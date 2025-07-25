---
layout: default
title: Buffers
parent: Pipelines
has_children: true
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/buffers/buffers/
---

# Buffers

The `buffer` component acts as an intermediary layer between the `source` and `sink` components in a Data Prepper pipeline. It serves as temporary storage for events, decoupling the `source` from the downstream processors and sinks. Buffers can be either in-memory or disk based. 

If not explicitly specified in the pipeline configuration, Data Prepper uses the default `bounded_blocking` buffer, which is an in-memory queue bounded by the number of events it can store. The `bounded_blocking` buffer is a convenient option when the event volume and processing rates are manageable within the available memory constraints. 


