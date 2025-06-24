---
layout: default
title: Controller APIs
parent: ML Commons APIs
has_children: true
has_toc: false
nav_order: 60
redirect_from: /ml-commons-plugin/api/controller-apis/
canonical_url: https://docs.opensearch.org/docs/latest/ml-commons-plugin/api/controller-apis/index/
---

# Controller APIs
**Introduced 2.12**
{: .label .label-purple }

You can configure a rate limit for a specific user or users of a model by calling the Controller APIs. 

ML Commons supports the following controller-level APIs:

- [Create or update controller]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/controller-apis/create-controller/)
- [Get controller]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/controller-apis/get-controller/)
- [Delete controller]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/controller-apis/delete-controller/)

## Required permissions

To call the Controller APIs, you must have `cluster:admin/opensearch/ml/controllers/` permissions. Links to more information about each Controller API are provided in the preceding section.