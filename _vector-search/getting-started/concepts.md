---
layout: default
title: Concepts
parent: Getting started
nav_order: 40
---

# Concepts  

This page defines key terms and techniques related to vector search in OpenSearch.

## Vector representations  

- [**_Vector embeddings_**]({{site.url}}{{site.baseurl}}/vector-search/getting-started/vector-search-basics/#vector-embeddings) are numerical representations of data—such as text, images, or audio—that encode meaning or features into a high-dimensional space. These embeddings enable similarity-based comparisons for search and machine learning (ML) tasks.  

- **_Dense vectors_** are high-dimensional numerical representations where most elements have nonzero values. They are typically produced by deep learning models and are used in semantic search and ML applications.  

- **_Sparse vectors_** contain mostly zero values and are often used in techniques like neural sparse search to efficiently represent and retrieve information.  

## Vector search fundamentals  

- [**_Vector search_**]({{site.url}}{{site.baseurl}}/vector-search/getting-started/vector-search-basics/), also known as _similarity search_ or _nearest neighbor search_, is a technique for finding items that are most similar to a given input vector. It is widely used in applications such as recommendation systems, image retrieval, and natural language processing.  

- A [**_space_**]({{site.url}}{{site.baseurl}}/vector-search/getting-started/vector-search-basics/#calculating-similarity) defines how similarity or distance between two vectors is measured. Different spaces use different distance metrics, such as Euclidean distance or cosine similarity, to determine how closely vectors resemble each other.  

- A [**_method_**]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/) refers to the algorithm used to organize vector data during indexing and retrieve relevant results during search in approximate k-NN search. Different methods balance trade-offs between accuracy, speed, and memory usage.  

- An [**_engine_**]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/) is the underlying library that implements vector search methods. It determines how vectors are indexed, stored, and retrieved during similarity search operations.  

## k-NN search  

- **_k-nearest neighbors (k-NN) search_** finds the k most similar vectors to a given query vector in an index. The similarity is determined based on a specified distance metric.  

- [**_Exact k-NN search_**]({{site.url}}{{site.baseurl}}/vector-search/vector-search-techniques/knn-score-script/) performs a brute-force comparison between a query vector and all vectors in an index, computing the exact nearest neighbors. This approach provides high accuracy but can be computationally expensive for large datasets.  

- [**_Approximate k-NN search_**]({{site.url}}{{site.baseurl}}/vector-search/vector-search-techniques/approximate-knn/) reduces computational complexity by using indexing techniques that speed up search operations while maintaining high accuracy. These methods restructure the index or reduce the dimensionality of vectors to improve performance.  

## Query types

- A [**_k-NN query_**]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/) searches vector fields using a query vector.

- A [**_neural query_**]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural/) searches vector fields using text or image data.

- A [**_neural sparse query_**]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural-sparse/) searches vector fields using raw text or sparse vector tokens.

## Search techniques  

- [**_Semantic search_**]({{site.url}}{{site.baseurl}}/vector-search/ai-search/semantic-search/) interprets the intent and contextual meaning of a query rather than relying solely on exact keyword matches. This approach improves the relevance of search results, especially for natural language queries.  

- [**_Hybrid search_**]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/) combines lexical (keyword-based) search with semantic (vector-based) search to improve search relevance. This approach ensures that results include both exact keyword matches and conceptually similar content.  

- [**_Multimodal search_**]({{site.url}}{{site.baseurl}}/vector-search/ai-search/multimodal-search/) enables you to search across multiple types of data, such as text and images. It allows queries in one format (for example, text) to retrieve results in another (for example, images).  

- [**_Radial search_**]({{site.url}}{{site.baseurl}}/vector-search/specialized-operations/radial-search-knn/) retrieves all vectors within a specified distance or similarity threshold from a query vector. It is useful for tasks that require finding all relevant matches within a given range rather than retrieving a fixed number of nearest neighbors.   

- [**_Neural sparse search_**]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-search/) uses an inverted index, similar to BM25, to efficiently retrieve relevant documents based on sparse vector representations. This approach maintains the efficiency of traditional lexical search while incorporating semantic understanding.  

- [**_Conversational search_**]({{site.url}}{{site.baseurl}}/vector-search/ai-search/conversational-search/) allows you to interact with a search system using natural language queries and refine results through follow-up questions. This approach enhances the user experience by making search more intuitive and interactive.  

- [**_Retrieval-augmented generation (RAG)_**]({{site.url}}{{site.baseurl}}/vector-search/ai-search/conversational-search/#rag) enhances large language models (LLMs) by retrieving relevant information from an index and incorporating it into the model's response. This approach improves the accuracy and relevance of generated text.  

## Indexing and storage techniques  

- [**_Text chunking_**]({{site.url}}{{site.baseurl}}/vector-search/ingesting-data/text-chunking/) involves splitting long documents or text passages into smaller segments to improve search retrieval and relevance. Chunking helps vector search models process large amounts of text more effectively.  

- [**_Vector quantization_**]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/knn-vector-quantization/) is a technique for reducing the storage size of vector embeddings by approximating them using a smaller set of representative vectors. This process enables efficient storage and retrieval in large-scale vector search applications.  

- **_Scalar quantization (SQ)_** reduces vector precision by mapping floating-point values to a limited set of discrete values, decreasing memory requirements while preserving search accuracy.  

- **_Product quantization (PQ)_** divides high-dimensional vectors into smaller subspaces and quantizes each subspace separately, enabling efficient approximate nearest neighbor search with reduced memory usage.  

- **_Binary quantization_** compresses vector representations by converting numerical values to binary formats. This technique reduces storage requirements and accelerates similarity computations.  

- [**_Disk-based vector search_**]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/disk-based-vector-search/) stores vector embeddings on disk rather than in memory, using binary quantization to reduce memory consumption while maintaining search efficiency.  

