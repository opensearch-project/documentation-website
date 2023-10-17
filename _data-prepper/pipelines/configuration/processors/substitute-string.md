---
layout: default
title: substitute_string
parent: Processors
grand_parent: Pipelines
nav_order: 110
---

# substitute_string

The `substitute_string` processor matches a key's value against a regular expression and replaces all matches with a replacement string. `substitute_string` is a [mutate string](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-string-processors#mutate-string-processors) processor. 

## Configuration

The following table describes the options you can use to configure the `substitue_string` processor.

Option | Required | Type | Description
:--- | :--- | :--- | :---
entries | Yes | List | List of entries. Valid values are `source`, `from`, and `to`.
source | N/A | N/A | The key to modify.
from | N/A | N/A | The Regex String to be replaced. Special regex characters such as `[` and `]` must be escaped using `\\` when using double quotes and `\ ` when using single quotes. See [Java Patterns](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/regex/Pattern.html) for more information.
to | N/A | N/A | The String to be substituted for each match of `from`.

<!---## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section.--->