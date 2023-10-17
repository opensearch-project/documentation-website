---
layout: default
title: Opensearch-py-ml
nav_order: 11
---

# opensearch-py-ml

`opensearch-py-ml` is a Python client that provides a suite of data analytics and natural language processing (NLP) support tools for OpenSearch. It provides data analysts with the ability to:

- Call OpenSearch indexes and manipulate them using the opensearch-py-ml [DataFrame](https://opensearch-project.github.io/opensearch-py-ml/reference/dataframe.html) APIs. The opensearch-py-ml DataFrame wraps an OpenSearch index into an API similar to [pandas](https://pandas.pydata.org/), giving you the ability to process large amounts of data from OpenSearch inside a Jupyter Notebook.
- Upload NLP [SentenceTransformer](https://www.sbert.net/) models into OpenSearch using the [ML Commons plugin]({{site.url}}{{site.baseurl}}/ml-commons-plugin/index/).
- Train and tune SentenceTransformer models with synthetic queries.

## Prerequisites 

To use `opensearch-py-ml`, install the [OpenSearch Python client]({{site.url}}{{site.baseurl}}/clients/python-low-level#setup). The Python client allows OpenSearch to use the Python syntax required to run DataFrames in `opensearch-py-ml`.

## Install `opensearch-py-ml`

To add the client to your project, install it using [pip](https://pip.pypa.io/):

```bash
pip install opensearch-py-ml
```
{% include copy.html %}

Then import the client into OpenSearch like any other module:

```python
from opensearchpy import OpenSearch
import opensearch_py_ml as oml
```
{% include copy.html %}

## API reference

For information on all opensearch-py-ml objects, functions, and methods, see the [opensearch-py-ml API reference](https://opensearch-project.github.io/opensearch-py-ml/reference/index.html).

## Next steps

If you want to track or contribute to the development of the `opensearch-py-ml` client, see the [opensearch-py-ml GitHub repository](https://github.com/opensearch-project/opensearch-py-ml).

For example Python notebooks to use with the client, see [Examples](https://opensearch-project.github.io/opensearch-py-ml/examples/index.html).
