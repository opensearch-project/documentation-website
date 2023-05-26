---
layout: default
title: SQL and PPL CLI
parent: SQL and PPL
nav_order: 3
redirect_from:
 - /search-plugins/sql/cli/
---

# SQL and PPL CLI

The SQL and PPL command line interface (CLI) is a standalone Python application that you can launch with the `opensearchsql` command.

 To use the SQL and PPL CLI, install the SQL plugin on your OpenSearch instance, run the CLI using MacOS or Linux, and connect to any valid OpenSearch endpoint.

![SQL CLI]({{site.url}}{{site.baseurl}}/images/cli.gif)

## Features

The SQL and PPL CLI has the following features:

- Multi-line input
- PPL support
- Autocomplete for SQL syntax and index names
- Syntax highlighting
- Formatted output:
  - Tabular format
  - Field names with color
  - Enabled horizontal display (by default) and vertical display when output is too wide for your terminal, for better visualization
  - Pagination for large output
- Works with or without security enabled
- Supports loading configuration files
- Supports all SQL plugin queries

## Install

Launch your local OpenSearch instance and make sure you have the SQL plugin installed.

1. Install the CLI:
```console
pip3 install opensearchsql
```

The SQL CLI only works with Python 3.
{: .note }

2. To launch the CLI, run:
```console
opensearchsql https://localhost:9200 --username admin --password admin
```
By default, the `opensearchsql` command connects to http://localhost:9200.

## Configure

When you first launch the SQL CLI, a configuration file is automatically created at `~/.config/opensearchsql-cli/config` (for MacOS and Linux), the configuration is auto-loaded thereafter.

You can configure the following connection properties:

- `endpoint`: You do not need to specify an option. Anything that follows the launch command `opensearchsql` is considered as the endpoint. If you do not provide an endpoint, by default, the SQL CLI connects to http://localhost:9200.
- `-u/-w`: Supports username and password for HTTP basic authentication, such as with the Security plugin or fine-grained access control for Amazon OpenSearch Service.
- `--aws-auth`: Turns on AWS sigV4 authentication to connect to an Amazon OpenSearch endpoint. Use with the AWS CLI (`aws configure`) to retrieve the local AWS configuration to authenticate and connect.

For a list of all available configurations, see [clirc](https://github.com/opensearch-project/sql/blob/1.x/sql-cli/src/opensearch_sql_cli/conf/clirc).

## Using the CLI

1. Run the CLI tool. If your cluster runs with the default security settings, use the following command:
```console
opensearchsql --username admin --password admin https://localhost:9200
```
If your cluster runs without security, run:
```console
opensearchsql
```

2. Run a sample SQL command:
```sql
SELECT * FROM accounts;
```

By default, you see a maximum output of 200 rows. To show more results, add a `LIMIT` clause with the desired value.

To exit the CLI tool, select **Ctrl+D**.
{: .tip }

## Using the CLI with PPL

1. Run the CLI by specifying the query language:
```console
opensearchsql -l ppl <params>
```

2. Execute a PPL query:
```sql
source=accounts | fields firstname, lastname
```

## Query options

Run a single query with the following command line options:

- `-q`: Follow by a single query
- `-f`: Specify JDBC or raw format output
- `-v`: Display data vertically
- `-e`: Translate SQL to DSL

## CLI options

- `--help`: Help page for options
- `-l`: Query language option. Available options are `sql` and `ppl`. Default is `sql`
- `-p`: Always use pager to display output
- `--clirc`: Provide path for the configuration file
