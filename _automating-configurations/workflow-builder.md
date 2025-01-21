---
layout: default
title: Build workflows
nav_order: 15
---

# Build workflows with OpenSearch Flow

The OpenSearch Flow plugin on OpenSearch Dashboards (OSD) gives users the ability to iteratively build out search and ingest pipelines, initially focusing on ease-of-use for AI/ML-enhanced use cases via [ML inference processors](https://opensearch.org/docs/latest/ingest-pipelines/processors/ml-inference/). Behind the scenes, the plugin uses the [Flow Framework OpenSearch plugin](https://opensearch.org/docs/latest/automating-configurations/index/) for resource management for each use case / workflow a user creates. For example, most use cases involve configuring and creating indices, ingest pipelines, and search pipelines. All of these resources are created, updated, deleted, and maintained by the Flow Framework plugin. When users are satisfied with a use case they have built out, they can export the produced [Workflow Template](https://opensearch.org/docs/latest/automating-configurations/workflow-templates/) to re-create resources for their use cases across different clusters / data sources.

## Workflow presets

There are several presets for different use cases offered. It is helpful to think of these as _starting points_, rather than end-to-end solutions for your particular use case. They can provide helpful patterns for where you may leverage ML inference processors for different use cases in your ingest and search flows. But, your data may require complex transformatios, or you may have a custom model expecting some complex inputs or outputs, that will not easily fit into the provided presets. For more information on how you can leverage the UI to build out such complex data transformations, see [Advanced data transformations](#advanced-data-transformations) below.

## Example: Semantic Search with RAG

The below example leverages a deployed [Titan Text Embedding](https://docs.aws.amazon.com/bedrock/latest/userguide/titan-embedding-models.html) model and [Bedrock-hosted Anthropic Claude](https://aws.amazon.com/bedrock/claude/) model to build out an [ingest pipeline](https://opensearch.org/docs/latest/ingest-pipelines/), [index](https://opensearch.org/docs/latest/getting-started/intro/#index), and [search pipeline](https://opensearch.org/docs/latest/search-plugins/search-pipelines/index/) for performing vector search and retrieval-augmented generation (RAG).

It is strongly recommended to have deployed models with interfaces. A library of example configurations is available [here](TODO).
{: .note}

1. On the **Workflows** page, navigate to the **New workflow** tab.
2. Click **Create** on the **Vector search with RAG** template.
3. In the pop-up, provide some basic details.
   - A unique workflow name
   - The embedding model to generate vector embeddings
   - The large language model (LLM) to perform RAG
   - Click on **Optional configuration** for more options, such as the names of the text fields & vector fields that will be persisted in the index. This can always be updated later.
4. Click **Create**, which will pre-populate some configuration, and automatically navigate to the **Workflow Details** page, starting with configuring your ingest flow.
5. Provide some sample data by clicking **Import**. In the pop-up, you can manually input data, upload a local `.json` file, or fetch some sample documents from an existing index. The form expects an array of JSON objects, each representing a standalone sample [document](https://opensearch.org/docs/latest/getting-started/intro/#document). You may think of this similar to the [bulk ingest operation](https://opensearch.org/docs/latest/getting-started/ingest-data/#bulk-indexing). Click **Save** once complete.
6. Click the **ML Inference Processor** accordion under **Enrich data** to see its details. This will be pre-populated with the processor configurations to map data _to_ the expected model input, and _from_ the expected model output. In this particular example, under **Inputs**, it is configured to map the target document field to the model input field, such that vector embeddings will be generated for that field. Under **Outputs**, it is configured to map the model output field, to a new field that will be persisted in the index. For more information on the different transform types to accomodate for more complex data schemas and/or model interfaces, see [Advanced data transformations](#advanced-data-transformations) below.
7. Click the **Advanced settings** accordion under **Ingest data** to see its details. This will also be pre-populated with the index configurations required for this particular use case, such as the `knn_vector` field mapping for the vector embedding field, and the index setting `index.knn: true`. You may tune these as you like.
8. Click **Update** in the bottom bar to build out the configured ingest pipeline & index, as well as ingest the provided sample data. You may then navigate to **Search tool** under **Inspect pipeline** to search against the newly-created index and verify the transformed documents look as expected. For this example, you would want to ensure that the vector embeddings were generated for each ingested document.
9. Click **Next: Search pipeline** to begin configuring your search flow. Similar to ingest, the form will be pre-populated with some initial configuration.
10. Click the **ML Inference Processor** accordion under **Enhance query request** to see its details. The purpose of this processor is to parse out inputs in the search query that you want to generate vector embeddings for. In this particular example, it is passing the value in `query.term.item_text.value` to the embedding model. Additionally, it is performing a query rewrite, to generate a `knn` query using the produced vector embedding from the model. Click on **Rewrite** to see its details. This is one way to abstract out complex query details, and provide a simple query interface, leveraging search pipelines for performing the advanced query generation.
11. Click the **ML Inference Processor** accordion under **Enhance query results** to see its details. This is where the Claude LLM is leveraged to collect the returned results, and return some human-readable response. Under **Inputs**, click the pencil icon on the right-hand side of the `prompt` entry. This will display a pop-up with a pre-configured prompt template, aimed at summarizing the returned documents. You may tune this as you like, and there are several presets provided as starting points. You may add/update/remove the **Input variables**, which contain the data in the returned documents you want to dynamically inject as contextual information to the LLM. The pre-configured option shows collecting all of the `item_text` data, and summarizing the results. Click **Save** or **Cancel** to exit the pop-up window.
12. Click **Update**, to build out the search pipeline. The **Inspect pipeline** section will automatically navigate to **Search tool**. From here, you may test out different queries and execute search. Variables wrapped in `{{ }}` allow for rapidly testing out different query values, without changing the base query.
13. View results. After clicking **Search**, view the results as either a formatted list of hits, or the raw JSON search response.
14. Tune your configurations to satisfactorily fit your use case. There are many ways this can be done:
    - Try different query parameters
    - Try different queries
    - Update existing processors under **Enhance query request** or **Enhance query response**
    - Add or remove processors under **Enhance query request** or **Enhance query response**
15. Export your workflow. Click on **Export** in the header to bring up the pop-up window. The displayed data represents the [Workflow Template](https://opensearch.org/docs/latest/automating-configurations/workflow-templates/) containing the end-to-end configuration for building out the OpenSearch resources; in this case, the ingest pipeline, index, and search pipeline. You may download in JSON or YAML format from the button on the right-hand side.

## Advanced data transformations

In general, ingest & search pipelines allow for modifying your data at 3 different stages:

1. Ingest: transform your documents before they are ingested in an index.
2. Search request: transform the search request before executing search against an index.
3. Search response: transform the search response (and documents) after search is executed, but before the response is returned to the user.

ML inference processors are available for all 3 of these stages. They offer several different ways for flexibly transforming input data _to_ the model input(s), and _from_ the model output(s).

**Inputs** is where you configure different parameters passed _to_ the model. Each input parameter can be 4 different types of values:

1. `String`: some constant value.
2. `Field`: a path to some field, such as a document being ingested, or a value in a search query.
3. `Expression`: a [JSONPath](https://en.wikipedia.org/wiki/JSONPath) expression for more advanced data transformations. Helpful for extracting complex or nested JSON data.
4. `Template`: some constant value, with the ability to inject dynamic variables within it. You may think of it as a mix of `String` and `Field`/`Expression` transform types. Helpful in prompt building for LLMs.

**Outputs** is where you configure different values passed _from_ the model. Each output parameter can be 3 different types of values:

1. `Field`: a path to some _new_ field name. Helpful in basic field renaming.
2. `Expression`: one or more [JSONPath](https://en.wikipedia.org/wiki/JSONPath) expressions for more advanced data transformations. Helpful for extracting complex or nested JSON data.
3. `No transformation`: leave the model output field as-is, including its name & value.

## Next steps

For more tutorials on how to leverage OpenSearch Flow to build out AI/ML use cases, including suggested ML connectors & models, see [here](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/tutorial.md).
