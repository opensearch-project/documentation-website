---
layout: default
title: contains()
parent: Functions
grand_parent: Pipelines
nav_order: 10
redirect_from: 
   - /data-prepper/pipelines/contains/
---

# contains()

The `contains()` function is used to check if a substring exists within a given string or the value of a field in an event. It takes two arguments:

- The first argument is either a literal string or a JSON pointer that represents the field or value to be searched.

- The second argument is the substring to be searched for within the first argument.
The function returns `true` if the substring specified in the second argument is found within the string or field value represented by the first argument. It returns `false` if it is not.

For example, if you want to check if the string `"abcd"` is contained within the value of a field named `message`, you can use the `contains()` function as follows:

```
contains('/message', 'abcd')
```
{% include copy-curl.html %}

This will return `true` if the field `message` contains the substring `abcd` or `false` if it does not.

Alternatively, you can also use a literal string as the first argument:

```
contains('This is a test message', 'test')
```
{% include copy-curl.html %}

In this case, the function will return `true` because the substring `test` is present within the string `This is a test message`.

Note that the `contains()` function performs a case-sensitive search by default. If you need to perform a case-insensitive search, you can use the `containsIgnoreCase()` function instead.
