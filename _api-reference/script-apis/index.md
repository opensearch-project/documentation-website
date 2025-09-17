---
layout: default
title: Script APIs
has_children: true
has_toc: false
nav_order: 70
redirect_from:
  - /opensearch/rest-api/script-apis/
  - /api-reference/script-apis/
---

# Script APIs
**Introduced 1.0**
{: .label .label-purple }

The script APIs allow you to work with both stored and inline scripts in OpenSearch. The default scripting language is Painless.

## Types of scripts

OpenSearch supports two types of scripts:

- **Inline scripts**: Scripts defined directly within API requests. They are compiled each time they are executed.
- **Stored scripts**: Precompiled scripts saved in the cluster state that can be reused across multiple requests. They reduce compilation time and enhance search speed.


## Script API operations

OpenSearch supports the following script API operations.

### Inline script operations

Execute scripts directly without saving them to the cluster state:

- [Execute inline script]({{site.url}}{{site.baseurl}}/api-reference/script-apis/exec-script/)

### Stored script operations

Manage precompiled scripts saved in the cluster state:

- [Create or update stored script]({{site.url}}{{site.baseurl}}/api-reference/script-apis/create-stored-script/)
- [Execute stored script]({{site.url}}{{site.baseurl}}/api-reference/script-apis/exec-stored-script/) 
- [Get stored script]({{site.url}}{{site.baseurl}}/api-reference/script-apis/get-stored-script/)
- [Delete stored script]({{site.url}}{{site.baseurl}}/api-reference/script-apis/delete-script/)

### Script information

Get information about available script contexts and languages:

- [Get script contexts]({{site.url}}{{site.baseurl}}/api-reference/script-apis/get-script-contexts/) - List available contexts for stored scripts
- [Get script languages]({{site.url}}{{site.baseurl}}/api-reference/script-apis/get-script-language/) - List supported scripting languages
