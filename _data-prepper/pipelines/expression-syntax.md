---
layout: default
title: Expression syntax
parent: Pipelines
nav_order: 5
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/expression-syntax/
---

# Expression syntax  

Expressions provide flexibility in manipulating, filtering, and routing data. The following sections provide information about expression syntax in OpenSearch Data Prepper.

## Key terms

The following key terms are used in the context of expressions.

Term | Definition
-----|-----------
**Expression** | A generic component that contains a primary or an operator. Expressions can be nested within other expressions. An expression's imminent children can contain 0–1 operators.
**Expression string** | The highest priority in a Data Prepper expression and supports only one expression string resulting in a return value. An expression string is not the same as an expression.
**Literal** | A fundamental value that has no children. A literal can be one of the following: float, integer, Boolean, JSON pointer, string, or null. See [Literals](#literals).
**Operator** | A hardcoded token that identifies the operation used in an expression.
**Primary** | Can be one of the following: set initializer, priority expression, or literal.
**Statement** | The highest-priority component within an expression string.

## Operators

The following table lists the supported operators. Operators are listed in order of precedence (top to bottom, left to right).

| Operator             | Description                                           | Associativity |
|----------------------|-------------------------------------------------------|---------------|
| `()`                 | Priority expression                                   | Left to right |
| `not`<br> `+`<br>  `-`| Unary logical NOT<br>Unary positive<br>Unary negative | Right to left |
| `*`, `/`             | Multiplication and division operators                 | Left to right |
| `+`, `-`             | Addition and subtraction operators                    | Left to right |
| `+`                  | String concatenation operator                         | Left to right |
| `<`, `<=`, `>`, `>=` | Relational operators                                  | Left to right |
| `==`, `!=`           | Equality operators                                    | Left to right |
| `and`, `or`          | Conditional expression                                | Left to right |

### Relational operators

Relational operators compare numeric values or JSON pointers that resolve to numeric values. The operators are used to test the relationship between two operands, determining if one is greater than, less than, or equal to the other. The syntax for using relational operators is as follows:

```
<Number | JSON Pointer> < <Number | JSON Pointer>
<Number | JSON Pointer> <= <Number | JSON Pointer>
<Number | JSON Pointer> > <Number | JSON Pointer>
<Number | JSON Pointer> >= <Number | JSON Pointer>
```
{% include copy.html %}

For example, to check if the value of the `status_code` field in an event is within the range of successful HTTP responses (200--299), you can use the following expression:

```
/status_code >= 200 and /status_code < 300
```
{% include copy.html %}

### Equality operators

Equality operators are used to test whether two values are equivalent. These operators compare values of any type, including JSON pointers, literals, and expressions. The syntax for using equality operators is as follows: 

```
<Any> == <Any>
<Any> != <Any>
```
{% include copy.html %}

The following are some example equality operators:

- `/is_cool == true`: Checks if the value referenced by the JSON pointer is equal to the Boolean value.
- `3.14 != /status_code`: Checks if the numeric value is not equal to the value referenced by the JSON pointer.
- `{1, 2} == /event/set_property`: Checks if the array is equal to the value referenced by the JSON pointer. 

### Conditional expressions

Conditional expressions allow you to combine multiple expressions or values using logical operators to create more complex evaluation criteria. The available conditional operators are `and`, `or`, and `not`. The syntax for using these conditional operators is as follows:

```
<Any> and <Any>
<Any> or <Any>
not <Any>
```

The following are some example conditional expressions: 

```
/status_code == 200 and /message == "Hello world"
/status_code == 200 or /status_code == 202
not /status_code in {200, 202}
/response == null
/response != null
```
{% include copy.html %}

### Arithmetic expressions

Arithmetic expressions enable basic mathematical operations like addition, subtraction, multiplication, and division. These expressions can be combined with conditional expressions to create more complex conditional statements. The available arithmetic operators are +, -, *, and /. The syntax for using the arithmetic operators is as follows:

```
<Any> + <Any>
<Any> - <Any>
<Any> * <Any>
<Any> / <Any>
```

The following are example arithmetic expressions: 

```
/value + length(/message)
/bytes / 1024
/value1 - /value2
/TimeInSeconds * 1000
```
{% include copy.html %}

The following are some example arithmetic expressions used in conditional expressions : 

```
/value + length(/message) > 200
/bytes / 1024 < 10
/value1 - /value2 != /value3 + /value4
```
{% include copy.html %}

### String concatenation expressions

String concatenation expressions enable you to combine strings to create new strings. These concatenated strings can also be used within conditional expressions. The syntax for using string concatenation is as follows:

```
<String Variable or String Literal> + <String Variable or String Literal>
```

The following are example string concatenation expressions:

```
/name + "suffix"
"prefix" + /name
"time of " + /timeInMs + " ms"
```
{% include copy.html %}

The following are example string concatenation expressions that can be used in conditional expressions:

```
/service + ".com" == /url
"www." + /service != /url
```
{% include copy.html %}

### Reserved symbols

Certain symbols, such as ^, %, xor, =, +=, -=, *=, /=, %=, ++, --, and ${<text>}, are reserved for future functionality or extensions. Reserved symbols include `^`, `%`, `xor`, `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `++`, `--`, and `${<text>}`.

## Syntax components

Syntax components are the building blocks of expressions in Data Prepper. They allow you to define sets, specify evaluation order, reference values within events, use literal values, and follow specific white space rules. Understanding these components is crucial for creating and working with expressions effectively in Data Prepper pipelines.

### Priority expressions

Priority expressions specify the evaluation order of expressions. They are enclosed in parentheses `()`. Priority expressions must contain an expression or value (empty parentheses are not supported). The following is an example priority expression:

```
/is_cool == (/name == "Steven")
```
{% include copy.html %}

### JSON pointers

JSON pointers are used to reference values within an event. They start with a leading forward slash `/` followed by alphanumeric characters or underscores that are separated by additional forward slashes `/`. 

JSON pointers can use an extended character set by wrapping the entire pointer in double quotation marks `""` and escaping characters using a backslash `\`. Note that the `~` and `/` characters are considered to be part of the pointer path and do not need to be escaped. The following are some examples of valid JSON pointers: `~0` to represent the literal character `~` or `~1` to represent the literal character `/`.

#### Shorthand syntax

The shorthand syntax for a JSON pointer can be expressed using the following regular expression pattern, where `\w` represents any word character (A--Z, a-z, 0--9, or underscore):

```
/\w+(/\w+)*`
```
{% include copy.html %}
 

The following is an example of this shorthand syntax:

```
/Hello/World/0
```
{% include copy.html %}

#### Escaped syntax

The escaped syntax for a JSON pointer can be expressed as follows:

```
"/<Valid String Characters | Escaped Character>(/<Valid String Characters | Escaped Character>)*"
```
{% include copy.html %}

The following is an example of an escaped JSON pointer:

```
# Path
# { "Hello - 'world/" : [{ "\"JsonPointer\"": true }] }
"/Hello - 'world\//0/\"JsonPointer\""
```
{% include copy.html %}

### Literals

Literals are fundamental values that have no children. Data Prepper supports the following literal types: 

- **Float:** Supports values from 3.40282347 x 10^38 to 1.40239846 x 10^-45.
- **Integer:** Supports values from -2,147,483,648 to 2,147,483,647.
- **Boolean:** Supports `true` or `false`.
- **JSON pointer:** See [JSON pointers](#json-pointers) for more information.
- **String:** Supports valid Java strings.
- **Null:** Supports `null` to check if a JSON pointer exists.

### White space rules

White space is optional around relational operators, regex equality operators, equality operators, and commas. White space is required around set initializers, priority expressions, set operators, and conditional expressions.

| Operator             | Description              | White space required | ✅ Valid examples                                               | ❌ Invalid examples                    |
|----------------------|--------------------------|----------------------|----------------------------------------------------------------|---------------------------------------|
| `{}`                 | Set initializer          | Yes                  | `/status in {200}`                                             | `/status in{200}`                     |
| `()`                 | Priority expression      | Yes                  | `/a==(/b==200)`<br>`/a in ({200})`                             | `/status in({200})`                   |
| `in`, `not in`       | Set operators            | Yes                  | `/a in {200}`<br>`/a not in {400}`                             | `/a in{200, 202}`<br>`/a not in{400}` |
| `<`, `<=`, `>`, `>=` | Relational operators     | No                   | `/status < 300`<br>`/status>=300`                              |                                       |
| `+`                  | String concatenation operator   | No                   | `/status_code + /message + "suffix"`
| `+`, `-`             | Arithmetic addition and subtraction operators | No      | `/status_code + length(/message) - 2`
| `*`, `/`             | Multiplication and division operators | No              | `/status_code * length(/message) / 3`
| `=~`, `!~`           | Regex equality operators | No                   | `/msg =~ "^\w*$"`<br>`/msg=~"^\w*$"`                           |                                       |
| `==`, `!=`           | Equality operators       | No                   | `/status == 200`<br>`/status_code==200`                        |                                       |
| `and`, `or`, `not`   | Conditional operators    | Yes                  | `/a<300 and /b>200`                                            | `/b<300and/b>200`                     |
| `,`                  | Set value delimiter      | No                   | `/a in {200, 202}`<br>`/a in {200,202}`<br>`/a in {200 , 202}` | `/a in {200,}`                        |
| `typeof`             | Type check operator      | Yes                   | `/a typeof integer`<br>`/a typeof long`<br>`/a typeof string`<br> `/a typeof double`<br> `/a typeof boolean`<br>`/a typeof map`<br>`/a typeof array` |`/a typeof /b`<br>`/a typeof 2`                      |

## Related documentation

- [Functions]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/functions/)
