---
layout: default
title: Commands
parent: PPL
grand_parent: SQL and PPL
nav_order: 2
redirect_from:
  - /observability-plugin/ppl/commands/
  - /search-plugins/ppl/commands/
  - /search-plugins/ppl/functions/
canonical_url: https://docs.opensearch.org/latest/search-plugins/sql/ppl/functions/
---

# Commands

<details markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

{::options toc_levels="2..2" /}

PPL supports most common [SQL functions]({{site.url}}{{site.baseurl}}/search-plugins/sql/functions/), including [relevance search]({{site.url}}{{site.baseurl}}/search-plugins/sql/full-text/), but also introduces several more functions (called _commands_), which are available in PPL only.

---

## ad

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }

The `ad` command applies the Random Cut Forest (RCF) algorithm in the [ML Commons plugin]({{site.url}}{{site.baseurl}}/ml-commons-plugin/index/) on the search result returned by a PPL command. Based on the input, the plugin uses two types of RCF algorithms: fixed-in-time RCF for processing time-series data and batch RCF for processing non-time-series data.

### Syntax: Fixed-in-time RCF for time-series data command

```sql
ad <shingle_size> <time_decay> <time_field>
```
{% include copy.html %}

The following table describes the parameters for the `ad` command when using fixed-in-time RCF for time-series data.

Field | Description | Required
:--- | :--- | :---
`shingle_size` | A consecutive sequence of the most recent records. The default value is 8. | No
`time_decay` | Specifies how much of the recent past to consider when computing an anomaly score. The default value is 0.001. | No
`time_field` | Specifies the time field for RCF to use as time-series data. Must be either a long value, such as the timestamp in milliseconds, or a string value in "yyyy-MM-dd HH:mm:ss".| Yes

### Syntax: Batch RCF for non-time-series data command

```sql
ad <shingle_size> <time_decay>
```
{% include copy.html %}

The following table describes the parameters for the `ad` command when using batch RCF for non-time-series data.

Field | Description | Required
:--- | :--- | :---
`shingle_size` | A consecutive sequence of the most recent records. The default value is 8. | No
`time_decay` | Specifies how much of the recent past to consider when computing an anomaly score. The default value is 0.001. | No

**Example 1: Detecting events in New York City from taxi ridership data with time-series data**

The following example trains an RCF model and uses the model to detect anomalies in the time-series ridership data:

```sql
source=nyc_taxi | fields value, timestamp | AD time_field='timestamp' | where value=10844.0
```
{% include copy.html %}

The command returns the following results.

value | timestamp | score | anomaly_grade
:--- | :--- | :--- | :---
10844.0 | 1404172800000 | 0.0 | 0.0    

**Example 2: Detecting events in New York City from taxi ridership data with non-time-series data**

The following example uses batch RCF to detect anomalies in non-time-series data:

```sql
source=nyc_taxi | fields value | AD | where value=10844.0
```
{% include copy.html %}

The command returns the following results.

value | score | anomalous
:--- | :--- | :---
10844.0 | 0.0 | false

</details>

---

## bin

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }

The `bin` command groups numeric values into buckets of equal intervals, making it useful for creating histograms and analyzing data distribution. It takes a numeric or time-based field and generates a new field with values that represent the lower bound of each bucket.

### Syntax

```sql
bin <field> [span=<interval>] [minspan=<interval>] [bins=<count>] [aligntime=(earliest | latest | <time-specifier>)] [start=<value>] [end=<value>]
```
{% include copy.html %}

The following table describes the parameters for the `bin` command.

Field | Description | Required | Default
:--- | :--- | :--- | :---
`field` |  The field to bin. Accepts numeric or time-based fields. | Yes | N/A
`span` | The interval size for each bin. Cannot be used with bins or minspan parameters. | No | N/A
`minspan` | The minimum interval size for automatic span calculation. Cannot be used with span or bins parameters. | No | N/A
`bins` | The maximum number of equal-width bins to create. Cannot be used with span or minspan parameters. The bins parameter must be between 2 and 50000 (inclusive). | No | N/A
`aligntime` | Align the bin times for time-based fields. Valid only for time-based discretization. | No | N/A
`start` | The starting value for the bin range. | No | Minimum field value
`end` | The ending value for the bin range. | No | Maximum field value

**Example 1: Basic numeric span**

```sql
source=accounts | bin age span=10 | fields age, account_number | head 3;
```
{% include copy.html %}

The command returns the following results.

| age | account_number
:--- | :--- |
| 30-40 | 1
| 30-40 | 6
| 20-30 | 13

**Example 2: Logarithmic span (log10)**

```sql
source=accounts | bin balance span=log10 | fields balance | head 2;
```
{% include copy.html %}

The command returns the following results.

| balance
:--- |
| 10000.0-1000000.0
| 1000.0-10000.0

**Example 3: Basic bins parameter**

```sql
source=time_test | bin value bins=5 | fields value | head 3;
```
{% include copy.html %}

The command returns the following results.

| value
:--- |
| 8000-9000
| 7000-8000
| 9000-10000

**Example 4: High bin count**

```sql
source=accounts | bin age bins=21 | fields age, account_number | head 3;
```
{% include copy.html %}

The command returns the following results.

| age | account_number
:--- | :--- |
| 32-33 | 1
| 36-37 | 6
| 28-29 | 13

**Example 5: Basic minspan**

```sql
source=accounts | bin age minspan=5 | fields age, account_number | head 3;
```
{% include copy.html %}

The command returns the following results.

| age | account_number
:--- | :--- |
| 30-40 | 1
| 30-40 | 6
| 20-30 | 13

**Example 6: Span with start/end**

```sql
source=accounts | bin age span=1 start=25 end=35 | fields age | head 6;
```
{% include copy.html %}

The command returns the following results.

| age
:--- |
| 32-33
| 36-37
| 28-29
| 33-34

**Example 7: Hour span**

```sql
source=time_test | bin @timestamp span=1h | fields @timestamp, value | head 3;
```
{% include copy.html %}

The command returns the following results.

| @timestamp | value
:--- | :--- |
| 2025-07-28 00:00:00 | 8945
| 2025-07-28 01:00:00 | 7623
| 2025-07-28 02:00:00 | 9187

**Example 8: Default behavior (no parameters)**

```sql
source=accounts | bin age | fields age, account_number | head 3;
```
{% include copy.html %}

The command returns the following results.

| age | account_number
:--- | :--- |
| 32.0-33.0 | 1
| 36.0-37.0 | 6
| 28.0-29.0 | 13

**Example 9: Using the `bin` command with string fields**

```sql
source=accounts | eval age_str = CAST(age AS STRING) | bin age_str bins=3 | stats count() by age_str | sort age_str;
```
{% include copy.html %}

The command returns the following results.

| count() | age_str
:--- | :--- |
| 1 | 20-30
| 3 | 30-40

</details>

---

## dedup

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }

The `dedup` (data deduplication) command removes duplicate documents defined by a field from the search result.

### Syntax

```sql
dedup [int] <field-list> [keepempty=<bool>] [consecutive=<bool>]
```
{% include copy.html %}

The following table describes the parameters for the `dedup` command.

Field | Description | Type | Required | Default
:--- | :--- | :--- | :--- | :---
`int` |  Retain the specified number of duplicate events for each combination. The number must be greater than 0. If you do not specify a number, only the first occurring event is kept and all other duplicates are removed from the results. | `integer` | No | 1
`keepempty` | If true, keep the document if any field in the field list has a null value or a field missing. | `boolean` | No | False
`consecutive` | If true, remove only consecutive events with duplicate combinations of values. | `boolean` | No | False
`field-list` | Specify a comma-delimited field list. At least one field is required. | `string` | Yes | N/A

**Example 1: Dedup by one field**

To remove duplicate documents with the same gender, use the following command:

```sql
search source=accounts | dedup gender | fields account_number, gender;
```
{% include copy.html %}

The command returns the following results.

| account_number | gender
:--- | :--- |
1 | M
13 | F


**Example 2: Keep two duplicate documents**

To keep two duplicate documents with the same gender, use the following command:

```sql
search source=accounts | dedup 2 gender | fields account_number, gender;
```
{% include copy.html %}

The command returns the following results.

| account_number | gender
:--- | :--- |
1 | M
6 | M
13 | F

**Example 3: Keep or ignore an empty field by default**

To keep two duplicate documents with a `null` field value, use the following command:

```sql
search source=accounts | dedup email keepempty=true | fields account_number, email;
```
{% include copy.html %}

The command returns the following results.

account_number | email
:--- | :---
1 | amberduke@pyrami.com
6 | hattiebond@netagy.com
13 | null
18 | daleadams@boink.com

To remove duplicate documents with the `null` field value, use the following command:

```sql
search source=accounts | dedup email | fields account_number, email;
```
{% include copy.html %}

account_number | email
:--- | :---
1 | amberduke@pyrami.com
6 | hattiebond@netagy.com
18 | daleadams@boink.com

**Example 4: Dedup of consecutive documents**

To remove duplicates of consecutive documents, use the following command:

```sql
search source=accounts | dedup gender consecutive=true | fields account_number, gender;
```
{% include copy.html %}

The command returns the following results.

account_number | gender
:--- | :---
1 | M
13 | F
18 | M

### Limitations

The `dedup` command is not rewritten to OpenSearch query domain-specific language (DSL); it is only executed on the coordinating node.

</details>

---

## eval

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }
    
The `eval` command evaluates an expression and appends its result to the search result.

### Syntax

```sql
eval <field>=<expression> ["," <field>=<expression> ]...
```
{% include copy.html %}

The following table describes the parameters for the `eval` command.

Field | Description | Required
:--- | :--- | :---
`field` | If a field name does not exist, a new field is added. If the field name already exists, it's overwritten. | Yes
`expression` | Specify any supported expression. | Yes

**Example 1: Create a new field**

To create a new `doubleAge` field for each document where `doubleAge` is the result of `age` multiplied by 2, use the following command:

```sql
search source=accounts | eval doubleAge = age * 2 | fields age, doubleAge;
```
{% include copy.html %}

The command returns the following results.

| age | doubleAge
:--- | :--- |
32    | 64
36    | 72
28    | 56
33    | 66

**Example 2: Overwrite the existing field**

To overwrite the `age` field with `age` plus 1, use the following command:

```sql
search source=accounts | eval age = age + 1 | fields age;
```
{% include copy.html %}

The command returns the following results.

| age
| :---
| 33
| 37
| 29
| 34

**Example 3: Create a new field with a field defined with the `eval` command**

To create a new field `ddAge` where `ddAge` is the result of `doubleAge` multiplied by 2 and `doubleAge` is defined in the `eval` command, use the following command:

```sql
search source=accounts | eval doubleAge = age * 2, ddAge = doubleAge * 2 | fields age, doubleAge, ddAge;
```
{% include copy.html %}

The command returns the following results.

age | doubleAge | ddAge
:--- | :--- | :---
32 | 64 | 128
36 | 72 | 144
28 | 56 | 112
33 | 66 | 132


### Limitations

The `eval` command is not rewritten to OpenSearch query DSL; it is only executed on the coordinating node.

</details>

---

## fields

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }
  
Use the `fields` command to keep or remove fields from a search result.

### Syntax

```sql
fields [+|-] <field-list>
```
{% include copy.html %}

The following table describes the parameters for the `fields` command.

Field | Description | Required | Default
:--- | :--- | :--- | :---
`index` | Plus (+) keeps only fields specified in the field list. Minus (-) removes all fields specified in the field list. | No | +
`field-list` | Specify a comma-delimited list of fields. | Yes | No default

**Example 1: Select specified fields from result**

To get `account_number`, `firstname`, and `lastname` fields from a search result, use the following command:

```sql
search source=accounts | fields account_number, firstname, lastname;
```
{% include copy.html %}

The command returns the following results.

| account_number | firstname  | lastname
:--- | :--- | :---
| 1   | Amber       | Duke
| 6   | Hattie      | Bond
| 13  | Nanette     | Bates
| 18  | Dale        | Adams

**Example 2: Remove specified fields from a search result**

To remove the `account_number` field from the search results, use the following command:

```sql
search source=accounts | fields account_number, firstname, lastname | fields - account_number;
```
{% include copy.html %}

The command returns the following results.

| firstname | lastname
| :--- | :--- |
| Amber   | Duke
| Hattie  | Bond
| Nanette | Bates
| Dale    | Adams

</details>

---

## head

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }
  
Use the `head` command to return the first N number of results in a specified search order.

### Syntax

```sql
head [N]
```
{% include copy.html %}

The following table describes the parameters for the `head` command.

Field | Description | Required | Default
:--- | :--- | :--- | :---
`N` | Specify the number of results to return. | No | 10

**Example 1: Get the first 10 results**

To get the first 10 results, use the following command:

```sql
search source=accounts | fields firstname, age | head;
```
{% include copy.html %}

The command returns the following results.

| firstname | age
:--- | :--- |
| Amber  | 32
| Hattie | 36
| Nanette | 28

**Example 2: Get the first N results**

To get the first two results, use the following command:

```sql
search source=accounts | fields firstname, age | head 2;
```
{% include copy.html %}

The command returns the following results.

| firstname | age
:--- | :--- |
| Amber  | 32
| Hattie | 36

### Limitations

The `head` command is not rewritten to OpenSearch query DSL; it is only executed on the coordinating node.

</details>

---

## join

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }
  
You can combine two datasets using the `join` command. The left side can be an index or results from piped commands, while the right side can be either an index or a subquery.

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

### Syntax

```sql
[join-type] join [left-alias] [right-alias] on <join-criteria> <right-dataset>
```
{% include copy.html %}

The following table describes additional requirements for the `join` command.

Parameter | Description | Required
:--- | :--- | :---
`join-criteria` | Any comparison expression. | Yes
`right-dataset` | Either an index or a subquery with or without an alias. | Yes

The following table describes the parameters for the `join` command.

Field | Description | Type | Required | Default
:--- | :--- | :--- | :--- | :---
`join-type` | The type of join to perform. Valid values are `inner`, `left`, `right`, `full`, `cross`, `semi`, and `anti`.  | `String` | No   | `inner`
`left-alias` | The subquery alias to use with the left join side in order to avoid ambiguous naming. Fixed pattern: `left = <left-alias>`    | `String` | No   | N/A
`right-alias` | The subquery alias to use with the right join side in order to avoid ambiguous naming. Fixed pattern: `right = <right-alias>` | `String` | No   | N/A
`join-criteria` | Any comparison expression.  | `String` | Yes  | N/A
`right-dataset` | Either an index or a subquery with/without an alias.  | `String` | Yes  | N/A

The following examples use the `state_country` and `occupation` indexes.

The `state_country` index contains the following data.

| Name  | Age | State   | Country
:--- | :--- | :--- | :---
| Jake  | 70  | California | USA
| Hello | 30  | New York   | USA
| John  | 25  | Ontario    | Canada
| Jane  | 20  | Quebec     | Canada
| Jim   | 27  | B.C.        | Canada
| Peter | 57  | B.C.       | Canada
| Rick  | 70  | B.C.        | Canada
| David | 40  | Washington | USA

The `occupation` index contains the following data.

| Name  | Occupation  | Country | Salary
:--- | :--- | :--- | :---
| Jake  | Engineer    | England | 100000
| Hello | Artist      | USA     | 70000
| John  | Doctor      | Canada  | 120000
| David | Doctor      | USA     | 120000
| David | Unemployed  | Canada  | 0
| Jane  | Scientist   | Canada  | 90000

**Example 1: Join two indexes**

The following example performs an inner join between two indexes:

```sql
search source = state_country
| inner join left=a right=b ON a.name = b.name occupation
| stats avg(salary) by span(age, 10) as age_span, b.country
```
{% include copy.html %}

The command returns the following results.

avg(salary) | age_span | b.country
:--- | :--- | :---
120000.0 | 40 | USA
105000.0 | 20 | Canada
0.0 | 40 | Canada
70000.0 | 30 | USA
100000.0 | 70 | England

**Example 2: Join with a subsearch**

The following example performs a left join with a subsearch:

```sql
search source = state_country as a
| where country = 'USA' OR country = 'England'
| left join on a.name = b.name [
    source = occupation
    | where salary > 0
    | fields name, country, salary
    | sort salary
    | head 3
  ] as b
| stats avg(salary) by span(age, 10) as age_span, b.country
```
{% include copy.html %}

The command returns the following results.

avg(salary) | age_span | b.country
:--- | :--- | :---
null | 40 | null
70000.0 | 30 | USA
100000.0 | 70 | England

### Limitations

The `join` command works only when `plugins.calcite.enabled` is set to `true`.

</details>

---

## kmeans

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }
  
The `kmeans` command applies the ML Commons plugin's k-means algorithm to the provided PPL command's search results.

### Syntax

```sql
kmeans <cluster-number>
```
{% include copy.html %}

The following table describes the parameters for the `kmeans` command.

Field | Description | Required
:--- | :--- | :---
`cluster-number` | The number of clusters you want to group your data points into. | Yes

**Example: Group Iris data**

This example shows how to classify three Iris species (Iris setosa, Iris virginica, and Iris versicolor) based on the combination of four features measured from each sample: the length and the width of the sepals and petals:

```sql
source=iris_data | fields sepal_length_in_cm, sepal_width_in_cm, petal_length_in_cm, petal_width_in_cm | kmeans 3
```
{% include copy.html %}

The command returns the following results.

sepal_length_in_cm | sepal_width_in_cm | petal_length_in_cm | petal_width_in_cm | ClusterID
:--- | :--- | :--- | :--- | :--- |
| 5.1 | 3.5 | 1.4 | 0.2 | 1
| 5.6 | 3.0 | 4.1 | 1.3 | 0
| 6.7 | 2.5 | 5.8 | 1.8 | 2

</details>

---

## lookup

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }
  
The `lookup` command enriches your search data by adding or replacing data from a lookup index (dimension table). You can extend index fields with values from a dimension table or append/replace values when a lookup condition is matched. As an alternative to the `join` command, the `lookup` command is more suitable for enriching the source data with a static dataset.

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

### Syntax

```sql
lookup <lookup-index> (<lookup-mapping-field> [as <source-mapping-field>])... [(replace | append) (<input-field> [AS <output-field>])...]
```
{% include copy.html %}

The following table describes the parameters for the `lookup` command.

Field | Description | Required | Default
:--- | :--- | :--- | :---
`lookup-index` | The name of lookup index (dimension table). | Yes | N/A
`lookup-mapping-field`| A mapping key in the `lookup-index`, analogous to a `join` key from the right table. You can specify multiple `lookup-mapping-field` values with commas. | Yes | N/A
`source-mapping-field`| A mapping key from the source (left side), analogous to a `join` key from the left side. | No | `lookup-mapping-field`
`replace` \| `append` | The output strategies. When specifying `replace`, matched values in the `lookup-index` field overwrite the values in the results. If you specify `append`, matched values in the `lookup-index` field only append to the missing values in the results. | No | `replace`
`input-field` | A field in `lookup-index` where matched values are applied to the result output. You can specify multiple `input-field` values with commas. If you don't specify any `input-field`, all fields except `lookup-mapping-field` from `lookup-index` are matched values that are applied to the result output. | No | N/A
`output-field` | A field of output. You can specify zero or multiple `output-field` values. If you specify `output-field` with an existing field name in the source query, its values are replaced or appended by the matched values from `input-field`. If the field specified in `output-field` is a new field, an extended new field is applied to the results. | No | `input-field`

The following examples use the `workers` and `work_information` indexes.

The `workers` index contains the following data.

| ID | Name | Occupation | Country | Salary
:--- | :--- | :--- | :--- | :---
| 1000 | Jake | Engineer | England | 100000
| 1001 | Hello | Artist | USA | 70000
| 1002 | John | Doctor | Canada | 120000
| 1003 | David | Doctor | N/A | 120000
| 1004 | David | N/A | Canada | 0
| 1005 | Jane | Scientist | Canada | 90000

The `work_information` index contains the following data.

| UID | Name  | Department | Occupation
:--- | :--- | :--- | :---
| 1000 | Jake  | IT | Engineer |
| 1002 | John  | DATA | Scientist |
| 1003 | David | HR | Doctor |
| 1005 | Jane  | DATA | Engineer |
| 1006 | Tom   | SALES | Artist |

**Example 1: Look up workers and return the corresponding department**

The following example looks up workers and returns the corresponding department:

```sql
source = workers | lookup work_information uid as id append department
```
{% include copy.html %}

The command returns the following results.

| id | name | occupation | country | salary | department
:--- | :--- | :--- | :--- | :--- | :---
1000 | Jake | Engineer | England | 100000 | IT
1001 | Hello | Artist | USA | 70000 | Null
1002 | John | Doctor | Canada | 120000 | DATA
1003 | David | Doctor | Null | 120000 | HR
1004 | David | Null | Canada | 0 | Null
1005 | Jane | Scientist | Canada | 90000 | DATA

**Example 2: Look up workers and replace their occupation and department**

The following example looks up workers and replaces their occupation and department using their `work_information`:

```sql
source = workers | lookup work_information uid as id, name
```
{% include copy.html %}

The command returns the following results.

id | name | occupation | country | salary | department
:--- | :--- | :--- | :--- | :--- | :---
1000 | Jake | Engineer   | England | 100000 | IT
1001 | Hello | null       | USA | 70000 | null
1002 | John | Scientist  | Canada | 120000 | DATA
1003 | David | Doctor     | null | 120000 | HR
1004 | David | null       | Canada | 0 | null
1005 | Jane | Engineer  | Canada | 90000 | DATA

**Example 3: Look up workers and create a new occupation field**

The following example looks up workers and appends their occupation from `work_information` as a new field:

```sql
source = workers | lookup work_information name replace occupation as new_occupation
```
{% include copy.html %}

The command returns the following results.

id | name | occupation | country | salary | new_occupation
:--- | :--- | :--- | :--- | :--- | :---
1000 | Jake | Engineer | England | 100000 | Engineer
1001 | Hello | Artist | USA | 70000 | null
1002 | John | Doctor | Canada | 120000 | Scientist
1003 | David | Doctor | null | 120000 | Doctor
1004 | David | null | Canada | 0 | Doctor
1005 | Jane | Scientist | Canada | 90000 | Engineer

### Limitations

The `lookup` command works only when `plugins.calcite.enabled` is set to `true`.

</details>

---

## parse

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }
  
Use the `parse` command to parse a text field using a regular expression and append the result to the search result.
 
### Syntax

```sql
parse <field> <regular-expression>
```
{% include copy.html %}

The following table describes the parameters for the `parse` command.

Field | Description | Required
:--- | :--- | :---
`field` | A text field. | Yes
`regular-expression` | The regular expression used to extract new fields from the given text field. If a new field name exists, it replaces the original field. | Yes

The regular expression is used to match the whole text field of each document with the Java regex engine. Each named capture group in the expression becomes a new `STRING` field.

**Example 1: Create a new field**

The following example shows how to create a new field `host` for each document. `host` is the hostname after `@` in the `email` field. Parsing a null field returns an empty string:

```sql
source=accounts | parse email '.+@(?<host>.+)' | fields email, host ;
```
{% include copy.html %}

The command returns the following results.

| email | host  
:--- | :--- |
| amberduke@pyrami.com  | pyrami.com 
| hattiebond@netagy.com | netagy.com 
| null                  | null          
| daleadams@boink.com   | boink.com  

**Example 2: Override the existing field**

The following example shows how to override the existing address field with the street number removed:

```sql
source=accounts | parse address '\d+ (?<address>.+)' | fields address ;
```
{% include copy.html %}

The command returns the following results.

| address
:--- |
| Holmes Lane      
| Bristol Street   
| Madison Street   
| Hutchinson Court

**Example 3: Filter and sort by a cast-parsed field**

The following example shows how to sort street numbers that are higher than 500 in the address field:

```sql
source=accounts | parse address '(?<streetNumber>\d+) (?<street>.+)' | where cast(streetNumber as int) > 500 | sort num(streetNumber) | fields streetNumber, street ;
```
{% include copy.html %}

The command returns the following results.

| streetNumber | street  
:--- | :--- |
| 671 | Bristol Street 
| 789 | Madison Street 
| 880 | Holmes Lane  

### Limitations

A few limitations exist when using the `parse` command:

- Fields defined by `parse` cannot be parsed again. For example, `source=accounts | parse address '\d+ (?<street>.+)' | parse street '\w+ (?<road>\w+)' ;` fails to return any expressions.
- Fields defined by `parse` cannot be overridden with other commands. For example, when entering `source=accounts | parse address '\d+ (?<street>.+)' | eval street='1' | where street='1' ;` `where` does not match any documents since `street` cannot be overridden.
- The text field used by `parse` cannot be overridden. For example, when entering `source=accounts | parse address '\d+ (?<street>.+)' | eval address='1' ;`, `street` is not parsed since the address is overridden.
- Fields defined by `parse` cannot be filtered/sorted after using them in the `stats` command. For example, `source=accounts | parse email '.+@(?<host>.+)' | stats avg(age) by host | where host=pyrami.com ;` `where` does not match the domain listed.

</details>

---

## rare

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }
  
Use the `rare` command to find the least common values of all fields in a field list. A maximum of 10 results are returned for each distinct set of values of the group-by fields.

### Syntax

```sql
rare <field-list> [by-clause]
```
{% include copy.html %}

The following table describes the parameters for the `rare` command.

Field | Description | Required
:--- | :--- | :---
`field-list` | Specify a comma-delimited list of field names. | No
`by-clause` | Specify one or more fields to group the results by. | No

**Example 1: Find the least common values in a field**

To find the least common values of gender, use the following command:

```sql
search source=accounts | rare gender;
```
{% include copy.html %}

The command returns the following results.

| gender
:--- |
| F
| M

**Example 2: Find the least common values grouped by gender**

To find the least common age grouped by gender, use the following command:

```sql
search source=accounts | rare age by gender;
```
{% include copy.html %}

The command returns the following results.

| gender | age
:--- | :--- |
| F  | 28
| M  | 32
| M  | 33

### Limitations

The `rare` command is not rewritten to OpenSearch query DSL; it is only executed on the coordinating node.

</details>

---

## regex

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }
  
The `regex` command filters search results by matching field values against a regular expression pattern. Only documents in which the specified field matches the pattern are included in the results.


### Syntax

```sql
regex <field> = <pattern>
regex <field> != <pattern>
```
{% include copy.html %}

The following table describes the parameters for the `regex` command.

Field | Description | Required
:--- | :--- | :---
`field` | The field name to match against. | Yes
`pattern` | The regular expression pattern to match. Supports Java regex syntax, including named groups, lookahead/lookbehind, and character classes. | Yes

**Example 1: Basic pattern matching**

The following example shows how to filter documents where the ``lastname`` field matches names starting with uppercase letters:

```sql
source=accounts | regex lastname="^[A-Z][a-z]+$" | fields account_number, firstname, lastname;
```
{% include copy.html %}

The command returns the following results.

| account_number | firstname | lastname
:--- | :--- | :--- |
| 1  | Amber   | Duke
| 6  | Hattie  | Bond
| 13 | Nanette | Bates
| 18 | Dale    | Adams

**Example 2: Negative matching**

The following example shows how to exclude documents where the ``lastname`` field ends with "son":

```sql
source=accounts | regex lastname!=".*son$" | fields account_number, lastname;
```
{% include copy.html %}

The command returns the following results.

| account_number | lastname
:--- | :--- |
| 1  | Duke
| 6  | Bond
| 13 | Bates
| 18 | Adams

**Example 3: Email domain matching**

The following example shows how to filter documents by email domain patterns:

```sql
source=accounts | regex email="@pyrami\.com$" | fields account_number, email;
```
{% include copy.html %}

The command returns the following results.

| account_number | email
:--- | :--- |
| 1  | amberduke@pyrami.com

**Example 4: Complex patterns with character classes**

The following example shows how to use complex regex patterns with character classes and quantifiers:

```sql
source=accounts | regex address="\d{3,4}\s+[A-Z][a-z]+\s+(Street|Lane|Court)" | fields account_number, address;
```
{% include copy.html %}

The command returns the following results.

| account_number | address
:--- | :--- |
| 1  | 880 Holmes Lane
| 6  | 671 Bristol Street
| 13 | 789 Madison Street
| 18 | 467 Hutchinson Court

**Example 5: Case-sensitive matching**

The following example demonstrates that regex matching is case-sensitive by default:

```sql
source=accounts | regex state="va" | fields account_number, state;
```
{% include copy.html %}

The command returns the following results.

| account_number | state
| :--- | :---

```sql
source=accounts | regex state="VA" | fields account_number, state;
```
{% include copy.html %}

The command returns the following results.

| account_number | state
:--- | :--- |
| 13 | VA

### Limitations

- **Field specification required**: A field name must be specified in the `regex` command. Pattern-only syntax (for example, ``regex "pattern"``) is not currently supported.
- **String fields only**: The `regex` command currently only supports string fields. Using it on numeric or Boolean fields results in an error.

</details>

---

## rename

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }
  
Use the `rename` command to rename one or more fields in the search result.


### Syntax

```sql
rename <source-field> AS <target-field>["," <source-field> AS <target-field>]...
```
{% include copy.html %}

The following table describes the parameters for the `rename` command.

Field | Description | Required
:--- | :--- | :---
`source-field` | The name of the field that you want to rename. | Yes
`target-field` | The name you want to rename to. | Yes

**Example 1: Rename one field**

To rename the `account_number` field as `an`, use the following command:

```sql
search source=accounts | rename account_number as an | fields an;
```
{% include copy.html %}

The command returns the following results.

| an
:--- |
| 1
| 6
| 13
| 18

**Example 2: Rename multiple fields**

To rename the `account_number` field as `an` and `employer` as `emp`, use the following command:

```sql
search source=accounts | rename account_number as an, employer as emp | fields an, emp;
```
{% include copy.html %}

The command returns the following results.

| an   | emp
:--- | :--- |
| 1    | Pyrami
| 6    | Netagy
| 13   | Quility
| 18   | null

### Limitations

The `rename` command is not rewritten to OpenSearch query DSL; it is only executed on the coordinating node.

</details>

---

## rex

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }
  
The `rex` command extracts fields from a raw text field using regular expression named capture groups.


### Syntax

```sql
rex [mode=<mode>] field=<field> <pattern> [max_match=<int>] [offset_field=<string>]
```
{% include copy.html %}

The following table describes the parameters for the `rex` command.

Field | Description | Required | Default
:--- | :--- | :--- | :---
`field` | The field must be a string field to extract data from. | Yes | N/A
`pattern` | The regular expression pattern with named capture groups used to extract new fields. The pattern must contain at least one named capture group using ``(?<name>pattern)`` syntax. | Yes | N/A
`mode` | Either `extract`, which creates new fields from regular expression named capture groups, or `sed`, which performs text substitution on the field using sed-style patterns. | No | `extract`
`max_match` | The maximum number of matches to extract. If greater than 1, extracted fields become arrays. The value 0 means unlimited matches, but is automatically capped to the configured limit (default: 10, configurable using `plugins.ppl.rex.max_match.limit`). | No | 1
`offset_field` | The field name used to store the character offset positions of matches. Only available in extract mode. | No | N/A

**Example 1: Basic field extraction**

The following example shows how to extract the username and domain from email addresses using named capture groups. Both extracted fields are returned as a string type:

```sql
source=accounts | rex field=email "(?<username>[^@]+)@(?<domain>[^.]+)" | fields email, username, domain | head 2;
```
{% include copy.html %}

The command returns the following results.

| email | username | domain
:--- | :--- | :--- |
| amberduke@pyrami.com  | amberduke  | pyrami
| hattiebond@netagy.com | hattiebond | netagy

**Example 2: Handling non-matching patterns**

The following example shows the `rex` command returning all events, setting extracted fields to null for non-matching patterns. Extracted fields are of a string type when matches are found:

```sql
source=accounts | rex field=email "(?<user>[^@]+)@(?<domain>gmail\\.com)" | fields email, user, domain | head 2;
```
{% include copy.html %}

The command returns the following results.

| email | user | domain
:--- | :--- | :--- |
| amberduke@pyrami.com  | null | null
| hattiebond@netagy.com | null | null

**Example 3: Multiple matches with max_match**

The following example shows how to extract multiple words from the address field using the `max_match` parameter. The extracted field is returned as an array type containing string elements:

```sql
source=accounts | rex field=address "(?<words>[A-Za-z]+)" max_match=2 | fields address, words | head 3;
```
{% include copy.html %}

The command returns the following results.

| address | words
| :--- | :--- |
| 880 Holmes Lane    | [Holmes,Lane]
| 671 Bristol Street | [Bristol,Street]
| 789 Madison Street | [Madison,Street]

**Example 4: Text replacement with mode=sed**

The following example shows how to replace email domains using sed mode for text substitution. The extracted field is returned as a string type:

```sql
source=accounts | rex field=email mode=sed "s/@.*/@company.com/" | fields email | head 2;
```
{% include copy.html %}

The command returns the following results.

| email
| :---
| amberduke@company.com
| hattiebond@company.com

**Example 5: Using offset_field**

The following example shows how to track the character positions where matches occur. Extracted fields are of a string type, and the `offset_field` is also of a string type:

```sql
source=accounts | rex field=email "(?<username>[^@]+)@(?<domain>[^.]+)" offset_field=matchpos | fields email, username, domain, matchpos | head 2;
```
{% include copy.html %}

The command returns the following results.

| email | username | domain | matchpos
:--- | :--- | :--- | :--- |
| amberduke@pyrami.com. | amberduke  | pyrami | domain=10-15&username=0-8
| hattiebond@netagy.com | hattiebond | netagy | domain=11-16&username=0-9

### Limitations

**Named Capture Group Naming:**

- Group names must start with a letter and contain only letters and digits.
- For detailed Java regex pattern syntax and usage, refer to the [official Java Pattern documentation](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html).

**Pattern requirements**:

- The pattern must contain at least one named capture group.
- Regular capture groups ``(...)`` without names are not allowed.

**Max match limit**:
 
- The ``max_match`` parameter is subject to a configurable system limit to prevent memory exhaustion.
- When ``max_match=0`` (unlimited) is specified, it is automatically capped at the configured limit (default: 10).
- User-specified values exceeding the configured limit result in an error.
- Users can adjust the limit using the ``plugins.ppl.rex.max_match.limit`` cluster setting. Setting this limit to a large value is not recommended because it can lead to excessive memory consumption, especially with patterns that match empty strings (for example, ``\d*``, ``\w*``).

</details>

---

## sort

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }
  
Use the `sort` command to sort search results by a specified field.


### Syntax

```sql
sort [count] <[+|-] sort-field>...
```
{% include copy.html %}

The following table describes the parameters for the `sort` command.

Field | Description | Required | Default
:--- | :--- | :--- | :---
`count` | The maximum number of results to return from the sorted result. If count=0, all results are returned. | No | 1000
`[+|-]` | Use plus [+] to sort by ascending order and minus [-] to sort by descending order. | No | Ascending order
`sort-field` | Specify the field that you want to sort by. | Yes | N/A

**Example 1: Sort by one field**

To sort all documents by the `age` field in ascending order, use the following command:

```sql
search source=accounts | sort age | fields account_number, age;
```
{% include copy.html %}

The command returns the following results.

account_number | age
:--- | :---
13 | 28
1 | 32
18 | 33
6 | 36

**Example 2: Sort by one field and return all results**

To sort all documents by the `age` field in ascending order and specify `count` as 0 to return all results, use the following command:

```sql
search source=accounts | sort 0 age | fields account_number, age;
```
{% include copy.html %}

The command returns the following results.

account_number | age
:--- | :---
13 | 28
1 | 32
18 | 33
6 | 36

**Example 3: Sort by one field in descending order**

To sort all documents by the `age` field in descending order, use the following command:

```sql
search source=accounts | sort - age | fields account_number, age;
```
{% include copy.html %}

account_number | age
:--- | :---
6 | 36
18 | 33
1 | 32
13 | 28

**Example 4: Specify the number of sorted documents to return**

To sort all documents by the `age` field in ascending order and specify `count` as 2 to return two results, use the following command:

```sql
search source=accounts | sort 2 age | fields account_number, age;
```
{% include copy.html %}

The command returns the following results.

account_number | age
:--- | :---
13 | 28
1 | 32

**Example 5: Sort by multiple fields**

To sort all documents by the `gender` field in ascending order and the `age` field in descending order, use the following command:

```sql
search source=accounts | sort + gender, - age | fields account_number, gender, age;
```
{% include copy.html %}

The command returns the following results.

| account_number | gender | age
| :--- | :--- | :--- |
| 13 | F | 28
| 6  | M | 36
| 18 | M | 33
| 1  | M | 32

</details>

---

## spath

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }
  
The `spath` command allows you to extract fields from structured text data. It currently allows selecting from JSON data with JSON paths.


### Syntax

```sql
spath input=<field> [output=<field>] [path=]<path>
```
{% include copy.html %}

The following table describes the parameters for the `spath` command.

Field | Description | Required | Default
:--- | :--- | :--- | :---
`input` | The field to scan for JSON data. | Yes | N/A
`output` | The destination field that the data is loaded to. | No | Value of path
`path` | The path of the data to load for the object. | Yes | N/A

**Example 1: Simple field extraction**

The simplest `spath` is to extract a single field. The following example extracts n from the doc field of type text:

```sql
source=structured | spath input=doc_n n | fields doc_n n;
```
{% include copy.html %}

The command returns the following results.

doc_n | n
:--- | :---
{"n": 1} | 1
{"n": 2} | 2
{"n": 3} | 3

**Example 2: Lists and nesting**

The following example demonstrates additional JSON path use cases, such as traversing nested fields and extracting list elements:

```sql
source=structured | spath input=doc_list output=first_element list{0} | spath input=doc_list output=all_elements list{} | spath input=doc_list output=nested nest_out.nest_in | fields doc_list first_element all_elements nested;
```
{% include copy.html %}

| doc_list | first_element | all_elements | nested
| :--- | :--- | :--- | :--- |
| {"list": [1, 2, 3, 4], "nest_out": {"nest_in": "a"}} | 1 | [1,2,3,4] | a
| {"list": [], "nest_out": {"nest_in": "a"}} | null | [] | a
| {"list": [5, 6], "nest_out": {"nest_in": "a"}}  | 5 | [5,6] | a

**Example 3: Sum of inner elements**

The following example shows how to extract an inner field and generate statistics on it, using the documents from the first example. It also demonstrates that `spath` always returns strings for inner types:

```sql
source=structured | spath input=doc_n n | eval n=cast(n as int) | stats sum(n) | fields `sum(n)`;
```
{% include copy.html %}

The command returns the following results.

| sum(n)
| :---
| 6

**Example 4: Escaped paths**

`spath` can escape paths with strings to accept any path that `json_extract` does. This includes escaping complex field names as array components:

```sql
source=structured | spath output=a input=doc_escape "['a fancy field name']" | spath output=b input=doc_escape "['a.b.c']" | fields a b;
```
{% include copy.html %}

The command returns the following results.

| a | b
| :--- | :--- 
| true | 0
| true | 1
| false | 2

</details>

---

## stats

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }
  
Use the `stats` command to aggregate data from search results.

The following table lists the aggregation functions and also indicates how each one handles null or missing values.

Function | NULL | MISSING
:--- | :--- | :---
`COUNT` | Not counted | Not counted
`SUM` | Ignore | Ignore
`AVG` | Ignore | Ignore
`MAX` | Ignore | Ignore
`MIN` | Ignore | Ignore


### Syntax

```sql
stats <aggregation>... [by-clause]...
```
{% include copy.html %}

The following table describes the parameters for the `stats` command.

Field | Description | Required | Default
:--- | :--- | :--- | :---
`aggregation` | Specify a statistical aggregation function. The argument of this function must be a field. | Yes | N/A
`by-clause` | Specify one or more fields to group the results by. If not specified, the `stats` command returns only one row, which is the aggregation over the entire result set. | No | N/A

**Example 1: Calculate the average value of a field**

To calculate the average `age` of all documents, use the following command:

```sql
search source=accounts | stats avg(age);
```
{% include copy.html %}

The command returns the following results.

| avg(age)
:--- |
| 32.25

**Example 2: Calculate the average value of a field by group**

To calculate the average `age` grouped by gender, use the following command:

```sql
search source=accounts | stats avg(age) by gender;
```
{% include copy.html %}

The command returns the following results.

| gender | avg(age)
:--- | :--- |
| F  | 28.0
| M  | 33.666666666666664

**Example 3: Calculate the average and sum of a field by group**

To calculate the average and sum of `age` grouped by gender, use the following command:

```sql
search source=accounts | stats avg(age), sum(age) by gender;
```
{% include copy.html %}

The command returns the following results.

| gender | avg(age) | sum(age)
:--- | :--- | :--- |
| F  | 28   | 28
| M  | 33.666666666666664 | 101

**Example 4: Calculate the maximum value of a field**

To calculate the maximum `age`, use the following command:

```sql
search source=accounts | stats max(age);
```
{% include copy.html %}

| max(age)
:--- |
| 36

**Example 5: Calculate the maximum and minimum value of a field by group**

To calculate the maximum and minimum `age` values grouped by gender, use the following command:

```sql
search source=accounts | stats max(age), min(age) by gender;
```
{% include copy.html %}

The command returns the following results.

| gender | min(age) | max(age)
:--- | :--- | :--- |
| F  | 28 | 28
| M  | 32 | 36

</details>

---

## timechart

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }

The `timechart` command creates a time-based aggregation of data. It groups data by time intervals and optionally by a field, then applies an aggregation function to each group. The results are returned in an unpivoted format with separate rows for each time-field combination.


### Syntax

```sql
timechart [timefield=<field_name>] [span=<time_interval>] [limit=<number>] [useother=<boolean>] <aggregation_function> [by <field>]
```
{% include copy.html %}

The following table describes the parameters for the `timechart` command.

Field | Description | Required | Default
:--- | :--- | :--- | :--- |
`timefield` | The field to use for time-based grouping. Must be a timestamp field. | No | `@timestamp`
`span` | Specifies the time interval for grouping data. | No | 1m
`limit` | Specifies the maximum number of distinct values to display when using the "by" clause. | No | 10
`useother` | Controls whether to create an "OTHER" category for values beyond the limit. | No | `true`
`aggregation_function` | The aggregation function to apply to each time bucket. | Yes | N/A
`by` | Groups the results by the specified field in addition to time intervals. If not specified, the aggregation is performed across all documents in each time interval. | No | N/A

**Example 1: Count events by hour**

The following example counts events for each hour and groups them by host:

```sql
source=events | timechart span=1h count() by host;
```
{% include copy.html %}

The command returns the following results.

| @timestamp | host | count()
:--- | :--- | :--- |
| 2023-01-01 10:00:00 | server1 | 4
| 2023-01-01 10:00:00 | server2 | 4

**Example 2: Calculate average number of packets by minute** 

The following example calculates the average packets for each minute without grouping by any field:

```sql
source=events | timechart span=1m avg(packets);
```
{% include copy.html %}

The command returns the following results.

| @timestamp | avg(packets)
:--- | :--- |
| 2023-01-01 10:00:00 | 60.0
| 2023-01-01 10:05:00 | 30.0
| 2023-01-01 10:10:00 | 60.0
| 2023-01-01 10:15:00 | 30.0
| 2023-01-01 10:20:00 | 60.0
| 2023-01-01 10:25:00 | 30.0
| 2023-01-01 10:30:00 | 180.0
| 2023-01-01 10:35:00 | 90.0

**Example 3: Calculate average number of packets by every 20 minutes and status** 

The following example calculates the average number of packets for every 20 minutes and groups them by status:

```sql
source=events | timechart span=20m avg(packets) by status;
```
{% include copy.html %}

The command returns the following results.

| @timestamp | status | avg(packets)
:--- | :--- | :--- |
| 2023-01-01 10:00:00 | active | 30.0
| 2023-01-01 10:05:00 | inactive | 30.0
| 2023-01-01 10:10:00 | pending | 60.0
| 2023-01-01 10:15:00 | processing | 60.0
| 2023-01-01 10:20:00 | cancelled | 180.0
| 2023-01-01 10:25:00 | completed | 60.0
| 2023-01-01 10:30:00 | inactive | 90.0
| 2023-01-01 10:35:00 | pending | 30.0

**Example 4: Using the limit parameter with the count() function** 

When there are many distinct values in the "by" field, the `timechart` command displays the top values based on the `limit` parameter and groups the rest into an "OTHER" category.
The following query displays the top 2 hosts with the highest count values and groups the remaining hosts into an "OTHER" category:

```sql
source=events | timechart span=1m limit=2 count() by host;
```
{% include copy.html %}

| @timestamp | host | count()
:--- | :--- | :--- |
| 2023-01-01 10:00:00 | server1 | 1
| 2023-01-01 10:05:00 | server2 | 1
| 2023-01-01 10:10:00 | server1 | 1
| 2023-01-01 10:15:00 | server2 | 1
| 2023-01-01 10:20:00 | server1 | 1
| 2023-01-01 10:25:00 | server2 | 1
| 2023-01-01 10:30:00 | server1 | 1
| 2023-01-01 10:35:00 | server2 | 1

**Example 5: Using limit=0 with count() to show all values** 

To display all distinct values without any limit, set `limit=0` and use the following command:

```sql
source=events_many_hosts | timechart span=1h limit=0 count() by host;
```
{% include copy.html %}

The command returns the following results.

| @timestamp | host | count()
:--- | :--- | :--- |
| 2024-07-01 00:00:00 | web-01 | 1
| 2024-07-01 00:00:00 | web-02 | 1
| 2024-07-01 00:00:00 | web-03 | 1
| 2024-07-01 00:00:00 | web-04 | 1
| 2024-07-01 00:00:00 | web-05 | 1
| 2024-07-01 00:00:00 | web-06 | 1
| 2024-07-01 00:00:00 | web-07 | 1
| 2024-07-01 00:00:00 | web-08 | 1
| 2024-07-01 00:00:00 | web-09 | 1
| 2024-07-01 00:00:00 | web-10 | 1
| 2024-07-01 00:00:00 | web-11 | 1

**Example 6: Using useother=false with the count() function** 

The following example displays the top 10 hosts without the OTHER category (`useother=false`):

```sql
source=events_many_hosts | timechart span=1h useother=false count() by host;
```
{% include copy.html %}

The command returns the following results.

| @timestamp | host | count()
:--- | :--- | :--- |
| 2024-07-01 00:00:00 | web-01 | 1
| 2024-07-01 00:00:00 | web-02 | 1
| 2024-07-01 00:00:00 | web-03 | 1
| 2024-07-01 00:00:00 | web-04 | 1
| 2024-07-01 00:00:00 | web-05 | 1
| 2024-07-01 00:00:00 | web-06 | 1
| 2024-07-01 00:00:00 | web-07 | 1
| 2024-07-01 00:00:00 | web-08 | 1
| 2024-07-01 00:00:00 | web-09 | 1
| 2024-07-01 00:00:00 | web-10 | 1

**Example 7: Using the limit parameter with the useother parameter and the avg() function** 

The following example displays the top 3 hosts with the OTHER category (default is `useother=true`):

```sql
source=events_many_hosts | timechart span=1h limit=3 avg(cpu_usage) by host;
```
{% include copy.html %}

The command returns the following results.

| @timestamp | host | avg(cpu_usage)
:--- | :--- | :--- |
| 2024-07-01 00:00:00 | OTHER | 41.3
| 2024-07-01 00:00:00 | web-03 | 55.3
| 2024-07-01 00:00:00 | web-07 | 48.6
| 2024-07-01 00:00:00 | web-09 | 67.8

**Example 8: Handling null values in the "by" field** 

The following example shows how null values in the "by" field are treated as a separate category. The dataset `events_null` has 1 entry that does not have a host field.
It is put into a separate "NULL" category because the defaults for `usenull` and `nullstr` are `true` and `"NULL"`, respectively:

```sql
source=events_null | timechart span=1h count() by host;
```
{% include copy.html %}

The command returns the following results.

| @timestamp | host | count()
:--- | :--- | :--- |
| 2024-07-01 00:00:00 | NULL | 1
| 2024-07-01 00:00:00 | db-01 | 1
| 2024-07-01 00:00:00 | web-01 | 2
| 2024-07-01 00:00:00 | web-02 | 2

**Example 9: Calculate packets per second rate** 

The following example calculates the per-second packet rate for network traffic data using the `per_second()` function:

```sql
source=events | timechart span=30m per_second(packets) by host;
```
{% include copy.html %}

The command returns the following results.

| @timestamp | host | per_second(packets)
:--- | :--- | :--- |
| 2024-07-01 00:00:00 | server1 | 0.1
| 2024-07-01 00:00:00 | server2 | 0.05
| 2024-07-01 00:00:00 | server1 | 0.1
| 2024-07-01 00:00:00 | server2 | 0.05

### Limitations
- Only a single aggregation function is supported per `timechart` command.
- The `bins` parameter and other bin options are not supported in the `timechart` command. Use the `span` parameter to control time intervals.

</details>

---

## top

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }

Use the `top` command to find the most common values of all fields in the field list.

### Syntax

```sql
top [N] <field-list> [by-clause]
```
{% include copy.html %}

The following table describes the parameters for the `top` command.

Field | Description | Required | Default
:--- | :--- | :--- | :---
`N` | Specify the number of results to return. | No | 10
`field-list` | Specify a comma-delimited list of field names. | Yes | N/A
`by-clause` | Specify one or more fields to group the results by. | No | N/A

**Example 1: Find the most common values in a field**

To find the most common genders, use the following command:

```sql
search source=accounts | top gender;
```
{% include copy.html %}

The command returns the following results.

| gender
:--- |
| M
| F

**Example 2: Find the most common value in a field**

To find the most common gender, use the following command:

```sql
search source=accounts | top 1 gender;
```
{% include copy.html %}

The command returns the following results.

| gender
:--- |
| M

**Example 3: Find the most common values grouped by gender**

To find the most common age grouped by gender, use the following command:

```sql
search source=accounts | top 1 age by gender;
```
{% include copy.html %}

The command returns the following results.

| gender | age
:--- | :--- |
| F  | 28
| M  | 32

### Limitations

The `top` command is not rewritten to OpenSearch query DSL; it is only executed on the coordinating node.

</details>

---

## where

<details open markdown="block">
  <summary>
    Syntax and examples
  </summary>
  {: .text-delta }

Use the `where` command with a Boolean expression to filter the search result. The `where` command only returns the result when the Boolean expression evaluates to `true`.

### Syntax

```sql
where <boolean-expression>
```
{% include copy.html %}

The following table describes the parameters for the `where` command.

Field | Description | Required
:--- | :--- | :---
`boolean-expression` | An expression that evaluates to a Boolean value. | No

**Example: Filter the result set with a condition**

To get all documents from the `accounts` index where `account_number` is 1 or gender is `F`, use the following command:

```sql
search source=accounts | where account_number=1 or gender="F" | fields account_number, gender;
```
{% include copy.html %}

The command returns the following results.

| account_number | gender
:--- | :--- |
| 1  | M
| 13 | F

</details>