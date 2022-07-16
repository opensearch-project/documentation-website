# API Reference page template

This template provides the basic structure for creating OpenSource API documentation, including the essential headings that describe the elements of the API and helpful suggestions to help support them.

### A note on terminology ###

Terminology for API parameters varies in the software industry, where two or even three names may be used to label the same type of parameter. For the sake of consistency, we will use the following nomenclature for parameters in our API documentation.
* *Endpoint parameter* - "Endpoint parameter", "path parameter", and "URL parameter" are sometimes used synonymously. To avoid confusion, we will use "endpoint parameter" in this documentation.
* *Request parameter* - This parameter name is often used synonymously with "query parameter." We will use "request parameter" to be consistent.

### General usage for code elements

When you describe any code element such as an API, a parameter, or a field in a sentence you can use the noun name. 
  *Example usage*:
  The time field provides a timestamp for job completion.

When you provide an exact example with a value, you can use the code element in code font. 
  *Example usage*: 
  The response provides a value for ```time_field``` , such as “timestamp.” 

See also [Examples](https://alpha-docs-aws.amazon.com/awsstyleguide/latest/styleguide/examples.html) in the AWS Style Guide.

## Basic elements for documentation
The basic structure for API documentation is informed by the following elements, each discussed under their respective headings below.
1. Name of API (heading level 2)
2. Endpoint parameters (heading level 3)
3. Request parameters (heading level 3)
4. Sample request (heading level 4)
5. Sample response (heading level 4)
6. Request fields (heading level 3)
7. Sample request (heading level 4)

## API name

Provide an API name that describes its function and follow this with a description its top use case along with any recommendations for its usage if possible.

*Example function*: "Create or update mappings"

Use initial caps for the heading, for example: Alerting API. When you refer to the API operation, you can use lowercase with code font.

If there is a corresponding OpenSearch Dashboards feature, provide a “See also” link to refer them to it. 
*Example*:  “To learn more about monitor findings, see [Document findings](https://opensearch.org/docs/latest/monitoring-plugins/alerting/monitors/#document-findings)."

Provide any caveats to its usage, if appropriate with a note or tip, as follows:

**NOTE:** If you use the security plugin, make sure you have the appropriate permissions. 
(to format note style on the website, follow the text on the next line with {: .note })

### Endpoint parameters

Introduce what the endpoint parameters can do at a high level. Provide a table with parameter names and descriptions. Include a table with the following columns:
*Parameter* - Parameter name in plain font.
*Data Type* - Data type in initial caps (e.g. Boolean, String, Integer).
*Description* - Sentence to describe the parameter function, default values or range of values, and any usage examples.

Parameter | Data Type | Description
:--- | :--- | :---

This parameter follows directly in the URL after the resource name. (e.g., to add “timeout” to the endpoint parameter).
    PUT <index-name> /timeout

### Request parameters

Include a paragraph that describes how to use the query parameters, with an example in code font. Include the query parameter operator (“?”) to delineate request parameters from endpoint parameters.

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

Provide a sentence that describes what is shown in the example, followed by a cut-and-paste-ready API request in JSON format.

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
