---
layout: default
title: Min hash
parent: Token filters
nav_order: 270
---

# Min hash token filter

The `min_hash` token filter is used to generate hashes for tokens based on a [MinHash](https://en.wikipedia.org/wiki/MinHash) approximation algorithm, which is useful for detecting similarity between documents. The `min_hash` token filter generates hashes for a set of tokens (typically from an analyzed field).

Finding similar documents by comparing a document to every other document in an index does not scale to large indexes. Locality-sensitive hashing (LSH) reduces the number of comparisons by hashing documents so that similar documents are likely to produce the same hash values and dissimilar documents are not. MinHash is an LSH technique for [Jaccard similarity](https://en.wikipedia.org/wiki/Jaccard_index), which measures the overlap between two sets of tokens: the number of tokens the sets share divided by the number of distinct tokens in both sets.

MinHash applies a hash function to every token in a document and keeps only the smallest result. Two documents produce the same minimum hash with a probability equal to their Jaccard similarity, so the more minimum hashes two documents share, the more similar they are likely to be. The `min_hash` filter processes a token stream as follows:

1. Hashes each token using `hash_count` hash functions.
1. Distributes the hashes among `bucket_count` buckets.
1. Emits the `hash_set_size` smallest hashes from each bucket as tokens.

The emitted tokens form the document's signature. If you index the signature in a field, a full-text query on that field returns the documents that share signature tokens with the query text, which are candidates for near-duplicates.

## Parameters

The `min_hash` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`hash_count` | Optional | Integer | The number of hash values to generate for each token. Increasing this value generally improves the accuracy of similarity estimation but increases the computational cost. Default is `1`.
`bucket_count` | Optional | Integer | The number of hash buckets to use. This affects the granularity of the hashing. A larger number of buckets provides finer granularity and reduces hash collisions but requires more memory. Default is `512`.
`hash_set_size` | Optional | Integer | The number of hashes to retain in each bucket. This can influence the hashing quality. Larger set sizes may lead to better similarity detection but consume more memory. Default is `1`.
`with_rotation` | Optional | Boolean | When set to `true`, the filter populates empty buckets with the value from the first non-empty bucket found to its circular right, provided that the `hash_set_size` is `1`. If the `bucket_count` argument exceeds `1`, this setting automatically defaults to `true`; otherwise, it defaults to `false`.

## Tuning the min_hash filter

Consider the following guidelines when configuring the `min_hash` filter:

- Use word shingles, produced by the [`shingle`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/shingle/) filter, as input to the `min_hash` filter. Comparing sequences of words detects shared passages, while comparing single words only detects shared vocabulary. Choose a shingle size large enough that most shingles are rare across your documents but small enough that the possible shingles can be hashed into 128 bits with few collisions.
- Experiment with the parameter values using your own data. Increasing `bucket_count` or `hash_set_size` keeps more hashes for each document, which makes it less likely that dissimilar documents share tokens and improves precision. Increasing `hash_count` hashes each token in several ways, which produces more candidate matches and improves recall.
- Account for the increase in index size. Each token encodes a 128-bit hash. When `with_rotation` is `true` and `hash_set_size` is `1`, the filter emits `bucket_count` × `hash_count` tokens for every document, regardless of the document's length, so the default settings produce 512 tokens for each document.
- The `min_hash` filter measures whether a token is present, not how often it occurs. A document containing a word once and a document containing the same word many times produce the same hashes.

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