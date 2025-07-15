---
layout: default
title: Commands
parent: PPL
grand_parent: SQL and PPL
nav_order: 2
redirect_from:
  - /observability-plugin/ppl/commands/
  - /search-plugins/ppl/commands/
---

# Commands

`PPL` supports most [`SQL` common]({{site.url}}{{site.baseurl}}/search-plugins/sql/functions/) functions, including [relevance search]({{site.url}}{{site.baseurl}}/search-plugins/sql/full-text/), but also introduces few more functions (called `commands`) which are available in `PPL` only.

## dedup

The `dedup` (data deduplication) command removes duplicate documents defined by a field from the search result.

### Syntax

```sql
dedup [int] <field-list> [keepempty=<bool>] [consecutive=<bool>]
```

Field | Description | Type | Required | Default
:--- | :--- |:--- |:--- |:---
`int` |  Retain the specified number of duplicate events for each combination. The number must be greater than 0. If you do not specify a number, only the first occurring event is kept and all other duplicates are removed from the results. | `string` | No | 1
`keepempty` | If true, keep the document if any field in the field list has a null value or a field missing. | `nested list of objects` | No | False
`consecutive` | If true, remove only consecutive events with duplicate combinations of values. | `Boolean` | No | False
`field-list` | Specify a comma-delimited field list. At least one field is required. | `String` or comma-separated list of strings | Yes | -

**Example 1: Dedup by one field**

To remove duplicate documents with the same gender:

```sql
search source=accounts | dedup gender | fields account_number, gender;
```

| account_number | gender
:--- | :--- |
1 | M
13 | F


**Example 2: Keep two duplicate documents**

To keep two duplicate documents with the same gender:

```sql
search source=accounts | dedup 2 gender | fields account_number, gender;
```

| account_number | gender
:--- | :--- |
1 | M
6 | M
13 | F

**Example 3: Keep or ignore an empty field by default**

To keep two duplicate documents with a `null` field value:

```sql
search source=accounts | dedup email keepempty=true | fields account_number, email;
```

| account_number | email
:--- | :--- |
1 | amberduke@pyrami.com
6 | hattiebond@netagy.com
13 | null
18 | daleadams@boink.com

To remove duplicate documents with the `null` field value:

```sql
search source=accounts | dedup email | fields account_number, email;
```

| account_number | email
:--- | :--- |
1 | amberduke@pyrami.com
6 | hattiebond@netagy.com
18 | daleadams@boink.com

**Example 4: Dedup of consecutive documents**

To remove duplicates of consecutive documents:

```sql
search source=accounts | dedup gender consecutive=true | fields account_number, gender;
```

| account_number | gender
:--- | :--- |
1 | M
13 | F
18 | M

### Limitations

The `dedup` command is not rewritten to OpenSearch DSL, it is only executed on the coordination node.

## eval

The `eval` command evaluates an expression and appends its result to the search result.

### Syntax

```sql
eval <field>=<expression> ["," <field>=<expression> ]...
```

Field | Description | Required
:--- | :--- |:---
`field` | If a field name does not exist, a new field is added. If the field name already exists, it's overwritten. | Yes
`expression` | Specify any supported expression. | Yes

**Example 1: Create a new field**

To create a new `doubleAge` field for each document. `doubleAge` is the result of `age` multiplied by 2:

```sql
search source=accounts | eval doubleAge = age * 2 | fields age, doubleAge;
```

| age | doubleAge
:--- | :--- |
32    | 64
36    | 72
28    | 56
33    | 66

*Example 2*: Overwrite the existing field

To overwrite the `age` field with `age` plus 1:

```sql
search source=accounts | eval age = age + 1 | fields age;
```

| age
:--- |
| 33
| 37
| 29
| 34

**Example 3: Create a new field with a field defined with the `eval` command**

To create a new field `ddAge`. `ddAge` is the result of `doubleAge` multiplied by 2, where `doubleAge` is defined in the `eval` command:

```sql
search source=accounts | eval doubleAge = age * 2, ddAge = doubleAge * 2 | fields age, doubleAge, ddAge;
```

| age | doubleAge | ddAge
:--- | :--- |
| 32    | 64   | 128
| 36    | 72   | 144
| 28    | 56   | 112
| 33    | 66   | 132


### Limitation

The ``eval`` command is not rewritten to OpenSearch DSL, it is only executed on the coordination node.

## fields

Use the `fields` command to keep or remove fields from a search result.

### Syntax

```sql
fields [+|-] <field-list>
```

Field | Description | Required | Default
:--- | :--- |:---|:---
`index` | Plus (+) keeps only fields specified in the field list. Minus (-) removes all fields specified in the field list. | No | +
`field list` | Specify a comma-delimited list of fields. | Yes | No default

**Example 1: Select specified fields from result**

To get `account_number`, `firstname`, and `lastname` fields from a search result:

```sql
search source=accounts | fields account_number, firstname, lastname;
```

| account_number | firstname  | lastname
:--- | :--- |
| 1   | Amber       | Duke
| 6   | Hattie      | Bond
| 13  | Nanette     | Bates
| 18  | Dale        | Adams

**Example 2: Remove specified fields from a search result**

To remove the `account_number` field from the search results:

```sql
search source=accounts | fields account_number, firstname, lastname | fields - account_number;
```

| firstname | lastname
:--- | :--- |
| Amber   | Duke
| Hattie  | Bond
| Nanette | Bates
| Dale    | Adams


## parse

Use the `parse` command to parse a text field using regular expression and append the result to the search result. 

### Syntax

```sql
parse <field> <regular-expression>
```

Field | Description | Required
:--- | :--- |:---
field | A text field. | Yes
regular-expression | The regular expression used to extract new fields from the given test field. If a new field name exists, it will replace the original field. | Yes

The regular expression is used to match the whole text field of each document with Java regex engine. Each named capture group in the expression will become a new ``STRING`` field.

**Example 1: Create new field**

The example shows how to create new field `host` for each document. `host` will be the hostname after `@` in `email` field. Parsing a null field will return an empty string.

```sql
os> source=accounts | parse email '.+@(?<host>.+)' | fields email, host ;
fetched rows / total rows = 4/4
```

| email | host  
:--- | :--- |
| amberduke@pyrami.com  | pyrami.com 
| hattiebond@netagy.com | netagy.com 
| null                  | null          
| daleadams@boink.com   | boink.com  

*Example 2*: Override the existing field

The example shows how to override the existing address field with street number removed.

```sql
os> source=accounts | parse address '\d+ (?<address>.+)' | fields address ;
fetched rows / total rows = 4/4
```

| address
:--- |
| Holmes Lane      
| Bristol Street   
| Madison Street   
| Hutchinson Court

**Example 3: Filter and sort be casted parsed field**

The example shows how to sort street numbers that are higher than 500 in address field.

```sql
os> source=accounts | parse address '(?<streetNumber>\d+) (?<street>.+)' | where cast(streetNumber as int) > 500 | sort num(streetNumber) | fields streetNumber, street ;
fetched rows / total rows = 3/3
```

| streetNumber | street  
:--- | :--- |
| 671 | Bristol Street 
| 789 | Madison Street 
| 880 | Holmes Lane  

### Limitations

A few limitations exist when using the parse command:

- Fields defined by parse cannot be parsed again. For example, `source=accounts | parse address '\d+ (?<street>.+)' | parse street '\w+ (?<road>\w+)' ;` will fail to return any expressions.
- Fields defined by parse cannot be overridden with other commands. For example, when entering `source=accounts | parse address '\d+ (?<street>.+)' | eval street='1' | where street='1' ;` `where` will not match any documents since `street` cannot be overridden.
- The text field used by parse cannot be overridden. For example, when entering `source=accounts | parse address '\d+ (?<street>.+)' | eval address='1' ;` `street` will not be parse since address is overridden. 
- Fields defined by parse cannot be filtered/sorted after using them in the `stats` command. For example, `source=accounts | parse email '.+@(?<host>.+)' | stats avg(age) by host | where host=pyrami.com ;` `where` will not parse the domain listed.

## rename

Use the `rename` command to rename one or more fields in the search result.

### Syntax

```sql
rename <source-field> AS <target-field>["," <source-field> AS <target-field>]...
```

Field | Description | Required
:--- | :--- |:---
`source-field` | The name of the field that you want to rename. | Yes
`target-field` | The name you want to rename to. | Yes

**Example 1: Rename one field**

Rename the `account_number` field as `an`:

```sql
search source=accounts | rename account_number as an | fields an;
```

| an
:--- |
| 1
| 6
| 13
| 18

**Example 2: Rename multiple fields**

Rename the `account_number` field as `an` and `employer` as `emp`:

```sql
search source=accounts | rename account_number as an, employer as emp | fields an, emp;
```

| an   | emp
:--- | :--- |
| 1    | Pyrami
| 6    | Netagy
| 13   | Quility
| 18   | null

### Limitations

The `rename` command is not rewritten to OpenSearch DSL, it is only executed on the coordination node.

## sort

Use the `sort` command to sort search results by a specified field.

### Syntax

```sql
sort [count] <[+|-] sort-field>...
```

Field | Description | Required | Default
:--- | :--- |:---
`count` | The maximum number results to return from the sorted result. If count=0, all results are returned. | No | 1000
`[+|-]` | Use plus [+] to sort by ascending order and minus [-] to sort by descending order. | No | Ascending order
`sort-field` | Specify the field that you want to sort by. | Yes | -

**Example 1: Sort by one field**

To sort all documents by the `age` field in ascending order:

```sql
search source=accounts | sort age | fields account_number, age;
```

| account_number | age |
:--- | :--- |
| 13 | 28
| 1  | 32
| 18 | 33
| 6  | 36

**Example 2: Sort by one field and return all results**

To sort all documents by the `age` field in ascending order and specify count as 0 to get back all results:

```sql
search source=accounts | sort 0 age | fields account_number, age;
```

| account_number | age |
:--- | :--- |
| 13 | 28
| 1  | 32
| 18 | 33
| 6  | 36

**Example 3: Sort by one field in descending order**

To sort all documents by the `age` field in descending order:

```sql
search source=accounts | sort - age | fields account_number, age;
```

| account_number | age |
:--- | :--- |
| 6 | 36
| 18  | 33
| 1 | 32
| 13  | 28

**Example 4: Specify the number of sorted documents to return**

To sort all documents by the `age` field in ascending order and specify count as 2 to get back two results:

```sql
search source=accounts | sort 2 age | fields account_number, age;
```

| account_number | age |
:--- | :--- |
| 13 | 28
| 1  | 32

**Example 5: Sort by multiple fields**

To sort all documents by the `gender` field in ascending order and `age` field in descending order:

```sql
search source=accounts | sort + gender, - age | fields account_number, gender, age;
```

| account_number | gender | age |
:--- | :--- | :--- |
| 13 | F | 28
| 6  | M | 36
| 18 | M | 33
| 1  | M | 32

## stats

Use the `stats` command to aggregate from search results.

The following table lists the aggregation functions and also indicates how each one handles null or missing values:

Function | NULL | MISSING
:--- | :--- |:---
`COUNT` | Not counted | Not counted
`SUM` | Ignore | Ignore
`AVG` | Ignore | Ignore
`MAX` | Ignore | Ignore
`MIN` | Ignore | Ignore


### Syntax

```
stats <aggregation>... [by-clause]...
```

Field | Description | Required | Default
:--- | :--- |:---
`aggregation` | Specify a statistical aggregation function. The argument of this function must be a field. | Yes | 1000
`by-clause` | Specify one or more fields to group the results by. If not specified, the `stats` command returns only one row, which is the aggregation over the entire result set. | No | -

**Example 1: Calculate the average value of a field**

To calculate the average `age` of all documents:

```sql
search source=accounts | stats avg(age);
```

| avg(age)
:--- |
| 32.25

**Example 2: Calculate the average value of a field by group**

To calculate the average age grouped by gender:

```sql
search source=accounts | stats avg(age) by gender;
```

| gender | avg(age)
:--- | :--- |
| F  | 28.0
| M  | 33.666666666666664

**Example 3: Calculate the average and sum of a field by group**

To calculate the average and sum of age grouped by gender:

```sql
search source=accounts | stats avg(age), sum(age) by gender;
```

| gender | avg(age) | sum(age)
:--- | :--- |
| F  | 28   | 28
| M  | 33.666666666666664 | 101

**Example 4: Calculate the maximum value of a field**

To calculate the maximum age:

```sql
search source=accounts | stats max(age);
```

| max(age)
:--- |
| 36

**Example 5: Calculate the maximum and minimum value of a field by group**

To calculate the maximum and minimum age values grouped by gender:

```sql
search source=accounts | stats max(age), min(age) by gender;
```

| gender | min(age) | max(age)
:--- | :--- | :--- |
| F  | 28 | 28
| M  | 32 | 36

## where

Use the `where` command with a bool expression to filter the search result. The `where` command only returns the result when the bool expression evaluates to true.

### Syntax

```sql
where <boolean-expression>
```

Field | Description | Required
:--- | :--- |:---
`bool-expression` | An expression that evaluates to a boolean value. | No

**Example: Filter result set with a condition**

To get all documents from the `accounts` index where `account_number` is 1 or gender is `F`:

```sql
search source=accounts | where account_number=1 or gender=\"F\" | fields account_number, gender;
```

| account_number | gender
:--- | :--- |
| 1  | M
| 13 | F

## head

Use the `head` command to return the first N number of results in a specified search order.

### Syntax

```sql
head [N]
```

Field | Description | Required | Default
:--- | :--- |:---
`N` | Specify the number of results to return. | No | 10

**Example 1: Get the first 10 results**

To get the first 10 results:

```sql
search source=accounts | fields firstname, age | head;
```

| firstname | age
:--- | :--- |
| Amber  | 32
| Hattie | 36
| Nanette | 28

**Example 2: Get the first N results**

To get the first two results:

```sql
search source=accounts | fields firstname, age | head 2;
```

| firstname | age
:--- | :--- |
| Amber  | 32
| Hattie | 36

### Limitations

The `head` command is not rewritten to OpenSearch DSL, it is only executed on the coordination node.

## rare

Use the `rare` command to find the least common values of all fields in a field list.
A maximum of 10 results are returned for each distinct set of values of the group-by fields.

### Syntax

```sql
rare <field-list> [by-clause]
```

Field | Description | Required
:--- | :--- |:---
`field-list` | Specify a comma-delimited list of field names. | No
`by-clause` | Specify one or more fields to group the results by. | No

**Example 1: Find the least common values in a field**

To find the least common values of gender:

```sql
search source=accounts | rare gender;
```

| gender
:--- |
| F
| M

**Example 2: Find the least common values grouped by gender**

To find the least common age grouped by gender:

```sql
search source=accounts | rare age by gender;
```

| gender | age
:--- | :--- |
| F  | 28
| M  | 32
| M  | 33

### Limitations

The `rare` command is not rewritten to OpenSearch DSL, it is only executed on the coordination node.

## top {#top-command}

Use the `top` command to find the most common values of all fields in the field list.

### Syntax

```sql
top [N] <field-list> [by-clause]
```

Field | Description | Default
:--- | :--- |:---
`N` | Specify the number of results to return. | 10
`field-list` | Specify a comma-delimited list of field names. | -
`by-clause` | Specify one or more fields to group the results by. | -

**Example 1: Find the most common values in a field**

To find the most common genders:

```sql
search source=accounts | top gender;
```

| gender
:--- |
| M
| F

**Example 2: Find the most common value in a field**

To find the most common gender:

```sql
search source=accounts | top 1 gender;
```

| gender
:--- |
| M

**Example 3: Find the most common values grouped by gender**

To find the most common age grouped by gender:

```sql
search source=accounts | top 1 age by gender;
```

| gender | age
:--- | :--- |
| F  | 28
| M  | 32

### Limitations

The `top` command is not rewritten to OpenSearch DSL, it is only executed on the coordination node.

## ad

The `ad` command applies the Random Cut Forest (RCF) algorithm in the [ML Commons plugin]({{site.url}}{{site.baseurl}}/ml-commons-plugin/index/) on the search result returned by a PPL command. Based on the input, the plugin uses two types of RCF algorithms: fixed in time RCF for processing time-series data and batch RCF for processing non-time-series data.

### Syntax: Fixed In Time RCF For Time-series Data Command

```sql
ad <shingle_size> <time_decay> <time_field>
```

Field | Description | Required
:--- | :--- |:---
`shingle_size` | A consecutive sequence of the most recent records. The default value is 8. | No
`time_decay` | Specifies how much of the recent past to consider when computing an anomaly score. The default value is 0.001. | No
`time_field` | Specifies the time filed for RCF to use as time-series data. Must be either a long value, such as the timestamp in miliseconds, or a string value in "yyyy-MM-dd HH:mm:ss".| Yes

### Syntax: Batch RCF for Non-time-series Data Command

```sql
ad <shingle_size> <time_decay>
```

Field | Description | Required
:--- | :--- |:---
`shingle_size` | A consecutive sequence of the most recent records. The default value is 8. | No
`time_decay` | Specifies how much of the recent past to consider when computing an anomaly score. The default value is 0.001. | No

**Example 1: Detecting events in New York City from taxi ridership data with time-series data**

The example trains a RCF model and use the model to detect anomalies in the time-series ridership data.

PPL query:

```sql
os> source=nyc_taxi | fields value, timestamp | AD time_field='timestamp' | where value=10844.0
```

value | timestamp | score | anomaly_grade
:--- | :--- |:--- | :---
10844.0 | 1404172800000 | 0.0 | 0.0    

**Example 2: Detecting events in New York City from taxi ridership data with non-time-series data**

PPL query:

```sql
os> source=nyc_taxi | fields value | AD | where value=10844.0
```

value | score | anomalous
:--- | :--- |:--- 
| 10844.0 | 0.0 | false  

## kmeans

The kmeans command applies the ML Commons plugin's kmeans algorithm to the provided PPL command's search results.

### Syntax

```sql
kmeans <cluster-number>
```

For `cluster-number`, enter the number of clusters you want to group your data points into.

**Example: Group Iris data**

The example shows how to classify three Iris species (Iris setosa, Iris virginica and Iris versicolor) based on the combination of four features measured from each sample: the length and the width of the sepals and petals.

PPL query:

```sql
os> source=iris_data | fields sepal_length_in_cm, sepal_width_in_cm, petal_length_in_cm, petal_width_in_cm | kmeans centroids=3
```

sepal_length_in_cm | sepal_width_in_cm | petal_length_in_cm | petal_width_in_cm | ClusterID
:--- | :--- |:--- | :--- | :--- 
| 5.1 | 3.5 | 1.4 | 0.2 | 1   
| 5.6 | 3.0 | 4.1 | 1.3 | 0
| 6.7 | 2.5 | 5.8 | 1.8 | 2

## join

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

You can combine two datasets using the `join` command. The left side can be an index or results from piped commands, while the right side can be either an index or a subquery.

### Syntax

```sql
[join-type] join [left-alias] [right-alias] on <join-criteria> <right-dataset>
* joinCriteria: mandatory. It could be any comparison expression.
* right-dataset: mandatory. Right dataset could be either an index or a subquery with/without alias.
```

Field | Description | Type | Required | Default
:--- |:--- | :--- | :--- | :---
`join-type` | The type of join to perform. Valid values are `inner`, `left`, `right`, `full`, `cross`, `semi`, and `anti`.  | `String` | No   | `inner`
`left-alias` | The subquery alias to use with the left join side in order to avoid ambiguous naming. Fixed pattern: `left = <left-alias>`    | `String` | No   | N/A
`right-alias` | The subquery alias to use with the right join side in order to avoid ambiguous naming. Fixed pattern: `right = <right-alias>` | `String` | No   | N/A
`join-criteria` | Any comparison expression.  | `String` | Yes  | N/A
`right-dataset` | Either an index or a subquery with/without an alias.  | `String` | Yes  | N/A

The following examples use the `state_country` and `occupation` indexes.

`state_country`:

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

`occupation`:

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

avg(salary) | age_span | b.country
:--- | :--- | :---
null | 40 | null
70000.0 | 30 | USA
100000.0 | 70 | England

### Limitations

The `join` command works only when `plugins.calcite.enabled` is set to `true`.

## lookup

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

The `lookup` command enriches your search data by adding or replacing data from a lookup index (dimension table). You can extend index fields with values from a dimension table or append/replace values when a lookup condition is matched. As an alternative to the `join` command, the `lookup` command is more suitable for enriching the source data with a static dataset.

### Syntax

```sql
lookup <lookup-index> (<lookup-mapping-field> [as <source-mapping-field>])... [(replace | append) (<input-field> [AS <output-field>])...]
```

Field | Description | Required | Default
:--- | :--- | :--- | :---
`lookup-index` | The name of lookup index (dimension table). | Yes | N/A
`lookup-mapping-field`| A mapping key in the `lookup-index`, analogous to a `join` key from the right table. You can specify multiple `lookup-mapping-field` values with commas. | Yes | N/A
`source-mapping-field`| A mapping key from the source (left side), analogous to a `join` key from the left side. | No | `lookup-mapping-field`
`replace` \| `append` | The output strategies. When specifying `replace`, matched values in the `lookup-index` field overwrite the values in the results. If you specify `append`, matched values in the `lookup-index` field only append to the missing values in the results. | No | `replace`
`input-field` | A field in `lookup-index` where matched values are applied to the result output. You can specify multiple `input-field` values with commas. If you don't specify any `input-field`, all fields except `lookup-mapping-field` from `lookup-index` are matched values that are applied to the result output. | No | N/A
`output-field` | A field of output. You can specify zero or multiple `output-field` values. If you specify `output-field` with an existing field name in the source query, its values will be replaced or appended by the matched values from `input-field`. If the field specified in `output-field` is a new field, an extended new field will be applied to the results. | No | `input-field`

The following examples use the `workers` and `work_information` indexes.

`workers`:

| ID | Name | Occupation | Country | Salary
:--- | :--- | :--- | :--- | :---
| 1000 | Jake | Engineer | England | 100000
| 1001 | Hello | Artist | USA | 70000
| 1002 | John | Doctor | Canada | 120000
| 1003 | David | Doctor | N/A | 120000
| 1004 | David | N/A | Canada | 0
| 1005 | Jane | Scientist | Canada | 90000

`work_information`:

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

id | name | occupation | country | salary | department
:--- | :--- |:-----------| :--- | :--- | :---
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

id | name | occupation | country | salary | new_occupation
:--- | :--- |:-----------| :--- | :--- | :---
1000 | Jake | Engineer | England | 100000 | Engineer
1001 | Hello | Artist | USA | 70000 | null
1002 | John | Doctor | Canada | 120000 | Scientist
1003 | David | Doctor | null | 120000 | Doctor
1004 | David | null | Canada | 0 | Doctor
1005 | Jane | Scientist | Canada | 90000 | Engineer

### Limitations

The `lookup` command works only when `plugins.calcite.enabled` is set to `true`.
