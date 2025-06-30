---
layout: default
title: startsWith()
parent: Functions
grand_parent: Pipelines
nav_order: 40
---

# startsWith()

The `startsWith()` function checks whether a string starts with the given string. It takes two arguments:

- The first argument is either a literal string or a JSON pointer that represents the field or value to be checked.

- The second argument is the string to be checked in the first argument.
The function returns `true` if the string or field value represented by the first argument starts with the string specified in the second argument and `false` otherwise.

For example, to check whether the value of a field name `message` starts with a string `"abcd"`, use the `startsWith()` function as follows:

```
startsWith('/message', 'abcd')
```
{% include copy.html %}

This call returns `true` if the `message` field starts with the string `abcd` or `false` if it does not.

Alternatively, you can use a literal string as the first argument:

```
startsWith('abcdef', 'abcd')
```
{% include copy.html %}

In this case, the function returns `true` because the string `abcdef` starts with `abcd`.

The `startsWith()` function performs a case-sensitive check.
{: .note }
