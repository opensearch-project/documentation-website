---
layout: default
title: Delete agent
parent: Agent APIs
grand_parent: ML Commons APIs
nav_order: 50
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/agent-apis/delete-agent/
---

# Delete an agent
**Introduced 2.12**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/ml-commons/issues/1161).    
{: .warning}

You can use this API to delete an agent based on the `agent_id`.

## Path and HTTP methods

```json
DELETE /_plugins/_ml/agents/<agent_id>
```

#### Example request

```json
DELETE /_plugins/_ml/agents/MzcIJX8BA7mbufL6DOwl
```
{% include copy-curl.html %}

#### Example response

```json
{
  "_index" : ".plugins-ml-agent",
  "_id" : "MzcIJX8BA7mbufL6DOwl",
  "_version" : 2,
  "result" : "deleted",
  "_shards" : {
    "total" : 2,
    "successful" : 2,
    "failed" : 0
  },
  "_seq_no" : 27,
  "_primary_term" : 18
}
```