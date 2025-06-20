---
layout: default
title: Concepts
nav_order: 10
grand_parent: OpenSearch Data Prepper 
parent: Getting started with OpenSearch Data Prepper
---

# Key concepts and fundamentals

Data Prepper ingests data through customizable [pipelines]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines/). These pipelines consist of pluggable components that you can customize to fit your needs, even allowing you to plug in your own implementations. A Data Prepper pipeline consists of the following components: 

- One [source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/sources/)
- One or more [sinks]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/sinks/)
- (Optional) One [buffer]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/buffers/buffers/)
- (Optional) One or more [processors]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/processors/)

Each pipeline contains two required components: `source` and `sink`. If a `buffer`, a `processor`, or both are missing from the pipeline, then Data Prepper uses the default `bounded_blocking` buffer and a no-op processor. Note that a single instance of Data Prepper can have one or more pipelines. 

<!----Add additional concepts here---->