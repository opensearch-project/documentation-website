---
layout: default
title: Functions
nav_order: 10
redirect_from:
  - /search-plugins/sql/functions/
---

# Functions

You must enable fielddata in the document mapping for most string functions to work properly.

The specification shows the return type of the function with a generic type `T` as the argument.
For example, `abs(number T) -> T` means that the function `abs` accepts a numerical argument of type `T`, which could be any subtype of the `number` type, and it returns the actual type of `T` as the return type.

The SQL plugin supports the following common functions shared across the SQL and PPL languages. Most functions work in both SQL (with `SELECT`) and PPL (with `source` and `eval`/`where`). Functions available only in SQL are marked with an asterisk (\*).

## Mathematical

| Function   | Specification                                                    | Example                                        |
|:-----------|:-----------------------------------------------------------------|:-----------------------------------------------|
| `abs`      | `abs(number T) -> T`                                             | `abs(0.5)`                              |
| `add`      | `add(number T, number T) -> T`                                   | `add(1, 5)`                             |
| `cbrt`     | `cbrt(number T) -> double`                                       | `cbrt(8)`                               |
| `ceil`     | `ceil(number T) -> T`                                            | `ceil(0.5)`                             |
| `conv`     | `conv(string T, integer, integer) -> string`                     | `conv('2C', 16, 10)`, `conv(1111, 2, 10)` |
| `crc32`    | `crc32(string) -> string`                                        | `crc32('MySQL')`                        |
| `divide`   | `divide(number T, number T) -> T`                                | `divide(1, 0.5)`                        |
| `e`        | `e() -> double`                                                  | `e()`                                   |
| `exp`      | `exp(number T) -> double`                                        | `exp(0.5)`                              |
| `expm1`    | `expm1(number T) -> double`                                      | `expm1(0.5)`                            |
| `floor`    | `floor(number T) -> long`                                        | `floor(0.5)`                            |
| `ln`       | `ln(number T) -> double`                                         | `ln(10)`                                |
| `log`      | `log(number T) -> double` or `log(number T, number T) -> double` | `log(10)`, `log(2, 16)`|
| `log2`     | `log2(number T) -> double`                                       | `log2(10)`                              |
| `log10`    | `log10(number T) -> double`                                      | `log10(100)`                       |
| `mod`      | `mod(number T, number T) -> T`                                   | `mod(10,4)`                             |
| `modulus`  | `modulus(number T, number T) -> T`                               | `modulus(2, 3)`                         |
| `multiply` | `multiply(number T, number T) -> T`                              | `multiply(2, 3)`                        |
| `pi`       | `pi() -> double`                                                 | `pi()`                                  |
| `pow`      | `pow(number T, number T) -> double`                              | `pow(2, 3)`                             |
| `power`    | `power(number T, number T) -> double`                            | `power(2, 3)`                           |
| `rand`     | `rand() -> float` or `rand(number T) -> float`                   | `rand()`, `rand(0.5)`            |
| `rint`     | `rint(number T) -> double`                                       | `rint(1.5)`                             |
| `round`    | `round(number T) -> T` or `round(number T, integer) -> T`        | `round(1.5)`, `round(1.175, 2)`  |
| `sign`     | `sign(number T) -> integer`                                      | `sign(1.5)`                             |
| `signum`   | `signum(number T) -> integer`                                    | `signum(0.5)`                           |
| `sqrt`     | `sqrt(number T) -> double`                                       | `sqrt(0.5)`                             |
| `strcmp`\* | `strcmp(string T, string T) -> integer`                          | `strcmp('hello', 'hello world')`        |
| `subtract` | `subtract(number T, number T) -> T`                              | `subtract(3, 2)`                        |
| `truncate` | `truncate(number T, number T) -> T`                              | `truncate(56.78, 1)`                    |
| `+`        | `number T + number T -> T`                                       | `1 + 5`                                 |
| `-`        | `number T - number T -> T`                                       | `3 - 2`                                 |
| `*`        | `number T * number T -> T`                                       | `2 * 3`                                 |
| `/`        | `number T / number T -> T`                                       | `1 / 0.5`                               |
| `%`        | `number T % number T -> T`                                       | `2 % 3`                                 |

## Trigonometric

| Function  | Specification                         | Example                |
|:----------|:--------------------------------------|:-----------------------|
| `acos`    | `acos(number T) -> double`            | `acos(0.5)`     |
| `asin`    | `asin(number T) -> double`            | `asin(0.5)`     |
| `atan`    | `atan(number T) -> double`            | `atan(0.5)`     |
| `atan2`   | `atan2(number T, number T) -> double` | `atan2(1, 0.5)` |
| `cos`     | `cos(number T) -> double`             | `cos(0.5)`      |
| `cosh`    | `cosh(number T) -> double`            | `cosh(0.5)`     |
| `cot`     | `cot(number T) -> double`             | `cot(0.5)`      |
| `degrees` | `degrees(number T) -> double`         | `degrees(0.5)`  |
| `radians` | `radians(number T) -> double`         | `radians(0.5)`  |
| `sin`     | `sin(number T) -> double`             | `sin(0.5)`      |
| `sinh`    | `sinh(number T) -> double`            | `sinh(0.5)`     |
| `tan`     | `tan(number T) -> double`             | `tan(0.5)`      |

## Date and time

| Function             | Specification                                                                          | Example                                                                             |
|:---------------------|:---------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------|
| `adddate`            | `adddate(date, INTERVAL expr unit) -> date`                                            | `adddate(date('2020-08-26'), INTERVAL 1 hour)`                               |
| `addtime`            | `addtime(date, date) -> date`                                                          | `addtime(date('2008-12-12'), date('2008-12-12'))`                            |
| `convert_tz`         | `convert_tz(date, string, string) -> date`                                             | `convert_tz('2008-12-25 05:30:00', '+00:00', 'America/Los_Angeles')`         |
| `curtime`            | `curtime() -> time`                                                                    | `curtime()`                                                                  |
| `curdate`            | `curdate() -> date`                                                                    | `curdate()`                                                                  |
| `current_date`       | `current_date() -> date`                                                               | `current_date()`                                                             |
| `current_time`       | `current_time() -> time`                                                               | `current_time()`                                                             |
| `current_timestamp`  | `current_timestamp() -> date`                                                          | `current_timestamp()`                                                        |
| `date`               | `date(date) -> date`                                                                   | `date('2000-01-02')`                                                         |
| `datediff`           | `datediff(date, date) -> integer`                                                      | `datediff(date('2000-01-02'), date('2000-01-01'))`                           |
| `datetime`           | `datetime(string) -> datetime`                                                         | `datetime('2008-12-25 00:00:00')`                                            |
| `date_add`           | `date_add(date, INTERVAL integer UNIT)`                                                | `date_add('2020-08-26', INTERVAL 1 HOUR)`                                    |
| `date_format`        | `date_format(date, string) -> string` or `date_format(date, string, string) -> string` | `date_format(date('2020-08-26'), 'Y')`                                       |
| `date_sub`           | `date_sub(date, INTERVAL expr unit) -> date`                                           | `date_sub(date('2008-01-02'), INTERVAL 31 day)`                              |
| `dayofmonth`         | `dayofmonth(date) -> integer`                                                          | `dayofmonth(date('2001-05-07'))`                                             |
| `day`                | `day(date) -> integer`                                                                 | `day(date('2020-08-25'))`                                                    |
| `dayname`            | `dayname(date) -> string`                                                              | `dayname(date('2020-08-26'))`                                                |
| `dayofmonth`         | `dayofmonth(date) -> integer`                                                          | `dayofmonth(date('2020-08-26'))`                                             |
| `dayofweek`          | `dayofweek(date) -> integer`                                                           | `dayofweek(date('2020-08-26'))`                                              |
| `dayofyear`          | `dayofyear(date) -> integer`                                                           | `dayofyear(date('2020-08-26'))`                                              |
| `dayofweek`          | `dayofweek(date) -> integer`                                                           | `dayofweek(date('2020-08-26'))`                                              |
| `day_of_month`       | `day_of_month(date) -> integer`                                                        | `day_of_month(date('2020-08-26'))`                                           |
| `day_of_week`        | `day_of_week(date) -> integer`                                                         | `day_of_week(date('2020-08-26'))`                                            |
| `day_of_year`        | `day_of_year(date) -> integer`                                                         | `day_of_year(date('2020-08-26'))`                                            |
| `extract`            | `extract(part FROM date) -> integer`                                                   | `extract(MONTH FROM datetime('2020-08-26 10:11:12'))`                        |
| `from_days`          | `from_days(N) -> integer`                                                              | `from_days(733687)`                                                          |
| `from_unixtime`      | `from_unixtime(N) -> date`                                                             | `from_unixtime(1220249547)`                                                  |
| `get_format`         | `get_format(PART, string) -> string`                                                   | `get_format(DATE, 'USA')`                                                    |
| `hour`               | `hour(time) -> integer`                                                                | `hour(time '01:02:03')`                                                      |
| `hour_of_day`        | `hour_of_day(time) -> integer`                                                         | `hour_of_day(time '01:02:03')`                                               |
| `last_day`           | `last_day(date) -> integer`                                                            | `last_day(date('2020-08-26'))`                                               |
| `localtime`          | `localtime() -> date`                                                                  | `localtime()`                                                                |
| `localtimestamp`     | `localtimestamp() -> date`                                                             | `localtimestamp()`                                                           |
| `makedate`           | `makedate(double, double) -> date`                                                     | `makedate(1945, 5.9)`                                                        |
| `maketime`           | `maketime(integer, integer, integer) -> date`                                          | `maketime(1, 2, 3)`                                                          |
| `microsecond`        | `microsecond(expr) -> integer`                                                         | `microsecond(time '01:02:03.123456')`                                        |
| `minute`             | `minute(expr) -> integer`                                                              | `minute(time '01:02:03')`                                                    |
| `minute_of_day`      | `minute_of_day(expr) -> integer`                                                       | `minute_of_day(time '01:02:03')`                                             |
| `minute_of_hour`     | `minute_of_hour(expr) -> integer`                                                      | `minute_of_hour(time '01:02:03')`                                            |
| `month`              | `month(date) -> integer`                                                               | `month(date('2020-08-26'))`                                                  |
| `month_of_year`      | `month_of_year(date) -> integer`                                                       | `month_of_year(date('2020-08-26'))`                                          |
| `monthname`          | `monthname(date) -> string`                                                            | `monthname(date('2020-08-26'))`                                              |
| `now`                | `now() -> date`                                                                        | `now()`                                                                      |
| `period_add`         | `period_add(integer, integer)`                                                         | `period_add(200801, 2)`                                                      |
| `period_diff`        | `period_diff(integer, integer)`                                                        | `period_diff(200802, 200703)`                                                |
| `quarter`            | `quarter(date) -> integer`                                                             | `quarter(date('2020-08-26'))`                                                |
| `second`             | `second(time) -> integer`                                                              | `second(time '01:02:03')`                                                    |
| `second_of_minute`   | `second_of_minute(time) -> integer`                                                    | `second_of_minute(time '01:02:03')`                                          |
| `sec_to_time`        | `sec_to_time(integer) -> date`                                                         | `sec_to_time(10000)`                                                         |
| `subdate`            | `subdate(date, INTERVAL expr unit) -> date, datetime`                                  | `subdate(date('2008-01-02'), INTERVAL 31 day)`                               |
| `subtime`            | `subtime(date, date) -> date`                                                          | `subtime(date('2008-12-12'), date('2008-11-15'))`                            |
| `str_to_date`        | `str_to_date(string, format) -> date`                                                  | `str_to_date("01,5,2013", "%d,%m,%Y")`                                       |
| `time`               | `time(expr) -> time`                                                                   | `time('13:49:00')`                                                           |
| `timediff`           | `timediff(time, time) -> time`                                                         | `timediff(time('23:59:59'), time('13:00:00'))`                               |
| `timestamp`          | `timestamp(date) -> date`                                                              | `timestamp('2001-05-07 00:00:00')`                                           |
| `timestampadd`       | `timestampadd(interval, integer, date) -> date)`                                       | `timestampadd(DAY, 17, datetime('2000-01-01 00:00:00'))`                     |
| `timestampdiff`      | `timestampdiff(interval, date, date) -> integer`                                       | `timestampdiff(YEAR, '1997-01-01 00:00:00', '2001-03-06 00:00:00')`          |
| `time_format`        | `time_format(date, string) -> string`                                                  | `time_format('1998-01-31 13:14:15.012345', '%f %H %h %I %i %p %r %S %s %T')` |
| `time_to_sec`        | `time_to_sec(time) -> long`                                                            | `time_to_sec(time '22:23:00')`                                               |
| `to_days`            | `to_days(date) -> long`                                                                | `to_days(date '2008-10-07')`                                                 |
| `to_seconds`         | `to_seconds(date) -> integer`                                                          | `to_seconds(date('2008-10-07'))`                                             |
| `unix_timestamp`     | `unix_timestamp(date) -> double`                                                       | `unix_timestamp(timestamp('1996-11-15 17:05:42'))`                           |
| `utc_date`           | `utc_date() -> date`                                                                   | `utc_date()`                                                                 |
| `utc_time`           | `utc_time() -> date`                                                                   | `utc_time()`                                                                 |
| `utc_timestamp`      | `utc_timestamp() -> date`                                                              | `utc_timestamp()`                                                            |
| `week`               | `week(date[mode])  -> integer`                                                         | `week(date('2008-02-20'))`                                                   |
| `weekofyear`         | `weekofyear(date[mode])  -> integer`                                                   | `weekofyear(date('2008-02-20'))`                                             |
| `week_of_year`       | `week_of_year(date[mode])  -> integer`                                                 | `week_of_year(date('2008-02-20'))`                                           |
| `year`               | `year(date) -> integer`                                                                | `year(date('2001-07-05'))`                                                   |
| `yearweek`           | `yearweek(date[mode])  -> integer`                                                     | `yearweek(date('2008-02-20'))`                                               |

## String

| Function    | Specification                                                                       | Example                                                        |
|:------------|:------------------------------------------------------------------------------------|:---------------------------------------------------------------|
| `ascii`\*   | `ascii(string) -> integer`                                                          | `ascii('h')`                                            |
| `concat`    | `concat(string, string) -> string`                                                  | `concat('hello', 'world')`                              |
| `concat_ws` | `concat_ws(separator, string, string…) -> string`                                   | `concat_ws(" ", "Hello", "World!")`                     |
| `left`\*    | `left(string, integer) -> string`                                                   | `left('hello', 2)`                                      |
| `length`    | `length(string) -> integer`                                                         | `length('hello')`                                       |
| `locate`    | `locate(string, string, integer) -> integer` or `locate(string, string) -> integer` | `locate('o', 'hello')`, `locate('l', 'hello world', 5)` |
| `replace`   | `replace(string, string, string) -> string`                                         | `replace('hello', 'l', 'x')`                            |
| `right`     | `right(string, integer) -> string`                                                  | `right('hello', 2)`                                     |
| `rtrim`     | `rtrim(string) -> string`                                                           | `rtrim('hello   ')`                                     |
| `substring` | `substring(string, integer, integer) -> string`                                     | `substring('hello', 2, 2)`                      |
| `trim`      | `trim(string) -> string`                                                            | `trim('   hello')`                                      |
| `upper`     | `upper(string) -> string`                                                           | `upper('hello world')`                                  |

## Aggregate

| Function | Specification            | Example                            |
|:---------|:-------------------------|:-----------------------------------|
| `avg`    | `avg(number T) -> T`     | `avg(column)` |
| `count`  | `count(number T) -> T`   | `count(date)` |
| `min`    | `min(number T) -> T`     | `min(column)` |
| `show`\* | `show(string) -> string` | `SHOW TABLES LIKE my-index`        |

## Advanced

| Function | Specification                              | Example                                 |
|:---------|:-------------------------------------------|:----------------------------------------|
| `if`     | `if(boolean, os_type, os_type) -> os_type` | `if(false, 0, 1)`, `if(true, 0, 1)` |
| `ifnull` | `ifnull(os_type, os_type) -> os_type`      | `ifnull(0, 1)`, `ifnull(null, 1)`  |
| `isnull` | `isnull(os_type) -> integer`               | `isnull(null)`, `isnull(1)`        |

## Relevance-based search (full-text search)

These functions are only available in the `WHERE` clause. For their descriptions and usage examples in SQL and PPL, see [Full-text search]({{site.url}}{{site.baseurl}}/search-plugins/sql/full-text/).
