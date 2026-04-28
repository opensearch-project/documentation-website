---
layout: default
title: graphlookup
parent: Commands
grand_parent: PPL
nav_order: 21
---

# graphLookup

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

The `graphLookup` command performs recursive graph traversal on a collection using a breadth-first search (BFS) algorithm. It finds documents matching a starting value and recursively traverses relationships between documents based on specified fields. This is useful for hierarchical data such as organizational charts, social networks, or routing graphs.

The `graphLookup` command performs a breadth-first search (BFS) traversal:

1. For each source document, extract the value of `start`
2. Query the lookup index to find documents in which `toField` matches the start value
3. Add matched documents to the result array
4. Extract `fromField` values from matched documents to continue traversal
5. Repeat steps 2-4 until no new documents are found or `maxDepth` is reached

For bidirectional traversal (`<->`), the algorithm also follows edges in the reverse direction by additionally matching `fromField` values.

## Syntax

The `graphLookup` command has the following syntax:

```sql
graphLookup <lookupIndex> start=<startField> edge=<fromField><operator><toField> [maxDepth=<maxDepth>] [depthField=<depthField>] [supportArray=(true | false)] [batchMode=(true | false)] [usePIT=(true | false)] [filter=(<condition>)] as <outputField>
```

The following are examples of the `graphLookup` command syntax:

```sql
source = employees | graphLookup employees start=reportsTo edge=reportsTo-->name as reportingHierarchy
source = employees | graphLookup employees start=reportsTo edge=reportsTo-->name maxDepth=2 as reportingHierarchy
source = employees | graphLookup employees start=reportsTo edge=reportsTo-->name depthField=level as reportingHierarchy
source = employees | graphLookup employees start=reportsTo edge=reportsTo<->name as connections
source = travelers | graphLookup airports start=nearestAirport edge=connects-->airport supportArray=true as reachableAirports
source = airports | graphLookup airports start=airport edge=connects-->airport supportArray=true as reachableAirports
source = employees | graphLookup employees start=reportsTo edge=reportsTo-->name filter=(status = 'active' AND age > 18) as reportingHierarchy
```

## Parameters

The `graphLookup` command supports the following parameters.

| Parameter | Required/Optional | Description |
|---|---|---|
| `<lookupIndex>` | Required | The name of the index to perform the graph traversal on. Can be the same as the source index for self-referential graphs. |
| `start=<startField>` | Required | The field in the source documents whose value is used to initiate the recursive search. The value is matched against `toField` in the lookup index. Supports both single values and arrays. |
| `edge=<fromField><operator><toField>` | Required | Defines the traversal path between nodes, specifying how documents are connected and the direction of traversal. See [Edge parameters](#edge-parameters). |
| `maxDepth=<maxDepth>` | Optional | The maximum recursion depth (number of hops). Default is `0`. A value of `0` returns only direct connections; higher values expand traversal accordingly. |
| `depthField=<depthField>` | Optional | The name of the field added to each result document to indicate recursion depth. If omitted, no depth information is added. Depth starts at `0` for the first level. |
| `supportArray=(true \| false)` | Optional | When `true`, disables early visited-node filter pushdown to OpenSearch. Default is `false`. Enable when `fromField` or `toField` contains array values to ensure correct traversal behavior. See [Array fields](#array-fields). |
| `batchMode=(true \| false)` | Optional | When `true`, collects all start values and performs a single unified BFS traversal. Default is `false`. Output becomes two arrays: `[Array<sourceRows>, Array<lookupResults>]`. See [Batch Mode](#batch-mode). |
| `usePIT=(true \| false)` | Optional | When `true`, enables Point In Time (PIT) search for the lookup index, allowing complete paginated traversal beyond the `max_result_window` limit. Default is `false`. See [PIT Search](#pit-search). |
| `filter=(<condition>)` | Optional | A filter condition that restricts which lookup index documents participate in traversal. Only matching documents are considered during BFS. Parentheses are required. Example: `filter=(status = 'active' AND age > 18)`. |
| `as <outputField>` | Required | The name of the output field that stores all documents discovered during traversal. |

### Edge parameters

The `edge` parameter uses the syntax `edge=<fromField><operator><toField>` and consists of the following components.

| Component | Description |
|---|---|
| `fromField` | The field in the lookup index documents used as the source of traversal. After a document is matched, the value of this field is used to find the next set of connected documents. Supports both single values and arrays. |
| `toField` | The field in the lookup index documents used for matching. Documents in which `toField` equals the current traversal value are included in the results. |
| `operator` | Specifies the direction of traversal:<br>- `-->` performs a **unidirectional** traversal from `fromField` to `toField` only (for example, `edge=reportsTo-->name` traverses from `reportsTo` to `name` in one direction only).<br>- `<->` performs a **bidirectional** traversal between `fromField` and `toField` (for example, `edge=reportsTo<->name` traverses between `reportsTo` and `name` in both directions). |

## Example 1: Traversing an employee hierarchy

Consider an `employees` index containing the following documents.

| id | name | reportsTo |
|----|------|-----------|
| 1 | Dev | Eliot |
| 2 | Eliot | Ron |
| 3 | Ron | Andrew |
| 4 | Andrew | null |
| 5 | Asya | Ron |
| 6 | Dan | Andrew |

The following query finds the reporting chain for each employee:

```sql
source = employees
  | graphLookup employees
    start=reportsTo
    edge=reportsTo-->name
    as reportingHierarchy
```
{% include copy.html %}

The query returns the following results:

| name | reportsTo | id | reportingHierarchy |
| --- | --- | --- | --- |
| Dev | Eliot | 1 | [{name:Eliot, reportsTo:Ron, id:2}] |
| Eliot | Ron | 2 | [{name:Ron, reportsTo:Andrew, id:3}] |
| Ron | Andrew | 3 | [{name:Andrew, reportsTo:null, id:4}] |
| Andrew | null | 4 | [] |
| Asya | Ron | 5 | [{name:Ron, reportsTo:Andrew, id:3}] |
| Dan | Andrew | 6 | [{name:Andrew, reportsTo:null, id:4}] |

Each element in the `reportingHierarchy` array is a `struct` containing named fields from the lookup index. For the employee named `Dev`, the traversal starts with `reportsTo="Eliot"`, finds the record for `Eliot`, and includes it in the `reportingHierarchy` array.

## Example 2: Adding depth tracking

The following query adds a `depthField` named `level` to track the number of levels each manager is from the employee:

```sql
source = employees
  | graphLookup employees
    start=reportsTo
    edge=reportsTo-->name
    depthField=level
    as reportingHierarchy
```
{% include copy.html %}

The query returns the following results:

| name | reportsTo | id | reportingHierarchy |
| --- | --- | --- | --- |
| Dev | Eliot | 1 | [{name:Eliot, reportsTo:Ron, id:2, level:0}] |
| Eliot | Ron | 2 | [{name:Ron, reportsTo:Andrew, id:3, level:0}] |
| Ron | Andrew | 3 | [{name:Andrew, reportsTo:null, id:4, level:0}] |
| Andrew | null | 4 | [] |
| Asya | Ron | 5 | [{name:Ron, reportsTo:Andrew, id:3, level:0}] |
| Dan | Andrew | 6 | [{name:Andrew, reportsTo:null, id:4, level:0}] |

The `level` field is added to each struct in the result array. A value of `0` indicates the first level of matches.

## Example 3: Limiting the traversal depth

The following query limits traversal to two levels using `maxDepth=1` (depth `0` and `1`):

```sql
source = employees
  | graphLookup employees
    start=reportsTo
    edge=reportsTo-->name
    maxDepth=1
    as reportingHierarchy
```
{% include copy.html %}

The query returns the following results:

| name | reportsTo | id | reportingHierarchy |
| --- | --- | --- | --- |
| Dev | Eliot | 1 | [{name:Eliot, reportsTo:Ron, id:2}, {name:Ron, reportsTo:Andrew, id:3}] |
| Eliot | Ron | 2 | [{name:Ron, reportsTo:Andrew, id:3}, {name:Andrew, reportsTo:null, id:4}] |
| Ron | Andrew | 3 | [{name:Andrew, reportsTo:null, id:4}] |
| Andrew | null | 4 | [] |
| Asya | Ron | 5 | [{name:Ron, reportsTo:Andrew, id:3}, {name:Andrew, reportsTo:null, id:4}] |
| Dan | Andrew | 6 | [{name:Andrew, reportsTo:null, id:4}] |

## Example 4: Finding reachable airports

Consider an `airports` index containing the following documents.

| airport | connects |
|---------|----------|
| JFK | [BOS, ORD] |
| BOS | [JFK, PWM] |
| ORD | [JFK] |
| PWM | [BOS, LHR] |
| LHR | [PWM] |

The following query finds all airports reachable from each airport:

```sql
source = airports
  | graphLookup airports
    start=airport
    edge=connects-->airport
    as reachableAirports
```
{% include copy.html %}

The query returns the following results:

| airport | connects | reachableAirports |
| --- | --- | --- |
| JFK | [BOS, ORD] | [{airport:JFK, connects:[BOS, ORD]}] |
| BOS | [JFK, PWM] | [{airport:BOS, connects:[JFK, PWM]}] |
| ORD | [JFK] | [{airport:ORD, connects:[JFK]}] |
| PWM | [BOS, LHR] | [{airport:PWM, connects:[BOS, LHR]}] |
| LHR | [PWM] | [{airport:LHR, connects:[PWM]}] |

## Example 5: Using different source and lookup indexes

The `graphLookup` command can use different source and lookup indexes. 

Consider a `travelers` index containing the following documents.

| name | nearestAirport |
|------|----------------|
| Dev | JFK |
| Eliot | JFK |
| Jeff | BOS |

The following query finds reachable airports for each traveler:

```sql
source = travelers
  | graphLookup airports
    start=nearestAirport
    edge=connects-->airport
    as reachableAirports
```
{% include copy.html %}

The query returns the following results:

| name | nearestAirport | reachableAirports |
| --- | --- | --- |
| Dev | JFK | [{airport:JFK, connects:[BOS, ORD]}] |
| Eliot | JFK | [{airport:JFK, connects:[BOS, ORD]}] |
| Jeff | BOS | [{airport:BOS, connects:[JFK, PWM]}] |

## Example 6: Traversing the graph bidirectionally

The following query performs bidirectional traversal to find both managers and colleagues who share the same manager:

```sql
source = employees
  | where name = 'Ron'
  | graphLookup employees
    start=reportsTo
    edge=reportsTo<->name
    as connections
```
{% include copy.html %}

The query returns the following results:

| name | reportsTo | id | connections |
| --- | --- | --- | --- |
| Ron | Andrew | 3 | [{name:Ron, reportsTo:Andrew, id:3}, {name:Andrew, reportsTo:null, id:4}, {name:Dan, reportsTo:Andrew, id:6}] |

With bidirectional traversal, Ron's connections include the following records:

- His own record (Ron reports to Andrew).
- His manager (Andrew).
- His peer (Dan, who also reports to Andrew).

## Batch mode

When `batchMode=true`, the `graphLookup` command collects all start values from all source rows and performs a single unified BFS traversal instead of traversing each row separately.

Use `batchMode=true` when:

- You want to find all nodes reachable from **any** of the source start values.
- You need a global view of the graph connectivity from multiple starting points.
- You want to avoid duplicate traversals when multiple source rows share overlapping paths.

In batch mode, the output is a **single row** containing two arrays:
1. All source rows collected.
2. All lookup results from the unified BFS traversal.

The following query finds all reachable airports from each traveler's nearest airport:

```sql
source = travelers
  | graphLookup airports
    start=nearestAirport
    edge=connects-->airport
    batchMode=true
    maxDepth=2
    as reachableAirports
```
{% include copy.html %}

**Standard mode** (default): Each traveler is assigned a list of reachable airports:

```text
| name  | nearestAirport | reachableAirports                    |
|-------|----------------|--------------------------------------|
| Dev   | JFK            | [{airport:JFK, connects:[BOS, ORD]}] |
| Jeff  | BOS            | [{airport:BOS, connects:[JFK, PWM]}] |
```

**Batch mode**: All travelers and all reachable airports are combined into a single result:

```text
| travelers                                                          | reachableAirports                                           |
|--------------------------------------------------------------------|-------------------------------------------------------------|
| [{name:Dev, nearestAirport:JFK}, {name:Jeff, nearestAirport:BOS}] | [{airport:JFK, connects:[BOS, ORD]}, {airport:BOS, ...}]   |
```

## Array fields

When the `fromField` or `toField` contains array values, set `supportArray=true` to ensure correct traversal behavior.

## PIT Search

By default, each level of BFS traversal limits the number of returned documents to the `max_result_window` setting of the lookup index (typically, 10,000). This avoids the overhead of Point In Time (PIT) search but may return incomplete results when a single traversal level matches more documents than the limit.

When `usePIT=true`, this limit is removed and the lookup table uses PIT-based pagination, which ensures that all matching documents are retrieved at each traversal level. This provides complete and accurate results at the cost of additional search overhead.

Use `usePIT=true` when:

- The graph contains high-degree nodes for which a single traversal level may return more than `max_result_window` documents.
- Result completeness is more important than query performance.
- You observe incomplete or missing results with the default setting.

The following query enables PIT search to ensure complete traversal results:

```sql
source = employees
  | graphLookup employees
    start=reportsTo
    edge=reportsTo-->name
    usePIT=true
    as reportingHierarchy
```
{% include copy.html %}

## Filtered graph traversal

The `filter` parameter restricts the documents in the lookup index that are considered during BFS traversal. Only documents matching the filter condition are included as candidates at each traversal level.

The following query traverses only active employees in the reporting hierarchy:

```sql
source = employees
  | graphLookup employees
    start=reportsTo
    edge=reportsTo-->name
    filter=(status = 'active')
    as reportingHierarchy
```
{% include copy.html %}

The filter is applied at the OpenSearch query level, so it combines efficiently with the BFS traversal queries. At each BFS level, the query sent to OpenSearch is  `bool { filter: [user_filter, bfs_terms_query] }`.

## Limitations

Note the following limitations of the `graphLookup` command:

- The source input, which provides the starting points for traversal, is limited to 100 documents to avoid performance issues.
- When `usePIT=false` (default), each traversal level returns up to the `max_result_window` of the lookup index, which may result in incomplete results. Set `usePIT=true` to retrieve complete results.
