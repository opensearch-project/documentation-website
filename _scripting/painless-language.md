---
layout: default
title: Painless language reference
parent: Painless scripting language
nav_order: 10
---

# Painless language reference

This page describes the syntax of Painless: its types, operators, statements, functions, and regular expressions. For the fields and variables that a particular script context supplies, see [Accessing document fields in scripts]({{site.url}}{{site.baseurl}}/scripting/accessing-fields/) and [Script contexts]({{site.url}}{{site.baseurl}}/scripting/script-contexts/).

To try any syntax on this page, use the [Execute Inline Script API]({{site.url}}{{site.baseurl}}/api-reference/script-apis/exec-script/), which runs a script and returns the result. Substitute any snippet from this page, or your own script, into the `source` field of the following request:

```json
POST _scripts/painless/_execute
{
  "script": {
    "source": "int a = 4; def b = 2.5; return a * b"
  }
}
```
{% include copy-curl.html %}

OpenSearch returns the script result, converted to a string:

```json
{
  "result": "10.0"
}
```

## Types

Painless is statically typed but lets you defer the choice of type. Declare a variable with a concrete type when you know it:

```js
int count = 42;
double price = 249.99;
boolean onSale = true;
String sku = "AUD-1001";
```

Declare it with `def` when the type varies. A field can hold a single value in one document and an array of values in another, and a `def` variable accepts either, so the script can test which one it received:

```js
def ratings = params.ratings;
return ratings instanceof List ? ratings.size() : 1;
```

A concrete type is checked when the script is compiled, whereas a `def` type is checked each time the script runs. Deferring the check costs a small amount of performance and turns a type mismatch into a runtime error, so declare a concrete type wherever the type is fixed. Declaring the preceding script's variable as `List` returns the ratings count for a document that has several ratings and fails at runtime for a document that has one, with `class java.lang.Integer cannot be cast to class java.util.List`.

The following table lists the primitive types and their `def`-compatible boxed equivalents.

Type | Description
:--- | :---
`byte`, `short`, `int`, `long` | Signed integers of increasing width. Arithmetic wraps on overflow rather than raising an error.
`float`, `double` | Floating-point numbers. A numeric literal with a decimal point is a `double`.
`boolean` | `true` or `false`.
`char` | A single UTF-16 code unit. There is no character literal, so cast from a single-character string: `(char) 'A'`.
`def` | A placeholder for any type, resolved at runtime.

Integer division truncates toward zero, and an operation that combines an integer with a floating-point value returns a floating-point result. The following table lists an example of each.

Expression | Result
:--- | :---
`7 / 2` | `3`
`7 / 2.0` | `3.5`

Integer arithmetic wraps silently on overflow, so `int i = 2147483647; return i + 1` returns `-2147483648`. Use `long` for values that can exceed the `int` range.
{: .warning}

## Casting

Casting a value to a numeric type that holds a wider range of values, such as an `int` to a `double`, happens automatically. Casting a value to a numeric type that holds a narrower range, such as a `double` to an `int`, must be written explicitly and truncates the value rather than rounding it:

```js
double d = 9.7;
return (int) d;  // 9
```

A `def` value is cast to its target type automatically, but the check happens at runtime rather than at compile time. Casting a `def` value to a type that holds a narrower range must still be written explicitly:

```js
def x = 41.7;
int y = (int) x;
return y;
```

Without the cast, `int y = x` compiles and then fails on the first document with `cannot implicitly cast def [double] to int`. This is the practical trade-off of `def`: the same assignment written with concrete types, `double d = 9.7; int i = d`, is rejected at compile time instead.

Test the runtime type of a `def` value by using `instanceof`:

```js
def x = new ArrayList();
return x instanceof List;  // true
```

## Operators

Painless supports the arithmetic, comparison, bitwise, and logical operators of Java, and adds two of its own. The following table lists the operators that are specific to Painless or that differ from Java.

Operator | Description
:--- | :---
`?:` | The null-coalescing, or Elvis, operator. `x ?: "fallback"` evaluates to `x` unless `x` is `null`.
`?.` | Null-safe member access. `m.a?.toString()` evaluates to `null` instead of raising an error when `m.a` is `null`.
`=~` | Tests whether a regular expression matches anywhere in a string. For an example, see [Regular expressions](#regular-expressions).
`==~` | Tests whether a regular expression matches an entire string. For an example, see [Regular expressions](#regular-expressions).

Combining `?.` with `?:` replaces the usual null check:

```js
def m = ["a": null];
return m.a?.toString() ?: "was null";  // was null
```

String concatenation with `+` converts the other operand automatically, so `"id-" + 42` returns `id-42`.

## Collections and arrays

Painless has literal syntax for lists and maps, so a script can build a structured value without naming a class. The following table lists both literal forms and the value that each one produces.

Expression | Result
:--- | :---
`[3, 1, 2]` | `[3, 1, 2]`
`["a": 1, "b": 2]` | `{a=1, b=2}`

An empty map literal is `[:]`, and an empty list literal is `[]`. A negative list index counts from the end, so `[10, 20, 30][-1]` is `30`.

Map entries are accessible through both dot and bracket notation. `params.a` and `params["b"]` are equivalent, and bracket notation is required when the key is not a valid identifier.

Arrays use Java syntax and carry a `length` property:

```js
int[] a = new int[3];
a[0] = 5;
return a[0] + a.length;  // 8
```

Multidimensional arrays work as in Java: `int[][] g = new int[2][2]`.

Iterate a map through its entry set:

```js
def m = ["b": 2, "a": 1];
def out = [];
for (def e : m.entrySet()) {
  out.add(e.getKey() + "=" + e.getValue());
}
return out;  // [a=1, b=2]
```

## Statements

Painless supports `if`/`else`, the ternary conditional, `for`, the enhanced `for`, `while`, `do`/`while`, `break`, `continue`, and `return`:

```js
int s = 0;
for (int i = 1; i <= 4; i++) {
  s += i;
}
return s;  // 10
```

```js
int s = 0;
for (int v : [2, 4, 6]) {
  s += v;
}
return s;  // 12
```

A script that does not end in an explicit `return` returns the value of its final expression, which is why a one-line script such as `doc['price'].value * 2` needs no `return`.

A `try`/`catch` block can catch only the exception types on the Painless allow list:

```js
int z = 0;
try {
  return 4 / z;
} catch (ArithmeticException e) {
  return "divide by zero";
}
```

The `throw` statement raises an exception, which a `catch` clause in the same script can handle:

```js
try {
  throw new IllegalArgumentException("bad sku");
} catch (IllegalArgumentException e) {
  return "caught: " + e.getMessage();
}
```

The `switch` statement, the labeled `break` statement, and the `finally` block are unavailable in Painless, and each one produces a compile error. Because a script cannot define a class, `new` cannot be applied to a user-defined type.
{: .note}

## Functions

Declare a function with an explicit return type and explicit parameter types:

```js
int sq(int n) {
  return n * n;
}
return sq(7);  // 49
```

All function declarations must precede the script's statements. A declaration that follows a statement fails to compile with `unexpected token ['('] was expecting one of [{<EOF>, ';'}]`, so `int a = 1; int sq(int n) { return n * n }` is invalid. The declarations can appear in any order, so a function can call another function that is declared after it.

Functions can be recursive, and they can be overloaded by a different number of parameters. Two functions that take the same number of parameters collide regardless of their types, failing with `invalid function definition: found duplicate function [f/1]`, because Painless keys a function by name and arity alone.

The following table lists examples of a recursive function and a pair of overloaded functions, with the result that each script returns.

Expression | Result
:--- | :---
`int f(int n) { return n <= 1 ? 1 : n * f(n-1) } return f(5)` | `120`
`int f(int n){return n} int f(int a,int b){return a+b} return f(1,2)` | `3`

A function body can read only its own parameters. It cannot read a variable declared in the script, and it cannot read `params`, so `int g() { return (int) params.n }` fails to compile with `cannot resolve symbol [params.n]`. Pass every value the function needs in as a parameter, as in `int g(int v) { return v } return g((int) params.n)`.

Because a declaration cannot follow a statement, a function that reads a script variable produces different errors depending on where you put it. `int g() { return x } int x = 5;` reports `cannot resolve symbol [x]`, whereas `int x = 5; int g() { return x }` reports `unexpected token ['('] was expecting one of [{<EOF>, ';'}]` and never reaches the variable at all.

## Lambdas and method references

A lambda supplies the body of a functional interface, which makes the Java collections and streams methods usable:

```js
def l = [3, 1, 2];
l.sort((a, b) -> a - b);
return l;  // [1, 2, 3]
```

```js
def l = [1, 2, 3, 4];
l.removeIf(x -> x % 2 == 0);
return l;  // [1, 3]
```

A method reference uses `::`:

```js
def l = ["b", "a"];
l.sort(String::compareTo);
return l;  // [a, b]
```

The Java streams methods are available, but `Stream` provides no `sum` method: calling it fails to compile with `member method [java.util.stream.Stream, sum/0] not found`. Convert the stream to a primitive stream first:

```js
return [1, 2, 3].stream().mapToInt(x -> x * 2).sum();  // 12
```

## Regular expressions

A regular expression literal is delimited by forward slashes, with flags after the closing slash. Use `=~` to search and `==~` to match the whole string. The following table lists an example of each operator.

Expression | Result
:--- | :---
`"AUD-1001" =~ /^AUD-/` | `true`
`"AUD-1001" ==~ /^[A-Z]{3}-\d{4}$/` | `true`

The two operators differ in whether the pattern must match the entire string. The following request applies both to the same value:

```json
POST _scripts/painless/_execute
{
  "script": {
    "source": "def found = params.sku =~ /\\d{4}/; def matched = params.sku ==~ /^[A-Z]{3}-\\d{4}$/; return \"found=\" + found + \" matched=\" + matched",
    "params": { "sku": "AUD-1001" }
  }
}
```
{% include copy-curl.html %}

Both operators report a match:

```json
{
  "result": "found=true matched=true"
}
```

Changing `sku` to `Refurbished AUD-1001 unit` returns `found=true matched=false`. The four digits are still present somewhere in the string, so `=~` matches, but the string as a whole is no longer a SKU, so `==~` does not.

For capture groups, build a `Matcher`:

```js
Matcher m = /(\w+)-(\d+)/.matcher("AUD-1001");
if (m.find()) {
  return m.group(2);  // 1001
}
return "no match";
```

Groups are addressable only by number. `m.group("name")` fails to compile with `Cannot cast from [java.lang.String] to [int]`, because the string overload of `group` is not allow listed, so named capture groups cannot be read.
{: .note}

Painless replaces the Java `replaceAll` and `replaceFirst` methods with its own versions, which take a pattern and a function instead of two strings. Supplying a function lets the replacement depend on what matched. The following table lists an example of each method.

Expression | Result
:--- | :---
`"AUD-1001".replaceAll(/\d/, m -> "#")` | `AUD-####`
`"a1b2".replaceFirst(/\d/, m -> "X")` | `aXb2`

Passing a plain string as the replacement fails with `Cannot cast from [java.lang.String] to [java.util.function.Function]`.

Regular expressions run under a complexity budget by default and can be disabled entirely. See [Controlling regular expressions]({{site.url}}{{site.baseurl}}/scripting/painless/#controlling-regular-expressions).

## Available libraries

Painless exposes a subset of the Java standard library. Commonly used classes include `String`, `StringBuilder`, `Math`, the boxed numeric types, `List`, `Map`, `Set`, `ArrayList`, `HashMap`, `HashSet`, the `java.time` classes, and `Matcher` and `Pattern`. For the complete set, see the [allow list definitions](https://github.com/opensearch-project/OpenSearch/tree/main/modules/lang-painless/src/main/resources/org/opensearch/painless/spi) in the OpenSearch repository, which list the fields, constructors, and methods that are callable on each permitted class. The following table lists examples of calls to allow listed classes.

Expression | Result
:--- | :---
`"  Aurora ".trim().toUpperCase()` | `AURORA`
`Math.round(Math.sqrt(50) * 100) / 100.0` | `7.07`
`ZonedDateTime.parse("2024-03-15T00:00:00Z").getDayOfWeek().toString()` | `FRIDAY`

Naming a class or calling a method or constructor that the allow list omits leads to a compile-time error, so such a script never runs against your data. The following table lists representative errors.

Attempt | Error
:--- | :---
`"x".getClass()` | `member method [java.lang.String, getClass/0] not found`
`new java.io.File("/etc/passwd")` | `Not a type [java.io.File].`
`new Thread()` | `Not a type [Thread].`

Reflection, class loading, file and network access, thread creation, and clock reads are all excluded. For the reasoning and for the settings that restrict scripting further, see [Script security]({{site.url}}{{site.baseurl}}/scripting/script-security/).

## Determining a value's type

When a script fails because a value is not the type you expected, wrap the value in `Debug.explain`. The script stops and OpenSearch reports the type in the error response. The following search inspects a date field from the `scripting-products` index, which is created in [Test setup]({{site.url}}{{site.baseurl}}/scripting/using-scripts/#test-setup):

```json
GET scripting-products/_search
{
  "_source": false,
  "query": { "term": { "sku": "AUD-1001" } },
  "script_fields": {
    "inspect": {
      "script": { "source": "Debug.explain(doc['release_date'].value)" }
    }
  }
}
```
{% include copy-curl.html %}

The `painless_class`, `java_class`, and `to_string` fields identify the value:

<details open markdown="block">
<summary>
  Response
</summary>

```json
{
  "error": {
    "root_cause": [
      {
        "type": "script_exception",
        "reason": "runtime error",
        "painless_class": "java.time.ZonedDateTime",
        "to_string": "2024-03-15T00:00Z",
        "java_class": "java.time.ZonedDateTime",
        "script_stack": [
          "Debug.explain(doc['release_date'].value)",
          "                                 ^---- HERE"
        ],
        "script": "Debug.explain(doc['release_date'].value)",
        "lang": "painless",
        "position": {
          "offset": 33,
          "start": 0,
          "end": 40
        }
      }
    ],
    "type": "search_phase_execution_exception",
    "reason": "all shards failed",
    "phase": "query",
    "grouped": true
  },
  "status": 400
}
```
</details>

`Debug.explain` always fails the request, so remove it once you have the answer.

## Example

The following script combines a user-defined function, a regular expression with a capture group, a map, and a loop to classify a list of products:

```json
POST _scripts/painless/_execute
{
  "script": {
    "source": "String tier(double p) { if (p >= 500) return 'premium'; else if (p >= 100) return 'standard'; return 'budget' } def out = [:]; for (int i = 0; i < params.items.length; i++) { def it = params.items[i]; Matcher m = /^([A-Z]{3})-/.matcher(it.sku); String dept = m.find() ? m.group(1) : 'UNK'; out[it.sku] = dept + ':' + tier(it.price) } return out",
    "params": {
      "items": [
        { "sku": "AUD-1001", "price": 249.99 },
        { "sku": "DSP-3001", "price": 599.0 },
        { "sku": "x", "price": 12.5 }
      ]
    }
  }
}
```
{% include copy-curl.html %}

Each product is labeled with its department prefix and price tier:

```json
{
  "result": "{DSP-3001=DSP:premium, AUD-1001=AUD:standard, x=UNK:budget}"
}
```

Single quotes are string delimiters in Painless, the same as double quotes. Using them inside a JSON request body avoids escaping every quote in the script.
{: .tip}

## Related documentation

- [Script contexts]({{site.url}}{{site.baseurl}}/scripting/script-contexts/)
- [Script security]({{site.url}}{{site.baseurl}}/scripting/script-security/)
