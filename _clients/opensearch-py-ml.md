---
layout: default
title: Python ML client
parent: Python client
nav_order: 10
---

# Python machine learning client

The Python machine learning (ML) client (`opensearch-py-ml`) is a Python library that you use together with the [Python client]({{site.url}}{{site.baseurl}}/clients/python-low-level/) (`opensearch-py`). It provides the following tools:

- DataFrames that represent OpenSearch indexes and support pandas-like operations, so that you can analyze data stored in OpenSearch.
- Methods for uploading ML models to the ML Commons plugin and managing them.

## Installing the Python ML client

The latest version of the client, `opensearch-py-ml` 1.3.0, requires Python 3.11 or later. To add the client to your project, install it using [pip](https://pip.pypa.io/):

```bash
pip install opensearch-py-ml
```
{% include copy.html %}

Installing `opensearch-py-ml` also installs the Python client (`opensearch-py`), which you use to connect to OpenSearch.

## Connecting to OpenSearch

To connect to OpenSearch, create a Python client object and import `opensearch_py_ml`. If you are using the Security plugin, create the client object with SSL enabled. Replace `<custom-admin-password>` with the admin password that you set when installing OpenSearch:

```python
from opensearchpy import OpenSearch
import opensearch_py_ml as oml

host = 'localhost'
port = 9200
auth = ('admin', '<custom-admin-password>') # For testing only. Don't store credentials in code.
ca_certs_path = '/full/path/to/root-ca.pem' # Provide a CA bundle if you use intermediate CAs with your root CA.

# Create the client with SSL/TLS enabled, but hostname verification disabled.
client = OpenSearch(
    hosts = [{'host': host, 'port': port}],
    http_compress = True, # enables gzip compression for request bodies
    http_auth = auth,
    use_ssl = True,
    verify_certs = True,
    ssl_assert_hostname = False,
    ssl_show_warn = False,
    ca_certs = ca_certs_path
)
```
{% include copy.html %}

If you are not using the Security plugin, create the client object with SSL disabled:

```python
from opensearchpy import OpenSearch
import opensearch_py_ml as oml

host = 'localhost'
port = 9200

# Create the client with SSL/TLS and hostname verification disabled.
client = OpenSearch(
    hosts = [{'host': host, 'port': port}],
    http_compress = True, # enables gzip compression for request bodies
    use_ssl = False,
    verify_certs = False,
    ssl_assert_hostname = False,
    ssl_show_warn = False
)
```
{% include copy.html %}

For more connection options, including connecting to Amazon OpenSearch Service, see [Python client]({{site.url}}{{site.baseurl}}/clients/python-low-level/).

## Analyzing data with DataFrames

An `opensearch-py-ml` DataFrame represents an OpenSearch index. When you select, filter, or aggregate data in a DataFrame, the client translates the operation into an OpenSearch request, so the data stays in the index until you need the results.

First, use the Python client to index sample documents into a `students` index:

```python
docs = [
    {"firstName": "John", "lastName": "Doe", "gpa": 3.89, "gradDate": "2022-05-15"},
    {"firstName": "Paulo", "lastName": "Santos", "gpa": 3.93, "gradDate": "2021-05-20"},
    {"firstName": "Shirley", "lastName": "Rodriguez", "gpa": 3.91, "gradDate": "2019-05-10"},
]

for doc_id, doc in enumerate(docs, start=1):
    client.index(index="students", id=doc_id, body=doc, refresh=True)
```
{% include copy.html %}

Then create a DataFrame for the `students` index and display its first rows:

```python
df = oml.DataFrame(client, "students")
print(df.head())
```
{% include copy.html %}

The output contains one row for each document, indexed by document ID:

```
  firstName   gpa   gradDate   lastName
1      John  3.89 2022-05-15        Doe
2     Paulo  3.93 2021-05-20     Santos
3   Shirley  3.91 2019-05-10  Rodriguez

[3 rows x 4 columns]
```

To calculate summary statistics for the numeric fields, use the `describe` method:

```python
print(df.describe())
```
{% include copy.html %}

The output contains statistics for the `gpa` field:

```
            gpa
count  3.000000
mean   3.910000
std    0.024495
min    3.890000
25%    3.890000
50%    3.910000
75%    3.930000
max    3.930000
```

To filter documents and select columns, use pandas syntax. The following example returns the names and GPAs of students whose GPA is greater than 3.9:

```python
print(df[df["gpa"] > 3.9][["firstName", "lastName", "gpa"]])
```
{% include copy.html %}

The output contains the two matching students:

```
  firstName   lastName   gpa
2     Paulo     Santos  3.93
3   Shirley  Rodriguez  3.91

[2 rows x 3 columns]
```

To convert a DataFrame to a pandas DataFrame, use the `to_pandas` method. This method retrieves all matching documents from OpenSearch.

For all DataFrame methods, see the [`opensearch-py-ml` DataFrame reference](https://opensearch-project.github.io/opensearch-py-ml/reference/dataframe.html).

## Uploading a pretrained model

Use the `MLCommonClient` class to register and deploy one of the [pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/) that OpenSearch provides.

By default, ML Commons runs models only on dedicated ML nodes. If your cluster doesn't have dedicated ML nodes, allow models to run on data nodes:

```python
client.cluster.put_settings(body={
    "persistent": {
        "plugins.ml_commons.only_run_on_ml_node": "false"
    }
})
```
{% include copy.html %}

For more information, see [ML Commons cluster settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/).

The following example registers and deploys the `huggingface/sentence-transformers/all-MiniLM-L6-v2` model. The method waits until the model is deployed and returns the model ID:

```python
from opensearch_py_ml.ml_commons import MLCommonClient

ml_client = MLCommonClient(client)

model_id = ml_client.register_pretrained_model(
    model_name="huggingface/sentence-transformers/all-MiniLM-L6-v2",
    model_version="1.0.2",
    model_format="TORCH_SCRIPT",
    deploy_model=True,
    wait_until_deployed=True
)
```
{% include copy.html %}

The method prints the model ID and the deployment task ID:

```
Model was registered successfully. Model Id:  oVMj-aABo6RnaVqceH5b
oVMj-aABo6RnaVqceH5b
Task ID: olMj-aABo6RnaVqcuX7E
Model deployed successfully
```

Because the example doesn't specify a model group, ML Commons creates a model group for the model. To register the model in an existing model group, pass the model group ID in the `model_group_id` parameter.

To generate an embedding using the deployed model, send the text to the model:

```python
response = ml_client.generate_model_inference(
    model_id,
    {"text_docs": ["Paulo Santos graduated in 2021."], "target_response": ["sentence_embedding"]}
)
embedding = response["inference_results"][0]["output"][0]
print(embedding["shape"])
print(embedding["data"][:3])
```
{% include copy.html %}

The model returns a 384-dimensional embedding. The output contains the embedding dimensions and the first three values:

```
[384]
[-0.0007759315, 0.018069174, 0.014426488]
```

When you no longer need the model, undeploy it and delete it, along with its model group:

```python
model_group_id = ml_client.get_model_info(model_id)["model_group_id"]
ml_client.undeploy_model(model_id)
ml_client.delete_model(model_id)
ml_client.model_access_control.delete_model_group(model_group_id)
```
{% include copy.html %}

## Related documentation

- For the complete client documentation, see the [`opensearch-py-ml` documentation](https://opensearch-project.github.io/opensearch-py-ml/index.html).
- For the client API reference, see the [`opensearch-py-ml` API reference](https://opensearch-project.github.io/opensearch-py-ml/reference/index.html).
- For example Jupyter notebooks, see the [`opensearch-py-ml` examples](https://opensearch-project.github.io/opensearch-py-ml/examples/index.html).
- For the client source code, see the [`opensearch-py-ml` GitHub repository](https://github.com/opensearch-project/opensearch-py-ml).
- For more information about pretrained models, see [Pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/).
