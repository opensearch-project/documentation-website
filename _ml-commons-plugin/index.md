---
layout: default
title: About ML Commons
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
---

# ML Commons plugin

ML Commons for OpenSearch eases the development of machine learning features by providing a set of common machine learning (ML) algorithms through transport and REST API calls. Those calls choose the right nodes and resources for each ML request and monitors ML tasks to ensure uptime. This allows you to leverage existing open-source ML algorithms and reduce the effort required to develop new ML features.

Interaction with the ML Commons plugin occurs through either the [REST API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api) or [`ad`]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/functions#ad) and [`kmeans`]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/functions#kmeans) Piped Processing Language (PPL) commands.

Models [trained]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api#training-the-model) through the ML Commons plugin support model-based algorithms such as k-means. After you've trained a model enough so that it meets your precision requirements, you can apply the model to [predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api#predict) new data safely. 

Should you not want to use a model, you can use the [Train and Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api#train-and-predict) API to test your model without having to evaluate the model's performance.

# Permissions

The ML Commons plugin has two reserved roles:

- `ml_full_access`: Grants full access to all ML features, including starting new ML tasks and reading or deleting models.
- `ml_readonly_access`: Grants read-only access to ML tasks, trained models, and statistics relevant to the model's cluster. Does not grant permissions to start or delete ML tasks or models.

## ML node

To prevent your cluster from failing when running ML tasks, you configure a node with the `ml` node role. When configuring without the `data` node role, ML nodes will not store any shards and will calculate resource requirements at runtime. To use an ML node, create a node in your `opensearch.yml` file. Give your node a custom name and define the node role as `ml`:

```yml
node.name: ml-node
node.roles: [ ml ]
```
