---
layout: default
title: DQL
nav_order: 130
redirect_from:
  - /dashboards/dql/
  - /dashboards/discover/dql/
---

# DQL

Dashboards Query Language (DQL) is a simple text-based query language for filtering data in OpenSearch Dashboards. Similar to [Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/index/), DQL uses an HTTP request body. For example, to display your site visitor data for a host in the United States, you would enter `geo.dest:US` in the search field, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/dql-interface.png" alt="Search term using DQL toolbar in Dashboard" width="500">

Before you can search data in Dashboards, you must index it. In OpenSearch, the basic unit of data is a JSON document. Within an index, OpenSearch identifies each document using a unique ID. To learn more about indexing in OpenSearch, see [Index data]({{site.url}}{{site.baseurl}}/opensearch/index-data).
{: .note purple}

## Searching with terms queries

The most basic query specifies the search term, for example:

```
host:www.example.com
```

To access an object's nested field, list the complete path to the field separated by periods. For example, use the following path to retrieve the `lat` field in the `coordinates` object:

```
coordinates.lat:43.7102
```

DQL supports leading and trailing wildcards, so you can search for any terms that match your pattern, for example:

```
host.keyword:*.example.com/*
```

To check whether a field exists or has any data, use a wildcard to see whether Dashboards returns any results,for example:

```
host.keyword:*
```

## Searching with Boolean queries

To mix and match or combine multiple queries for more refined results, you can use the Boolean operators `and`, `or`, and `not`. DQL is not case sensitive, so `AND` and `and` are the same, for example: 

```
host.keyword:www.example.com and response.keyword:200
```

You also can use multiple Boolean operators in one query, for example:

```
geo.dest:US or response.keyword:200 and host.keyword:www.example.com
```

Remember that Boolean operators follow the logical precedence order of `not`, `and`, and `or`, so if you have an expression like the one in the preceding example, `response.keyword:200 and host.keyword:www.example.com` is evaluated first.

To avoid confusion, use parentheses to dictate the order in which you want to evaluate operands. If you want to evaluate `geo.dest:US or response.keyword:200` first, you can use an expression like the following:

```
(geo.dest:US or response.keyword:200) and host.keyword:www.example.com
```

## Querying dates and ranges

DQL supports numeric inequalities, for example, `bytes >= 15 and memory < 15`.

You can use the same method to find a date before or after the date specified in the query. `>` indicates a search for a date after the specified date, and `<` returns dates before the specified date, for example, `@timestamp > "2020-12-14T09:35:33`.

## Querying nested fields

Searching a document with [nested fields]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/nested/) requires you to specify the full path of the field to be retrieved. In the following example document, the `superheroes` field has nested objects:

```json
{
 "superheroes":[
    {
      "hero-name": "Superman",
      "real-identity": "Clark Kent",
      "age": 28
    },
    {
      "hero-name": "Batman",
      "real-identity": "Bruce Wayne",
      "age": 26
    },
    {
      "hero-name": "Flash",
      "real-identity": "Barry Allen",
      "age": 28
    },
    {
      "hero-name": "Robin",
      "real-identity": "Dick Grayson",
      "age": 15
    }
  ]
}
```
{% include copy.html %}

To retrieve documents that match a specific field using DQL, specify the field, for example:

```
superheroes: {hero-name: Superman}
```
{% include copy.html %}

To retrieve documents that match multiple fields, specify all the fields, for example:

```
superheroes: {hero-name: Superman} and superheroes: {hero-name: Batman}
```
{% include copy.html %}

You can combine multiple Boolean and range queries to create a more refined query, for example:

```
superheroes: {hero-name: Superman and age < 50}
```
{% include copy.html %}

## Querying doubly nested objects 

If a document has doubly nested objects (objects nested inside other objects), retrieve a field value by specifying the full path to the field. In the following example document, the `superheroes` object is nested inside the `justice-league` object:

```json
{
"justice-league": [
{
"superheroes":[
{
"hero-name": "Superman",
"real-identity": "Clark Kent",
"age": 28
},
{
"hero-name": "Batman",
"real-identity": "Bruce Wayne",
"age": 26
},
{
"hero-name": "Flash",
"real-identity": "Barry Allen",
"age": 28
},
{
"hero-name": "Robin",
"real-identity": "Dick Grayson",
"age": 15
}
]
}
]
}
```
{% include copy.html %}

The following image shows the query result using the example notation `justice-league.superheroes: {hero-name:Superman}`.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/dql-query-result.png" alt="DQL query result" width="1000">
