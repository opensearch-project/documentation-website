---
layout: default
title: Expression syntax
parent: Pipelines
nav_order: 15
---

# Expression syntax  

Expressions provide flexibility in data manipulation, filtering, and routing in Data Prepper. The following sections provide information about expression syntax in Data Prepper.

## Key terms

The following key terms are used in the context of expressions:

Term | Definition
-----|-----------
**Expression** | A generic component that contains a primary or an operator. Expressions can be nested withing other expressions. An expression's imminent children can contain 0–1 operators.
**Expression string** | The highest priority in a Data Prepper expression and supports only one expression string that results in a return value. An expression string is not the same as an expression.
**Literal** | A fundamental value that has no children. A literal can be one of the following: float, integer, Boolean, JSON pointer, string, or null. See [Literals](#literals).
**Operator** | A hardcoded token that identifies the operation used in an expression.
**Primary** | Can be one of the following: set initializer, priority expression, or literal.
**Statement** | The highest-priority component within an expression string.

## Operators

The following table lists the supported operators. Operators are listed in order of precedence (top to bottom, left to right).

| Operator             | Description                                           | Associativity |
|----------------------|-------------------------------------------------------|---------------|
| `()`                 | Priority expression                                   | left-to-right |
| `not`<br> `+`<br>  `-`| Unary logical NOT<br>Unary positive<br>Unary negative | right-to-left |
| `<`, `<=`, `>`, `>=` | Relational operators                                  | left-to-right |
| `==`, `!=`           | Equality operators                                    | left-to-right |
| `and`, `or`          | Conditional expression                                | left-to-right |

### Relational operators

Relational operators compare numeric values or JSON pointers that resolve to numeric values. The operators are used to test the relationship between two operands, determining if one is greater than, less than or equal to the other. The syntax for using relational operators is as follows:

```
<Number | JSON Pointer> < <Number | JSON Pointer>
<Number | JSON Pointer> <= <Number | JSON Pointer>
<Number | JSON Pointer> > <Number | JSON Pointer>
<Number | JSON Pointer> >= <Number | JSON Pointer>
```

For example, to check if the vlaue of the `status_code` field in an event is within the range of successful HTTTP responses (200 to 299), you can use the following expression:

```
/status_code >= 200 and /status_code < 300
```

### Equality operators

Equality operators are used to test whether two values are equivalent. These operators compare values of any type, including JSON pointers, literals, and expressions. The syntax for using equality operators is as follows: 

```
<Any> == <Any>
<Any> != <Any>
```

Here are some examples of using equality operators:

- `/is_cool == true`: Checks if the value referenced by the JSON pointer is equal to the Boolean value.
- `3.14 != /status_code`: Checks if the numeric value is not equal to the value referenced by the JSON pointer.
- `{1, 2} == /event/set_property`: Checks is the array is equal to the value referenced by the JSON pointer. 

### Conditional expressions

Conditional expressions allow you to combine multiple expressions or values using logical operators to create more complex evaluation criteria. The available conditional operators are `and`, `or`, and `not`. The syntax for using these conditional operators is as follows:

```
<Any> and <Any>
<Any> or <Any>
not <Any>
```

The following are examples of using conditional expressions: 

```
/status_code == 200 and /message == "Hello world"
/status_code == 200 or /status_code == 202
not /status_code in {200, 202}
/response == null
/response != null
```

### Reserved symbols

Reserved symbols refer to a set of symbols that are not currently used in the expression syntax but are reserved for possible future functionality or extensions. The reserved symbols include `^`, `*`, `/`, `%`, `+`, `-`, `xor`, `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `++`, `--`, and `${<text>}`.

## Syntax components

Syntax components are the building blocks of expressions in Data Prepper. They allow you to define sets, specify evaluation order, reference values within events, use literal values, and follow specific white space rules. Understanding these components is crucial for creating and working with expressions effectively in Data Prepper pipelines.

### Set initializers

Set initializers define sets or terms and expressions. They are enclosed in curly brackets `{}`. Set initializer syntax examples include:

- HTTP status codes: `{200, 201, 202}`
-  HTTP response payloads: `{"Created", "Accepted"}`
- Multiple event types with different keys: `{/request_payload, /request_message}`

### Priority expressions

Priority expressions specify the order of evaluation of expressions. They are enclosed in parentheses `()`. Priority expressions must contain an expression or value (empty parentheses are not supported). The following is an example:

```
/is_cool == (/name == "Steven")
```

### JSON pointers

JSON pointers are used to reference values within an event. They start with a leading forward slash `/` followed by alphanumeric characters or underscores, separated by additional forward slashes `/`. 

JSON pointers can use an extended character set by wrapping the entire pointer in double quotes `""` and escaping characters using the backslash `\`. Note that the `~` and `/` characters are considered part of the pointer path and do not need to be escaped. Here are some examples of valid JSON pointers: `~0` to represent the literal character `~` or `~1` to represent the literal character `/`.

#### Shorthand syntax

The shorthand syntax for a JSON pointer can be expressed using the following regular expression pattern:

```
/\w+(/\w+)*`
``` 
 
 Where `\w` represents any word character (A--Z, a-z, 0--9, or underscore).

Here is an example of this shorthand syntax:

```
/Hello/World/0
```

#### Escaped syntax

The escaped syntax for a JSON pointer can be expressed as follows:

```
"/<Valid String Characters | Escaped Character>(/<Valid String Characters | Escaped Character>)*"
```

Here is an example of an escaped JSON pointer:

```
# Path
# { "Hello - 'world/" : [{ "\"JsonPointer\"": true }] }
"/Hello - 'world\//0/\"JsonPointer\""
```

### Literals

Literals are fundamental values that have no children. Data Prepper supports the following literal types: 

- **Float:** Supports values from 3.40282347 x 10^38 to 1.40239846 x 10^-45.
- **Integer:** Supports values from -2,147,483,648 to 2,147,483,647.
- **Boolean:** Supports `true` or `false`.
- **JSON pointer:** See [JSON pointers](#json-pointers) for details.
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
| `=~`, `!~`           | Regex equality pperators | No                   | `/msg =~ "^\w*$"`<br>`/msg=~"^\w*$"`                           |                                       |
| `==`, `!=`           | Equality operators       | No                   | `/status == 200`<br>`/status_code==200`                        |                                       |
| `and`, `or`, `not`   | Conditional operators    | Yes                  | `/a<300 and /b>200`                                            | `/b<300and/b>200`                     |
| `,`                  | Set value delimiter      | No                   | `/a in {200, 202}`<br>`/a in {200,202}`<br>`/a in {200 , 202}` | `/a in {200,}`                        |

## Functions

Data Prepper supports the following built-in functions that can be used in an expression.

Function | Definition
---------|-----------
`length()` | Takes one argument of the JSON pointer type and returns the length of the value passed. For example, `length(/message)` returns a length of `10` when a key message exists in the event and has a value of `1234567890`.
`hasTags()` | Takes one or more string type arguments and returns `true` if all of the arguments passed are present in an event's tags. When an argument does not exist in the event's tags, the function returns `false`. For example, if you use the expression `hasTags("tag1")` and the event contains `tag1`, Data Prepper returns `true`. If you use the expression `hasTags("tag2")` but the event only contains `tag1`, Data Prepper returns `false`.
`getMetadata()` | Takes one literal string argument to look up specific keys in a an event's metadata. If the key contains a `/`, then the function looks up the metadata recursively. When passed, the expression returns the value corresponding to the key. The value returned can be of any type. For example, if the metadata contains `{"key1": "value2", "key2": 10}`, then the function, `getMetadata("key1")`, returns `value2`. The function, `getMetadata("key2")`, returns 10.
`contains()` | Takes two string arguments and determines whether either a literal string or a JSON pointer is contained within an event. When the second argument contains a substring of the first argument, such as `contains("abcde", "abcd")`, the function returns `true`. If the second argument does not contain any substrings, such as `contains("abcde", "xyz")`, it returns `false`.
`cidrContains()` | Takes two or more arguments. The first argument is a JSON pointer, which represents the key to the IP address that is checked. It supports both IPv4 and IPv6 addresses. Every argument that comes after the key is a string type that represents CIDR blocks that are checked against.If the IP address in the first argument is in the range of any of the given CIDR blocks, the function returns `true`. If the IP address is not in the range of the CIDR blocks, the function returns `false`. For example, `cidrContains(/sourceIp,"192.0.2.0/24","10.0.1.0/16")` will return `true` if the `sourceIp` field indicated in the JSON pointer has a value of `192.0.2.5`.
`join()`| Joins elements of a list to form a string. The function takes a JSON pointer, which represents the key to a list or a map where values are of the list type, and joins the lists as strings using commas (`,`), the default delimiter between strings. If `{"source": [1, 2, 3]}` is the input data, for example,`{"source": {"key1": [1, 2, 3], "key2": ["a", "b", "c"]}}`. Then `join(/source)` will return `"1,2,3"` in the following format: `{"key1": "1,2,3", "key2": "a,b,c"}`. You can also specify a delimiter other than the default inside the expression, for example, `join("-", /source)` joins each `source` field using a hyphen as the delimiter.
