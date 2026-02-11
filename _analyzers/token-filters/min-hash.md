---
layout: default
title: Min hash
parent: Token filters
nav_order: 270
canonical_url: https://docs.opensearch.org/latest/analyzers/token-filters/min-hash/
---

# Min hash token filter

The `min_hash` token filter is used to generate hashes for tokens based on a [MinHash](https://en.wikipedia.org/wiki/MinHash) approximation algorithm, which is useful for detecting similarity between documents. The `min_hash` token filter generates hashes for a set of tokens (typically from an analyzed field).

## Parameters

The `min_hash` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`hash_count` | Optional | Integer | The number of hash values to generate for each token. Increasing this value generally improves the accuracy of similarity estimation but increases the computational cost. Default is `1`.
`bucket_count` | Optional | Integer | The number of hash buckets to use. This affects the granularity of the hashing. A larger number of buckets provides finer granularity and reduces hash collisions but requires more memory. Default is `512`.
`hash_set_size` | Optional | Integer | The number of hashes to retain in each bucket. This can influence the hashing quality. Larger set sizes may lead to better similarity detection but consume more memory. Default is `1`.
`with_rotation` | Optional | Boolean | When set to `true`, the filter populates empty buckets with the value from the first non-empty bucket found to its circular right, provided that the `hash_set_size` is `1`. If the `bucket_count` argument exceeds `1`, this setting automatically defaults to `true`; otherwise, it defaults to `false`.

## Example

The following example request creates a new index named `minhash_index` and configures an analyzer with a `min_hash` filter:

```json
PUT /minhash_index
{
  "settings": {
    "analysis": {
      "filter": {
        "minhash_filter": {
          "type": "min_hash",
          "hash_count": 3,
          "bucket_count": 512,
          "hash_set_size": 1,
          "with_rotation": false
        }
      },
      "analyzer": {
        "minhash_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "minhash_filter"
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /minhash_index/_analyze
{
  "analyzer": "minhash_analyzer",
  "text": "OpenSearch is very powerful."
}
```
{% include copy-curl.html %}

The response contains the generated tokens (the tokens are not human readable because they represent hashes):

```json
{
  "tokens" : [
    {
      "token" : "\u0000\u0000㳠锯ੲ걌䐩䉵",
      "start_offset" : 0,
      "end_offset" : 27,
      "type" : "MIN_HASH",
      "position" : 0
    },
    {
      "token" : "\u0000\u0000㳠锯ੲ걌䐩䉵",
      "start_offset" : 0,
      "end_offset" : 27,
      "type" : "MIN_HASH",
      "position" : 0
    },
    ...
```

In order to demonstrate the usefulness of the `min_hash` token filter, you can use the following Python script to compare the two strings using the previously created analyzer:

```python
from opensearchpy import OpenSearch
from requests.auth import HTTPBasicAuth

# Initialize the OpenSearch client with authentication
host = 'https://localhost:9200'  # Update if using a different host/port
auth = ('admin', 'admin')  # Username and password

# Create the OpenSearch client with SSL verification turned off
client = OpenSearch(
    hosts=[host],
    http_auth=auth,
    use_ssl=True,
    verify_certs=False,  # Disable SSL certificate validation
    ssl_show_warn=False  # Suppress SSL warnings in the output
)

# Analyzes text and returns the minhash tokens
def analyze_text(index, text):
    response = client.indices.analyze(
        index=index,
        body={
            "analyzer": "minhash_analyzer",
            "text": text
        }
    )
    return [token['token'] for token in response['tokens']]

# Analyze two similar texts
tokens_1 = analyze_text('minhash_index', 'OpenSearch is a powerful search engine.')
tokens_2 = analyze_text('minhash_index', 'OpenSearch is a very powerful search engine.')

# Calculate Jaccard similarity
set_1 = set(tokens_1)
set_2 = set(tokens_2)
shared_tokens = set_1.intersection(set_2)
jaccard_similarity = len(shared_tokens) / len(set_1.union(set_2))

print(f"Jaccard Similarity: {jaccard_similarity}")
```

The response should contain the Jaccard similarity score:

```yaml
Jaccard Similarity: 0.8571428571428571
```