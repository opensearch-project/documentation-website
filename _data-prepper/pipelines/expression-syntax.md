---
layout: default
title: Expression syntax
parent: Pipelines
nav_order: 15
---

# Expression syntax 

Expressions provide flexibility in data manipulation, filtering, and routing in Data Prepper. The following sections provide detailed information about the expression syntax used in Data Prepper.

## Supported operators

Operators are listed in order of precedence (top to bottom, left to right).

| Operator             | Description                                           | Associativity |
|----------------------|-------------------------------------------------------|---------------|
| `()`                 | Priority Expression                                   | left-to-right |
| `not`<br> `+`<br>  `-`| Unary Logical NOT<br>Unary Positive<br>Unary negative | right-to-left |
| `<`, `<=`, `>`, `>=` | Relational Operators                                  | left-to-right |
| `==`, `!=`           | Equality Operators                                    | left-to-right |
| `and`, `or`          | Conditional Expression                                | left-to-right |

## Reserved for possible future functionality

The reserved symbol sets include the following: `^`, `*`, `/`, `%`, `+`, `-`, `xor`, `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `++`, `--`, `${<text>}`

## Set initializer

The set initializer defines a set or term and expressions. Set initializer syntax examples include the following:

#### HTTP status codes

```
{200, 201, 202}
```

#### HTTP response payloads

```
{"Created", "Accepted"}
```

#### Multiple event types with different keys

```
{/request_payload, /request_message}
```

## Priority expression

A priority expression identifies an expression that will be evaluated at the highest priority level. A priority expression must contain an expression or value. Empty parentheses are not supported. A priority expression is shown in the following example:

```
/is_cool == (/name == "Steven")
```

## Relational operators

Relational operators are used to test the relationship of two numeric values. The operands must be numbers or JSON pointers that resolve to numbers. The following example shows the syntax for relational operators. 

#### Syntax

```
<Number | JSON Pointer> < <Number | JSON Pointer>
<Number | JSON Pointer> <= <Number | JSON Pointer>
<Number | JSON Pointer> > <Number | JSON Pointer>
<Number | JSON Pointer> >= <Number | JSON Pointer>
```

#### Example relational operator

The following is an example relational operator: 

```
/status_code >= 200 and /status_code < 300
```

## Equality operators

Equality operators are used to test whether two values are equivalent. The following example shows the syntax for equality operators. 

#### Syntax 

```
<Any> == <Any>
<Any> != <Any>
```

#### Example equality operator

The following is an example equality operator:

```
/is_cool == true
3.14 != /status_code
{1, 2} == /event/set_property
```

### Using equality operators to check for JSON pointers 

Equality operators can be used to check whether a JSON pointer exists by comparing the value with `null`. The following example shows the syntax:

```
<JSON Pointer> == null
<JSON Pointer> != null
null == <JSON Pointer>
null != <JSON Pointer>
```

#### Example equality operator checking for JSON pointers

The following is an example of an equality operator checking for JSON pointers:

```
/response == null
null != /response
```

## Conditional expressions

A conditional expression is used to chain together multiple expressions and/or values. The following example shows the syntax:

#### Syntax

```
<Any> and <Any>
<Any> or <Any>
not <Any>
```

#### Example conditional expression

The following is an example of a conditional expression:  

```
/status_code == 200 and /message == "Hello world"
/status_code == 200 or /status_code == 202
not /status_code in {200, 202}
/response == null
/response != null
```

## Key terms

To effectively understand and work with the expression syntax in Data Prepper pipelines, it's necessary to understadn the following key terms and their definitions. 

**Expression:** A generic component that contains a _Primary_ or an _Operator_. Expressions may contain expressions. An expression's imminent children can contain 0–1 _Operators_.

**Expression string:** Takes the highest priority in a Data Prepper expression and only supports one expression string resulting in a return value. An _expression string_ is not the same as an _expression_.

**JSON pointer:** A literal used to reference a value within an event and provided as context for an _expression string_. JSON pointers are identified by a leading `/` containing alphanumeric characters or underscores, delimited by `/`. JSON pointers can use an extended character set if wrapped in double quotes (`"`) using the escape character `\`. JSON pointers require `~` and `/` characters, which should be used as part of the path and not as a delimiter that needs to be escaped. The following are examples of JSON pointers:

- `~0` representing `~`
- `~1` representing `/`

#### Shorthand syntax (Regex, `\w` = `[A-Za-z_]`)

```
/\w+(/\w+)*
```

#### Example shorthand

```
/Hello/World/0
```

#### Example escaped syntax

```
"/<Valid String Characters | Escaped Character>(/<Valid String Characters | Escaped Character>)*"
```

#### Example escaped JSON pointer

```
# Path
# { "Hello - 'world/" : [{ "\"JsonPointer\"": true }] }
"/Hello - 'world\//0/\"JsonPointer\""
```

**Literal:** A literal is a fundamental value that has no children. The values include the following:
- Float: Supports values from 3.40282347 &times; 10<sup>38</sup> to 1.40239846 &times; 10<sup>&minus;45</sup>.
- Integer: Supports values from &minus;2,147,483,648 to 2,147,483,647.
- Boolean: Supports true or false.
- JSON pointer: See [JSON pointer](#json-pointer).
- String: Supports valid Java strings.
- Null: Supports null check to see if a JSON pointer exists.

**Primary:** _Set_, _Priority Expression_, _Literal_

**Statement:** The highest-priority component of an expression string.

**Operator:** A hardcoded token that identifies the operation used in an _expression_.

**White space:** White space is **optional** surrounding relational operators, regex equality operators, equality operators, and commas. White space is **required** surrounding set initializers, priority expressions, set operators, and conditional expressions.

| Operator             | Description              | White space required | ✅ Valid examples                                               | ❌ Invalid examples                 |
|----------------------|--------------------------|----------------------|----------------------------------------------------------------|---------------------------------------|
| `{}`                 | Set initializer          | Yes                  | `/status in {200}`                                             | `/status in{200}`                     |
| `()`                 | Priority expression      | Yes                  | `/a==(/b==200)`<br>`/a in ({200})`                             | `/status in({200})`                   |
| `in`, `not in`       | Set operators            | Yes                  | `/a in {200}`<br>`/a not in {400}`                             | `/a in{200, 202}`<br>`/a not in{400}` |
| `<`, `<=`, `>`, `>=` | Relational operators     | No                   | `/status < 300`<br>`/status>=300`                              |                                       |
| `=~`, `!~`           | Regex equality pperators | No                   | `/msg =~ "^\w*$"`<br>`/msg=~"^\w*$"`                           |                                       |
| `==`, `!=`           | Equality operators       | No                   | `/status == 200`<br>`/status_code==200`                        |                                       |
| `and`, `or`, `not`   | Conditional operators    | Yes                  | `/a<300 and /b>200`                                            | `/b<300and/b>200`                     |
| `,`                  | Set value delimiter      | No                   | `/a in {200, 202}`<br>`/a in {200,202}`<br>`/a in {200 , 202}` | `/a in {200,}`                        |

## Functions

The following table lists the built-in functions that can be used in an expression.

| Function | Description |
|----------|-------------|
| `length()` | The `length()` function takes one argument of the JSON pointer type and returns the length of the value passed. For example, `length(/message)` returns a length of `10` when a key message exists in the event and has a value of `1234567890`. |
| `hasTags()` | The `hastags()` function takes one or more string type arguments and returns `true` if all the arguments passed are present in an event's tags. When an argument does not exist in the event's tags, the function returns `false`. For example, if you use the expression `hasTags("tag1")` and the event contains `tag1`, Data Prepper returns `true`. If you use the expression `hasTags("tag2")` but the event only contains a `tag1` tag, Data Prepper returns `false`.
| `getMetadata()` | The `getMetadata()` function takes one literal string argument to look up specific keys in a an event's metadata. If the key contains a `/`, then the function looks up the metadata recursively. When passed, the expression returns the value corresponding to the key. The value returned can be of any type. For example, if the metadata contains `{"key1": "value2", "key2": 10}`, then the function, `getMetadata("key1")`, returns `value2`. The function, `getMetadata("key2")`, returns 10.
| `contains()` | The `contains()` function takes two string arguments and determines whether either a literal string or a JSON pointer is contained within an event. When the second argument contains a substring of the first argument, such as `contains("abcde", "abcd")`, the function returns `true`. If the second argument does not contain any substrings, such as `contains("abcde", "xyz")`, it returns `false`.
| `cidrContains()` | The `cidrContains()` function takes two or more arguments. The first argument is a JSON pointer, which represents the key to the IP address that is checked. It supports both IPv4 and IPv6 addresses. Every argument that comes after the key is a string type that represents CIDR blocks that are checked against. If the IP address in the first argument is in the range of any of the given CIDR blocks, the function returns `true`. If the IP address is not in the range of the CIDR blocks, the function returns `false`. For example, `cidrContains(/sourceIp,"192.0.2.0/24","10.0.1.0/16")` will return `true` if the `sourceIp` field indicated in the JSON pointer has a value of `192.0.2.5`.
