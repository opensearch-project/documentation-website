---
layout: default
title: PPL &ndash; Piped Processing Language
parent: SQL and PPL
nav_order: 5
has_children: true
has_toc: false
redirect_from:
  - /search-plugins/sql/ppl/
  - /search-plugins/ppl/
  - /observability-plugin/ppl/
  - /search-plugins/ppl/index/
---

# PPL &ndash; Piped Processing Language

Piped Processing Language (PPL) is a query language that lets you use pipe (`|`) syntax to explore, discover, and query data stored in OpenSearch.

To quickly get up and running with PPL, use **Query Workbench** in OpenSearch Dashboards. To learn more, see [Workbench]({{site.url}}{{site.baseurl}}/search-plugins/sql/workbench/).

The PPL syntax consists of commands delimited by the pipe character (`|`) where data flows from left to right through each pipeline.

```sql
search command | command 1 | command 2 ...
```

You can only use read-only commands like `search`, `where`, `fields`, `rename`, `dedup`, `stats`, `sort`, `eval`, `head`, `top`, and `rare`.

## Quick start

To get started with PPL, choose **Dev Tools** in OpenSearch Dashboards and use the `bulk` operation to index some sample data:

```json
PUT accounts/_bulk?refresh
{"index":{"_id":"1"}}
{"account_number":1,"balance":39225,"firstname":"Amber","lastname":"Duke","age":32,"gender":"M","address":"880 Holmes Lane","employer":"Pyrami","email":"amberduke@pyrami.com","city":"Brogan","state":"IL"}
{"index":{"_id":"6"}}
{"account_number":6,"balance":5686,"firstname":"Hattie","lastname":"Bond","age":36,"gender":"M","address":"671 Bristol Street","employer":"Netagy","email":"hattiebond@netagy.com","city":"Dante","state":"TN"}
{"index":{"_id":"13"}}
{"account_number":13,"balance":32838,"firstname":"Nanette","lastname":"Bates","age":28,"gender":"F","address":"789 Madison Street","employer":"Quility","city":"Nogal","state":"VA"}
{"index":{"_id":"18"}}
{"account_number":18,"balance":4180,"firstname":"Dale","lastname":"Adams","age":33,"gender":"M","address":"467 Hutchinson Court","email":"daleadams@boink.com","city":"Orick","state":"MD"}
```

Go to **Query Workbench** and select **PPL**.

The following example returns `firstname` and `lastname` fields for documents in an `accounts` index with `age` greater than 18:

```sql
search source=accounts
| where age > 18
| fields firstname, lastname
```

#### Example response

firstname | lastname |
:--- | :--- |
Amber       | Duke
Hattie      | Bond
Nanette     | Bates
Dale        | Adams

![PPL query workbench]({{site.url}}{{site.baseurl}}/images/ppl.png)
