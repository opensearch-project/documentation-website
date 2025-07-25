---
layout: default
title: Building AI search workflows in OpenSearch Dashboards
parent: AI search
nav_order: 80
redirect_from:
   - /automating-configurations/workflow-builder/
canonical_url: https://docs.opensearch.org/latest/vector-search/ai-search/workflow-builder/
---

# Building AI search workflows in OpenSearch Dashboards

In OpenSearch Dashboards, you can iteratively build and test workflows containing ingest and search pipelines using OpenSearch Flow. Using a UI editor to build workflows simplifies the creation of artificial intelligence and machine learning (AI/ML) use cases that include ML inference processors, such as vector search and retrieval-augmented generation (RAG). Once your workflow is finalized, you can export it as a [workflow template]({{site.url}}{{site.baseurl}}/automating-configurations/workflow-templates/) to recreate identical resources across multiple clusters.

## Prerequisite knowledge

[Ingest pipelines]({{site.url}}{{site.baseurl}}/ingest-pipelines/) and [search pipelines]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) enable data transformation at different stages of ingest and search operations in OpenSearch. An _ingest pipeline_ consists of a sequence of [_ingest processors_]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/index-processors/), while a _search pipeline_ consists of [_search request processors_]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/search-processors#search-request-processors) and/or [_search response processors_]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/search-processors#search-response-processors). You can combine these processors to create custom pipelines tailored to your data processing needs.

These pipelines modify data at three key stages:

1. **Ingestion**: Transform documents before they are ingested into an index.
2. **Search request**: Transform the search request before executing the search.
3. **Search response**: Transform the search response, including documents in the results, after executing the search but before returning the response.

In OpenSearch, you can [integrate models hosted on third-party platforms]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/) and use their inference capabilities directly in OpenSearch. Both ingest and search pipelines offer [ML inference processors]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/ml-inference/), allowing you to use externally hosted models for inference in your pipelines during both ingestion and search.

## Accessing OpenSearch Flow

To access OpenSearch Flow, go to **OpenSearch Dashboards** and select **OpenSearch Plugins** > **OpenSearch Flow** from the top menu.

## Preset templates

On the OpenSearch Flow main page, select the **New workflow** tab, or select the **Create workflow** button on the right. This opens a selection of preset templates designed for different use cases, each with a unique set of preconfigured ingest and search processors. These templates serve two main purposes:

- **Quickly testing AI/ML solutions**: If your deployed models have defined interfaces, you can set up a basic solution in your cluster in a few clicks. For more information, see [Example: Semantic search with RAG](#example-semantic-search-with-rag).
- **A starting point for your custom/advanced solution**: Each template provides a structured starting point for building a custom solution. You can modify and expand upon these templates to suit your specific needs.

## Workflow editor

You can build and test your ingest and search flows in the workflow editor, which consists of three main components:

- **Form**: A multi-step form used to define your ingest and search flows by selecting and configuring processors for your ingest and search pipelines. If you already have a populated index and only need a search flow, you can skip the ingestion configuration.
- **Preview flows**: A read-only visualization of how data moves through your ingest and search flows. As you make changes in the **Form**, this view updates automatically. You can also switch to the **JSON** tab to see the underlying template configuration.
- **Inspect flows**: A set of tabs for interacting with your workflow.
   - **Test flow**: Allows you to run your search flow, with or without a search pipeline, and view results in a table or as raw JSON.
   - **Ingest response**: Displays the API response after updating your ingest flows.
   - **Errors**: Shows the latest errors from updates, ingest operations, or searches. This tab opens automatically when a new error occurs.
   - **Resources**: Lists OpenSearch resources linked to the workflow, including up to one ingest pipeline, one index, and one search pipeline. To view resource details, select **Inspect**.

## Example: Semantic search with RAG

The following example uses a deployed [Titan Text Embedding](https://docs.aws.amazon.com/bedrock/latest/userguide/titan-embedding-models.html) model and an [Anthropic Claude model hosted on Amazon Bedrock](https://aws.amazon.com/bedrock/claude/) to build an [ingest pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/), [index]({{site.url}}{{site.baseurl}}/getting-started/intro/#index), and [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) for performing vector search and RAG.

We strongly recommend using models with full model interfaces. For a list of example configurations, see [Models](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md).
{: .note}

1. On the **Workflows** page, select the **New workflow** tab, as shown in the following image.
   ![Workflows list page]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/workflows-list-page.png)
2. In the **RAG with Vector Retrieval** template, select **Create**.
3. Provide some basic details, as shown in the following image:
   - A unique workflow name and description
   - The embedding model used to generate vector embeddings
   - The large language model (LLM) used to perform RAG
   ![Quick configure modal]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/quick-configure-modal.png)
   
   For additional options, such as the text field and vector field names that will be persisted in the index, select **Optional configuration**. You can update these settings at any time.
4. Select **Create** to prepopulate the configuration and automatically navigate to the **Workflow Details** page, where you can configure your ingest flow.
5. To provide sample data, select **Import**. You can either manually enter data, upload a local `.json` file, or retrieve sample documents from an existing index, as shown in the following image. 
   ![Import data modal]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/import-data-modal.png)

   The form expects an array of JSON objects, with each object representing a standalone [document]({{site.url}}{{site.baseurl}}/getting-started/intro/#document). This process is similar to the [bulk ingest operation]({{site.url}}{{site.baseurl}}/getting-started/ingest-data/#bulk-indexing). When you're finished, select **Save**.
6. Under **Transform data**, select **ML Inference Processor**. This section will be prepopulated with configurations used to map data _to_ the expected model input and _from_ the expected model output, as shown in the following image. This example, under **Inputs**, maps the target document field to the model input field, generating vector embeddings for that field. Under **Outputs**, it maps the model output field to a new field, which will be persisted in the index.
   ![Transform data]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/transform-data.png)

   For more information about transformation types that accommodate complex data schemas and model interfaces, see [Advanced data transformations](#advanced-data-transformations).
7. Under **Ingest data**, select **Advanced settings**. This section will be prepopulated with the index configurations required for this use case, such as the `knn_vector` field mapping for the vector embedding field and the index setting `index.knn: true`, as shown in the following image. You can adjust these settings as needed.
   ![Ingest data]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/ingest-data.png)
8. Select **Update** in the bottom bar to build the configured ingest pipeline and index, and ingest the provided sample data. Afterward, go to **Test flow** under **Inspect flows** to search the newly created index and verify that the transformed documents are as expected. In this example, verify that the vector embeddings were generated for each ingested document, as shown in the following image.
   ![Test ingest flow]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/ingest-test-flow.png)
9. To configure your search flow, select **Next: Search flow**. Like the ingest flow, the form will be prepopulated with initial configuration settings.
10. Under **Transform query**, select **ML Inference Processor**, as shown in the following image. This processor parses the inputs in the search query for which you want to generate vector embeddings. In this example, it passes the value from `query.term.item_text.value` to the embedding model.<br>
    ![Transform query]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/transform-query.png)

    The processor also performs a query rewrite to generate a `knn` query using the vector embeddings produced by the model. Select **Rewrite** to view its details, as shown in the following image. This approach abstracts complex query details, providing a simple query interface that uses search pipelines to perform advanced query generation. 

    ![Rewrite query]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/rewrite-query.png)
11. Under **Transform response**, select **ML Inference Processor**, as shown in the following image. The Claude LLM is used to process the returned results and generate a human-readable response. 
   ![Transform response]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/transform-response.png)<br>
   Under **Inputs**, select the pencil icon next to the `prompt` entry. A pop-up will appear with a preconfigured prompt template designed to summarize the returned documents, as shown in the following image. You can adjust this template as needed, and several presets are available as starting points. You can also add, update, or remove the **Input variables**, which include data from the returned documents that you want to dynamically inject as contextual information to the LLM. The default option collects all `item_text` data and summarizes the results. Select **Save** to apply your changes.
    ![Configure prompt]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/configure-prompt.png)
12. Select **Update** to build the search pipeline. The **Inspect flows** section will automatically navigate to the **Test flow** section, where you can test different queries and run searches, as shown in the following image. You can use variables wrapped in {% raw %}`{{ }}`{% endraw %} to quickly test different query values without modifying the base query.
    ![Test search flow]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/search-test-flow.png)
13. To view the search results, select **Search**. You can view the results as either a formatted list of hits or as the raw JSON search response.
14. Adjust your configurations to better suit your use case. You can do this in several ways:
   - Experiment with different query parameters.
   - Try different queries.
   - Modify existing processors under **Enhance query request** or **Enhance query response**.
   - Add or remove processors under **Enhance query request** or **Enhance query response**.
15. Export your workflow by selecting **Export** in the header to open the pop-up window. The displayed data represents the [Workflow template]({{site.url}}{{site.baseurl}}/automating-configurations/workflow-templates/), which contains the full configuration for the OpenSearch resources you've just created, including the ingest pipeline, index, and search pipeline. You can download the template in JSON or YAML format by selecting the button on the right. To build identical resources in other OpenSearch clusters, use the [Provision Workflow API]({{site.url}}{{site.baseurl}}/automating-configurations/api/provision-workflow/).

## Advanced data transformations

ML inference processors provide several flexible ways to transform input data _to_ the model input(s) and _from_ the model output(s).

In **Inputs**, you can configure the parameters passed _to_ the model. There are four input parameter transformation types:

1. **Data field**: Uses an existing data field as the model input.
2. **JSONPath expression**: Extracts data from a JSON structure and maps the extracted data to the model input field using [JSONPath](https://en.wikipedia.org/wiki/JSONPath).
3. **Prompt**: Uses a constant value that can include dynamic variables. This combines elements of both the `Custom string` transformation and the `Data field` and `JSONPath expression` transformations, making it especially useful for building prompts for LLMs.
4. **Custom string**: Uses a constant string value.

In **Outputs**, you can configure the values passed _from_ the model. There are three output parameter transformation types:

1. **Data field**: Copies the model output into a new document field.
2. **JSONPath Expression**: Extracts data from a JSON structure and maps the extracted data to one or more new document fields using [JSONPath](https://en.wikipedia.org/wiki/JSONPath).
3. **No transformation**: Does not transform the model output field, preserving both its name and value.

## Next steps

- For models and model interfaces recommended for use with OpenSearch Flow, see [Models](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md).

- For a tutorial demonstrating how to use OpenSearch Flow to build different AI/ML use cases, see [Tutorial]({{site.url}}{{site.baseurl}}/tutorials/ai-search-flows/building-flows/).

