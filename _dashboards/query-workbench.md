---
layout: default
title: Query Workbench
nav_order: 125
redirect_from:
  - /search-plugins/sql/workbench/
canonical_url: https://docs.opensearch.org/latest/dashboards/query-workbench/
---

# Query Workbench

You can use Query Workbench in OpenSearch Dashboards to run on-demand [SQL]({{site.url}}{{site.baseurl}}/search-plugins/sql/sql/index/) and [PPL]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/) queries, translate queries into their equivalent REST API calls, and view and save results in different [response formats]({{site.url}}{{site.baseurl}}/search-plugins/sql/response-formats/).

Query Workbench does not support delete or update operations through SQL or PPL. Access to data is read-only.
{: .important}

## Prerequisites

Before getting started with this tutorial, index the sample documents by sending the following [Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) request:

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

See [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/index/) to learn about indexing your own data. 

## Running SQL queries within Query Workbench
 
 The following steps guide you through running SQL queries against OpenSearch data:

1. Access Query Workbench.
    - To access Query Workbench, go to OpenSearch Dashboards and choose **OpenSearch Plugins** > **Query Workbench** from the main menu.

2. Run a query.
    - Select the **SQL** button. In the query editor, type a SQL expression and then select the **Run** button to run the query. 
    
    The following example query retrieves the first name, last name, and balance from the `accounts` index for accounts with a balance greater than 10,000 and sorts by balance in descending order:

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
    
3. View the results.
    - View the results in the **Results** pane, which presents the query output in tabular format. You can filter and download the results as needed.

4. Clear the query editor.  
    - Select the **Clear** button to clear the query editor and run a new query. 

5. Examine how the query is processed.
    - Select the **Explain** button to examine how OpenSearch processes the query, including the steps involved and order of operations.

## Running PPL queries within Query Workbench

Follow these steps to learn how to run PPL queries against OpenSearch data:

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
    
3. View the results.
    - View the results in the **Results** pane, which presents the query output in tabular format.

4. Clear the query editor.  
    - Select the **Clear** button to clear the query editor and run a new query. 

5. Examine how the query is processed.
    - Select the **Explain** button to examine how OpenSearch processes the query, including the steps involved and order of operations.
