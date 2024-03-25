---
layout: default
title: Buffers
parent: Pipelines
has_children: true
nav_order: 7
---

# Buffers

The `buffer` component acts as an intermediary layer between the `source` and `sink` components in a Data Prepper pipeline. It serves as a temporary storage for events, decoupling the `source` from the downstream processors and sinks. Buffers can be either in-memory or disk-based. 

If not explicitly specified in the pipeline configuration, Data Prepper uses the default `bounded_blocking` buffer, which is in-memory queue bounded by the number of events it can hold. The `bounded_blocking` buffer is a convenient option when the event volume and processing rates are manageable within the available memory constraints. 

Data Prepper also provides the flexibility to configure alternative buffer types based on your specific requirements. For example, <SME: Please provide a use case example. For example, when can disk-based be used?> 

## Next steps

- Learn more about the buffer types listed under the Related Article section.
