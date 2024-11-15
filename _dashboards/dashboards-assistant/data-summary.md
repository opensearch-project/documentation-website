---
layout: default
title: Data summary
parent: OpenSearch Assistant for OpenSearch Dashboards
nav_order: 1
has_children: false
---

# Data summary

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

The OpenSearch Dashboards Assistant data summary feature uses large language models (LLMs) to help you generate summaries for data stored in OpenSearch indexes. This tool provides an efficient way to gain insights from large datasets, making it easier to understand and act on the information contained in your OpenSearch indexes.

## Configuration

To configure the data summary feature, use the following steps.

### Prerequisite

Before using the data summary feature, enable query enhancements in OpenSearch Dashboards as follows:

1. On the top menu bar, go to **Management > Dashboards Management**. 
1. In the left navigation pane, select **Advanced settings**.
1. On the settings page, toggle **Enable query enhancements** to **On**.

### Step 1: Enable the data summary feature

To enable the data summary feature, configure the following `opensearch_dashboards.yml` setting:

```yaml
queryEnhancements.queryAssist.summary.enabled: true
```
{% include copy.html %}

### Step 2: Create a data summary agent

To orchestrate data summarization, create a data summary [agent]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/index/#agents). To create an agent, send a `POST /_plugins/_flow_framework/workflow?provision=true` request and provide the agent template as a payload:

<details markdown="block">
  <summary>
    Request
  </summary>
  {: .text-delta}

```json
POST /_plugins/_flow_framework/workflow?provision=true

{
  "name": "Query Assist Agent",
  "description": "Create a Query Assist Agent using Claude on BedRock",
  "use_case": "REGISTER_AGENT",
  "version": {
    "template": "1.0.0",
    "compatibility": ["2.13.0", "3.0.0"]
  },
  "workflows": {
    "provision": {
      "user_params": {},
      "nodes": [
        {
          "id": "create_claude_connector",
          "type": "create_connector",
          "previous_node_inputs": {},
          "user_inputs": {
            "version": "1",
            "name": "Claude instant runtime Connector",
            "protocol": "aws_sigv4",
            "description": "The connector to BedRock service for Claude model",
            "actions": [
              {
                "headers": {
                  "x-amz-content-sha256": "required",
                  "content-type": "application/json"
                },
                "method": "POST",
                "request_body": "{\"prompt\":\"${parameters.prompt}\", \"max_tokens_to_sample\":${parameters.max_tokens_to_sample}, \"temperature\":${parameters.temperature},  \"anthropic_version\":\"${parameters.anthropic_version}\" }",
                "action_type": "predict",
                "url": "https://bedrock-runtime.us-west-2.amazonaws.com/model/anthropic.claude-instant-v1/invoke"
              }
            ],
            "credential": {
                "access_key": "<YOUR_ACCESS_KEY>",
                "secret_key": "<YOUR_SECRET_KEY>",
                "session_token": "<YOUR_SESSION_TOKEN>"
            },
            "parameters": {
              "region": "us-west-2",
              "endpoint": "bedrock-runtime.us-west-2.amazonaws.com",
              "content_type": "application/json",
              "auth": "Sig_V4",
              "max_tokens_to_sample": "8000",
              "service_name": "bedrock",
              "temperature": "0.0001",
              "response_filter": "$.completion",
              "anthropic_version": "bedrock-2023-05-31"
            }
          }
        },
        {
          "id": "register_claude_model",
          "type": "register_remote_model",
          "previous_node_inputs": {
            "create_claude_connector": "connector_id"
          },
          "user_inputs": {
            "description": "Claude model",
            "deploy": true,
            "name": "claude-instant",
            "guardrails": {
              "type": "local_regex",
              "input_guardrail": {
                  "stop_words": [
                      {
                          "index_name": "words0",
                          "source_fields": ["title"]
                      }
                  ],
                  "regex": ["regex1", "regex2"]
              },
              "output_guardrail": {
                  "stop_words": [
                      {
                          "index_name": "words0",
                          "source_fields": ["title"]
                      }
                  ],
                  "regex": ["regex1", "regex2"]
              }
            }
          }
        },
        {
          "id": "TransferQuestionToPPLAndExecuteTool",
          "type": "create_tool",
          "previous_node_inputs": {
            "register_claude_model": "model_id"
          },
          "user_inputs": {
            "type": "PPLTool",
            "name": "TransferQuestionToPPLAndExecuteTool",
            "description": "Use this tool to transfer natural language to generate PPL and execute PPL to query inside. Use this tool after you know the index name, otherwise, call IndexRoutingTool first. The input parameters are: {index:IndexName, question:UserQuestion}",
            "parameters": {
              "response_filter": "$.completion",
              "execute": false
            },
            "include_output_in_agent_response": true
          }
        },
        {
          "id": "summarize_success_tool",
          "type": "create_tool",
          "previous_node_inputs": {
            "register_claude_model": "model_id"
          },
          "user_inputs": {
            "type": "MLModelTool",
            "Name": "SummarizeSuccessTool",
            "description": "Use this tool to summarize a PPL success response in query assist",
            "parameters": {
              "prompt": "\n\nHuman: You will be given a search response, summarize it as a concise paragraph while considering the following:\nUser's question on index '${parameters.index}': ${parameters.question}\nPPL (Piped Processing Language) query used: ${parameters.query}\n\nGive some documents to support your point.\nNote that the output could be truncated, summarize what you see. Don't mention about total items returned and don't mention about the fact that output is truncated if you see 'Output is too long, truncated' in the response.\n\nSkip the introduction; go straight into the summarization.\n\nUse the following pieces of context to answer the users question.\nIf you don't know the answer, just say that you don't know, don't try to make up an answer.\n----------------\n${parameters.response}\n\nAssistant:",
              "response_filter": "$.completion"
            }
          }
        },
        {
          "id": "summarize_error_tool",
          "type": "create_tool",
          "previous_node_inputs": {
            "register_claude_model": "model_id"
          },
          "user_inputs": {
            "type": "MLModelTool",
            "name": "SummarizeErrorTool",
            "description": "Use this tool to summarize a PPL error response in query assist",
            "include_output_in_agent_response": true,
            "parameters": {
              "prompt": "\n\nHuman: You will be given an API response with errors, summarize it as a concise paragraph. Do not try to answer the user's question.\nIf the error cannot be fixed, eg. no such field or function not supported, then give suggestions to rephrase the question.\nIt is imperative that you must not give suggestions on how to fix the error or alternative PPL query, or answers to the question.\n\nConsider the following:\nUser's question on index '${parameters.index}': ${parameters.question}\nPPL (Piped Processing Language) query used: ${parameters.query}\n\nSkip the introduction; go straight into the summarization.\n\nUse the following pieces of context to answer the users question.\nIf you don't know the answer, just say that you don't know, don't try to make up an answer.\n----------------\n${parameters.response}\n\nAssistant:",
              "response_filter": "$.completion"
            }
          }
        },
        {
          "id": "suggestions_tool",
          "type": "create_tool",
          "previous_node_inputs": {
            "register_claude_model": "model_id"
          },
          "user_inputs": {
            "type": "MLModelTool",
            "name": "SuggestionsTool",
            "description": "Use this tool to generate possible questions for an index in query assist",
            "include_output_in_agent_response": true,
            "parameters": {
              "prompt": "\n\nHuman: OpenSearch index: ${parameters.index}\n\nRecommend 2 or 3 possible questions on this index given the fields below. Only give the questions, do not give descriptions of questions and do not give PPL queries.\n\nThe format for a field is\n```\n- field_name: field_type (sample field value)\n```\n\nFields:\n${parameters.fields}\n\nPut each question in a <question> tag.\n\nAssistant:",
              "response_filter": "$.completion"
            }
          }
        },
        {
          "id": "ppl_agent",
          "type": "register_agent",
          "previous_node_inputs": {
            "TransferQuestionToPPLAndExecuteTool": "tools"
          },
          "user_inputs": {
            "parameters": {},
            "app_type": "query_assist",
            "name": "PPL agent",
            "description": "this is the PPL agent",
            "type": "flow"
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

</details>

For sample agent templates, see [Flow Framework sample templates](https://github.com/opensearch-project/flow-framework/tree/2.x/sample-templates). Note the agent ID; you'll use it in the following step.

### Step 3: Create a root agent

Next, create a [root agent]({{site.url}}{{site.baseurl}}/automating-configurations/workflow-tutorial/#root_agent) for the data summary agent created in the previous step:

```json
POST /.plugins-ml-config/_doc/os_data2summary
{
  "type": "os_root_agent",
  "configuration": {
    "agent_id": "<DATA_SUMMARY_AGENT_ID>"
  }
}
```
{% include copy-curl.html %}

This example shows a system index. In security-enabled domains, only super admins have permission to execute this code. For information about making super admin calls, see the [System indexes]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/) guide. For access permission, contact your IT administrator.
{: .warning}

### Step 4: Test the agent

You can verify that the data summary agent was created successfully by calling the agent with an example payload:

```json
POST /_plugins/_ml/agents/<DATA_SUMMARY_AGENT_ID>/_execute
{
  "parameters": {
	"sample_data":"'[{\"_index\":\"90943e30-9a47-11e8-b64d-95841ca0b247\",\"_source\":{\"referer\":\"http://twitter.com/success/gemini-9a\",\"request\":\"/beats/metricbeat/metricbeat-6.3.2-amd64.deb\",\"agent\":\"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)\",\"extension\":\"deb\",\"memory\":null,\"ip\":\"239.67.210.53\",\"index\":\"opensearch_dashboards_sample_data_logs\",\"message\":\"239.67.210.53 - - [2018-08-30T15:29:01.686Z] \\\"GET /beats/metricbeat/metricbeat-6.3.2-amd64.deb HTTP/1.1\\\" 404 2633 \\\"-\\\" \\\"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)\\\"\",\"url\":\"https://artifacts.opensearch.org/downloads/beats/metricbeat/metricbeat-6.3.2-amd64.deb\",\"tags\":\"success\",\"geo\":{\"srcdest\":\"CN:PL\",\"src\":\"CN\",\"coordinates\":{\"lat\":44.91167028,\"lon\":-108.4455092},\"dest\":\"PL\"},\"utc_time\":\"2024-09-05 15:29:01.686\",\"bytes\":2633,\"machine\":{\"os\":\"win xp\",\"ram\":21474836480},\"response\":\"404\",\"clientip\":\"239.67.210.53\",\"host\":\"artifacts.opensearch.org\",\"event\":{\"dataset\":\"sample_web_logs\"},\"phpmemory\":null,\"timestamp\":\"2024-09-05 15:29:01.686\"}}]'",
		"sample_count":1,
		"total_count":383,
		"question":"Are there any errors in my logs?",
		"ppl":"source=opensearch_dashboards_sample_data_logs| where QUERY_STRING(['response'], '4* OR 5*')"}
}
```
{% include copy-curl.html %}

## Generating a data summary

You can generate a data summary by calling the `/api/assistant/data2summary` API endpoint. The `sample_count`, `total_count`, `question`, and `ppl` parameters are optional:

```json
POST /api/assistant/data2summary
{
	"sample_data":"'[{\"_index\":\"90943e30-9a47-11e8-b64d-95841ca0b247\",\"_source\":{\"referer\":\"http://twitter.com/success/gemini-9a\",\"request\":\"/beats/metricbeat/metricbeat-6.3.2-amd64.deb\",\"agent\":\"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)\",\"extension\":\"deb\",\"memory\":null,\"ip\":\"239.67.210.53\",\"index\":\"opensearch_dashboards_sample_data_logs\",\"message\":\"239.67.210.53 - - [2018-08-30T15:29:01.686Z] \\\"GET /beats/metricbeat/metricbeat-6.3.2-amd64.deb HTTP/1.1\\\" 404 2633 \\\"-\\\" \\\"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)\\\"\",\"url\":\"https://artifacts.opensearch.org/downloads/beats/metricbeat/metricbeat-6.3.2-amd64.deb\",\"tags\":\"success\",\"geo\":{\"srcdest\":\"CN:PL\",\"src\":\"CN\",\"coordinates\":{\"lat\":44.91167028,\"lon\":-108.4455092},\"dest\":\"PL\"},\"utc_time\":\"2024-09-05 15:29:01.686\",\"bytes\":2633,\"machine\":{\"os\":\"win xp\",\"ram\":21474836480},\"response\":\"404\",\"clientip\":\"239.67.210.53\",\"host\":\"artifacts.opensearch.org\",\"event\":{\"dataset\":\"sample_web_logs\"},\"phpmemory\":null,\"timestamp\":\"2024-09-05 15:29:01.686\"}}]'",
    "sample_count":1,
    "total_count":383,
    "question":"Are there any errors in my logs?",
    "ppl":"source=opensearch_dashboards_sample_data_logs| where QUERY_STRING(['response'], '4* OR 5*')"
}
```
{% include copy-curl.html %}

The following table describes the Assistant Data Summary API parameters.

Parameter | Required/Optional | Description 
:--- | :--- | :---
`sample_data` | Required | A sample of data returned by the specified query and used as input for summarization.
`question` | Optional | The user's natural language question about the data, which guides the summary generation.
`ppl` | Optional | The Piped Processing Language (PPL) query used to retrieve data; in query assistance, this is generated by the LLM using the user's natural language question.
`sample_count` | Optional | The number of entries included in sample_data.
`total_count` | Optional | The total number of entries in the full query result set.

## Viewing data summaries in OpenSearch Dashboards

To view alert insights in OpenSearch Dashboards, use the following steps:

1. On the top menu bar, go to **OpenSearch Dashboards > Discover**.

1. From the query language dropdown list, select **PPL**. You will see the generated data summary after the query text, as shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/data-summary.png" alt="data summary">