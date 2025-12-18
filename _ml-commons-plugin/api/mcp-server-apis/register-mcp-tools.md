---
layout: default
title: Register MCP tools 
parent: MCP server APIs
grand_parent: ML Commons APIs
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/mcp-server-apis/register-mcp-tools/
---

# Register MCP Tools API
**Introduced 3.0**

Use this API to register one or more Model Context Protocol (MCP)-based tools. For more information about supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).

## Endpoints

```json
POST /_plugins/_ml/mcp/tools/_register
```

## Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- | :--- 
`tools` | Array | Required | A list of tools. 


The `tools` array contains a list of tools. Each tool contains the following fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :---
`name`| String | Optional | The tool name. The tool name defaults to the `type` parameter value. If you need to include multiple tools of the same type in the MCP server, specify different names for the tools. |
`type` | String | Required | The tool type. For a list of supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/). 
`description` | String | Optional | The description of the tool.
`parameters` | Object | Optional | The parameters for the tool. The parameters are dependent on the tool type. For information about specific tool types, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).
`attributes` | Object | Optional | The configuration properties (attributes) for the tool. The most important attribute in this field is the tool's `input_schema`, which defines the expected parameter format for the tool. This schema is sent to the large language model (LLM) so it can properly format parameters when executing the tool.

## Example requests

The [built-in tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/) are categorized as either zero-configuration tools (no parameters required) or parameterized tools (require parameters). Zero-configuration tools use a standard initialization process and thus have the same request body because no parameters are required. In contrast, for parameterized tools, you must provide the correct initialization parameters to ensure the tool functions as expected. 

### Example request: Zero-configuration tools

<details markdown="block">
  <summary>
    Example request
  </summary>

```json
{
    "tools": [
        {
            "name": "ListIndexTool",
            "type": "ListIndexTool",
            "description": "This tool gets index information from the OpenSearch cluster. It takes 2 optional arguments named `indices` which is a comma-delimited list of one or more indices to get information from (default is an empty list meaning all indices), and `local` which means whether to return information from the local node only instead of the cluster manager node (default is false). The tool returns the indices information, including `health`, `status`, `index`, `uuid`, `pri`, `rep`, `docs.count`, `docs.deleted`, `store.size`, `pri.store. size `, `pri.store.size`, `pri.store`.",
            "attributes": {
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "indices": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            },
                            "description": "OpenSearch index name list, separated by comma. for example: [\"index1\", \"index2\"], use empty array [] to list all indices in the cluster"
                        }
                    },
                    "additionalProperties": false
                }
            }
        },
        {
          "name": "SearchIndexTool",
          "type": "SearchIndexTool",
          "description": "Use this tool to search an index by providing two parameters: 'index' for the index name, and 'query' for the OpenSearch DSL formatted query. Only use this tool when both index name and DSL query is available.",
          "attributes": {
            "input_schema": {
              "type": "object",
              "properties": {
                "index": {
                  "type": "string"
                },
                "query": {
                  "type": "string"
                }
              },
              "additionalProperties": false
            }
          }
        },
        {
          "name": "IndexMappingTool",
          "type": "IndexMappingTool",
          "description": "This tool gets index mapping information from a certain index. It takes 1 required argument named 'index' which is a comma-delimited list of one or more indices to get mapping information from, which expands wildcards. It takes 1 optional argument named 'local' which means whether to return information from the local node only instead of the cluster manager node (Default is false). The tool returns a list of index mappings and settings for each index. The mappings are in JSON format under the key 'properties' which includes the field name as a key and a JSON object with field type under the key 'type'. The settings are in flattened map with 'index' as the top element and key-value pairs for each setting.",
          "attributes": {
            "input_schema": {
              "type": "object",
              "properties": {
                "index": {
                  "type": "array",
                  "description": "OpenSearch index name list, separated by comma. for example: [\"index1\", \"index2\"]",
                  "items": {
                      "type": "string"
                  }
                }
              },
              "required": [
                  "index"
              ],
              "additionalProperties": false
            }
          }
        },
        {
          "name": "SearchAlertsTool",
          "type": "SearchAlertsTool",
          "description": "Use this tool to search an index by providing two parameters: 'index' for the index name, and 'query' for the OpenSearch DSL formatted query. Only use this tool when both index name and DSL query is available.",
          "attributes": {
            "input_schema": {
              "type": "object",
              "properties": {
                "index": {
                  "type": "string",
                  "description": "OpenSearch index name. for example: index1"
                },
                "query": {
                  "type": "object",
                  "description": "OpenSearch search index query. You need to get index mapping to write correct search query. It must be a valid OpenSearch query. Valid value:\n{\"query\":{\"match\":{\"population_description\":\"seattle 2023 population\"}},\"size\":2,\"_source\":\"population_description\"}\nInvalid value: \n{\"match\":{\"population_description\":\"seattle 2023 population\"}}\nThe value is invalid because the match not wrapped by \"query\".",
                  "additionalProperties": false
                }
              },
              "required": ["index", "query"],
              "additionalProperties": false
            }
          }
        },
        {
          "name": "SearchAnomalyDetectorsTool",
          "type": "SearchAnomalyDetectorsTool",
          "description": "This is a tool that searches anomaly detectors. It takes 12 optional arguments named detectorName which is the explicit name of the detector (default is null), and detectorNamePattern which is a wildcard query to match detector name (default is null), and indices which defines the index or index pattern the detector is detecting over (default is null), and highCardinality which defines whether the anomaly detector is high cardinality (synonymous with multi-entity) of non-high-cardinality (synonymous with single-entity) (default is null, indicating both), and lastUpdateTime which defines the latest update time of the anomaly detector in epoch milliseconds (default is null), and sortOrder which defines the order of the results (options are asc or desc, and default is asc), and sortString which defines how to sort the results (default is name.keyword), and size which defines the size of the request to be returned (default is 20), and startIndex which defines the paginated index to start from (default is 0), and running which defines whether the anomaly detector is running (default is null, indicating both), and failed which defines whether the anomaly detector has failed (default is null, indicating both). The tool returns 2 values: a list of anomaly detectors (each containing the detector id, detector name, detector type indicating multi-entity or single-entity (where multi-entity also means high-cardinality), detector description, name of the configured index, last update time in epoch milliseconds), and the total number of anomaly detectors.",
          "attributes": {
            "input_schema": {
              "type": "object",
              "properties": {
                "detectorName": {
                  "type": "string",
                  "description": "Anomaly detector name"
                },
                "detectorNamePattern": {
                  "type": "string",
                  "description": "Anomaly detector name pattern"
                },
                "indices": {
                    "type": "string",
                    "description": "The index name that anomaly detector uses"
                },
                "highCardinality": {
                    "type": "string",
                    "description": "The value is true of false, the detector type will be set to MULTI_ENTITY if it's value is true, otherwise SINGLE_ENTITY if it's false"
                },
                "lastUpdateTime": {
                    "type": "string",
                    "description": "The last update time of the anomaly detector"
                },
                "sortString": {
                    "type": "string",
                    "description": "The sort key of the search result, default value is `name.keyword` which means the sorting is based on the detector name"
                },
                "sortOrder": {
                    "type": "string",
                    "description": "The search result order is based on this value, default is asc which means the sorting is in ascending manner."
                },
                "size": {
                    "type": "string",
                    "description": "This value controls how many search results will be fetched, default value is 20 which means at most 20 anomaly detecotrs can return"
                },
                "startIndex": {
                    "type": "string",
                    "description": "The start index of the search, default value is 0 which means starts from the beginning"
                },
                "running": {
                    "type": "string",
                    "description": "The running status of the anomaly detector, valid values are true and false, default is null"
                },
                "failed": {
                    "type": "string",
                    "description": "The failed status of the anomaly detector, valid values are true and false, default is null"
                }
              },
              "additionalProperties": false
            }
          }
        },
        {
          "name": "SearchAnomalyResultsTool",
          "type": "SearchAnomalyResultsTool",
          "description": "This is a tool that searches anomaly results. It takes 9 arguments named detectorId which defines the detector ID to filter for (default is null), and realtime which defines whether the anomaly results are from a realtime detector (set to false to only get results from historical analyses) (default is null), and anomalyGradeThreshold which defines the threshold for anomaly grade (a number between 0 and 1 that indicates how anomalous a data point is) (default is greater than 0), and dataStartTime which defines the start time of the anomaly data in epoch milliseconds (default is null), and dataEndTime which defines the end time of the anomaly data in epoch milliseconds (default is null), and sortOrder which defines the order of the results (options are asc or desc, and default is desc), and sortString which defines how to sort the results (default is data_start_time), and size which defines the number of anomalies to be returned (default is 20), and startIndex which defines the paginated index to start from (default is 0). The tool returns 2 values: a list of anomaly results (where each result contains the detector ID, the anomaly grade, and the confidence), and the total number of anomaly results.",
          "attributes": {
            "input_schema": {
              "type": "object",
              "properties": {
                "detectorId": {
                  "type": "string",
                  "description": "Anomaly detector id"
                },
                "realTime": {
                  "type": "string",
                  "description": "If the anomaly detector a real time one, valid values are true and false, default is null"
                },
                "anomalyGradeThreshold": {
                    "type": "string",
                    "description": "A float number to indicate the anomaly grade"
                },
                "dataStartTime": {
                    "type": "string",
                    "description": "Start time of the data in the anomaly detector"
                },
                "dataEndTime": {
                    "type": "string",
                    "description": "End time of the data in the anomaly detector"
                },
                "sortString": {
                    "type": "string",
                    "description": "The sort key of the search result, default value is `name.keyword` which means the sorting is based on the detector name"
                },
                "sortOrder": {
                    "type": "string",
                    "description": "The search result order is based on this value, default is asc which means the sorting is in ascending manner."
                },
                "size": {
                    "type": "string",
                    "description": "This value controls how many search results will be fetched, default value is 20 which means at most 20 anomaly detecotrs can return"
                },
                "startIndex": {
                    "type": "string",
                    "description": "The start index of the search, default value is 0 which means starts from the beginning"
                }
              },
              "additionalProperties": false
            }
          }
        },
        {
          "name": "SearchMonitorsTool",
          "type": "SearchMonitorsTool",
          "description": "This is a tool that searches alerting monitors. It takes 10 optional arguments named monitorId which defines the monitor ID to filter for (default is null), and monitorName which defines explicit name of the monitor (default is null), and monitorNamePattern which is a wildcard query to match monitor name (default is null), and enabled which defines whether the monitor is enabled (default is null, indicating both enabled and disabled), and hasTriggers which defines whether the monitor has triggers enabled (default is null, indicating both), and indices which defines the index being monitored (default is null), and sortOrder which defines the order of the results (options are asc or desc, and default is asc), and sortString which defines how to sort the results (default is name.keyword), and size which defines the size of the request to be returned (default is 20), and startIndex which defines the paginated index to start from (default is 0).  The tool returns 2 values: a list of alerting monitors (each containining monitor ID, monitor name, monitor type (indicating query-level, document-level, or bucket-level monitor types), enabled, enabled time in epoch milliseconds, last update time in epoch milliseconds), and the total number of alerting monitors.",
          "attributes": {
            "input_schema": {
              "type": "object",
              "properties": {
                "monitorId": {
                  "type": "string",
                  "description": "Alerting monitor id"
                },
                "monitorName": {
                  "type": "string",
                  "description": "Alerting monitor name"
                },
                "monitorNamePattern": {
                    "type": "string",
                    "description": "Alerting monitor name pattern"
                },
                "enabled": {
                    "type": "string",
                    "description": "If the alerting monitor enabled or not, valid values are true and false, default is null"
                },
                "hasTriggers": {
                    "type": "string",
                    "description": "If the alerting monitor has triggers, valid values are true and false, default is null"
                },
                "indices": {
                    "type": "string",
                    "description": "The index names that alerting monitor uses"
                },
                "sortString": {
                    "type": "string",
                    "description": "The sort key of the search result, default value is `name.keyword` which means the sorting is based on the detector name"
                },
                "sortOrder": {
                    "type": "string",
                    "description": "The search result order is based on this value, default is asc which means the sorting is in ascending manner."
                },
                "size": {
                    "type": "string",
                    "description": "This value controls how many search results will be fetched, default value is 20 which means at most 20 alerting monitors can return"
                },
                "startIndex": {
                    "type": "string",
                    "description": "The start index of the search, default value is 0 which means starts from the beginning"
                }
              },
              "additionalProperties": false
            }
          }
        }
      ]
}
```
{% include copy-curl.html %}

</details>

### Example requests: Parameterized tools

The following sections provide example requests for registering parameterized tools. For information about tool-specific parameters, see the corresponding [tool documentation]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).

#### WebSearchTool

```json
POST /_plugins/_ml/mcp/tools/_register
{
  "tools": [
    {
      "type": "WebSearchTool",
      "name": "GoogleSearchTool",
      "attributes": {
        "input_schema": {
          "type": "object",
          "properties": {
            "engine": {
              "type": "string",
              "description": "The search engine that will be used by the tool."
            },
            "query": {
              "type": "string",
              "description": "The search query parameter that will be used by the engine to perform the search."
            },
            "next_page": {
              "type": "string",
              "description": "The search result's next page link. If this is provided, the WebSearchTool will fetch the next page results using this link and crawl the links on the page."
            }
          },
          "required": [
            "engine",
            "query"
          ]
        },
        "strict": false
      }
    }
  ]
}
```
{% include copy-curl.html %}

#### PPLTool

```json
POST /_plugins/_ml/mcp/tools/_register
{
  "type": "PPLTool",
  "name": "TransferQuestionToPPLAndExecuteTool",
  "description": "Use this tool to convert natural language into PPL queries and execute them. Use this tool after you know the index name; otherwise, call IndexRoutingTool first. The input parameters are: {index: IndexName, question: UserQuestion}",
  "parameters": {
    "model_id": "${your_model_id}",
    "model_type": "FINETUNE"
  },
  "attributes": {
    "input_schema": {
      "type": "object",
      "properties": {
        "question": {
          "type": "string",
          "description": "The user's natural language question that needs to be converted to PPL."
        },
        "index": {
          "type": "string",
          "description": "The index on which the generated PPL query will be executed."
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

OpenSearch responds with the node ID and the status of the creation of all tools for each node:

```json
{
    "_ZNV5BrNTVm6ilcM7Jn1pw": {
        "created": true
    },
    "NZ9aiUCrSp2b5KBqdJGJKw": {
        "created": true
    }
}
```