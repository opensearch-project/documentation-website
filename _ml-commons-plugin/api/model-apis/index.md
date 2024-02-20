---
layout: default
title: Model APIs
parent: ML Commons APIs
has_children: true
nav_order: 10
has_toc: false
---

# Model APIs

ML Commons supports the following model-level APIs:

- [Register model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/)
- [Deploy model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/deploy-model/)
- [Get model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/get-model/)
- [Search model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/search-model/)
- [Update model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/update-model/)
- [Undeploy model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/undeploy-model/)
- [Delete model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/delete-model/)
- [Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/) (invokes a model)

## Model access control considerations

For clusters with model access control enabled, users can perform API operations on models in model groups with specified access levels as follows:

- `public` model group: Any user.
- `restricted` model group: Only the model owner or users who share at least one backend role with the model group.
- `private` model group: Only the model owner. 

For clusters with model access control disabled, any user can perform API operations on models in any model group. 

Admin users can perform API operations for models in any model group. 

For more information, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).
