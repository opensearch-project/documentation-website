---
layout: default
title: Expression syntax
nav_order: 12
---

# Expression syntax 

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
Defines a set or term and/or expressions.

### Examples

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
Identifies an expression that will be evaluated at the highest priority level. Priority expression must contain an
expression or value, empty parentheses are not supported.

### Examples

```
/is_cool == (/name == "Steven")
```

## Relational operators
Tests the relationship of two numeric values. The operands must be numbers or JSON pointers that resolve to numbers.

### Syntax
```
<Number | JSON Pointer> < <Number | JSON Pointer>
<Number | JSON Pointer> <= <Number | JSON Pointer>
<Number | JSON Pointer> > <Number | JSON Pointer>
<Number | JSON Pointer> >= <Number | JSON Pointer>
```

### Examples
```
/status_code >= 200 and /status_code < 300
```

## Equality operators
Used to test whether two values are equivalent.

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
## Using equality operators to check JSON pointer 

Equality operators can also be used to check whether a JSON Pointer exists by comparing with `null`.

### Syntax
```
<JSON Pointer> == null
<JSON Pointer> != null
null == <JSON Pointer>
null != <JSON Pointer>
```

### Examples
```
/response == null
null != /response
```

#### Conditional expression
Used to chain together multiple expressions and/or values.

#### Syntax
```
<Any> and <Any>
<Any> or <Any>
not <Any>
```

### Examples
```
/status_code == 200 and /message == "Hello world"
/status_code == 200 or /status_code == 202
not /status_code in {200, 202}
/response == null
/response != null
```

## Definitions

### Literal
A fundamental value that has no children.
- Float _(Supports values from 3.40282347 &times; 10<sup>38</sup> to 1.40239846 &times; 10<sup>&minus;45)</sup>_
- Integer _(Supports values from &minus;2,147,483,648 to 2,147,483,647)_
- Boolean _(Supports true or false)_
- JSON Pointer _(See JSON Pointer section for details)_
- String _(Supports valid Java strings)_
- Null _(Supports null check to see whether a JSON pointer exists)_

### Expression string
The string that will be parsed for evaluation. Expression string is the highest level of a Data Prepper expression. Only supports one expression string resulting in a return value. An _expression string_ is not the same as an _expression_.

### Statement
The highest level component of the expression string.

### Expression
A generic component that contains a _Primary_ or an _Operator_. Expressions may contain expressions. An expressions imminent children can contains 0-1 _Operators_.

### Primary

- _Set_
- _Priority Expression_
- _Literal_

### Operator
Hard coded token that identifies the operation used in an _expression_.

### JSON pointer
A Literal used to reference a value within the Event provided as context for the _Expression String_. JSON Pointers are identified by a 
leading `/` containing alphanumeric character or underscores, delimited by `/`. JSON Pointers can use an extended character set if wrapped 
in double quotes (`"`) using the escape character `\`. Note, JSON Pointer require `~` and `/` that should be used as part of the path and 
not a delimiter to be escaped.

- `~0` representing `~`
- `~1` representing `/`

#### Shorthand syntax (Regex, `\w` = `[A-Za-z_]`)
```
/\w+(/\w+)*
```

##### Shorthand example
```
/Hello/World/0
```

##### Escaped syntax example
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
White space is **optional** surrounding Relational Operators, Regex Equality Operators, Equality Operators and commas.
White space is **required** surrounding Set Initializers, Priority Expressions, Set Operators, and Conditional Expressions.

### Reference table

| Operator             | Description              | White Space Required | ✅ Valid Examples                                               | ❌ Invalid Examples                    |
|----------------------|--------------------------|----------------------|----------------------------------------------------------------|---------------------------------------|
| `{}`                 | Set Initializer          | Yes                  | `/status in {200}`                                             | `/status in{200}`                     |
| `()`                 | Priority Expression      | Yes                  | `/a==(/b==200)`<br>`/a in ({200})`                             | `/status in({200})`                   |
| `in`, `not in`       | Set Operators            | Yes                  | `/a in {200}`<br>`/a not in {400}`                             | `/a in{200, 202}`<br>`/a not in{400}` |
| `<`, `<=`, `>`, `>=` | Relational Operators     | No                   | `/status < 300`<br>`/status>=300`                              |                                       |
| `=~`, `!~`           | Regex Equality Operators | No                   | `/msg =~ "^\w*$"`<br>`/msg=~"^\w*$"`                           |                                       |
| `==`, `!=`           | Equality Operators       | No                   | `/status == 200`<br>`/status_code==200`                        |                                       |
| `and`, `or`, `not`   | Conditional Operators    | Yes                  | `/a<300 and /b>200`                                            | `/b<300and/b>200`                     |
| `,`                  | Set Value Delimiter      | No                   | `/a in {200, 202}`<br>`/a in {200,202}`<br>`/a in {200 , 202}` | `/a in {200,}`                        |
