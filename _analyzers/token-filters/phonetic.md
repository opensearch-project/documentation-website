---
layout: default
title: Phonetic
parent: Token filters
nav_order: 330
canonical_url: https://docs.opensearch.org/latest/analyzers/token-filters/phonetic/
---

# Phonetic token filter

The `phonetic` token filter transforms tokens into their phonetic representations, enabling more flexible matching of words that sound similar but are spelled differently. This is particularly useful for searching names, brands, or other entities that users might spell differently but pronounce similarly.

The `phonetic` token filter is not included in OpenSearch distributions by default. To use this token filter, you must first install the `analysis-phonetic` plugin as follows and then restart OpenSearch:

```bash
./bin/opensearch-plugin install analysis-phonetic
```
{% include copy.html %}

For more information about installing plugins, see [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/).
{: .note}

## Parameters

The `phonetic` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`encoder` | Optional | String | Specifies the phonetic algorithm to use.<br><br>Valid values are:<br>- `metaphone` (default)<br>- `double_metaphone`<br>- `soundex`<br>- `refined_soundex`<br>- `caverphone1`<br>- `caverphone2`<br>- `cologne`<br>- `nysiis`<br>- `koelnerphonetik`<br>- `haasephonetik`<br>- `beider_morse`<br>- `daitch_mokotoff ` 
`replace` | Optional | Boolean | Whether to replace the original token. If `false`, the original token is included in the output along with the phonetic encoding. Default is `true`.


## Example

The following example request creates a new index named `names_index` and configures an analyzer with a `phonetic` filter:

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

Use the following request to examine the tokens generated for the names `Stephen` and `Steven` using the analyzer:

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

In both cases, the response contains the same generated token:

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
