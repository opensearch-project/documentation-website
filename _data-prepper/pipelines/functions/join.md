---
layout: default
title: join()
parent: Functions
grand_parent: Pipelines
nav_order: 25
redirect_from: 
   - /data-prepper/pipelines/join/
---

# join()


The `join()` function joins elements of a list to form a string. The function takes a JSON pointer, which represents the key to a list or map where values are of the list type, and joins the lists as strings using commas `,`. Commas are the default delimiter between strings.

If `{"source": [1, 2, 3]}` is the input data, as in `{"source": {"key1": [1, 2, 3], "key2": ["a", "b", "c"]}}`, then `join(/source)` returns `"1,2,3"` in the following format: `{"key1": "1,2,3", "key2": "a,b,c"}`.

You can specify an alternative delimiter inside the expression. For example, `join("-", /source)` joins each source field using a hyphen `-` as the delimiter.
