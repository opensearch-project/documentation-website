---
layout: default
title: Dashboards Query Language (DQL)
nav_order: 130
redirect_from:
  - /dashboards/dql/
  - /dashboards/discover/dql/
---

# Dashboards Query Language (DQL)

Dashboards Query Language (DQL) is a simple text-based query language for filtering data in OpenSearch Dashboards. For example, to display your site visitor data for a host in the United States, you would enter `geo.dest:US` in the search field, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/dql-interface.png" alt="Search term using DQL toolbar in Dashboard" width="500">

DQL and Query string query (Lucene) language are the two language options for the search bar in Discover and Dashboards. To compare these language options, see [Discover and Dashboard search bar]({{site.url}}{{site.baseurl}}/dashboards/index/#discover-and-dashboard-search-bar).
{: .tip}

## Setup

To follow this tutorial in OpenSearch Dashboards, expand the following setup steps.

<details closed markdown="block">
  <summary>
    Setup
  </summary>
  {: .text-delta}

Use these steps to prepare sample data for querying:

**Step 1: Set up mappings for the index**

From the main menu, select **Management** > **Dev Tools** to open [Dev Tools]({{site.url}}{{site.baseurl}}/dashboards/dev-tools/run-queries/). Send the following request to create index mappings:

```json
PUT testindex
{
  "mappings" : {
    "properties" :  {
      "date" : {
        "type" : "date",
        "format" : "yyyy-MM-dd"
      }
    }
  }
}
```
{% include copy-curl.html %}

**Step 2: Ingest the documents into the index**

In **Dev Tools**, ingest the following documents into the index:

```json
PUT /testindex/_doc/1
{
  "title": "The wind rises",
  "description": "A biographical film",
  "media_type": "film",
  "date": "2013-07-20",
  "page_views": 100
}
```
{% include copy-curl.html %}

```json
PUT /testindex/_doc/2
{
  "title": "Gone with the wind",
  "description": "A well-known 1939 American epic historical film",
  "media_type": "film",
  "date": "1939-09-09",
  "page_views": 200
}
```
{% include copy-curl.html %}

```json
PUT /testindex/_doc/3
{
  "title": "Chicago: the historical windy city",
  "media_type": "article",
  "date": "2023-07-29",
  "page_views": 300
}
```
{% include copy-curl.html %}

```json
PUT /testindex/_doc/4
{
  "article title": "Wind turbines",
  "media_type": "article",
  "format": "2*3"
}
```
{% include copy-curl.html %}

**Step 3: Create an index pattern**

Follow these steps to create an index pattern for your index:

1. From the main menu, select **Management** > **Dashboards Management**. 
1. Select **Index patterns** and then **Create index pattern**.
1. In **Index pattern name**, enter `testindex*`. Select **Next step**.
1. In the **Time field**, select `I don't want to use the time filter`.
1. Select **Create index pattern**.

For more information about index patterns, see [Index patterns]({{site.url}}{{site.baseurl}}/dashboards/management/index-patterns/).

**Step 4: Navigate to Discover and select the index pattern**

From the main menu, select **Discover**. In the upper-left corner, select `testindex*` from the **Index patterns** dropdown list. The main panel displays the documents in the index and you're now ready to try out DQL queries described on this page.

The [Object fields](#object-fields) and [Nested fields](#nested-fields) sections provide links for additional setup needed to try queries in those sections.
{: .note}
</details>

## Search for terms

By default, DQL searches in the default field set on the index. If the default field is not set, DQL searches all fields. For example, the following query searches for the exact text "wind rises":

```python
rises wind
```
{% include copy.html %}

The preceding query matches documents where any search term appears regardless of the order. By default, DQL combines search terms with an `or`. To learn how to create Boolean expressions containing search terms, see [Boolean operators](#boolean-operators). 

To search for a phrase (search terms in order), surround your text with quotation marks:

```python
"wind rises"
```
{% include copy.html %}

Hyphens are reserved characters in Lucene, so if your search term contains hyphens, DQL might prompt you to switch to Lucene syntax. To avoid this, surround your search term with quotation marks for a phrase search or omit the hyphen for regular search.
{: .tip}

## Reserved characters

The following is a list of reserved characters in DQL:

`\`, `(`, `)`, `:`, `<`, `>`, `"`, `*`

Use a backslash (`\`) to escape reserved characters. For example, to search for an expression `2*3`, specify the query string: `2\*3`:

```plaintext
2\*3
```
{% include copy.html %}

## Search in a field

To search for text in a particular field, specify the field name before the colon:

```python
title: rises wind
```
{% include copy.html %}

The analyzer set up for the field you're searching parses the query text into tokens and matches documents where any of the tokens appear.

DQL ignores white space characters so `title:rises wind` and `title: rises wind` are the same. 
{: .tip}

Use wildcards to refer to field names containing spaces. For example, `article*title` matches the `article title` field.
{: .tip}

## Field names

Specify the field name before the colon. The following table contains example queries with field names.

Query | Criterion for a document to match | Matching documents from the `testindex` index
:--- | :--- | :---
`title: wind` | The `title` field contains the word `wind`. | 1, 2
`title: (wind OR windy)` | The `title` field contains the word `wind` or the word `windy`. | 1, 2, 3
`title: "wind rises"` | The `title` field contains the phrase `wind rises`. | 1
`title.keyword: The wind rises` | The `title.keyword` field exactly matches `The wind rises`. | 1
`title*: wind` | Any field that starts with `title` (for example, `title` and `title.keyword`) contains the word `wind` | 1, 2
`article*title: wind` | The field that starts with `article` and ends with `title` contains the word `wind`. Matches the field `article title`. | 4
`description:*` | Documents in which the field `description` exists. | 1, 2, 3

## Wildcards

DQL supports wildcards (`*` only) in both search terms and field names, for example:

```python
t*le: *wind and rise*
```
{% include copy.html %}

## Ranges

DQL supports numeric inequalities using the `>`, `<`, `>=`, and `<=` operators, for example, 

```python
page_views > 100 and page_views <= 300
```
{% include copy.html %}

You can use the range operators on dates. For example, the following query searches for documents with the dates within the 2013--2023 range, inclusive:

```python
date >= "2013-01-01" and date < "2024-01-01"
```
{% include copy.html %}

Querying for `not equal to` can be achieved with `not` and the field name, for example: 

```python
not page_views: 100
```
{% include copy.html %}

## Boolean operators

DQL supports the `and`, `or`, and `not` Boolean operators. DQL is not case sensitive, so `AND` and `and` are the same. 

```python
title: wind and description: epic
```
{% include copy.html %}

Boolean operators follow the logical precedence order of `not`, `and`, and `or`, so in the following example, `title: wind and description: epic` is evaluated first.

```python
media_type: article or title: wind and description: epic
```
{% include copy.html %}

To dictate the order of evaluation, group Boolean clauses in parentheses. For example, in the following query, the parenthesized expression is evaluated first:

```python
(media_type: article or title: wind) and description: epic
```
{% include copy.html %}

Field prefix refers to the token after the colon. For example, the following query searches for documents where the `title` field contains `windy` or documents that contain the word `historical` in any of their fields:

```python
title: windy or historical
```
{% include copy.html %}

To search for documents where the `title` field contains `windy` or `historical`, group the terms in parentheses:

```python
title: (windy or historical)
```
{% include copy.html %}

The preceding query is equivalent to `title: windy or title: historical`.

To negate a query, use the `not` operator. For example, the following query searches for documents that contain the word `wind` in the `title` field, are not of the `media_type` `article`, and don't contain `epic` in the `description` field:

```python
title: wind and not (media_type: article or description: epic)
```
{% include copy.html %}

Queries can contain multiple grouping levels, for example:

```python
title: ((wind or windy) and not rises)
```
{% include copy.html %}

## Object fields

To refer to an object's inner field, list the dot path of the field. 

To index a document containing an object, follow the steps in the [object field type example]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/object/#example).  To search the `name` field of the `patient` object, use the following syntax:

```python
patient.name: john
```
{% include copy.html %}

## Nested fields

To refer to a nested object, list the JSON path of the field. 

To index a document containing an object, follow the steps in the [nested field type example]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/nested/#nested-field-type-1).

To search the `name` field of the `patients` object, use the following syntax:

```python
patients: {name: john}
```
{% include copy.html %}

To retrieve documents that match multiple fields, specify all the fields. For example, consider an additional `status` field in the following document:

```json
{ 
  "status": "Discharged",
  "patients": [ 
    {"name" : "John Doe", "age" : 56, "smoker" : true},
    {"name" : "Mary Major", "age" : 85, "smoker" : false}
  ] 
}
```

To search for a discharged patient whose name is John, specify the `name` and the `status` in the query:

```python
patients: {name: john} and status: discharged
```
{% include copy.html %}

You can combine multiple Boolean and range queries to create a more refined query, for example:

```python
patients: {name: john and smoker: true and age < 57} 
```
{% include copy.html %}

## Doubly nested fields 

Consider a document with a doubly nested field. In this document, both `patients` and `names` fields are of type `nested`:

```json
{
  "patients": [
    {
      "names": [
        { "name": "John Doe", "age": 56, "smoker": true },
        { "name": "Mary Major", "age": 85, "smoker": false}
      ]
    }
  ]
}
```

To search the `name` field of the `patients` object, use the following syntax:

```python
patients: {names: {name: john}}
```
{% include copy.html %}

In contrast, consider a document where the `patients` field is of type `object` but the `names` field is of type `nested`:

```json
{
  "patients": 
  {
    "names": [
      { "name": "John Doe", "age": 56, "smoker": true },
      { "name": "Mary Major", "age": 85, "smoker": false}
    ]
  }
}
```

To search the `name` field of the `patients` object, use the following syntax:

```python
patients.names: {name: john}
```
{% include copy.html %}