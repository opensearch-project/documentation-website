---
layout: default
title: Stemming
nav_order: 140
---

# Stemming

Stemming is the process of reducing words to their root or base form, known as the "stem." This technique ensures that different variations of a word match during search operations. For example, the words "running," "runner," and "ran" can all be reduced to the stem "run," allowing searches for any of these terms to return relevant results.

In natural language, words often appear in various forms due to conjugation, pluralization, or derivation. Stemming achieves the following:

- **Improving Search Recall**: By matching different word forms to a common stem, stemming increases the number of relevant documents retrieved.
- **Reducing Index Size**: Storing only the stemmed versions of words can decrease the overall size of the search index.

Stemming is configured using token filters within analyzers. An analyzer is a combination of:

1. **Character Filters**: Modifies the stream of characters before tokenization.
2. **Tokenizer**: Splits text into tokens (typically words).
3. **Token Filters**: Modifies tokens, such as by applying stemming.

## Stemming example using built-in token filters

To implement stemming, you can configure a built-in token filters such as [`porter_stem`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/porter-stem/) or [`kstem`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kstem/).

The Porter stemming algorithm is a common algorithmic stemmer for English.

### Creating an index with custom analyzer

The following example request creates a new index named `my_stemming_index` and configures an analyzer with the [`porter_stem`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/porter-stem/) token filter:

```json
PUT /my_stemming_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_stemmer_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "porter_stem"
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

This configuration is comprised of the following:

- The [`standard`]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/standard/) tokenizer splits text into terms based on word boundaries.
- The [`lowercase`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/lowercase/) filter converts all tokens to lowercase.
- The [`porter_stem`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/porter-stem/) filter reduces words to their root form.

### Testing the analyzer

To see the stemming in action, analyze a sample text using the previously configured custom analyzer:

```json
POST /my_stemming_index/_analyze
{
  "analyzer": "my_stemmer_analyzer",
  "text": "The runners are running swiftly."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "the",
      "start_offset": 0,
      "end_offset": 3,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "runner",
      "start_offset": 4,
      "end_offset": 11,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "ar",
      "start_offset": 12,
      "end_offset": 15,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "run",
      "start_offset": 16,
      "end_offset": 23,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "swiftli",
      "start_offset": 24,
      "end_offset": 31,
      "type": "<ALPHANUM>",
      "position": 4
    }
  ]
}
```

## Stemmers categories

There are two categories of stemmers that can be configured:

- [Algorithmic stemmers]({{site.url}}{{site.baseurl}}/analyzers/stemming/#algorithmic-stemmers)
- [Dictionary stemmers]({{site.url}}{{site.baseurl}}/analyzers/stemming/#dictionary-stemmers)

### Algorithmic stemmers

Algorithmic stemmers apply predefined rules to systematically strip affixes (prefixes and suffixes) from words, reducing them to their stems. See following list of token filters examples that use algorithmic stemmers:

[`porter_stem`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/porter-stem/): Applies the Porter stemming algorithm, primarily for English, to remove common suffixes and reduce words to their stems. For example, "running" becomes "run".

[`kstem`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kstem/): A lightweight stemmer designed for English that combines algorithmic stemming with a built-in dictionary. It reduces plurals to singulars, converts verb tenses to their base forms, and removes common derivational endings. 


[`stemmer`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/stemmer/): Provides algorithmic stemming for various languages, including English, with options for different stemming algorithms like `light_english`, `minimal_english`, and `porter2`. 


[`snowball`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/snowball/): Utilizes the Snowball algorithm to provide efficient and accurate stemming for multiple languages, including English, French, German, and others. 

### Dictionary stemmers

Dictionary stemmers rely on extensive dictionaries to map words to their root forms, effectively handling irregular words. They look up each word in a precompiled list to find its corresponding stem. This operation is more resource intensive but often yields better results for irregular words and words which might appear to have a similar stem but are very different in their meaning.

The most prominent example of a dictionary stemmer is [`hunspell`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/hunspell/) token filter, which leverages Hunspell, a spell checker engine used in many open-source applications.

### Consideration

- Algorithmic Stemmers are suitable when processing speed and memory efficiency are priorities, and the language has relatively regular morphological patterns.
- Dictionary Stemmers are ideal when accuracy in handling irregular word forms is crucial, and resources are available to support the increased memory usage and processing time.

Choose algorithmic stemmers for speed and efficiency with regular languages. Opt for dictionary stemmers for accuracy with complex languages, acknowledging the increased resource requirements.
{: .note}

### Additional stemming configuration

Although "organize" and "organic" share a common linguistic root, leading a stemmer to produce "organ" for both, their conceptual differences are significant. In practical search scenarios, this shared root can lead to irrelevant matches.

Further stemming configuration can address these challenges, using the following methods:

- **Explicit Stemming Overrides**: Rather than relying solely on algorithmic stemming, you can define specific rules. Using [`stemmer_override`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/stemmer_override/) allows you to make sure that "organize" remains unchanged, while "organic" is reduced to "organ." This grants granular control over the final form of terms.

- **Keyword Preservation**: To maintain the integrity of crucial terms, the [`keyword_marker`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/keyword-marker/) token filter can be used. This filter designates specific words as keywords, preventing subsequent stemmer filters from altering them. In this example, "organize" could be marked as a keyword, ensuring it is indexed exactly as it appears.

- **Conditional Stemming Control**: The [condition]({{site.url}}{{site.baseurl}}/analyzers/token-filters/condition/) token filter enables you to establish rules that determine whether a term should be stemmed. This can be based on various criteria, such as the term's presence in a predefined list.

- **Language-Specific Term Exclusion**: For built-in language analyzers, the [`stem_exclusion`]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/english/#stem-exclusion) parameter provides a way to specify words that should be exempt from stemming. For instance, you could add "organize" to the stem_exclusion list, preventing the analyzer from stemming it. This is useful for preserving the distinct meaning of specific terms within a given language.