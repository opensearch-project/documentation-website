---
layout: default
title: Dashboards Query Language
nav_order: 99
---

# Dashboards Query Language

Similar to the [Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/index) that lets you use the HTTP request body to search for data, you can use the Dashbaords Query Language (DQL) in OpenSearch Dashboards to search for data and visualizations.

For example, if you want to see all visualizations that relate to Windows 8, enter `win 8` into the search field, and Dashboards refreshes to display all data related to Windows 8.

Just like query DSL, DQL comes in a handful of varieties, so use whichever best fits your use case.

---

#### Table of contents
1. TOC
{:toc}

---

## Terms query

The most basic query is to just specify the term you're searching for.

```
machine.os.keyword:win 8
```

DQL also supports wildcards, so you can search for any terms that match your pattern.

```
machine.os.keyword:win*
```

To check if a field exists or has any data, use a wildcard to see if Dashboards returns any results.

```
machine.os.keyword:*
```

## Boolean query

To mix and match, or even combine, multiple queries for more refined results, you can use the boolean operators `and`, `or`, and `not`. DQL is not case sensitive, so `AND` and `and` are the same.

```
machine.os.keyword:win 8 and response.keyword:200
```

The following example demonstrates how to use multiple operators in one query.

```
machine.os.keyword:win 8 or response.keyword:200 and host.keyword:www.example.com
```

Remember that logical precedence for boolean operators follows the order `not`, `and`, and `or`, so if you have an expression like the previous example, `response.keyword:200 and host.keyword:www.example.com` gets evaluated first, and then Dashboards uses that result to compare with `machine.os.keyword:win 8`.

To avoid confusion, we recommend using parentheses to dictate the order you want to evaluate in. If you want to evaluate `machine.os.keyword:win 8 or response.keyword:200` first, your expression becomes:

```
(machine.os.keyword:win 8 or response.keyword:200) and host.keyword:www.example.com
```

## Date and range queries

DQL also supports inequalities if you're using numeric inequalities.

```
bytes >= 15 and memory < 15
```

Similarly, you can use the same method to find a date before or after your query. `>` indicates a search for a date after your specified date, and `<` returns dates before.

```
@timestamp > "2020-12-14T09:35:33"
```

## Nested field query

If you have a document with nested fields, you have to specify which parts of the document you want to retrieve.

Suppose that you have the following document:

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

The following example demonstrates how to use DQL to retrieve a specific field.

```
superheroes: {hero-name: Superman}
```

If you want to retrieve multiple objects from your document, just specify all of the fields you want to retrieve.

```
superheroes: {hero-name: Superman} and superheroes: {hero-name: Batman}
```

The previous boolean and range queries still work, so you can submit a more refined query.

```
superheroes: {hero-name: Superman and age < 50}
```

If your document has an object nested within another object, you can still retrieve data by specifying all of the levels.

```
justice-league.superheroes: {hero-name:Superman}
```
