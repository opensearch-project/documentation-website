---
layout: default
title: Reindexing an index with OpenSearch Dashboards
parent: Reindex data
nav_order: 10
redirect_from:
  - /opensearch/reindex-data/
---


## Reindexing an index with OpenSearch Dashboards

You can copy all documents or a subset of documents from one or more source indexes, data streams, or aliases into a destination index, data stream, or alias. The source and destination must be different. See [Reindex Documents API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) and [Reindex Data]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) for detailed explanations and examples.


### Prerequisites

Before using the Reindex API, the following requirements and limitations must be met:

- The _source field must enabled for all documents in the source index.
- The destination index must exist and be configured.

Reindexing large datasets can degrade cluster performance. For more information and mitigation techniques, see [Performance optimization]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/#performance-optimization).


### Procedure

To reindex an index, follow these steps:

1. (Optional) Create a target index for the reindex operation. See [Creating an index]({{site.url}}{{site.baseurl}}/im-plugin/index-ops/dash-ops/#creating-an-index).

   You can also create an index later in the reindexing procedure by importing settings and mappings from the source index.
   {: tip}

1. In the **Index Management** panel, choose **Indexes**.

1. Choose the **Actions** button.

1. From the drop-down list, select **Reindex**.

1. In the **Configure source index** panel, select one or more indexes, aliases, and data streams to reindex.

1. Under **Specify a reindex option**, choose **Reindex all documents** or **Reindex a subset of documents**.

1. (Optional) If you chose to reindex a subset of documents, enter a Query DSL expression in the Query expression box to select the documents you want to reindex. See [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/).

   For example, the following Query DSL filters out all documents with a timestamp after the date `2024-01-01`:

   ```json
   {
      "bool": {
         "filter": [
        { "range": { "timestamp": { "gte": "2024-01-01" }}}
         ]
      }
   }

1. The most convenient way to create a target index is to import the settings and mappings from the source index.

   To create a target index, follow these steps:

   1. In the **Configure destination index** panel, select the **Create index** button.

   1. In the **Create index** dialog, enter a name for the index in the **Index name** box.

   1. (Optional) In the **Index alias – _optional_** combo box, enter or select one or more aliases for the target index.

   1. Select **Import settings and mappings**.

   1. In the pop-up, select the source index.

   1. (Optional) In the **Index mapping – _optional_** panel, add new fields to the target index. See [Creating an index]({{site.url}}{{site.baseurl}}/im-plugin/index-ops/dash-ops/#creating-an-index).

   1. Select **Create**.

1. (Optional) View advanced options by selecting {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-right-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) **Advanced**.

   You can set the following options in the Advanced settings:

   1. (Optional) Select **Reindex only unique documents** to keep from duplicating documents that are already in the target index.

   1. (Optional) Under **Version conflicts**, select Ignore conflicts during reindexing to prevent version conflicts from halting the reindex operation.

   1. (Optional) Select **Slice this reindexing operation** to parallelize the reindexing operation by slicing it into subtasks.

   1. (Optional) In the **Transform with ingestion pipeline – _optional_** drop-down, select an ingest pipeline to transform documents before writing them in the new index.

   1. Select Send additional notifications to generate notifications for the reindexing operation. See [Sending additional notifications]({{site.url}}{{site.baseurl}}/im-plugin/notifications/dash-notifications#sending-additional-notifications).

1. Select **Reindex**.

