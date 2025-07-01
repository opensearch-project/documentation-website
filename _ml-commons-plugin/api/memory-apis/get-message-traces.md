---
layout: default
title: Get message traces
parent: Memory APIs
grand_parent: ML Commons APIs
nav_order: 70
---

# Get message traces
**Introduced 2.12**
{: .label .label-purple }

Use this API to retrieve message trace information for [conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/). This can be useful for debugging.

For each message, an agent may need to run different tools. You can use the Get Traces API to get all trace data for a message. The trace data includes detailed steps of a message execution.

When the Security plugin is enabled, all memories exist in a `private` security mode. Only the user who created a memory can interact with that memory and its messages.
{: .important}


## Endpoints

```json
GET /_plugins/_ml/memory/message/<message_id>/traces
```

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`message_id` | String | The ID of the message to trace.

#### Example request

```json
GET /_plugins/_ml/memory/message/TAuCZY0BT2tRrkdmCPqZ/traces
```
{% include copy-curl.html %}

#### Example response

```json
{
  "traces": [
    {
      "memory_id": "7Qt4ZY0BT2tRrkdmSPlo",
      "message_id": "TQuCZY0BT2tRrkdmEvpp",
      "create_time": "2024-02-01T16:30:39.719968032Z",
      "input": "Which index has most documents",
      "prompt_template": null,
      "response": "Let me check the document counts of each index",
      "origin": null,
      "additional_info": {},
      "parent_message_id": "TAuCZY0BT2tRrkdmCPqZ",
      "trace_number": 1
    },
    {
      "memory_id": "7Qt4ZY0BT2tRrkdmSPlo",
      "message_id": "TguCZY0BT2tRrkdmEvp7",
      "create_time": "2024-02-01T16:30:39.732979687Z",
      "input": "",
      "prompt_template": null,
      "response": """health    status    index    uuid    pri    rep    docs.count    docs.deleted    store.size    pri.store.size
green    open    .plugins-ml-model-group    lHgGEgJhT_mpADyOZoXl2g    1    1    9    2    33.4kb    16.7kb
green    open    .plugins-ml-memory-meta    b2LEpv0QS8K60QBjXtRm6g    1    1    13    0    117.5kb    58.7kb
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
green    open    security-auditlog-2024.02.01    2VD1ieDGS5m-TfjIdfT8Eg    1    1    36386    0    37mb    18.2mb
green    open    opensearch_dashboards_sample_data_ecommerce    wnE6r7OvSPqc5YHj8wHSLA    1    1    4675    0    8.8mb    4.4mb
green    open    security-auditlog-2024.01.31    cNRK5-2eTwes0SRlXTl0RQ    1    1    34520    0    20.5mb    9.8mb
green    open    .plugins-ml-memory-message    wTNBU4BBQVSFcFhNlUdfBQ    1    1    88    1    399.7kb    205kb
green    open    .plugins-flow-framework-state    dJUNDv9MSJ2jjwKbzXPlrw    1    1    39    0    114.1kb    57kb
green    open    .plugins-ml-agent    7X1IzoLuSGmIujOh9i5mmg    1    1    27    0    146.6kb    73.3kb
green    open    .plugins-flow-framework-templates    _ecC0KahTlmG_3tFUst7Uw    1    1    18    0    175.8kb    87.9kb
green    open    .plugins-ml-connector    q45iJfVjQ5KgxeNC65DLSw    1    1    11    0    313.1kb    156.5kb
green    open    .kibana_1    vRjXK4bHSUueB_4iXiQ8yw    1    1    257    0    264kb    132kb
green    open    .plugins-ml-config    G7gxGQB7TZeQzBasHd5PUg    1    1    1    0    7.8kb    3.9kb
green    open    .plugins-ml-controller    NQTZPREZRhWoDdjCglRLFg    1    1    0    0    50.1kb    49.9kb
green    open    opensearch_dashboards_sample_data_logs    9gpOTB3rRgqBLvqis_k5LQ    1    1    14074    0    18mb    9mb
green    open    .plugins-flow-framework-config    JlKPsCh6SEq-Jh6rPL_x9Q    1    1    1    0    7.8kb    3.9kb
green    open    opensearch_dashboards_sample_data_flights    pJde0irnTce4-uobHwYmMQ    1    1    13059    0    11.9mb    5.9mb
green    open    my_test_data    T4hwNs7CTJGIfw2QpCqQ_Q    1    1    6    0    91.7kb    45.8kb
green    open    .opendistro-job-scheduler-lock    XjgmXAVKQ4e8Y-ac54VBzg    1    1    3    0    38.7kb    19.4kb
""",
      "origin": "ListIndexTool",
      "additional_info": {},
      "parent_message_id": "TAuCZY0BT2tRrkdmCPqZ",
      "trace_number": 2
    },
    {
      "memory_id": "7Qt4ZY0BT2tRrkdmSPlo",
      "message_id": "UwuCZY0BT2tRrkdmHPos",
      "create_time": "2024-02-01T16:30:42.217897656Z",
      "input": "Which index has most documents",
      "prompt_template": null,
      "response": "Based on the cluster health information provided, the index with the most documents is .plugins-ml-model with 191 documents",
      "origin": null,
      "additional_info": {},
      "parent_message_id": "TAuCZY0BT2tRrkdmCPqZ",
      "trace_number": 3
    },
    {
      "memory_id": "7Qt4ZY0BT2tRrkdmSPlo",
      "message_id": "UQuCZY0BT2tRrkdmHPos",
      "create_time": "2024-02-01T16:30:42.218120716Z",
      "input": "Which index has most documents",
      "prompt_template": null,
      "response": "The index with the most documents is the .plugins-ml-model index, which contains 191 documents based on the cluster health information provided.",
      "origin": null,
      "additional_info": {},
      "parent_message_id": "TAuCZY0BT2tRrkdmCPqZ",
      "trace_number": 4
    },
    {
      "memory_id": "7Qt4ZY0BT2tRrkdmSPlo",
      "message_id": "UguCZY0BT2tRrkdmHPos",
      "create_time": "2024-02-01T16:30:42.218240713Z",
      "input": "Which index has most documents",
      "prompt_template": null,
      "response": "The index with the most documents is the .plugins-ml-model index, which contains 191 documents based on the cluster health information provided.",
      "origin": null,
      "additional_info": {},
      "parent_message_id": "TAuCZY0BT2tRrkdmCPqZ",
      "trace_number": 5
    }
  ]
}
```

## Response body fields

For information about response fields, see [Create Message request fields]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/create-message#request-body-fields).