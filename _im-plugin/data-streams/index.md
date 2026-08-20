---
layout: default
title: Data streams
nav_order: 40
has_children: true
has_toc: false
redirect_from:
  - /opensearch/datastreams/
  - /im-plugin/data-streams/
---

# Data streams

If you're ingesting continuously generated time-series data such as logs, events, and metrics into OpenSearch, you're likely in a scenario where the number of documents grows rapidly and you don't need to update older documents.

A typical workflow to manage time-series data involves multiple steps, such as creating a rollover index alias, defining a write index, and defining common mappings and settings for the backing indexes. Data streams simplify this process and enforce features that support time-series data, such as requiring append-only data and a timestamp field.

Internally, a data stream is composed of multiple backing indexes. Search requests are routed to all the backing indexes, while indexing requests are routed to the latest write index. You can implement [ISM]({{site.url}}{{site.baseurl}}/im-plugin/ism/index/) policies to automatically handle index rollovers and deletions.

## Data stream workflow

Following is a typical sequence of use of data streams. These steps can be implemented using APIs or OpenSearch Dashboards.

### Step 1: Create an index template

To create a data stream, you first need to create an index template that configures a set of indexes as a data stream.

To create an index template for a data stream with the index template API, see [Creating an index template]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/api-datastream/#creating-an-index-template).

To create an index template for a data stream in OpenSearch Dashboards, see [Creating an index template]({{site.url}}{{site.baseurl}}/im-plugin/templates/dash-templates/).


### Step 2: Create a data stream

After you create an index template, you can create a data stream.

To create a data stream with the data stream API, see [Creating a data stream]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/api-datastream/#creating-a-data-stream).

To create an index template for a data stream in OpenSearch Dashboards, see [Creating an index template]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/dash-datastream/#creating-a-data-stream).


### Step 3: Ingest data into the data stream

You can ingest data into a data stream as you would any index.

To ingest data into a data stream using the Index document API, see [Ingesting data into the data stream]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/api-datastream/#ingesting-data-into-the-data-stream).

To ingest data into a data stream using OpenSearch Dashboards, see [Ingest your data into OpenSearch]({{site.url}}{{site.baseurl}}/getting-started/ingest-data/).

Make sure every document that you index has a timestamp field. If you try to ingest a document that doesn't have a timestamp field, you get an error.
{: warning}


### Step 4: Searching a data stream

You can search a data stream just like you search a regular index or an index alias.
The search operation applies to all of the backing indexes (all data present in the stream).

To search a data stream using the Search API, see [Searching a data stream]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/api-datastream/#searching-a-data-stream).

To search a data stream using OpenSearch Dashboards, see [Exploring data]({{site.url}}{{site.baseurl}}/dashboards/discover/index/).


### Step 5: Rollover a data stream

A rollover operation creates a new backing index that becomes the data stream’s new write index.

To roll over a data stream using the Rollover API, see [Rolling over a data stream]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/api-datastream/#rolling-over-a-data-stream).

To roll over a data stream using OpenSearch Dashboards, see [Rolling over a data stream]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/dash-datastream/#rolling-over-a-data-stream).


### Step 7: Delete a data stream

When you delete a data stream, the delete operation first deletes the backing indexes and then deletes the data stream itself.

Deleted data streams are not recoverable.
{: .warning}

To delete a data stream and all of its backing indexes using the Data stream API, see [Deleting a data stream]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/api-datastream/#deleting-a-data-stream).

To delete a data stream and all of its backing indexes using OpenSearch Dashboards, see [Deleting a data stream]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/dash-datastream/#deleting-a-data-stream).


## All data stream operations

To manage data streams with the Alias API, see [Data streams API]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/api-datastream/).

To manage data streams using OpenSearch Dashboards, see [Working with data streams in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/dash-datastream/).

To learn about querying external data sources directly using the SQL plugin, see [Data source APIs]({{site.url}}{{site.baseurl}}/sql-and-ppl/sql-and-ppl-api/data-source-apis/index/) (experimental).

The following table provides links to instructions using both OpenSearch Dashboards and the OpenSearch APIs.

OpenSearch Dashboards | API
:-- | :--
[Clearing a data stream cache]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/dash-datastream/#clearing-a-data-stream-cache) | [Clear cache]({{site.url}}{{site.baseurl}}/api-reference/index-apis/clear-index-cache/)
[Creating a data stream]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/dash-datastream/#creating-a-data-stream) | [Creating a data stream]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/api-datastream/#creating-a-data-stream)
[Deleting a data stream]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/dash-datastream/#deleting-a-data-stream) | [Deleting a data stream]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/api-datastream/#deleting-a-data-stream)
[Flushing a data stream]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/dash-datastream/#flushing-a-data-stream) | [Flush]({{site.url}}{{site.baseurl}}/api-reference/index-apis/flush/)
[Force merging data streams]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/dash-datastream/#force-merging-data-streams) | [Force merge]({{site.url}}{{site.baseurl}}/api-reference/index-apis/force-merge/)
[Refreshing a data stream]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/dash-datastream/#refreshing-a-data-stream) | [Refresh index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/refresh/)
[Rolling over a data stream]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/dash-datastream/#rolling-over-a-data-stream) | [Roll over index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/rollover/)
[Viewing a single backing index]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/dash-datastream/#viewing-a-single-backing-index) | [Get index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/get-index/)
[Viewing a single data stream]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/dash-datastream/#viewing-a-single-data-stream) | [Viewing a data stream]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/api-datastream/#viewing-a-data-stream)
[Viewing data stream statistics]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/dash-datastream/#viewing-a-single-data-stream) | [Viewing data stream statistics]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/api-datastream/#viewing-data-stream-statistics)
[Viewing data streams]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/dash-datastream/#viewing-data-streams) | [Viewing all data streams]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/api-datastream/#viewing-all-data-streams)
