---
layout: default
title: Execute inline script
parent: Script APIs
nav_order: 7
canonical_url: https://docs.opensearch.org/latest/api-reference/script-apis/exec-script/
---

# Execute Inline Script API
**Introduced 1.0**
{: .label .label-purple }

The Execute Inline Script API allows you to run a script directly without storing it in the cluster state. The script is compiled and executed each time the API is called.

## Endpoints

```json
GET /_scripts/painless/_execute
POST /_scripts/painless/_execute
```

## Request body fields

| Field | Description | 
:--- | :---
| script | The script to run. Required|
| context | A context for the script. Optional. Default is `painless_test`. |
| context_setup | Specifies additional parameters for the context. Optional.| 

## Example request
<!-- spec_insert_start
component: example_code
rest: POST /_scripts/painless/_execute
body: |
{
  "script": {
    "source": "doc['gpa_4_0'].value * params.max_gpa / 4.0",
    "params": {
      "max_gpa": 5.0
    }
  },
  "context": "score",
  "context_setup": {
    "index": "testindex1",
    "document": {
      "gpa_4_0": 3.5
    }
  }
}
-->
{% capture step1_rest %}
POST /_scripts/painless/_execute
{
  "script": {
    "source": "doc['gpa_4_0'].value * params.max_gpa / 4.0",
    "params": {
      "max_gpa": 5.0
    }
  },
  "context": "score",
  "context_setup": {
    "index": "testindex1",
    "document": {
      "gpa_4_0": 3.5
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.put_script(
  id = "painless",
  context = "_execute",
  body =   {
    "script": {
      "source": "doc['gpa_4_0'].value * params.max_gpa / 4.0",
      "params": {
        "max_gpa": 5.0
      }
    },
    "context": "score",
    "context_setup": {
      "index": "testindex1",
      "document": {
        "gpa_4_0": 3.5
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The following request uses the default `painless_context` for the script:

<!-- spec_insert_start
component: example_code
rest: GET /_scripts/painless/_execute
body: |
{
  "script": {
    "source": "(params.x + params.y)/ 2",
    "params": {
      "x": 80,
      "y": 100
    }
  }
}
-->
{% capture step1_rest %}
GET /_scripts/painless/_execute
{
  "script": {
    "source": "(params.x + params.y)/ 2",
    "params": {
      "x": 80,
      "y": 100
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.scripts_painless_execute(
  body =   {
    "script": {
      "source": "(params.x + params.y)/ 2",
      "params": {
        "x": 80,
        "y": 100
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

The response contains the average of two script parameters:

```json
{
  "result" : "90"
}
```

## Response body fields

| Field | Description | 
:--- | :--- 
| result | The script result.|


## Script contexts

Choose different contexts to control the variables that are available to the script and the result's return type. The default context is `painless_test`.

## Painless test context

The `painless_test` context is the default script context that provides only the `params` variable to the script. The returned result is always converted to a string. See the preceding example request for a usage example.

## Filter context

The `filter` context runs the script as if the script were inside a script query. You must provide a test document in the context. The `_source`, stored fields, and `_doc` variables will be available to the script.

You can specify the following parameters for the filter context in the `context_setup`.

Parameter | Description
:--- | :---
document | The document that is indexed in memory temporarily and available to the script.
index | The name of the index that contains a mapping for the document.

For example, first create an index with a mapping for a test document:

```json
PUT /testindex1
{
  "mappings": {
    "properties": {
      "grad": {
        "type": "boolean"
      },
      "gpa": {
        "type": "float"
      }
    }
  }
}
```
{% include copy-curl.html %}

Run a script to determine if a student is eligible to graduate with honors:

<!-- spec_insert_start
component: example_code
rest: POST /_scripts/painless/_execute
body: |
{
  "script": {
    "source": "doc['grad'].value == true && doc['gpa'].value >= params.min_honors_gpa",
    "params": {
      "min_honors_gpa": 3.5
    }
  },
  "context": "filter",
  "context_setup": {
    "index": "testindex1",
    "document": {
      "grad": true,
      "gpa": 3.79
    }
  }
}
-->
{% capture step1_rest %}
POST /_scripts/painless/_execute
{
  "script": {
    "source": "doc['grad'].value == true && doc['gpa'].value >= params.min_honors_gpa",
    "params": {
      "min_honors_gpa": 3.5
    }
  },
  "context": "filter",
  "context_setup": {
    "index": "testindex1",
    "document": {
      "grad": true,
      "gpa": 3.79
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.put_script(
  id = "painless",
  context = "_execute",
  body =   {
    "script": {
      "source": "doc['grad'].value == true && doc['gpa'].value >= params.min_honors_gpa",
      "params": {
        "min_honors_gpa": 3.5
      }
    },
    "context": "filter",
    "context_setup": {
      "index": "testindex1",
      "document": {
        "grad": true,
        "gpa": 3.79
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The response contains the result:

```json
{
  "result" : true
}
```

## Score context

The `score` context runs a script as if the script were in a `script_score` function in a `function_score` query.

You can specify the following parameters for the score context in the `context_setup`.

Parameter | Description
:--- | :---
document | The document that is indexed in memory temporarily and available to the script.
index | The name of the index that contains a mapping for the document.
query | If the script uses the `_score` parameter, the query can specify to use the `_score` field to compute the score.

For example, first create an index with a mapping for a test document:

```json
PUT /testindex1
{
  "mappings": {
    "properties": {
      "gpa_4_0": {
        "type": "float"
      }
    }
  }
}
```
{% include copy-curl.html %}

Run a script that converts a GPA on a 4.0 scale into a different scale that is provided as a parameter:

<!-- spec_insert_start
component: example_code
rest: POST /_scripts/painless/_execute
body: |
{
  "script": {
    "source": "doc['gpa_4_0'].value * params.max_gpa / 4.0",
    "params": {
      "max_gpa": 5.0
    }
  },
  "context": "score",
  "context_setup": {
    "index": "testindex1",
    "document": {
      "gpa_4_0": 3.5
    }
  }
}
-->
{% capture step1_rest %}
POST /_scripts/painless/_execute
{
  "script": {
    "source": "doc['gpa_4_0'].value * params.max_gpa / 4.0",
    "params": {
      "max_gpa": 5.0
    }
  },
  "context": "score",
  "context_setup": {
    "index": "testindex1",
    "document": {
      "gpa_4_0": 3.5
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.put_script(
  id = "painless",
  context = "_execute",
  body =   {
    "script": {
      "source": "doc['gpa_4_0'].value * params.max_gpa / 4.0",
      "params": {
        "max_gpa": 5.0
      }
    },
    "context": "score",
    "context_setup": {
      "index": "testindex1",
      "document": {
        "gpa_4_0": 3.5
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The response contains the result:

```json
{
  "result" : 4.375
}
```