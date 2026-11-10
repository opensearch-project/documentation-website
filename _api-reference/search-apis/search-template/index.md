---
layout: default
title: Search templates
parent: Search APIs
has_children: true
nav_order: 90
redirect_from:
  - /opensearch/search-template/
  - /search-plugins/search-template/
  - /api-reference/search-template/
  - /api-reference/search-apis/search-template/
---

# Search Templates API

You can convert your full-text queries into a search template to accept user input and dynamically insert it into your query.

For example, if you use OpenSearch as a backend search engine for your application or website, you can take in user queries from a search bar or a form field and pass them as parameters into a search template. That way, the syntax to create OpenSearch queries is abstracted from your end users.

When you're writing code to convert user input into OpenSearch queries, you can simplify your code with search templates. If you need to add fields to your search query, you can modify the template without making changes to your code.

Search templates use the Mustache language. For a list of all syntax options, see the [Mustache manual](https://mustache.github.io/mustache.5.html).
{: .note }

## Query parameters

The `_search/template` endpoint accepts the same query parameters as the Search API, including `typed_keys` and `rest_total_hits_as_int`. For more information, see [Search API]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/).

## Request body fields

The following table lists the available request body fields.

Field | Data type | Description
:--- | :--- | :---
`id` | String | The ID of a stored search template to run. Required if `source` is not specified.
`source` | Object or String | An inline search template. Specify the template as a string if it contains Mustache tags that make the JSON invalid. Required if `id` is not specified.
`params` | Object | The values that replace the variables in the template.
`explain` | Boolean | Whether to return details about how the score of each hit was calculated. Default is `false`.
`profile` | Boolean | Whether to return timing information about the execution of the query. Default is `false`.
`search_pipeline` | String | The name of the search pipeline to apply to the search request.

## Create search templates

A search template has two components: the query and the parameters. Parameters are user-inputted values that get placed into variables. Variables are represented with double braces in Mustache notation. When encountering a variable like `{% raw %}{{var}}{% endraw %}` in the query, OpenSearch goes to the `params` section, looks for a parameter called `var`, and replaces it with the specified value.

You can code your application to ask your user what they want to search for and then plug that value into the `params` object at runtime.

The examples on this page use the `shakespeare` index. To try them, first create the index:

```json
PUT /shakespeare
{
  "mappings": {
    "properties": {
      "line_id": { "type": "integer" },
      "play_name": { "type": "keyword" },
      "speech_number": { "type": "integer" },
      "speaker": { "type": "keyword" },
      "text_entry": { "type": "text" }
    }
  }
}
```
{% include copy-curl.html %}

Then add some lines from the plays to the index:

```json
POST /_bulk
{ "index": { "_index": "shakespeare", "_id": "1" } }
{ "line_id": 1, "play_name": "Henry IV", "speech_number": 1, "speaker": "KING HENRY IV", "text_entry": "So shaken as we are, so wan with care," }
{ "index": { "_index": "shakespeare", "_id": "2" } }
{ "line_id": 2, "play_name": "Henry IV", "speech_number": 1, "speaker": "KING HENRY IV", "text_entry": "Find we a time for frighted peace to pant," }
{ "index": { "_index": "shakespeare", "_id": "3" } }
{ "line_id": 3, "play_name": "Henry IV", "speech_number": 1, "speaker": "KING HENRY IV", "text_entry": "And breathe short-winded accents of new broils" }
{ "index": { "_index": "shakespeare", "_id": "4" } }
{ "line_id": 4, "play_name": "Othello", "speech_number": 1, "speaker": "IAGO", "text_entry": "I am not what I am." }
{ "index": { "_index": "shakespeare", "_id": "5" } }
{ "line_id": 5, "play_name": "Hamlet", "speech_number": 1, "speaker": "HAMLET", "text_entry": "To be, or not to be: that is the question:" }
{ "index": { "_index": "shakespeare", "_id": "6" } }
{ "line_id": 6, "play_name": "Romeo and Juliet", "speech_number": 1, "speaker": "ROMEO", "text_entry": "Did my heart love till now? forswear it, sight!" }
{ "index": { "_index": "shakespeare", "_id": "7" } }
{ "line_id": 7, "play_name": "As You Like It", "speech_number": 1, "speaker": "JAQUES", "text_entry": "Then a soldier, full of strange oaths," }
```
{% include copy-curl.html %}

This command defines a search template to find a play by its name. The `{% raw %}{{play_name}}{% endraw %}` in the query is replaced by the value `Henry IV`:

<!-- spec_insert_start
component: example_code
rest: GET /shakespeare/_search/template
body: |
{
  "source": {
    "query": {
      "match": {
        "play_name": "{% raw %}{{play_name}}{% endraw %}"
      }
    }
  },
  "params": {
    "play_name": "Henry IV"
  }
}
-->
{% capture step1_rest %}
GET /shakespeare/_search/template
{
  "source": {
    "query": {
      "match": {
        "play_name": "{% raw %}{{play_name}}{% endraw %}"
      }
    }
  },
  "params": {
    "play_name": "Henry IV"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.search_template(
  index = "shakespeare",
  body =   {
    "source": {
      "query": {
        "match": {
          "play_name": "{% raw %}{{play_name}}{% endraw %}"
        }
      }
    },
    "params": {
      "play_name": "Henry IV"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

This template runs the search on the `shakespeare` index. To run the search on all indexes in your cluster, omit the index name from the request:

<!-- spec_insert_start
component: example_code
rest: GET /_search/template
body: |
{
  "source": {
    "query": {
      "match": {
        "play_name": "{% raw %}{{play_name}}{% endraw %}"
      }
    }
  },
  "params": {
    "play_name": "Henry IV"
  }
}
-->
{% capture step1_rest %}
GET /_search/template
{
  "source": {
    "query": {
      "match": {
        "play_name": "{% raw %}{{play_name}}{% endraw %}"
      }
    }
  },
  "params": {
    "play_name": "Henry IV"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.search_template(
  body =   {
    "source": {
      "query": {
        "match": {
          "play_name": "{% raw %}{{play_name}}{% endraw %}"
        }
      }
    },
    "params": {
      "play_name": "Henry IV"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

Specify the `from` and `size` parameters:

<!-- spec_insert_start
component: example_code
rest: GET /_search/template
body: |
{
  "source": {
    "from": "{% raw %}{{from}}{% endraw %}",
    "size": "{% raw %}{{size}}{% endraw %}",
    "query": {
      "match": {
        "play_name": "{% raw %}{{play_name}}{% endraw %}"
      }
    }
  },
  "params": {
    "play_name": "Henry IV",
    "from": 10,
    "size": 10
  }
}
-->
{% capture step1_rest %}
GET /_search/template
{
  "source": {
    "from": "{% raw %}{{from}}{% endraw %}",
    "size": "{% raw %}{{size}}{% endraw %}",
    "query": {
      "match": {
        "play_name": "{% raw %}{{play_name}}{% endraw %}"
      }
    }
  },
  "params": {
    "play_name": "Henry IV",
    "from": 10,
    "size": 10
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.search_template(
  body =   {
    "source": {
      "from": "{% raw %}{{from}}{% endraw %}",
      "size": "{% raw %}{{size}}{% endraw %}",
      "query": {
        "match": {
          "play_name": "{% raw %}{{play_name}}{% endraw %}"
        }
      }
    },
    "params": {
      "play_name": "Henry IV",
      "from": 10,
      "size": 10
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

To improve the search experience, you can define defaults so the user doesn’t have to specify every possible parameter. If the parameter is not defined in the `params` section, OpenSearch uses the default value.

The syntax for defining the default value for a variable `var` is as follows:

```
{% raw %}{{var}}{{^var}}default value{{/var}}{% endraw %}
```
{% include copy.html %}

This command sets the defaults for `from` as 10 and `size` as 10:

<!-- spec_insert_start
component: example_code
rest: GET /_search/template
body: |
{
  "source": {
    "from": "{% raw %}{{from}}{{^from}}10{{/from}}{% endraw %}",
    "size": "{% raw %}{{size}}{{^size}}10{{/size}}{% endraw %}",
    "query": {
      "match": {
        "play_name": "{% raw %}{{play_name}}{% endraw %}"
      }
    }
  },
  "params": {
    "play_name": "Henry IV"
  }
}
-->
{% capture step1_rest %}
GET /_search/template
{
  "source": {
    "from": "{% raw %}{{from}}{{^from}}10{{/from}}{% endraw %}",
    "size": "{% raw %}{{size}}{{^size}}10{{/size}}{% endraw %}",
    "query": {
      "match": {
        "play_name": "{% raw %}{{play_name}}{% endraw %}"
      }
    }
  },
  "params": {
    "play_name": "Henry IV"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.search_template(
  body =   {
    "source": {
      "from": "{% raw %}{{from}}{{^from}}10{{/from}}{% endraw %}",
      "size": "{% raw %}{{size}}{{^size}}10{{/size}}{% endraw %}",
      "query": {
        "match": {
          "play_name": "{% raw %}{{play_name}}{% endraw %}"
        }
      }
    },
    "params": {
      "play_name": "Henry IV"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


## Save and execute search templates

After the search template works the way you want it to, you can save the source of that template as a script, making it reusable for different input parameters.

When saving the search template as a script, you need to specify the `lang` parameter as `mustache`:

```json
POST _scripts/play_search_template
{
  "script": {
    "lang": "mustache",
    "source": {
      "from": "{% raw %}{{from}}{{^from}}0{{/from}}{% endraw %}",
      "size": "{% raw %}{{size}}{{^size}}10{{/size}}{% endraw %}",
      "query": {
        "match": {
          "play_name": "{% raw %}{{play_name}}{% endraw %}"
        }
      }
    }
  }
}
```

Stored scripts don't keep default parameter values. If you include a `params` object when saving the script, OpenSearch discards it. To set default values in a stored template, use the `{% raw %}{{var}}{{^var}}default value{{/var}}{% endraw %}` syntax in the template source, as shown for `from` and `size` in the preceding request.

Now you can reuse the template by referring to its `id` parameter. You can reuse this source template for different input values:

<!-- spec_insert_start
component: example_code
rest: GET /shakespeare/_search/template
body: |
{
  "id": "play_search_template",
  "params": {
    "play_name": "Henry IV",
    "from": 0,
    "size": 1
  }
}
-->
{% capture step1_rest %}
GET /shakespeare/_search/template
{
  "id": "play_search_template",
  "params": {
    "play_name": "Henry IV",
    "from": 0,
    "size": 1
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.search_template(
  index = "shakespeare",
  body =   {
    "id": "play_search_template",
    "params": {
      "play_name": "Henry IV",
      "from": 0,
      "size": 1
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The response contains the first matching document:

```json
{
  "took": 6,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "shakespeare",
        "_id": "1",
        "_score": 1.0,
        "_source": {
          "line_id": 1,
          "play_name": "Henry IV",
          "speech_number": 1,
          "speaker": "KING HENRY IV",
          "text_entry": "So shaken as we are, so wan with care,"
        }
      }
    ]
  },
  "status": 200
}
```

If you have a stored template and want to validate it, use the `render` operation:

<!-- spec_insert_start
component: example_code
rest: POST /_render/template
body: |
{
  "id": "play_search_template",
  "params": {
    "play_name": "Henry IV"
  }
}
-->
{% capture step1_rest %}
POST /_render/template
{
  "id": "play_search_template",
  "params": {
    "play_name": "Henry IV"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.render_search_template(
  body =   {
    "id": "play_search_template",
    "params": {
      "play_name": "Henry IV"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

For more information, see [Render Template API]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-template/render-template/).

## Advanced parameter conversion with search templates

You have a lot of different syntax options in Mustache to transpose the input parameters into a query.
You can specify conditions, run loops, join arrays, convert arrays to JSON, and so on.

### Conditions

Use the section tag in Mustache to represent conditions:

```json
{% raw %}{{#var}}var{{/var}}{% endraw %}
```
{% include copy.html %}

When `var` is a Boolean value, this syntax acts as an `if` condition. The `{% raw %}{{#var}}{% endraw %}` and `{% raw %}{{/var}}{% endraw %}` tags insert the values placed between them only if `var` evaluates to `true`.

Using section tags would make your JSON invalid, so you must write your query in a string format instead.

This command includes the `size` parameter in the query only when the `limit` parameter is set to `true`.
In the following example, the `limit` parameter is `true`, so the rendered query includes `size` set to `2`:

<!-- spec_insert_start
component: example_code
rest: POST /_render/template
body: |
{
  "source": "{% raw %}{ {{#limit}} \"size\": \"{{size}}\", {{/limit}}  \"query\":{\"match\":{\"play_name\": \"{{play_name}}\"}}}{% endraw %}",
  "params": {
    "play_name": "Henry IV",
    "limit": true,
    "size": 2
  }
}
-->
{% capture step1_rest %}
POST /_render/template
{
  "source": "{% raw %}{ {{#limit}} \"size\": \"{{size}}\", {{/limit}}  \"query\":{\"match\":{\"play_name\": \"{{play_name}}\"}}}{% endraw %}",
  "params": {
    "play_name": "Henry IV",
    "limit": true,
    "size": 2
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.render_search_template(
  body =   {
    "source": "{% raw %}{ {{#limit}} \"size\": \"{{size}}\", {{/limit}}  \"query\":{\"match\":{\"play_name\": \"{{play_name}}\"}}}{% endraw %}",
    "params": {
      "play_name": "Henry IV",
      "limit": true,
      "size": 2
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

You can also design an `if-else` condition. This command sets `size` to `2` if `limit` is `true`. Otherwise, it sets `size` to `10`:

<!-- spec_insert_start
component: example_code
rest: GET /_search/template
body: |
{
  "source": "{% raw %}{ {{#limit}} \"size\": \"2\", {{/limit}} {{^limit}} \"size\": \"10\", {{/limit}} \"query\":{\"match\":{\"play_name\": \"{{play_name}}\"}}}{% endraw %}",
  "params": {
    "play_name": "Henry IV",
    "limit": true
  }
}
-->
{% capture step1_rest %}
GET /_search/template
{
  "source": "{% raw %}{ {{#limit}} \"size\": \"2\", {{/limit}} {{^limit}} \"size\": \"10\", {{/limit}} \"query\":{\"match\":{\"play_name\": \"{{play_name}}\"}}}{% endraw %}",
  "params": {
    "play_name": "Henry IV",
    "limit": true
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.search_template(
  body =   {
    "source": "{% raw %}{ {{#limit}} \"size\": \"2\", {{/limit}} {{^limit}} \"size\": \"10\", {{/limit}} \"query\":{\"match\":{\"play_name\": \"{{play_name}}\"}}}{% endraw %}",
    "params": {
      "play_name": "Henry IV",
      "limit": true
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Loops

You can also use the section tag to implement a for-each loop:

```
{% raw %}{{#var}}{{.}}{{/var}}{% endraw %}
```
{% include copy.html %}

When `var` is an array, the content between the tags is repeated for each array element, and `{% raw %}{{.}}{% endraw %}` refers to the current element. A loop that writes each element followed by a comma leaves a trailing comma after the last element, which makes the query invalid JSON. To pass an array of values to a `terms` query, use the `toJson` tag, which converts the array to a JSON array:

<!-- spec_insert_start
component: example_code
rest: GET /shakespeare/_search/template
body: |
{
  "source": "{% raw %}{\"query\":{\"terms\":{\"play_name\":{{#toJson}}play_name{{/toJson}}}}}{% endraw %}",
  "params": {
    "play_name": [
      "Henry IV",
      "Othello"
    ]
  }
}
-->
{% capture step1_rest %}
GET /shakespeare/_search/template
{
  "source": "{% raw %}{\"query\":{\"terms\":{\"play_name\":{{#toJson}}play_name{{/toJson}}}}}{% endraw %}",
  "params": {
    "play_name": [
      "Henry IV",
      "Othello"
    ]
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.search_template(
  index = "shakespeare",
  body =   {
    "source": "{% raw %}{\"query\":{\"terms\":{\"play_name\":{{#toJson}}play_name{{/toJson}}}}}{% endraw %}",
    "params": {
      "play_name": [
        "Henry IV",
        "Othello"
      ]
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

When you send this template to the [Render Template API]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-template/render-template/), the response contains the following query:

```json
{
  "template_output": {
    "query": {
      "terms": {
        "play_name": [
          "Henry IV",
          "Othello"
        ]
      }
    }
  }
}
```

### Join

Use the `join` tag to concatenate the values of an array. By default, the values are separated by a comma with no space:

<!-- spec_insert_start
component: example_code
rest: GET /shakespeare/_search/template
body: |
{
  "source": {
    "query": {
      "match": {
        "text_entry": "{% raw %}{{#join}}text_entry{{/join}}{% endraw %}"
      }
    }
  },
  "params": {
    "text_entry": [
      "To be",
      "or not to be"
    ]
  }
}
-->
{% capture step1_rest %}
GET /shakespeare/_search/template
{
  "source": {
    "query": {
      "match": {
        "text_entry": "{% raw %}{{#join}}text_entry{{/join}}{% endraw %}"
      }
    }
  },
  "params": {
    "text_entry": [
      "To be",
      "or not to be"
    ]
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.search_template(
  index = "shakespeare",
  body =   {
    "source": {
      "query": {
        "match": {
          "text_entry": "{% raw %}{{#join}}text_entry{{/join}}{% endraw %}"
        }
      }
    },
    "params": {
      "text_entry": [
        "To be",
        "or not to be"
      ]
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The template renders the following query:

```json
{
  "template_output": {
    "query": {
      "match": {
        "text_entry": "To be,or not to be"
      }
    }
  }
}
```

To use a different delimiter, specify it in both the opening and closing tags. The following tag separates the values with a space and renders `To be or not to be`:

```
{% raw %}{{#join delimiter=' '}}text_entry{{/join delimiter=' '}}{% endraw %}
```
{% include copy.html %}

### Convert to JSON

Use the `toJson` tag to convert parameters to their JSON representation. The following request passes an array of `match` queries as the `should` clauses of a `bool` query:

<!-- spec_insert_start
component: example_code
rest: GET /shakespeare/_search/template
body: |
{
  "source": "{\"query\":{\"bool\":{\"should\":{% raw %}{{#toJson}}clauses{{/toJson}}{% endraw %}}}}",
  "params": {
    "clauses": [
      { "match": { "text_entry": "love" } },
      { "match": { "text_entry": "soldier" } }
    ]
  }
}
-->
{% capture step1_rest %}
GET /shakespeare/_search/template
{
  "source": "{\"query\":{\"bool\":{\"should\":{% raw %}{{#toJson}}clauses{{/toJson}}{% endraw %}}}}",
  "params": {
    "clauses": [
      {
        "match": {
          "text_entry": "love"
        }
      },
      {
        "match": {
          "text_entry": "soldier"
        }
      }
    ]
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.search_template(
  index = "shakespeare",
  body =   {
    "source": "{\"query\":{\"bool\":{\"should\":{% raw %}{{#toJson}}clauses{{/toJson}}{% endraw %}}}}",
    "params": {
      "clauses": [
        {
          "match": {
            "text_entry": "love"
          }
        },
        {
          "match": {
            "text_entry": "soldier"
          }
        }
      ]
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The template renders the following query:

```json
{
  "template_output": {
    "query": {
      "bool": {
        "should": [
          {
            "match": {
              "text_entry": "love"
            }
          },
          {
            "match": {
              "text_entry": "soldier"
            }
          }
        ]
      }
    }
  }
}
```

### URL encoding

Use the `url` tag to URL-encode the content between the tags. This is useful when a template builds a URL from user input:

```json
POST /_render/template
{
  "source": {
    "query": {
      "term": {
        "source_url": "https://example.com/plays?name={% raw %}{{#url}}{{play_name}}{{/url}}{% endraw %}"
      }
    }
  },
  "params": {
    "play_name": "Romeo and Juliet"
  }
}
```
{% include copy-curl.html %}

The template renders the following query:

```json
{
  "template_output": {
    "query": {
      "term": {
        "source_url": "https://example.com/plays?name=Romeo+and+Juliet"
      }
    }
  }
}
```

## Multiple search templates

You can bundle multiple search templates and send them to your OpenSearch cluster in a single request using the `msearch` operation.
This saves network round trip time, so you get back the response more quickly as compared to independent requests.

The following example runs two stored templates. First, store the conditional template from the [Conditions](#conditions) section as `if_search_template`:

```json
POST _scripts/if_search_template
{
  "script": {
    "lang": "mustache",
    "source": "{% raw %}{ {{#limit}} \"size\": \"{{size}}\", {{/limit}}  \"query\":{\"match\":{\"play_name\": \"{{play_name}}\"}}}{% endraw %}"
  }
}
```
{% include copy-curl.html %}

Then run both `if_search_template` and `play_search_template` in a single request:

```json
GET _msearch/template
{"index":"shakespeare"}
{"id":"if_search_template","params":{"play_name":"Henry IV","limit":false,"size":2}}
{"index":"shakespeare"}
{"id":"play_search_template","params":{"play_name":"Henry IV"}}
```

For more information, see [Multi-search Template API]({{site.url}}{{site.baseurl}}/api-reference/search-apis/msearch-template/).

## Manage search templates

To list all scripts, run the following command:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/state/metadata?pretty&filter_path=**.stored_scripts
-->
{% capture step1_rest %}
GET /_cluster/state/metadata?pretty&filter_path=**.stored_scripts
{% endcapture %}

{% capture step1_python %}


response = client.cluster.state(
  metric = "metadata",
  params = { "pretty": "true", "filter_path": "**.stored_scripts" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

To retrieve a specific search template, run the following command:

<!-- spec_insert_start
component: example_code
rest: GET /_scripts/<name_of_search_template>
-->
{% capture step1_rest %}
GET /_scripts/<name_of_search_template>
{% endcapture %}

{% capture step1_python %}


response = client.get_script(
  id = "<name_of_search_template>"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

To delete a search template, run the following command:

<!-- spec_insert_start
component: example_code
rest: DELETE /_scripts/<name_of_search_template>
-->
{% capture step1_rest %}
DELETE /_scripts/<name_of_search_template>
{% endcapture %}

{% capture step1_python %}


response = client.delete_script(
  id = "<name_of_search_template>"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Search template API operations

The following search template API operations are available:

- [Multi-search template]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-template/msearch-template/)
- [Render template]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-template/render-template/)

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:data/read/search/template`.
