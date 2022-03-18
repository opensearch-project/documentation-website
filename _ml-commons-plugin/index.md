---
layout: default
title: About ML Commons
nav_order: 38
has_children: false
has_toc: false
---

# ML Commons plugin

ML Commons for OpenSearch eases the development of machine learning features by providing a set of common machine learning (ML) algorithms through transport and REST API calls. Those calls choose the right nodes and resources for each ML request and monitors ML tasks to ensure uptime. This allows you to leverage existing open-source ML algorithms and reduce the effort required to develop new ML features. 

Models trained through the ML Commons plugin support two types of algorithms: 

- Model-based algorithms such kmeans or Linear Regression. To get the best results, make sure you train your model first, then use the model to apply predictions. Linear Regression is only supported 
- No-model based algorithm such as RCA. These algorithms can be executed directly through an `Executable` interface. 

Interaction with the ML commons plugin occurs through either the [REST API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api) or [AD]({{site.url}}{{site.baseurl}}/ppl/commands#ad) and [kmeans]({{site.url}}{{site.baseurl}}/observability-plugin/ppl/commands#kmeans) PPL commands.

## Permissions

There are two user roles that can make use of the ML commons plugin. 

- `ml_full_access`: Full access to all ML features, including starting new jobs and reading or deleting models.
- `ml_readonly_access`: Can only read trained models and statistics relevant to the model's cluster. Cannot start jobs or delete models.









