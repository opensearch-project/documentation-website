---
layout: default
title: getEventType()
parent: Functions
grand_parent: Pipelines
nav_order: 5
---

# startsWith()

The `startsWith()` function is used to check if a string starts with the given string. It takes two arguments:

- The first argument is either a literal string or a JSON pointer that represents the field or value to be checked.

- The second argument is the string to be checked in the first argument.
The function returns `true` if the string or field value represented by the first argument starts with the string specified in the second argument. It returns `false` if it is not.

For example, if you want to check if the value of a field name `message` starts with a string `"abcd"`, you can use the `startsWith()` function as follows:
```
startsWith('/message', 'abcd')
```
{% include copy-curl.html %}

This will return `true` if the field `message` starts with the string `abcd` or `false` if it does not.

Alternatively, you can also use a literal string as the first argument:
```
startsWith('abcdef', 'abcd')
```
{% include copy-curl.html %}

In this case, the function will return `true` because the string `abcdef` starts with `abcd`.

Note that the `startsWith()` function performs a case-sensitive check.
