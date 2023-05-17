---
layout: default
title: Query Workbench
parent: SQL
grand_parent: SQL and PPL
nav_order: 1
redirect_from:
  - /search-plugins/sql/workbench/

---

# Query Workbench

Use the Query Workbench to easily run on-demand SQL queries, translate SQL into its REST equivalent, and view and save results as text, JSON, JDBC, or CSV.


## Quick start

To get started with SQL Workbench, choose **Dev Tools** in OpenSearch Dashboards and use the `bulk` operation to index some sample data:

```json
PUT accounts/_bulk?refresh
{"index":{"_id":"1"}}
{"account_number":1,"balance":39225,"firstname":"Amber","lastname":"Duke","age":32,"gender":"M","address":"880 Holmes Lane","employer":"Pyrami","email":"amberduke@pyrami.com","city":"Brogan","state":"IL"}
{"index":{"_id":"6"}}
{"account_number":6,"balance":5686,"firstname":"Hattie","lastname":"Bond","age":36,"gender":"M","address":"671 Bristol Street","employer":"Netagy","email":"hattiebond@netagy.com","city":"Dante","state":"TN"}
{"index":{"_id":"13"}}
{"account_number":13,"balance":32838,"firstname":"Nanette","lastname":"Bates","age":28,"gender":"F","address":"789 Madison Street","employer":"Quility","email":"nanettebates@quility.com","city":"Nogal","state":"VA"}
{"index":{"_id":"18"}}
{"account_number":18,"balance":4180,"firstname":"Dale","lastname":"Adams","age":33,"gender":"M","address":"467 Hutchinson Court","email":"daleadams@boink.com","city":"Orick","state":"MD"}
```

Then return to SQL Workbench.


### List indexes

To list all your indexes:

```sql
SHOW TABLES LIKE %
```

| TABLE_NAME
| :---
| accounts


### Read data

After you index a document, retrieve it using the following SQL expression:

```sql
SELECT *
FROM accounts
WHERE _id = 1
```

| account_number | firstname | gender | city | balance | employer | state | email | address | lastname | age
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---
| 1 | Amber | M | Brogan | 39225 | Pyrami | IL | amberduke@pyrami.com | 880 Holmes Lane | Duke | 32


### Delete data

To delete a document from an index, use the `DELETE` clause:

```sql
DELETE
FROM accounts
WHERE _id = 0
```

| deleted_rows
| :---
| 1
