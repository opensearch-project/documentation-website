---
layout: default
title: Aggregation Functions
parent: Functions
grand_parent: PPL
nav_order: 1
---
# Aggregation Functions  

## Description  

Aggregation functions perform calculations across multiple rows to return a single result value. These functions are used with `stats`, `eventstats` and `streamstats` commands to analyze and summarize data.
The following table shows how NULL/MISSING values are handled by aggregation functions:
  
| Function | NULL | MISSING |
| --- | --- | --- |
| COUNT | Not counted | Not counted |
| SUM | Ignore | Ignore |
| AVG | Ignore | Ignore |
| MAX | Ignore | Ignore |
| MIN | Ignore | Ignore |
| FIRST | Ignore | Ignore |
| LAST | Ignore | Ignore |
| LIST | Ignore | Ignore |
| VALUES | Ignore | Ignore |
  
## Functions  

### COUNT  

#### Description  

Usage: Returns a count of the number of expr in the rows retrieved. The `C()` function, `c`, and `count` can be used as abbreviations for `COUNT()`. To perform a filtered counting, wrap the condition to satisfy in an `eval` expression.
### Example
  
```sql
source=accounts
| stats count(), c(), count, c
```
{% include copy.html %}
  
Expected output:
  
| count() | c() | count | c |
| --- | --- | --- | --- |
| 4 | 4 | 4 | 4 |
  
Example of filtered counting
  
```sql
source=accounts
| stats count(eval(age > 30)) as mature_users
```
{% include copy.html %}
  
Expected output:
  
| mature_users |
| --- |
| 3 |
  
### SUM  

#### Description  

Usage: `SUM(expr)`. Returns the sum of expr.
### Example
  
```sql
source=accounts
| stats sum(age) by gender
```
{% include copy.html %}
  
Expected output:
  
| sum(age) | gender |
| --- | --- |
| 28 | F |
| 101 | M |
  
### AVG  

#### Description  

Usage: `AVG(expr)`. Returns the average value of expr.
### Example
  
```sql
source=accounts
| stats avg(age) by gender
```
{% include copy.html %}
  
Expected output:
  
| avg(age) | gender |
| --- | --- |
| 28.0 | F |
| 33.666666666666664 | M |
  
### MAX  

#### Description  

Usage: `MAX(expr)`. Returns the maximum value of expr.
For non-numeric fields, values are sorted lexicographically.
### Example
  
```sql
source=accounts
| stats max(age)
```
{% include copy.html %}
  
Expected output:
  
| max(age) |
| --- |
| 36 |
  
Example with text field
  
```sql
source=accounts
| stats max(firstname)
```
{% include copy.html %}
  
Expected output:
  
| max(firstname) |
| --- |
| Nanette |
  
### MIN  

#### Description  

Usage: `MIN(expr)`. Returns the minimum value of expr.
For non-numeric fields, values are sorted lexicographically.
### Example
  
```sql
source=accounts
| stats min(age)
```
{% include copy.html %}
  
Expected output:
  
| min(age) |
| --- |
| 28 |
  
Example with text field
  
```sql
source=accounts
| stats min(firstname)
```
{% include copy.html %}
  
Expected output:
  
| min(firstname) |
| --- |
| Amber |
  
### VAR_SAMP  

#### Description  

Usage: `VAR_SAMP(expr)`. Returns the sample variance of expr.
### Example
  
```sql
source=accounts
| stats var_samp(age)
```
{% include copy.html %}
  
Expected output:
  
| var_samp(age) |
| --- |
| 10.916666666666666 |
  
### VAR_POP  

#### Description  

Usage: `VAR_POP(expr)`. Returns the population standard variance of expr.
### Example
  
```sql
source=accounts
| stats var_pop(age)
```
{% include copy.html %}
  
Expected output:
  
| var_pop(age) |
| --- |
| 8.1875 |
  
### STDDEV_SAMP  

#### Description  

Usage: `STDDEV_SAMP(expr)`. Return the sample standard deviation of expr.
### Example
  
```sql
source=accounts
| stats stddev_samp(age)
```
{% include copy.html %}
  
Expected output:
  
| stddev_samp(age) |
| --- |
| 3.304037933599835 |
  
### STDDEV_POP  

#### Description  

Usage: `STDDEV_POP(expr)`. Return the population standard deviation of expr.
### Example
  
```sql
source=accounts
| stats stddev_pop(age)
```
{% include copy.html %}
  
Expected output:
  
| stddev_pop(age) |
| --- |
| 2.8613807855648994 |
  
### DISTINCT_COUNT, DC  

#### Description  

Usage: `DISTINCT_COUNT(expr)`, `DC(expr)`. Returns the approximate number of distinct values using the HyperLogLog++ algorithm. Both functions are equivalent.
For details on algorithm accuracy and precision control, see the [OpenSearch Cardinality Aggregation documentation]({{site.url}}{{site.baseurl}}/aggregations/metric/cardinality/#controlling-precision).
### Example
  
```sql
source=accounts
| stats dc(state) as distinct_states, distinct_count(state) as dc_states_alt by gender
```
{% include copy.html %}
  
Expected output:
  
| distinct_states | dc_states_alt | gender |
| --- | --- | --- |
| 1 | 1 | F |
| 3 | 3 | M |
  
### DISTINCT_COUNT_APPROX  

#### Description  

Usage: `DISTINCT_COUNT_APPROX(expr)`. Return the approximate distinct count value of the expr, using the hyperloglog++ algorithm.
### Example
  
```sql
source=accounts
| stats distinct_count_approx(gender)
```
{% include copy.html %}
  
Expected output:
  
| distinct_count_approx(gender) |
| --- |
| 2 |
  
### EARLIEST  

#### Description  

Usage: `EARLIEST(field [, time_field])`. Return the earliest value of a field based on timestamp ordering.
* `field`: mandatory. The field to return the earliest value for.  
* `time_field`: optional. The field to use for time-based ordering. Defaults to @timestamp if not specified.  
  
### Example
  
```sql
source=events
| stats earliest(message) by host
| sort host
```
{% include copy.html %}
  
Expected output:
  
| earliest(message) | host |
| --- | --- |
| Starting up | server1 |
| Initializing | server2 |
  
Example with custom time field
  
```sql
source=events
| stats earliest(status, event_time) by category
| sort category
```
{% include copy.html %}
  
Expected output:
  
| earliest(status, event_time) | category |
| --- | --- |
| pending | orders |
| active | users |
  
### LATEST  

#### Description  

Usage: `LATEST(field [, time_field])`. Return the latest value of a field based on timestamp ordering.
* `field`: mandatory. The field to return the latest value for.  
* `time_field`: optional. The field to use for time-based ordering. Defaults to @timestamp if not specified.  
  
### Example
  
```sql
source=events
| stats latest(message) by host
| sort host
```
{% include copy.html %}
  
Expected output:
  
| latest(message) | host |
| --- | --- |
| Shutting down | server1 |
| Maintenance mode | server2 |
  
Example with custom time field
  
```sql
source=events
| stats latest(status, event_time) by category
| sort category
```
{% include copy.html %}
  
Expected output:
  
| latest(status, event_time) | category |
| --- | --- |
| cancelled | orders |
| inactive | users |
  
### TAKE  

#### Description  

Usage: `TAKE(field [, size])`. Return original values of a field. It does not guarantee on the order of values.
* `field`: mandatory. The field must be a text field.  
* `size`: optional integer. The number of values should be returned. Default is 10.  
  
### Example
  
```sql
source=accounts
| stats take(firstname)
```
{% include copy.html %}
  
Expected output:
  
| take(firstname) |
| --- |
| [Amber,Hattie,Nanette,Dale] |
  
### PERCENTILE or PERCENTILE_APPROX  

#### Description  

Usage: `PERCENTILE(expr, percent)` or `PERCENTILE_APPROX(expr, percent)`. Return the approximate percentile value of expr at the specified percentage.
* `percent`: The number must be a constant between 0 and 100.  
  
Note: From 3.1.0, the percentile implementation is switched to MergingDigest from AVLTreeDigest. Ref [issue link](https://github.com/opensearch-project/OpenSearch/issues/18122).
### Example
  
```sql
source=accounts
| stats percentile(age, 90) by gender
```
{% include copy.html %}
  
Expected output:
  
| percentile(age, 90) | gender |
| --- | --- |
| 28 | F |
| 36 | M |
  
#### Percentile Shortcut Functions  

For convenience, OpenSearch PPL provides shortcut functions for common percentiles:
- `PERC<percent>(expr)` - Equivalent to `PERCENTILE(expr, <percent>)`  
- `P<percent>(expr)` - Equivalent to `PERCENTILE(expr, <percent>)`  
  
Both integer and decimal percentiles from 0 to 100 are supported (e.g., `PERC95`, `P99.5`).
  
```sql
source=accounts 
| stats perc99.5(age);
```
{% include copy.html %}
  
Expected output:
  
| perc99.5(age) |
| --- |
| 36 |
  
```sql
source=accounts 
| stats p50(age);
```
{% include copy.html %}
  
Expected output:
  
| p50(age) |
| --- |
| 33 |
  
### MEDIAN  

#### Description  

Usage: `MEDIAN(expr)`. Returns the median (50th percentile) value of `expr`. This is equivalent to `PERCENTILE(expr, 50)`.
### Example
  
```sql
source=accounts
| stats median(age)
```
{% include copy.html %}
  
Expected output:
  
| median(age) |
| --- |
| 33 |
  
### FIRST  

#### Description  

Usage: `FIRST(field)`. Return the first non-null value of a field based on natural document order. Returns NULL if no records exist, or if all records have NULL values for the field.
* `field`: mandatory. The field to return the first value for.  
  
### Example
  
```sql
source=accounts
| stats first(firstname) by gender
```
{% include copy.html %}
  
Expected output:
  
| first(firstname) | gender |
| --- | --- |
| Nanette | F |
| Amber | M |
  
### LAST  

#### Description  

Usage: `LAST(field)`. Return the last non-null value of a field based on natural document order. Returns NULL if no records exist, or if all records have NULL values for the field.
* `field`: mandatory. The field to return the last value for.  
  
### Example
  
```sql
source=accounts
| stats last(firstname) by gender
```
{% include copy.html %}
  
Expected output:
  
| last(firstname) | gender |
| --- | --- |
| Nanette | F |
| Dale | M |
  
### LIST  

#### Description  

Usage: `LIST(expr)`. Collects all values from the specified expression into an array. Values are converted to strings, nulls are filtered, and duplicates are preserved.
The function returns up to 100 values with no guaranteed ordering.
* `expr`: The field expression to collect values from.  
* This aggregation function doesn't support Array, Struct, Object field types.  
  
Example with string fields
  
```sql
source=accounts
| stats list(firstname)
```
{% include copy.html %}
  
Expected output:
  
| list(firstname) |
| --- |
| [Amber,Hattie,Nanette,Dale] |
  
### VALUES  

#### Description  

Usage: `VALUES(expr)`. Collects all unique values from the specified expression into a sorted array. Values are converted to strings, nulls are filtered, and duplicates are removed.
The maximum number of unique values returned is controlled by the `plugins.ppl.values.max.limit` setting:
* Default value is 0, which means unlimited values are returned  
* Can be configured to any positive integer to limit the number of unique values  

<!-- temporarily commented out because the admin section is not ported

* See the [PPL Settings]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/admin/settings#plugins-ppl-values-max-limit) documentation for more details  
-->
  
Example with string fields
  
```sql
source=accounts
| stats values(firstname)
```
{% include copy.html %}
  
Expected output:
  
| values(firstname) |
| --- |
| [Amber,Dale,Hattie,Nanette] |
  