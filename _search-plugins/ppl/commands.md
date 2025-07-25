---
layout: default
title: Commands
parent: Piped processing language
nav_order: 4
canonical_url: https://docs.opensearch.org/latest/search-plugins/sql/sql/functions/
---


# Commands

Start a PPL query with a `search` command to reference a table to search from. You can have the commands that follow in any order.

In the following example, the `search` command refers to an `accounts` index as the source, then uses `fields` and `where` commands for the conditions:

```sql
search source=accounts
| where age > 18
| fields firstname, lastname
```

In the below examples, we represent required arguments in angle brackets `< >` and optional arguments in square brackets `[ ]`.
{: .note }

## search

Use the `search` command to retrieve a document from an index. You can only use the `search` command as the first command in the PPL query.

### Syntax

```sql
search source=<index> [boolean-expression]
```

Field | Description | Required
:--- | :--- |:---
`search` | Specify search keywords. | Yes
`index` | Specify which index to query from. | No
`bool-expression` | Specify an expression that evaluates to a boolean value. | No

*Example 1*: Get all documents

To get all documents from the `accounts` index:

```sql
search source=accounts;
```

| account_number | firstname | address | balance | gender | city | employer | state | age | email | lastname |
:--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---
| 1  | Amber  | 880 Holmes Lane | 39225 | M | Brogan | Pyrami | IL | 32 | amberduke@pyrami.com  | Duke       
| 6  | Hattie | 671 Bristol Street | 5686 | M | Dante | Netagy | TN | 36  | hattiebond@netagy.com | Bond
| 13 | Nanette | 789 Madison Street | 32838 | F | Nogal | Quility | VA | 28 | null | Bates
| 18 | Dale  | 467 Hutchinson Court | 4180 | M | Orick | null | MD | 33 | daleadams@boink.com | Adams

*Example 2*: Get documents that match a condition

To get all documents from the `accounts` index that have either `account_number` equal to 1 or have `gender` as `F`:

```sql
search source=accounts account_number=1 or gender=\"F\";
```

| account_number | firstname | address | balance | gender | city | employer | state | age | email | lastname |
:--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---
| 1 | Amber | 880 Holmes Lane | 39225 | M | Brogan | Pyrami | IL | 32 | amberduke@pyrami.com | Duke |
| 13 | Nanette | 789 Madison Street | 32838 | F | Nogal | Quility | VA | 28 | null | Bates |

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
`field-list` | Specify a comma-delimited field list. At least one field is required. | `string` or comma-separated list of strings | Yes | -

*Example 1*: Dedup by one field

To remove duplicate documents with the same gender:

```sql
search source=accounts | dedup gender | fields account_number, gender;
```

| account_number | gender  
:--- | :--- |
1 | M
13 | F


*Example 2*: Keep two duplicate documents

To keep two duplicate documents with the same gender:

```sql
search source=accounts | dedup 2 gender | fields account_number, gender;
```

| account_number | gender  
:--- | :--- |
1 | M
6 | M
13 | F

*Example 3*: Keep or ignore an empty field by default

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

*Example 4*: Dedup of consecutive documents

To remove duplicates of consecutive documents:

```sql
search source=accounts | dedup gender consecutive=true | fields account_number, gender;
```

| account_number | gender  
:--- | :--- |
1 | M
13 | F
18 | M

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

*Example 1*: Create a new field

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

*Example 3*: Create a new field with a field defined with the `eval` command

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

*Example 1*: Select specified fields from result

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

*Example 2*: Remove specified fields from a search result

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

*Example 1*: Rename one field

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

*Example 2*: Rename multiple fields

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

*Example 1*: Sort by one field

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

*Example 2*: Sort by one field and return all results

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

*Example 3*: Sort by one field in descending order

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

*Example 4*: Specify the number of sorted documents to return

To sort all documents by the `age` field in ascending order and specify count as 2 to get back two results:

```sql
search source=accounts | sort 2 age | fields account_number, age;
```

| account_number | age |
:--- | :--- |
| 13 | 28    
| 1  | 32    

*Example 5*: Sort by multiple fields

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

*Example 1*: Calculate the average value of a field

To calculate the average `age` of all documents:

```sql
search source=accounts | stats avg(age);
```

| avg(age)
:--- |
| 32.25

*Example 2*: Calculate the average value of a field by group

To calculate the average age grouped by gender:

```sql
search source=accounts | stats avg(age) by gender;
```

| gender | avg(age)
:--- | :--- |
| F  | 28.0         
| M  | 33.666666666666664

*Example 3*: Calculate the average and sum of a field by group

To calculate the average and sum of age grouped by gender:

```sql
search source=accounts | stats avg(age), sum(age) by gender;
```

| gender | avg(age) | sum(age)
:--- | :--- |
| F  | 28   | 28         
| M  | 33.666666666666664 | 101

*Example 4*: Calculate the maximum value of a field

To calculate the maximum age:

```sql
search source=accounts | stats max(age);
```

| max(age)
:--- |
| 36  

*Example 5*: Calculate the maximum and minimum value of a field by group

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

*Example 1*: Filter result set with a condition

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

*Example 1*: Get the first 10 results

To get the first 10 results:

```sql
search source=accounts | fields firstname, age | head;
```

| firstname | age
:--- | :--- |
| Amber  | 32
| Hattie | 36
| Nanette | 28

*Example 2*: Get the first N results

To get the first two results:

```sql
search source=accounts | fields firstname, age | head 2;
```

| firstname | age
:--- | :--- |
| Amber  | 32
| Hattie | 36

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

*Example 1*: Find the least common values in a field

To find the least common values of gender:

```sql
search source=accounts | rare gender;
```

| gender
:--- |
| F  
| M

*Example 2*: Find the least common values grouped by gender

To find the least common age grouped by gender:

```sql
search source=accounts | rare age by gender;
```

| gender | age
:--- | :--- |
| F  | 28  
| M  | 32
| M  | 33

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

*Example 1*: Find the most common values in a field

To find the most common genders:

```sql
search source=accounts | top gender;
```

| gender
:--- |
| M  
| F

*Example 2*: Find the most common value in a field

To find the most common gender:

```sql
search source=accounts | top 1 gender;
```

| gender
:--- |
| M          

*Example 2*: Find the most common values grouped by gender

To find the most common age grouped by gender:

```sql
search source=accounts | top 1 age by gender;
```

| gender | age
:--- | :--- |
| F  | 28  
| M  | 32
