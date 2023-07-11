---
layout: default
title: Creating per document monitors
nav_order: 30
grand_parent: Alerting
parent: Monitors
redirect_from:
  - /monitoring-plugins/alerting/monitors/
---

# Creating per document monitors

Introduced 2.0
{: .label .label-purple }

Per document monitors compare a selected field with the desired value. You can define up to 10 queries and the supported field data types using the following operators:

- `is` 
- `is not`
- `is greater than`
- `is greater than equal`
- `is less than`
- `is less than equal`

You query each trigger using up to 10 tags, adding the tag as a single trigger condition instead of specifying a single query. The Alerting plugin processes the trigger conditions from all queries as a logical `OR` operation so that if any of the query conditions are met, it triggers an alert. The Alerting plugin then tells the Notifications plugin to send the notification to a channel.

The Alerting plugin also creates a list of document findings that contains metadata about which document matches each query. Security analytics can use the document findings data to keep track of and analyze the query data separately from the alert processes.

The Alerting API also provides a document-level monitor that programmatically accomplishes the same function as the per document monitor in OpenSearch Dashboards. See [Document-level monitors]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/api/#document-level-monitors/) to learn more.
{: .note}

## Document findings

When a per document monitor executes a query that matches a document in an index, a finding is created. OpenSearch provides a findings index, `.opensearch-alerting-finding*`, that contains findings data for all per document monitor queries. You can search the findings index with the Alerting API search operation. See [Search for monitor findings]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/api/#search-for-monitor-findings/) for more detailed information.

The following metadata is provided for each document finding entry:

* **Document**: Document ID and index name, for example, `Re5akdirhj3fl | test-logs-index`.
* **Query**: Query name that matched the document.
* **Time found**: Timestamp that indicates when the document was found during the runtime.

While it is possible to configure an alert notification for each finding, it is not recommended unless rules are well-defined to prevent a sizeable volume of findings in a high ingestion cluster.
{: .note}
