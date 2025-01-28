---
layout: default
title: Build workflows
nav_order: 15
---

# Build workflows with OpenSearch Flow

The OpenSearch Flow plugin in OpenSearch Dashboards lets you iteratively build and test use cases leveraging ingest and search pipelines. It aims to simplify the complexity around building different AI/ML use cases using ML inference processors, such as vector search and retrieval-augmented generation (RAG). Behind the scenes, the plugin uses the [Flow Framework OpenSearch Plugin](https://opensearch.org/docs/latest/automating-configurations/index/) for resource management. Once you have built out a use case to your satisfaction, you can export the [Workflow Template](https://opensearch.org/docs/latest/automating-configurations/workflow-templates/) to re-create identical resources across multiple clusters.

## Background: Ingest pipelines, search pipelines, and ML models

[Ingest pipelines](https://opensearch.org/docs/latest/ingest-pipelines/) and [search pipelines](https://opensearch.org/docs/latest/search-plugins/search-pipelines/index/) are used for configuring data transforms at different stages of ingest and search operations via individual processors, all run within OpenSearch. For example, an _ingest pipeline_ is composed of a sequence of _ingest processors_, while a _search pipeline_ is composed of a sequence of _search request processors_ and/or _search response processors_. You can stitch together processors and build custom pipelines to fit your data processing needs.

In general, these pipelines allow for modifying data at 3 different stages.

1. **Ingest**: transform your documents before they are ingested in an index.
2. **Search request**: transform the search request before executing search against an index.
3. **Search response**: transform the search response (and documents) after search is executed, but before the response is returned to the user.

The [ML Commons OpenSearch Plugin](https://opensearch.org/docs/latest/ml-commons-plugin/) lets you [integrate models hosted on third-party platforms](https://opensearch.org/docs/latest/ml-commons-plugin/remote-models/index/), and use their inference capabilities directly within OpenSearch. Both ingest and search pipelines offer [ML inference processors](https://opensearch.org/docs/latest/ingest-pipelines/processors/ml-inference/), allowing you to leverage remote model inference within your pipelines at both ingest and search time. This plugin helps in building, testing, and visualizing ingest and search pipelines for your particular use case, including the use of ML inference processors.

## Getting started

To get started, go to **OpenSearch Dashboards** > **OpenSearch Plugins** > **OpenSearch Flow**.

## Preset templates

From the plugin home page, navigate to the **New workflow** tab by clicking directly, or clicking the **Create workflow** button on the right-hand side. Here, you will see a variety of preset templates offered, targeting different use cases. Each will have a unique set of pre-configured ingest and search processors. These templates serve two main purposes:

1. **Quickly proving out basic AI/ML solutions**. If you have deployed models with defined interfaces, you can get a basic use case up and running in your cluster in just a few clicks. An end-to-end [example](#example-semantic-search-with-rag) is provided below.
2. **A starting point for your custom / advanced solution**. Each template provides a good skeleton and pattern for building out a different use case. Use them as a starting point for your custom use case!

## Workflow editor

This is where you will actually build and test your ingest and search flows for your use case. There are three main sections of this page. Each one may be expanded horizontally or vertically, or collapsed altogether, depending on what you want to focus on.

1. **Form**. The multi-stepped form where you will fill in all of the details for your ingest and search flows, including selecting and configuring different ingest and search processors for your ingest and search pipelines, respectively. Optionally skip ingestion configuration if you already have a populated index and are just looking to build a search flow.
2. **Preview flows**. The readonly view representing how data flows throught your ingest and search flows at a high level. As you make changes in the **Form**, the components in these flows are automatically updated. Click on the **JSON** tab in to view the low-level template configuration.
3. **Inspect flows**. Different tabbed content for interacting with your workflow in different ways:
   - **Test flow**: Execute your search flow (with or without any configured search pipeline) and view results in tabular or raw JSON format.
   - **Ingest response**: After updating your ingest flows, the API response will show up here.
   - **Errors**: The latest error will appear here. Errors may come from updating your ingest or search flows, running ingest, or running search. The plugin will automatically open this tab when a new error occurs, similar to an IDE.
   - **Resources**: The list of associated OpenSearch resources for this particular workflow. Will include up to one ingest pipeline, one index, and one search pipeline. Click the **Inspect** action for each to view more details for each.

## Example: Semantic Search with RAG

The below example leverages a deployed [Titan Text Embedding](https://docs.aws.amazon.com/bedrock/latest/userguide/titan-embedding-models.html) model and [Bedrock-hosted Anthropic Claude](https://aws.amazon.com/bedrock/claude/) model to build out an [ingest pipeline](https://opensearch.org/docs/latest/ingest-pipelines/), [index](https://opensearch.org/docs/latest/getting-started/intro/#index), and [search pipeline](https://opensearch.org/docs/latest/search-plugins/search-pipelines/index/) for performing vector search and retrieval-augmented generation (RAG).

It is strongly recommended to have deployed models with interfaces. A library of example configurations is available [here](TODO).
{: .note}

1. On the **Workflows** page, navigate to the **New workflow** tab.
2. Click **Create** on the **RAG with Vector Retrieval** template.
3. In the pop-up, provide some basic details.
   - A unique workflow name and description
   - The embedding model to generate vector embeddings
   - The large language model (LLM) to perform RAG
   - Click on **Optional configuration** for more options, such as the names of the text fields and vector fields that will be persisted in the index. This can always be updated later.
4. Click **Create**, which will pre-populate some configuration, and automatically navigate to the **Workflow Details** page, starting with configuring your ingest flow.
5. Provide some sample data by clicking **Import**. In the pop-up, you can manually input data, upload a local `.json` file, or fetch some sample documents from an existing index. The form expects an array of JSON objects, each representing a standalone sample [document](https://opensearch.org/docs/latest/getting-started/intro/#document). You may think of this similar to the [bulk ingest operation](https://opensearch.org/docs/latest/getting-started/ingest-data/#bulk-indexing). Click **Save** once complete.
6. Click the **ML Inference Processor** accordion under **Transform data** to see its details. This will be pre-populated with the processor configurations to map data _to_ the expected model input, and _from_ the expected model output. In this particular example, under **Inputs**, it is configured to map the target document field to the model input field, such that vector embeddings will be generated for that field. Under **Outputs**, it is configured to map the model output field, to a new field that will be persisted in the index. For more information on the different transform types to accomodate for more complex data schemas and/or model interfaces, see [Advanced data transformations](#advanced-data-transformations) below.
7. Click the **Advanced settings** accordion under **Ingest data** to see its details. This will also be pre-populated with the index configurations required for this particular use case, such as the `knn_vector` field mapping for the vector embedding field, and the index setting `index.knn: true`. You may tune these as you like.
8. Click **Update** in the bottom bar to build out the configured ingest pipeline and index, as well as ingest the provided sample data. You may then navigate to **Search tool** under **Inspect pipeline** to search against the newly-created index and verify the transformed documents look as expected. For this example, you would want to ensure that the vector embeddings were generated for each ingested document.
9. Click **Next: Search pipeline** to begin configuring your search flow. Similar to ingest, the form will be pre-populated with some initial configuration.
10. Click the **ML Inference Processor** accordion under **Transform query** to see its details. The purpose of this processor is to parse out inputs in the search query that you want to generate vector embeddings for. In this particular example, it is passing the value in `query.term.item_text.value` to the embedding model. Additionally, it is performing a query rewrite, to generate a `knn` query using the produced vector embedding from the model. Click on **Rewrite** to see its details. This is one way to abstract out complex query details, and provide a simple query interface, leveraging search pipelines for performing the advanced query generation.
11. Click the **ML Inference Processor** accordion under **Transform response** to see its details. This is where the Claude LLM is leveraged to collect the returned results, and return some human-readable response. Under **Inputs**, click the pencil icon on the right-hand side of the `prompt` entry. This will display a pop-up with a pre-configured prompt template, aimed at summarizing the returned documents. You may tune this as you like, and there are several presets provided as starting points. You may add/update/remove the **Input variables**, which contain the data in the returned documents you want to dynamically inject as contextual information to the LLM. The pre-configured option shows collecting all of the `item_text` data, and summarizing the results. Click **Save** or **Cancel** to exit the pop-up window.
12. Click **Update**, to build out the search pipeline. The **Inspect flows** section will automatically navigate to **Test tool**. From here, you may test out different queries and execute search. Variables wrapped in `{{ }}` allow for rapidly testing out different query values, without changing the base query.
13. View results. After clicking **Search**, view the results as either a formatted list of hits, or the raw JSON search response.
14. Tune your configurations to satisfactorily fit your use case. There are many ways this can be done:
    - Try different query parameters
    - Try different queries
    - Update existing processors under **Enhance query request** or **Enhance query response**
    - Add or remove processors under **Enhance query request** or **Enhance query response**
15. Export your workflow. Click on **Export** in the header to bring up the pop-up window. The displayed data represents the [Workflow Template](https://opensearch.org/docs/latest/automating-configurations/workflow-templates/) containing the end-to-end configuration for building out the OpenSearch resources; in this case, the ingest pipeline, index, and search pipeline. You may download in JSON or YAML format from the button on the right-hand side.

## Advanced data transformations

ML inference processors offer several different ways for flexibly transforming input data _to_ the model input(s), and _from_ the model output(s).

**Inputs** is where you configure different parameters passed _to_ the model. Each input parameter can be one of four different transformation types:

1. `Data field`: use an existing field from your data as the model input field..
2. `JSONPath expression`: extract data from a JSON structure and map the extracted data to the model input field using [JSONPath](https://en.wikipedia.org/wiki/JSONPath).
3. `Prompt`: a constant value, with the ability to inject dynamic variables within it. You may think of it as a mix of `String` and `Data field`/`JSONPath expression` transformation types. Helpful in prompt building for LLMs.
4. `Custom string`: a constant string value.

**Outputs** is where you configure different values passed _from_ the model. Each output parameter can be one of three different transformation types:

1. `Data field`: copy the model output into a new document field.
2. `JSONPath Expression`: extract data from a JSON structure and map the extracted data to one or more new document fields using [JSONPath](https://en.wikipedia.org/wiki/JSONPath).
3. `No transformation`: leave the model output field as-is, including its name and value.

## Next steps

For suggested models and model interfaces to use within OpenSearch Flow, see [here](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md).

For more tutorials on how to leverage OpenSearch Flow to build out different AI/ML use cases, see [here](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/tutorial.md).

_Notice a missing ingest or search processor you'd like to see in the plugin? Consider opening an [issue](https://github.com/opensearch-project/dashboards-flow-framework/issues) or contributing by opening a [pull request](https://github.com/opensearch-project/dashboards-flow-framework/pulls)!_
{: .note}
