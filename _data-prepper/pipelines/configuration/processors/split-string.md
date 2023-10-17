---
layout: default
title: split_string
parent: Processors
grand_parent: Pipelines
nav_order: 100
---

# split_string


The `split_string` processor splits a field into an array using a delimiting character and is a [mutate string](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-string-processors#mutate-string-processors) processor. The following table describes the options you can use to configure the `split_string` processor.

Option | Required | Type | Description
:--- | :--- | :--- | :---
entries | Yes | List | List of entries. Valid values are `source`, `delimiter`, and `delimiter_regex`.
source | N/A | N/A | The key to split.
delimiter | No | N/A | The separator character responsible for the split. Cannot be defined at the same time as `delimiter_regex`. At least `delimiter` or `delimiter_regex` must be defined.
delimiter_regex | No | N/A | The regex string responsible for the split. Cannot be defined at the same time as `delimiter`. At least `delimiter` or `delimiter_regex` must be defined.

<!---## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section.--->