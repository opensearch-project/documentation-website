---
layout: default
title: List Index tool
has_children: false
has_toc: false
nav_order: 35
parent: Tools
grand_parent: Agents and tools
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/list-index-tool/
---

<!-- vale off -->
# List Index tool
**Introduced 3.0**
{: .label .label-purple }
<!-- vale on -->

The `ListIndexTool` retrieves index information for the OpenSearch cluster, similarly to the [List Indices API]({{site.url}}{{site.baseurl}}/api-reference/list/list-indices/).

The `ListIndexTool` replaces the `CatIndexTool` starting with OpenSearch version 3.0.
{: .note}

## Step 1: Register a flow agent that will run the ListIndexTool

A flow agent runs a sequence of tools in order and returns the last tool's output. To create a flow agent, send the following register agent request:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_ListIndex_tool",
  "type": "flow",
  "description": "this is a test agent for the ListIndexTool",
  "tools": [
    {
      "type": "ListIndexTool",
      "name": "DemoListIndexTool",
      "parameters": {
        "input": "${parameters.question}"
      }
    }
  ]
}
```
{% include copy-curl.html %} 

For parameter descriptions, see [Register parameters](#register-parameters).

OpenSearch responds with an agent ID:

```json
{
  "agent_id": "9X7xWI0Bpc3sThaJdY9i"
}
```

## Step 2: Run the agent

Before you run the agent, make sure that you add the sample OpenSearch Dashboards `Sample eCommerce orders` dataset. To learn more, see [Adding sample data]({{site.url}}{{site.baseurl}}/dashboards/quickstart#adding-sample-data).

Then, run the agent by sending the following request:

```json
POST /_plugins/_ml/agents/9X7xWI0Bpc3sThaJdY9i/_execute
{
  "parameters": {
    "question": "How many indices do I have?"
  }
}
```
{% include copy-curl.html %} 

OpenSearch returns the index information:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": """health    status    index    uuid    pri    rep    docs.count    docs.deleted    store.size    pri.store.size
green    open    .plugins-ml-model-group    lHgGEgJhT_mpADyOZoXl2g    1    1    9    2    33.4kb    16.7kb
green    open    .plugins-ml-memory-meta    b2LEpv0QS8K60QBjXtRm6g    1    1    13    0    95.1kb    47.5kb
green    open    .ql-datasources    9NXm_tMXQc6s_4uRToSNkQ    1    1    0    0    416b    208b
green    open    sample-ecommerce    UPYOQcAfRGqFAlSxcZlRjw    1    1    40320    0    4.1mb    2mb
green    open    .plugins-ml-task    xYTlprYCQnaaYici69SOjA    1    1    117    0    115.5kb    57.6kb
green    open    .opendistro_security    7DAqhm9QQmeEsQYhA40cJg    1    1    10    0    117kb    58.5kb
green    open    sample-host-health    Na5tq6UiTt6r_qYME1vV-w    1    1    40320    0    2.6mb    1.3mb
green    open    .opensearch-observability    6PthtLluSKyYCdZR3Mw0iw    1    1    0    0    416b    208b
green    open    .plugins-ml-model    WYcjBHcnRuSDHeVWPVupoA    1    1    191    45    4.2gb    2.1gb
green    open    index_for_neural_sparse    GQswGabQRIazM_trnqaDrw    1    1    5    0    28.4kb    14.2kb
green    open    security-auditlog-2024.01.30    BhXR7Nd3QVOVGxJNpR0-jw    1    1    27768    0    13.8mb    7mb
green    open    sample-http-responses    0gmYYYdOTiCbVUvl_uDL0w    1    1    40320    0    2.5mb    1.2mb
green    open    security-auditlog-2024.02.01    2VD1ieDGS5m-TfjIdfT8Eg    1    1    39305    0    39mb    18.6mb
green    open    opensearch_dashboards_sample_data_ecommerce    wnE6r7OvSPqc5YHj8wHSLA    1    1    4675    0    8.8mb    4.4mb
green    open    security-auditlog-2024.01.31    cNRK5-2eTwes0SRlXTl0RQ    1    1    34520    0    20.5mb    9.8mb
green    open    .plugins-ml-memory-message    wTNBU4BBQVSFcFhNlUdfBQ    1    1    93    0    358.2kb    181.9kb
green    open    .plugins-flow-framework-state    dJUNDv9MSJ2jjwKbzXPlrw    1    1    39    0    114.1kb    57kb
green    open    .plugins-ml-agent    7X1IzoLuSGmIujOh9i5mmg    1    1    30    0    170.7kb    85.3kb
green    open    .plugins-flow-framework-templates    _ecC0KahTlmG_3tFUst7Uw    1    1    18    0    175.8kb    87.9kb
green    open    .plugins-ml-connector    q45iJfVjQ5KgxeNC65DLSw    1    1    11    0    313.1kb    156.5kb
green    open    .kibana_1    vRjXK4bHSUueB_4iXiQ8yw    1    1    257    0    264kb    132kb
green    open    .plugins-ml-config    G7gxGQB7TZeQzBasHd5PUg    1    1    1    0    7.8kb    3.9kb
green    open    .plugins-ml-controller    NQTZPREZRhWoDdjCglRLFg    1    1    0    0    50.1kb    49.9kb
green    open    opensearch_dashboards_sample_data_logs    9gpOTB3rRgqBLvqis_k5LQ    1    1    14074    0    18mb    9mb
green    open    .plugins-flow-framework-config    JlKPsCh6SEq-Jh6rPL_x9Q    1    1    1    0    7.8kb    3.9kb
green    open    opensearch_dashboards_sample_data_flights    pJde0irnTce4-uobHwYmMQ    1    1    13059    0    11.9mb    5.9mb
green    open    my_test_data    T4hwNs7CTJGIfw2QpCqQ_Q    1    1    6    0    91.7kb    45.8kb
green    open    .opendistro-job-scheduler-lock    XjgmXAVKQ4e8Y-ac54VBzg    1    1    3    3    36.2kb    21.3kb
"""
        }
      ]
    }
  ]
}
```

## Register parameters

The following table lists all tool parameters that are available when registering an agent.

Parameter | Type | Required/Optional | Description
:--- | :--- | :--- | :---
`indices` | String | Optional | A comma-delimited list of one or more indexes on which to run the list index operation. Default is an empty list, which means all indexes.
`local` | Boolean | Optional | When `true`, retrieves information from the local node only instead of the cluster manager node. Default is `false`.
`page_size` | Integer | Optional | Specifies the number of index results returned per page when using the List Indices API. The API retrieves index status in a paginated manner. Default is `100`.

## Execute parameters

The following table lists all tool parameters that are available when running the agent.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`question` | String | Required | The natural language question to send to the LLM. 