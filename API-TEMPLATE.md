# API Reference page template

This template provides the basic headings, and helpful suggestions for what information is required in each section.

## (Name of API) API

Provide a paragraph that describes the API functions and top use case for the API. Use initial caps for the heading, for example: Alerting API. When you refer to the API operation, you can use lowercase with code font.

If there is a corresponding OpenSearch Dashboards feature, provide a “See” link to refer them to it. 
Example:  “To learn more about monitor findings, see Document findings (https://opensearch.org/docs/latest/monitoring-plugins/alerting/monitors/#document-findings).”

Provide any caveats to its usage, if appropriate with a note or tip, as follows:

If you use the security plugin, make sure you have the appropriate permissions.
{: .note }

### Path parameters

Introduce what the path parameters can do at a high level. Provide a table with Parameter names and descriptions. Include a table with the following columns:

**Parameter** - Parameter name in plain font.
**Data Type** - Data type in initial caps (e.g. Boolean, String, Integer).
**Description** - Sentence to describe the parameter function, default values or range of values, and any usage examples.

Parameter | Data Type | Description
:--- | :--- | :---


### Request parameters

(For GET and DELETE APIs): Introduce what you can do with the optional parameters. Include a table with the same columns as the path parameter table.

Parameter | Data Type | Description
:--- | :--- | :---

#### Sample Request

Provide a sentence that describes what is shown in the example, followed by a cut and paste-ready API request in JSON format. Make sure that you test out the request yourself in the Dashboards API client to make sure it works!

“The following request includes the ignore_unavailable request parameter to skip any missing or closed indexes in the response:

```json
PUT /sample-index/_mapping?ignore_unavailable
```

#### Sample Response

Include a JSON example response that the API returned.

“Upon success, the response returns ”acknowledged“: true
```json
{
"acknowledged": true
}
```

### Request fields

(For PUT and POST APIs): Introduce what the request fields are acceptable to provide in the body of the request.

Include a table with these columns: 
*Field* - Field name in plain font.
*Data Type* - Data type in initial caps (e.g. Boolean, String, Integer).
*Description* - Sentence to describe the field’s function, default values or range of values, and any usage examples.

Field | Data Type | Description
:--- | :--- | :--- 


#### Sample Request

Provide a sentence that describes what is shown in the example, followed by a cut and paste-ready API request in JSON format.

“The following request creates a new mapping for the sample-index index:
PUT /sample-index/_mapping

{
  "properties": {
    "age": {
      "type": "integer"
    },
    "occupation":{
      "type": "text"
    }
  }
}
