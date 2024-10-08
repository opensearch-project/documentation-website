---
layout: default
title: Phonetic
parent: Token filters
nav_order: 330
---

# Phonetic token filter

The `phonetic` token filter transforms tokens into their phonetic representation, enabling more flexible matching of words that sound similar but are spelled differently. This is particularly useful for searching names, brands, or other entities where users might spell things differently but pronounce them similarly.

`phonetic` token filter does not come pre-installed with OpenSearch. In order to use this token filter you first need to install the additional plugin using following command and restart OpenSearch:

```bash
./bin/opensearch-plugin install analysis-phonetic
```
{% include copy.html %}

Further details on how to install additional plugins are available at [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/)
{: .note}

## Parameters

The `phonetic` token filter can be configured with the following parameters:

- `encoder`: Specifies the phonetic algorithm to use. (String, _Optional_) 
    
    Possible options are:
    - metaphone (Default)
    - double_metaphone
    - soundex
    - refined_soundex
    - caverphone1
    - caverphone2
    - cologne
    - nysiis
    - koelnerphonetik
    - haasephonetik
    - beider_morse
    - daitch_mokotoff
    
- `replace`: Replace the original token. If `false` will preserve original token along with the phonetic encoding. Default is `true`. (Boolean, _Optional_)


## Example

The following example request creates a new index named `names_index` and configures an analyzer with `phonetic` filter:

```json
PUT /names_index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_phonetic_filter": {
          "type": "phonetic",
          "encoder": "double_metaphone",
          "replace": true
        }
      },
      "analyzer": {
        "phonetic_analyzer": {
          "tokenizer": "standard",
          "filter": [
            "my_phonetic_filter"
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated for name `Stephen` and `Steven` using the analyzer:

```json
POST /names_index/_analyze
{
  "text": "Stephen",
  "analyzer": "phonetic_analyzer"
}
```
{% include copy-curl.html %}

```json
POST /names_index/_analyze
{
  "text": "Steven",
  "analyzer": "phonetic_analyzer"
}
```
{% include copy-curl.html %}

In both cases the response contains the same generated token:

```json
{
  "tokens": [
    {
      "token": "STFN",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    }
  ]
}
```
