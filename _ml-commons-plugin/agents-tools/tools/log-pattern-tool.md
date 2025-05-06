---
layout: default
title: Log Pattern Tool
has_children: false
has_toc: false
nav_order: 37
parent: Tools
grand_parent: Agents and tools
---

<!-- vale off -->
# LogPatternTool
**Introduced 2.19**
{: .label .label-purple }
<!-- vale on -->

The `LogPatternTool` analyzes log data retrieved using [query domain-specific language (DSL)]({{site.url}}{{site.baseurl}}/query-dsl/) or [Piped Processing Language (PPL)]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/) queries to extract and identify recurring structural patterns across log messages. After grouping similar logs based on their shared templates, it returns the most common patterns. Each pattern includes representative sample logs and the total count of log entries that match the pattern in your dataset.

OpenSearch determines whether you're using a DSL or PPL query based on the presence of the `input` or `ppl` parameter in the request:

- If the `input` parameter (a DSL query JSON as a string) is present, the tool interprets the request as a DSL query.

- If the `ppl` parameter is present and `input` is not, the tool interprets the request as a PPL query.

- If both are provided, the tool will prioritize the DSL query.

To avoid ambiguity, provide only one of the two---`input` for DSL or `ppl` for PPL---in your request when you run the agent.

## Step 1: Register a flow agent that will run the LogPatternTool

A flow agent runs a sequence of tools in order, returning the last tool's output. To create a flow agent, send the following register agent request:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_Log_Pattern_Tool",
  "type": "flow",
  "description": "this is a test agent for the LogPatternTool",
  "memory": {
    "type": "demo"
  },
  "tools": [
      {
      "type": "LogPatternTool",
      "parameters": {
        "sample_log_size": 1
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
  "agent_id": "OQutgJYBAc35E4_KvI1q"
}
```

## Step 2: Run the agent

Run the agent by sending the following request:

```json
POST /_plugins/_ml/agents/OQutgJYBAc35E4_KvI1q/_execute
{
  "parameters": {
    "input": "{\"query\":{\"bool\":{\"filter\":[{\"range\":{\"bytes\":{\"from\":10,\"to\":null,\"include_lower\":true,\"include_upper\":true,\"boost\":1}}}],\"adjust_pure_negative\":true,\"boost\":1}}}",
    "index": "opensearch_dashboards_sample_data_logs"
  }
}
```
{% include copy-curl.html %}

OpenSearch returns a JSON response containing the most common log patterns found in your data, up to the specified limit. Each identified pattern is represented as a JSON object with three key components: the pattern template, a set of representative sample logs that match the pattern, and a count indicating how often the pattern appears in your dataset. The structure follows the format `{"pattern": "...", "sample logs": [...], "total count": N}`, as illustrated in the following example response:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result":"""[{"pattern":"<*IP*> - - [<*DATETIME*>] "GET <*> HTTP/<*><*>\" 200 <*> \"-\" \"Mozilla/<*><*> (<*>; Linux <*>_<*>; rv:<*><*><*>) Gecko/<*> Firefox/<*><*><*>\"","sample logs":["223.87.60.27 - - [2018-07-22T00:39:02.912Z] \"GET /opensearch/opensearch-1.0.0.deb_1 HTTP/1.1\" 200 6219 \"-\" \"Mozilla/5.0 (X11; Linux x86_64; rv:6.0a1) Gecko/20110421 Firefox/6.0a1\""],"total count":367},{"pattern":"<*IP*> - - [<*DATETIME*>] \"GET <*> HTTP/<*><*>\" 200 <*> \"-\" \"Mozilla/<*><*> (<*>; Linux <*>) AppleWebKit/<*><*> (KHTML like Gecko) Chrome<*IP*> Safari/<*><*>\"","sample logs":["216.9.22.134 - - [2018-07-22T05:27:11.939Z] \"GET /beats/metricbeat_1 HTTP/1.1\" 200 3629 \"-\" \"Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.50 Safari/534.24\""],"total count":311},{"pattern":"<*IP*> - - [<*DATETIME*>] \"GET <*> HTTP/<*><*>\" 200 <*> \"-\" \"Mozilla/<*><*> (compatible; MSIE 6<*>; Windows NT 5<*>; <*>; .NET CLR 1<*><*>)\"","sample logs":["99.74.118.237 - - [2018-07-22T03:34:43.399Z] \"GET /beats/metricbeat/metricbeat-6.3.2-amd64.deb_1 HTTP/1.1\" 200 14113 \"-\" \"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)\""],"total count":269}]"""
        }
      ]
    }
  ]
}
```

## Register parameters

The following table lists the available tool parameters for agent registration.

| Parameter         | Type     | Required/Optional                                | Description |
|:-----------------|:---------|:-------------------------------------------------|:------------|
| `index`          | String   | Required for DSL queries                         | The index to search for pattern analysis. |
| `input`          | String   | Required for DSL queries                         | A DSL query JSON as a string. If both `input` and `ppl` are provided, `input` (DSL) is used. |
| `ppl`            | String   | Required for PPL queries                         | A PPL query string. Ignored if `input` is also provided. |
| `source_field`   | String   | Optional                                         | The field(s) to return in the result. Can be a single field or an array (for example, `["field1", "field2"]`). |
| `doc_size`       | Integer  | Optional                                         | The number of documents to fetch. Default is `2`. |
| `top_n_pattern`  | Integer  | Optional                                         | Limits the output to the specified number of most frequent patterns. Default is `3`. |
| `sample_log_size`| Integer  | Optional                                         | The number of sample logs to include per pattern. Default is `20`. |
| `pattern_field`  | String   | Optional                                         | The field to analyze for pattern detection. If not specified, the tool selects the longest text field from the first document. |


## Execute parameters

The following table lists the available tool parameters for running the agent.

Parameter	| Type | Required/Optional      | Description	
:--- | :--- |:-----------------------| :---
| `index`   | String | Required for DSL queries | The index to search for pattern analysis. |
| `input`   | String | Required for DSL queries | A DSL query JSON as a string. If both `input` and `ppl` are provided, `input` (DSL) takes precedence. |
| `ppl`     | String | Required for PPL queries | A PPL query string. Ignored if `input` is also provided. |