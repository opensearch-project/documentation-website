---
layout: default
title: Feature engineering
nav_order: 40
parent: Learning to Rank
has_children: false
---

# Feature engineering

Common feature engineering tasks that you may encounter while developing a learning to rank (LTR) solution are described in the following sections.

## Getting raw term statistics

Many LTR solutions use raw term statistics in their training, such as the following: 
- **Total term frequency (`raw_ttf`):** The total number of times a term appears across the entire index.
- **Document frequency (`raw_df`):** The number of documents a term appears in.
- **Term frequency (`raw_tf`):** The number of times a term appears in a specific document. 
- **Classic IDF (`classic_idf`):** The Inverse Document Frequency (IDF) calculation `log((NUM_DOCS+1)/(raw_df+1)) + 1`.

The Learning to Rank plugin provides a `match_explorer` query primitive that can extract these statistics for you, as shown in the following example: 

```json
POST tmdb/_search
{
    "query": {
        "match_explorer": {
            "type": "max_raw_df",
            "query": {
                "match": {
                    "title": "rambo rocky"
                }
            }
        }
    }
}
```
{% include copy-curl.html %}

The query returns the highest document frequency between the terms `rambo ` and `rocky`. 

You can use other operations such as `max`, `min`, `sum`, and `stddev` with the various statistics to get the information you need.

### Term position statistics

You can prepend the `type` with the desired operation (`min`, `max`, `avg`) to calculate the corresponding statistic across the term positions. If the terms are note present in the document, then the result will be `0`. 

The available statistics include the following:

- `min_raw_tp` (minimum raw term position): This statistic finds the earliest position of any search term in the document. For example, with the query `dance monkey`, if `dance` occurs at positions [2,5 ,9] and `monkey` occurs at [1, 4], then the minimum is 1.                                     |
- `max_raw_tp` (maximum raw term position): This statistic finds the latest position of any search term in the document. For example, using the preceding example, the maximum is 9.
- `avg_raw_tp` (average raw term position): This statistic calculates the average term position for any of the query terms. For example, using the preceding example, for `dance` the average is 5.33 [(2+5+9)/3)] and for `monkey` is 2.5 [(1+4)/2], so the overall average is 3.91.
- `unique_terms_count`: Provides a count of the unique search terms in the query.

## Document-specific features

When working on an LTR solution, you may need to incorporate features that are specific to the document, rather than the relationship between the query and the document. These document-specific features can include metrics related to the popularity or recency. 

The OpenSearch `function_score` query provides the functionality to extract these document-specific features. The following example query shows how you can use it to incorporate the `vote_average` field as a feature:

```json
{
    "query": {
        "function_score": {
            "functions": [{
                "field_value_factor": {
                    "field": "vote_average",
                    "missing": 0
                }
            }],
            "query": {
                "match_all": {}
            }
        }
    }
}
```
{% include copy-curl.html %}

In this example, the score of the query will be determined by the value of the `vote_average` field, which could be a measure of popularity or quality for the document.

## Index drift

When working with an index that is regularly updated, it is important to consider that the trends and patterns you observe may not remain constant over time. You index can drift as user behavior, content, and other factors change. For example, on an e-commerce store, you may find that sandals a popular during the summer months, but become almost impossible to find in the winter. Similarly, the features that drive purchases or engagement during one time period may not be as important in another. 

## Next steps

Learn about [Logging feature scores]({{site.url}}{{site.baseurl}}/search-plugins/ltr/logging-features/)
