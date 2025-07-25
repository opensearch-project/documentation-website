---
layout: default
title: Creating and customizing AI search workflows
parent: AI search workflows
grand_parent: Generative AI
nav_order: 10
redirect_from:
  - /tutorials/ai-search-flows/building-flows/
canonical_url: https://docs.opensearch.org/latest/tutorials/gen-ai/ai-search-flows/building-flows/
---

# Creating and customizing AI search workflows in OpenSearch Dashboards

This tutorial shows you how to build automated AI search workflows in OpenSearch Dashboards. For more information, see [Building AI search workflows in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/vector-search/ai-search/workflow-builder/).

## Prerequisite: Provision ML resources

Before you start, select and provision the necessary machine learning (ML) resources depending on your use case. For example, to implement semantic search, you must configure a text embedding model in your OpenSearch cluster. For more information about deploying ML models locally or connecting to externally hosted models, see [Integrating ML models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/).

## Step 1: Select your use case

To access OpenSearch Flow, go to OpenSearch Dashboards and select **OpenSearch Plugins** > **OpenSearch Flow** from the top menu.

OpenSearch provides preset templates for common use cases and a custom option for specialized implementations, as shown in the following image.

![OpenSearch Flow template page]({{site.url}}{{site.baseurl}}/images/flow-tutorial/presets-page.png)

Preset templates include preconfigured settings that you can customize by specifying your model and input fields. For advanced or specialized requirements, select **Custom** to start with a blank configuration. This option gives you complete control over all settings, allowing you to customize your configuration. The following image illustrates a custom semantic search use case.

## Step 2: Explore the Workflow Details page

After selecting the use case, the **Workflow Details** page appears, which contains the following main sections:

1. Ingest and search configuration forms: Used to configure ingest and search pipelines. An example ingest configuration is shown in the following image.

    ![Form]({{site.url}}{{site.baseurl}}/images/flow-tutorial/form.png)

2. **Preview** workspace: A read-only visual helper that displays the flow of data and transformations during ingestion and search, as shown in the following image. 

    ![Workspace]({{site.url}}{{site.baseurl}}/images/flow-tutorial/workspace.png)

    Toggle to the JSON view for detailed configurations.

3. **Inspector**: Similar to an integrated development environment (IDE), the **Inspector** displays workflow execution details, responses from the ingest/search operations, errors, and created resources, as shown in the following image.

    ![Inspector]({{site.url}}{{site.baseurl}}/images/flow-tutorial/inspector.png)

4. Buttons: Manage your workflow by undoing changes, saving progress, exporting the configuration, or exiting, as shown in the following image.

    ![Buttons]({{site.url}}{{site.baseurl}}/images/flow-tutorial/buttons.png)

    Depending on your `useNewHomePage` OpenSearch Dashboards setting, these buttons may appear differently in your local system.
    {: .note}

## Step 3: Provide sample data

Begin by providing sample data in JSON array format. You can use the following options:

- Manually input data.

- Import from a file.

If you already have data and only need search functionality, skip this step by unchecking the **Enabled** checkbox.
{: .note}

For this example, you'll manually input sample data for an e-commerce store. On the **Import data** page, select **Upload** and enter the following JSON data:

```json
[
    {
        "item_text": "red shoes",
        "item_price": 100
    }
    {
        "item_text": "blue sneakers",
        "item_price": 50
    }
    {
        "item_text": "purple high heels",
        "item_price": 150
    }
    {
        "item_text": "pair of jordans",
        "item_price": 250
    }
    {
        "item_text": "navy plaid shirt",
        "item_price": 35
    }
]
```
{% include copy.html %}

Then select **Save**, as shown in the following image.

![import-data-populated]({{site.url}}{{site.baseurl}}/images/flow-tutorial/import-data-populated.png)

## Step 4: Enrich your data

Enhance your data by configuring an ingest pipeline and chaining ingest processors. To view the list of supported processors, select **Add processor**. The available processors are displayed in the dropdown menu, as shown in the following image.

![enrich-data]({{site.url}}{{site.baseurl}}/images/flow-tutorial/enrich-data.png)

Select and configure an ML inference processor to embed the input text. In this example, your cluster contains a deployed Amazon Titan Text Embeddings model hosted on Amazon Bedrock. The model has a defined interface: it expects a single input called `inputText` and returns a single output called `embedding`. Thus, you must map the OpenSearch index data to model inputs and outputs. In **Inputs**, specify how to select data from the OpenSearch index and transform it into the expected model inputs. In **Outputs**, specify how to select the model outputs and transform them into new OpenSearch index fields. For example, you can specify a document field name or an expression using [JSONPath](https://en.wikipedia.org/wiki/JSONPath) to map a document field to a model input. 

For this example, map the following fields:

- **Inputs**: Map the `item_text` field to the `inputText` model input.

- **Outputs**: Map the `embedding` model output to the `my_embedding` field.

This example configuration is shown in the following image.

![ml-config-ingest]({{site.url}}{{site.baseurl}}/images/flow-tutorial/ml-config-ingest.png)

This mapping is necessary for configuring the `input_map` and `output_map` configuration settings of the [ML inference ingest processors]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/ml-inference/).

Select **Save** to return to the form.

### Advanced data transformations

For complex input data, you might need to use expressions to map the input data. For example, you can extract nested values using JSONPath. To use expression transformations, under **Inputs**, select **Expression** as the **Input type**, as shown in the following image.

![expression-ingest]({{site.url}}{{site.baseurl}}/images/flow-tutorial/expression-ingest.png)

Select **Configure** to open the **Configure JSONPath expression** dialog. In this example, you'll use the nested `description` field as the model input. In the **Expression** field, enter `$.item.description`. Select **Run preview** to fetch the input data. The transformed value appears in the **Extracted data** field, as shown in the following image. 

![expression-modal-ingest-validated]({{site.url}}{{site.baseurl}}/images/flow-tutorial/expression-modal-ingest-validated.png)

For models with defined [JSON Schema](https://json-schema.org/) interfaces, OpenSearch displays a marker indicating whether the transform is valid or invalid for the selected model field (in this case, `inputText`).

## Step 5: Ingest data

Under **Ingest data**, select the **Index name** of the vector index. For vector search, verify that the following prerequisites have been met:

- Vector fields are properly mapped with correct dimensions in **Index mappings**.

- The vector index settings specify `"index.knn": true` in **Index settings**.

For more information, see [Creating a vector index]({{site.url}}{{site.baseurl}}/vector-search/creating-vector-index/).

For built-in use cases, some of this information is automatically populated, as shown in the following image.

![index-settings-updated]({{site.url}}{{site.baseurl}}/images/flow-tutorial/index-settings-updated.png)

After configuration, select **Build and run ingestion** to create the index, configure the ingest pipeline, and bulk ingest sample data. The **Inspector** panel displays the OpenSearch response and any errors that occur, as shown in the following image.

![build-and-run-ingestion-response]({{site.url}}{{site.baseurl}}/images/flow-tutorial/build-and-run-ingestion-response.png)

Now that you've completed the ingest flow, you can configure a search by selecting **Search pipeline >**.

## Step 6: Configure a query

Under **Edit query**, enter your query or select from the preset query options. Note: The index is already set to the one you've configured in the ingest flow. If you haven't configured the ingest flow, select your vector index from the dropdown menu.  

For semantic search, enter the following query in the **Query** field:

```json
{
    "query": {
        "term": {
            "item_text": {
                "value": "shoes"
            }
        }
    }
}
```
{% include copy.html %}

The query is shown in the following image.

![edit-query-term]({{site.url}}{{site.baseurl}}/images/flow-tutorial/edit-query-term.png)

## Step 7: Enrich the query

You can enrich the query by configuring a series of processors---in this case, [search request processors]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/search-processors/#search-request-processors). Currently, only the [ML inference processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/ml-inference-search-request/) is supported. For this example, you'll configure an ML inference processor using the same Amazon Titan Text Embeddings model. 

For this example, map the following fields:

- **Inputs**: Map the `inputText` field to the `query.term.item_text.value field` in the query. OpenSearch will generate embeddings for this field.

- **Outputs**: Map the `embedding` model output to the `vector` field, where OpenSearch will store the generated embeddings.

This example configuration is shown in the following image.

![enrich-query-request]({{site.url}}{{site.baseurl}}/images/flow-tutorial/enrich-query-request.png)

Next, update the query to use the generated vector embeddings by selecting **Override query**. Then select **Choose from a preset** and choose `knn` query, as shown in the following image.

![override-query-with-placeholders]({{site.url}}{{site.baseurl}}/images/flow-tutorial/override-query-with-placeholders.png)

Replace any placeholder values, such as `${vector_field}`, with the corresponding vector field in your index. In this case, use the `my_embedding` field, which was configured during ingestion.

To reference the vector generated by the model, check the **Model outputs** section, where you'll find a list of available outputs. Use the copy button on the right to copy a template variable and paste it into your query.

In this example, the `${vector}` placeholder has already been set as the **vector** value in the k-NN query, so no further changes are needed. The final query should contain no placeholders except for dynamic model output variables, which will be populated at runtime, as shown in the following image.

![override-query]({{site.url}}{{site.baseurl}}/images/flow-tutorial/override-query.png)

## Step 8: Enrich the query results

You can configure a series of [search response processors]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/search-processors/#search-response-processors) to enrich or transform the returned matching documents. In this example, you won't transform the output data. For example transformations, see [configuration examples](#implementation-examples).

## Step 9: Run a search

You have now configured the flow. Select **Build and run query** to build the search pipeline and run the search request against the index. The **Inspector** panel displays the OpenSearch response, as shown in the following image.

![search-response]({{site.url}}{{site.baseurl}}/images/flow-tutorial/search-response.png)

## Step 10: Export the workflow

When you are satisfied with your workflow results, select **Export** to export the [workflow template]({{site.url}}{{site.baseurl}}/automating-configurations/workflow-templates/). The template contains the configuration details for your index, ingest pipeline, and search pipeline. The template also contains OpenSearch Dashboards metadata. You can copy the template in JSON or YAML format, as shown in the following image.

![export-modal]({{site.url}}{{site.baseurl}}/images/flow-tutorial/export-modal.png)

If you're importing the template into a different cluster, update any cluster-specific IDs, such as model IDs.
{: .note}

You have now implemented semantic search using OpenSearch Flow, with all of the required resources bundled into a single template. You can import this template into the UI and rebuild it for different clusters or run the template directly using the [Flow Framework Provision API]({{site.url}}{{site.baseurl}}/automating-configurations/api/provision-workflow/).

The following sections contain additional OpenSearch Flow configuration examples.

<p id="implementation-examples"></p>

## Semantic search

This example demonstrates how to configure semantic search.

### ML resources

Create and deploy an [Amazon Titan Text Embeddings model on Amazon Bedrock](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md#amazon-bedrock-titan-text-embedding).

### Index

Ensure that the index settings include `index.knn: true` and that your index contains a `knn_vector` field specified in the mappings, as follows:

```json
{
    "settings": {
        "index": {
            "knn": true
        }
    },
    "mappings": {
        "properties": {
            "<embedding_field_name>": {
                "type": "knn_vector",
                "dimension": "<embedding_size>"
            }
        }
    }
}
```
{% include copy.html %}

### Ingest pipeline

Configure a single ML inference processor. Map your input text to the `inputText` model input field. Optionally, map the output `embedding` to a new document field.

### Search pipeline

Configure a single ML inference search request processor. Map the query field containing the input text to the `inputText` model input field. Optionally, map the output `embedding` to a new field. Override the query to include a `knn` query, for example:

```json
{
    "_source": {
        "excludes": [
            "<embedding_field>"
        ]
    },
    "query": {
        "knn": {
            "<embedding_field>": {
                "vector": ${embedding},
                "k": 10
            }
        }
    }
}
```
{% include copy.html %}

---

## Hybrid search 

Hybrid search combines keyword and vector search. This example demonstrates how to configure hybrid search.

### ML resources

Create and deploy an [Amazon Titan Text Embeddings model on Amazon Bedrock](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md#amazon-bedrock-titan-text-embedding).

### Index

Ensure that the index settings include `index.knn: true` and that your index contains a `knn_vector` field specified in the mappings, as follows:

```json
{
    "settings": {
        "index": {
            "knn": true
        }
    },
    "mappings": {
        "properties": {
            "<embedding_field_name>": {
                "type": "knn_vector",
                "dimension": "<embedding_size>"
            }
        }
    }
}
```
{% include copy.html %}

### Ingest pipeline

Configure a single ML inference processor. Map your input text to the `inputText` model input field. Optionally, map the output `embedding` to a new document field.

### Search pipeline

Configure an ML inference search request processor and a normalization processor.

**For the ML inference processor**, map the query field containing the input text to the `inputText` model input field. Optionally, map the output `embedding` to a new field. Override the query so that it contains a `hybrid` query. Make sure to specify the `embedding_field`, `text_field`, and `text_field_input`:

```json
{
    "_source": {
        "excludes": [
            "<embedding_field>"
        ]
    },
    "query": {
        "hybrid": {
            "queries": [
                {
                    "match": {
                        "<text_field>": {
                            "query": "<text_field_input>"
                        }
                    }
                },
                {
                    "knn": {
                        "<embedding_field>": {
                            "vector": ${embedding},
                            "k": 10
                        }
                    }
                }
            ]
        }
    }
}
```
{% include copy.html %}

**For the normalization processor**, configure weights for each subquery. For more information, see the [hybrid search normalization processor example]({{site.url}}{{site.baseurl}}/search-plugins/hybrid-search/#step-3-configure-a-search-pipeline).

---

## Basic RAG (document summarization)

This example demonstrates how to configure basic retrieval-augmented generation (RAG).

The following example shows a simplified connector blueprint for the [Claude v1 messages API](https://docs.anthropic.com/en/api/getting-started#examples). While connector blueprints and model interfaces may evolve over time, this example demonstrates how to abstract complex API interactions into a single `prompt` field input.  

A sample input might appear as follows, with placeholders representing dynamically fetched results:  

```json
{
  "prompt": "Human: You are a professional data analyst. You are given a list of document results. You will analyze the data and generate a human-readable summary of the results. If you don't know the answer, just say I don't know.\n\n Results: ${parameters.results.toString()}\n\n Human: Please summarize the results.\n\n Assistant:"
}
```

### ML resources

Create and deploy an [Anthropic Claude 3 Sonnet model on Amazon Bedrock](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md#claude-3-sonnet-hosted-on-amazon-bedrock).

### Search pipeline

Configure an ML inference search response processor using the following steps:  

1. Select **Template** as the transformation type for the `prompt` input field.  
2. Open the template configuration by selecting **Configure**.  
3. Choose a preset template to simplify setup.  
4. Create an input variable that extracts the list of reviews (for example, `review`).  
5. Inject the variable into the prompt by copying and pasting it into the template.  
6. Select **Run preview** to verify that the transformed prompt correctly incorporates sample dynamic data.  
7. Select **Save** to apply the changes and exit.

---

## Multimodal search 

Multimodal search searches by text and image. This example demonstrates how to configure multimodal search.

### ML resources

Create and deploy an [Amazon Titan Multimodal Embeddings model on Amazon Bedrock](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md#amazon-bedrock-titan-multimodal-embedding).

### Index

Ensure that the index settings include `index.knn: true` and that your index contains a `knn_vector` field (to persist generated embeddings) and a `binary` field (to persist the image binary) specified in the mappings, as follows:

```json
{
    "settings": {
        "index": {
            "knn": true
        }
    },
    "mappings": {
        "properties": {
            "image_base64": {
                "type": "binary"
            },
            "image_embedding": {
                "type": "knn_vector",
                "dimension": <dimension>
            }
        }
    }
}
```
{% include copy.html %}

### Ingest pipeline

Configure a single ML inference processor. Map your input text field and input image field to the `inputText` and `inputImage` model input fields, respectively. If both text and image inputs are needed, ensure that both are mapped. Alternatively, you can map only one input (either text or image) if a single input is sufficient for embedding generation.

Optionally, map the output `embedding` to a new document field.

### Search pipeline

Configure a single ML inference search request processor. Map the input text field and input image field in the query to the `inputText` and `inputImage` model input fields, respectively. If both text and image inputs are needed, ensure that both are mapped. Alternatively, you can map only one input (either text or image) if a single input is sufficient for embedding generation.

Override the query so that it contains a `knn` query, including the embedding output:

```json
{
    "_source": {
        "excludes": [
            "<embedding_field>"
        ]
    },
    "query": {
        "knn": {
            "<embedding_field>": {
                "vector": ${embedding},
                "k": 10
            }
        }
    }
}
```
{% include copy.html %}

---

## Named entity recognition 

This example demonstrates how to configure named entity recognition (NER).

### ML resources

Create and deploy an [Amazon Comprehend Entity Detection model](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md#amazon-comprehend---entity-detection).

### Ingest pipeline

Configure a single ML inference processor. Map your input text field to the `text` model input fields. To persist any identified entities with each document, transform the output (an array of entities) and store them in the `entities_found` field. Use the following `output_map` configuration as a reference:

```json
"output_map": [
    {
        "entities_found": "$.response.Entities[*].Type"
    }
],
```
{% include copy.html %}

This configuration maps the extracted entities to the `entities_found` field, ensuring that they are stored alongside each document.

---

## Language detection and classification

The following example demonstrates how to configure language detection and classification.

### ML resources

Create and deploy an [Amazon Comprehend Language Detection model](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md#amazon-comprehend---language-detection).

### Ingest pipeline

Configure a single ML inference processor. Map your input text field to the `text` model input fields. To store the most relevant or most likely language detected for each document, transform the output (an array of languages) and persist it in the `detected_dominant_language` field. Use the following `output_map` configuration as a reference:

```json
"output_map": [
    {
              "detected_dominant_language": "response.Languages[0].LanguageCode"
    }
],
```
{% include copy.html %}

---

## Reranking results

Reranking can be implemented in various ways, depending on the capabilities of the model used. Typically, models require at least two inputs: the original query and the data to be assigned a relevance score. Some models support batching, allowing multiple results to be processed in a single inference call, while others require scoring each result individually.  

In OpenSearch, this leads to two common reranking patterns:  

1. **Batching enabled**  
   1. Collect all search results.  
   1. Pass the batched results to a single ML processor for scoring.  
   1. Return the top **n** ranked results.  

2. **Batching disabled**  
   1. Collect all search results.  
   1. Pass each result to the ML processor to assign a new relevance score.  
   1. Send all results with updated scores to the rerank processor for sorting.  
   1. Return the top **n** ranked results.  

The following example demonstrates **Pattern 2 (batching disabled)** to highlight the rerank processor. However, note that the **Cohere Rerank** model used in this example **does support batching**, so you could also implement **Pattern 1** with this model.

### ML resources

Create and deploy a [Cohere Rerank model](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md#cohere-rerank).

### Search pipeline

Configure an ML inference **search response** processor, followed by a rerank **search response** processor. For reranking with batching disabled, use the ML processor to generate new relevance scores for the retrieved results and then apply the reranker to sort them accordingly.  

Use the following ML processor configuration:  

1. Map the document field containing the data to be used for comparison to the model's `documents` field.  
2. Map the original query to the model's `query` field.  
3. Use JSONPath to access the query JSON, prefixed with `_request.query`. 

Use the following `input_map` configuration as a reference:

```json
"input_map": [
   {
      "documents": "description",
      "query": "$._request.query.term.value"
   }
],
```
{% include copy.html %}

Optionally, you can store the rescored result in the model output in a new field. You can also extract and persist only the relevance score, as follows:

```json
"input_map": [
   {
      "new_score": "results[0].relevance_score"
   }
],
```
{% include copy.html %}

Use the following rerank processor configuration: Under **target_field**, select the model score field (in this example, `new_score`).

---

## Multimodal search (text or image) with a custom CLIP model

The following example uses a custom CLIP model hosted on Amazon SageMaker. The model dynamically ingests a text or image URL as input and returns a vector embedding.

### ML resources

Create and deploy a [Custom CLIP Multimodal model](https://github.com/opensearch-project/dashboards-flow-framework/blob/main/documentation/models.md#custom-clip-multimodal-embedding).

### Index

Ensure that the index settings include `index.knn: true` and that your index contains a `knn_vector` field specified in the mappings, as follows:

```json
{
    "settings": {
        "index": {
            "knn": true
        }
    },
    "mappings": {
        "properties": {
            "<embedding_field_name>": {
                "type": "knn_vector",
                "dimension": "<embedding_size>"
            }
        }
    }
}
```
{% include copy.html %}

### Ingest pipeline

Configure a single ML inference processor. Map your image field to the `image_url` model input field or your text field to the `text` model input field, depending on what type of data you are ingesting and persisting in your index. For example, if building an application that returns relevant images based on text or image input, you want to persist images and should map the image field to the `image_url` field.

### Search pipeline

Configure a single ML inference search request processor. Map the input image field or the input text field in the query to the `image_url` or `text` model input fields, respectively. The CLIP model flexibly handles one or the other, so choose the option that best suits your use case.

Override the query so that it contains a `knn` query, including the embedding output:

```json
{
    "_source": {
        "excludes": [
            "<embedding_field>"
        ]
    },
    "query": {
        "knn": {
            "<embedding_field>": {
                "vector": ${embedding},
                "k": 10
            }
        }
    }
}
```
{% include copy.html %}