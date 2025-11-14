---
layout: default
title: CAT aliases
parent: CAT APIs
redirect_from:
- /opensearch/rest-api/cat/cat-aliases/

nav_order: 1
has_children: false
---

# CAT Aliases API
**Introduced 1.0**
{: .label .label-purple }

The CAT aliases operation lists the mapping of aliases to indexes, plus routing and filtering information.



<!-- spec_insert_start
api: cat.aliases
component: endpoints
-->
## Endpoints
```json
GET /_cat/aliases
GET /_cat/aliases/{name}
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.aliases
component: query_parameters
columns: Parameter, Data type, Description, Default
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `expand_wildcards` | List or String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. <br> Valid values are: <br> - `all`: Match any index, including hidden ones. <br> - `closed`: Match closed, non-hidden indexes. <br> - `hidden`: Match hidden indexes. Must be combined with `open`, `closed`, or both. <br> - `none`: Wildcard expressions are not accepted. <br> - `open`: Match open, non-hidden indexes. | N/A |
| `format` | String | A short version of the `Accept` header, such as `json` or `yaml`. | N/A |
| `h` | List | A comma-separated list of column names to display. | N/A |
| `help` | Boolean | Returns help information. | `false` |
| `local` | Boolean | Whether to return information from the local node only instead of from the cluster manager node. | `false` |
| `s` | List | A comma-separated list of column names or column aliases to sort by. | N/A |
| `v` | Boolean | Enables verbose mode, which displays column headers. | `false` |

<!-- spec_insert_end -->


## Example requests

<!-- spec_insert_start
component: example_code
rest: GET /_cat/aliases?v
-->
{% capture step1_rest %}
GET /_cat/aliases?v
{% endcapture %}

{% capture step1_python %}


response = client.cat.aliases(
  params = { "v": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

To limit the information to a specific alias, add the alias name after your query:

<!-- spec_insert_start
component: example_code
rest: GET /_cat/aliases/<alias>?v
-->
{% capture step1_rest %}
GET /_cat/aliases/<alias>?v
{% endcapture %}

{% capture step1_python %}


response = client.cat.aliases(
  name = "<alias>",
  params = { "v": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

If you want to get information for more than one alias, separate the alias names with commas:

<!-- spec_insert_start
component: example_code
rest: GET /_cat/aliases/alias1,alias2,alias3
body: 
-->
{% capture step1_rest %}
GET /_cat/aliases/alias1,alias2,alias3

{% endcapture %}

{% capture step1_python %}


response = client.cat.aliases(
  name = "alias1,alias2,alias3"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

The following response shows different types of alias configurations:

```json
alias            | index          | filter | routing.index | routing.search | is_write_index
current-logs     | app-logs-2024  | -      | -             | -              | -
filtered-data    | customer-data  | *      | -             | -              | -
regional-orders  | orders-2024    | -      | west          | west           | -
multi-route      | products       | -      | 1             | 1,2            | -
```

This response shows:
- `current-logs`: A simple alias without filters or routing
- `filtered-data`: An alias with a configured filter (indicated by `*`)
- `regional-orders`: An alias with routing configured for both indexing and searching
- `multi-route`: An alias with different routing for indexing (1) and searching (1,2)

To learn more about index aliases, see [Index aliases]({{site.url}}{{site.baseurl}}/opensearch/index-alias). For alias management APIs, see [Alias APIs]({{site.url}}{{site.baseurl}}/api-reference/alias/).
