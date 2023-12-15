---
layout: default
title: Create or Update Stored Script
parent: Script APIs
nav_order: 1
---

# Create or update stored script
**Introduced 1.0**
{: .label .label-purple }

Creates or updates a stored script or search template.

For additional information about Painless scripting, see:

* [k-NN Painless Scripting extensions]({{site.url}}{{site.baseurl}}/search-plugins/knn/painless-functions/).

* [k-NN]({{site.url}}{{site.baseurl}}/search-plugins/knn/index/).


## Path parameters

| Parameter | Data type | Description | 
:--- | :--- | :---
| script-id | String | Stored script or search template ID. Must be unique across the cluster. Required. |

## Query parameters

All parameters are optional.

| Parameter | Data type | Description | 
:--- | :--- | :---
| context | String | Context in which the script or search template is to run. To prevent errors, the API immediately compiles the script or template in this context. |
| cluster_manager_timeout | Time | Amount of time to wait for a connection to the cluster manager. Defaults to 30 seconds. |
| timeout | Time | The period of time to wait for a response. If a response is not received before the timeout value, the request fails and returns an error. Defaults to 30 seconds.|

## Request fields

| Field | Data type | Description | 
:--- | :--- | :---
| script | Object | Defines the script or search template, its parameters, and its language. See *Script object* below. |

*Script object*

| Field | Data type | Description | 
:--- | :--- | :---
| lang | String | Scripting language. Required. |
| source | String or Object | Required. <br /> <br /> For scripts, a string with the contents of the script. <br /> <br /> For search templates, an object that defines the search template. Supports the same parameters as the [Search]({{site.url}}{{site.baseurl}}/api-reference/search) API request body. Search templates also support Mustache variables. |

#### Example request

The sample uses an index called `books` with the following documents:

````json
{"index":{"_id":1}}
{"name":"book1","author":"Faustine","ratings":[4,3,5]}
{"index":{"_id":2}}
{"name":"book2","author":"Amit","ratings":[5,5,5]}
{"index":{"_id":3}}
{"name":"book3","author":"Gilroy","ratings":[2,1,5]}
````

The following request creates the Painless script `my-first-script`. It sums the ratings for each book and displays the sum in the output.

````json
PUT _scripts/my-first-script
{
  "script": {
      "lang": "painless",
      "source": """
          int total = 0;
          for (int i = 0; i < doc['ratings'].length; ++i) {
            total += doc['ratings'][i];
          }
          return total;
        """
  }
}
````
{% include copy.html %}

The example above uses the syntax of the Dev Tools console in OpenSearch Dashboards. You can also use a curl request.
{: .note }

The following curl request is equivalent to the previous Dashboards console example:

````json
curl -XPUT "http://opensearch:9200/_scripts/my-first-script" -H 'Content-Type: application/json' -d'
{
  "script": {
      "lang": "painless",
      "source": "\n          int total = 0;\n          for (int i = 0; i < doc['\''ratings'\''].length; ++i) {\n            total += doc['\''ratings'\''][i];\n          }\n          return total;\n        "
  }
}'
````
{% include copy.html %}


The following request creates the Painless script `my-first-script`, which sums the ratings for each book and displays the sum in the output:

````json
PUT _scripts/my-first-script
{
  "script": {
      "lang": "painless",
      "source": """
          int total = 0;
          for (int i = 0; i < doc['ratings'].length; ++i) {
            total += doc['ratings'][i];
          }
          return total;
        """
  }
}
````
{% include copy-curl.html %}

See [Execute Painless stored script]({{site.url}}{{site.baseurl}}/api-reference/script-apis/exec-stored-script/) for information about running the script.

#### Example response

The `PUT _scripts/my-first-script` request returns the following field:

````json
{
  "acknowledged" : true
}
````

To determine whether the script was successfully created, use the [Get stored script]({{site.url}}{{site.baseurl}}/api-reference/script-apis/get-stored-script/) API, passing the script name as the `script` path parameter.
{: .note}

### Response fields

| Field | Data type | Description | 
:--- | :--- | :---
| acknowledged | Boolean | Whether the request was received. |

## Creating or updating a stored script with parameters

The Painless script supports `params` to pass variables to the script. 

#### Example

The following request creates the Painless script `multiplier-script`. The request sums the ratings for each book, multiplies the summed value by the `multiplier` parameter, and displays the result in the output:

````json
PUT _scripts/multiplier-script
{
  "script": {
      "lang": "painless",
      "source": """
          int total = 0;
          for (int i = 0; i < doc['ratings'].length; ++i) {
            total += doc['ratings'][i];
          }
          return total * params['multiplier'];
        """
  }
}
````
{% include copy-curl.html %}

### Example response

The `PUT _scripts/multiplier-script` request returns the following field:

````json
{
  "acknowledged" : true
}
````