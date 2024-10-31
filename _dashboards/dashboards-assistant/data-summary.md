---
layout: default
title: Data Summary
parent: OpenSearch Assistant for OpenSearch Dashboards
nav_order: 1
has_children: false
---

# Data Summary
**Experimental**
{: .label .label-purple }

The OpenSearch-Dashboards Assistant data summary feature helps you generate summary for your data which reside in OpenSearch indices using LLM.

## Configuration

### Prerequisites
1. Enable query enhancement from setting through path: Management -> Dashboards Managements -> Advanced settings -> Enable query enhancements
2. Configure `os_query_assist_ppl` agent. You can follow the flow-framework's query assist [examples](https://github.com/opensearch-project/flow-framework/blob/main/sample-templates).

### Enable Alert Insight
```yaml
queryEnhancements.queryAssist.summary.enabled: true
```
{% include copy.html %}
### Create agents with OpenSearch flow-framework 
Use OpenSearch flow-framework to create the required agents. Please follow [flow-framework documentation](https://github.com/opensearch-project/flow-framework) to create the agents.
You can start with the flow-framework example template for query assist summary agent, see the example template [here](https://github.com/opensearch-project/flow-framework/tree/main/sample-templates).

### Configure agents
Create root agents for data summary.
```
POST /.plugins-ml-config/_doc/os_data2summary
{
  "type": "os_root_agent",
  "configuration": {
    "agent_id": "your agent id for summary"
  }
}
```
{% include copy-curl.html %}

### Verify
You can verify if the agents are created successfully by calling the agents with example payload.
Test agents for data summary.
```
POST /_plugins/_ml/agents/<your agent id for summary>/_execute
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

## Data Summary API
Call API `/api/assistant/data2summary` to generate data summary, `sample_count`, `total_count`, `question` and `ppl` are optional.
```
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
Parameter | Description                                                                                             | Required
:--- |:--------------------------------------------------------------------------------------------------------| :---                            | `true`
question | user's natual language question to query data | `false`
ppl | PPL to query data, in query assist, this is generated by LLM from user's natual language question | `false`
sample_data | sampling data from query result | `true`
sample_count | number of data entries in `sample_data` | `false`
total_count | total number of data in query result | `false`
## Data Summary UI in Discover Page
Enter the discover page, after you change query language to PPL, you will see summary panel.
<img width="700" src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/data-summary.png" alt="data summary">