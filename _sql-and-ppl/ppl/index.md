---
layout: default
title: PPL
nav_order: 1
has_children: true
---
# OpenSearch PPL Reference Manual  

### Overview  

Piped Processing Language (PPL), powered by OpenSearch, enables OpenSearch users with exploration and discovery of, and finding search patterns in data stored in OpenSearch, using a set of commands delimited by pipes (\|). These are essentially read-only requests to process data and return results.  

Currently, OpenSearch users can query data using either Query DSL or SQL. Query DSL is powerful and fast. However, it has a steep learning curve, and was not designed as a human interface to easily create ad hoc queries and explore user data. SQL allows users to extract and analyze data in OpenSearch in a declarative manner. OpenSearch now makes its search and query engine robust by introducing Piped Processing Language (PPL). It enables users to extract insights from OpenSearch with a sequence of commands delimited by pipes (\|). It supports  a comprehensive set of commands including search, where, fields, rename, dedup, sort, eval, head, top and rare, and functions, operators and expressions. Even new users who have recently adopted OpenSearch, can be productive day one, if they are familiar with the pipe (\|) syntax. It enables developers, DevOps engineers, support engineers, site reliability engineers (SREs), and IT managers to effectively discover and explore log, monitoring and observability data stored in OpenSearch.  

We expand the capabilities of our Workbench, a comprehensive and integrated visual query tool currently supporting only SQL, to run on-demand PPL commands, and view and save results as text and JSON. We also add  a new interactive standalone command line tool, the PPL CLI, to run on-demand PPL commands, and view and save results as text and JSON.
The query start with search command and then flowing a set of command delimited by pipe (\|).  

for example, the following query retrieve firstname and lastname from accounts if age large than 18. 
  
```sql
source=accounts
| where age > 18
| fields firstname, lastname
```
{% include copy.html %}
  
* **Interfaces**  
  - [Endpoint]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/interfaces/endpoint/)  
  - [Protocol]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/interfaces/protocol/)  
* **Administration**  
  - [Plugin Settings]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/admin/settings/)  
  - [Security Settings]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/admin/security/)  
  - [Monitoring]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/admin/monitoring/)  
  - [Datasource Settings]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/admin/datasources/)  
  - [Prometheus Connector]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/admin/connectors/prometheus_connector/)  
  - [Cross-Cluster Search]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/admin/cross_cluster_search/)  
* **Language Structure**  
  - [Identifiers]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/general/identifiers/)  
  - [Data Types]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/general/datatypes/)  
* **Commands**  
  
  The following commands are available in PPL:  
  **Note:** Experimental commands are ready for use, but specific parameters may change based on feedback.
  
| Command Name | Version Introduced | Current Status | Command Description |
| --- | --- | --- | --- |
| [search command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/search/) | 1.0 | stable (since 1.0) | Retrieve documents from the index. |
| [where command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/where/) | 1.0 | stable (since 1.0) | Filter the search result using boolean expressions. |
| [subquery command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/subquery/) | 3.0 | experimental (since 3.0) | Embed one PPL query inside another for complex filtering and data retrieval operations. |
| [fields command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/fields/) | 1.0 | stable (since 1.0) | Keep or remove fields from the search result. |
| [rename command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/rename/) | 1.0 | stable (since 1.0) | Rename one or more fields in the search result. |
| [eval command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/eval/) | 1.0 | stable (since 1.0) | Evaluate an expression and append the result to the search result. |
| [replace command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/replace/) | 3.4 | experimental (since 3.4) | Replace text in one or more fields in the search result |
| [fillnull command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/fillnull/) | 3.0 | experimental (since 3.0) | Fill null with provided value in one or more fields in the search result. |
| [expand command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/expand/) | 3.1 | experimental (since 3.1) | Transform a single document into multiple documents by expanding a nested array field. |
| [flatten command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/flatten/) | 3.1 | experimental (since 3.1) | Flatten a struct or an object field into separate fields in a document. |
| [table command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/table/) | 3.3 | experimental (since 3.3) | Keep or remove fields from the search result using enhanced syntax options. |
| [stats command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/stats/) | 1.0 | stable (since 1.0) | Calculate aggregation from search results. |
| [eventstats command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/eventstats/) | 3.1 | experimental (since 3.1) | Calculate aggregation statistics and add them as new fields to each event. |
| [streamstats command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/streamstats/) | 3.4 | experimental (since 3.4) | Calculate cumulative or rolling statistics as events are processed in order. |
| [bin command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/bin/) | 3.3 | experimental (since 3.3) | Group numeric values into buckets of equal intervals. |
| [timechart command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/timechart/) | 3.3 | experimental (since 3.3) | Create time-based charts and visualizations. |
| [chart command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/chart/) | 3.4 | experimental (since 3.4) | Apply statistical aggregations to search results and group the data for visualizations. |
| [trendline command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/trendline/) | 3.0 | experimental (since 3.0) | Calculate moving averages of fields. |
| [sort command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/sort/) | 1.0 | stable (since 1.0) | Sort all the search results by the specified fields. |
| [reverse command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/reverse/) | 3.2 | experimental (since 3.2) | Reverse the display order of search results. |
| [head command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/head/) | 1.0 | stable (since 1.0) | Return the first N number of specified results after an optional offset in search order. |
| [dedup command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/dedup/) | 1.0 | stable (since 1.0) | Remove identical documents defined by the field from the search result. |
| [top command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/top/) | 1.0 | stable (since 1.0) | Find the most common tuple of values of all fields in the field list. |
| [rare command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/rare/) | 1.0 | stable (since 1.0) | Find the least common tuple of values of all fields in the field list. |
| [parse command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/parse/) | 1.3 | stable (since 1.3) | Parse a text field with a regular expression and append the result to the search result. |
| [grok command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/grok/) | 2.4 | stable (since 2.4) | Parse a text field with a grok pattern and append the results to the search result. |
| [rex command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/rex/) | 3.3 | experimental (since 3.3) | Extract fields from a raw text field using regular expression named capture groups. |
| [regex command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/regex/) | 3.3 | experimental (since 3.3) | Filter search results by matching field values against a regular expression pattern. |
| [spath command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/spath/) | 3.3 | experimental (since 3.3) | Extract fields from structured text data. |
| [patterns command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/patterns/) | 2.4 | stable (since 2.4) | Extract log patterns from a text field and append the results to the search result. |
| [join command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/join/) | 3.0 | stable (since 3.0) | Combine two datasets together. |
| [append command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/append/) | 3.3 | experimental (since 3.3) | Append the result of a sub-search to the bottom of the input search results. |
| [appendcol command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/appendcol/) | 3.1 | experimental (since 3.1) | Append the result of a sub-search and attach it alongside the input search results. |
| [lookup command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/lookup/) | 3.0 | experimental (since 3.0) | Add or replace data from a lookup index. |
| [multisearch command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/multisearch/) | 3.4 | experimental (since 3.4) | Execute multiple search queries and combine their results. |
| [ml command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/ml/) | 2.5 | stable (since 2.5) | Apply machine learning algorithms to analyze data. |
| [kmeans command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/kmeans/) | 1.3 | stable (since 1.3) | Apply the kmeans algorithm on the search result returned by a PPL command. |
| [ad command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/ad/) | 1.3 | deprecated (since 2.5) | Apply Random Cut Forest algorithm on the search result returned by a PPL command. |
| [describe command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/describe/) | 2.1 | stable (since 2.1) | Query the metadata of an index. |
| [explain command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/explain/) | 3.1 | stable (since 3.1) | Explain the plan of query. |
| [show datasources command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/showdatasources/) | 2.4 | stable (since 2.4) | Query datasources configured in the PPL engine. |
| [addtotals command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/addtotals/) | 3.5 | stable (since 3.5) | Adds row and column values and appends a totals column and row. |
| [addcoltotals command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/addcoltotals/) | 3.5 | stable (since 3.5) | Adds column values and appends a totals row. |
| [transpose command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/transpose/) | 3.5 | stable (since 3.5) | Transpose rows to columns. |
| [mvcombine command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/mvcombine/) | 3.5 | stable (since 3.4) | Combines values of a specified field across rows identical on all other fields. |
| [nomv command]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/nomv/) | 3.6 | stable (since 3.6) | Converts a multivalue field to a single-value string by joining elements with newlines. |

  - [Syntax]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/syntax/) - PPL query structure and command syntax formatting  
* **Functions**  
  - [Aggregation Functions]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/functions/aggregations/)  
  - [Collection Functions]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/functions/collection/)  
  - [Condition Functions]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/functions/condition/)  
  - [Cryptographic Functions]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/functions/cryptographic/)  
  - [Date and Time Functions]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/functions/datetime/)  
  - [Expressions]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/functions/expressions/)  
  - [IP Address Functions]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/functions/ip/)  
  - [JSON Functions]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/functions/json/)  
  - [Math Functions]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/functions/math/)  
  - [Relevance Functions]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/functions/relevance/)  
  - [String Functions]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/functions/string/)  
  - [System Functions]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/functions/system/)  
  - [Type Conversion Functions]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/functions/conversion/)  
* **Optimization**  
  - [Optimization]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/user/optimization/optimization/)  
* **Limitations**  
  - [Limitations]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/limitations/limitations/)  