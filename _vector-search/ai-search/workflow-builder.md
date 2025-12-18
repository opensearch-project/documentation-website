---
layout: default
title: Building AI search workflows in OpenSearch Dashboards
parent: AI search
has_children: true
has_toc: false
nav_order: 80
redirect_from:
  - /automating-configurations/workflow-builder/
  - /tutorials/ai-search-flows/building-flows/
  - /tutorials/gen-ai/ai-search-flows/building-flows/
canonical_url: https://docs.opensearch.org/latest/vector-search/ai-search/workflow-builder/
---

# Building AI search workflows in OpenSearch Dashboards

In OpenSearch Dashboards, you can iteratively build and test workflows containing ingest and search pipelines using AI Search Flows. Using a UI editor to build workflows simplifies the creation of artificial intelligence and machine learning (AI/ML) use cases that include ML inference processors, such as vector search and retrieval-augmented generation (RAG). 

For example configurations of available AI search types (including semantic search, hybrid search, RAG, and multimodal search), see [Configuring AI search types]({{site.url}}{{site.baseurl}}/vector-search/ai-search/building-flows/). 

For examples of configuring agentic search flows, see [Configuring agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/building-agentic-search-flows/).

Once your workflow is finalized, you can export it as a [workflow template]({{site.url}}{{site.baseurl}}/automating-configurations/workflow-templates/) to recreate identical resources across multiple clusters.

## Prerequisite knowledge

[Ingest pipelines]({{site.url}}{{site.baseurl}}/ingest-pipelines/) and [search pipelines]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) enable data transformation at different stages of ingest and search operations in OpenSearch. An _ingest pipeline_ consists of a sequence of [_ingest processors_]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/index-processors/), while a _search pipeline_ consists of [_search request processors_]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/search-processors#search-request-processors) and/or [_search response processors_]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/search-processors#search-response-processors). You can combine these processors to create custom pipelines tailored to your data processing needs.

These pipelines modify data at three key stages:

1. **Ingestion**: Transform documents before they are ingested into an index.
2. **Search request**: Transform the search request before executing the search.
3. **Search response**: Transform the search response, including documents in the results, after executing the search but before returning the response.

In OpenSearch, you can [integrate models hosted on third-party platforms]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/) and use their inference capabilities directly in OpenSearch. Both ingest and search pipelines offer [ML inference processors]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/ml-inference/), allowing you to use externally hosted models for inference in your pipelines during both ingestion and search.

## Accessing AI Search Flows

To access AI Search Flows, go to **OpenSearch Dashboards** and select **OpenSearch Plugins** > **AI Search Flows** from the top menu.

## Preset templates

On the home page, select the **New workflow** tab, or select the **Create workflow** button on the right. This opens a selection of preset templates designed for different use cases, each with a unique set of preconfigured ingest and search processors. These templates serve two main purposes:

- **Quickly testing AI/ML solutions**: If your deployed models have defined interfaces, you can set up a basic solution in your cluster in a few clicks. For more information, see [Example: Semantic search with RAG](#example-semantic-search-with-rag).
- **A starting point for your custom/advanced solution**: Each template provides a structured starting point for building a custom solution. You can modify and expand upon these templates to suit your specific needs.

## Workflow editor

You can build and test your ingest and search workflows in the workflow editor, shown in the following image.

![Workflow editor]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/details-page.png)

The workflow editor is organized like an integrated development environment (IDE) and includes three main components:

- **Flow overview**: A collapsible navigation panel for selecting the different components within your ingest and search flows. In this panel, you can add, remove, or reorder processors. If you already have a populated index and only need a search flow, you can disable **Ingest flow**.
- **Component details**: The central panel for configuring the individual component details. Selecting a component from **Flow overview** populates this panel with the relevant details.
- **Inspect**: A set of tabs for interacting with your workflow.
  - **Test flow**: Allows you to run your search flow, with or without a search pipeline, and view results in a table or as raw JSON.
  - **Ingest response**: Displays the API response after updating your ingest flows.
  - **Errors**: Shows the latest errors from updates, ingest operations, or searches. This tab opens automatically when a new error occurs.
  - **Resources**: Lists OpenSearch resources linked to the workflow, including up to one ingest pipeline, one index, and one search pipeline. To view resource details, select **Inspect**.
  - **Preview**: A read-only visualization of how data moves through your ingest and search flows. As you make changes to your flow, this view updates automatically. You can also switch to the **JSON** tab to see the underlying template configuration.

## Example: Semantic search with RAG

The following example uses a deployed [Titan Text Embedding](https://docs.aws.amazon.com/bedrock/latest/userguide/titan-embedding-models.html) model and an [Anthropic Claude model hosted on Amazon Bedrock](https://aws.amazon.com/bedrock/claude/) to build an [ingest pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/), [index]({{site.url}}{{site.baseurl}}/getting-started/intro/#index), and [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) for performing vector search and RAG.

We strongly recommend using models with full model interfaces. For a list of example configurations, see [Models](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md).
{: .note}

1. On the **Workflows** page, select the **New workflow** tab, as shown in the following image.
   ![New workflow page]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/new-workflow-page.png)
2. In the **RAG with Vector Retrieval** template, select **Create**.
3. Provide some basic details, as shown in the following image:

   - A unique workflow name and description
   - The embedding model used to generate vector embeddings
   - The large language model (LLM) used to perform RAG
     ![Quick configure modal]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/quick-configure-modal.png)

   For additional options, such as the text field and vector field names that will be persisted in the index, select **Optional configuration**. You can update these settings at any time.

4. Select **Create** to prepopulate the configuration and automatically navigate to the **Workflow Details** page, where you can configure your ingest flow.
5. To provide sample data, select **Sample data** from **Flow overview**. Then select **Import data**. You can enter data manually, upload a local `.jsonl` file, or retrieve sample documents from an existing index, as shown in the following image.
   ![Import data modal]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/import-data-modal.png)

   The form expects data in [JSON Lines format](https://jsonlines.org/), with each line representing a standalone [document]({{site.url}}{{site.baseurl}}/getting-started/intro/#document). This process is similar to the [bulk ingest operation]({{site.url}}{{site.baseurl}}/getting-started/ingest-data/#bulk-indexing). When you're finished, select **Confirm**.

6. In the **Flow overview** panel, select the topmost **ML Inference Processor**. The processor is prepopulated with the configuration used to map data _to_ the expected model input and _from_ the expected model output. The **Inputs** section maps the target document field to the model input field, generating vector embeddings for that field. The **Outputs** section maps the model output field to a new field that is stored in the index, as shown in the following image.
   ![Transform data]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/transform-data.png)

   For more information about transformation types that accommodate complex data schemas and model interfaces, see [Advanced data transformations](#advanced-data-transformations).

7. In the **Flow overview** panel, select **Index**. The index is prepopulated with the index configuration required for the selected use case. For example, for vector search, the `my_embedding` field is mapped as a `knn_vector` and the index is specified as a vector index (`index.knn: true`), as shown in the following image. You can modify this configuration as needed.
   ![Ingest data]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/ingest-data.png)
8. Select **Update ingest flow** at the bottom of **Flow overview** to build the configured ingest pipeline and index, and ingest the provided sample data. Then go to **Test flow** under **Inspect** to search the newly created index and verify that the transformed documents appear as expected. In this example, verify that the vector embeddings are generated for each ingested document, as shown in the following image.
   ![Test ingest flow]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/ingest-test-flow.png)
9. To configure your search flow, under **Flow overview** > **Transform query**, select **ML Inference Processor**, as shown in the following image. This processor parses the search query inputs for which you want to generate vector embeddings. In this example, it passes the value from `query.match.review.query` to the embedding model.<br>
   ![Transform query]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/transform-query.png)

   The processor also performs a query rewrite to generate a `knn` query using the vector embeddings produced by the model. Select **Rewrite query** to view its details, as shown in the following image. This approach abstracts complex query details, providing a simple query interface that uses search pipelines to perform advanced query generation.

   ![Rewrite query]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/rewrite-query.png)

10. To configure your search result transformations, under **Flow overview** > **Transform response**, select **ML Inference Processor**, as shown in the following image. The Claude LLM is used to process the returned results and generate a human-readable response.
    ![Transform response]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/transform-response.png)<br>
    Under **Inputs**, select the pencil icon next to the `prompt` entry. This opens a popup window containing a preconfigured prompt template designed to summarize the returned documents, as shown in the following image. You can modify this template as needed; several presets are available as starting points. You can also add, update, or remove the **Input variables**, which include data from the returned documents that you want to dynamically inject as contextual information into the LLM. The default option collects all `review` data and summarizes the results. Select **Save** to apply your changes.
    ![Configure prompt]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/configure-prompt.png)
11. To build the search pipeline, select **Create search flow**. The **Inspect** section automatically navigates to the **Test flow** component, where you can test different queries and run searches, as shown in the following image. You can use variables wrapped in {% raw %}`{{ }}`{% endraw %} to quickly test different query values without modifying the base query.
    ![Test search flow]({{site.url}}{{site.baseurl}}/images/dashboards-flow-framework/search-test-flow.png)
12. To view the search results, select **Run test**. You can view the results either as a formatted list of hits or as the raw JSON search response.
13. Depending on your use case, you can modify configurations in the following ways:

- Experiment with different query parameters.
- Try different queries.
- Modify existing processors under **Transform query** or **Transform results**.
- Add or remove processors under **Transform query** or **Transform results**.

14. To export your workflow, select **Export** in the header. The displayed data represents the [Workflow template]({{site.url}}{{site.baseurl}}/automating-configurations/workflow-templates/), which contains the full configuration for the OpenSearch resources you've created, including the ingest pipeline, index, and search pipeline. You can download the template in JSON or YAML format by selecting the button on the right. To build identical resources in other OpenSearch clusters, use the [Provision Workflow API]({{site.url}}{{site.baseurl}}/automating-configurations/api/provision-workflow/).

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

- For models and model interfaces recommended for use with AI Search Flows, see [Models](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md).

- For example configurations for different AI/ML use cases, see [Configuring AI search types]({{site.url}}{{site.baseurl}}/tutorials/ai-search-flows/building-flows/).

- For examples of configuring agentic search flows, see [Configuring agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/building-agentic-search-flows/).
