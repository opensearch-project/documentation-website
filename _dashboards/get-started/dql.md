---
layout: default
title: Using Dashboards Query Language
parent: OpenSearch Dashboards core concepts
nav_order: 40
redirect_from:
  - /dashboards/dql/
---

# Using Dashboards Query Language

Dashboards Query Language (DQL) is a simple text-based query language for filtering data in OpenSearch Dashboards. Similar to [Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/index), DQL uses HTTP request body. For example, to display your site visitor data for a host in the United States, you would enter `geo.dest:US` into the search field.

<img src="{{site.url}}{{site.baseurl}}/images/dql-interface.png" alt="DQL toolbar in Dashboard" width="700">

## Searching with terms queries

The most basic query is to specify the search term.

```
host:www.example.com
```

To access an object's nested field, list the complete path to the field separated by periods. For example, use the following path to retrieve the `lat` field in the `coordinates` object:

```
coordinates.lat:43.7102
```

DQL supports leading and trailing wildcards, so you can search for any terms that match your pattern.

```
host.keyword:*.example.com/*
```

To check if a field exists or has any data, use a wildcard to see if Dashboards returns any results.

```
host.keyword:*
```

## Searching with Boolean queries

To mix and match or combine multiple queries for more refined results, you can use the boolean operators `and`, `or`, and `not`. DQL is not case sensitive, so `AND` and `and` are the same.

```
host.keyword:www.example.com and response.keyword:200
```

The following example shows how to use multiple operators in one query.

```
geo.dest:US or response.keyword:200 and host.keyword:www.example.com
```

Remember that boolean operators follow the logical precedence order of `not`, `and`, and `or`, so if you have an expression like the previous example, `response.keyword:200 and host.keyword:www.example.com` gets evaluated first.

To avoid confusion, use parentheses to dictate the order in which you want to evaluate operands. If you want to evaluate `geo.dest:US or response.keyword:200` first, the expression is:

```
(geo.dest:US or response.keyword:200) and host.keyword:www.example.com
```

## Querying dates and ranges

DQL supports numeric inequalities.

```
bytes >= 15 and memory < 15
```

Similarly, you can use the same method to find a date before or after the query. `>` indicates a search for a date after the specified date, and `<` returns dates before.

```
@timestamp > "2020-12-14T09:35:33"
```

## Querying nested fields

Searching a document with nested fields requires you to specify which parts of the document to retrieve. In this example, `superheroes` is the nested field type.

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

To retrieve a specific field using DQL, use the notation:

```
superheroes: {hero-name: Superman}
```

To retrieve multiple objects from your document, specify all the fields you want to retrieve, as shown in the following notation:

```
superheroes: {hero-name: Superman} and superheroes: {hero-name: Batman}
```

The previous boolean and range queries still work, so you can submit a more refined query, as shown in the following notation:

```
superheroes: {hero-name: Superman and age < 50}
```

Additionally, if a document has an object nested within another object, you can retrieve data by specifying all the levels, as shown in the following notation: 

```
justice-league.superheroes: {hero-name:Superman}
```
