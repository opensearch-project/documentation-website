---
layout: default
title: Query Workbench
nav_order: 125
redirect_from:
  - /search-plugins/sql/workbench/
---

# Query Workbench

Query Workbench is a tool within OpenSearch Dashboards. You can use Query Workbench to run on-demand [SQL]({{site.url}}{{site.baseurl}}/search-plugins/sql/sql/index/) and [PPL]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/) queries, translate queries into their equivalent REST API calls, and view and save results in different [response formats]({{site.url}}{{site.baseurl}}/search-plugins/sql/response-formats/). 

The following image shows a view of the Query Workbench interface within OpenSearch Dashboards.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/query-workbench-ui.png" alt="Query Workbench interface within OpenSearch Dashboards"  width="700">

## Prerequisites 

Before getting started, make sure you have [indexed your data]({{site.url}}{{site.baseurl}}/im-plugin/index/). 

For this tutorial, you can index the following sample document. Alternatively, you can use the [OpenSearch Playground](https://playground.opensearch.org/app/opensearch-query-workbench#/), which has preloaded indexes that you can use to try out Query Workbench.

To index the sample document, send the following Bulk API request:

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
{% include copy-curl.html %}

The following response confirms the data is indexed:

```json
{
  "took": 118,
  "errors": false,
  "items": [
    {
      "index": {
        "_index": "accounts",
        "_id": "1",
        "_version": 1,
        "result": "created",
        "forced_refresh": true,
        "_shards": {
          "total": 2,
          "successful": 1,
          "failed": 0
        },
        "_seq_no": 0,
        "_primary_term": 1,
        "status": 201
      }
    },
    {
      "index": {
        "_index": "accounts",
        "_id": "6",
        "_version": 1,
        "result": "created",
        "forced_refresh": true,
        "_shards": {
          "total": 2,
          "successful": 1,
          "failed": 0
        },
        "_seq_no": 1,
        "_primary_term": 1,
        "status": 201
      }
    },
    {
      "index": {
        "_index": "accounts",
        "_id": "13",
        "_version": 1,
        "result": "created",
        "forced_refresh": true,
        "_shards": {
          "total": 2,
          "successful": 1,
          "failed": 0
        },
        "_seq_no": 2,
        "_primary_term": 1,
        "status": 201
      }
    },
    {
      "index": {
        "_index": "accounts",
        "_id": "18",
        "_version": 1,
        "result": "created",
        "forced_refresh": true,
        "_shards": {
          "total": 2,
          "successful": 1,
          "failed": 0
        },
        "_seq_no": 3,
        "_primary_term": 1,
        "status": 201
      }
    }
  ]
}
```

## Running SQL queries within Query Workbench

Follow these steps to learn how to run SQL queries against your OpenSearch data using Query Workbench:

1. Access Query Workbench.
    - To access Query Workbench, go to OpenSearch Dashboards and choose **OpenSearch Plugins** > **Query Workbench** from the main menu.

2. Run a query.
    - Select the **SQL** button. In the query editor, type a SQL expression and then select the **Run** button to run the query. 
    
    The following is an example query that retrieves the first name, last name, and balance from the `accounts` index for accounts with a balance greater than 10,000 and sorts by balance in descending order:

    ```sql
    SELECT
      firstname,
      lastname,
      balance
    FROM
      accounts
    WHERE
      balance > 10000
    ORDER BY
      balance DESC;
    ```
    {% include copy.html %}
    
3. Analyze the results.
    - View the results in the **Results** pane, which presents the query output in tabular format. You can sort, filter, and download the results as needed.

   The following image shows the query editor pane and results pane for the preceding SQL query:

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/query-workbench-query-step2.png" alt="Query Workbench SQL query input and results output panes" width="800">

4. Clear the query editor.  
    - Select the **Clear** button to clear the query editor and run a new query. 

5. Examine how the query is processed.
    - Select the **Explain** button to examine how OpenSearch processes the query, including the steps involved and order of operations. 

    The following image shows the explanation of the SQL query that was run in step 2.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/query-explain.png" alt="Query Workbench SQL query explanation pane" width="500">

### Viewing indexes

To view a list of all your indexes, run the following `SHOW` statement:

```sql
SHOW TABLES LIKE %
```
{% include copy.html %}

The following image shows an example of indexes listed in the **Results** pane:

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/query-list.png" alt="Query Workbench list of indexes view within the Results pane" width="800">

### Retrieving data

To retrieve a document, run a `SELECT` statement with a `FROM` clause in the Query Workbench editor. The following is the basic SQL syntax to retrieve a document in OpenSearch: 

```sql
SELECT *
FROM <index_name>
WHERE <field_name> = <field_value>
```
{% include copy.html %}

In this syntax, replace `<index_name` with the name of the index where the document is stored, `<field_name` with the name of the field you want to search, and `<field_value` with the value you want to search for. The `*` in the `SELECT` statement means that you want to retrieve all fields from the document. If you only want to retrieve specific fields, replace `*` with a comma-separated list of field names. 

### Deleting data

To delete a document from an index, run a `DELETE` statement with the `WHERE` clause. The following is the basic SQL syntax to delete a document from an index: 

```sql
DELETE
FROM <index_name>
WHERE <field_name> = <field_value>
```
{% include copy.html %}

In this syntax, replace `<index_name` with the name of the index where the document is stored, `<field_name` with the name of the field you want to search, and `<field_value` with the value you want to search for.

## Running PPL queries within Query Workbench

Follow these steps to learn how to run PPL queries against your OpenSearch data using Query Workbench:

1. Access Query Workbench.
    - To access Query Workbench, go to OpenSearch Dashboards and choose **OpenSearch Plugins** > **Query Workbench** from the main menu.

2. Run a query.
    - Select the **PPL** button. In the query editor, type a PPL query and then select the **Run** button to run the query. 
    
    The following is an example query that retrieves the `firstname` and `lastname` fields for documents in the `accounts` index with age greater than `18`:
    
    ```sql
    search source=accounts
    | where age > 18
    | fields firstname, lastname
    ```
    {% include copy.html %}
    
3. Analyze the results.
    - View the results in the **Results** pane, which presents the query output in tabular format. You can sort, filter, and download the results as needed.

   The following image shows the query editor pane and results pane for the preceding PPL query:

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/query-workbench-ppl.png" alt="Query Workbench PPL query input and results output panes">

4. Clear the query editor.  
    - Select the **Clear** button to clear the query editor and run a new query. 

5. Examine how the query is processed.
    - Select the **Explain** button to examine how OpenSearch processes the query, including the steps involved and order of operations. 

    The following image shows the explanation of the PPL query that was run in step 2.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/query-PPL-explain.png" alt="Query Workbench PPL query explanation pane" width="500">
