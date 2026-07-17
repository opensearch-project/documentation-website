---
layout: default
title: Mathematical functions
parent: Functions
grand_parent: PPL
nav_order: 10
---

# Mathematical functions

The following mathematical functions are supported in PPL.

## ABS

**Usage**: `ABS(x)`

Calculates the absolute value of `x`.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` (same type as input)

### Example
  
```sql
source=people
| eval `ABS(-1)` = ABS(-1)
| fields `ABS(-1)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| ABS(-1) |
| --- |
| 1 |

<!-- vale on -->
  
## ADD

**Usage**: `ADD(x, y)`

Calculates the sum of `x` and `y`.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.
- `y` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: The wider numeric type between `x` and `y`

**Synonyms**: Addition Symbol (`+`)

### Example
  
```sql
source=people
| eval `ADD(2, 1)` = ADD(2, 1)
| fields `ADD(2, 1)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| ADD(2, 1) |
| --- |
| 3 |

<!-- vale on -->
  
## SUBTRACT

**Usage**: `SUBTRACT(x, y)`

Calculates `x` minus `y`.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.
- `y` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: The wider numeric type between `x` and `y`

**Synonyms**: Subtraction Symbol (`-`)

### Example
  
```sql
source=people
| eval `SUBTRACT(2, 1)` = SUBTRACT(2, 1)
| fields `SUBTRACT(2, 1)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| SUBTRACT(2, 1) |
| --- |
| 1 |

<!-- vale on -->
  
## MULTIPLY

**Usage**: `MULTIPLY(x, y)`

Calculates the product of `x` and `y`.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.
- `y` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: The wider numeric type between `x` and `y`

**Synonyms**: Multiplication Symbol (`*`)

### Example
  
```sql
source=people
| eval `MULTIPLY(2, 1)` = MULTIPLY(2, 1)
| fields `MULTIPLY(2, 1)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| MULTIPLY(2, 1) |
| --- |
| 2 |

<!-- vale on -->
  
## DIVIDE

**Usage**: `DIVIDE(x, y)`

Calculates `x` divided by `y`.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.
- `y` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: The wider numeric type between `x` and `y`

**Synonyms**: Division Symbol (`/`)

### Example
  
```sql
source=people
| eval `DIVIDE(2, 1)` = DIVIDE(2, 1)
| fields `DIVIDE(2, 1)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| DIVIDE(2, 1) |
| --- |
| 2 |

<!-- vale on -->
  
## SUM

**Usage**: `SUM(x, y, ...)`

Calculates the sum of all provided arguments. This function accepts a variable number of arguments.

This function is only available in the `eval` command context and is rewritten to arithmetic addition during query parsing.
{: .note}

**Parameters**:

- `x, y, ...` (Required): Variable number of `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` arguments.

**Return type**: The widest numeric type among all arguments

### Example
  
```sql
source=accounts
| eval `SUM(1, 2, 3)` = SUM(1, 2, 3)
| fields `SUM(1, 2, 3)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| SUM(1, 2, 3) |
| --- |
| 6 |
| 6 |
| 6 |
| 6 |

<!-- vale on -->
  
```sql
source=accounts
| eval total = SUM(age, 10, 5)
| fields age, total
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| age | total |
| --- | --- |
| 32 | 47 |
| 36 | 51 |
| 28 | 43 |
| 33 | 48 |

<!-- vale on -->
  
## AVG

**Usage**: `AVG(x, y, ...)`

Calculates the average (arithmetic mean) of all provided arguments. This function accepts a variable number of arguments.

This function is only available in the `eval` command context and is rewritten to an arithmetic expression (sum or count) during query parsing.
{: .note}

**Parameters**:

- `x, y, ...` (Required): Variable number of `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` arguments.

**Return type**: `DOUBLE`

### Example
  
```sql
source=accounts
| eval `AVG(1, 2, 3)` = AVG(1, 2, 3)
| fields `AVG(1, 2, 3)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| AVG(1, 2, 3) |
| --- |
| 2.0 |
| 2.0 |
| 2.0 |
| 2.0 |

<!-- vale on -->
  
```sql
source=accounts
| eval average = AVG(age, 30)
| fields age, average
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| age | average |
| --- | --- |
| 32 | 31.0 |
| 36 | 33.0 |
| 28 | 29.0 |
| 33 | 31.5 |

<!-- vale on -->
  
## ACOS

**Usage**: `ACOS(x)`

Calculates the arccosine of `x`. Returns `NULL` if `x` is not in the `[-1, 1]` range.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `ACOS(0)` = ACOS(0)
| fields `ACOS(0)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| ACOS(0) |
| --- |
| 1.5707963267948966 |

<!-- vale on -->
  
## ASIN

**Usage**: `ASIN(x)`

Calculates the arcsine of `x`. Returns `NULL` if `x` is not in the `[-1, 1]` range.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `ASIN(0)` = ASIN(0)
| fields `ASIN(0)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| ASIN(0) |
| --- |
| 0.0 |

<!-- vale on -->
  
## ATAN

**Usage**: `ATAN(x)`, `ATAN(y, x)`

Calculates the arctangent of `x`. `ATAN(y, x)` calculates the arctangent of the quotient `y / x`, using the signs of both arguments to determine the quadrant of the result.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.
- `y` (Optional): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value (when using two-argument form).

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `ATAN(2)` = ATAN(2), `ATAN(2, 3)` = ATAN(2, 3)
| fields `ATAN(2)`, `ATAN(2, 3)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| ATAN(2) | ATAN(2, 3) |
| --- | --- |
| 1.1071487177940904 | 0.5880026035475675 |

<!-- vale on -->
  
## ATAN2

**Usage**: `ATAN2(y, x)`

Calculates the arctangent of the quotient `y / x`, using the signs of both arguments to determine the quadrant of the result.

**Parameters**:

- `y` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.
- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `ATAN2(2, 3)` = ATAN2(2, 3)
| fields `ATAN2(2, 3)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| ATAN2(2, 3) |
| --- |
| 0.5880026035475675 |

<!-- vale on -->
  
## CEIL

**Usage**: `CEIL(x)`

Returns the ceiling of the value `x`.

An alias for [CEILING](#ceiling) function.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: Same type as input

## CEILING

**Usage**: `CEILING(x)`

Returns the ceiling of the value `x`.

The [`CEIL`](#ceil) and `CEILING` functions have the same implementation and functionality.
{: .note}

Limitation: `CEILING` only works as expected when the IEEE 754 double type displays a decimal when stored.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: Same type as input

### Example
  
```sql
source=people
| eval `CEILING(0)` = CEILING(0), `CEILING(50.00005)` = CEILING(50.00005), `CEILING(-50.00005)` = CEILING(-50.00005)
| fields `CEILING(0)`, `CEILING(50.00005)`, `CEILING(-50.00005)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| CEILING(0) | CEILING(50.00005) | CEILING(-50.00005) |
| --- | --- | --- |
| 0 | 51.0 | -50.0 |

<!-- vale on -->
  
```sql
source=people
| eval `CEILING(3147483647.12345)` = CEILING(3147483647.12345), `CEILING(113147483647.12345)` = CEILING(113147483647.12345), `CEILING(3147483647.00001)` = CEILING(3147483647.00001)
| fields `CEILING(3147483647.12345)`, `CEILING(113147483647.12345)`, `CEILING(3147483647.00001)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| CEILING(3147483647.12345) | CEILING(113147483647.12345) | CEILING(3147483647.00001) |
| --- | --- | --- |
| 3147483648.0 | 113147483648.0 | 3147483648.0 |

<!-- vale on -->
  
## CONV

**Usage**: `CONV(x, a, b)`

Converts the number `x` from base `a` to base `b`.

**Parameters**:

- `x` (Required): A `STRING` value.
- `a` (Required): An `INTEGER` value.
- `b` (Required): An `INTEGER` value.

**Return type**: `STRING`

### Example
  
```sql
source=people
| eval `CONV('12', 10, 16)` = CONV('12', 10, 16), `CONV('2C', 16, 10)` = CONV('2C', 16, 10), `CONV(12, 10, 2)` = CONV(12, 10, 2), `CONV(1111, 2, 10)` = CONV(1111, 2, 10)
| fields `CONV('12', 10, 16)`, `CONV('2C', 16, 10)`, `CONV(12, 10, 2)`, `CONV(1111, 2, 10)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| CONV('12', 10, 16) | CONV('2C', 16, 10) | CONV(12, 10, 2) | CONV(1111, 2, 10) |
| --- | --- | --- | --- |
| c | 44 | 1100 | 15 |

<!-- vale on -->
  
## COS

**Usage**: `COS(x)`

Calculates the cosine of `x`, where `x` is given in radians.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `COS(0)` = COS(0)
| fields `COS(0)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| COS(0) |
| --- |
| 1.0 |

<!-- vale on -->
  
## COSH

**Usage**: `COSH(x)`

Calculates the hyperbolic cosine of `x`, defined as (((e^x) + (e^(-x))) / 2).

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `COSH(2)` = COSH(2)
| fields `COSH(2)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| COSH(2) |
| --- |
| 3.7621956910836314 |

<!-- vale on -->
  
## COT

**Usage**: `COT(x)`

Calculates the cotangent of `x`. Returns an error if `x` equals 0.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `COT(1)` = COT(1)
| fields `COT(1)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| COT(1) |
| --- |
| 0.6420926159343306 |

<!-- vale on -->
  
## CRC32

**Usage**: `CRC32(expr)`

Calculates a cyclic redundancy check value and returns a 32-bit unsigned value.

**Parameters**:

- `expr` (Required): A `STRING` value.

**Return type**: `LONG`

### Example
  
```sql
source=people
| eval `CRC32('MySQL')` = CRC32('MySQL')
| fields `CRC32('MySQL')`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| CRC32('MySQL') |
| --- |
| 3259397556 |

<!-- vale on -->
  
## DEGREES

**Usage**: `DEGREES(x)`

Converts `x` from radians to degrees.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `DEGREES(1.57)` = DEGREES(1.57)
| fields `DEGREES(1.57)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| DEGREES(1.57) |
| --- |
| 89.95437383553924 |

<!-- vale on -->
  
## E

**Usage**: `E()`

Returns Euler's number (e ≈ 2.718281828459045).

**Parameters**: None

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `E()` = E()
| fields `E()`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| E() |
| --- |
| 2.718281828459045 |

<!-- vale on -->
  
## EXP

**Usage**: `EXP(x)`

Returns e raised to the power of `x`.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `EXP(2)` = EXP(2)
| fields `EXP(2)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| EXP(2) |
| --- |
| 7.38905609893065 |

<!-- vale on -->
  
## EXPM1

**Usage**: `EXPM1(x)`

Returns e^x - 1 (exponential of `x` minus 1).

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `EXPM1(1)` = EXPM1(1)
| fields `EXPM1(1)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| EXPM1(1) |
| --- |
| 1.718281828459045 |

<!-- vale on -->
  
## FLOOR

**Usage**: `FLOOR(x)`

Returns the floor of the value `x`.

Limitation: `FLOOR` only works as expected when the IEEE 754 double type displays a decimal when stored.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: Same type as input

### Example
  
```sql
source=people
| eval `FLOOR(0)` = FLOOR(0), `FLOOR(50.00005)` = FLOOR(50.00005), `FLOOR(-50.00005)` = FLOOR(-50.00005)
| fields `FLOOR(0)`, `FLOOR(50.00005)`, `FLOOR(-50.00005)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| FLOOR(0) | FLOOR(50.00005) | FLOOR(-50.00005) |
| --- | --- | --- |
| 0 | 50.0 | -51.0 |

<!-- vale on -->
  
```sql
source=people
| eval `FLOOR(3147483647.12345)` = FLOOR(3147483647.12345), `FLOOR(113147483647.12345)` = FLOOR(113147483647.12345), `FLOOR(3147483647.00001)` = FLOOR(3147483647.00001)
| fields `FLOOR(3147483647.12345)`, `FLOOR(113147483647.12345)`, `FLOOR(3147483647.00001)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| FLOOR(3147483647.12345) | FLOOR(113147483647.12345) | FLOOR(3147483647.00001) |
| --- | --- | --- |
| 3147483647.0 | 113147483647.0 | 3147483647.0 |

<!-- vale on -->
  
```sql
source=people
| eval `FLOOR(282474973688888.022)` = FLOOR(282474973688888.022), `FLOOR(9223372036854775807.022)` = FLOOR(9223372036854775807.022), `FLOOR(9223372036854775807.0000001)` = FLOOR(9223372036854775807.0000001)
| fields `FLOOR(282474973688888.022)`, `FLOOR(9223372036854775807.022)`, `FLOOR(9223372036854775807.0000001)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| FLOOR(282474973688888.022) | FLOOR(9223372036854775807.022) | FLOOR(9223372036854775807.0000001) |
| --- | --- | --- |
| 282474973688888.0 | 9.223372036854776e+18 | 9.223372036854776e+18 |

<!-- vale on -->
  
## LN

**Usage**: `LN(x)`

Returns the natural logarithm of `x`.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `LN(2)` = LN(2)
| fields `LN(2)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| LN(2) |
| --- |
| 0.6931471805599453 |

<!-- vale on -->
  
## LOG

**Usage**: `LOG(x)`, `LOG(B, x)`

Returns the natural logarithm of `x` (base e logarithm). `LOG(B, x)` is equivalent to log(x)/log(B).

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.
- `B` (Optional): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value (when using two-argument form).

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `LOG(2)` = LOG(2), `LOG(2, 8)` = LOG(2, 8)
| fields `LOG(2)`, `LOG(2, 8)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| LOG(2) | LOG(2, 8) |
| --- | --- |
| 0.6931471805599453 | 3.0 |

<!-- vale on -->
  
## LOG2

**Usage**: `LOG2(x)`

Returns the base-2 logarithm of `x`. Equivalent to log(x)/log(2).

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `LOG2(8)` = LOG2(8)
| fields `LOG2(8)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| LOG2(8) |
| --- |
| 3.0 |

<!-- vale on -->
  
## LOG10

**Usage**: `LOG10(x)`

Returns the base-10 logarithm of `x`. Equivalent to log(x)/log(10).

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `LOG10(100)` = LOG10(100)
| fields `LOG10(100)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| LOG10(100) |
| --- |
| 2.0 |

<!-- vale on -->
  
## MOD

**Usage**: `MOD(n, m)`

Calculates the remainder of the number `n` divided by `m`.

**Parameters**:

- `n` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.
- `m` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: The wider type between `n` and `m` if `m` is nonzero value. If `m` equals `0`, then returns `NULL`.

### Example
  
```sql
source=people
| eval `MOD(3, 2)` = MOD(3, 2), `MOD(3.1, 2)` = MOD(3.1, 2)
| fields `MOD(3, 2)`, `MOD(3.1, 2)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| MOD(3, 2) | MOD(3.1, 2) |
| --- | --- |
| 1 | 1.1 |

<!-- vale on -->
  
## MODULUS

**Usage**: `MODULUS(n, m)`

Calculates the remainder of the number `n` divided by `m`.

**Parameters**:

- `n` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.
- `m` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: The wider type between `n` and `m` if `m` is nonzero value. If `m` equals `0`, then returns `NULL`.

### Example
  
```sql
source=people
| eval `MODULUS(3, 2)` = MODULUS(3, 2), `MODULUS(3.1, 2)` = MODULUS(3.1, 2)
| fields `MODULUS(3, 2)`, `MODULUS(3.1, 2)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| MODULUS(3, 2) | MODULUS(3.1, 2) |
| --- | --- |
| 1 | 1.1 |

<!-- vale on -->
  
## PI

**Usage**: `PI()`

Returns the mathematical constant π (pi ≈ 3.141592653589793).

**Parameters**: None

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `PI()` = PI()
| fields `PI()`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| PI() |
| --- |
| 3.141592653589793 |

<!-- vale on -->
  
## POW

**Usage**: `POW(x, y)`

Calculates the value of `x` raised to the power of `y`. Invalid inputs return `NULL`.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.
- `y` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `DOUBLE`

**Synonyms**: [POWER](#power)

### Example
  
```sql
source=people
| eval `POW(3, 2)` = POW(3, 2), `POW(-3, 2)` = POW(-3, 2), `POW(3, -2)` = POW(3, -2)
| fields `POW(3, 2)`, `POW(-3, 2)`, `POW(3, -2)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| POW(3, 2) | POW(-3, 2) | POW(3, -2) |
| --- | --- | --- |
| 9.0 | 9.0 | 0.1111111111111111 |

<!-- vale on -->
  
## POWER

**Usage**: `POWER(x, y)`

Calculates the value of `x` raised to the power of `y`. Invalid inputs return `NULL`.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.
- `y` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `DOUBLE`

**Synonyms**: [POW](#pow)

### Example
  
```sql
source=people
| eval `POWER(3, 2)` = POWER(3, 2), `POWER(-3, 2)` = POWER(-3, 2), `POWER(3, -2)` = POWER(3, -2)
| fields `POWER(3, 2)`, `POWER(-3, 2)`, `POWER(3, -2)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| POWER(3, 2) | POWER(-3, 2) | POWER(3, -2) |
| --- | --- | --- |
| 9.0 | 9.0 | 0.1111111111111111 |

<!-- vale on -->
  
## RADIANS

**Usage**: `RADIANS(x)`

Converts x from degrees to radians.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `RADIANS(90)` = RADIANS(90)
| fields `RADIANS(90)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| RADIANS(90) |
| --- |
| 1.5707963267948966 |

<!-- vale on -->
  
## RAND

**Usage**: `RAND()`, `RAND(N)`

Returns a random floating-point value in the `[0, 1)` range. If an integer `N` is specified, the seed is initialized prior to execution. As a result, calling `RAND(N)` with the same value of `N` always returns the same result, producing a repeatable sequence of column values.

**Parameters**:

- `N` (Optional): An `INTEGER` value.

**Return type**: `FLOAT`

### Example
  
```sql
source=people
| eval `RAND(3)` = RAND(3)
| fields `RAND(3)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| RAND(3) |
| --- |
| 0.34346429521113886 |

<!-- vale on -->
  
## ROUND

**Usage**: `ROUND(x, d)`

Rounds the argument `x` to `d` decimal places. `d` defaults to `0`.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.
- `d` (Optional): An `INTEGER` value.

**Return type**:
- `(INTEGER/LONG [,INTEGER])` -> `LONG`.
- `(FLOAT/DOUBLE [,INTEGER])` -> `LONG`.

### Example
  
```sql
source=people
| eval `ROUND(12.34)` = ROUND(12.34), `ROUND(12.34, 1)` = ROUND(12.34, 1), `ROUND(12.34, -1)` = ROUND(12.34, -1), `ROUND(12, 1)` = ROUND(12, 1)
| fields `ROUND(12.34)`, `ROUND(12.34, 1)`, `ROUND(12.34, -1)`, `ROUND(12, 1)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| ROUND(12.34) | ROUND(12.34, 1) | ROUND(12.34, -1) | ROUND(12, 1) |
| --- | --- | --- | --- |
| 12.0 | 12.3 | 10.0 | 12 |

<!-- vale on -->
  
## SIGN

**Usage**: `SIGN(x)`

Returns the sign of the argument as `-1`, `0`, or `1`, depending on whether the number is negative, zero, or positive.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: Same type as input

### Example
  
```sql
source=people
| eval `SIGN(1)` = SIGN(1), `SIGN(0)` = SIGN(0), `SIGN(-1.1)` = SIGN(-1.1)
| fields `SIGN(1)`, `SIGN(0)`, `SIGN(-1.1)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| SIGN(1) | SIGN(0) | SIGN(-1.1) |
| --- | --- | --- |
| 1 | 0 | -1.0 |

<!-- vale on -->
  
## SIGNUM

**Usage**: `SIGNUM(x)`

Returns the sign of the argument as `-1`, `0`, or `1`, depending on whether the number is negative, zero, or positive.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `INTEGER`

**Synonyms**: `SIGN`

### Example
  
```sql
source=people
| eval `SIGNUM(1)` = SIGNUM(1), `SIGNUM(0)` = SIGNUM(0), `SIGNUM(-1.1)` = SIGNUM(-1.1)
| fields `SIGNUM(1)`, `SIGNUM(0)`, `SIGNUM(-1.1)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| SIGNUM(1) | SIGNUM(0) | SIGNUM(-1.1) |
| --- | --- | --- |
| 1 | 0 | -1.0 |

<!-- vale on -->
  
## SIN

**Usage**: `SIN(x)`

Calculates the sine of `x`, where `x` is given in radians.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `SIN(0)` = SIN(0)
| fields `SIN(0)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| SIN(0) |
| --- |
| 0.0 |

<!-- vale on -->
  
## SINH

**Usage**: `SINH(x)`

Calculates the hyperbolic sine of `x`, defined as (((e^x) - (e^(-x))) / 2).

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `SINH(2)` = SINH(2)
| fields `SINH(2)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| SINH(2) |
| --- |
| 3.626860407847019 |

<!-- vale on -->
  
## SQRT

**Usage**: `SQRT(x)`

Calculates the square root of a non-negative number `x`.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**:
- `(Non-negative) INTEGER/LONG/FLOAT/DOUBLE` -> `DOUBLE`.
- `(Negative) INTEGER/LONG/FLOAT/DOUBLE` -> `NULL`.

### Example
  
```sql
source=people
| eval `SQRT(4)` = SQRT(4), `SQRT(4.41)` = SQRT(4.41)
| fields `SQRT(4)`, `SQRT(4.41)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| SQRT(4) | SQRT(4.41) |
| --- | --- |
| 2.0 | 2.1 |

<!-- vale on -->
  
## CBRT

**Usage**: `CBRT(x)`

Calculates the cube root of a number `x`.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `DOUBLE`

### Example
  
```sql
source=location
| eval `CBRT(8)` = CBRT(8), `CBRT(9.261)` = CBRT(9.261), `CBRT(-27)` = CBRT(-27)
| fields `CBRT(8)`, `CBRT(9.261)`, `CBRT(-27)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| CBRT(8) | CBRT(9.261) | CBRT(-27) |
| --- | --- | --- |
| 2.0 | 2.1 | -3.0 |
| 2.0 | 2.1 | -3.0 |

<!-- vale on -->
  
## RINT

**Usage**: `RINT(x)`

Returns `x` rounded to the nearest integer.

**Parameters**:

- `x` (Required): An `INTEGER`, `LONG`, `FLOAT`, or `DOUBLE` value.

**Return type**: `DOUBLE`

### Example
  
```sql
source=people
| eval `RINT(1.7)` = RINT(1.7)
| fields `RINT(1.7)`
```
{% include copy.html %}
  
The query returns the following results:
  
<!-- vale off -->

| RINT(1.7) |
| --- |
| 2.0 |

<!-- vale on -->
