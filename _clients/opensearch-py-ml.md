---
layout: default
title: Opensearch-py-ml
nav_order: 11
---

`opensearch-py-ml` is a Python client that provides a suite of data analytics and machine learning (ML) tools for OpenSearch. It provides data analysts with the following abilities:

- Call OpenSearch indexes and manipulate each index as a [pandas.DataFrame](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html). These data frames support complex filtering and aggregation operations.
- Provides basic support to upload models into OpenSearch using the [ML Commons plugin]({{site.url}}{{site.baseurl}}/ml-commons-plugin/index/)

## Install `opensearch-py-ml`

To add the client to your project install it using [pip](https://pip.pypa.io/):

```bash
pip install opensearch-py-ml
```

Then, import the client into OpenSearch like any other module:

```python
import openseach_py_ml as oml
from opensearch-py-ml import OpenSearch
```

## API reference

For information on all opensearch-py-ml objects, functions and methods, see the [opensearch-ply-ml API reference](https://opensearch-project.github.io/opensearch-py-ml/reference/index.html).

## Next steps

If you want to track or contribute to the development of the `opensearch-py-ml` client, see the [opensearch-py-ml GitHub repository](https://github.com/opensearch-project/opensearch-py-ml).

For example Python notebooks to use with the client, see [Examples](https://opensearch-project.github.io/opensearch-py-ml/examples/index.html).