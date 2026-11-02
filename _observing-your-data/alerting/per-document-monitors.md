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

A per document monitor runs one or more queries against the documents added to an index since the monitor's previous run and generates an alert for the documents that match the trigger conditions. For example, you can use a per document monitor to:

- Detect log entries that contain errors or security events as they are ingested.
- Detect documents that violate data quality rules, for example, documents in which a field contains an unexpected value.

On its first run, a per document monitor does not evaluate the documents that already exist in the index. It evaluates only the documents added after that.

Per document monitors do not support cross-cluster search.
{: .note}

## Creating a per document monitor

The following example creates a monitor that generates an alert when a web log with a `404` response is indexed.

1. Create an index for the example logs. In **Dev Tools**, send the following request:

   ```json
   PUT web-logs
   {
     "mappings": {
       "properties": {
         "response": { "type": "keyword" },
         "request": { "type": "keyword" },
         "timestamp": { "type": "date" }
       }
     }
   }
   ```
   {% include copy-curl.html %}

1. On the top menu, go to **OpenSearch Plugins** > **Alerting**.
1. Select the **Monitors** tab, and then select **Create monitor**.
1. In **Monitor details**, enter a **Monitor name**, such as `Not found responses`, and select **Per document monitor**. In **Monitor defining method**, select **Visual editor**. Optionally, change the **Schedule**. By default, the monitor runs every minute.
1. In **Select data**, in **Index**, enter `web-logs` and press Enter.
1. In **Query**, define the query:
   - **Query name**: Enter `not-found`.
   - **Field**: Select `response`, select **is**, and enter `404`.
   - **Tags**: Optionally, select **Add tag** and enter `errors`. A tag groups queries so that a trigger condition can refer to all queries with the tag.

   To define more queries, select **Add another query**. A monitor supports up to 10 queries. The available operators depend on the field type. For example, numeric fields support **is greater than** and **is less than**.
1. In **Triggers**, select **Add trigger**, and then configure the trigger:
   - **Trigger name**: Enter `Not found responses`.
   - **Trigger conditions**: Select the `not-found` query. To refer to all queries with a tag instead, select the tag. To combine conditions, select **Add condition**.
1. Optionally, in **Actions**, add an action that sends a notification when the trigger condition is met. For more information, see [Actions]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/actions/).
1. Select **Create**.
1. Index a document that matches the query:

   ```json
   POST web-logs/_doc
   {
     "response": "404",
     "request": "/missing-page",
     "timestamp": "2026-10-28T02:00:00Z"
   }
   ```
   {% include copy-curl.html %}

On its next run, the monitor generates an alert in the **Active** state for the matching document. A document with another response code, such as `200`, does not match the query and does not generate an alert.

To define the queries and trigger conditions using the API, see [Document-level monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/api/#document-level-monitors).

## Document findings

When a document matches a query, the monitor creates a _finding_, which is a record of the document and the query that it matched. Findings are stored in the `.opensearch-alerting-finding*` indexes. Each finding contains the following information.

Field | Description
:--- | :---
Document | The document ID and index name, separated by a vertical bar, for example, `Re5akdirhj3fl` and `web-logs`.
Query | The name of the query that matched the document.
Time found | The time at which the monitor found the document.

Security Analytics uses findings to analyze query matches separately from alerts. For more information, see [Working with findings]({{site.url}}{{site.baseurl}}/security-analytics/usage/findings/).
{: .note}

In a cluster that ingests a large number of documents, a broad query can create many findings. Send a notification for each finding only if the queries are specific.
{: .important}
