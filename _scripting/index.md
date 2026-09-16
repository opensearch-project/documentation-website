---
layout: default
title: Scripting
nav_order: 1
nav_exclude: true
has_toc: false
has_children: true
permalink: /scripting/
---

# Scripting

A _script_ is a custom expression that OpenSearch evaluates at request time. Scripts extend the API wherever a fixed query, mapping, or aggregation cannot express the logic you need, such as returning a computed field with each search result, ranking documents by a formula that combines a relevance score with a field value, or modifying documents during an update.

Scripts run inside OpenSearch, close to the data, so you do not need to retrieve documents, transform them in your application, and index them again. This speed comes with a trade-off: a search or aggregation script runs once for every document that OpenSearch considers, so a slow script on a large index multiplies into a slow request.

The default scripting language is [Painless]({{site.url}}{{site.baseurl}}/scripting/painless/). Wherever a script is accepted, the `lang` field selects the language, so you can choose a different one for a specific request.

The examples in this section run against a single index of product records, so you can create it once and follow along from any page. For the mapping and the sample documents, see [Test setup]({{site.url}}{{site.baseurl}}/scripting/using-scripts/#test-setup).

## Available languages

Every language in the following table is sandboxed and available in default OpenSearch distributions. Painless is the only one that runs in every script context; each of the others handles a single task.

Language | Purpose
:--- | :---
[`painless`]({{site.url}}{{site.baseurl}}/scripting/painless/) | General-purpose scripting, in any context.
[`expression`]({{site.url}}{{site.baseurl}}/scripting/expressions/) | Numeric ranking and sorting.
[`mustache`]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-template/) | Search templates.
`knn` | Exact k-NN search. The `knn` language accepts no code of its own. Its `source` must be the literal string `knn_score`, and the field and query vector are supplied in `params`. For the full request, see [Exact k-NN search with a scoring script]({{site.url}}{{site.baseurl}}/vector-search/vector-search-techniques/knn-score-script/).

To view the languages your cluster supports and the contexts in which each one can run, use the [Get Script Languages API]({{site.url}}{{site.baseurl}}/api-reference/script-apis/get-script-language/). That response can list languages beyond the preceding table, because a plugin can register a language for its own internal use. For what each context provides, see [Script contexts]({{site.url}}{{site.baseurl}}/scripting/script-contexts/).

A sandboxed language limits a script to an allow list of Java classes and methods that excludes file access, network access, thread creation, and reflection. The allow list limits the damage a hostile script can do, and it does not make a script from an untrusted source safe to run. Before you accept scripts from a source you do not control, see [Script security]({{site.url}}{{site.baseurl}}/scripting/script-security/).
{: .warning}

## Next steps

To write your first script, work through the following pages in order:

1. [How to use scripts]({{site.url}}{{site.baseurl}}/scripting/using-scripts/) introduces the `script` object, shows how to run an inline script and store one for reuse, and creates the index that the examples in this section use.
2. [Accessing document fields in scripts]({{site.url}}{{site.baseurl}}/scripting/accessing-fields/) explains how a script reads document data and which access path to choose for each task.
3. [Painless scripting language]({{site.url}}{{site.baseurl}}/scripting/painless/) describes the default language and links to a full syntax reference.
4. [Script security]({{site.url}}{{site.baseurl}}/scripting/script-security/) describes the settings that restrict which scripts your cluster accepts. Apply them before you let clients submit scripts.
