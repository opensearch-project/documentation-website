---
layout: default
title: Subsearch
parent: PPL
nav_order: 3
redirect_from:
  - /search-plugins/sql/ppl/subsearch/
---

# Subsearch

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

A subsearch (also known as a subquery) allows you to use the results of one query within another query. OpenSearch Piped Processing Language (PPL) supports four types of subsearch commands: 

- [`in`](#in)
- [`exists`](#exists)
- [`scalar`](#scalar)
- [`relation`](#relation) 

The first three subsearch commands (`in`, `exists`, and `scalar`) are expressions that you can use in the `where` command (`where <boolean expression>`) and search filter (`search source=* <boolean expression>`). The `relation` subsearch command is a statement that be used in a `join` operation.

## `in`

An `in` subsearch allows you to check whether a field's value exists in the results of another query. This is useful when you want to filter your results based on data from another index or query.

### Syntax

```sql
where <field> [not] in [ search source=... | ... | ... ]
```
{% include copy.html %}


### Usage

```sql
source = outer | where a in [ source = inner | fields b ]
source = outer | where (a) in [ source = inner | fields b ]
source = outer | where (a,b,c) in [ source = inner | fields d,e,f ]
source = outer | where a not in [ source = inner | fields b ]
source = outer | where (a) not in [ source = inner | fields b ]
source = outer | where (a,b,c) not in [ source = inner | fields d,e,f ]
source = outer a in [ source = inner | fields b ]
source = outer a not in [ source = inner | fields b ]
source = outer | where a in [ source = inner1 | where b not in [ source = inner2 | fields c ] | fields b ] // nested
source = table1 | inner join left = l right = r on l.a = r.a AND r.a in [ source = inner | fields d ] | fields l.a, r.a, b, c //as join filter
```
{% include copy.html %}


## `exists`

An `exists` subsearch checks whether any results are returned by the subsearch query. This is particularly useful for correlated subqueries where you want to check the existence of related records.

### Syntax

```sql
where [not] exists [ search source=... | ... | ... ]
```
{% include copy.html %}


### Usage

The following examples demonstrate different ways to implement `exists` subsearches, from simple aggregation comparisons to complex nested calculations.

They are created with the following assumptions: 

- `a` and `b` are fields of table outer.
- `c` and `d` are fields of table inner.
- `e` and `f` are fields of table nested.

#### Correlated

In the following example, the inner query references fields from the outer query (such as when a = c), creating a dependency between the queries. The subsearch is evaluated once for each row in the outer query:


```sql
source = outer | where exists [ source = inner | where a = c ]
source = outer | where not exists [ source = inner | where a = c ]
source = outer | where exists [ source = inner | where a = c and b = d ]
source = outer | where not exists [ source = inner | where a = c and b = d ]
source = outer exists [ source = inner | where a = c ]
source = outer not exists [ source = inner | where a = c ]
source = table as t1 exists [ source = table as t2 | where t1.a = t2.a ]
```
{% include copy.html %}



#### Uncorrelated

In the following example, the subsearches are independent of the outer query. The inner query doesn't reference any fields from the outer query, so it's evaluated only once, regardless of how many rows are in the outer query:

```sql
source = outer | where exists [ source = inner | where c > 10 ]
source = outer | where not exists [ source = inner | where c > 10 ]
```
{% include copy.html %}


#### Nested

The following example demonstrates how to nest one subsearch within another, creating multiple levels of query complexity. This approach is useful for complex filtering scenarios that require multiple conditions from different data sources:

```sql
source = outer | where exists [ source = inner1 | where a = c and exists [ source = nested | where c = e ] ]
source = outer | where exists [ source = inner1 | where a = c | where exists [ source = nested | where c = e ] ]
```
{% include copy.html %}


## `scalar`

A `scalar` subsearch returns a single value that you can use in comparisons or calculations. This is useful when you need to compare a field against an aggregated value from another query.

### Syntax

```sql
where <field> = [ search source=... | ... | ... ]
```
{% include copy.html %}


### Usage

The following examples demonstrate different ways to implement `scalar` subsearches, from simple aggregation comparisons to complex nested calculations.

#### Uncorrelated

In the following example, the `scalar` subsearch is independent of the outer query. These subsearches retrieve a single value that can be used in calculations or comparisons:

```sql
source = outer | eval m = [ source = inner | stats max(c) ] | fields m, a
source = outer | eval m = [ source = inner | stats max(c) ] + b | fields m, a
source = outer | where a > [ source = inner | stats min(c) ] | fields a
source = outer a > [ source = inner | stats min(c) ] | fields a
```
{% include copy.html %}


#### Correlated

In the following example, the `scalar` subsearch references fields from the outer query, creating a dependency where the inner query result depends on each row of the outer query:

```sql
source = outer | eval m = [ source = inner | where outer.b = inner.d | stats max(c) ] | fields m, a
source = outer | eval m = [ source = inner | where b = d | stats max(c) ] | fields m, a
source = outer | eval m = [ source = inner | where outer.b > inner.d | stats max(c) ] | fields m, a
source = outer | where a = [ source = inner | where outer.b = inner.d | stats max(c) ]
source = outer | where a = [ source = inner | where b = d | stats max(c) ]
source = outer | where [ source = inner | where outer.b = inner.d OR inner.d = 1 | stats count() ] > 0 | fields a
source = outer a = [ source = inner | where b = d | stats max(c) ]
source = outer [ source = inner | where outer.b = inner.d OR inner.d = 1 | stats count() ] > 0 | fields a
```
{% include copy.html %}


#### Nested

The following example demonstrates how to nest multiple `scalar` subsearches to create complex comparisons or use one subsearch result within another:

```sql
source = outer | where a = [ source = inner | stats max(c) | sort c ] OR b = [ source = inner | where c = 1 | stats min(d) | sort d ]
source = outer | where a = [ source = inner | where c =  [ source = nested | stats max(e) by f | sort f ] | stats max(d) by c | sort c | head 1 ]
```
{% include copy.html %}


## `relation`

A `relation` subsearch allows you to use a query result as a dataset in a join operation. This is useful when you need to join with a filtered or transformed dataset rather than joining directly with a static index.

### Syntax

```sql
join on <condition> [ search source=... | ... | ... ] [as alias]
```
{% include copy.html %}


### Usage

The following example demonstrates how to use `relation` subsearches in join operations. The first example shows how to join with a filtered dataset, while the second shows how to nest a `relation` subsearch within another query:

```sql
source = table1 | join left = l right = r on condition [ source = table2 | where d > 10 | head 5 ] //subquery in join right side
source = [ source = table1 | join left = l right = r [ source = table2 | where d > 10 | head 5 ] | stats count(a) by b ] as outer | head 1
```
{% include copy.html %}

          
## Examples

The following examples demonstrate how different subsearch types work together in query scenarios, such as multi-level queries or nesting multiple subsearch types.

### Complex query examples

The following examples demonstrate how to combine different types of subsearches in complex queries.

**Example 1: Query with `in` and `scalar` subsearches**

The following query uses both `in` and `scalar` subsearches to find suppliers from Canada who supply parts with names starting with "forest" and have availability quantities greater than half of the total quantity ordered in 1994:

```sql
source = supplier
| join ON s_nationkey = n_nationkey nation
| where n_name = 'CANADA'
   and s_suppkey in [ /* in subsearch */
     source = partsupp
     | where ps_partkey in [ /* nested in subsearch */
         source = part
         | where like(p_name, 'forest%')
         | fields p_partkey
       ]
       and ps_availqty > [ /* scalar subsearch */
         source = lineitem
         | where l_partkey = ps_partkey
           and l_suppkey = ps_suppkey
           and l_shipdate >= date('1994-01-01')
           and l_shipdate < date_add(date('1994-01-01'), interval 1 year)
         | stats sum(l_quantity) as sum_l_quantity
         | eval half_sum_l_quantity = 0.5 * sum_l_quantity
         | fields half_sum_l_quantity
       ]
     | fields ps_suppkey
```
{% include copy.html %}


**Example 2: Query with `relation`, `scalar`, and `exists` subsearches**

The following query uses `relation`, `scalar`, and `exists` subsearches to find customers from specific country codes with above-average account balances who have not placed any orders:

```sql
source = [  /* relation subsearch */
  source = customer
    | where substring(c_phone, 1, 2) in ('13', '31', '23', '29', '30', '18', '17')
      and c_acctbal > [ /* scalar subsearch */
          source = customer
          | where c_acctbal > 0.00
            and substring(c_phone, 1, 2) in ('13', '31', '23', '29', '30', '18', '17')
          | stats avg(c_acctbal)
        ]
      and not exists [ /* correlated exists subsearch */
          source = orders
          | where o_custkey = c_custkey
        ]
    | eval cntrycode = substring(c_phone, 1, 2)
    | fields cntrycode, c_acctbal
  ] as custsale
| stats count() as numcust, sum(c_acctbal) as totacctbal by cntrycode
| sort cntrycode
```
{% include copy.html %}


## Limitations

PPL subsearch works only when `plugins.calcite.enabled` is set to `true`.
