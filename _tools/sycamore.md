# Sycamore ETL

[Sycamore](https://github.com/aryn-ai/sycamore) is an open source, AI-powered document processing engine to prepare unstructured data for RAG and semantic search using Python. Sycamore can chunk and enrich a wide range of complex document types including reports, presentations, transcripts, manuals, and more, and it can extract and process embedded tables, figures, graphs, and other infographics. It can then load a target index, including vector and keyword indexes, using a connector (like the [OpenSearch connector](https://sycamore.readthedocs.io/en/stable/sycamore/connectors/opensearch.html)). 

[Visit the Sycamore documentation](https://sycamore.readthedocs.io/en/stable/sycamore/get_started.html) to get started.

# Structure of an ETL Pipeline

A Sycamore ETL pipeline is a series of transformations on a [DocSet](https://sycamore.readthedocs.io/en/stable/sycamore/get_started/concepts.html#docsets), which is a collection of documents and their constintuent elements (e.g. a table, block of text, or header). At the end of the pipeline, the DocSet is loaded into OpenSearch vector and keyword indexes.

A pipeline to prepare unstructured data for vector or hybrid search in OpenSearch generally has these parts:

* Read documents into a [DocSet](https://sycamore.readthedocs.io/en/stable/sycamore/get_started/concepts.html#docsets)
* [Partition documents](https://sycamore.readthedocs.io/en/stable/sycamore/transforms/partition.html) into structured JSON elements
* Extract metadata, filter, and clean data with [transforms](https://sycamore.readthedocs.io/en/stable/sycamore/APIs/docset.html)
* Create [chunks](https://sycamore.readthedocs.io/en/stable/sycamore/transforms/merge.html) from groups of elements
* Embed with the model of your choice
* [Load](https://sycamore.readthedocs.io/en/stable/sycamore/connectors/opensearch.html) OpenSearch

You can see an example pipeline with this flow in [this notebook](https://github.com/aryn-ai/sycamore/blob/main/notebooks/opensearch_docs_etl.ipynb).


# Install Sycamore

We recommend installing the Sycamore library using `pip`. The connector for OpenSearch can be installed via extras. For example:

```
pip install sycamore-ai[opensearch]
```

By default, Sycamore works with the Aryn Partitioning Service to process PDFs. To run inference locally for partitioning or embedding, install the local-inference extra as follows:

```
pip install sycamore-ai[opensearch,local-inference]
```
