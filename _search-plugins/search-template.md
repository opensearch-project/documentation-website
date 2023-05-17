---
layout: default
title: Search templates
nav_order: 50
redirect_from:
  - /opensearch/search-template/
---

# Search templates

You can convert your full-text queries into a search template to accept user input and dynamically insert it into your query.

For example, if you use OpenSearch as a backend search engine for your application or website, you can take in user queries from a search bar or a form field and pass them as parameters into a search template. That way, the syntax to create OpenSearch queries is abstracted from your end users.

When you're writing code to convert user input into OpenSearch queries, you can simplify your code with search templates. If you need to add fields to your search query, you can just modify the template without making changes to your code.

Search templates use the Mustache language. For a list of all syntax options, see the [Mustache manual](https://mustache.github.io/mustache.5.html).
{: .note }

## Create search templates

A search template has two components: the query and the parameters. Parameters are user-inputted values that get placed into variables. Variables are represented with double braces in Mustache notation. When encountering a variable like `{% raw %}{{var}}{% endraw %}` in the query, OpenSearch goes to the `params` section, looks for a parameter called `var`, and replaces it with the specified value.

You can code your application to ask your user what they want to search for and then plug that value into the `params` object at runtime.

This command defines a search template to find a play by its name. The `{% raw %}{{play_name}}{% endraw %}` in the query is replaced by the value `Henry IV`:

```json
GET _search/template
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
```

This template runs the search on your entire cluster.
To run this search on a specific index, add the index name to the request:

```json
GET shakespeare/_search/template
```

Specify the `from` and `size` parameters:

```json
GET _search/template
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
```

To improve the search experience, you can define defaults so the user doesn’t have to specify every possible parameter. If the parameter is not defined in the `params` section, OpenSearch uses the default value.

The syntax for defining the default value for a variable `var` is as follows:

```json
{% raw %}{{var}}{{^var}}default value{{/var}}{% endraw %}
```

This command sets the defaults for `from` as 10 and `size` as 10:

```json
GET _search/template
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
```


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
          "play_name": "{{play_name}}"
        }
      }
    },
    "params": {
      "play_name": "Henry IV"
    }
  }
}
```

Now you can reuse the template by referring to its `id` parameter.
You can reuse this source template for different input values.

```json
GET _search/template
{
  "id": "play_search_template",
  "params": {
    "play_name": "Henry IV",
    "from": 0,
    "size": 1
  }
}
```
#### Sample output

```json
{
  "took": 7,
  "timed_out": false,
  "_shards": {
    "total": 6,
    "successful": 6,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3205,
      "relation": "eq"
    },
    "max_score": 3.641852,
    "hits": [
      {
        "_index": "shakespeare",
        "_type": "_doc",
        "_id": "4",
        "_score": 3.641852,
        "_source": {
          "type": "line",
          "line_id": 5,
          "play_name": "Henry IV",
          "speech_number": 1,
          "line_number": "1.1.2",
          "speaker": "KING HENRY IV",
          "text_entry": "Find we a time for frighted peace to pant,"
        }
      }
    ]
  }
}
```

If you have a stored template and want to validate it, use the `render` operation:

```json
POST _render/template
{
  "id": "play_search_template",
  "params": {
    "play_name": "Henry IV"
  }
}
```

#### Sample output

```json
{
  "template_output": {
    "from": "0",
    "size": "10",
    "query": {
      "match": {
        "play_name": "Henry IV"
      }
    }
  }
}
```

The following render operations are supported:

```json
GET /_render/template
POST /_render/template
GET /_render/template/<id>
POST /_render/template/<id>
```

## Advanced parameter conversion with search templates

You have a lot of different syntax options in Mustache to transpose the input parameters into a query.
You can specify conditions, run loops, join arrays, convert arrays to JSON, and so on.

### Conditions

Use the section tag in Mustache to represent conditions:

```json
{% raw %}{{#var}}var{{/var}}{% endraw %}
```

When `var` is a boolean value, this syntax acts as an `if` condition. The `{% raw %}{{#var}}{% endraw %}` and `{% raw %}{{/var}}{% endraw %}` tags insert the values placed between them only if `var` evaluates to `true`.

Using section tags would make your JSON invalid, so you must write your query in a string format instead.

This command includes the `size` parameter in the query only when the `limit` parameter is set to `true`.
In the following example, the `limit` parameter is `true`, so the `size` parameter is activated. As a result, you would get back only two documents.

```json
GET _search/template
{
  "source": "{% raw %}{ {{#limit}} \"size\": \"{{size}}\", {{/limit}}  \"query\":{\"match\":{\"play_name\": \"{{play_name}}\"}}}{% endraw %}",
  "params": {
    "play_name": "Henry IV",
    "limit": true,
    "size": 2
  }
}
```

You can also design an `if-else` condition.
This command sets `size` to `2` if `limit` is `true`. Otherwise, it sets `size` to `10`.

```json
GET _search/template
{
  "source": "{% raw %}{ {{#limit}} \"size\": \"2\", {{/limit}} {{^limit}} \"size\": \"10\", {{/limit}} \"query\":{\"match\":{\"play_name\": \"{{play_name}}\"}}}{% endraw %}",
  "params": {
    "play_name": "Henry IV",
    "limit": true
  }
}
```

### Loops

You can also use the section tag to implement a for each loop:

```
{% raw %}{{#var}}{{.}}}{{/var}}{% endraw %}
```

When `var` is an array, the search template iterates through it and creates a `terms` query.

```json
GET _search/template
{
  "source": "{% raw %}{\"query\":{\"terms\":{\"play_name\":[\"{{#play_name}}\",\"{{.}}\",\"{{/play_name}}\"]}}}{% endraw %}",
  "params": {
    "play_name": [
      "Henry IV",
      "Othello"
    ]
  }
}
```

This template is rendered as:

```json
GET _search/template
{
  "source": {
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

You can use the `join` tag to concatenate values of an array (separated by commas):

```json
GET _search/template
{
  "source": {
    "query": {
      "match": {
        "text_entry": "{% raw %}{{#join}}{{text_entry}}{{/join}}{% endraw %}"
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
```

Renders as:

```json
GET _search/template
{
  "source": {
    "query": {
      "match": {
        "text_entry": "{0=To be, 1=or not to be}"
      }
    }
  }
}
```

### Convert to JSON

You can use the `toJson` tag to convert parameters to their JSON representation:

```json
GET _search/template
{
  "source": "{\"query\":{\"bool\":{\"must\":[{\"terms\": {\"text_entries\": {% raw %}{{#toJson}}text_entries{{/toJson}}{% endraw %} }}] }}}",
  "params": {
    "text_entries": [
        { "term": { "text_entry" : "love" } },
        { "term": { "text_entry" : "soldier" } }
    ]
  }
}
```

Renders as:

```json
GET _search/template
{
  "source": {
    "query": {
      "bool": {
        "must": [
          {
            "terms": {
              "text_entries": [
                {
                  "term": {
                    "text_entry": "love"
                  }
                },
                {
                  "term": {
                    "text_entry": "soldier"
                  }
                }
              ]
            }
          }
        ]
      }
    }
  }
}
```

## Multiple search templates

You can bundle multiple search templates and send them to your OpenSearch cluster in a single request using the `msearch` operation.
This saves network round trip time, so you get back the response more quickly as compared to independent requests.

```json
GET _msearch/template
{"index":"shakespeare"}
{"id":"if_search_template","params":{"play_name":"Henry IV","limit":false,"size":2}}
{"index":"shakespeare"}
{"id":"play_search_template","params":{"play_name":"Henry IV"}}
```

## Manage search templates

To list all scripts, run the following command:

```json
GET _cluster/state/metadata?pretty&filter_path=**.stored_scripts
```

To retrieve a specific search template, run the following command:

```json
GET _scripts/<name_of_search_template>
```

To delete a search template, run the following command:

```json
DELETE _scripts/<name_of_search_template>
```

---
