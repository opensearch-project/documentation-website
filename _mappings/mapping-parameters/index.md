---
layout: default
title: Mapping parameters
nav_order: 100
has_children: true
has_toc: false
redirect_from:
  - /field-types/mapping-parameters/
  - /field-types/mapping-parameters/index/
  - /mappings/mapping-parameters/
---

# Mapping parameters

Mapping parameters are used to configure the behavior of index fields. For parameter use cases, see a mapping parameter's respective page.

The following table lists OpenSearch mapping parameters.

Parameter | Description
:--- | :---
[`analyzer`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/analyzer/) | Specifies the analyzer to use for text analysis when indexing or searching a text field, handling both index-time and search-time analysis unless overridden by search_analyzer.
[`boost`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/boost/) | Increases or decreases the relevance score of a field during search queries by applying a multiplier to the field's score contribution.
[`coerce`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/coerce/) | Controls whether OpenSearch attempts to normalize and convert values to match the field's data type during indexing (e.g., converting strings to numbers or truncating floats to integers).
[`copy_to`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/copy-to/) | Copies the values of multiple fields into a group field, which can then be queried as a single field without modifying the original `_source`.
[`doc_values`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/doc-values/) | Controls whether an on-disk, column-oriented data structure is created at index time to enable fast sorting, aggregations, and field access in scripts.
[`dynamic`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/dynamic/) | Specifies whether newly detected fields can be added dynamically to a mapping (options include true, false, strict, strict_allow_templates, and false_allow_templates).
[`eager_global_ordinals`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/eager_global_ordinals/) | Controls when global ordinals are built for a field, with eager loading computing them during index refresh rather than during query execution to improve aggregation and sorting performance.
[`enabled`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/enabled/) | Controls whether OpenSearch parses and indexes field contents; when set to false, the field is stored in `_source` but not searchable.
[`fields`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/fields/) | Enables indexing the same field in multiple ways by defining additional subfields with alternate mappings (e.g., different data types or analyzers) to support varied search and aggregation requirements.
[`format`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/format/) | Specifies the built-in date formats that a date field can accept during indexing to ensure correct parsing and storage of date values.
[`ignore_above`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/ignore-above/) | Limits the maximum number of characters for an indexed string; values exceeding the threshold are stored but not indexed to prevent index bloat.
[`ignore_malformed`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/ignore-malformed/) | Instructs the indexing engine to ignore values that do not match the field's expected format, storing documents even if some fields contain unparseable data.
[`index`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/index-parameter/) | Controls whether a field is included in the inverted index; when set to false, the field is stored but not searchable (unless doc_values are enabled).
[`index_options`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/index-options/) | Controls the level of detail stored in the inverted index for text fields (options include docs, freqs, positions, and offsets), influencing index size and capabilities for scoring, phrase matching, and highlighting.
[`index_phrases`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/index-phrases/) | Determines whether a field's text is additionally processed to generate phrase tokens (bigrams) to improve the performance and accuracy of phrase queries at the cost of increased index size.
[`index_prefixes`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/index-prefixes/) | Generates additional index entries for the beginning segments of terms in a text field to significantly improve the performance of prefix queries like autocomplete or search-as-you-type.
[`meta`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/meta/) | Allows you to attach metadata to your mapping definition, which is stored alongside your mapping as informational context without influencing indexing or search operations.
[`normalizer`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/normalizer/) | Defines a custom normalization process for keyword fields, transforming the entire field value into a single token using token filters while keeping the `_source` unchanged.
[`norms`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/norms/) | Controls whether normalization factors are computed and stored for a field to adjust relevance scoring, with storage increasing index size and memory consumption.
[`null_value`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/null-value/) | Replaces explicit `null` values with a predefined substitute during indexing, allowing queries and aggregations on originally null fields without modifying the document `_source`.
[`position_increment_gap`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/position-increment-gap/) | Defines the positional distance between tokens of multi-valued fields during indexing, affecting how match_phrase and span queries behave when searching across multiple values (default is 100 positions).
[`properties`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/properties/) | Defines the structure and data types of fields within an object or document root, serving as the core of any mapping definition to control indexing, storage, search behavior, and data validation.
[`search_analyzer`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/search-analyzer/) | Specifies the analyzer to be used at search time for a text field, allowing the analyzer used for indexing to differ from the one used for search for greater control over term matching.
[`similarity`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/similarity/) | Customizes how relevance scores are calculated for a text field during search by defining the scoring algorithm (options include BM25 and boolean).
[`store`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/store/) | Determines whether the value of a field should be stored separately from `_source` and made directly retrievable using the stored_fields option in a search request.
[`term_vector`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/term-vector/) | Controls whether term-level information (term frequency, position, and character offsets) is stored for text fields during indexing for use in advanced features like custom scoring and highlighting.

