# Sycamore ETL

[Sycamore](https://github.com/aryn-ai/sycamore) is an open source, AI-powered document processing engine to prepare unstructured data for RAG and semantic search. Sycamore can chunk and enrich a wide range of complex document types including reports, presentations, transcripts, manuals, and more, and it can extract and process embedded tables, figures, graphs, and other infographics. It can then load a target index, including vector and keyword indexes, using a connector (like the [OpenSearch connector](https://sycamore.readthedocs.io/en/stable/sycamore/connectors/opensearch.html)). 

[Visit the Sycamore documentation](https://sycamore.readthedocs.io/en/stable/sycamore/get_started.html) to get started.

# Structure of an ETL Pipeline

A Sycamore ETL pipeline to prepare unstructured data for vector or hybrid search in OpenSearch generally has these parts:

* Read documents into a DocSet
* Partition documents into structured JSON
* Extract metadata and clean data
* Create chunks
* Embed
* Load OpenSearch

You can see an example pipeline with this flow in this notebook.



# Install Sycamore
