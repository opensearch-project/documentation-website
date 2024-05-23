---
layout: default
title: Index aliases
nav_order: 11
redirect_from:
  - /opensearch/index-alias/
---

# Index aliases

An alias is a virtual index name that can point to one or more indexes.

If your data is spread across multiple indexes, rather than keeping track of which indexes to query, you can create an alias and query it instead.

For example, if you’re storing logs into indexes based on the month and you frequently query the logs for the previous two months, you can create a `last_2_months` alias and update the indexes it points to each month.

Because you can change the indexes an alias points to at any time, referring to indexes using aliases in your applications allows you to reindex your data without any downtime.

## Create aliases

To create an alias, use a POST request:

```json
POST _aliases
```
{% include copy-curl.html %}

Use the `actions` method to specify the list of actions that you want to perform. This command creates an alias named `alias1` and adds `index-1` to this alias:

```json
POST _aliases
{
  "actions": [
    {
      "add": {
        "index": "index-1",
        "alias": "alias1"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The following response is returned:

```json
{
   "acknowledged": true
}
```
{% include copy-curl.html %}

If the request fails, make sure the index that you're adding to the alias already exists.

You can also create an alias using one of the following requests:

```json
PUT <index>/_aliases/<alias name>
POST <index>/_aliases/<alias name>
PUT <index>/_alias/<alias name>
POST <index>/_alias/<alias name>
```
{% include copy-curl.html %}

The `<index>` in the above requests can be an index name, a comma-separated list of index names, or a wildcard expression. Use `_all` to refer to all indexes.

To check if `alias1` refers to `index-1`, run one of the following commands:

```json
GET /_alias/alias1
GET /index-1/_alias/alias1
```
{% include copy-curl.html %}

To get the indexes' mappings and settings information referenced by the alias, run the following command:

```json
GET alias1
```
{% include copy-curl.html %}

## Add or remove indexes

You can perform multiple actions using the same `_aliases` operation. For example, the following command removes `index-1` and adds `index-2` to `alias1`:

```json
POST _aliases
{
  "actions": [
    {
      "remove": {
        "index": "index-1",
        "alias": "alias1"
      }
    },
    {
      "add": {
        "index": "index-2",
        "alias": "alias1"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The `add` and `remove` actions occur atomically, which means that at no point will `alias1` point to both `index-1` and `index-2`. You can also add indexes based on an index pattern, as shown in the following POST request:

```json
POST _aliases
{
  "actions": [
    {
      "add": {
        "index": "index*",
        "alias": "alias1"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The `remove` action also supports the `must_exist` parameter. If the parameter is set to `true` and the specified alias does not exist, an exception is thrown. If the parameter is set to `false`, then no action is taken if the specified alias does not exist. The default value for `must_exist` is `null`. An exception will be thrown only if none of the specified aliases exist. 

The following POST request uses the `remove` action with the `must_exist` parameter set to `true`:

```json
POST _aliases
{
  "actions": [
    {
      "remove": {
        "index": "index-1",
        "alias": "alias1",
        "must_exist": true
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Manage aliases

To list the mapping of aliases to indexes, run the following command:

```json
GET _cat/aliases?v
```
{% include copy-curl.html %}

#### Example response

```json
alias     index   filter    routing.index   routing.search
alias1    index-1   *             -                 -
```
{% include copy-curl.html %}

To check which indexes an alias points to, run the following command:

```json
GET _alias/alias1
```
{% include copy-curl.html %}

#### Example response

```json
{
  "index-2": {
    "aliases": {
      "alias1": {}
    }
  }
}
```
{% include copy-curl.html %}

Conversely, to find which alias points to a specific index, run the following command:

```json
GET /index-2/_alias/*
```
{% include copy-curl.html %}

To get all index names and their aliases, run the following command:

```json
GET /_alias
```
{% include copy-curl.html %}

To check if an alias exists, run one of the following commands:

```json
HEAD /alias1/_alias/
HEAD /_alias/alias1/
HEAD index-1/_alias/alias1/
```
{% include copy-curl.html %}

## Add aliases at index creation

You can add an index to an alias as you create the index, as shown in the following PUT request:

```json
PUT index-1
{
  "aliases": {
    "alias1": {}
  }
}
```
{% include copy-curl.html %}

## Create filtered aliases

You can create a filtered alias to access a subset of documents or fields in the underlying indexes. This command adds only a specific timestamp field to `alias1`. The following shows an example POST request:

```json
POST _aliases
{
  "actions": [
    {
      "add": {
        "index": "index-1",
        "alias": "alias1",
        "filter": {
          "term": {
            "timestamp": "1574641891142"
          }
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Index alias options

You can specify the options shown in the following table.

Option | Valid values | Description | Required
:--- | :--- | :---
`index` | String | The name of the index that the alias points to. | Yes
`alias` | String | The name of the alias. | No
`filter` | Object | Add a filter to the alias. | No
`routing` | String | Limit search to an associated shard value. You can specify `search_routing` and `index_routing` independently. | No
`is_write_index` | String | Specify the index that accepts any write operations to the alias. If this value is not specified, then no write operations are allowed. | No

## Delete aliases

To delete one or more aliases from an index, use the following request:

```json
DELETE <index>/_alias/<alias>
DELETE <index>/_aliases/<alias>
```
{% include copy-curl.html %}

Both `<index>` and `<alias>` in the above request support comma-separated lists and wildcard expressions. Use `_all` in place of `<alias>` to delete all aliases for the indexes listed in `<index>`.

For example, if `alias1` refers to `index-1` and `index-2`, you can run the following command to remove `alias1` from `index-1`:

```json
DELETE index-1/_alias/alias1
```
{% include copy-curl.html %}

After running the request, `alias1` no longer refers to `index-1` but still refers to `index-2`.
