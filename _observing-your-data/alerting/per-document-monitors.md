---
layout: default
title: Per document monitors
nav_order: 20
parent: Monitors
grand_parent: Alerting
has_children: false
---

# Per document monitors
Introduced 2.0
{: .label .label-purple }

Per document monitors are a type of alert monitor that can be used to identify and alert on specific documents in an OpenSearch index. For example, you can use the monitor to:

- Detect corrupted data or unauthorized changes.
- Enforce data quality policies, such as ensuring all documents contain a certain field or that values in a field are within a certain range. 
- Track changes to a specific document over time, which can be helpful for auditing and compliance purposes

## Defining queries

Per document monitors allow you to define up to 10 queries that compare a selected field with a desired value. You can define supported field data types using the following operators:

- `is` 
- `is not`
- `is greater than`
- `is greater than equal`
- `is less than`
- `is less than equal`

You can query each [trigger]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/triggers/) using up to 10 tags, adding the tag as a single trigger condition instead of specifying a single query. The [Alerting plugin]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/) processes the trigger conditions from all queries as a logical `OR` operation, so if any of the query conditions are met, it triggers an alert. The Alerting plugin then tells the [Notifications plugin]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/) to send the alert notification to a channel.

You can only use _tags_--- that is, labels that can be applied to multiple queries to combine them with the logical `OR`` operation---in a per document monitor.
{: .important}

## Document findings

The Alerting plugin creates a list of _Findings_ that contain metadata about which document matches each query. A _Finding_ is a record of a document identified by the per document monitor query as meeting the alert condition. Key components of a finding include the document ID, timestamp, alert condition details. Findings are stored in the Findings index, `.opensearch-alerting-finding*`. 

Security Analytics can use the findings data to keep track of and analyze the query data separately from the alert processes. See [Working with findings]({{site.url}}{{site.baseurl}}/security-analytics/usage/findings/) to learn more.
{: .note}

The Alerting API also provides a _document-level monitor_ that programmatically accomplishes the same function as the _per document monitor_ in OpenSearch Dashboards. See [Document-level monitors]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/api/#document-level-monitors) to learn more.

To prevent a large volume of findings in a high-ingestion cluster, configuring alert notifications for each finding is not recommended unless rules are well defined.
{: .important}

The following metadata is provided for each document findings entry:

* **Document**: The document ID and index name. For example: `Re5akdirhj3fl | test-logs-index`.
* **Query**: The query name that matched the document.
* **Time found**: The timestamp that indicates when the document was found during the runtime.
