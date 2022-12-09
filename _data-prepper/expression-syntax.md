---
layout: default
title: Expression syntax
nav_order: 12
---

# Expression syntax 

This page discusses expression syntax.

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
Reserved symbol set: `^`, `*`, `/`, `%`, `+`, `-`, `xor`, `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `++`, `--`, `${<text>}`

## Set initializer

The set initializer defines a set or term and/or expressions.

### Examples

See the following examples of set initializer.

#### HTTP status codes
```
{200, 201, 202}
```
#### HTTP response payloads
```
{"Created", "Accepted"}
```

#### Handle multiple event types with different keys
```
{/request_payload, /request_message}
```

## Priority expression

Priority expression identifies an expression that will be evaluated at the highest priority level. Priority expression must contain an expression or value; empty parentheses are not supported.

### Example

```
/is_cool == (/name == "Steven")
```

## Relational operators
Relational operators are used to test the relationship of two numeric values. The operands must be numbers or JSON Pointers that resolve to numbers.

### Syntax
```
<Number | JSON Pointer> < <Number | JSON Pointer>
<Number | JSON Pointer> <= <Number | JSON Pointer>
<Number | JSON Pointer> > <Number | JSON Pointer>
<Number | JSON Pointer> >= <Number | JSON Pointer>
```

### Example
```
/status_code >= 200 and /status_code < 300
```

## Equality operators
Equality operators are used to test whether two values are equivalent.

### Syntax
```
<Any> == <Any>
<Any> != <Any>
```

### Examples
```
/is_cool == true
3.14 != /status_code
{1, 2} == /event/set_property
```
## Using equality operators to check for JSON Pointer 

Equality operators can also be used to check whether a JSON Pointer exists by comparing the JSON Pointer with `null`.

### Syntax
```
<JSON Pointer> == null
<JSON Pointer> != null
null == <JSON Pointer>
null != <JSON Pointer>
```

### Example
```
/response == null
null != /response
```

#### Conditional expression
Conditional expression is used to chain together multiple expressions and/or values.

#### Syntax
```
<Any> and <Any>
<Any> or <Any>
not <Any>
```

### Example
```
/status_code == 200 and /message == "Hello world"
/status_code == 200 or /status_code == 202
not /status_code in {200, 202}
/response == null
/response != null
```

## Definitions

The following terms related to expression syntax are defined below. 

### Literal
A literal is a fundamental value that has no children.
- Float: Supports values from 3.40282347 &times; 10<sup>38</sup> to 1.40239846 &times; 10<sup>&minus;45</sup>.
- Integer: Supports values from &minus;2,147,483,648 to 2,147,483,647.
- Boolean: Supports true or false.
- JSON Pointer: See the [JSON Pointer](#json-pointer) section below for details.
- String: Supports valid Java strings.
- Null: Supports null check to see whether a JSON pointer exists.

### Expression string
Expression string is the highest-priority in a Data Prepper expression and only supports one expression string resulting in a return value. An _expression string_ is not the same as an _expression_.

### Statement
The highest-priority component of the expression string.

### Expression
A generic component that contains a _Primary_ or an _Operator_. Expressions may contain expressions. An expressions imminent children can contains 0-1 _Operators_.

### Primary

- _Set_
- _Priority Expression_
- _Literal_

### Operator
Hardcoded token that identifies the operation used in an _expression_.

### JSON pointer
JSON Pointer is a literal used to reference a value within the event and provided as context for the _Expression string_. JSON Pointers are identified by a 
leading `/` containing alphanumeric character or underscores, delimited by `/`. JSON Pointers can use an extended character set if wrapped 
in double quotes (`"`) using the escape character `\`. Note that JSON Pointers require `~` and `/` characters, which should be used as part of the path and not a delimiter needs to be escaped.

See the following examples of JSON pointers:

- `~0` representing `~`
- `~1` representing `/`

#### Shorthand syntax (Regex, `\w` = `[A-Za-z_]`)
```
/\w+(/\w+)*
```

#### Shorthand example

See the following example of shorthand.

```
/Hello/World/0
```

#### Escaped syntax example

See the following example of escaped syntax.
```
"/<Valid String Characters | Escaped Character>(/<Valid String Characters | Escaped Character>)*"
```

#### Escaped example
```
# Path
# { "Hello - 'world/" : [{ "\"JsonPointer\"": true }] }
"/Hello - 'world\//0/\"JsonPointer\""
```

## White space
### Operators
White space is **optional** surrounding relational operators, regex equality operators, equality operators, and commas.
White space is **required** surrounding set initializers, priority expressions, set operators, and conditional expressions.

### Reference table

| Operator             | Description              | White space Required | ✅ Valid examples                                               | ❌ Invalid examples                    |
|----------------------|--------------------------|----------------------|----------------------------------------------------------------|---------------------------------------|
| `{}`                 | Set Initializer          | Yes                  | `/status in {200}`                                             | `/status in{200}`                     |
| `()`                 | Priority Expression      | Yes                  | `/a==(/b==200)`<br>`/a in ({200})`                             | `/status in({200})`                   |
| `in`, `not in`       | Set Operators            | Yes                  | `/a in {200}`<br>`/a not in {400}`                             | `/a in{200, 202}`<br>`/a not in{400}` |
| `<`, `<=`, `>`, `>=` | Relational Operators     | No                   | `/status < 300`<br>`/status>=300`                              |                                       |
| `=~`, `!~`           | Regex Equality Operators | No                   | `/msg =~ "^\w*$"`<br>`/msg=~"^\w*$"`                           |                                       |
| `==`, `!=`           | Equality Operators       | No                   | `/status == 200`<br>`/status_code==200`                        |                                       |
| `and`, `or`, `not`   | Conditional Operators    | Yes                  | `/a<300 and /b>200`                                            | `/b<300and/b>200`                     |
| `,`                  | Set Value Delimiter      | No                   | `/a in {200, 202}`<br>`/a in {200,202}`<br>`/a in {200 , 202}` | `/a in {200,}`                        |
